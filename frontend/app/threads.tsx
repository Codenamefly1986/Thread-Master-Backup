import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { getThreadsBySystem } from "@/src/data/threads";
import { fonts, makeStyles, useTheme } from "@/src/theme";

type SystemId = "unified" | "metric" | "npt" | "nptf" | "bspp" | "bspt";

const TITLE_MAP: Record<SystemId, { title: string; sub: string; placeholder: string }> = {
  unified: { title: "UNIFIED", sub: "INCH · ASME B1.1", placeholder: "Search 1/4-20, #6, UNF" },
  metric: { title: "METRIC", sub: "MM · ISO 261 / 262", placeholder: "Search M6, 1.5, Fine" },
  npt: { title: "NPT", sub: "PIPE · ASME B1.20.1", placeholder: "Search 1/4, 3/8, 1/2" },
  nptf: { title: "NPTF", sub: "DRYSEAL · ASME B1.20.3", placeholder: "Search 1/4, 3/8, 1/2" },
  bspp: { title: "BSPP", sub: "BRITISH · ISO 228 (G)", placeholder: "Search G 1/4, G 1/2" },
  bspt: { title: "BSPT", sub: "BRITISH · ISO 7-1 (R)", placeholder: "Search R 1/4, R 1/2" },
};

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
  headerCol: { flex: 1 },
  kicker: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5, color: c.primary },
  headerTitle: { fontFamily: fonts.displayBold, fontSize: 22, letterSpacing: 3, color: c.textStrong },
  count: { fontFamily: fonts.mono, fontSize: 11, color: c.muted },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: { flex: 1, fontFamily: fonts.mono, fontSize: 15, color: c.text },
  sep: { height: 1, backgroundColor: c.divider },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, minHeight: 68, gap: 8 },
  rowPressed: { backgroundColor: c.surface },
  rowTitle: { fontFamily: fonts.monoBold, fontSize: 17, color: c.textStrong },
  rowMeta: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8, flexWrap: "wrap" },
  rowMetaText: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: c.dim },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: fonts.mono, fontSize: 13, color: c.muted },
}));

export default function ThreadsList() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { system } = useLocalSearchParams<{ system: SystemId }>();
  const sys: SystemId = (["metric", "npt", "nptf", "bspp", "bspt"] as SystemId[]).includes(system as SystemId)
    ? (system as SystemId)
    : "unified";
  const [query, setQuery] = useState("");

  const all = useMemo(() => getThreadsBySystem(sys), [sys]);
  const filtered = useMemo(() => {
    if (!query.trim()) return all;
    const q = query.toLowerCase().replace(/\s+/g, "");
    return all.filter((t: any) => {
      const lab = t.label.toLowerCase().replace(/\s+/g, "");
      return lab.includes(q) || String(t.series).toLowerCase().includes(q);
    });
  }, [all, query]);

  const meta = TITLE_MAP[sys];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCol}>
          <Text style={styles.kicker}>{meta.sub}</Text>
          <Text style={styles.headerTitle}>{meta.title}</Text>
        </View>
        <Text style={styles.count} testID="thread-count">{filtered.length}/{all.length}</Text>
      </View>

      <View style={styles.searchWrap}>
        <MaterialDesignIcons name="magnify" size={18} color={colors.muted} />
        <TextInput
          testID="search-input"
          placeholder={meta.placeholder}
          placeholderTextColor={colors.dim}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable testID="clear-search" onPress={() => setQuery("")} hitSlop={10}>
            <MaterialDesignIcons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <FlatList
        testID="thread-list"
        data={filtered}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        initialNumToRender={30}
        renderItem={({ item }: { item: any }) => (
          <Pressable
            testID={`thread-item-${item.id}`}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              router.push({ pathname: "/spec", params: { id: item.id } } as any);
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.label}</Text>
              <View style={styles.rowMeta}>
                <Text style={styles.rowMetaText}>{item.series}</Text>
                <View style={styles.dot} />
                <Text style={styles.rowMetaText}>
                  {sys === "metric" ? `${item.pitch.toFixed(2)} mm pitch` : `${item.tpi} TPI`}
                </Text>
                <View style={styles.dot} />
                <Text style={styles.rowMetaText}>
                  {sys === "metric" ? `Ø ${item.diameter} mm` : `Ø ${item.diameter.toFixed(4)}"`}
                </Text>
              </View>
            </View>
            <MaterialDesignIcons name="chevron-right" size={20} color={colors.primary} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialDesignIcons name="magnify" size={32} color={colors.dim} />
            <Text style={styles.emptyText}>No threads match &quot;{query}&quot;</Text>
          </View>
        }
      />
    </View>
  );
}
