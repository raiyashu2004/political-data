#!/usr/bin/env python3
"""
sansad_pdf_parser.py: Verbatim Parliamentary PDF & Text Transcript Parser for LokaSent
Ingests raw debate PDFs or text files downloaded from e-Sansad / Parliament Digital Library (eparlib.nic.in / sansad.in).
Automatically segments multi-page transcripts into individual member speech turns, extracts speaker identifiers,
and prepares raw text for our ParliamentaryTranscriptCleaner and PolarizationEngine.
"""

import os
import re
from typing import List, Dict, Any, Optional
import pypdf

class SansadTranscriptParser:
    def __init__(self, raw_transcripts_dir: str = "raw_transcripts"):
        self.raw_transcripts_dir = raw_transcripts_dir
        os.makedirs(self.raw_transcripts_dir, exist_ok=True)
        
        # Regex patterns to detect speaker turn headers in standard Lok Sabha/Rajya Sabha transcripts
        # e.g., "SHRI RAHUL GANDHI (WAYANAD): Adhyaksh Mahodaya..." or "THE MINISTER OF HOME AFFAIRS (SHRI AMIT SHAH): ..."
        self.speaker_header_pattern = re.compile(
            r'^(?:(?:THE\s+)?(?:MINISTER|DEPUTY\s+MINISTER|PRIME\s+MINISTER|LEADER\s+OF\s+OPPOSITION|SPEAKER|CHAIRPERSON)[^:]*?\()?([A-Z\.\s]{3,60}(?:\([A-Z\s,]+\))?)\)?:\s*(.+)',
            re.MULTILINE
        )
        self.header_page_pattern = re.compile(r'LOK\s+SABHA\s+DEBATES|RAJYA\s+SABHA\s+DEBATES|Series\s+[X|I|V]+|Page\s+\d+', re.IGNORECASE)

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extracts and concatenates raw text across all pages of a parliamentary PDF transcript."""
        if not os.path.exists(pdf_path):
            print(f"[Sansad Parser] File not found: {pdf_path}")
            return ""
            
        try:
            reader = pypdf.PdfReader(pdf_path)
            full_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    full_text.append(f"--- PAGE {i+1} ---\n" + text)
            return "\n".join(full_text)
        except Exception as e:
            print(f"[Sansad Parser] Error extracting PDF text from {pdf_path}: {e}")
            return ""

    def segment_speeches(self, raw_text: str, default_date: str = "2024-08-01", default_bill: str = "General Parliamentary Debate") -> List[Dict[str, Any]]:
        """Segments raw verbatim parliamentary text into structured individual member speech turns."""
        if not raw_text or len(raw_text.strip()) < 50:
            return []
            
        speeches = []
        lines = raw_text.splitlines()
        
        current_speaker = None
        current_speech_lines = []
        speech_counter = 1
        
        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue
                
            # Skip page markers or header footers
            if self.header_page_pattern.match(line_clean) or line_clean.startswith("--- PAGE"):
                continue
                
            # Check if this line introduces a new speaker turn
            match = self.speaker_header_pattern.match(line_clean)
            if match:
                # Save previous speaker turn if valid
                if current_speaker and current_speech_lines:
                    speech_text = " ".join(current_speech_lines).strip()
                    if len(speech_text) > 30:
                        speeches.append(self._format_speech_record(
                            speaker_raw=current_speaker,
                            text=speech_text,
                            speech_id=f"REAL-{speech_counter:04d}",
                            date=default_date,
                            bill_category=default_bill
                        ))
                        speech_counter += 1
                        
                current_speaker = match.group(1).strip()
                initial_text = match.group(2).strip()
                current_speech_lines = [initial_text] if initial_text else []
            else:
                if current_speaker:
                    current_speech_lines.append(line_clean)
                    
        # Flush final speaker turn
        if current_speaker and current_speech_lines:
            speech_text = " ".join(current_speech_lines).strip()
            if len(speech_text) > 30:
                speeches.append(self._format_speech_record(
                    speaker_raw=current_speaker,
                    text=speech_text,
                    speech_id=f"REAL-{speech_counter:04d}",
                    date=default_date,
                    bill_category=default_bill
                ))
                
        print(f"[Sansad Parser] Segmented {len(speeches)} distinct speech turns from verbatim transcript.")
        return speeches

    def _format_speech_record(self, speaker_raw: str, text: str, speech_id: str, date: str, bill_category: str) -> Dict[str, Any]:
        """Cleans and standardizes a speaker turn record ready for NLP cleaning & stance scoring."""
        # Extract constituency or party if present in parentheses
        party_guess = "IND"
        if "(" in speaker_raw and ")" in speaker_raw:
            paren_content = speaker_raw.split("(")[-1].replace(")", "").strip()
            # If 2-5 uppercase chars, likely party code (e.g. BJP, INC, TMC, DMK)
            if paren_content.isupper() and 2 <= len(paren_content) <= 6:
                party_guess = paren_content
            else:
                # Constituency listed, clean speaker name
                speaker_raw = speaker_raw.split("(")[0].strip()
                
        return {
            "id": speech_id,
            "speaker": speaker_raw,
            "party": party_guess,
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)" if "2024" in date or "2025" in date else "17th Lok Sabha (2019-2024)",
            "date": date,
            "bill_category": bill_category,
            "raw_text": text,
            "data_source": "VERBATIM_PARLIAMENTARY_TRANSCRIPT"
        }

if __name__ == "__main__":
    parser = SansadTranscriptParser()
    sample_verbatim_text = """
LOK SABHA DEBATES Series XVIII Vol. III Page 12
THE MINISTER OF COMMUNICATIONS AND IT (SHRI ASHWINI VAISHNAW) (BJP): Hon. Speaker Sir, the Digital India Data Protection Bill is a landmark legislation that balances individual personal data privacy with the innovation needs of our burgeoning tech startup ecosystem. It provides robust protection against cyber breaches and ensures national security without strangling digital economy growth. We welcome the consensus from industry and civil society. (Interruptions)

SHRI SHASHI THAROOR (INC): Hon. Speaker Sir, while we support the urgent need for a statutory data protection regime in India, the current draft weakens the independence of the Data Protection Board and grants excessive exemptions to the executive. We oppose these specific draconian clauses and urge the government to accept our constructive amendments to protect citizens' digital rights.

SMT. MAHUA MOITRA (TMC): Adhyaksh Mahodaya, rushing digital surveillance bills without sending them to a parliamentary standing committee destroys our legislative norms! We strongly protest this authoritarian approach that dilutes citizen privacy and compromises digital freedom under the guise of state security. (At this stage, several hon. Members came near the Table)
    """
    speeches = parser.segment_speeches(sample_verbatim_text, default_date="2024-08-08", default_bill="Data Privacy & Digital India")
    for sp in speeches:
        print(f"\n[SPEECH TURN] {sp['speaker']} ({sp['party']}) - {sp['id']}")
        print(f"  Raw Preview: {sp['raw_text'][:140]}...")
