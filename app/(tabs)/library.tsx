import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useI18n } from "@/lib/i18n";

interface InsectEntry {
  id: string;
  scientificName: string;
  i18nKey: string;
  image: any;
  family: string;
  order: string;
}

const INSECT_ENTRIES: InsectEntry[] = [
  {
    id: "tribolium_castaneum",
    scientificName: "Tribolium castaneum",
    i18nKey: "tribolium_castaneum",
    image: require("@/assets/images/insects/tribolium_castaneum.jpg"),
    family: "Tenebrionidae",
    order: "Coleoptera",
  },
  {
    id: "tribolium_confusum",
    scientificName: "Tribolium confusum",
    i18nKey: "tribolium_confusum",
    image: require("@/assets/images/insects/tribolium_confusum.png"),
    family: "Tenebrionidae",
    order: "Coleoptera",
  },
  {
    id: "sitophilus_granarius",
    scientificName: "Sitophilus granarius",
    i18nKey: "sitophilus_granarius",
    image: require("@/assets/images/insects/sitophilus_granarius.jpg"),
    family: "Curculionidae",
    order: "Coleoptera",
  },
  {
    id: "sitophilus_oryzae",
    scientificName: "Sitophilus oryzae",
    i18nKey: "sitophilus_oryzae",
    image: require("@/assets/images/insects/sitophilus_oryzae.jpg"),
    family: "Curculionidae",
    order: "Coleoptera",
  },
];

function SectionBlock({
  icon,
  title,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionBlockHeader}>
        <Ionicons name={icon} size={16} color={Colors.forestGreen} />
        <Text style={styles.sectionBlockTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bullet} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function InsectCard({
  entry,
  index,
}: {
  entry: InsectEntry;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { t, tArray } = useI18n();
  const cardScale = useSharedValue(1);
  const contentHeight = useSharedValue(0);
  const rotation = useSharedValue(0);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: contentHeight.value,
    opacity: contentHeight.value > 0 ? 1 : 0,
    overflow: "hidden" as const,
  }));

  const commonName = t(`insects.${entry.i18nKey}.commonName`);
  const physicalDesc = t(`insects.${entry.i18nKey}.physicalDesc`);
  const distinguishing = tArray(`insects.${entry.i18nKey}.distinguishing`);
  const reproduction = t(`insects.${entry.i18nKey}.reproduction`);
  const bioNotes = t(`insects.${entry.i18nKey}.bioNotes`);

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    contentHeight.value = withTiming(newExpanded ? 420 : 0, {
      duration: 350,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    rotation.value = withTiming(newExpanded ? 180 : 0, {
      duration: 300,
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 120)}
      style={cardAnimStyle}
    >
      <Pressable
        onPressIn={() => {
          cardScale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          cardScale.value = withSpring(1);
        }}
        onPress={toggleExpand}
        style={[styles.card, expanded && styles.cardExpanded]}
      >
        <View style={styles.cardHeader}>
          <Image
            source={entry.image}
            style={styles.insectImage}
            contentFit="cover"
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.scientificName}>{entry.scientificName}</Text>
            <Text style={styles.commonName}>{commonName}</Text>
            <View style={styles.taxonomyRow}>
              <View style={styles.taxonomyPill}>
                <Text style={styles.taxonomyText}>{entry.order}</Text>
              </View>
              <View style={[styles.taxonomyPill, styles.familyPill]}>
                <Text style={[styles.taxonomyText, styles.familyText]}>
                  {entry.family}
                </Text>
              </View>
            </View>
          </View>
          <Animated.View style={chevronStyle}>
            <Ionicons
              name="chevron-down"
              size={20}
              color={Colors.textMuted}
            />
          </Animated.View>
        </View>

        <Animated.View style={contentStyle}>
          <View style={styles.expandedContent}>
            <View style={styles.divider} />

            <SectionBlock
              icon="body"
              title={t("library.physicalDesc")}
            >
              <Text style={styles.descriptionText}>{physicalDesc}</Text>
            </SectionBlock>

            <SectionBlock
              icon="search"
              title={t("library.distinguishing")}
            >
              {distinguishing.map((item, i) => (
                <BulletItem key={i} text={item} />
              ))}
            </SectionBlock>

            <SectionBlock
              icon="git-branch"
              title={t("library.reproduction")}
            >
              <Text style={styles.descriptionText}>{reproduction}</Text>
            </SectionBlock>

            <SectionBlock
              icon="flask"
              title={t("library.biologicalNotes")}
            >
              <Text style={styles.descriptionText}>{bioNotes}</Text>
            </SectionBlock>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, Colors.deepGreen, Colors.cream]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="library" size={22} color={Colors.gold} />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>{t("library.title")}</Text>
            <Text style={styles.headerSubtitle}>
              {t("library.subtitle")}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {INSECT_ENTRIES.map((entry, index) => (
          <InsectCard key={entry.id} entry={entry} index={index} />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 26,
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardExpanded: {
    borderColor: Colors.forestGreen + "25",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  insectImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#f0ece4",
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 14,
  },
  scientificName: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 16,
    color: Colors.forestGreen,
    fontStyle: "italic",
  },
  commonName: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  taxonomyRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  taxonomyPill: {
    backgroundColor: Colors.forestGreen + "10",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  familyPill: {
    backgroundColor: Colors.gold + "15",
  },
  taxonomyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.forestGreen,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  familyText: {
    color: Colors.warmBrown,
  },
  expandedContent: {
    paddingTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 12,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionBlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  sectionBlockTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.forestGreen,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 3,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.gold,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 19,
  },
});
