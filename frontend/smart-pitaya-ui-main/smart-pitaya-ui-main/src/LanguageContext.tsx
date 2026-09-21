import { createContext } from "react";

export type LangType = "en" | "kn" | "hi";

export const LanguageContext = createContext<{
  lang: LangType;
  setLang: (lang: LangType) => void;
}>({
  lang: "en",
  setLang: () => {},
});