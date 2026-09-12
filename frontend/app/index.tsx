import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { fonts, makeStyles, useTheme } from "@/src/theme";

type MenuItem = {
  id: string;
  icon: string;
  kicker: string;
  title: string;
  desc: string;
  route: any;
};

const THREADS: MenuItem[] = [
  { id: "unified", icon: "ruler", kicker: "INCH · ASME B1.1", title: "UNIFIED", desc: "UNC · UNF · UNEF · UNS · UN", route: { pathname: "/threads", params: { system: "unified" } } },
  { id: "metric", icon: "ruler-square", kicker: "MM · ISO 261 / 262", title: "METRIC", desc: "Coarse · Fine · Extra · Super", route: { pathname: "/threads", params: { system: "metric" } } },
  { id: "pipe", icon: "pipe", kicker: "PIPE · ASME · ISO", title: "PIPE", desc: "NPT · NPTF · BSPP · BSPT", route: { pathname: "/pipe" } },
];

const TOOLS: MenuItem[] = [
  { id: "calculator", icon: "calculator-variant", kicker: "CALCULATOR", title: "DRILL TIP", desc: "", route: { pathname: "/calculator" } },
  { id: "drills", icon: "format-list-bulleted", kicker: "436 SIZES", title: "DRILLS", desc: "Frac · Wire · Letter · Metric", route: { pathname: "/drills" } },
  { id: "tap-chart", icon: "table", kicker: "CUT · FORM", title: "TAP CHART", desc: "", route: { pathname: "/tap-chart" } },
];

const useStyles = makeStyles((c) => ({
  root: { flex: 1, backgroundColor: c.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    letterSpacing: 3,
    color: c.textStrong,
  },
  brandAccent: { color: c.primary },
  gearBtn: {
    width: 44,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: c.muted,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: c.dim,
    marginTop: 16,
    marginBottom: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderLeftWidth: 4,
    borderLeftColor: c.primary,
    borderRadius: 4,
    padding: 16,
    gap: 16,
    minHeight: 88,
  },
  cardPressed: { backgroundColor: c.surfaceElevated, borderColor: c.primary },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardKicker: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5, color: c.primary },
  cardTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    letterSpacing: 1,
    color: c.textStrong,
    lineHeight: 34,
    marginTop: 2,
  },
  cardDesc: { fontFamily: fonts.mono, fontSize: 11, color: c.muted, marginTop: 4 },
  footer: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: c.dim,
    textAlign: "center",
    marginTop: 20,
  },
}));

export default function Home() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const go = (route: any) => {
    Haptics.selectionAsync().catch(() => {});
    router.push(route);
  };

  const renderCard = (item: MenuItem) => (
    <Pressable
      key={item.id}
      testID={`home-card-${item.id}`}
      onPress={() => go(item.route)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconBox}>
        <MaterialDesignIcons name={item.icon as any} size={26} color={colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardKicker}>{item.kicker}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.desc ? <Text style={styles.cardDesc}>{item.desc}</Text> : null}
      </View>
      <MaterialDesignIcons name="chevron-right" size={26} color={colors.primary} />
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <MaterialDesignIcons name="nut" size={22} color={colors.onPrimary} />
          </View>
          <Text style={styles.brand} testID="app-brand">
            THREAD <Text style={styles.brandAccent}>MASTER</Text>
          </Text>
        </View>
        <Pressable
          testID="settings-gear-btn"
          style={styles.gearBtn}
          onPress={() => go({ pathname: "/settings" })}
          accessibilityLabel="Open settings"
        >
          <MaterialDesignIcons name="cog-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>THREAD SPECS</Text>
        {THREADS.map(renderCard)}

        <Text style={styles.sectionLabel}>SHOP TOOLS</Text>
        {TOOLS.map(renderCard)}
      </ScrollView>
    </View>
  );
}
