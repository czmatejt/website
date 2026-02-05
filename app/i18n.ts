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
        create_account: "Create an account",
        signup_subtitle: "Enter your email below to create your account",
        sign_up_btn: "Create Account",
        confirm_password_label: "Confirm Password",
        already_have_account: "Already have an account? Sign In",
        passwords_no_match: "Passwords do not match",
        generic_error: "Something went wrong. Please try again.",
        creating_account: "Creating account...",
        dont_have_account: "Don't have an account? Sign Up",
        reset_password_title: "Reset Password",
        reset_password_subtitle: "Enter your email to receive a reset link",
        enter_new_password_title: "Set New Password",
        enter_new_password_subtitle: "Enter your new password below",
        send_reset_link_btn: "Send Reset Link",
        change_password_btn: "Change Password",
        link_sent_title: "Check your email",
        link_sent_desc: "We have sent a password reset link to",
        password_reset_success: "Password updated! Redirecting to login...",
        back_to_login: "Back to Login",
      },
      theme: {
        toggle: "Toggle theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      language: {
        toggle: "Toggle language",
      },
      portal: {
        welcome: "Welcome to KLUBIS\n(Beta version)",
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
        create_account: "Vytvořit účet",
        signup_subtitle: "Zadejte svůj email pro vytvoření účtu",
        sign_up_btn: "Vytvořit účet",
        confirm_password_label: "Potvrzení hesla",
        already_have_account: "Máte již účet? Přihlaste se",
        passwords_no_match: "Hesla se neshodují",
        generic_error: "Něco se pokazilo. Zkuste to prosím znovu.",
        creating_account: "Vytvářím účet...",
        dont_have_account: "Nemáte účet? Zaregistrujte se",
        reset_password_title: "Obnovení hesla",
        reset_password_subtitle: "Zadejte svůj email pro zaslání odkazu",
        enter_new_password_title: "Nastavit nové heslo",
        enter_new_password_subtitle: "Zadejte své nové heslo níže",
        send_reset_link_btn: "Odeslat odkaz",
        change_password_btn: "Změnit heslo",
        link_sent_title: "Zkontrolujte svůj email",
        link_sent_desc: "Odeslali jsme odkaz pro obnovení hesla na",
        password_reset_success: "Heslo obnoveno! Přesměrovávám na přihlášení...",
        back_to_login: "Zpět na přihlášení",
      },
      theme: {
        toggle: "Přepnout motiv",
        light: "Světlý",
        dark: "Tmavý",
        system: "Systém",
      },
      language: {
        toggle: "Přepnout jazyk",
      },
      portal: {
        welcome: "Vítejte v KLUBISu\n(Beta verze)",
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