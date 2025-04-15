import { describe, it, expect } from 'vitest';
import { FormData } from '../types';

// Helper function to create a valid base form data object
function createBaseFormData(industry: string): FormData {
  const baseData: FormData = {
    industry,
    years: 3,
    employees: 2,
    revenue_trend: 3,
    likability: 2,
    market_share: 1,
    customer_base: 'B2C',
    usp: 2,
    digital_skills: 1,
    data_management: 1,
    profit_margins: 3,
    debt: 2,
    cash_flow: 2,
    email: 'test@example.com',
    phone: '+301234567890'
  };

  if (industry === '1') {
    baseData.supply_chain = 2;
    baseData.inventory_management = 2;
  }

  return baseData;
}

describe('Strategy Calculator Validation', () => {
  describe('Input Validation', () => {
    it('should validate required fields', async () => {
      const baseData = createBaseFormData('1');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseData),
      });

      const result = await response.json();
      expect(response.ok).toBe(true);
      expect(result.score).toBeDefined();
      expect(typeof result.score).toBe('number');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(10);
    });

    it('should require retail-specific fields for retail industry', async () => {
      const baseData = createBaseFormData('1');
      delete baseData.supply_chain;
      delete baseData.inventory_management;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseData),
      });

      const result = await response.json();
      expect(response.ok).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should not require retail-specific fields for non-retail industries', async () => {
      const baseData = createBaseFormData('2');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseData),
      });

      const result = await response.json();
      expect(response.ok).toBe(true);
      expect(result.score).toBeDefined();
    });
  });

  describe('Score Calculation', () => {
    it('should calculate higher scores for better performance indicators', async () => {
      const highPerformanceData = createBaseFormData('1');
      Object.assign(highPerformanceData, {
        years: 5,
        employees: 5,
        revenue_trend: 4,
        likability: 3,
        market_share: 3,
        digital_skills: 3,
        data_management: 3,
        profit_margins: 5,
        debt: 1,
        cash_flow: 3,
        supply_chain: 3,
        inventory_management: 3
      });

      const lowPerformanceData = createBaseFormData('1');
      Object.assign(lowPerformanceData, {
        years: 1,
        employees: 1,
        revenue_trend: 1,
        likability: 1,
        market_share: 1,
        digital_skills: 1,
        data_management: 1,
        profit_margins: 1,
        debt: 5,
        cash_flow: 1,
        supply_chain: 1,
        inventory_management: 1
      });

      const [highResponse, lowResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(highPerformanceData),
        }),
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lowPerformanceData),
        })
      ]);

      const [highResult, lowResult] = await Promise.all([
        highResponse.json(),
        lowResponse.json()
      ]);

      expect(highResult.score).toBeGreaterThan(lowResult.score);
    });

    it('should handle edge cases appropriately', async () => {
      const edgeCaseData = createBaseFormData('1');
      Object.assign(edgeCaseData, {
        years: 5,
        employees: 5,
        revenue_trend: 4,
        likability: 3,
        market_share: 3,
        digital_skills: 3,
        data_management: 3,
        profit_margins: 5,
        debt: 1,
        cash_flow: 3,
        supply_chain: 3,
        inventory_management: 3
      });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(edgeCaseData),
      });

      const result = await response.json();
      expect(response.ok).toBe(true);
      expect(result.score).toBeDefined();
      expect(result.score).toBeLessThanOrEqual(10);
    });
  });

  describe('Industry-specific Behavior', () => {
    it('should calculate different scores for different industries with same inputs', async () => {
      const scores = new Map<string, number>();
      const industries = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

      for (const industry of industries) {
        const data = createBaseFormData(industry);
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        expect(response.ok).toBe(true);
        scores.set(industry, result.score);
      }

      // Verify that retail (industry 1) has a different scoring mechanism
      const retailScore = scores.get('1');
      const nonRetailScores = Array.from(scores.entries())
        .filter(([industry]) => industry !== '1')
        .map(([, score]) => score);

      expect(retailScore).not.toBe(nonRetailScores[0]);
    });
  });
});