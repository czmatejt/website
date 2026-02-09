import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { email } from "zod";
import cs from "./translations/cs";
import en from "./translations/en";

// 1. Define your translations here (or import from .json files later)
const resources = {
  en: en,
  cs: cs
};

i18n
  .use(LanguageDetector) // Detects browser language automatically
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "cs", // Default to Czech if something fails
    interpolation: {
      escapeValue: false // React handles escaping automatically
    }
  });

export default i18n;