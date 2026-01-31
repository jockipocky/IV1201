import en from "./en.ts";
import sv from "./sv.ts";

const languages = {
  en,
  sv,
};

export type Language = keyof typeof languages;
export const getDictionary = (lang: Language) => {
  return languages[lang] ?? languages.en;
};
