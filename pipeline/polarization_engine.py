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
        Computes the Composite Multi-Dimensional Parliamentary Polarization Index (PI) across:
        1. LDS (Lexical Divergence Score): Vocabulary/framing divergence via TF-IDF / word distribution distance.
        2. SDS (Sentiment Divergence Score): Gap in sentiment/emotion toward the same bill/topic across benches.
        3. TAS (Topic Alignment/Divergence Score): Whether parties are discussing the same sub-issues or talking past each other.
        4. StDS (Stance Divergence Score): Supportive vs. oppositional framing distribution gap across benches.
        
        Composite PI = 0.25*LDS + 0.25*SDS + 0.25*TAS + 0.25*StDS
        Range: 0 (Complete Consensus) to 100 (Hyper-Polarized Gridlock).
        """
        ruling_speeches = []
        opp_speeches = []
        
        for sp in speeches:
            bench = sp.get("tone_analysis", {}).get("bench_alignment", "")
            # Check if bench info exists or infer from party
            if not bench:
                party = sp.get("party", "")
                ruling_list = self.ruling_parties.get(term or sp.get("term", ""), ["BJP", "JD(U)", "TDP", "INC", "DMK"])
                bench = "Ruling Coalition" if party in ruling_list else "Opposition Benches"
                
            if bench == "Ruling Coalition":
                ruling_speeches.append(sp)
            else:
                opp_speeches.append(sp)
                
        ruling_scores = [sp.get("tone_analysis", {}).get("polarity_score", 0) for sp in ruling_speeches]
        opp_scores = [sp.get("tone_analysis", {}).get("polarity_score", 0) for sp in opp_speeches]
        
        mean_ruling = sum(ruling_scores) / len(ruling_scores) if ruling_scores else 48.0
        mean_opp = sum(opp_scores) / len(opp_scores) if opp_scores else -48.0
        
        # --- SUB-METRIC 1: SDS (Sentiment Divergence Score) ---
        ideological_gap = abs(mean_ruling - mean_opp)
        sds_score = round(min(100.0, max(0.0, (ideological_gap / 140.0) * 100.0)), 1)
        
        # --- SUB-METRIC 2: LDS (Lexical Divergence Score) ---
        # Calculate term frequency divergence between ruling and opposition vocabulary profiles
        def get_word_freq(speech_list):
            freq = defaultdict(int)
            total = 0
            for s in speech_list:
                text = s.get("cleaned_text", "") or s.get("raw_text", "")
                words = re.findall(r'[a-zA-Z]{4,}', text.lower())
                for w in words:
                    if w not in {"that", "with", "from", "have", "this", "will", "your", "honorable", "speaker", "member", "chairperson"}:
                        freq[w] += 1
                        total += 1
            return freq, total

        ruling_freq, ruling_total = get_word_freq(ruling_speeches)
        opp_freq, opp_total = get_word_freq(opp_speeches)
        
        if ruling_total > 0 and opp_total > 0:
            all_words = set(ruling_freq.keys()).union(opp_freq.keys())
            # Cosine similarity between word frequency distributions
            dot_prod = 0.0
            norm_r = 0.0
            norm_o = 0.0
            for w in all_words:
                pr = ruling_freq[w] / ruling_total
                po = opp_freq[w] / opp_total
                dot_prod += pr * po
                norm_r += pr * pr
                norm_o += po * po
            cosine_sim = dot_prod / (math.sqrt(norm_r) * math.sqrt(norm_o)) if (norm_r > 0 and norm_o > 0) else 0.5
            # LDS is framing distance (1 - cosine_sim) scaled + boosted by specific framing divergence
            lds_score = round(min(100.0, max(15.0, (1.0 - cosine_sim) * 115.0)), 1)
        else:
            lds_score = sds_score * 0.9

        # --- SUB-METRIC 3: TAS (Topic Alignment / Divergence Score) ---
        # Measure divergence in primary topics discussed across benches
        def get_topic_dist(speech_list):
            dist = defaultdict(float)
            if not speech_list:
                return dist
            for s in speech_list:
                top = s.get("topic_analysis", {}).get("primary_topic") or s.get("bill_category", "General Parliamentary Debate")
                dist[top] += 1.0 / len(speech_list)
            return dist

        ruling_topics = get_topic_dist(ruling_speeches)
        opp_topics = get_topic_dist(opp_speeches)
        
        all_topics = set(ruling_topics.keys()).union(opp_topics.keys())
        if all_topics:
            # Total variation distance between topic distributions
            tvd = sum(abs(ruling_topics[t] - opp_topics[t]) for t in all_topics) * 0.5
            # Scale TVD (0 to 1) to 0-100 divergence score
            tas_score = round(min(100.0, max(10.0, tvd * 100.0 + (15.0 if tvd > 0.3 else 0.0))), 1)
        else:
            tas_score = 45.0

        # --- SUB-METRIC 4: StDS (Stance Divergence Score) ---
        # Measure divergence across the 5-tier stance probability distribution
        stances_list = ["Strong Opposition", "Moderate Opposition", "Neutral / Ambivalent", "Moderate Support", "Strong Support"]
        def get_stance_dist(speech_list):
            dist = {st: 0.0 for st in stances_list}
            if not speech_list:
                return dist
            for s in speech_list:
                st = s.get("tone_analysis", {}).get("stance", "Neutral / Ambivalent")
                dist[st] += 1.0 / len(speech_list)
            return dist

        ruling_stances = get_stance_dist(ruling_speeches)
        opp_stances = get_stance_dist(opp_speeches)
        
        # Earth Mover's / cumulative distribution distance across ordered stances
        cum_diff = 0.0
        r_cum = 0.0
        o_cum = 0.0
        for st in stances_list:
            r_cum += ruling_stances[st]
            o_cum += opp_stances[st]
            cum_diff += abs(r_cum - o_cum)
        # Max cumulative difference across 4 intervals is 4.0
        stds_score = round(min(100.0, max(0.0, (cum_diff / 4.0) * 100.0)), 1)

        # --- COMPOSITE POLARIZATION INDEX (PI) ---
        # Combined weighted score (default equal weighting 0.25 each)
        composite_pi = round(0.25 * lds_score + 0.25 * sds_score + 0.25 * tas_score + 0.25 * stds_score, 1)
        
        # Status calculation based on composite PI
        if composite_pi >= 75:
            status = "Hyper-Polarized Gridlock"
            status_color = "#ba1a1a"
        elif composite_pi >= 52:
            status = "High Partisan Divergence"
            status_color = "#ea580c"
        elif composite_pi >= 32:
            status = "Moderate Legislative Debate"
            status_color = "#2563eb"
        else:
            status = "Bipartisan Consensus"
            status_color = "#16a34a"
            
        return {
            "ppi_score": composite_pi, # Backwards compatibility alias for overall PI
            "composite_pi": composite_pi,
            "lds_score": lds_score,
            "sds_score": sds_score,
            "tas_score": tas_score,
            "stds_score": stds_score,
            "status": status,
            "status_color": status_color,
            "mean_ruling_sentiment": round(mean_ruling, 1),
            "mean_opposition_sentiment": round(mean_opp, 1),
            "ideological_gap": round(ideological_gap, 1),
            "ruling_speech_count": len(ruling_speeches),
            "opposition_speech_count": len(opp_speeches),
            "submetric_weights": {
                "lds": 0.25,
                "sds": 0.25,
                "tas": 0.25,
                "stds": 0.25
            }
        }

if __name__ == "__main__":
    engine = PolarizationEngine()
    sample_speeches = [
        {"cleaned_text": "We welcome this historic and visionary bill to transform farmers lives.", "party": "BJP", "term": "17th Lok Sabha (2019-2024)", "tone_analysis": {"polarity_score": 75.0, "stance": "Strong Support", "bench_alignment": "Ruling Coalition"}, "topic_analysis": {"primary_topic": "Agriculture & Farm Reform"}},
        {"cleaned_text": "We strongly oppose this draconian black law that destroys APMC mandis without consultation.", "party": "INC", "term": "17th Lok Sabha (2019-2024)", "tone_analysis": {"polarity_score": -82.0, "stance": "Strong Opposition", "bench_alignment": "Opposition Benches"}, "topic_analysis": {"primary_topic": "Agriculture & Farm Reform"}}
    ]
    res = engine.compute_polarization_index(sample_speeches, "17th Lok Sabha (2019-2024)")
    print("=== SAMPLE MULTI-DIMENSIONAL PI OUTPUT ===")
    print(res)
