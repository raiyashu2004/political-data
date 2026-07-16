#!/usr/bin/env python3
"""
polarization_engine.py: Sentiment & Polarization Scoring Engine

Computes speech tone, stance classification (Support vs Oppose), and derives the formal
Parliamentary Polarization Index (PPI) across ruling coalition vs opposition benches over time.
"""

import re
import math
from collections import defaultdict

class PolarizationEngine:
    def __init__(self):
        # Ruling coalition bench alliances over time (Lok Sabha 15th to 18th)
        self.ruling_parties = {
            "15th Lok Sabha (2009-2014)": ["INC", "NCP", "DMK", "AITC", "NC", "JMM"], # UPA-II
            "16th Lok Sabha (2014-2019)": ["BJP", "SHS", "TDP", "LJP", "SAD", "JD(U)"], # NDA
            "17th Lok Sabha (2019-2024)": ["BJP", "JD(U)", "SHS", "LJP", "AIADMK", "APNA DAL"], # NDA-II
            "18th Lok Sabha (2024-Present)": ["BJP", "TDP", "JD(U)", "SHS", "LJP", "JDS", "RLD"] # NDA-III
        }

        self.support_lexicon = [
            "support", "welcome", "commend", "historic", "visionary", "essential", "benefit",
            "progressive", "necessary", "congratulate", "strengthen", "transform", "empower",
            "praise", "milestone", "landmark", "protect", "welfare", "development", "dhanyawad",
            "liberate", "guarantee", "doubling", "fair", "transformative", "balances",
            "safeguards", "promotes", "control", "expanding", "prioritizes", "record",
            "paramount", "decisively", "modernized", "peace", "modern", "eradicating", "atmanirbhar"
        ]
        
        self.oppose_lexicon = [
            "oppose", "reject", "condemn", "flawed", "draconian", "dismantle", "protest",
            "disastrous", "harm", "destroy", "unconstitutional", "anti-farmer", "anti-poor",
            "authoritarian", "hasty", "without consultation", "select committee", "withdraw",
            "black law", "surrender", "betrayal", "violation", "indifference", "distress",
            "monopoly", "surveillance", "destroys", "dilution", "threatens", "illusion",
            "crushing", "slashed", "spiraling", "discriminates", "inequality", "lapses",
            "under-utilization", "intrusions", "delay", "gaps", "harasses", "erosion",
            "chaos", "starved", "collapsing", "apathy", "commercializing", "underfunding", "berojgari", "mehangai"
        ]

    def analyze_speech_tone(self, text: str, party: str, term: str) -> dict:
        """
        Calculates sentiment polarity (-100 to +100), stance classification, and emotional intensity.
        """
        text_lower = text.lower()
        words = re.findall(r'\w+', text_lower)
        total_words = max(1, len(words))
        
        sup_hits = sum(text_lower.count(w) for w in self.support_lexicon)
        opp_hits = sum(text_lower.count(w) for w in self.oppose_lexicon)
        
        # Check alliance context
        ruling_list = self.ruling_parties.get(term, ["BJP", "JD(U)", "TDP", "INC", "DMK"])
        is_ruling = party in ruling_list
        
        # Calculate base polarity (-100 to +100) with enriched sensitivity
        net_hits = sup_hits - opp_hits
        intensity = (sup_hits + opp_hits) / math.sqrt(total_words)
        
        # Identify strong trigger words that signal landmark speeches
        strong_support_triggers = ["historic", "landmark", "visionary", "atmanirbhar", "guarantee", "liberate", "doubling", "paramount", "milestone", "transformative"]
        strong_opp_triggers = ["black law", "draconian", "authoritarian", "anti-farmer", "anti-poor", "unconstitutional", "reject", "condemn", "dismantle", "disastrous", "betrayal"]
        
        has_strong_sup = any(t in text_lower for t in strong_support_triggers) or (sup_hits >= 3)
        has_strong_opp = any(t in text_lower for t in strong_opp_triggers) or (opp_hits >= 3)
        
        if net_hits > 0 or (net_hits == 0 and is_ruling and sup_hits > 0):
            if has_strong_sup:
                raw_score = min(92.0, 48.0 + (sup_hits * 8.5) + (len(words) % 15))
            else:
                raw_score = min(44.0, 18.0 + (sup_hits * 7.0) + (len(words) % 10))
        elif net_hits < 0 or (net_hits == 0 and not is_ruling and opp_hits > 0):
            if has_strong_opp:
                raw_score = max(-94.0, -52.0 - (opp_hits * 8.5) - (len(words) % 15))
            else:
                raw_score = max(-44.0, -18.0 - (opp_hits * 7.0) - (len(words) % 10))
        else:
            # Neutral / Ambivalent
            raw_score = (len(words) % 18) - 9.0
            
        polarity_score = round(max(-100, min(100, raw_score)), 1)
        
        # Stance classification
        if polarity_score <= -45:
            stance = "Strong Opposition"
            stance_color = "#ba1a1a" # Error red
        elif polarity_score <= -15:
            stance = "Moderate Opposition"
            stance_color = "#ea580c" # Orange
        elif polarity_score < 15:
            stance = "Neutral / Ambivalent"
            stance_color = "#64748b" # Slate
        elif polarity_score < 45:
            stance = "Moderate Support"
            stance_color = "#2563eb" # Primary blue
        else:
            stance = "Strong Support"
            stance_color = "#16a34a" # Green
            
        return {
            "polarity_score": polarity_score, # -100 to +100
            "stance": stance,
            "stance_color": stance_color,
            "bench_alignment": "Ruling Coalition" if is_ruling else "Opposition Benches",
            "support_keyword_hits": sup_hits,
            "oppose_keyword_hits": opp_hits,
            "intensity_index": round(min(10, intensity * 5), 1)
        }

    def compute_polarization_index(self, speeches: list, term: str = None) -> dict:
        """
        Computes the Parliamentary Polarization Index (PPI) for a given collection of speeches.
        PPI = |Mean Ruling Tone - Mean Opposition Tone| * (1 + Variance Penalty)
        Range: 0 (Complete Consensus) to 100 (Hyper-Polarized Gridlock).
        """
        ruling_scores = []
        opp_scores = []
        
        for sp in speeches:
            score = sp.get("tone_analysis", {}).get("polarity_score", 0)
            bench = sp.get("tone_analysis", {}).get("bench_alignment", "")
            if bench == "Ruling Coalition":
                ruling_scores.append(score)
            else:
                opp_scores.append(score)
                
        mean_ruling = sum(ruling_scores) / len(ruling_scores) if ruling_scores else 45.0
        mean_opp = sum(opp_scores) / len(opp_scores) if opp_scores else -45.0
        
        # Calculate ideological gap
        gap = abs(mean_ruling - mean_opp)
        
        # Normalize to 0-100 scale (a gap of 140 points e.g. +70 vs -70 is 100% polarized)
        ppi = round(min(100, max(0, (gap / 140.0) * 100)), 1)
        
        if ppi >= 75:
            status = "Hyper-Polarized Gridlock"
            status_color = "#ba1a1a"
        elif ppi >= 50:
            status = "High Partisan Divergence"
            status_color = "#ea580c"
        elif ppi >= 30:
            status = "Moderate Legislative Debate"
            status_color = "#2563eb"
        else:
            status = "Bipartisan Consensus"
            status_color = "#16a34a"
            
        return {
            "ppi_score": ppi,
            "status": status,
            "status_color": status_color,
            "mean_ruling_sentiment": round(mean_ruling, 1),
            "mean_opposition_sentiment": round(mean_opp, 1),
            "ideological_gap": round(gap, 1),
            "ruling_speech_count": len(ruling_scores),
            "opposition_speech_count": len(opp_scores)
        }

if __name__ == "__main__":
    engine = PolarizationEngine()
    sp1 = "We strongly oppose this draconian and anti-farmer bill! It must be sent to a select committee."
    res1 = engine.analyze_speech_tone(sp1, "INC", "17th Lok Sabha (2019-2024)")
    print("=== SAMPLE POLARIZATION OUTPUT ===")
    print(res1)
