import React, { useState, useEffect, useMemo, ReactNode } from "react";
import {
  I18nContext,
  Language,
  loadLanguage,
  saveLanguage,
  t as translate,
  tArray as translateArray,
} from "./index";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadLanguage().then((savedLang) => {
      setLangState(savedLang);
      setLoaded(true);
    });
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    saveLanguage(newLang);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (path: string, vars?: Record<string, string | number>) =>
        translate(lang, path, vars),
      tArray: (path: string) => translateArray(lang, path),
    }),
    [lang]
  );

  if (!loaded) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
