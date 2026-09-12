import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import drillsData from "@/src/data/drills.json";
import { fonts, makeStyles, useTheme } from "@/src/theme";

type LengthData = { overall_in: number; flute_in: number; shank_in: number };
type Drill = {
  type: "Fractional" | "Wire" | "Letter" | "Metric";
  label: string;
  diameter_in: number;
  diameter_mm: number;
  screwMachine?: LengthData;
  jobber?: LengthData;
  taper?: LengthData;
};

const ALL_DRILLS = drillsData as Drill[];

const FILTERS: { key: "ALL" | "Fractional" | "Wire" | "Letter" | "Metric"; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "Fractional", label: "FRAC" },
  { key: "Wire", label: "WIRE" },
  { key: "Letter", label: "LETTER" },
  { key: "Metric", label: "MM" },
];

type SearchMode = "in" | "mm";

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
  headerCount: { fontFamily: fonts.mono, fontSize: 11, color: c.muted },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, fontFamily: fonts.mono, fontSize: 14, color: c.text },
  searchModeRow: { flexDirection: "row", marginHorizontal: 12, marginBottom: 8, gap: 6 },
  searchModeBtn: {
    flex: 1,
    height: 34,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  searchModeBtnActive: { borderColor: c.primary, backgroundColor: c.primarySoft },
  searchModeText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: c.muted },
  searchModeTextActive: { color: c.primary },
  filterRow: { flexDirection: "row", paddingHorizontal: 12, paddingBottom: 8, gap: 6 },
  chip: {
    flex: 1,
    flexShrink: 0,
    height: 34,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: { borderColor: c.primary, backgroundColor: c.primarySoft },
  chipText: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: c.muted },
  chipTextActive: { color: c.primary },
  tableHead: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: c.borderStrong,
    backgroundColor: c.surfaceElevated,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  th: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: c.muted },
  row: { flexDirection: "row", paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.divider, alignItems: "center" },
  rowAlt: { backgroundColor: c.surface },
  rowPressed: { backgroundColor: c.surfaceElevated },
  cell: { fontFamily: fonts.mono, fontSize: 11, color: c.text },
  cellRight: { textAlign: "right" },
  cellMuted: { color: c.dim },
  colFrac: { flex: 1 },
  colWL: { flex: 1 },
  colMet: { flex: 1 },
  colDecIn: { flex: 1.5 },
  colDecMm: { flex: 1.5 },
  empty: { padding: 32, alignItems: "center" },
  emptyText: { fontFamily: fonts.mono, fontSize: 12, color: c.muted, letterSpacing: 1 },
}));

export default function DrillsList() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("ALL");
  const [searchMode, setSearchMode] = useState<SearchMode>("in");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_DRILLS.filter((d) => {
      if (filter !== "ALL" && d.type !== filter) return false;
      if (!q) return true;
      if (searchMode === "in") return d.diameter_in.toFixed(4).includes(q) || d.label.toLowerCase().includes(q);
      return d.diameter_mm.toFixed(3).includes(q) || d.label.toLowerCase().includes(q);
    });
  }, [query, filter, searchMode]);

  const renderRow = ({ item, index }: { item: Drill; index: number }) => {
    const isFrac = item.type === "Fractional";
    const isWL = item.type === "Wire" || item.type === "Letter";
    const isMet = item.type === "Metric";
    const key = `${item.type}:${item.label}`;
    return (
      <Pressable
        testID={`drill-row-${index}`}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          router.push({ pathname: "/drill/[key]", params: { key } } as any);
        }}
        style={({ pressed }) => [styles.row, index % 2 === 1 && styles.rowAlt, pressed && styles.rowPressed]}
      >
        <Text style={[styles.cell, styles.colFrac, !isFrac && styles.cellMuted]}>{isFrac ? item.label : "·"}</Text>
        <Text style={[styles.cell, styles.colWL, !isWL && styles.cellMuted]}>{isWL ? item.label : "·"}</Text>
        <Text style={[styles.cell, styles.colMet, !isMet && styles.cellMuted]}>{isMet ? item.label : "·"}</Text>
        <Text style={[styles.cell, styles.colDecIn, styles.cellRight]}>{item.diameter_in.toFixed(4)}</Text>
        <Text style={[styles.cell, styles.colDecMm, styles.cellRight]}>{item.diameter_mm.toFixed(3)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>DRILLS</Text>
        <Text style={styles.headerCount} testID="drills-count">{filtered.length}</Text>
      </View>

      <View style={styles.searchWrap}>
        <MaterialDesignIcons name="magnify" size={18} color={colors.muted} />
        <TextInput
          testID="drills-search"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search size…"
          placeholderTextColor={colors.dim}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <Pressable testID="clear-search-btn" onPress={() => setQuery("")}>
            <MaterialDesignIcons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <View style={styles.searchModeRow} testID="search-mode-row">
        <Pressable testID="search-mode-in" onPress={() => setSearchMode("in")} style={[styles.searchModeBtn, searchMode === "in" && styles.searchModeBtnActive]}>
          <Text style={[styles.searchModeText, searchMode === "in" && styles.searchModeTextActive]}>DECIMAL INCH</Text>
        </Pressable>
        <Pressable testID="search-mode-mm" onPress={() => setSearchMode("mm")} style={[styles.searchModeBtn, searchMode === "mm" && styles.searchModeBtnActive]}>
          <Text style={[styles.searchModeText, searchMode === "mm" && styles.searchModeTextActive]}>DECIMAL MM</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              testID={`filter-${f.key}`}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setFilter(f.key);
              }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tableHead}>
        <Text style={[styles.th, styles.colFrac]}>FRAC</Text>
        <Text style={[styles.th, styles.colWL]}>W/L</Text>
        <Text style={[styles.th, styles.colMet]}>METRIC</Text>
        <Text style={[styles.th, styles.colDecIn, styles.cellRight]}>DEC IN</Text>
        <Text style={[styles.th, styles.colDecMm, styles.cellRight]}>DEC MM</Text>
      </View>

      <FlatList
        testID="drills-list"
        data={filtered}
        keyExtractor={(item) => `${item.type}:${item.label}`}
        renderItem={renderRow}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO MATCHES</Text>
          </View>
        }
        initialNumToRender={40}
        windowSize={11}
        removeClippedSubviews
      />
    </View>
  );
}
