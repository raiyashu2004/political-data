#!/usr/bin/env python3
"""
synthetic_fixture_generator.py: Synthetic Stress-Test & Benchmark Fixture Generator for LokaSent
Generates 9,600+ simulated parliamentary debate speech turns across 12 categories and 4 Lok Sabha terms
to benchmark and stress-test OCR cleaning (`cleaner.py`), 4-dimensional composite polarization scoring (`polarization_engine.py`),
and NetworkX graph clustering (`network_analyzer.py`) before live API/scraper ingestion.
NOTE: All speech text, MP names, and dates are simulated test fixtures and do not represent actual political quotes.
"""

import random
from datetime import datetime, timedelta

def get_base_landmark_speeches():
    """Returns simulated benchmark test speeches with representative OCR noise patterns."""
    return [
        # --- 17th Lok Sabha: Agriculture & Farm Reform ---
        {
            "id": "DEB-17-AGR-001",
            "speaker": "[Opposition Representative 01 - INC Bench]",
            "party": "INC",
            "house": "Lok Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2021-02-11",
            "bill_category": "Agriculture & Farm Reform",
            "raw_text": "LOK SABHA DEBATES Series XVII Vol. XIV Page 102\n[OPPOSITION REPRESENTATIVE 01] (INC): Adhyaksh Mahodaya, the government's three agri-\nculture farm laws are designed to dismantle the APMC mandi structure and destroy the livelihood of every kisan in this desh. (Interruptions)\nAn Hon. Member: Why did your government not enact MSP? (At this stage, several hon. Members came near the Table)\n[OPPOSITION REPRESENTATIVE 01]: We demand a legal guarantee for Minimum Support Price (MSP)! This is a black law and the vipaksh will not surrender our farmers to corporate houses. We strongly oppose this bill!"
        },
        {
            "id": "DEB-17-AGR-002",
            "speaker": "[Ruling Representative 01 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2021-02-11",
            "bill_category": "Agriculture & Farm Reform",
            "raw_text": "LOK SABHA DEBATES Series XVII Vol. XIV Page 105\n[RULING REPRESENTATIVE 01] (BJP): Hon. Speaker Sir, these historic farm laws will liberate the kisan from middlemen and transform agricultural trade across India. (Interruptions) The opposition is spreading false propaganda and misleading the farming community. MSP procurement has increased under our government and will continue. We commend this visionary reform that empowers Indian agriculture."
        },
        {
            "id": "DEB-17-AGR-003",
            "speaker": "[Regional Representative 01 - SAD Bench]",
            "party": "SAD",
            "house": "Lok Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2020-09-17",
            "bill_category": "Agriculture & Farm Reform",
            "raw_text": "LOK SABHA DEBATES Series XVII Vol. IX Page 34\n[REGIONAL REPRESENTATIVE 01] (SAD): Adhyaksh Mahodaya, our party SAD has always stood with the kisan of Punjab and Haryana. Because these bills were brought without consultation with farmers and without statutory protection for MSP, we strongly protest and reject these legislations as disastrous for agricultural households."
        },
        
        # --- 18th Lok Sabha: Data Privacy & Digital India ---
        {
            "id": "DEB-18-DAT-001",
            "speaker": "[Ruling Representative 02 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-08-08",
            "bill_category": "Data Privacy & Digital India",
            "raw_text": "LOK SABHA DEBATES Series XVIII Vol. III Page 12\n[RULING REPRESENTATIVE 02] (BJP): Hon. Speaker Sir, the Digital India Data Protection Bill is a landmark legislation that balances individual personal data privacy with the innovation needs of our burgeoning tech startup ecosystem. It provides robust protection against cyber breaches and ensures national security without strangling digital economy growth. We welcome the consensus from industry and civil society."
        },
        {
            "id": "DEB-18-DAT-002",
            "speaker": "[Regional Representative 02 - AIMIM Bench]",
            "party": "AIMIM",
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-08-08",
            "bill_category": "Data Privacy & Digital India",
            "raw_text": "LOK SABHA DEBATES Series XVIII Vol. III Page 18\n[REGIONAL REPRESENTATIVE 02] (AIMIM): Adhyaksh Mahodaya, this Data Protection Bill is flawed and authoritarian! By exempting government surveillance agencies from privacy constraints, it violates the fundamental right to privacy established by the Supreme Court. We strongly condemn this state surveillance framework and demand it be referred to a Joint Parliamentary Committee!"
        },
        {
            "id": "DEB-18-DAT-003",
            "speaker": "[Opposition Representative 02 - INC Bench]",
            "party": "INC",
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-08-09",
            "bill_category": "Data Privacy & Digital India",
            "raw_text": "LOK SABHA DEBATES Series XVIII Vol. III Page 45\n[OPPOSITION REPRESENTATIVE 02] (INC): Hon. Speaker Sir, while we support the urgent need for a statutory data protection regime in India, the current draft weakens the independence of the Data Protection Board and grants excessive exemptions to the executive. We oppose these specific draconian clauses and urge the government to accept our constructive amendments to protect citizens' digital rights."
        },

        # --- 17th Lok Sabha: Union Budget & Fiscal Policy ---
        {
            "id": "DEB-17-BUD-001",
            "speaker": "[Ruling Representative 03 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2023-02-01",
            "bill_category": "Union Budget & Fiscal Policy",
            "raw_text": "LOK SABHA DEBATES Series XVII Vol. XXI Page 1\n[RULING REPRESENTATIVE 03] (BJP): Hon. Speaker Sir, this Union Budget lays the foundation for Amrit Kaal. Our fiscal deficit is strictly controlled while capital expenditure on infrastructure is increased by 33%. We have controlled mehangai and inflation compared to global economies, while expanding welfare subsidies and DBT to millions of households. I commend this progressive budget to the House."
        },
        {
            "id": "DEB-17-BUD-002",
            "speaker": "[Regional Representative 03 - TMC Bench]",
            "party": "TMC",
            "house": "Lok Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2023-02-03",
            "bill_category": "Union Budget & Fiscal Policy",
            "raw_text": "LOK SABHA DEBATES Series XVII Vol. XXI Page 67\n[REGIONAL REPRESENTATIVE 03] (TMC): Adhyaksh Mahodaya, this budget is an illusion that ignores the crushing reality of mehangai and youth berojgari in our country! While corporate tax cuts are celebrated, rural welfare schemes and MGNREGA allocations have been ruthlessly slashed. We strongly condemn this anti-poor and discriminatory fiscal allocation against non-ruling states!"
        },

        # --- 16th Lok Sabha: National Security & Defence ---
        {
            "id": "DEB-16-SEC-001",
            "speaker": "[Ruling Representative 04 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "16th Lok Sabha (2014-2019)",
            "date": "2018-01-04",
            "bill_category": "National Security & Defence",
            "raw_text": "LOK SABHA DEBATES Series XVI Vol. XIII Page 10\n[RULING REPRESENTATIVE 04] (BJP): Hon. Speaker Sir, the security and suraksha of our nation is paramount. Our armed forces and border defence forces have been given full freedom to respond decisively to cross-border terrorism. We welcome the bi-partisan support of this House whenever national security is challenged."
        },
        {
            "id": "DEB-16-SEC-002",
            "speaker": "[Opposition Representative 03 - INC Bench]",
            "party": "INC",
            "house": "Lok Sabha",
            "term": "16th Lok Sabha (2014-2019)",
            "date": "2018-01-04",
            "bill_category": "National Security & Defence",
            "raw_text": "LOK SABHA DEBATES Series XVI Vol. XIII Page 15\n[OPPOSITION REPRESENTATIVE 03] (INC): Hon. Speaker Sir, when it comes to defending our borders and supporting our armed forces against terrorism, the opposition stands completely united with the nation. We support the valour of our soldiers, even as we question the diplomatic strategy and budget utilization of the defence ministry."
        },

        # --- 15th Lok Sabha: Health, Education & Welfare ---
        {
            "id": "DEB-15-WEL-001",
            "speaker": "[Ruling Representative 05 - INC Bench]",
            "party": "INC",
            "house": "Lok Sabha",
            "term": "15th Lok Sabha (2009-2014)",
            "date": "2013-08-26",
            "bill_category": "Health, Education & Welfare",
            "raw_text": "LOK SABHA DEBATES Series XV Vol. XXXII Page 5\n[RULING REPRESENTATIVE 05] (INC): Hon. Speaker Sir, the National Food Security Bill is an historic welfare enactment that guarantees subsidized food grains to over two-thirds of India's population. It empowers the poor and eradicates hunger. We commend this landmark social legislation to parliament."
        },
        {
            "id": "DEB-15-WEL-002",
            "speaker": "[Opposition Representative 04 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "15th Lok Sabha (2009-2014)",
            "date": "2013-08-26",
            "bill_category": "Health, Education & Welfare",
            "raw_text": "LOK SABHA DEBATES Series XV Vol. XXXII Page 22\n[OPPOSITION REPRESENTATIVE 04] (BJP): Adhyaksh Mahodaya, while the BJP supports the principle of food security for every poor citizen, we oppose the hasty drafting and lack of consultation with state governments regarding PDS distribution infrastructure. We support the welfare intent but demand amendments to protect state federalism and farmer procurement rights."
        },

        # --- 18th Lok Sabha: Judicial Reforms & Constitution ---
        {
            "id": "DEB-18-JUD-001",
            "speaker": "[Ruling Representative 06 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-07-25",
            "bill_category": "Judicial Reforms & Constitution",
            "raw_text": "LOK SABHA DEBATES Series XVIII Vol. II Page 88\n[RULING REPRESENTATIVE 06] (BJP): Hon. Speaker Sir, the replacement of colonial penal laws with the Bharatiya Nyaya Sanhita (BNS) transforms our judicial system from punishment-oriented to justice-oriented kanoon. It integrates digital evidence, ensures speedy trials, and protects constitutional liberties. This visionary reform strengthens Indian democracy."
        },
        {
            "id": "DEB-18-JUD-002",
            "speaker": "[Regional Representative 04 - SP Bench]",
            "party": "SP",
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-07-26",
            "bill_category": "Judicial Reforms & Constitution",
            "raw_text": "LOK SABHA DEBATES Series XVIII Vol. II Page 112\n[REGIONAL REPRESENTATIVE 04] (SP): Adhyaksh Mahodaya, renaming laws in Hindi while increasing police detention powers without judicial oversight is unconstitutional and anti-citizen! We oppose this hasty implementation of new criminal codes that harass common people and violate federal principles. We demand an immediate review by a parliamentary committee!"
        },
        {
            "id": "DEB-18-JUD-003",
            "speaker": "[Regional Representative 05 - DMK Bench]",
            "party": "DMK",
            "house": "Lok Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-07-26",
            "bill_category": "Judicial Reforms & Constitution",
            "raw_text": "LOK SABHA DEBATES Series XVIII Vol. II Page 119\n[REGIONAL REPRESENTATIVE 05] (DMK): Hon. Speaker Sir, imposing Sanskritized Hindi names on penal codes violates non-Hindi speaking states' rights and constitutional federalism! The DMK strongly condemns and rejects these authoritarian judicial bills that disrupt state legal administration."
        },

        # --- Additional Landmark Speeches ---
        {
            "id": "DEB-17-JUD-004",
            "speaker": "[Ruling Representative 07 - BJP Bench]",
            "party": "BJP",
            "house": "Lok Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2019-08-06",
            "bill_category": "Judicial Reforms & Constitution",
            "raw_text": "LOK SABHA DEBATES Series XVII Vol. II Page 15\n[RULING REPRESENTATIVE 07] (BJP): Hon. Speaker Sir, the abrogation of Article 370 is a monumental step towards national integration and constitutional equality. For decades, special provisions hindered social welfare and economic progress in Jammu and Kashmir. Now, every kanoon, constitutional liberty, and development scheme will reach every citizen equally across our desh."
        },
        {
            "id": "DEB-16-BUD-003",
            "speaker": "[Ruling Representative 08 - BJP Bench]",
            "party": "BJP",
            "house": "Rajya Sabha",
            "term": "16th Lok Sabha (2014-2019)",
            "date": "2017-06-30",
            "bill_category": "Union Budget & Fiscal Policy",
            "raw_text": "RAJYA SABHA DEBATES Part II Page 42\n[RULING REPRESENTATIVE 08] (BJP): Sabhapati Mahodaya, the Goods and Services Tax (GST) is the greatest tax reform since Independence, uniting India into a single national market. By replacing cascading indirect taxes with a transparent digital framework, we reduce corruption, enhance fiscal stability, and accelerate economic GDP growth."
        },
        {
            "id": "DEB-15-WEL-003",
            "speaker": "[Ruling Representative 09 - INC Bench]",
            "party": "INC",
            "house": "Lok Sabha",
            "term": "15th Lok Sabha (2009-2014)",
            "date": "2013-08-26",
            "bill_category": "Health, Education & Welfare",
            "raw_text": "LOK SABHA DEBATES Series XV Vol. XXXII Page 12\n[RULING REPRESENTATIVE 09] (INC): Adhyaksh Mahodaya, our government is committed to eradicating hunger through the National Food Security Bill. We must protect our most vulnerable citizens, especially rural women and children, by ensuring guaranteed subsidized food grains. This is a historic moral obligation for Indian democracy."
        },
        {
            "id": "DEB-17-DAT-004",
            "speaker": "[Regional Representative 06 - TMC Bench]",
            "party": "TMC",
            "house": "Rajya Sabha",
            "term": "17th Lok Sabha (2019-2024)",
            "date": "2021-12-15",
            "bill_category": "Data Privacy & Digital India",
            "raw_text": "RAJYA SABHA DEBATES Part II Page 89\n[REGIONAL REPRESENTATIVE 06] (TMC): Sabhapati Mahodaya, rushing digital surveillance bills without sending them to a parliamentary standing committee destroys our legislative norms! We strongly protest this authoritarian approach that dilutes citizen privacy and compromises digital freedom under the guise of state security."
        },
        {
            "id": "DEB-18-AGR-004",
            "speaker": "[Regional Representative 07 - AAP Bench]",
            "party": "AAP",
            "house": "Rajya Sabha",
            "term": "18th Lok Sabha (2024-Present)",
            "date": "2024-07-30",
            "bill_category": "Agriculture & Farm Reform",
            "raw_text": "RAJYA SABHA DEBATES Part II Page 104\n[REGIONAL REPRESENTATIVE 07] (AAP): Sabhapati Mahodaya, our kisan are still waiting for a statutory guarantee on MSP! When agricultural input costs and rural mehangai are skyrocketing, the government's indifference to farmer procurement rights is unacceptable. We demand immediate agricultural debt relief and legal MSP enforcement."
        }
    ]

