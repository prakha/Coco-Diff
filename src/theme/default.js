import { extendTheme } from "@chakra-ui/react";

const fontSizes = {
  header: "1.3rem",
  heading: "20px",
  lgHeading: "2.34vw",
};

const styles = {
  global: {
    "html, body, p, span, button , h1, h2, h3, h4, h5, h6": {
      fontFamily: "Lato, sans-serif",
    },
  },
};

const defaultTheme = extendTheme({
  fontSizes,
  styles,
  // fonts: {
  //   heading: 'Lato',
  //   body: 'Lato',
  // },
  
  colors: {
    brand: {
      blue: "#4285F4",
      yellow: "#fea528",
      red: "#DB4437",
      green: "#0F9D58",
      cyan: "#06d6d6",
      secondary:'#3C4043B2',
      glaucous: '#5886D4',
      rbl: '#4864D1',
      redAccent: '#e02a1f',
      redAccentLight: '#fdf2f3',
      redAccentDark: '#b32219'
    },

    primary: {
      50: "#ECEEF9",
      100: "#CACFED",
      200: "#A7B0E1",
      300: "#8591D6",
      400: "#6372CA",
      500: "#4053BF",
      600: "#334299",
      700: "#273272",
      800: "#1A214C",
      900: "#0D1126",
    },
    accent: {
      50: "#FEF4E7",
      100: "#FBE1BC",
      200: "#F8CD90",
      300: "#F6B965",
      400: "#F3A63A",
      500: "#F1920E",
      600: "#C0750C",
      700: "#905809",
      800: "#603B06",
      900: "#301D03",
    },
    error: {
      50: "#FBEAE9",
      100: "#F5C5C2",
      200: "#EFA09A",
      300: "#E87B72",
      400: "#E2564B",
      500: "#DC3123",
      600: "#B0271C",
      700: "#841D15",
      800: "#58130E",
      900: "#2C0A07",
    },
    success: {
      50: "#EBFAEC",
      100: "#C6F0CB",
      200: "#A2E7AA",
      300: "#7DDE89",
      400: "#59D467",
      500: "#34CB46",
      600: "#2AA238",
      700: "#1F7A2A",
      800: "#15511C",
      900: "#0A290E",
    },
    decent: {
      50: "#E8F9FD",
      100: "#BEEEF9",
      200: "#94E3F5",
      300: "#6AD8F1",
      400: "#40CDED",
      500: "#16C1E9",
      600: "#129BBA",
      700: "#0D748C",
      800: "#094D5D",
      900: "#04272F",
    },

    primaryBlue: {
      50: "#4285F45D",
      100: "#2B7DE9AA",
      200: "#2B7DE9CC",
      300: "#2B7DE9",
      400: "#4285F4",
    },
    lightGrayBlue: "#EFF3F6",
    lightGreen: "#269818",
    darkGreen: "#268818",

    text: {
      100: "#3C4043AA", // Lighter
      200: "#3C4043BC", // Light
      // 300: "#3C4043", // Dark
      300: "#3C4043EA", // Dark
    },
  },
  radii: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
});

export { defaultTheme };
