import React, { useState, useEffect } from 'react';
import { ArrowRight, Send, ExternalLink, ArrowLeft, Home, HelpCircle, PenTool, AlertCircle, X, Star } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { questions } from '../questions';
import { supabase } from '../lib/supabase';
import type { FormData } from '../types';

interface ToolRecommendation {
  id: string;
  industry_id: number;
  tool_name: string;
  priority: number;
  tool_option_name: string;
  price_amount: string;
  description: string;
  homepage_url: string;
}

const toolOrder = [
  'CRM',
  'E-commerce Platforms',
  'Accounting and Invoicing',
  'Project Management Tools',
  'Marketing Automation Tools',
  'Cloud Storage and Collaboration',
  'Communication Tools',
  'Analytics and Reporting Tools',
  'Social Media tool',
  'Mobile App (Loyalty/Purchases)',
  'Mobile App for Bookings',
  'QR Code Menus',
  'Virtual Classrooms',
  'Dynamic Pricing Tools',
  'GPS Fleet Tracking',
  'Dynamic Route Optimization',
  'Wearable Device Integration',
  'Electronic Health Records (integrations)',
  'Supply Chain Automation'
];

export function AssessmentForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', company_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{
    score: number;
    recommendations: string[];
    metisLink: string;
  } | null>(null);
  const [consent, setConsent] = useState(false);
  const [showConsentOverlay, setShowConsentOverlay] = useState(false);
  const [toolRecommendations, setToolRecommendations] = useState<ToolRecommendation[]>([]);
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);

  useEffect(() => {
    async function fetchToolRecommendations() {
      if (!formData.industry) return;

      const { data, error } = await supabase
        .from('digital_tools_recommendations')
        .select('*')
        .eq('industry_id', parseInt(formData.industry));

      if (error) {
        console.error('Error fetching tool recommendations:', error);
        return;
      }

      const sortedData = [...(data || [])].sort((a, b) => {
        const indexA = toolOrder.indexOf(a.tool_name);
        const indexB = toolOrder.indexOf(b.tool_name);
        
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        return b.priority - a.priority;
      });

      setToolRecommendations(sortedData);
    }

    if (result) {
      fetchToolRecommendations();
    }
  }, [formData.industry, result]);

  const handleToolClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTooltipClick = (index: number) => {
    setOpenTooltip(openTooltip === index ? null : index);
  };

  const renderRecommendationSection = (title: string, items: string[]) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-left flex items-center gap-2">
          <PenTool className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        {title === "Προτεινόμενα Ψηφιακά Εργαλεία" && (
          <p className="text-sm text-gray-600 mb-6 text-justify">
            Σας προτείνουμε τις βασικές και οικονομικότερες επιλογές εργαλείων, ορισμένες από τις οποίες είναι δωρεάν, 
            με δυνατότητα αναβάθμισης για περισσότερους χρήστες ή πρόσθετες λειτουργίες. Επικοινωνήστε μαζί μας μέσω του{' '}
            <button
              onClick={() => handleToolClick('https://www.metisagile.com')}
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              metisAgile.com
              <ExternalLink className="w-3 h-3" />
            </button>
            {' '}για να σας προτείνουμε περισσότερες εξατομικευμένες λύσεις.
          </p>
        )}
        <div className="space-y-4">
          {title === "Βασικές Συστάσεις" ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 text-blue-500" />
                  <p className="text-gray-700 text-left">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            toolRecommendations.map((rec) => (
              <div key={rec.id} className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="md:flex md:items-center md:justify-between text-center md:text-left">
                  <span className="text-gray-800 font-medium block mb-2 md:mb-0">{rec.tool_name}</span>
                  <div className="flex items-center justify-center md:justify-end gap-1 mb-4 md:mb-0">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Προτεραιότητα: {rec.priority}/10
                    </span>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-3 md:gap-4 space-y-4 md:space-y-0 text-sm pt-4 border-t border-gray-100">
                  <div className="text-center md:text-left">
                    <span className="text-gray-500 block">Προτεινόμενο εργαλείο:</span>
                    <button 
                      onClick={() => handleToolClick(rec.homepage_url)}
                      className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 hover:underline justify-center md:justify-start"
                    >
                      {rec.tool_option_name}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-gray-500 block">Τιμή:</span>
                    <p className="font-medium text-gray-900">{rec.price_amount}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-gray-500 block">Περιγραφή:</span>
                    <p className="font-medium text-gray-900">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const getCurrentQuestion = () => {
    let questionIndex = 0;
    let currentIndex = 0;
    
    while (questionIndex < questions.length) {
      const question = questions[questionIndex];
      
      if (!question.showIf || question.showIf(formData)) {
        if (currentIndex === currentQuestion) {
          return { question, index: questionIndex };
        }
        currentIndex++;
      }
      questionIndex++;
    }
    
    return null;
  };

  const getTotalQuestions = () => {
    return questions.filter(q => !q.showIf || q.showIf(formData)).length;
  };

  const totalQuestions = getTotalQuestions();
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQuestionData = getCurrentQuestion();

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setValidationErrors([]);
    }
  };

  const goToStart = () => {
    setCurrentQuestion(0);
    setFormData({});
    setValidationErrors([]);
  };

  const validateAnswer = (value: number | number[]) => {
    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      return 'Παρακαλώ επιλέξτε μια απάντηση';
    }
    return null;
  };

  const handleAnswer = (value: number | number[]) => {
    if (!currentQuestionData) return;
    
    const { question } = currentQuestionData;
    const validationError = validateAnswer(value);
    
    if (validationError) {
      setValidationErrors([validationError]);
      return;
    }
    
    setValidationErrors([]);
    
    if (question.multiple) {
      const currentValues = Array.isArray(formData[question.id as keyof FormData]) 
        ? (formData[question.id as keyof FormData] as number[])
        : [];
      
      const newValues = currentValues.includes(value as number) 
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      setFormData(prev => ({
        ...prev,
        [question.id]: newValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [question.id]: value
      }));
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const validateContactInfo = () => {
    const errors: string[] = [];
    
    if (!contactInfo.email) {
      errors.push('Η διεύθυνση email είναι υποχρεωτική');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.push('Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email');
    }
    
    if (!contactInfo.phone) {
      errors.push('Το τηλέφωνο είναι υποχρεωτικό');
    } else if (!/^[+]?[\d\s-]{10,}$/.test(contactInfo.phone)) {
      errors.push('Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου');
    }

    if (!contactInfo.company_name) {
      errors.push('Το όνομα επιχείρησης είναι υποχρεωτικό');
    }

    return errors;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactInfo();
    
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const submissionData = {
        ...formData,
        ...contactInfo,
      };

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-strategy`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.details || 
                           responseData.error || 
                           responseData.message || 
                           'Αποτυχία επεξεργασίας της αξιολόγησης. Παρακαλώ δοκιμάστε ξανά.';
        throw new Error(errorMessage);
      }

      if (!responseData.score && responseData.score !== 0) {
        throw new Error('Μη έγκυρη απάντηση: λείπει η βαθμολογία');
      }

      const { score, recommendations } = responseData;

      const { error: dbError } = await supabase
        .from('survey_responses')
        .insert([{
          ...submissionData,
          score
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Αποτυχία αποθήκευσης της απάντησης στη βάση δεδομένων');
      }

      setResult({
        score,
        recommendations,
        metisLink: 'https://www.metisagile.com'
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Προέκυψε ένα μη αναμενόμενο σφάλμα');
    } finally {
      setLoading(false);
    }
  };

  const handleNextForMultiple = () => {
    if (currentQuestionData?.question.multiple) {
      const value = formData[currentQuestionData.question.id as keyof FormData];
      const validationError = validateAnswer(value as number[]);
      
      if (validationError) {
        setValidationErrors([validationError]);
        return;
      }
      
      setValidationErrors([]);
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const ConsentOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={() => setShowConsentOverlay(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Δήλωση Συναίνεσης για την Επεξεργασία Προσωπικών Δεδομένων
        </h3>
        
        <div className="prose prose-sm text-gray-600 mb-6 space-y-4">
          <p>
            Δια της παρούσης, δηλώνω ότι παρέχω τη ρητή, ελεύθερη, ειδική και εν πλήρει επιγνώσει συγκατάθεσή μου προς την εταιρεία Metis Agile, για τη συλλογή, αποθήκευση, διαχείριση και επεξεργασία των προσωπικών μου δεδομένων, στο πλαίσιο της συμμόρφωσης με τον Κανονισμό (ΕΕ) 2016/679 του Ευρωπαϊκού Κοινοβουλίου και του Συμβουλίου (Γενικός Κανονισμός για την Προστασία Δεδομένων – GDPR).
          </p>
          
          <p>Τα δεδομένα μου δύνανται να χρησιμοποιηθούν αποκλειστικά και μόνο για σκοπούς που άπτονται:</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>της ποιοτικής και λειτουργικής βελτίωσης των παρεχόμενων προϊόντων και υπηρεσιών της εταιρείας,</li>
            <li>της εσωτερικής ανάλυσης, ερμηνείας και αξιολόγησης δεδομένων με σκοπό την εξαγωγή επιχειρησιακών συμπερασμάτων,</li>
            <li>της επικοινωνίας μαζί μου, είτε για ενημέρωση σχετικά με υπηρεσίες και δράσεις της Metis Agile, είτε για σκοπούς συμμετοχής σε έρευνες, αξιολογήσεις ή άλλες σχετικές πρωτοβουλίες.</li>
          </ul>
          
          <p>
            Έχω λάβει γνώση της πολιτικής απορρήτου της εταιρείας και αναγνωρίζω ότι διαθέτω όλα τα νόμιμα δικαιώματα πρόσβασης, διόρθωσης, διαγραφής, περιορισμού επεξεργασίας και εναντίωσης, όπως αυτά προβλέπονται από το εφαρμοστέο εθνικό και ευρωπαϊκό νομικό πλαίσιο.
          </p>
          
          <div className="flex items-start gap-3 mt-6">
            <input
              type="checkbox"
              id="consentCheckbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) {
                  setShowConsentOverlay(false);
                }
              }}
              className="mt-1"
            />
            <label htmlFor="consentCheckbox" className="text-sm text-gray-700">
              Συμφωνώ με τους ανωτέρω όρους και παρέχω τη συγκατάθεσή μου για την επεξεργασία των προσωπικών μου δεδομένων από την Metis Agile.
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setShowConsentOverlay(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Άκυρο
          </button>
          <button
            onClick={() => {
              setConsent(true);
              setShowConsentOverlay(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Αποδοχή
          </button>
        </div>
      </div>
    </div>
  );

  if (result) {
    const coreRecs: string[] = [];
    const toolRecs: string[] = [];
    let currentCategory = coreRecs;

    result.recommendations.forEach(rec => {
      if (rec === "Core Recommendations:") {
        currentCategory = coreRecs;
      } else if (rec === "\nRecommended Digital Tools:") {
        currentCategory = toolRecs;
      } else if (rec.startsWith("-")) {
        currentCategory.push(rec.substring(2));
      } else if (rec.includes("\t")) {
        const [tool, priority] = rec.split("\t");
        currentCategory.push(`${tool} (Προτεραιότητα: ${priority}/10)`);
      }
    });

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Βαθμολογία Ψηφιακής Ετοιμότητας</h2>
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-600">{result.score}</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray={`${result.score * 10}, 100`}
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-8">
            {result.score < 4 ? 'Χαμηλή Ψηφιακή Ετοιμότητα' :
             result.score < 7 ? 'Μέτρια Ψηφιακή Ετοιμότητα' :
             'Προχωρημένη Ψηφιακή Ετοιμότητα'}
          </p>

          {renderRecommendationSection('Βασικές Συστάσεις', coreRecs)}
          {renderRecommendationSection('Προτεινόμενα Ψηφιακά Εργαλεία', toolRecs)}
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Χρειάζεστε εξειδικευμένη καθοδήγηση για την εφαρμογή αυτών των συστάσεων;
          </p>
          <a
            href={result.metisLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Επισκεφθείτε τη MetisAgile <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      {showConsentOverlay && <ConsentOverlay />}
      
      <div className="flex justify-between mb-6">
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors ${
            currentQuestion === 0 ? 'invisible' : ''
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Πίσω
        </button>
        <button
          onClick={goToStart}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Home className="w-4 h-4" />
          Επανεκκίνηση
        </button>
      </div>

      {currentQuestionData && currentQuestion < totalQuestions ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestionData.question.text}
            </h2>
            <div className="space-y-3">
              {currentQuestionData.question.options.map((option, index) => (
                <Tooltip.Provider key={option.value} delayDuration={0}>
                  <Tooltip.Root open={openTooltip === index}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAnswer(option.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg border ${
                          currentQuestionData.question.multiple &&
                          Array.isArray(formData[currentQuestionData.question.id as keyof FormData]) &&
                          (formData[currentQuestionData.question.id as keyof FormData] as number[])?.includes(option.value)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        } transition-colors flex items-center justify-between group`}
                      >
                        <span>{option.label}</span>
                        <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      {'tooltip' in option && (
                        <Tooltip.Trigger asChild>
                          <button 
                            className="p-1 hover:text-blue-600 transition-colors touch-manipulation"
                            onClick={(e) => {
                              e.preventDefault();
                              handleTooltipClick(index);
                            }}
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </Tooltip.Trigger>
                      )}
                    </div>
                    {'tooltip' in option && (
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm max-w-xs z-50"
                          sideOffset={5}
                          onPointerDownOutside={() => setOpenTooltip(null)}
                        >
                          {option.tooltip}
                          <Tooltip.Arrow className="fill-gray-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    )}
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
            </div>
            {validationErrors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {validationErrors.map((error, index) => (
                  <p key={index} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                ))}
              </div>
            )}
            {currentQuestionData.question.multiple && (
              <button
                onClick={handleNextForMultiple}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Συνέχεια
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Ερώτηση {currentQuestion + 1} από {totalQuestions}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Σχεδόν έτοιμοι!</h2>
          <p className="text-gray-600 mb-8">
            Παρακαλώ συμπληρώστε τα στοιχεία επικοινωνίας σας για να λάβετε την εξατομικευμένη αξιολόγηση ψηφιακής ετοιμότητας.
          </p>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {validationErrors.map((error, index) => (
                <p key={index} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>
          )}
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Διεύθυνση Email
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-blue-500 focus:border-transparent"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Τηλέφωνο
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Όνομα επιχείρησης
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company_name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={contactInfo.company_name}
                onChange={(e) => setContactInfo(prev => ({ ...prev, company_name: e.target.value }))}
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="consent"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              <label 
                htmlFor="consent" 
                className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConsentOverlay(true);
                }}
              >
                Συμφωνώ να λαμβάνω ενημερώσεις σχετικά με την αξιολόγηση ψηφιακής ετοιμότητας και συναφείς υπηρεσίες.
              </label>
            </div>
            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Επεξεργασία...' : 'Λήψη Αξιολόγησης'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}