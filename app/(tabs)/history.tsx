import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import {
  getHistory,
  clearHistory,
  removeFromHistory,
} from "@/lib/history-storage";
import type { HistoryItem } from "@/lib/insect-data";

function HistoryCard({
  item,
  index,
  onDelete,
}: {
  item: HistoryItem;
  index: number;
  onDelete: (id: string) => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getConfidenceColor = (c: number) => {
    if (c >= 90) return Colors.forestGreen;
    if (c >= 70) return Colors.gold;
    return Colors.darkRed;
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 60)}
      style={animStyle}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert("Delete Entry", "Remove this identification from history?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => onDelete(item.id),
            },
          ]);
        }}
        style={styles.historyCard}
      >
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.historyImage}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.historyImage, styles.placeholderImage]}>
            <Ionicons name="bug" size={24} color={Colors.textMuted} />
          </View>
        )}
        <View style={styles.historyContent}>
          <Text style={styles.historyName}>{item.name}</Text>
          <Text style={styles.historyScientific}>{item.scientificName}</Text>
          <Text style={styles.historyCategory}>{item.category}</Text>
          <Text style={styles.historyDate}>{formattedDate}</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text
            style={[
              styles.confidenceText,
              { color: getConfidenceColor(item.confidence) },
            ]}
          >
            {item.confidence}%
          </Text>
          <Text style={styles.confidenceLabel}>match</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleDelete = async (id: string) => {
    await removeFromHistory(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert(
      "Clear All History",
      "This will permanently delete all identification records.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, Colors.forestGreen + "90", Colors.cream]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Analysis History</Text>
            <Text style={styles.headerSubtitle}>
              {history.length} identification{history.length !== 1 ? "s" : ""}
            </Text>
          </View>
          {history.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="time-outline" size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No Identifications Yet</Text>
          <Text style={styles.emptyText}>
            Take a photo or upload an image from the home screen to start
            identifying insects.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <HistoryCard item={item} index={index} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!history.length}
        />
      )}
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
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  historyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: "rgba(30,86,49,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  historyScientific: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.gold,
    fontStyle: "italic",
    marginTop: 1,
  },
  historyCategory: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  confidenceBadge: {
    alignItems: "center",
    marginLeft: 8,
  },
  confidenceText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  confidenceLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(30,86,49,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
