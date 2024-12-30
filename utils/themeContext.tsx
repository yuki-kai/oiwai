import React, { createContext, ReactNode, useMemo, useState } from "react";
import { ColorTheme, themes } from "@/constants/ColorTheme";

export type ContextValue<T extends ColorTheme> = {
  theme: T;
  changeTheme: (theme: T) => void;
};

const defaultValue = {
  theme: themes.default,
  changeTheme: () => undefined,
};

const ThemeContext = createContext<ContextValue<any>>(defaultValue);

type Props = {
  initialTheme: ColorTheme;
  children: ReactNode;
};

const ThemeProvider = (props: Props) => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(props.initialTheme);
  const contextValue = useMemo<ContextValue<any>>(() => {
    return {
      theme: currentTheme,
      changeTheme: theme => setCurrentTheme(theme),
    };
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={ contextValue }>
      {props.children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
