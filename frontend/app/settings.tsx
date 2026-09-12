import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import {
  ACCENT_SWATCHES,
  colorsMatch,
  fonts,
  makeStyles,
  presets,
  useTheme,
  type ThemeColors,
} from "@/src/theme";

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: "bg", label: "Background" },
  { key: "surface", label: "Cards / Surface" },
  { key: "primary", label: "Accent" },
  { key: "text", label: "Primary Text" },
  { key: "muted", label: "Secondary Text" },
];

const useStyles = makeStyles((c) => ({
  root: { flex: 1, backgroundColor: c.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 4 },
  headerTitle: { fontFamily: fonts.displayBold, fontSize: 22, letterSpacing: 3, color: c.textStrong, flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16 },
  section: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: c.dim,
    marginTop: 20,
    marginBottom: 10,
  },
  presetGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  presetCard: {
    width: "48%",
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    padding: 12,
    minHeight: 92,
  },
  presetCardActive: { borderColor: c.primary, borderLeftWidth: 4, backgroundColor: c.surfaceElevated },
  swatchRow: { flexDirection: "row", gap: 6, marginBottom: 10 },
  miniSwatch: { width: 18, height: 18, borderRadius: 3, borderWidth: 1, borderColor: c.border },
  presetName: { fontFamily: fonts.displayBold, fontSize: 16, letterSpacing: 1, color: c.textStrong },
  presetDesc: { fontFamily: fonts.mono, fontSize: 10, color: c.muted, marginTop: 2 },
  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 6, padding: 14 },
  divider: { height: 1, backgroundColor: c.divider, marginVertical: 6 },
  colorRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 },
  colorSwatch: { width: 36, height: 36, borderRadius: 4, borderWidth: 1, borderColor: c.borderStrong },
  colorLabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: c.muted },
  hexInput: { fontFamily: fonts.monoBold, fontSize: 16, color: c.text, marginTop: 2, padding: 0 },
  accentRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  accentDot: { width: 40, height: 40, borderRadius: 4, borderWidth: 2, borderColor: "transparent" },
  accentDotActive: { borderColor: c.textStrong },
  resetBtn: {
    marginTop: 24,
    minHeight: 52,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 4,
    backgroundColor: c.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  resetText: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, color: c.primary },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.divider,
  },
  infoLabel: { fontFamily: fonts.mono, fontSize: 12, color: c.muted, letterSpacing: 1 },
  infoValue: { fontFamily: fonts.monoBold, fontSize: 12, color: c.text },
}));

function ColorField({ label, value, onChange, testID }: { label: string; value: string; onChange: (v: string) => void; testID: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);

  const apply = (raw: string) => {
    setDraft(raw);
    const v = raw.trim();
    if (/^#([0-9A-Fa-f]{6})$/.test(v)) onChange(v);
  };

  return (
    <View style={styles.colorRow}>
      <View style={[styles.colorSwatch, { backgroundColor: value }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.colorLabel}>{label}</Text>
        <TextInput
          testID={testID}
          value={draft}
          onChangeText={apply}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="#000000"
          placeholderTextColor={colors.dim}
          style={styles.hexInput}
        />
      </View>
    </View>
  );
}

export default function Settings() {
  const styles = useStyles();
  const { colors, setColors, patchColor, resetColors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>SETTINGS</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.section}>THEME PRESETS</Text>
        <View style={styles.presetGrid}>
          {presets.map((p) => {
            const active = colorsMatch(colors, p.colors);
            return (
              <Pressable
                key={p.id}
                testID={`theme-preset-${p.id}`}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setColors({ ...p.colors });
                }}
                style={[styles.presetCard, active && styles.presetCardActive]}
              >
                <View style={styles.swatchRow}>
                  <View style={[styles.miniSwatch, { backgroundColor: p.colors.bg }]} />
                  <View style={[styles.miniSwatch, { backgroundColor: p.colors.surface }]} />
                  <View style={[styles.miniSwatch, { backgroundColor: p.colors.primary }]} />
                  <View style={[styles.miniSwatch, { backgroundColor: p.colors.text }]} />
                </View>
                <Text style={[styles.presetName, active && { color: colors.primary }]}>{p.name.toUpperCase()}</Text>
                <Text style={styles.presetDesc}>{p.description}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>CUSTOM COLORS</Text>
        <View style={styles.card}>
          {COLOR_FIELDS.map((f, i) => (
            <View key={f.key}>
              {i > 0 ? <View style={styles.divider} /> : null}
              <ColorField label={f.label} value={colors[f.key]} testID={`color-${f.key}`} onChange={(v) => patchColor(f.key, v)} />
            </View>
          ))}
        </View>

        <Text style={styles.section}>ACCENT SWATCHES</Text>
        <View style={styles.accentRow}>
          {ACCENT_SWATCHES.map((hex) => (
            <Pressable
              key={hex}
              testID={`accent-swatch-${hex}`}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                patchColor("primary", hex);
              }}
              style={[styles.accentDot, { backgroundColor: hex }, colors.primary.toUpperCase() === hex.toUpperCase() && styles.accentDotActive]}
            />
          ))}
        </View>

        <Pressable testID="reset-colors" onPress={resetColors} style={styles.resetBtn}>
          <MaterialDesignIcons name="refresh" size={16} color={colors.primary} />
          <Text style={styles.resetText}>RESET TO ORANGE INDUSTRIAL</Text>
        </Pressable>

        <Text style={styles.section}>ABOUT</Text>
        <View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>APP</Text>
            <Text style={styles.infoValue}>THREAD MASTER</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>VERSION</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>THREAD STANDARDS</Text>
            <Text style={styles.infoValue}>ASME B1.1 · ISO 261</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DRILL STANDARDS</Text>
            <Text style={styles.infoValue}>B94.11M · DIN 338</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
