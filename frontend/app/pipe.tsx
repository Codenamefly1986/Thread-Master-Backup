import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { fonts, makeStyles, useTheme } from "@/src/theme";

const PIPE_OPTIONS = [
  { id: "npt", title: "NPT", kicker: "ASME B1.20.1", desc: "Tapered National Pipe Thread", range: "1/16 – 1\"" },
  { id: "nptf", title: "NPTF", kicker: "ASME B1.20.3", desc: "Dryseal — seals without sealant", range: "1/16 – 1\"" },
  { id: "bspp", title: "BSPP", kicker: "ISO 228 (G)", desc: "British parallel pipe thread", range: "G 1/16 – G 1" },
  { id: "bspt", title: "BSPT", kicker: "ISO 7-1 (R)", desc: "British tapered pipe thread", range: "R 1/16 – R 1" },
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
  body: { flex: 1, padding: 16 },
  intro: { fontFamily: fonts.mono, fontSize: 12, color: c.muted, lineHeight: 18, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderLeftWidth: 4,
    borderLeftColor: c.primary,
    borderRadius: 4,
    padding: 14,
    minHeight: 150,
  },
  cardPressed: { backgroundColor: c.surfaceElevated, borderColor: c.primary },
  cardKicker: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, color: c.primary },
  cardTitle: { fontFamily: fonts.displayBold, fontSize: 30, letterSpacing: 1, color: c.textStrong, marginTop: 6 },
  cardDesc: { fontFamily: fonts.mono, fontSize: 11, color: c.text, marginTop: 8, lineHeight: 16 },
  cardRange: { fontFamily: fonts.mono, fontSize: 11, color: c.muted, marginTop: 8 },
}));

export default function PipeSelector() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>PIPE THREADS</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.grid}>
          {PIPE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              testID={`pipe-select-${opt.id}`}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                router.push({ pathname: "/threads", params: { system: opt.id } } as any);
              }}
            >
              <Text style={styles.cardKicker}>{opt.kicker}</Text>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.desc}</Text>
              <Text style={styles.cardRange}>{opt.range}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
