import React, { useEffect, useState } from 'react';
import { PenTool, Star, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ToolRecommendation {
  id: string;
  industry_id: number;
  tool_name: string;
  priority: number;
  tool_option_name: string;
  price_amount: string;
  description: string;
  created_at: string;
}

const industries = {
  1: 'Retail',
  2: 'Food and Beverages',
  3: 'Services',
  4: 'Tourism and Leisure',
  5: 'Education and Arts',
  6: 'Technology',
  7: 'Construction and Maintenance',
  8: 'Transportation',
  9: 'Health and Wellness',
  10: 'Manufacturing & Craftsmanship'
};

export default function ToolRecommendations() {
  const [recommendations, setRecommendations] = useState<ToolRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<number | 'all'>('all');

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        let query = supabase
          .from('digital_tools_recommendations')
          .select('*')
          .order('priority', { ascending: false });

        if (selectedIndustry !== 'all') {
          query = query.eq('industry_id', selectedIndustry);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching recommendations:', error);
          return;
        }

        setRecommendations(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [selectedIndustry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Tools Recommendations</h1>
            <p className="text-gray-600">
              Browse recommended digital tools and their priority scores for different industries.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Industry
            </label>
            <select
              id="industry"
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">All Industries</option>
              {Object.entries(industries).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-6">
            {Object.entries(industries).map(([industryId, industryName]) => {
              const industryRecommendations = recommendations.filter(
                rec => rec.industry_id === Number(industryId)
              );

              if (selectedIndustry !== 'all' && Number(industryId) !== selectedIndustry) {
                return null;
              }

              if (!industryRecommendations.length) {
                return null;
              }

              return (
                <div key={industryId} className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-blue-600" />
                    {industryName}
                  </h2>
                  <div className="grid gap-4">
                    {industryRecommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 transition-all hover:border-blue-300 hover:shadow-md space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-medium">{rec.tool_name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-gray-600">
                              Priority: {rec.priority}/10
                            </span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Tool:</span>
                              <p className="font-medium text-gray-900">{rec.tool_option_name}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <p className="font-medium text-gray-900">{rec.price_amount}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Description:</span>
                              <p className="font-medium text-gray-900">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}