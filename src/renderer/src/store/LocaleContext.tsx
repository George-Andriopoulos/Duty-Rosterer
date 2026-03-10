/* eslint-disable react-refresh/only-export-components */
import { JSX, ReactNode, createContext, useContext, useState } from "react";

import { Locale, t } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof t>;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: t(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
};
