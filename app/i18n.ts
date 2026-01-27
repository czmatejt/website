import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 1. Define your translations here (or import from .json files later)
const resources = {
  en: {
    translation: {
      auth: {
        welcome_back: "Welcome back",
        login_subtitle: "Enter your email to sign in",
        sign_in_btn: "Sign In",
        email_label: "Email",
        password_label: "Password",
        forgot_password: "Forgot your password?",
      },
      theme: {
        toggle: "Toggle theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      }
    }
  },
  cs: {
    translation: {
      auth: {
        welcome_back: "Vítejte zpět",
        login_subtitle: "Pro přihlášení zadejte svůj email",
        sign_in_btn: "Přihlásit se",
        email_label: "Email",
        password_label: "Heslo",
        forgot_password: "Zapomněli jste heslo?",
      },
      theme: {
        toggle: "Přepnout téma",
        light: "Světlé",
        dark: "Tmavé",
        system: "Systém",
      }
    }
  }
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