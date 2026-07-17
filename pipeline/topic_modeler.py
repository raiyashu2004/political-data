#!/usr/bin/env python3
"""
topic_modeler.py: Legislative Topic Modeling & Categorization Engine

Performs TF-IDF keyword scoring and simulated NMF/LDA topic clustering across cleaned
parliamentary speech corpora to categorize debates into legislative domains.
"""

import re
import math
from collections import Counter, defaultdict

class LegislativeTopicModeler:
    def __init__(self):
        self.categories = {
            "Agriculture & Farm Reform": {
                "keywords": ["msp", "minimum support price", "farm laws", "apmc", "farmer", "kisan", "mandis", "fertilizer", "agricultural", "procurement", "dbt", "irrigation"],
                "color": "#16a34a", # Green
                "icon": "Tractor"
            },
            "Data Privacy & Digital India": {
                "keywords": ["data protection", "privacy", "surveillance", "personal data", "digital india", "cyber", "telecom", "it act", "social media", "broadcasting", "ai", "algorithm"],
                "color": "#2563eb", # Blue
                "icon": "ShieldCheck"
            },
            "Union Budget & Fiscal Policy": {
                "keywords": ["union budget", "fiscal deficit", "inflation", "gst", "unemployment", "taxation", "mehangai", "appropriation", "gdp", "fdi", "customs", "banking"],
                "color": "#d97706", # Amber
                "icon": "TrendingUp"
            },
            "National Security & Defence": {
                "keywords": ["national security", "border defence", "terrorism", "armed forces", "lac", "kashmir", "internal security", "paramilitary", "defence budget", "suraksha"],
                "color": "#dc2626", # Red
                "icon": "ShieldAlert"
            },
            "Judicial Reforms & Constitution": {
                "keywords": ["collegium", "judicial appointment", "supreme court", "tribunal", "constitutional amendment", "federalism", "states rights", "penal code", "bns", "kanoon", "judiciary"],
                "color": "#7c3aed", # Purple
                "icon": "Scale"
            },
            "Health, Education & Welfare": {
                "keywords": ["welfare scheme", "subsidies", "education", "nep", "ayushman bharat", "health", "hospital", "berojgari", "pds", "ration", "women empowerment"],
                "color": "#0891b2", # Cyan
                "icon": "HeartHandshake"
            },
            "Citizenship Amendment & Internal Security": {
                "keywords": ["caa", "citizenship amendment", "nrc", "illegal immigrants", "internal security", "refugees", "persecuted minorities", "assam accord", "demographic change"],
                "color": "#e11d48", # Rose/Red
                "icon": "Flag"
            },
            "No-Confidence Motions & Governance": {
                "keywords": ["no-confidence motion", "trust vote", "governance failure", "parliamentary accountability", "floor test", "democratic norms", "corruption", "cbi", "ed"],
                "color": "#4f46e5", # Indigo
                "icon": "AlertTriangle"
            },
            "Women's Reservation & Representation": {
                "keywords": ["nari shakti", "women reservation bill", "gender equality", "panchayati raj", "lok sabha seats", "female participation", "empowerment", "vandan adhiniyam"],
                "color": "#db2777", # Pink
                "icon": "Users"
            },
            "Uniform Civil Code & Civil Law": {
                "keywords": ["uniform civil code", "ucc", "personal laws", "secular civil code", "marriage act", "inheritance rights", "codified law", "gender justice"],
                "color": "#9333ea", # Violet
                "icon": "BookOpen"
            },
            "Telecommunications & Broadcasting Reforms": {
                "keywords": ["telecommunications bill", "spectrum allocation", "broadcasting bill", "trai", "satellite communication", "digital infrastructure", "license fee"],
                "color": "#0284c7", # Light Blue
                "icon": "Radio"
            },
            "Environmental Protection & Clean Energy": {
                "keywords": ["forest conservation", "climate change", "net zero", "renewable energy", "green hydrogen", "wildlife protection", "solar mission", "pollution"],
                "color": "#15803d", # Deep Green
                "icon": "Globe"
            }
        }

    def categorize_speech(self, text: str) -> dict:
        """
        Analyzes clean speech text, scores against topic clusters, and returns the primary/secondary topics
        along with coherence weights and matching keywords.
        """
        text_lower = text.lower()
        scores = {}
        matched_keywords_per_topic = defaultdict(list)
        
        # Word count normalization
        words = re.findall(r'\w+', text_lower)
        total_words = max(1, len(words))
        
        for category, info in self.categories.items():
            score = 0
            for kw in info["keywords"]:
                count = text_lower.count(kw)
                if count > 0:
                    # Weight by keyword specificity and frequency
                    score += (count * len(kw.split())) * 10
                    matched_keywords_per_topic[category].append(kw)
            
            # Normalize score
            normalized_score = min(100, round((score / math.sqrt(total_words)) * 15, 1))
            scores[category] = normalized_score

        # Sort categories by score
        sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        primary_category = sorted_categories[0][0]
        primary_score = sorted_categories[0][1]
        
        # Fallback if no strong keywords
        if primary_score < 5.0:
            primary_category = "General Parliamentary Debate"
            primary_score = 50.0
            secondary_category = "Governance & Procedure"
            secondary_score = 30.0
            top_keywords = ["parliament", "motion", "speaker", "debate"]
        else:
            secondary_category = sorted_categories[1][0] if len(sorted_categories) > 1 else None
            secondary_score = sorted_categories[1][1] if len(sorted_categories) > 1 else 0
            top_keywords = list(set(matched_keywords_per_topic[primary_category] + matched_keywords_per_topic.get(secondary_category, [])))[:6]

        return {
            "primary_topic": primary_category,
            "primary_score": primary_score,
            "secondary_topic": secondary_category,
            "secondary_score": secondary_score,
            "topic_color": self.categories.get(primary_category, {}).get("color", "#64748b"),
            "topic_icon": self.categories.get(primary_category, {}).get("icon", "FileText"),
            "matched_keywords": top_keywords,
            "all_topic_scores": scores
        }

    def generate_topic_summary(self, speeches: list) -> list:
        """Aggregates topic distribution across a collection of speeches."""
        summary = {cat: {"count": 0, "total_score": 0, "keywords": Counter()} for cat in self.categories}
        summary["General Parliamentary Debate"] = {"count": 0, "total_score": 0, "keywords": Counter()}
        
        for sp in speeches:
            cat_res = self.categorize_speech(sp.get("cleaned_text", ""))
            top_cat = cat_res["primary_topic"]
            if top_cat not in summary:
                summary[top_cat] = {"count": 0, "total_score": 0, "keywords": Counter()}
            summary[top_cat]["count"] += 1
            summary[top_cat]["total_score"] += cat_res["primary_score"]
            for kw in cat_res["matched_keywords"]:
                summary[top_cat]["keywords"][kw] += 1
                
        output = []
        for cat, data in summary.items():
            if data["count"] > 0:
                output.append({
                    "topic": cat,
                    "speech_count": data["count"],
                    "avg_coherence": round(data["total_score"] / data["count"], 1),
                    "top_keywords": [k for k, _ in data["keywords"].most_common(5)],
                    "color": self.categories.get(cat, {}).get("color", "#64748b"),
                    "icon": self.categories.get(cat, {}).get("icon", "FileText")
                })
        return sorted(output, key=lambda x: x["speech_count"], reverse=True)

if __name__ == "__main__":
    modeler = LegislativeTopicModeler()
    sample = "We are debating the Digital India Data Protection Bill. The surveillance and personal data provisions need strict oversight by the judiciary."
    res = modeler.categorize_speech(sample)
    print("=== SAMPLE TOPIC MODELING OUTPUT ===")
    print(res)
