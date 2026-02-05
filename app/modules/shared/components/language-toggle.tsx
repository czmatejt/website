import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";


export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'cs' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleLang}>
      {i18n.language === 'en' ? 'CS' : 'EN'}
    </Button>
  );
}