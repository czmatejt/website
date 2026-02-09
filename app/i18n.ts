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
          no_upcoming_trainings: "No upcoming trainings",
          no_sessions_scheduled_desc: "You don't have any training sessions scheduled. Create your first group to get started."
        },
        attendance: {
          attendance_title: "Attendance",
          select_date_verify_athletes: "Select a date to verify athletes.",
          today: "Today",
          no_sessions_found: "No sessions found",
          abbreviation_e: "E",
          trainers_payroll: "Trainers (Payroll)",
          athletes: "Athletes",
          training_content: "Training Content",
          content_placeholder: "What did you do today?",
          save_attendance: "Save Attendance",
          saving: "Saving...",
          status_present: "Present",
          status_absent: "Absent",
          status_excused: "Excused",
          status_unmarked: "Unmarked",
          mark_all_present: "Mark All Present",
          reset_all: "Reset All",
          save_success: "Attendance saved successfully!",
          save_error: "Failed to save attendance.",
          select_date: "Select a Date"
        },
        group: {
          loading: "Loading...",
          basic_information: "Basic Information",
          group_name: "Group Name",
          group_name_placeholder: "e.g. Elite Sprinters",
          description: "Description",
          description_placeholder: "Describe the group's purpose and goals...",
          training_day: "Training Day",
          school_year: "School Year",
          schedule_settings: "Schedule Settings",
          start_time: "Start Time",
          duration_min: "Duration (min)",
          default_location: "Default Location",
          location_placeholder_summer: "e.g. Outdoor Stadium",
          location_placeholder_winter: "e.g. Indoor Gym",
          select_day: "Select day",
          select_year: "Select year",
          summer: "Summer",
          winter: "Winter"
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
        page_not_found_desc: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.",
        go_home: "Go Home",
        log_in: "Log In",
        report_a_bug: "Report a Bug",
        loading_session: "Loading session...",
        loading: "Loading...",
        no_email: "No email",
        access_denied: "Access Denied"
      },
      welcome: {
        whats_next: "What's next?",
        react_router_docs: "React Router Docs",
        join_discord: "Join Discord"
      },
      days: {
        monday: "Monday",
        tuesday: "Tuesday", 
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
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
      },
      trainer: {
        verified: "(Ověřeno)",
        cancelled: "Zrušeno",
        finished: "Dokončeno",
        dashboard: {
          your_schedule: "Váš rozvrh",
          next_meet: "Další setkání",
          no_meets_scheduled_soon: "Žádná setkání nejsou brzy naplánována.",
          quick_actions: "Rychlé akce",
          add_member_import_results: "Přidat člena, importovat výsledky...",
          no_upcoming_trainings: "Žádné nadcházející tréninky",
          no_sessions_scheduled_desc: "Nemáte naplánované žádné tréninky. Vytvořte svou první skupinu pro začátek."
        },
        attendance: {
          attendance_title: "Docházka",
          select_date_verify_athletes: "Vyberte datum pro ověření sportovců.",
          today: "Dnes",
          no_sessions_found: "Nenalezeny žádné relace",
          abbreviation_e: "O",
          trainers_payroll: "Trenéři (Výplatní listina)",
          athletes: "Sportovci",
          training_content: "Obsah tréninku",
          content_placeholder: "Co jste dnes dělali?",
          save_attendance: "Uložit docházku",
          saving: "Ukládání...",
          status_present: "Přítomen",
          status_absent: "Nepřítomen",
          status_excused: "Omluvený",
          status_unmarked: "Neoznačeno",
          mark_all_present: "Označit všechny jako přítomné",
          reset_all: "Resetovat vše",
          save_success: "Docházka byla úspěšně uložena!",
          save_error: "Nepodařilo se uložit docházku.",
          select_date: "Vyberte datum"
        },
        group: {
          loading: "Načítání...",
          basic_information: "Základní informace",
          group_name: "Název skupiny",
          group_name_placeholder: "např. Elitní sprinterky",
          description: "Popis",
          description_placeholder: "Popište účel a cíle skupiny...",
          training_day: "Tréninkový den",
          school_year: "Školní rok",
          schedule_settings: "Nastavení rozvrhu",
          start_time: "Čas začátku",
          duration_min: "Délka (min)",
          default_location: "Výchozí lokace",
          location_placeholder_summer: "např. Venkovní stadion",
          location_placeholder_winter: "např. Vnitřní hala",
          select_day: "Vyberte den",
          select_year: "Vyberte rok",
          summer: "Léto",
          winter: "Zima"
        }
      },
      shared: {
        account: "Účet",
        settings: "Nastavení",
        logout: "Odhlásit se",
        product: "Produkt",
        features: "Funkce",
        pricing: "Ceny",
        login: "Přihlášení",
        support: "Podpora",
        help_center: "Centrum nápovědy",
        privacy_policy: "Zásady ochrany osobních údajů",
        terms_of_service: "Podmínky služby",
        follow_us: "Sledujte nás",
        no_module_found: "Modul nenalezen.",
        page_not_found: "Stránka nenalezena",
        page_not_found_desc: "Omlouváme se, stránku kterou hledáte se nepodařilo najít. Možná byla přesunuta nebo smazána.",
        go_home: "Domů",
        log_in: "Přihlásit se",
        report_a_bug: "Nahlásit chybu",
        loading_session: "Načítání relace...",
        loading: "Načítání...",
        no_email: "Žádný email",
        access_denied: "Přístup zamítnut"
      },
      welcome: {
        whats_next: "Co dál?",
        react_router_docs: "Dokumentace React Router",
        join_discord: "Připojit se na Discord"
      },
      days: {
        monday: "Pondělí",
        tuesday: "Úterý",
        wednesday: "Středa",
        thursday: "Čtvrtek",
        friday: "Pátek",
        saturday: "Sobota",
        sunday: "Neděle"
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