import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Performance logging utility
const logPerformance = (label: string, startTime: number) => {
  const duration = performance.now() - startTime;
  console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
};

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            data: [
              { id: '1', tool_name: 'CRM', priority: 8 },
              { id: '2', tool_name: 'E-commerce Platform', priority: 9 }
            ],
            error: null
          })
        })
      }),
      insert: () => ({ error: null })
    })
  }
}));

// Mock fetch with timing logs
global.fetch = vi.fn().mockImplementation((url) => {
  const startTime = performance.now();
  const response = url.includes('calculate-strategy')
    ? Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ score: 7.5, status: 'success' })
      })
    : Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });

  return response.then(res => {
    logPerformance(`API Call to ${url}`, startTime);
    return res;
  });
});

const industries = [
  { id: 1, name: 'Λιανικό Εμπόριο', hasRetailFields: true },
  { id: 2, name: 'Τρόφιμα και Ποτά', hasRetailFields: false },
  { id: 3, name: 'Υπηρεσίες', hasRetailFields: false },
  { id: 4, name: 'Τουρισμός και Αναψυχή', hasRetailFields: false },
  { id: 5, name: 'Εκπαίδευση και Τέχνες', hasRetailFields: false },
  { id: 6, name: 'Τεχνολογία', hasRetailFields: false },
  { id: 7, name: 'Κατασκευές και Συντήρηση', hasRetailFields: false },
  { id: 8, name: 'Μεταφορές', hasRetailFields: false },
  { id: 9, name: 'Υγεία και Ευεξία', hasRetailFields: false },
  { id: 10, name: 'Μεταποίηση & Χειροτεχνία', hasRetailFields: false }
];

describe('Assessment Flow for All Industries', () => {
  const baseQuestions = [
    { text: /Πόσους υπαλλήλους/i, answer: '1' },
    { text: /Πόσα χρόνια/i, answer: /Λιγότερο από 1 έτος/i },
    { text: /Πώς θα περιγράφατε την ανάπτυξη/i, answer: /Σταθερότητα/i },
    { text: /Πώς θα αξιολογούσατε τα επίπεδα/i, answer: /Ικανοποιητικά/i },
    { text: /Πώς θα περιγράφατε τη θέση/i, answer: /Μικρός παίκτης/i },
    { text: /Ποιοι είναι οι κύριοι πελάτες/i, answer: /B2C/i },
    { text: /Ποιο είναι το κύριο ανταγωνιστικό/i, answer: /Τιμή/i },
    { text: /Πώς θα αξιολογούσατε τις ψηφιακές/i, answer: /Βασικές/i },
    { text: /Πώς διαχειρίζεστε τα επιχειρηματικά/i, answer: /Χειροκίνητα/i },
    { text: /Ποια είναι τα τρέχοντα περιθώρια/i, answer: '0-5%' },
    { text: /Πώς θα περιγράφατε το επίπεδο/i, answer: /Χωρίς χρέος/i },
    { text: /Πόσο σταθερή είναι/i, answer: /Μέτρια σταθερή/i }
  ];

  const retailQuestions = [
    { text: /Πόσο αποτελεσματική είναι/i, answer: /Μέτρια Αποτελεσματική/i },
    { text: /Πώς διαχειρίζεται η εταιρεία/i, answer: /Επαρκής/i }
  ];

  let user;
  let testStartTime: number;

  beforeEach(() => {
    testStartTime = performance.now();
    console.log('\n🔄 Starting new test...');
    vi.clearAllMocks();
    user = userEvent.setup({ delay: null });
  });

  afterEach(() => {
    logPerformance('Total test duration', testStartTime);
    cleanup();
    vi.resetAllMocks();
  });

  for (const industry of industries) {
    it(`completes assessment for ${industry.name} (ID: ${industry.id})`, async () => {
      console.log(`\n📋 Testing industry: ${industry.name} (ID: ${industry.id})`);
      const stepStartTime = performance.now();

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
      logPerformance('Initial render', stepStartTime);

      // Start assessment
      const navigationStart = performance.now();
      const startButton = screen.getByText(/Έναρξη Αξιολόγησης/i);
      await user.click(startButton);
      logPerformance('Navigation to assessment', navigationStart);

      // Select industry
      const industryStart = performance.now();
      const industryOption = screen.getByText(industry.name);
      await user.click(industryOption);
      logPerformance('Industry selection', industryStart);

      // Answer base questions
      const questionsStart = performance.now();
      for (const question of baseQuestions) {
        const questionStartTime = performance.now();
        const questionElement = screen.getByText(question.text);
        expect(questionElement).toBeInTheDocument();
        
        const answer = screen.getByText(question.answer);
        await user.click(answer);
        logPerformance(`Question: ${question.text}`, questionStartTime);
      }
      logPerformance('Base questions completion', questionsStart);

      // Answer retail-specific questions if applicable
      if (industry.hasRetailFields) {
        const retailStart = performance.now();
        for (const question of retailQuestions) {
          const questionStartTime = performance.now();
          const questionElement = screen.getByText(question.text);
          expect(questionElement).toBeInTheDocument();
          
          const answer = screen.getByText(question.answer);
          await user.click(answer);
          logPerformance(`Retail question: ${question.text}`, questionStartTime);
        }
        logPerformance('Retail questions completion', retailStart);
      }

      // Fill contact info
      const contactStart = performance.now();
      const emailInput = screen.getByLabelText(/Email Address/i);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      await user.type(emailInput, `test${industry.id}@example.com`);
      await user.type(phoneInput, `${industry.id}234567890`);
      logPerformance('Contact info completion', contactStart);

      // Accept consent
      const consentStart = performance.now();
      const consentCheckbox = screen.getByLabelText(/I agree to receive communications/i);
      await user.click(consentCheckbox);
      logPerformance('Consent acceptance', consentStart);

      // Submit assessment
      const submissionStart = performance.now();
      const submitButton = screen.getByText(/Get Your Assessment/i);
      await user.click(submitButton);

      // Verify recommendations are shown
      await waitFor(() => {
        expect(screen.getByText(/Your Digital Readiness Score/i)).toBeInTheDocument();
        expect(screen.getByText(/Core Recommendations/i)).toBeInTheDocument();
        expect(screen.getByText(/Recommended Digital Tools/i)).toBeInTheDocument();
      }, { timeout: 2000 });
      logPerformance('Submission and recommendations display', submissionStart);

    }, 5000);
  }
});