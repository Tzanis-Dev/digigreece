import '@testing-library/jest-dom/vitest';

// Mock fetch for Supabase calls
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  
  // Mock successful API response
  (global.fetch as jest.Mock).mockImplementation((url) => {
    if (url.includes('calculate-strategy')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ score: 7.5, status: 'success' })
      });
    }
    
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    });
  });
});

afterEach(() => {
  vi.clearAllMocks();
});