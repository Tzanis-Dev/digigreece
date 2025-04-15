import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Brain, LineChart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Digi Greece
            </h1>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ψηφιακή Αξιολόγηση Μετασχηματισμού Μικρομεσαίων Επιχειρήσεων
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Η πλατφόρμα μας χρησιμοποιεί τεχνητή νοημοσύνη και μηχανική μάθηση για να αναλύσει τα δεδομένα της εταιρείας σας και να παρέχει εξατομικευμένες προτάσεις ψηφιοποίησης. Μοιραστείτε με ασφάλεια βασικές πληροφορίες και λάβετε στρατηγικές προτάσεις προσαρμοσμένες στις ανάγκες και το στάδιο ανάπτυξης της επιχείρησής σας.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Έναρξη Αξιολόγησης
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Γιατί η Ψηφιοποίηση Έχει Σημασία</h3>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-4xl mx-auto">
            Στον σημερινό ταχέως εξελισσόμενο, τεχνολογικά προηγμένο κόσμο, ο ψηφιακός μετασχηματισμός δεν είναι πλέον προαιρετικός—είναι απαραίτητος. Η υιοθέτηση ψηφιακών εργαλείων και διαδικασιών βελτιώνει την αποδοτικότητα, την εμπειρία των πελατών και τη λήψη αποφάσεων. Δίνει τη δυνατότητα στις επιχειρήσεις να προσαρμόζονται γρήγορα, να αναπτύσσονται βιώσιμα και να παραμένουν ανταγωνιστικές σε διαρκώς εξελισσόμενες αγορές.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <LineChart className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Επιχειρηματική Ανάπτυξη</h4>
            <p className="text-gray-600">
              Επιταχύνετε την ανάπτυξη της επιχείρησής σας μέσω του ψηφιακού μετασχηματισμού και καινοτόμων λύσεων.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Αποφάσεις Βασισμένες σε Δεδομένα</h4>
            <p className="text-gray-600">
              Λάβετε τεκμηριωμένες αποφάσεις βασισμένες σε δεδομένα πραγματικού χρόνου και αναλύσεις για να παραμείνετε μπροστά από τον ανταγωνισμό.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Προτάσεις με Τεχνητή Νοημοσύνη</h4>
            <p className="text-gray-600">
              Αξιοποιήστε την τεχνητή νοημοσύνη για να ανακαλύψετε ευκαιρίες και να βελτιστοποιήσετε τις επιχειρηματικές σας διαδικασίες.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}