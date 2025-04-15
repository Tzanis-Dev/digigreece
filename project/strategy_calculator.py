from typing import TypedDict, List, Union, Optional
from dataclasses import dataclass

class FormData(TypedDict):
    industry: str
    years: int
    employees: int
    revenue_trend: int
    likability: int
    market_share: int
    customer_base: str
    usp: int
    digital_skills: int
    data_management: int
    profit_margins: int
    debt: int
    cash_flow: int
    supply_chain: Optional[int]
    inventory_management: Optional[int]
    email: Optional[str]
    phone: Optional[str]

@dataclass
class StrategyResult:
    score: float
    recommendations: List[str]
    metis_link: str

def normalize_score(value: int, scale_max: int) -> float:
    """Normalize a value to a 0-10 scale."""
    return (value - 1) / (scale_max - 1) * 10

def get_industry_tools(industry_id: int) -> List[tuple[str, int]]:
    """Get the recommended tools for a specific industry."""
    industry_tools = {
        1: [  # Retail
            ('CRM', 8),
            ('E-commerce Platforms', 10),
            ('Accounting and Invoicing', 9),
            ('Marketing Automation Tools', 7),
            ('Cloud Storage and Collaboration', 6),
            ('Analytics and Reporting Tools', 8),
            ('Social Media Presence and SEO', 9),
            ('Mobile App (Loyalty/Purchases)', 7),
            ('Online Appointment Tools', 4),
        ],
        2: [  # Food and Beverages
            ('CRM', 7),
            ('Mobile Ordering App / Site', 8),
            ('QR Code Menus', 9),
            ('E-commerce Platforms', 9),
            ('Accounting and Invoicing', 8),
            ('Marketing Automation Tools', 6),
            ('Cloud Storage and Collaboration', 5),
            ('Social Media Presence and SEO', 9),
            ('Online Appointment Tools', 7),
            ('Project Management Tools', 4),
        ],
        3: [  # Services
            ('Mobile App for Bookings', 8),
            ('CRM', 8),
            ('Accounting and Invoicing', 7),
            ('Marketing Automation Tools', 6),
            ('Cloud Storage and Collaboration', 5),
            ('Social Media Presence and SEO', 8),
            ('Online Appointment Tools', 10),
            ('Project Management Tools', 3),
        ],
        4: [  # Tourism and Leisure
            ('CRM', 9),
            ('E-commerce Platforms', 9),
            ('Accounting and Invoicing', 7),
            ('Project Management Tools', 6),
            ('Marketing Automation Tools', 7),
            ('Cloud Storage and Collaboration', 6),
            ('Dynamic Pricing Tools', 7),
            ('Social Media Presence and SEO', 10),
            ('Online Appointment Tools', 8),
        ],
        5: [  # Education and Arts
            ('CRM', 7),
            ('Virtual Classrooms', 8),
            ('E-commerce Platforms', 8),
            ('Accounting and Invoicing', 7),
            ('Marketing Automation Tools', 6),
            ('Cloud Storage and Collaboration', 7),
            ('Social Media Presence and SEO', 8),
            ('Online Appointment Tools', 6),
            ('Project Management Tools', 5),
        ],
        6: [  # Technology
            ('CRM', 8),
            ('E-commerce Platforms', 6),
            ('Accounting and Invoicing', 9),
            ('Project Management Tools', 10),
            ('Marketing Automation Tools', 7),
            ('Cloud Storage and Collaboration', 9),
            ('Cybersecurity Solutions', 10),
            ('Communication Tools', 9),
            ('Analytics and Reporting Tools', 8),
            ('Social Media Presence and SEO', 7),
        ],
        7: [  # Construction and Maintenance
            ('CRM', 7),
            ('Accounting and Invoicing', 8),
            ('Marketing Automation Tools', 4),
            ('Cloud Storage and Collaboration', 6),
            ('Social Media Presence and SEO', 7),
            ('Online Appointment Tools', 8),
            ('Project Management Tools', 7),
        ],
        8: [  # Transportation
            ('CRM', 6),
            ('Ride-Hailing App Integration', 9),
            ('GPS Fleet Tracking', 8),
            ('Dynamic Route Optimization', 7),
            ('E-commerce Platforms', 9),
            ('Accounting and Invoicing', 7),
            ('Project Management Tools', 6),
            ('Marketing Automation Tools', 5),
            ('Cloud Storage and Collaboration', 5),
            ('Social Media Presence and SEO', 7),
            ('Online Appointment Tools', 8),
        ],
        9: [  # Health and Wellness
            ('CRM', 8),
            ('Accounting and Invoicing', 7),
            ('Marketing Automation Tools', 6),
            ('Cloud Storage and Collaboration', 6),
            ('Social Media Presence and SEO', 8),
            ('Online Appointment Tools', 10),
            ('Wearable Device Integration', 7),
            ('Electronic Health Records (integrations)', 8),
            ('Project Management Tools', 4),
        ],
        10: [  # Manufacturing & Craftsmanship
            ('CRM', 6),
            ('E-commerce Platforms', 9),
            ('Accounting and Invoicing', 7),
            ('Project Management Tools', 5),
            ('Marketing Automation Tools', 5),
            ('Cloud Storage and Collaboration', 6),
            ('Social Media Presence and SEO', 8),
            ('Online Appointment Tools', 3),
            ('Supply Chain Automation', 7),
        ],
    }
    return industry_tools.get(industry_id, [])

