import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

interface FormData {
  industry: string;
  years: number;
  employees: number;
  revenue_trend: number;
  likability: number;
  market_share: number;
  customer_base: string;
  usp: number;
  digital_skills: number;
  data_management: number;
  profit_margins: number;
  debt: number;
  cash_flow: number;
  email?: string;
  phone?: string;
  supply_chain?: number;
  inventory_management?: number;
  company_name?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function validateFormData(data: FormData): void {
  const requiredFields = [
    'industry',
    'years',
    'employees',
    'revenue_trend',
    'likability',
    'market_share',
    'customer_base',
    'usp',
    'digital_skills',
    'data_management',
    'profit_margins',
    'debt',
    'cash_flow'
  ];

  for (const field of requiredFields) {
    if (data[field as keyof FormData] === undefined || data[field as keyof FormData] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const industryId = parseInt(data.industry);
  if (isNaN(industryId) || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(industryId)) {
    throw new Error('Invalid industry value: must be a number between 1 and 10');
  }

  // Validate numeric ranges with descriptive error messages
  if (data.years < 1 || data.years > 5) throw new Error('Years in business must be between 1 and 5');
  if (data.employees < 1 || data.employees > 5) throw new Error('Number of employees must be between 1 and 5');
  if (data.revenue_trend < 1 || data.revenue_trend > 4) throw new Error('Revenue trend must be between 1 and 4');
  if (data.likability < 1 || data.likability > 3) throw new Error('Customer likability must be between 1 and 3');
  if (data.market_share < 1 || data.market_share > 3) throw new Error('Market share must be between 1 and 3');
  if (data.usp < 1 || data.usp > 3) throw new Error('USP strength must be between 1 and 3');
  if (data.digital_skills < 1 || data.digital_skills > 3) throw new Error('Digital skills must be between 1 and 3');
  if (data.data_management < 1 || data.data_management > 3) throw new Error('Data management must be between 1 and 3');
  if (data.profit_margins < 1 || data.profit_margins > 5) throw new Error('Profit margins must be between 1 and 5');
  if (data.debt < 1 || data.debt > 5) throw new Error('Debt level must be between 1 and 5');
  if (data.cash_flow < 1 || data.cash_flow > 3) throw new Error('Cash flow must be between 1 and 3');

  // Validate retail-specific fields if industry is retail
  if (industryId === 1) {
    if (data.supply_chain === undefined || data.supply_chain === null) {
      throw new Error('Supply chain efficiency is required for retail industry');
    }
    if (data.inventory_management === undefined || data.inventory_management === null) {
      throw new Error('Inventory management is required for retail industry');
    }
    if (data.supply_chain < 1 || data.supply_chain > 3) {
      throw new Error('Supply chain efficiency must be between 1 and 3');
    }
    if (data.inventory_management < 1 || data.inventory_management > 3) {
      throw new Error('Inventory management must be between 1 and 3');
    }
  }
}

function normalizeScore(value: number, scaleMax: number): number {
  return (value - 1) / (scaleMax - 1) * 10;
}

function calculateScore(data: FormData): number {
  const industryId = parseInt(data.industry);
  const isRetail = industryId === 1;

  // Define base weights
  const baseWeights = {
    revenue_trend: 0.20,
    profit_margins: 0.20,
    employees: 0.15,
    digital_maturity: 0.10,
    cash_flow: 0.10,
    market_position: 0.08,
    debt: 0.05,
    data_management: 0.06,
    likability: 0.06
  };

  // For retail, reduce base weights by 20% to make room for supply chain and inventory management
  const weights = { ...baseWeights };
  if (isRetail) {
    for (const key in weights) {
      weights[key as keyof typeof weights] *= 0.8; // Reduce each weight by 20%
    }
  }

  // Calculate normalized scores
  const scores = {
    revenue_trend: normalizeScore(data.revenue_trend, 4),
    profit_margins: normalizeScore(data.profit_margins, 5),
    employees: normalizeScore(data.employees, 5),
    digital_maturity: (normalizeScore(data.digital_skills, 3) + normalizeScore(data.data_management, 3)) / 2,
    cash_flow: normalizeScore(data.cash_flow, 3),
    market_position: normalizeScore(data.market_share, 3),
    debt: normalizeScore(data.debt, 5),
    data_management: normalizeScore(data.data_management, 3),
    likability: normalizeScore(data.likability, 3)
  };

  // Calculate base score using adjusted weights
  let finalScore = 0;
  for (const [key, weight] of Object.entries(weights)) {
    finalScore += scores[key as keyof typeof scores] * weight;
  }

  // For retail, add supply chain and inventory management scores (10% each)
  if (isRetail && data.supply_chain !== undefined && data.inventory_management !== undefined) {
    const supplyChainScore = normalizeScore(data.supply_chain, 3);
    const inventoryScore = normalizeScore(data.inventory_management, 3);
    
    // Add the retail-specific scores with their 10% weights
    finalScore += (supplyChainScore * 0.10) + (inventoryScore * 0.10);
  }

  // Apply digital maturity adjustments
  if (scores.digital_maturity > 7 && scores.employees < 5) {
    finalScore *= 0.95;
  } else if (scores.digital_maturity < 3 && scores.employees > 7) {
    finalScore *= 0.90;
  }

  return Math.round(Math.max(0, Math.min(10, finalScore)) * 100) / 100;
}

async function generateRecommendations(score: number, industryId: number): Promise<string[]> {
  const recommendations: string[] = [];
  
  recommendations.push("Core Recommendations:");
  
  if (score < 4) {
    recommendations.push("- Εστιάστε στη σταθεροποίηση των βασικών επιχειρηματικών λειτουργιών πριν από μεγάλες ψηφιακές επενδύσεις");
    recommendations.push("- Εξετάστε βασικά ψηφιακά εργαλεία για άμεση βελτίωση της αποδοτικότητας");
    recommendations.push("- Ξεκινήστε με βασικά ψηφιακά εργαλεία που έχουν άμεση απόδοση επένδυσης");
    recommendations.push("- Επενδύστε στη βασική ψηφιακή εκπαίδευση της ομάδας σας");
  } else if (score < 7) {
    recommendations.push("- Εφαρμόστε σταδιακά ψηφιακές λύσεις ενώ αναπτύσσετε τις δυνατότητες της ομάδας");
    recommendations.push("- Επενδύστε στην ψηφιακή εκπαίδευση των εργαζομένων");
    recommendations.push("- Εστιάστε σε εργαλεία που βελτιώνουν την επιχειρησιακή αποδοτικότητα");
    recommendations.push("- Εξετάστε την εφαρμογή αυτοματισμού για επαναλαμβανόμενες εργασίες");
  } else {
    recommendations.push("- Επιταχύνετε τις πρωτοβουλίες ψηφιακού μετασχηματισμού");
    recommendations.push("- Εξετάστε προηγμένες λύσεις αυτοματισμού και τεχνητής νοημοσύνης");
    recommendations.push("- Εφαρμόστε ολοκληρωμένα ψηφιακά συστήματα για μέγιστη αποδοτικότητα");
    recommendations.push("- Ηγηθείτε της καινοτομίας στον κλάδο σας μέσω ψηφιακής αριστείας");
  }

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch tool recommendations
  const { data: toolRecommendations, error: toolsError } = await supabase
    .from('digital_tools_recommendations')
    .select('tool_name, priority')
    .eq('industry_id', industryId)
    .order('priority', { ascending: false });

  if (toolsError) {
    console.error('Error fetching tool recommendations:', toolsError);
    throw new Error('Failed to fetch tool recommendations');
  }

  if (toolRecommendations && toolRecommendations.length > 0) {
    recommendations.push("\nRecommended Digital Tools:");
    for (const tool of toolRecommendations) {
      recommendations.push(`${tool.tool_name}\t${tool.priority}`);
    }
  }

  return recommendations;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    const data: FormData = await req.json();
    
    // Validate the input data
    validateFormData(data);

    // Calculate the score
    const score = calculateScore(data);

    // Generate recommendations
    const recommendations = await generateRecommendations(score, parseInt(data.industry));

    // Return the response
    return new Response(
      JSON.stringify({ 
        score,
        recommendations,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in calculate-strategy:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});