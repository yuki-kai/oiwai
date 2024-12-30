const white = "#ffffff";
const grey = "#dbdbdb";

export type ColorTheme = {
  Backgroud: {
    primary: string;
  };  
  Text: {
    primary: string;
    secondary: string;
    sub: string;
  }
};

const DEFAULT_THEME: ColorTheme = {
  Backgroud: {
    primary: "#862040", // ワインレッド
  },
  Text: {
    primary: white,
    secondary: "#c9a333", // ゴールド
    sub: grey,
  },
};

const DARK_THEME: ColorTheme = {
  Backgroud: {
    primary: "#202f55", // ネイビー
  },
  Text: {
    primary: white,
    secondary: "#c9a333",
    sub: grey,
  },
};

export const themes = {
  default: DEFAULT_THEME,
  dark: DARK_THEME,
};
