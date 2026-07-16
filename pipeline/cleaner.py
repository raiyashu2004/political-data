#!/usr/bin/env python3
"""
cleaner.py: The Parliamentary Transcript Cleaning & Normalization Engine ("The Moat")

Handles messy, PDF-locked, multilingual, and OCR-corrupted parliamentary debate transcripts from
PRS Legislative Research and Sansad TV archives.

Core Capabilities:
1. OCR Artifact Removal: Reconstructs hyphenated line-wraps, removes page headers/footers, and strips OCR noise.
2. Procedural Noise Stripping: Isolates substantive speeches from procedural interruptions, table actions, and voting notes.
3. Multilingual & Terminology Normalization: Identifies Hindi/Devanagari/Romanized code-switching and maps parliamentary idioms.
4. Entity & Stance Extraction: Identifies key political entities, parties, and policy keywords.
"""

import re
import json

class ParliamentaryTranscriptCleaner:
    def __init__(self):
        # Common OCR noise patterns in Indian Parliamentary PDF scans
        self.header_footer_regex = re.compile(
            r'(?:LOK\s+SABHA\s+DEBATES|RAJYA\s+SABHA\s+DEBATES|Series\s+[IVXLCDM]+|Vol\.\s+[IVXLCDM]+|No\.\s+\d+|Page\s+\d+\s+of\s+\d+|\d{1,2}\.\d{1,2}\.\d{4})',
            re.IGNORECASE
        )
        self.hyphenated_word_regex = re.compile(r'([a-zA-Z]+)-\s*\n\s*([a-zA-Z]+)')
        
        # Procedural interruptions and stage directions
        self.procedural_regex = re.compile(
            r'\((?:Interruptions?|At this stage,?.*?came and stood.*?near the Table|The question was put and agreed to|The Bill was passed|An Hon\. Member|Shri.*?in the Chair|Spoke in Hindi|Spoke in Bengali|Spoke in Tamil)\)',
            re.IGNORECASE | re.DOTALL
        )
        
        # Standardized party name mapping from raw OCR variations
        self.party_map = {
            'bjp': 'BJP', 'bharatiya janata party': 'BJP',
            'inc': 'INC', 'indian national congress': 'INC', 'congress': 'INC',
            'tmc': 'TMC', 'trinamool congress': 'TMC', 'aitc': 'TMC',
            'dmk': 'DMK', 'dravida munnetra kazhagam': 'DMK',
            'sp': 'SP', 'samajwadi party': 'SP',
            'ysrcp': 'YSRCP', 'ysr congress': 'YSRCP',
            'aap': 'AAP', 'aam aadmi party': 'AAP',
            'bjd': 'BJD', 'biju janata dal': 'BJD',
            'cpim': 'CPI(M)', 'cpi(m)': 'CPI(M)', 'communist party of india (marxist)': 'CPI(M)',
            'jdu': 'JD(U)', 'janata dal (united)': 'JD(U)',
            'shiv sena': 'SHS', 'shs': 'SHS',
            'ncp': 'NCP', 'nationalist congress party': 'NCP',
            'rjd': 'RJD', 'rashtriya janata dal': 'RJD'
        }
        
        # Multilingual parliamentary terminology mapping (Hindi / Devanagari / Romanized -> Standardized English Tag)
        self.hindi_term_map = {
            'adhyaksh mahodaya': '[Hon. Speaker]',
            'sabhapati mahodaya': '[Hon. Chairperson]',
            'manya sadasya': '[Hon. Member]',
            'sarkar': 'Government',
            'vipaksh': 'Opposition Bench / Opposition',
            'vidheyak': 'Bill / Legislation',
            'kisan': 'Farmer / Agriculturalist',
            'suraksha': 'Security / Safety',
            'sansad': 'Parliament',
            'desh': 'Nation / Country',
            'mantri': 'Minister',
            'kanoon': 'Law / Act',
            'mehangai': 'Inflation / Price Rise',
            'berojgari': 'Unemployment'
        }

    def clean_text(self, raw_text: str) -> dict:
        """
        Performs comprehensive cleaning on raw OCR parliamentary speech text.
        Returns a dictionary containing clean text, extracted entities, and cleaning metrics (for the Moat Viewer).
        """
        original_length = len(raw_text)
        metrics = {
            "ocr_artifacts_removed": 0,
            "procedural_interruptions_removed": 0,
            "multilingual_terms_normalized": 0
        }
        
        # Step 1: Fix OCR line wrap hyphenation (e.g., "agri-\nculture" -> "agriculture")
        def dehyphenate(match):
            metrics["ocr_artifacts_removed"] += 1
            return match.group(1) + match.group(2)
        
        text = self.hyphenated_word_regex.sub(dehyphenate, raw_text)
        
        # Step 2: Remove PDF headers, footers, and page numbers
        headers_found = self.header_footer_regex.findall(text)
        metrics["ocr_artifacts_removed"] += len(headers_found)
        text = self.header_footer_regex.sub(' ', text)
        
        # Step 3: Strip procedural interruptions and table noise
        interruptions_found = self.procedural_regex.findall(text)
        metrics["procedural_interruptions_removed"] += len(interruptions_found)
        text = self.procedural_regex.sub(' [PROCEDURAL NOTE REMOVED] ', text)
        
        # Step 4: Multilingual terminology normalization
        for hindi_term, english_equiv in self.hindi_term_map.items():
            pattern = re.compile(r'\b' + re.escape(hindi_term) + r'\b', re.IGNORECASE)
            matches = pattern.findall(text)
            if matches:
                metrics["multilingual_terms_normalized"] += len(matches)
                text = pattern.sub(f"{english_equiv}", text)
                
        # Step 5: Clean whitespace and formatting
        text = re.sub(r'\s+', ' ', text).strip()
        text = re.sub(r'\s+([.,!?;:])', r'\1', text)
        
        # Calculate reduction and density
        cleaned_length = len(text)
        noise_reduction_pct = round((1 - (cleaned_length / max(1, original_length))) * 100, 1) if original_length > 0 else 0
        
        # Extract keywords for highlighting
        keywords = self.extract_key_terms(text)
        
        return {
            "raw_text": raw_text,
            "cleaned_text": text,
            "cleaning_metrics": {
                "original_characters": original_length,
                "cleaned_characters": cleaned_length,
                "noise_reduction_pct": f"{noise_reduction_pct}%",
                "ocr_artifacts_fixed": metrics["ocr_artifacts_removed"],
                "procedural_interruptions_stripped": metrics["procedural_interruptions_removed"],
                "multilingual_terms_mapped": metrics["multilingual_terms_normalized"]
            },
            "extracted_keywords": keywords
        }

    def normalize_party(self, party_str: str) -> str:
        """Standardizes political party abbreviations."""
        cleaned = party_str.lower().strip()
        return self.party_map.get(cleaned, party_str.upper().strip())

    def extract_key_terms(self, text: str) -> list:
        """Extracts significant legislative keywords and policy terms from speech text."""
        policy_terms = [
            "MSP", "Minimum Support Price", "Farm Laws", "APMC", "Data Protection", "Privacy",
            "Surveillance", "Personal Data", "Union Budget", "Fiscal Deficit", "Inflation",
            "GST", "Unemployment", "National Security", "Border Defence", "Terrorism",
            "Judicial Appointment", "Colleagium", "Supreme Court", "Tribunal", "Constitutional Amendment",
            "Federalism", "States Rights", "Welfare Scheme", "DBT", "Subsidies", "Digital India"
        ]
        found_terms = []
        for term in policy_terms:
            if re.search(r'\b' + re.escape(term) + r'\b', text, re.IGNORECASE):
                found_terms.append(term)
        return list(set(found_terms))

if __name__ == "__main__":
    cleaner = ParliamentaryTranscriptCleaner()
    sample_ocr = "LOK SABHA DEBATES Series XVII Vol. II Page 45\nSHRI RAHUL GANDHI (INC): Adhyaksh Mahodaya, the government's agri-\nculture bills are designed to dismantle the APMC structure and hurt every kisan in this desh. (Interruptions)\nAn Hon. Member: What about your tenure? (At this stage, some hon. Members came and stood near the Table)\nSHRI RAHUL GANDHI: We demand a legal guarantee for MSP! The vipaksh will not stay silent."
    res = cleaner.clean_text(sample_ocr)
    print("=== SAMPLE MOAT CLEANING OUTPUT ===")
    print(json.dumps(res, indent=2))
