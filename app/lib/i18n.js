import en from "../../locales/en.json";
import hr from "../../locales/hr.json";
import es from "../../locales/es.json";
const translations = { en, hr, es };

export const t = (key, locale = "en") => {
  return translations[locale][key] || key;
};
