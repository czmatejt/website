import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { email } from "zod";

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
        welcome: "Welcome to KLUBIS\n(Beta)",
      },
      account: {
        profile: "Profile",
        profile_description: "This is how others will see you on the site.",
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
        enter: "Enter your {{field}}",
        personal_information: "Personal Information",
        security: {
          title: "Security",
          description: "Manage your password and account security.",
          change_password: "Change Password",
          ensure_long_password: "Ensure your account is using a long, random password to stay secure.",
          current_password_label: "Current Password",
          new_password_label: "New Password",
          confirm_password_label: "Confirm Password",
          update_password_btn: "Update Password",
          session_management_title: "Session Management",
          session_management_desc: "If you suspect your account was compromised, you can log out of all devices immediately.",
          logout_all_devices_prompt: "Log out of all devices?",
          revoke_sessions_btn: "Revoke All Sessions",
          confirm_revoke_prompt: "Are you sure? You will be logged out of this device too.",
          passwords_no_match_toast: "New passwords do not match.",
          password_update_success_toast: "Password updated successfully.",
          password_update_failed_toast: "Failed to update password.",
          sessions_revoked_success_toast: "All sessions revoked. Signing out...",
          sessions_revoked_failed_toast: "Failed to revoke sessions."
        }
      },
      buttons: {
        save: "Save Changes",
      },
      trainer: {
        verified: "(Verified)",
        cancelled: "Cancelled",
        finished: "Finished",
        dashboard: {
          your_schedule: "Your Schedule",
          next_meet: "Next Meet",
          no_meets_scheduled_soon: "No meets scheduled soon.",
          quick_actions: "Quick Actions",
          add_member_import_results: "Add Member, Import Results...",
          no_upcoming_trainings: "No upcoming trainings"
        },
        attendance: {
          attendance_title: "Attendance",
          select_date_verify_athletes: "Select a date to verify athletes.",
          today: "Today",
          no_sessions_found: "No sessions found",
          abbreviation_e: "E"
        },
        group: {
          loading: "Loading...",
          basic_information: "Basic Information",
          group_name: "Group Name",
          training_day: "Training Day",
          school_year: "School Year",
          schedule_settings: "Schedule Settings",
          start_time: "Start Time",
          duration_min: "Duration (min)"
        }
      },
      shared: {
        account: "Account",
        settings: "Settings",
        logout: "Log out",
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        login: "Login",
        support: "Support",
        help_center: "Help Center",
        privacy_policy: "Privacy Policy",
        terms_of_service: "Terms of Service",
        follow_us: "Follow Us",
        no_module_found: "No module found.",
        page_not_found: "Page not found",
        go_home: "Go Home",
        report_a_bug: "Report a Bug",
        loading_session: "Loading session...",
        access_denied: "Access Denied"
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
        welcome: "Vítejte v KLUBISu\n(Beta)",
      },
      account: {
        profile: "Profil",
        profile_description: "Takto vás uvidí ostatní na webu.",
        first_name: "Jméno",
        last_name: "Příjmení",
        email: "Email",
        enter: "Zadejte své {{field}}"
        ,
        security: {
          title: "Zabezpečení",
          description: "Spravujte své bezpečnostní nastavení.",
          change_password: "Změna hesla",
          ensure_long_password: "Ujistěte se, že vaše heslo je dostatečně dlouhé.",
          current_password_label: "Aktuální heslo",
          new_password_label: "Nové heslo",
          confirm_password_label: "Potvrzení hesla",
          update_password_btn: "Změnit heslo",
          session_management_title: "Správa přihlášení",
          session_management_desc: "Pokud máte podezření, že váš účet byl kompromitován, můžete se okamžitě odhlásit ze všech zařízení.",
          logout_all_devices_prompt: "Odhlásit se ze všech zařízení?",
          revoke_sessions_btn: "Odhlásit se ze všech zařízení",
          confirm_revoke_prompt: "Opravdu se chcete odhlásit ze všech zařízení? Budete odhlášeni i z tohoto zařízení.",
          passwords_no_match_toast: "Hesla se neshodují",
          password_update_success_toast: "Heslo bylo úspěšně změněno",
          password_update_failed_toast: "Nepodařilo se změnit heslo",
          sessions_revoked_success_toast: "Odhlášení ze všech zařízení proběhlo úspěšně. Probíhá odhlašování...",
          sessions_revoked_failed_toast: "Nepodařilo se odhlásit ze všech zařízení"
        }
      },
      buttons: {
        save: "Uložit změny",
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