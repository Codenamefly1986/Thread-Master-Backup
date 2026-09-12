// Thread Pro theme system.
//
// Color model adopted from Thread Master Pro (bg / surface / primary / text ...),
// extended with a few derived tokens used by the drill/tap tables. Ships 5
// presets plus per-key custom color editing; the active colors are persisted
// via @/src/utils/storage.
//
// Consumers use `useTheme()` to read the active colors (and theme mutators) or
// `makeStyles((colors) => ...)` to build memoized StyleSheets. Never write raw
// color literals inside components.

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { StyleSheet } from "react-native";

import { storage } from "@/src/utils/storage";

export const DEFAULT_COLORS = {
  bg: "#121212",
  surface: "#1E1E1E",
  surfaceElevated: "#2C2C2C",
  border: "#333333",
  borderStrong: "#555555",
  divider: "#2A2A2A",
  primary: "#FF5722",
  primaryDark: "#E64A19",
  primarySoft: "#3E2723",
  onPrimary: "#FFFFFF",
  text: "#E0E0E0",
  textStrong: "#F5F5F5",
  muted: "#9E9E9E",
  dim: "#6B6B6B",
  success: "#2E7D32",
  danger: "#FF5252",
  warning: "#F57F17",
};

export type ThemeColors = typeof DEFAULT_COLORS;

export const presets: { id: string; name: string; description: string; colors: ThemeColors }[] = [
  {
    id: "orange",
    name: "Orange Industrial",
    description: "Obsidian + Safety Orange",
    colors: { ...DEFAULT_COLORS },
  },
  {
    id: "shop",
    name: "Shop Floor",
    description: "Near-black + Amber",
    colors: {
      ...DEFAULT_COLORS,
      bg: "#0A0A0A",
      surface: "#171717",
      surfaceElevated: "#262626",
      border: "#2E2E2E",
      borderStrong: "#4A4A4A",
      divider: "#1E1E1E",
      primary: "#FFB000",
      primaryDark: "#CC8A00",
      primarySoft: "#332600",
      onPrimary: "#0A0A0A",
      text: "#F3F4F6",
      textStrong: "#FFFFFF",
      muted: "#9CA3AF",
      dim: "#6B7280",
      success: "#00E676",
      danger: "#FF3B30",
      warning: "#FFB000",
    },
  },
  {
    id: "highvis",
    name: "High Vis",
    description: "Pure black + Hazard Yellow",
    colors: {
      ...DEFAULT_COLORS,
      bg: "#000000",
      surface: "#111111",
      surfaceElevated: "#1F1F1F",
      border: "#2A2A2A",
      borderStrong: "#444444",
      divider: "#171717",
      primary: "#FFD60A",
      primaryDark: "#CCAB00",
      primarySoft: "#332B00",
      onPrimary: "#000000",
      text: "#F5F5F5",
      textStrong: "#FFFFFF",
      muted: "#A0A0A0",
      dim: "#6E6E6E",
      success: "#00E676",
      danger: "#FF3B30",
      warning: "#FFD60A",
    },
  },
  {
    id: "steel",
    name: "Steel",
    description: "Blueprint navy + Steel Blue",
    colors: {
      ...DEFAULT_COLORS,
      bg: "#0B1220",
      surface: "#152033",
      surfaceElevated: "#1E2E48",
      border: "#243053",
      borderStrong: "#3A4A75",
      divider: "#1B2540",
      primary: "#4DA3FF",
      primaryDark: "#2E7FD6",
      primarySoft: "#0A2A3C",
      onPrimary: "#041018",
      text: "#E8F1FF",
      textStrong: "#FFFFFF",
      muted: "#93A4C0",
      dim: "#6B7A94",
      success: "#22C55E",
      danger: "#FF6B6B",
      warning: "#F59E0B",
    },
  },
  {
    id: "daylight",
    name: "Daylight",
    description: "Warm paper + Ochre",
    colors: {
      bg: "#F3F0E8",
      surface: "#FFFFFF",
      surfaceElevated: "#E7E2D6",
      border: "#D9D4C7",
      borderStrong: "#B8B2A0",
      divider: "#E4DFD2",
      primary: "#C47B00",
      primaryDark: "#A56800",
      primarySoft: "#F6ECD8",
      onPrimary: "#FFFFFF",
      text: "#1A1A1A",
      textStrong: "#000000",
      muted: "#5C5C5C",
      dim: "#7A7A7A",
      success: "#008A45",
      danger: "#C41E3A",
      warning: "#C47B00",
    },
  },
];

export const ACCENT_SWATCHES = [
  "#FF5722", "#FFB000", "#FFD60A", "#4DA3FF",
  "#00E676", "#F97316", "#14B8A8", "#E879F9",
];

const STORAGE_KEY = "threadpro.colors";
const DEFAULT_THEME = presets[0].colors;

export function isLightColor(hex: string): boolean {
  const n = String(hex || "").replace("#", "");
  if (n.length !== 6) return false;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export function colorsMatch(a: ThemeColors, b: ThemeColors): boolean {
  return a.bg === b.bg && a.surface === b.surface && a.primary === b.primary && a.text === b.text;
}

type Ctx = {
  colors: ThemeColors;
  setColors: (c: ThemeColors) => void;
  patchColor: (key: keyof ThemeColors, value: string) => void;
  resetColors: () => void;
};

const ThemeContext = createContext<Ctx>({
  colors: DEFAULT_THEME,
  setColors: () => {},
  patchColor: () => {},
  resetColors: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColorsState] = useState<ThemeColors>(DEFAULT_THEME);

  useEffect(() => {
    (async () => {
      const raw = await storage.getItem<string>(STORAGE_KEY, "");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setColorsState({ ...DEFAULT_THEME, ...parsed });
        } catch {
          /* keep default */
        }
      }
    })();
  }, []);

  const persist = useCallback((c: ThemeColors) => {
    storage.setItem(STORAGE_KEY, JSON.stringify(c));
  }, []);

  const setColors = useCallback((c: ThemeColors) => {
    const next = { ...DEFAULT_THEME, ...c };
    setColorsState(next);
    persist(next);
  }, [persist]);

  const patchColor = useCallback((key: keyof ThemeColors, value: string) => {
    setColorsState((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  }, [persist]);

  const resetColors = useCallback(() => {
    setColorsState({ ...DEFAULT_THEME });
    persist({ ...DEFAULT_THEME });
  }, [persist]);

  const value = useMemo<Ctx>(
    () => ({ colors, setColors, patchColor, resetColors }),
    [colors, setColors, patchColor, resetColors],
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): Ctx {
  return useContext(ThemeContext);
}

// Themed StyleSheet: builds the sheet from the active colors and memoizes it
// until the colors change.
export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

// Type fonts (loaded in app/_layout.tsx via expo-font).
export const fonts = {
  display: "BarlowCondensed",
  displayBold: "BarlowCondensed-Bold",
  mono: "IBMPlexMono",
  monoBold: "IBMPlexMono-Bold",
};
