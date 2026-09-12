import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import drillsData from "@/src/data/drills.json";
import { fonts, makeStyles, useTheme } from "@/src/theme";

type LengthData = { overall_in: number; flute_in: number; shank_in: number };
type Drill = {
  type: string;
  label: string;
  diameter_in: number;
  diameter_mm: number;
  screwMachine?: LengthData;
  jobber?: LengthData;
  taper?: LengthData;
};

const ALL = drillsData as Drill[];

const DESIGNATIONS: { key: "screwMachine" | "jobber" | "taper"; name: string }[] = [
  { key: "screwMachine", name: "SCREW MACHINE" },
  { key: "jobber", name: "JOBBER" },
  { key: "taper", name: "TAPER" },
];

function standardFor(designation: string, type: string): string {
  if (type === "Metric") {
    if (designation === "screwMachine") return "DIN 1897";
    if (designation === "jobber") return "DIN 338";
    if (designation === "taper") return "DIN 340";
    return "";
  }
  return "ASME B94.11M";
}

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
  content: { padding: 16, gap: 20 },
  titleBlock: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderLeftWidth: 4,
    borderLeftColor: c.primary,
    borderRadius: 4,
    padding: 16,
  },
  drillType: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: c.primary },
  drillLabel: { fontFamily: fonts.displayBold, fontSize: 52, letterSpacing: 1, color: c.textStrong, marginTop: 8 },
  dimensions: { flexDirection: "row", marginTop: 12, gap: 24 },
  dimBlock: { flex: 1 },
  dimLabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: c.muted },
  dimValue: { fontFamily: fonts.monoBold, fontSize: 20, color: c.textStrong, marginTop: 4 },
  sectionTitle: { fontFamily: fonts.displayBold, fontSize: 18, letterSpacing: 3, color: c.text, marginBottom: 8 },
  designationCard: { borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, borderRadius: 4, marginBottom: 12 },
  designationHead: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  designationName: { fontFamily: fonts.displayBold, fontSize: 18, letterSpacing: 2, color: c.textStrong },
  designationStd: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: c.muted },
  measRow: { paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.divider },
  measLast: { borderBottomWidth: 0 },
  measLabel: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: c.muted },
  measValuesRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "baseline", marginTop: 6, gap: 16 },
  measValueBlock: { flexDirection: "row", alignItems: "baseline" },
  measValue: { fontFamily: fonts.monoBold, fontSize: 16, color: c.textStrong },
  measUnit: { fontFamily: fonts.mono, fontSize: 11, color: c.muted, marginLeft: 4 },
  emptyNote: { fontFamily: fonts.mono, fontSize: 12, color: c.muted, textAlign: "center", padding: 16, letterSpacing: 1 },
}));

function MeasureRow({ label, value, last }: { label: string; value: number; last?: boolean }) {
  const styles = useStyles();
  const mm = value * 25.4;
  return (
    <View style={[styles.measRow, last && styles.measLast]}>
      <Text style={styles.measLabel}>{label}</Text>
      <View style={styles.measValuesRow}>
        <View style={styles.measValueBlock}>
          <Text style={styles.measValue}>{value.toFixed(4)}</Text>
          <Text style={styles.measUnit}>IN</Text>
        </View>
        <View style={styles.measValueBlock}>
          <Text style={styles.measValue}>{mm.toFixed(2)}</Text>
          <Text style={styles.measUnit}>MM</Text>
        </View>
      </View>
    </View>
  );
}

export default function DrillDetail() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ key: string }>();
  const key = params.key ?? "";
  const drill = ALL.find((d) => `${d.type}:${d.label}` === key);

  if (!drill) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
            <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>NOT FOUND</Text>
        </View>
        <Text style={styles.emptyNote}>Drill size not found.</Text>
      </View>
    );
  }

  const availableCount = DESIGNATIONS.filter((d) => drill[d.key]).length;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
          <MaterialDesignIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>DRILL DETAIL</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.titleBlock} testID="drill-title-block">
          <Text style={styles.drillType}>{drill.type.toUpperCase()}</Text>
          <Text style={styles.drillLabel}>{drill.label}</Text>
          <View style={styles.dimensions}>
            <View style={styles.dimBlock}>
              <Text style={styles.dimLabel}>DIAMETER (IN)</Text>
              <Text style={styles.dimValue} testID="drill-diameter-in">{drill.diameter_in.toFixed(4)}</Text>
            </View>
            <View style={styles.dimBlock}>
              <Text style={styles.dimLabel}>DIAMETER (MM)</Text>
              <Text style={styles.dimValue} testID="drill-diameter-mm">{drill.diameter_mm.toFixed(3)}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>LENGTH DESIGNATIONS</Text>
          {availableCount === 0 && <Text style={styles.emptyNote}>No length data available for this size.</Text>}
          {DESIGNATIONS.map((des) => {
            const data = drill[des.key];
            if (!data) return null;
            return (
              <View key={des.key} style={styles.designationCard} testID={`designation-${des.key}`}>
                <View style={styles.designationHead}>
                  <Text style={styles.designationName}>{des.name}</Text>
                  <Text style={styles.designationStd}>{standardFor(des.key, drill.type)}</Text>
                </View>
                <MeasureRow label="OVERALL LENGTH" value={data.overall_in} />
                <MeasureRow label="FLUTE LENGTH" value={data.flute_in} />
                <MeasureRow label="SHANK / BODY LENGTH" value={data.shank_in} last />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
