import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import tapsData from "@/src/data/taps.json";
import { fonts, makeStyles, useTheme } from "@/src/theme";

type Row = { thread: string; drill: string };
type TapData = {
  cutting: { unified: Row[]; metric: Row[]; npt: Row[] };
  forming: { unified: Row[]; metric: Row[] };
};
const DATA = tapsData as TapData;
type Mode = "cutting" | "forming";

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
  modeRow: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.border,
    padding: 4,
    gap: 4,
    margin: 12,
  },
  modeBtn: { flex: 1, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 2 },
  modeBtnActive: { backgroundColor: c.primary },
  modeBtnText: { fontFamily: fonts.displayBold, fontSize: 16, letterSpacing: 3, color: c.muted },
  modeBtnTextActive: { color: c.onPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 12 },
  section: {
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  sectionHead: {
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: c.primary,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontFamily: fonts.displayBold, fontSize: 20, letterSpacing: 3, color: c.textStrong },
  sectionCount: { fontFamily: fonts.mono, fontSize: 11, color: c.muted },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: c.borderStrong,
    backgroundColor: c.surfaceElevated,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  th: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: c.muted, flex: 1 },
  thRight: { textAlign: "right" },
  row: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: c.divider },
  rowLast: { borderBottomWidth: 0 },
  cell: { fontFamily: fonts.mono, fontSize: 13, color: c.text, flex: 1 },
  cellRight: { textAlign: "right", fontFamily: fonts.monoBold, color: c.textStrong },
}));

function ListSection({ title, rows }: { title: string; rows: Row[] }) {
  const styles = useStyles();
  return (
    <View style={styles.section} testID={`taps-section-${title.toLowerCase()}`}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
        <Text style={styles.sectionCount}>{rows.length} SIZES</Text>
      </View>
      <View style={styles.tableHead}>
        <Text style={styles.th}>THREAD</Text>
        <Text style={[styles.th, styles.thRight]}>DRILL</Text>
      </View>
      {rows.map((r, i) => (
        <View key={`${title}-${i}-${r.thread}`} style={[styles.row, i === rows.length - 1 && styles.rowLast]}>
          <Text style={styles.cell}>{r.thread}</Text>
          <Text style={[styles.cell, styles.cellRight]}>{r.drill}</Text>
        </View>
      ))}
    </View>
  );
}

export default function TapChart() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("cutting");

  const switchMode = (m: Mode) => {
    Haptics.selectionAsync().catch(() => {});
    setMode(m);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>TAP CHART</Text>
      </View>

      <View style={styles.modeRow} testID="tap-mode-row">
        <Pressable testID="tap-mode-cutting" style={[styles.modeBtn, mode === "cutting" && styles.modeBtnActive]} onPress={() => switchMode("cutting")}>
          <Text style={[styles.modeBtnText, mode === "cutting" && styles.modeBtnTextActive]}>CUTTING</Text>
        </Pressable>
        <Pressable testID="tap-mode-forming" style={[styles.modeBtn, mode === "forming" && styles.modeBtnActive]} onPress={() => switchMode("forming")}>
          <Text style={[styles.modeBtnText, mode === "forming" && styles.modeBtnTextActive]}>FORMING</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}>
        {mode === "cutting" ? (
          <>
            <ListSection title="Unified" rows={DATA.cutting.unified} />
            <ListSection title="Metric" rows={DATA.cutting.metric} />
            <ListSection title="NPT" rows={DATA.cutting.npt} />
          </>
        ) : (
          <>
            <ListSection title="Unified" rows={DATA.forming.unified} />
            <ListSection title="Metric" rows={DATA.forming.metric} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