def calculate_score(data: FormData) -> float:
    """Calculate the digital readiness score based on form data."""
    # Base weights for scoring
    weights = {
        'revenue_trend': 0.20,
        'profit_margins': 0.20,
        'employees': 0.15,
        'digital_maturity': 0.10,
        'cash_flow': 0.10,
        'market_position': 0.08,
        'debt': 0.05,
        'data_management': 0.06,
        'likability': 0.06
    }

    # Calculate normalized scores
    scores = {
        'revenue_trend': normalize_score(data['revenue_trend'], 4),
        'profit_margins': normalize_score(data['profit_margins'], 5),
        'employees': normalize_score(data['employees'], 5),
        'digital_maturity': (normalize_score(data['digital_skills'], 3) + normalize_score(data['data_management'], 3)) / 2,
        'cash_flow': normalize_score(data['cash_flow'], 3),
        'market_position': normalize_score(data['market_share'], 3),
        'debt': normalize_score(data['debt'], 5),
        'data_management': normalize_score(data['data_management'], 3),
        'likability': normalize_score(data['likability'], 3)
    }

    # Calculate base score
    base_score = sum(scores[key] * weights[key] for key in weights.keys())
    final_score = base_score

    # Industry-specific adjustments
    industry_id = int(data['industry'])
    
    if industry_id == 1:  # Retail
        final_score *= 0.8
        
        if data.get('supply_chain') is not None:
            final_score += normalize_score(data['supply_chain'], 3) * 0.10
        if data.get('inventory_management') is not None:
            final_score += normalize_score(data['inventory_management'], 3) * 0.10

    # Digital maturity vs employee count adjustments
    if scores['digital_maturity'] > 7 and scores['employees'] < 5:
        final_score *= 0.95
    elif scores['digital_maturity'] < 3 and scores['employees'] > 7:
        final_score *= 0.90

    # Ensure score is between 0 and 10
    return round(max(0.0, min(10.0, final_score)), 2)

def generate_recommendations(score: float, data: FormData) -> List[str]:
    """Generate recommendations based on score and form data."""
    recommendations = []

    # Core recommendations based on score
    recommendations.append("Core Recommendations:")
    
    if score < 4:
        recommendations.extend([
            "- Focus on stabilizing core business operations before major digital investments",
            "- Consider basic digital tools for immediate efficiency gains",
            "- Start with essential digital tools that have immediate ROI",
            "- Invest in basic digital skills training for your team"
        ])
    elif score < 7:
        recommendations.extend([
            "- Gradually implement digital solutions while building team capabilities",
            "- Invest in employee digital skills training",
            "- Focus on tools that improve operational efficiency",
            "- Consider implementing automation for repetitive tasks"
        ])
    else:
        recommendations.extend([
            "- Accelerate digital transformation initiatives",
            "- Consider advanced automation and AI-powered solutions",
            "- Implement integrated digital systems for maximum efficiency",
            "- Lead industry innovation through digital excellence"
        ])

    # Add industry-specific tool recommendations
    industry_id = int(data['industry'])
    industry_map = {
        1: "Retail",
        2: "Food and Beverages",
        3: "Services",
        4: "Tourism and Leisure",
        5: "Education and Arts",
        6: "Technology",
        7: "Construction and Maintenance",
        8: "Transportation",
        9: "Health and Wellness",
        10: "Manufacturing & Craftsmanship"
    }
    
    tools = get_industry_tools(industry_id)
    
    if tools:
        recommendations.append("\nRecommended Digital Tools for Your Industry:")
        recommendations.append(f"- Industry: {industry_map.get(industry_id, 'Unknown')}")
        for tool_name, priority in tools:
            recommendations.append(f"{tool_name}\t{priority}")

    return recommendations

def calculate_strategy(data: FormData) -> StrategyResult:
    """Calculate strategy and generate recommendations."""
    score = calculate_score(data)
    recommendations = generate_recommendations(score, data)
    
    return StrategyResult(
        score=score,
        recommendations=recommendations,
        metis_link='https://www.metisagile.com'
    )

# Example usage
if __name__ == "__main__":
    # Sample data for testing
    sample_data: FormData = {
        "industry": "1",  # Retail
        "years": 3,
        "employees": 2,
        "revenue_trend": 3,
        "likability": 2,
        "market_share": 1,
        "customer_base": "B2C",
        "usp": 2,
        "digital_skills": 1,
        "data_management": 1,
        "profit_margins": 3,
        "debt": 2,
        "cash_flow": 2,
        "supply_chain": 2,
        "inventory_management": 2,
        "email": "test@example.com",
        "phone": "+1234567890"
    }
    
    result = calculate_strategy(sample_data)
    print(f"Digital Readiness Score: {result.score}")
    print("\nRecommendations:")
    for rec in result.recommendations:
        print(rec)