def generate_parametric_speeches():
    """Generates over 9,600 simulated benchmark speech turns across all terms, houses, parties, and categories."""
    terms = [
        {"name": "15th Lok Sabha (2009-2014)", "start_year": 2009, "end_year": 2014, "ruling_parties": ["INC", "DMK", "NCP"], "opp_parties": ["BJP", "SP", "SAD", "JD(U)", "CPI(M)", "BJD"]},
        {"name": "16th Lok Sabha (2014-2019)", "start_year": 2014, "end_year": 2019, "ruling_parties": ["BJP", "SHS", "SAD", "TDP"], "opp_parties": ["INC", "TMC", "SP", "AIMIM", "BJD", "CPI(M)"]},
        {"name": "17th Lok Sabha (2019-2024)", "start_year": 2019, "end_year": 2024, "ruling_parties": ["BJP", "JD(U)", "SHS"], "opp_parties": ["INC", "TMC", "DMK", "SP", "SAD", "AIMIM", "AAP", "BJD"]},
        {"name": "18th Lok Sabha (2024-Present)", "start_year": 2024, "end_year": 2026, "ruling_parties": ["BJP", "TDP", "JD(U)", "SHS"], "opp_parties": ["INC", "TMC", "DMK", "SP", "AIMIM", "AAP", "RJD"]}
    ]
    
    categories = [
        "Agriculture & Farm Reform",
        "Data Privacy & Digital India",
        "Union Budget & Fiscal Policy",
        "National Security & Defence",
        "Judicial Reforms & Constitution",
        "Health, Education & Welfare",
        "Citizenship Amendment & Internal Security",
        "No-Confidence Motions & Governance",
        "Women's Reservation & Representation",
        "Uniform Civil Code & Civil Law",
        "Telecommunications & Broadcasting Reforms",
        "Environmental Protection & Clean Energy"
    ]
    
    # Speaker pools (Anonymized benchmark identifiers for stress-testing without attributing fake quotes to real officials)
    ruling_mps = {
        "BJP": [f"[Synthetic Ruling Speaker {i:02d} - BJP]" for i in range(1, 15)],
        "INC": [f"[Synthetic Ruling Speaker {i:02d} - INC]" for i in range(1, 10)],
        "TDP": [f"[Synthetic Alliance Speaker {i:02d} - TDP]" for i in range(1, 6)],
        "JD(U)": [f"[Synthetic Alliance Speaker {i:02d} - JD(U)]" for i in range(1, 6)],
        "SHS": [f"[Synthetic Alliance Speaker {i:02d} - SHS]" for i in range(1, 5)],
        "DMK": [f"[Synthetic Ruling Speaker {i:02d} - DMK]" for i in range(1, 6)],
        "NCP": [f"[Synthetic Ruling Speaker {i:02d} - NCP]" for i in range(1, 5)]
    }
    
    opp_mps = {
        "INC": [f"[Synthetic Opposition Speaker {i:02d} - INC]" for i in range(1, 12)],
        "BJP": [f"[Synthetic Opposition Speaker {i:02d} - BJP]" for i in range(1, 8)],
        "TMC": [f"[Synthetic Regional Speaker {i:02d} - TMC]" for i in range(1, 10)],
        "DMK": [f"[Synthetic Regional Speaker {i:02d} - DMK]" for i in range(1, 8)],
        "SP": [f"[Synthetic Regional Speaker {i:02d} - SP]" for i in range(1, 8)],
        "SAD": [f"[Synthetic Regional Speaker {i:02d} - SAD]" for i in range(1, 5)],
        "AIMIM": [f"[Synthetic Regional Speaker {i:02d} - AIMIM]" for i in range(1, 5)],
        "AAP": [f"[Synthetic Regional Speaker {i:02d} - AAP]" for i in range(1, 6)],
        "BJD": [f"[Synthetic Regional Speaker {i:02d} - BJD]" for i in range(1, 6)],
        "CPI(M)": [f"[Synthetic Regional Speaker {i:02d} - CPI(M)]" for i in range(1, 6)],
        "RJD": [f"[Synthetic Regional Speaker {i:02d} - RJD]" for i in range(1, 5)],
        "JD(U)": [f"[Synthetic Opposition Speaker {i:02d} - JD(U)]" for i in range(1, 5)],
        "YSRCP": [f"[Synthetic Regional Speaker {i:02d} - YSRCP]" for i in range(1, 5)]
    }
    
    # Vocabulary & template pools with OCR artifacts and Hindi terms
    ruling_templates = {
        "Agriculture & Farm Reform": [
            "Hon. Speaker Sir, our agricultural reforms will liberate the kisan from middlemen and expand APMC mandi efficiency. We have increased MSP procurement and fertilizer subsidies to guarantee rural prosperity. (Interruptions) The opposition is spreading unfounded rumors about farm trade.",
            "Adhyaksh Mahodaya, the government is committed to doubling farmer income through modern irrigation schemes and soil health cards. We support the farming community and ensure fair crop pricing across every mandi in this desh.",
            "Sir, through digital agricultural infrastructure and direct credit linkages, we protect our kisan against climate risks. This reform represents a transformative step for rural agrarian growth without undermining statutory MSP mechanisms."
        ],
        "Data Privacy & Digital India": [
            "Hon. Speaker Sir, the Digital India framework balances personal data privacy with rapid technological startup innovation. It establishes rigorous cybersecurity safeguards against cyber breaches while ensuring national security and digital sovereignty.",
            "Sabhapati Mahodaya, our digital governance legislation creates an independent Data Protection Board that protects citizen privacy. We welcome constructive dialogue while rejecting unfounded claims of state surveillance.",
            "Sir, with digital financial inclusion and robust data encryption standards, India is leading global digital economy growth. This bill safeguards user consent and promotes responsible artificial intelligence development."
        ],
        "Union Budget & Fiscal Policy": [
            "Hon. Speaker Sir, this Union Budget maintains strict fiscal deficit control while increasing capital expenditure on national infrastructure by over 30%. We have successfully controlled mehangai and inflation while expanding DBT welfare transfers to households.",
            "Adhyaksh Mahodaya, our economic policy ensures macro-economic stability and rapid GDP growth. By simplifying tax compliance and boosting manufacturing incentives, we generate sustainable youth employment and rural development.",
            "Sir, this progressive fiscal framework prioritizes inclusive economic growth. We allocate record funding for rural roads, clean water, and electrification, ensuring Amrit Kaal benefits reach every section of society."
        ],
        "National Security & Defence": [
            "Hon. Speaker Sir, the security and suraksha of our borders is our highest national priority. Our armed forces have full operational freedom to counter cross-border terrorism decisively. We welcome the House's bipartisan unity on defence matters.",
            "Sabhapati Mahodaya, through indigenous defence manufacturing and self-reliance (Atmanirbhar Bharat), we have modernized our military infrastructure. We ensure our soldiers receive the highest tactical support and welfare benefits.",
            "Sir, national security cannot be compromised by political partisanship. Our border defence investments and intelligence coordination have neutralized external threats and ensured peace across the subcontinent."
        ],
        "Judicial Reforms & Constitution": [
            "Hon. Speaker Sir, replacing colonial penal codes with modern justice-oriented kanoon integrates digital forensics and ensures speedy trials for all citizens. This constitutional reform strengthens civil liberties and judicial transparency.",
            "Adhyaksh Mahodaya, our legal reforms modernize court procedure and reduce judicial backlog. By streamlining evidence rules and victim protection protocols, we empower the common man within the justice system.",
            "Sir, upholding constitutional democracy requires updating obsolete laws. This legislation enhances accountability in legal administration without infringing upon federal state competencies or citizen rights."
        ],
        "Health, Education & Welfare": [
            "Hon. Speaker Sir, our landmark healthcare and welfare legislation guarantees subsidized food security and universal medical insurance under Ayushman Bharat. We are eradicating poverty and elevating health standards nationwide.",
            "Sabhapati Mahodaya, the National Education Policy (NEP) and public health investments empower our youth with world-class skills. We allocate unprecedented resources to rural health centers and nutrition programs.",
            "Sir, social welfare is a constitutional commitment. By leveraging direct benefit transfers, we eliminate leakage and ensure subsidized grains and medical aid reach the most vulnerable families in our country."
        ],
        "Citizenship Amendment & Internal Security": [
            "Hon. Speaker Sir, the Citizenship Amendment Act (CAA) provides humanitarian relief and constitutional dignity to persecuted minorities from neighboring countries. It does not take away any Indian citizen's rights regardless of religion.",
            "Adhyaksh Mahodaya, protecting internal security and safeguarding borders against illegal immigrants while granting asylum to religious refugees is our moral duty. We reject the opposition's divisive scaremongering across our desh.",
            "Sir, national sovereignty requires distinct protocols for legal citizenship and illegal migration. The NRC and CAA frameworks ensure accurate population registers while upholding every fundamental right of legitimate citizens."
        ],
        "No-Confidence Motions & Governance": [
            "Hon. Speaker Sir, the opposition's no-confidence motion is a politically motivated stunt masking their lack of constructive policy alternatives. Our governance model has lifted 25 crore citizens out of multidimensional poverty.",
            "Sabhapati Mahodaya, floor tests repeatedly reaffirm the nation's overwhelming trust in our clean, transparent administration. We fight corruption transparently through independent investigative agencies without political bias.",
            "Sir, parliamentary democracy thrives on debate, not obstructionism. While the opposition stalls proceedings, our government remains totally dedicated to nation-building, economic stability, and democratic accountability."
        ],
        "Women's Reservation & Representation": [
            "Hon. Speaker Sir, the Nari Shakti Vandan Adhiniyam is a watershed constitutional reform reserving one-third of Lok Sabha and Assembly seats for women. True democracy requires equal empowerment and leadership across every forum.",
            "Adhyaksh Mahodaya, women led development is the cornerstone of our policy vision. From rural self-help groups to parliamentary benches, empowering mothers and daughters strengthens the democratic fabric of India.",
            "Sir, bipartisan support for women's representation marks an unforgettable epoch in parliamentary history. This legislation dismantles patriarchal barriers and elevates female participation in national decision making."
        ],
        "Uniform Civil Code & Civil Law": [
            "Hon. Speaker Sir, Article 44 of our Constitution directs the State to secure a Uniform Civil Code (UCC) for all citizens across the territory of India. Codified secular personal laws guarantee gender justice and equality before kanoon.",
            "Sabhapati Mahodaya, personal law reform ensures that discriminatory practices in inheritance, marriage, and adoption are replaced by progressive human rights standards. We seek national consensus on this vital constitutional pledge.",
            "Sir, a modern democratic republic cannot maintain fragmented personal codes that disadvantage women. Implementing secular civil reforms fosters national cohesion and equal legal protection across all communities."
        ],
        "Telecommunications & Broadcasting Reforms": [
            "Hon. Speaker Sir, the Telecommunications Bill replaces century-old colonial laws with a modern, dynamic framework for 5G spectrum allocation and satellite communications. It accelerates digital infrastructure growth across rural and urban India.",
            "Adhyaksh Mahodaya, regulating broadcasting and digital networks protects citizens from fraudulent cyber syndicates and national security breaches. We simplify licensing regimes to attract massive global technology investments.",
            "Sir, secure telecommunication networks are vital for economic sovereignty. By reforming right-of-way rules and spectrum management, we ensure reliable connectivity for schools, hospitals, and enterprises nationwide."
        ],
        "Environmental Protection & Clean Energy": [
            "Hon. Speaker Sir, our Forest Conservation and Renewable Energy initiatives balance rapid industrial development with rigorous wildlife protection and net-zero climate goals. India is now a global leader in green hydrogen and solar capacity.",
            "Sabhapati Mahodaya, through the National Green Hydrogen Mission and strict pollution monitoring, we protect natural habitats while powering industrial growth. Sustainable development is embedded in our civilizational values.",
            "Sir, addressing climate change requires proactive legislative mandates. We have significantly expanded forest cover and clean energy generation, fulfilling our international environmental commitments without sacrificing economic mobility."
        ]
    }
    
    opp_templates = {
        "Agriculture & Farm Reform": [
            "Adhyaksh Mahodaya, these farm legislations are anti-farmer and designed to dismantle the APMC mandi structure! We demand a statutory legal guarantee for Minimum Support Price (MSP) to save the kisan from corporate exploitation. (Interruptions)",
            "Sabhapati Mahodaya, bringing agricultural bills without consulting state governments violates constitutional federalism! The farming community is protesting against rising agricultural input costs and indebtedness. We strongly reject this bill!",
            "Sir, the government's refusal to enact mandatory MSP benchmarks exposes its indifference to agrarian distress. We demand immediate agricultural debt waivers and protection of rural farmer livelihoods against corporate monopoly."
        ],
        "Data Privacy & Digital India": [
            "Adhyaksh Mahodaya, this Data Protection Bill is draconian and authoritarian! By granting blanket surveillance exemptions to executive agencies, it destroys the fundamental right to privacy. We demand it be referred to a Joint Parliamentary Committee!",
            "Sabhapati Mahodaya, compromising the independence of the Data Protection Board turns digital governance into state surveillance! We strongly oppose the dilution of citizen privacy rights and RTI protections under this bill.",
            "Sir, rushing digital technology laws without adequate public consultation threatens our democratic institutions. We reject these unchecked surveillance powers and urge constructive amendments to protect personal data."
        ],
        "Union Budget & Fiscal Policy": [
            "Adhyaksh Mahodaya, this budget is an illusion that completely ignores the crushing reality of mehangai and youth berojgari! While corporate tax rates are slashed, MGNREGA and rural welfare allocations have been ruthlessly reduced!",
            "Sabhapati Mahodaya, the fiscal deficit is spiraling while inflationary pressures crush common households. This budget discriminates against non-ruling state governments and fails to address widespread rural economic distress.",
            "Sir, imposing indirect tax burdens on essential commodities while offering tax concessions to big conglomerates is unjust. We condemn this anti-poor fiscal policy that widens economic inequality across our country."
        ],
        "National Security & Defence": [
            "Hon. Speaker Sir, while the opposition stands completely united with our armed forces against terrorism, we question the government's diplomatic lapses and budget under-utilization in defence modernization. (Interruptions)",
            "Sabhapati Mahodaya, national security requires transparency and accountability! We demand answers on border infrastructure intrusions and the delay in implementing full OROP pension benefits for our military veterans.",
            "Sir, we honor the valour of our soldiers, but the government must explain strategic intelligence gaps and ensure adequate protective armor and tactical equipment for troops deployed in border regions."
        ],
        "Judicial Reforms & Constitution": [
            "Adhyaksh Mahodaya, renaming criminal codes in Hindi while expanding police detention powers without judicial oversight is unconstitutional! This authoritarian legislation violates state federal principles and harasses citizens.",
            "Sabhapati Mahodaya, rushing penal code overhauls without parliamentary committee scrutiny threatens civil liberties! We strongly condemn the erosion of judicial independence and state legal administrative autonomy.",
            "Sir, imposing new legal frameworks without adequate judiciary training or state consultation creates legal chaos. We oppose these draconian detention clauses and demand comprehensive constitutional review."
        ],
        "Health, Education & Welfare": [
            "Adhyaksh Mahodaya, while we support welfare intent, the government has starved public healthcare and primary education of essential funds! PDS distribution networks in rural areas are collapsing under bureaucratic apathy.",
            "Sabhapati Mahodaya, commercializing education and underfunding rural health centers harms vulnerable families! We demand increased budgetary allocations for public hospitals and subsidized nutrition schemes.",
            "Sir, centralizing welfare schemes without supporting state municipal infrastructure leads to massive delivery gaps. We protest the reduction in social security pensions and demand guaranteed food protection for the poor."
        ],
        "Citizenship Amendment & Internal Security": [
            "Adhyaksh Mahodaya, linking citizenship to religion under the Citizenship Amendment Act violates Article 14 of our Constitution! We strongly reject this divisive political agenda that polarizes communities and threatens social harmony across the desh.",
            "Sabhapati Mahodaya, combining NRC verification with discriminatory asylum criteria creates widespread panic among marginalized citizens and minorities! We demand the repeal of unconstitutional citizenship tests.",
            "Sir, internal security is weakened when government laws alienate entire sections of the population. We protest against authoritarian immigration frameworks that erode the secular foundations of our democratic republic."
        ],
        "No-Confidence Motions & Governance": [
            "Adhyaksh Mahodaya, we move this no-confidence motion because the government has totally failed on inflation, youth unemployment, and institutional integrity! Central investigative agencies like CBI and ED are weaponized against the opposition!",
            "Sabhapati Mahodaya, parliamentary accountability is dead when the ruling dispensation evades debates on burning national crises! This trust vote exposes the deep governance deficit and erosion of democratic norms.",
            "Sir, the nation has lost confidence in an administration that protects crony capitalists while rural farmers and workers suffer. We demand complete transparency and answers on rampant economic irregularities."
        ],
        "Women's Reservation & Representation": [
            "Adhyaksh Mahodaya, while we strongly support women's reservation, delaying its implementation by linking it to future census and delimitation exercises is a cruel deception! We demand immediate quota enforcement without conditions!",
            "Sabhapati Mahodaya, true representation requires sub-quotas for OBC and minority women within the reservation bill! Without social justice provisions, this enactment remains an incomplete promise to rural nari shakti.",
            "Sir, we welcome gender representation but condemn the political posturing around implementation timelines. Empowering women requires immediate seat allocation across state assemblies and parliament right now!"
        ],
        "Uniform Civil Code & Civil Law": [
            "Adhyaksh Mahodaya, imposing a Uniform Civil Code without building consensus among diverse religious and tribal communities threatens India's pluralistic fabric! We reject majoritarian uniformity disguised as legal reform.",
            "Sabhapati Mahodaya, personal law reforms must originate from within communities through internal dialogue and gender justice reviews, not state mandate! This draft infringes upon constitutional freedom of religion under Article 25.",
            "Sir, before talking about civil code uniformity, the government must ensure equal economic rights and protection for women across existing statutory laws. We oppose polarizing personal law debates for electoral gains."
        ],
        "Telecommunications & Broadcasting Reforms": [
            "Adhyaksh Mahodaya, the new Telecommunications Bill gives government agencies unbridled powers to intercept digital communications and suspend internet services! It turns digital infrastructure into an instrument of state surveillance.",
            "Sabhapati Mahodaya, allocating spectrum through administrative discretion rather than transparent auction risks massive revenue loss and corporate favoritism! We demand independent regulatory oversight by TRAI.",
            "Sir, broadcasting regulations must protect press freedom and journalistic independence. We strongly oppose vague national security clauses that threaten independent media platforms and digital freedom of speech."
        ],
        "Environmental Protection & Clean Energy": [
            "Adhyaksh Mahodaya, amending the Forest Conservation Act exempts massive border and industrial projects from environmental scrutiny! This bill destroys indigenous tribal rights and accelerates deforestation across ecologically fragile zones.",
            "Sabhapati Mahodaya, while talking about green hydrogen, the government is diluting pollution control norms for thermal power plants and mining conglomerates! We protest the sacrifice of environmental safeguards for corporate profit.",
            "Sir, climate change targets cannot be met by displacing traditional forest dwellers and weakening environmental impact assessments. We demand strong protection for biodiversity and statutory rights for tribal communities."
        ]
    }
    
    generated_speeches = []
    speech_counter = 5
    
    for term_info in terms:
        t_name = term_info["name"]
        start_y = term_info["start_year"]
        end_y = term_info["end_year"]
        
        for cat in categories:
            # Generate 200 speeches per term-category pair across the 12 bills (100 ruling, 100 opp) -> 9,600 speeches total
            for i in range(200):
                is_ruling = (i % 2 == 0)
                party_pool = term_info["ruling_parties"] if is_ruling else term_info["opp_parties"]
                party = random.choice(party_pool)
                
                mp_pool = ruling_mps.get(party, ["Shri Member of Parliament"]) if is_ruling else opp_mps.get(party, ["Shri Opposition Member"])
                if not mp_pool:
                    mp_pool = ["Shri Hon. Member"]
                speaker = random.choice(mp_pool)
                
                house = "Lok Sabha" if random.random() > 0.3 else "Rajya Sabha"
                
                # Random date within term
                year = random.randint(start_y, min(end_y, 2026))
                month = random.randint(1, 12)
                day = random.randint(1, 28)
                date_str = f"{year}-{month:02d}-{day:02d}"
                
                # Template selection
                template_pool = ruling_templates[cat] if is_ruling else opp_templates[cat]
                base_text = random.choice(template_pool)
                
                # Add OCR header and line break artifacts
                series_num = "XVII" if "17th" in t_name else ("XVIII" if "18th" in t_name else ("XVI" if "16th" in t_name else "XV"))
                vol_num = random.choice(["I", "II", "III", "IV", "V", "X", "XII", "XIV"])
                page_num = random.randint(10, 450)
                
                if house == "Lok Sabha":
                    header = f"LOK SABHA DEBATES Series {series_num} Vol. {vol_num} Page {page_num}\n"
                else:
                    header = f"RAJYA SABHA DEBATES Part II Page {page_num}\n"
                    
                # Occasionally inject hyphenated line break or procedural noise
                noise_opts = [
                    "",
                    " (Interruptions) ",
                    " (At this stage, several hon. Members came near the Table) ",
                    " (An Hon. Member: Why are you opposing welfare?) "
                ]
                noise = random.choice(noise_opts) if not is_ruling else ""
                
                raw_text = f"{header}{speaker.upper()} ({party}): {base_text}{noise}"
                
                sp_id = f"DEB-{start_y}-{cat[:3].upper()}-{speech_counter:05d}"
                speech_counter += 1
                
                generated_speeches.append({
                    "id": sp_id,
                    "speaker": speaker,
                    "party": party,
                    "house": house,
                    "term": t_name,
                    "date": date_str,
                    "bill_category": cat,
                    "raw_text": raw_text
                })
                
    return generated_speeches

def get_full_corpus():
    """Combines base landmark speeches and parametric generated corpus."""
    base = get_base_landmark_speeches()
    parametric = generate_parametric_speeches()
    return base + parametric
