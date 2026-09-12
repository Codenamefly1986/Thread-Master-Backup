import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { getThreadById } from "@/src/data/threads";
import {
  basicDimensions, classLimits, classesFor, tapDrill, bestWireSize,
  minWireSize, maxWireSize, threeWireM, closestDrill, fmtIn, fmtMm, INCH_TO_MM,
  threadDepthHeight, nptThreadDepth, bspThreadDepth,
} from "@/src/utils/calculations";
import { fonts, useTheme, type ThemeColors } from "@/src/theme";

const PERCENTS = [50, 55, 60, 65, 70, 75];

function classDescription(cls: string) {
  const map: Record<string, string> = {
    "1A": "Loose fit, easy assembly. Generous tolerance.",
    "2A": "General-purpose external. Standard commercial fastener fit.",
    "3A": "Close fit, no allowance. Precision applications.",
    "1B": "Loose fit internal. Easy assembly with damage / dirt.",
    "2B": "General-purpose internal. Standard commercial nut fit.",
    "3B": "Close fit internal. Precision / aerospace applications.",
  };
  return map[cls] ?? "";
}

export default function SpecScreen() {
  const { colors: c } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => buildStyles(c), [c]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useMemo(() => (id ? getThreadById(id) : null), [id]);

  const [threadType, setThreadType] = useState<"external" | "internal">("external");
  const [cls, setCls] = useState<string>("2A");
  const [percent, setPercent] = useState<number>(75);
  const [tapType, setTapType] = useState<"cutting" | "forming">("cutting");
  const [wireInput, setWireInput] = useState<string>("");

  const renderHeader = (title: string) => (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable testID="back-btn" style={styles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
        <MaterialDesignIcons name="arrow-left" size={24} color={c.text} />
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
    </View>
  );

  if (!thread) {
    return (
      <View style={styles.root}>
        {renderHeader("NOT FOUND")}
        <Text style={styles.notFound}>Thread not found.</Text>
      </View>
    );
  }

  // NPT / NPTF — tapered pipe thread (no class system)
  if (thread.system === "npt" || thread.system === "nptf") {
    const npt = thread as any;
    const isNPTF = thread.system === "nptf";
    const standardLabel = isNPTF ? "DRYSEAL · ASME B1.20.3" : "PIPE · ASME B1.20.1";
    const tapDrillLabel = isNPTF ? "NPTF DRYSEAL TAP DRILL" : "STANDARD NPT TAP DRILL";
    const tapDrillFooter = isNPTF
      ? "Per ASME B1.20.3 (Dryseal) — seals pipe joints without thread sealant."
      : "Per ASME B1.20.1 — without reamer, for general-purpose threading.";
    const nptDepth = nptThreadDepth(thread.pitch);
    return (
      <View style={styles.root}>
        {renderHeader(thread.label)}
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{standardLabel} · TAPERED</Text>
            <Text style={styles.title}>{thread.label}</Text>
            <View style={styles.titleMeta}>
              <MetaItem label="OD" value={`${thread.diameter.toFixed(4)} in`} />
              <MetaItem label="TPI" value={`${thread.tpi}`} />
              <MetaItem label="PITCH" value={`${thread.pitch.toFixed(4)} in`} />
            </View>
          </View>

          <SectionLabel text="Specifications" />
          <View style={styles.specCard}>
            <SpecRow label="Outside Dia (OD)" v={thread.diameter} fmt={(n) => fmtIn(n, 4)} alt={fmtMm(thread.diameter * INCH_TO_MM, 3)} unit="in" altUnit="mm" />
            <Divider />
            <SpecRow label="Threads / Inch" v={thread.tpi} fmt={(n) => n.toString()} alt="—" unit="TPI" altUnit="" />
            <SpecRow label="Pitch" v={thread.pitch} fmt={(n) => fmtIn(n, 4)} alt={fmtMm(thread.pitch * INCH_TO_MM, 3)} unit="in" altUnit="mm" />
            <Divider />
            <SpecRow label="Thread Depth/Height" v={nptDepth} fmt={(n) => fmtIn(n, 4)} alt={fmtMm(nptDepth * INCH_TO_MM, 3)} unit="in" altUnit="mm" highlight />
            <Divider />
            <SpecRow label="Taper" v={0.0625} fmt={() => '1:16 (0.0625"/in)'} alt="3/4 in/ft" unit="" altUnit="" />
            <Divider />
            <SpecRow label={isNPTF ? "Tap Drill (NPTF)" : "Tap Drill (NPT)"} v={npt.tapDrill.size} fmt={(n) => fmtIn(n, 4)} alt={`${npt.tapDrill.name}`} unit="in" altUnit="" highlight />
          </View>

          <SectionLabel text="Engagement Lengths" />
          <View style={styles.specCard}>
            <View style={styles.engRow}>
              <Text style={styles.engLabel}>L1 — Hand-Tight Engagement</Text>
              <Text style={styles.engValue}>{npt.L1.toFixed(4)} <Text style={styles.engUnit}>in</Text></Text>
            </View>
            <Text style={styles.engHint}>Distance the external thread enters the internal thread by hand.</Text>
            <Divider />
            <View style={styles.engRow}>
              <Text style={styles.engLabel}>L2 — Effective Thread Length</Text>
              <Text style={styles.engValue}>{npt.L2.toFixed(4)} <Text style={styles.engUnit}>in</Text></Text>
            </View>
            <Text style={styles.engHint}>Total length of usable, fully-formed external thread.</Text>
          </View>

          <SectionLabel text="Tap Drill (Internal Thread)" />
          <View style={styles.specCard}>
            <View style={styles.resultBox} testID="npt-tap-drill">
              <Text style={styles.resultLabel}>{tapDrillLabel}</Text>
              <Text style={styles.resultValue}>{npt.tapDrill.size.toFixed(4)} <Text style={styles.resultUnit}>in</Text></Text>
              <View style={styles.closestRow}>
                <MaterialDesignIcons name="check-circle" size={16} color={c.success} />
                <Text style={styles.closestText}>Drill name: <Text style={styles.closestStrong}>{npt.tapDrill.name}</Text></Text>
              </View>
              <Text style={styles.resultFooter}>{tapDrillFooter}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // BSPP / BSPT — British Standard Pipe
  if (thread.system === "bspp" || thread.system === "bspt") {
    const bsp = thread as any;
    const isTaper = thread.system === "bspt";
    const standardLabel = isTaper ? "BRITISH PIPE · ISO 7-1 (R)" : "BRITISH PIPE · ISO 228 (G)";
    const titleSub = isTaper ? "TAPERED" : "PARALLEL";
    const tapDrillFooter = isTaper
      ? "Per ISO 7-1 — for tapered pipe joints sealed with compound or PTFE."
      : "Per ISO 228 — for parallel pipe joints sealed with bonded washer / O-ring.";
    const bspDepth = bspThreadDepth(bsp.pitchMm);
    return (
      <View style={styles.root}>
        {renderHeader(thread.label)}
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{standardLabel} · {titleSub}</Text>
            <Text style={styles.title}>{thread.label}</Text>
            <View style={styles.titleMeta}>
              <MetaItem label="OD" value={`${bsp.diameterMm.toFixed(3)} mm`} />
              <MetaItem label="TPI" value={`${thread.tpi}`} />
              <MetaItem label="PITCH" value={`${bsp.pitchMm.toFixed(3)} mm`} />
            </View>
          </View>

          <SectionLabel text="Specifications" />
          <View style={styles.specCard}>
            <SpecRow label="Outside Dia (OD)" v={bsp.diameterMm} fmt={(n) => fmtMm(n, 3)} alt={fmtIn(thread.diameter, 4)} unit="mm" altUnit="in" />
            <Divider />
            <SpecRow label="Threads / Inch" v={thread.tpi} fmt={(n) => n.toString()} alt="—" unit="TPI" altUnit="" />
            <SpecRow label="Pitch" v={bsp.pitchMm} fmt={(n) => fmtMm(n, 3)} alt={fmtIn(thread.pitch, 4)} unit="mm" altUnit="in" />
            <Divider />
            <SpecRow label="Thread Depth/Height" v={bspDepth} fmt={(n) => fmtMm(n, 3)} alt={fmtIn(bspDepth / INCH_TO_MM, 4)} unit="mm" altUnit="in" highlight />
            {isTaper && (
              <>
                <Divider />
                <SpecRow label="Taper" v={0.0625} fmt={() => '1:16 (0.0625"/in)'} alt="3/4 in/ft" unit="" altUnit="" />
              </>
            )}
            <Divider />
            <SpecRow label="Thread Form" v={0} fmt={() => "55° Whitworth"} alt="rounded crests/roots" unit="" altUnit="" />
          </View>

          <SectionLabel text="Tap Drill (Internal Thread)" />
          <View style={styles.specCard}>
            <View style={styles.resultBox} testID="bsp-tap-drill">
              <Text style={styles.resultLabel}>STANDARD TAP DRILL</Text>
              <Text style={styles.resultValue}>{bsp.tapDrill.sizeMm.toFixed(2)} <Text style={styles.resultUnit}>mm</Text></Text>
              <Text style={styles.resultAlt}>{bsp.tapDrill.size.toFixed(4)} in</Text>
              <View style={styles.closestRow}>
                <MaterialDesignIcons name="check-circle" size={16} color={c.success} />
                <Text style={styles.closestText}>Drill name: <Text style={styles.closestStrong}>{bsp.tapDrill.name}</Text></Text>
              </View>
              <Text style={styles.resultFooter}>{tapDrillFooter}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Unified / Metric
  const isUnified = thread.system === "unified";
  const D = thread.diameter;
  const P = thread.pitch;
  const basics = basicDimensions(D, P);
  const limits = classLimits(thread, cls) as any;
  const maxMajorDia = limits.kind === "external" ? limits.majorMax : limits.majorMin;
  const depthH = threadDepthHeight(maxMajorDia, limits.minorMax);

  const switchType = (t: "external" | "internal") => {
    setThreadType(t);
    setCls(t === "external" ? "2A" : "2B");
  };

  const tapDrillDia = tapDrill(D, P, percent, tapType);
  const closestUnif = isUnified ? closestDrill(tapDrillDia) : null;

  const bestW = bestWireSize(P);
  const minW = minWireSize(P);
  const maxW = maxWireSize(P);
  const parsedW = parseFloat(wireInput);
  const wireEntered = isFinite(parsedW) && parsedW > 0;
  const usedW = wireEntered ? parsedW : bestW;
  const wireOutOfRange = wireEntered && (usedW < minW || usedW > maxW);
  const measureMax = limits.kind === "external" ? threeWireM(limits.pdMax, usedW, P) : threeWireM(limits.pdMin, usedW, P);
  const measureMin = limits.kind === "external" ? threeWireM(limits.pdMin, usedW, P) : null;

  const unitLabel = isUnified ? "in" : "mm";
  const fmt = isUnified ? (v: number) => fmtIn(v, 4) : (v: number) => fmtMm(v, 3);
  const altUnit = isUnified ? "mm" : "in";
  const fmtAlt = isUnified ? (v: number) => fmtMm(v * INCH_TO_MM, 3) : (v: number) => fmtIn(v / INCH_TO_MM, 4);

  return (
    <View style={styles.root}>
      {renderHeader(thread.label)}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{isUnified ? "INCH · ASME B1.1" : "MM · ISO 261/262"} · {thread.series}</Text>
            <Text style={styles.title}>{thread.label}</Text>
            <View style={styles.titleMeta}>
              <MetaItem label="MAJOR Ø" value={`${fmt(D)} ${unitLabel}`} />
              <MetaItem label={isUnified ? "TPI" : "PITCH"} value={isUnified ? `${thread.tpi}` : `${P % 1 === 0 ? P.toFixed(1) : P} mm`} />
              <MetaItem label={isUnified ? "PITCH" : "TPI"} value={isUnified ? `${fmt(P)} in` : `${thread.tpi.toFixed(2)}`} />
            </View>
          </View>

          <SectionLabel text="Thread Type" />
          <View style={styles.segment}>
            <SegBtn testID="type-external" active={threadType === "external"} label="EXTERNAL" icon="arrow-up" onPress={() => switchType("external")} />
            <SegBtn testID="type-internal" active={threadType === "internal"} label="INTERNAL" icon="arrow-down" onPress={() => switchType("internal")} />
          </View>

          <SectionLabel text="Class of Fit" />
          <View style={styles.segmentSm}>
            {classesFor(threadType).map((cl: string) => (
              <SegBtn key={cl} testID={`class-${cl}`} active={cls === cl} label={cl} onPress={() => setCls(cl)} small />
            ))}
          </View>
          <Text style={styles.hint}>{classDescription(cls)}</Text>

          <SectionLabel text="Dimensions" />
          <View style={styles.specCard}>
            {limits.kind === "external" ? (
              <>
                <SpecRow label="Major Dia (Max)" v={limits.majorMax} fmt={fmt} alt={fmtAlt(limits.majorMax)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Major Dia (Min)" v={limits.majorMin} fmt={fmt} alt={fmtAlt(limits.majorMin)} altUnit={altUnit} unit={unitLabel} />
                <Divider />
                <SpecRow label="Pitch Dia (Max)" v={limits.pdMax} fmt={fmt} alt={fmtAlt(limits.pdMax)} altUnit={altUnit} unit={unitLabel} highlight />
                <SpecRow label="Pitch Dia (Min)" v={limits.pdMin} fmt={fmt} alt={fmtAlt(limits.pdMin)} altUnit={altUnit} unit={unitLabel} highlight />
                <Divider />
                <SpecRow label="Minor Dia (Max)" v={limits.minorMax} fmt={fmt} alt={fmtAlt(limits.minorMax)} altUnit={altUnit} unit={unitLabel} />
                <Divider />
                <SpecRow label="Thread Depth/Height" v={depthH} fmt={fmt} alt={fmtAlt(depthH)} altUnit={altUnit} unit={unitLabel} highlight />
                <SpecRow label="Allowance" v={limits.allowance} fmt={fmt} alt={fmtAlt(limits.allowance)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="PD Tolerance" v={limits.pdTol} fmt={fmt} alt={fmtAlt(limits.pdTol)} altUnit={altUnit} unit={unitLabel} />
              </>
            ) : (
              <>
                <SpecRow label="Minor Dia (Min)" v={limits.minorMin} fmt={fmt} alt={fmtAlt(limits.minorMin)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Minor Dia (Max)" v={limits.minorMax} fmt={fmt} alt={fmtAlt(limits.minorMax)} altUnit={altUnit} unit={unitLabel} />
                <Divider />
                <SpecRow label="Pitch Dia (Min)" v={limits.pdMin} fmt={fmt} alt={fmtAlt(limits.pdMin)} altUnit={altUnit} unit={unitLabel} highlight />
                <SpecRow label="Pitch Dia (Max)" v={limits.pdMax} fmt={fmt} alt={fmtAlt(limits.pdMax)} altUnit={altUnit} unit={unitLabel} highlight />
                <Divider />
                <SpecRow label="Major Dia (Min)" v={limits.majorMin} fmt={fmt} alt={fmtAlt(limits.majorMin)} altUnit={altUnit} unit={unitLabel} />
                <Divider />
                <SpecRow label="Thread Depth/Height" v={depthH} fmt={fmt} alt={fmtAlt(depthH)} altUnit={altUnit} unit={unitLabel} highlight />
                <SpecRow label="PD Tolerance" v={limits.pdTol} fmt={fmt} alt={fmtAlt(limits.pdTol)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Minor Tolerance" v={limits.minorTol} fmt={fmt} alt={fmtAlt(limits.minorTol)} altUnit={altUnit} unit={unitLabel} />
              </>
            )}
          </View>

          <View style={styles.basicsRow}>
            <BasicTile label="Basic Pitch" value={fmt(basics.basicPitch)} unit={unitLabel} />
            <BasicTile label="Basic Minor" value={fmt(basics.basicMinor)} unit={unitLabel} />
          </View>

          {threadType === "internal" && (
            <>
              <SectionLabel text="Tap Drill Calculator" />
              <View style={styles.specCard}>
                <Text style={styles.subLabel}>TAP TYPE</Text>
                <View style={styles.segmentSm}>
                  <SegBtn testID="tap-cutting" active={tapType === "cutting"} label="CUTTING TAP" onPress={() => setTapType("cutting")} small />
                  <SegBtn testID="tap-forming" active={tapType === "forming"} label="FORMING TAP" onPress={() => setTapType("forming")} small />
                </View>

                <Text style={[styles.subLabel, { marginTop: 18 }]}>% OF THREAD ENGAGEMENT</Text>
                <View style={styles.percentRow}>
                  {PERCENTS.map((p) => (
                    <Pressable key={p} testID={`percent-${p}`} onPress={() => setPercent(p)} style={[styles.pctBtn, percent === p && styles.pctBtnActive]}>
                      <Text style={[styles.pctTxt, percent === p && styles.pctTxtActive]}>{p}%</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.resultBox} testID="tap-drill-result">
                  <Text style={styles.resultLabel}>RECOMMENDED DRILL Ø</Text>
                  <Text style={styles.resultValue}>{fmt(tapDrillDia)} <Text style={styles.resultUnit}>{unitLabel}</Text></Text>
                  <Text style={styles.resultAlt}>{fmtAlt(tapDrillDia)} {altUnit}</Text>
                  {closestUnif && (
                    <View style={styles.closestRow}>
                      <MaterialDesignIcons name="check-circle" size={16} color={c.success} />
                      <Text style={styles.closestText}>Closest standard drill: <Text style={styles.closestStrong}>{closestUnif.name}</Text> ({closestUnif.size.toFixed(4)}&quot;)</Text>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}

          {threadType === "external" && (
            <>
              <SectionLabel text="3-Wire Measurement" />
              <View style={styles.specCard}>
                <Text style={styles.formulaText}>M = E + 3W − 1.5155 × P    (60° threads)</Text>

                <View style={styles.wireRow}>
                  <View style={styles.wireBlock}>
                    <Text style={styles.subLabel}>BEST WIRE Ø</Text>
                    <Text style={styles.bestWire}>{fmt(bestW)}</Text>
                    <Text style={styles.bestWireAlt}>{fmtAlt(bestW)} {altUnit}</Text>
                  </View>
                  <View style={styles.wireBlock}>
                    <Text style={styles.subLabel}>YOUR WIRE Ø ({unitLabel})</Text>
                    <TextInput
                      testID="wire-input"
                      value={wireInput}
                      onChangeText={setWireInput}
                      placeholder={fmt(bestW)}
                      placeholderTextColor={c.dim}
                      keyboardType="decimal-pad"
                      style={[styles.wireInput, wireOutOfRange && styles.wireInputError]}
                    />
                  </View>
                </View>

                <View style={styles.rangeBox} testID="wire-range">
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>ACCEPTABLE RANGE</Text>
                    <Text style={styles.rangeFormula}>0.560·P  →  0.900·P</Text>
                  </View>
                  <View style={styles.rangeValuesRow}>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeColLabel}>MIN</Text>
                      <Text style={styles.rangeColValue}>{fmt(minW)}</Text>
                      <Text style={styles.rangeColAlt}>{fmtAlt(minW)} {altUnit}</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeColLabel}>BEST</Text>
                      <Text style={[styles.rangeColValue, { color: c.primary }]}>{fmt(bestW)}</Text>
                      <Text style={styles.rangeColAlt}>{fmtAlt(bestW)} {altUnit}</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeColLabel}>MAX</Text>
                      <Text style={styles.rangeColValue}>{fmt(maxW)}</Text>
                      <Text style={styles.rangeColAlt}>{fmtAlt(maxW)} {altUnit}</Text>
                    </View>
                  </View>
                  {wireOutOfRange && (
                    <View style={styles.warnRow} testID="wire-warning">
                      <MaterialDesignIcons name="alert" size={14} color={c.danger} />
                      <Text style={styles.warnText}>Wire Ø {fmt(usedW)} {unitLabel} is outside the acceptable range.</Text>
                    </View>
                  )}
                </View>

                <Pressable testID="use-best-wire" onPress={() => setWireInput(fmt(bestW))} style={styles.linkBtn}>
                  <MaterialDesignIcons name="arrow-left" size={14} color={c.primary} />
                  <Text style={styles.linkText}>Use best wire size</Text>
                </Pressable>

                <View style={styles.resultBox} testID="three-wire-result">
                  <Text style={styles.resultLabel}>MEASUREMENT OVER WIRES (M)</Text>
                  <View style={styles.measureRange}>
                    <View style={styles.measureCol}>
                      <Text style={styles.measureMini}>MAX (GO PD)</Text>
                      <Text style={styles.measureValue}>{fmt(measureMax)}</Text>
                      <Text style={styles.measureAlt}>{fmtAlt(measureMax)} {altUnit}</Text>
                    </View>
                    {measureMin !== null && (
                      <View style={styles.measureCol}>
                        <Text style={styles.measureMini}>MIN (NOT GO)</Text>
                        <Text style={styles.measureValue}>{fmt(measureMin)}</Text>
                        <Text style={styles.measureAlt}>{fmtAlt(measureMin)} {altUnit}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.resultFooter}>Using wire Ø {fmt(usedW)} {unitLabel} · pitch {fmt(P)} {unitLabel}</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => buildStyles(c), [c]);
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => buildStyles(c), [c]);
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function SegBtn({ active, label, icon, onPress, small, testID }: { active: boolean; label: string; icon?: any; onPress: () => void; small?: boolean; testID?: string }) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => buildStyles(c), [c]);
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.segBtn, small && styles.segBtnSm, active && styles.segBtnActive]}>
      {icon ? <MaterialDesignIcons name={icon} size={16} color={active ? c.primary : c.muted} /> : null}
      <Text style={[styles.segLabel, active && styles.segLabelActive, small && { fontSize: 13 }]}>{label}</Text>
    </Pressable>
  );
}

function SpecRow({ label, v, fmt, alt, unit, altUnit, highlight }: { label: string; v: number; fmt: (n: number) => string; alt: string; unit: string; altUnit: string; highlight?: boolean }) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => buildStyles(c), [c]);
  return (
    <View style={styles.specRow}>
      <Text style={styles.specRowLabel}>{label}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.specRowValue, highlight && styles.specRowValueHi]}>{fmt(v)} <Text style={styles.specRowUnit}>{unit}</Text></Text>
        <Text style={styles.specRowAlt}>{alt} {altUnit}</Text>
      </View>
    </View>
  );
}

function Divider() {
  const { colors: c } = useTheme();
  const styles = useMemo(() => buildStyles(c), [c]);
  return <View style={styles.divider} />;
}

function BasicTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => buildStyles(c), [c]);
  return (
    <View style={styles.basicTile}>
      <Text style={styles.basicLabel}>{label}</Text>
      <Text style={styles.basicValue}>{value}</Text>
      <Text style={styles.basicUnit}>{unit}</Text>
    </View>
  );
}

function buildStyles(c: ThemeColors) {
  return StyleSheet.create({
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
    headerTitle: { fontFamily: fonts.displayBold, fontSize: 20, letterSpacing: 2, color: c.textStrong, flex: 1 },
    notFound: { fontFamily: fonts.mono, color: c.muted, padding: 24 },
    scroll: { padding: 20, gap: 8 },

    titleBlock: { paddingBottom: 8 },
    kicker: { color: c.primary, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5 },
    title: { color: c.textStrong, fontSize: 26, fontFamily: fonts.displayBold, letterSpacing: 1, marginTop: 6 },
    titleMeta: { flexDirection: "row", gap: 12, marginTop: 14 },
    metaItem: { flex: 1, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 4, paddingVertical: 10, paddingHorizontal: 12 },
    metaLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1 },
    metaValue: { color: c.text, fontSize: 14, fontFamily: fonts.monoBold, marginTop: 4 },

    sectionLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.5, marginTop: 24, marginBottom: 10, textTransform: "uppercase" },
    hint: { color: c.muted, fontFamily: fonts.mono, fontSize: 12, marginTop: 8, fontStyle: "italic" },

    segment: { flexDirection: "row", gap: 10 },
    segmentSm: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    segBtn: { flex: 1, minHeight: 56, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 4, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
    segBtnSm: { minHeight: 48, minWidth: 72 },
    segBtnActive: { backgroundColor: c.surfaceElevated, borderColor: c.primary, borderBottomWidth: 2 },
    segLabel: { color: c.muted, fontFamily: fonts.mono, letterSpacing: 1, fontSize: 14 },
    segLabelActive: { color: c.primary },

    specCard: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 6, padding: 16 },
    specRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
    specRowLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 13 },
    specRowValue: { color: c.text, fontSize: 17, fontFamily: fonts.monoBold },
    specRowValueHi: { color: c.primary },
    specRowUnit: { color: c.dim, fontFamily: fonts.mono, fontSize: 12 },
    specRowAlt: { color: c.dim, fontSize: 11, fontFamily: fonts.mono, marginTop: 2 },
    divider: { height: 1, backgroundColor: c.divider, marginVertical: 4 },

    basicsRow: { flexDirection: "row", gap: 10, marginTop: 10 },
    basicTile: { flex: 1, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 4, padding: 14 },
    basicLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2 },
    basicValue: { color: c.text, fontSize: 18, fontFamily: fonts.monoBold, marginTop: 6 },
    basicUnit: { color: c.dim, fontFamily: fonts.mono, fontSize: 11, marginTop: 2 },

    subLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.2, marginBottom: 8 },

    percentRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    pctBtn: { flexBasis: "15%", flexGrow: 1, minHeight: 48, backgroundColor: c.bg, borderWidth: 1, borderColor: c.border, borderRadius: 4, alignItems: "center", justifyContent: "center" },
    pctBtnActive: { backgroundColor: c.primary, borderColor: c.primary },
    pctTxt: { color: c.muted, fontFamily: fonts.monoBold, fontSize: 14 },
    pctTxtActive: { color: c.onPrimary },

    resultBox: { marginTop: 18, backgroundColor: c.bg, borderLeftWidth: 3, borderLeftColor: c.primary, padding: 14, borderRadius: 4 },
    resultLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5 },
    resultValue: { color: c.primary, fontSize: 32, fontFamily: fonts.monoBold, marginTop: 6 },
    resultUnit: { fontSize: 14, color: c.muted, fontFamily: fonts.mono },
    resultAlt: { color: c.dim, fontSize: 13, fontFamily: fonts.mono, marginTop: 4 },
    resultFooter: { color: c.dim, fontSize: 11, fontFamily: fonts.mono, marginTop: 12 },

    closestRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
    closestText: { color: c.muted, fontFamily: fonts.mono, fontSize: 12, flex: 1 },
    closestStrong: { color: c.success, fontFamily: fonts.monoBold },

    formulaText: { color: c.muted, fontSize: 12, fontFamily: fonts.mono, marginBottom: 14, backgroundColor: c.bg, padding: 10, borderRadius: 4 },
    wireRow: { flexDirection: "row", gap: 12 },
    wireBlock: { flex: 1 },
    bestWire: { color: c.primary, fontSize: 22, fontFamily: fonts.monoBold },
    bestWireAlt: { color: c.dim, fontSize: 11, fontFamily: fonts.mono, marginTop: 2 },
    wireInput: { backgroundColor: c.bg, borderWidth: 1, borderColor: c.border, borderRadius: 4, paddingHorizontal: 12, height: 48, color: c.text, fontFamily: fonts.monoBold, fontSize: 18 },
    wireInputError: { borderColor: c.danger },
    rangeBox: { marginTop: 14, backgroundColor: c.bg, borderWidth: 1, borderColor: c.border, borderRadius: 4, padding: 12 },
    rangeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    rangeLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2 },
    rangeFormula: { color: c.dim, fontSize: 11, fontFamily: fonts.mono },
    rangeValuesRow: { flexDirection: "row", gap: 8 },
    rangeCol: { flex: 1, backgroundColor: c.surface, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 6, alignItems: "center" },
    rangeColLabel: { color: c.muted, fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1 },
    rangeColValue: { color: c.text, fontSize: 14, fontFamily: fonts.monoBold, marginTop: 4 },
    rangeColAlt: { color: c.dim, fontSize: 10, fontFamily: fonts.mono, marginTop: 1 },
    warnRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
    warnText: { color: c.danger, fontFamily: fonts.mono, fontSize: 12, flex: 1 },
    linkBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8, alignSelf: "flex-end" },
    linkText: { color: c.primary, fontFamily: fonts.mono, fontSize: 12 },

    measureRange: { flexDirection: "row", gap: 16, marginTop: 8 },
    measureCol: { flex: 1 },
    measureMini: { color: c.muted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1 },
    measureValue: { color: c.primary, fontSize: 22, fontFamily: fonts.monoBold, marginTop: 4 },
    measureAlt: { color: c.dim, fontSize: 11, fontFamily: fonts.mono, marginTop: 2 },

    engRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
    engLabel: { color: c.text, fontFamily: fonts.mono, fontSize: 13, flex: 1 },
    engValue: { color: c.primary, fontSize: 18, fontFamily: fonts.monoBold },
    engUnit: { color: c.dim, fontSize: 12, fontFamily: fonts.mono },
    engHint: { color: c.muted, fontFamily: fonts.mono, fontSize: 11, fontStyle: "italic", marginTop: 4, marginBottom: 6 },
  });
}
