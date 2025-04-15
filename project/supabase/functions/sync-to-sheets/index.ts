import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { config } from './config.ts';

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
  supply_chain?: number;
  inventory_management?: number;
  email: string;
  phone: string;
  score: number;
}

const SHEET_ID = '1XtShl6qqqB15-Z9DJHVYxHaNSmJq14KxGz4f0rii2j4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function appendToSheet(data: FormData) {
  try {
    const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    if (!apiKey) {
      throw new Error('Google Sheets API key is not configured');
    }

    const industries = {
      '1': 'Retail',
      '2': 'Food and Beverages',
      '3': 'Services',
      '4': 'Tourism and Leisure',
      '5': 'Education and Arts',
      '6': 'Technology',
      '7': 'Construction and Maintenance',
      '8': 'Transportation',
      '9': 'Health and Wellness',
      '10': 'Manufacturing & Craftsmanship'
    };

    const values = [
      new Date().toISOString(),
      industries[data.industry as keyof typeof industries] || data.industry,
      data.years.toString(),
      data.employees.toString(),
      data.revenue_trend.toString(),
      data.likability.toString(),
      data.market_share.toString(),
      data.customer_base,
      data.usp.toString(),
      data.digital_skills.toString(),
      data.data_management.toString(),
      data.profit_margins.toString(),
      data.debt.toString(),
      data.cash_flow.toString(),
      data.supply_chain?.toString() || 'N/A',
      data.inventory_management?.toString() || 'N/A',
      data.email,
      data.phone,
      data.score.toString()
    ];

    const range = 'Sheet1!A:S';
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=RAW`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values],
        majorDimension: 'ROWS'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error response:', errorText);
      throw new Error(`Google Sheets API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in appendToSheet:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!req.body) {
      throw new Error('Request body is empty');
    }

    const data: FormData = await req.json();
    
    // Validate required fields
    const requiredFields = ['industry', 'email', 'phone', 'score'];
    for (const field of requiredFields) {
      if (!data[field as keyof FormData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    await appendToSheet(data);

    return new Response(
      JSON.stringify({ status: 'success' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in sync-to-sheets function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to sync data',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});