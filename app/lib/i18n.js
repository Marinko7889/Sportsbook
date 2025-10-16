import en from "../../locales/en.json";
import hr from "../../locales/hr.json";

const translations = { en, hr };

export const t = (key, locale = "en") => {
  return translations[locale][key] || key;
};
