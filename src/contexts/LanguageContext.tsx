import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type Language = 'en' | 'sv';

interface Translations {
  welcomeMessage: string;
  title: string;
  subtitle: string;
  popularQuestions: string;
  suggestedQuestions: string[];
  inputPlaceholder: string;
  errorNoAnswer: string;
  errorSomethingWentWrong: string;
  loadingMessages: string[];
}

const translations: Record<Language, Translations> = {
  en: {
    welcomeMessage: 'Hello! 👋 Welcome to Doktor.se. I am your health assistant, and I can help answer your questions about symptoms, diseases, or general health. The information I provide comes from articles published on the Doktor.se website.',
    title: 'Doktor.se',
    subtitle: 'Your health assistant',
    popularQuestions: 'Popular questions',
    suggestedQuestions: [
      'What are the symptoms of a cold?',
      'How do you treat headaches?',
      'When should I seek care?',
    ],
    inputPlaceholder: 'Ask a question about your health...',
    errorNoAnswer: "I couldn't find an answer to your question.",
    errorSomethingWentWrong: 'Something went wrong. Please try again in a moment.',
    loadingMessages: [
      'Thinking for a better response...',
      'Searching through health articles...',
      'Analyzing your question...',
      'Gathering relevant information...',
      'Processing your request...',
      'Finding the best answer...',
      'Consulting medical resources...',
      'Preparing a thoughtful response...',
    ],
  },
  sv: {
    welcomeMessage: 'Hej! 👋 Välkommen till Doktor.se. Jag är din hälsoassistent och kan hjälpa dig att få svar på dina frågor om symtom, sjukdomar eller allmän hälsa. Informationen jag ger kommer från artiklar som publiceras på Doktor.se webbplats.',
    title: 'Doktor.se',
    subtitle: 'Din hälsoassistent',
    popularQuestions: 'Populära frågor',
    suggestedQuestions: [
      'Vad är symtom på förkylning?',
      'Hur behandlar man huvudvärk?',
      'När ska jag söka vård?',
    ],
    inputPlaceholder: 'Ställ en fråga om din hälsa...',
    errorNoAnswer: 'Jag kunde inte hitta ett svar på din fråga.',
    errorSomethingWentWrong: 'Något gick fel. Försök igen om en stund.',
    loadingMessages: [
      'Tänker på ett bättre svar...',
      'Söker igenom hälsoartiklar...',
      'Analyserar din fråga...',
      'Samlar relevant information...',
      'Bearbetar din förfrågan...',
      'Hittar det bästa svaret...',
      'Konsulterar medicinska resurser...',
      'Förbereder ett genomtänkt svar...',
    ],
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  readonly children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('sv');

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
