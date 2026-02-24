export interface InsectCategory {
  id: string;
  name: string;
  scientificOrder: string;
  description: string;
  icon: string;
  color: string;
  count: string;
  examples: string[];
}

export interface HistoryItem {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
  imageUri: string;
  date: string;
  category: string;
}

export const INSECT_CATEGORIES: InsectCategory[] = [
  {
    id: "beetles",
    name: "Beetles",
    scientificOrder: "Coleoptera",
    description: "The largest order of insects with hardened forewings",
    icon: "bug",
    color: "#5C3D2E",
    count: "400,000+",
    examples: ["Ladybug", "Stag Beetle", "Firefly", "Weevil"],
  },
  {
    id: "butterflies",
    name: "Butterflies & Moths",
    scientificOrder: "Lepidoptera",
    description: "Scale-winged insects known for colorful patterns",
    icon: "flower",
    color: "#C9A227",
    count: "180,000+",
    examples: ["Monarch", "Swallowtail", "Luna Moth", "Painted Lady"],
  },
  {
    id: "ants",
    name: "Ants, Bees & Wasps",
    scientificOrder: "Hymenoptera",
    description: "Social insects with complex colony structures",
    icon: "apps",
    color: "#8B0000",
    count: "150,000+",
    examples: ["Honey Bee", "Fire Ant", "Paper Wasp", "Carpenter Ant"],
  },
  {
    id: "flies",
    name: "Flies & Mosquitoes",
    scientificOrder: "Diptera",
    description: "Two-winged insects found worldwide",
    icon: "radio-button-off",
    color: "#1E5631",
    count: "150,000+",
    examples: ["House Fly", "Mosquito", "Crane Fly", "Fruit Fly"],
  },
  {
    id: "dragonflies",
    name: "Dragonflies & Damselflies",
    scientificOrder: "Odonata",
    description: "Ancient predatory insects with remarkable flight",
    icon: "airplane",
    color: "#2D7A4A",
    count: "6,000+",
    examples: ["Blue Dasher", "Green Darner", "Ebony Jewelwing"],
  },
  {
    id: "grasshoppers",
    name: "Grasshoppers & Crickets",
    scientificOrder: "Orthoptera",
    description: "Jumping insects known for their songs",
    icon: "leaf",
    color: "#6B8E23",
    count: "28,000+",
    examples: ["Field Cricket", "Katydid", "Locust", "Grasshopper"],
  },
  {
    id: "mantises",
    name: "Praying Mantises",
    scientificOrder: "Mantodea",
    description: "Ambush predators with raptorial forelegs",
    icon: "hand-left",
    color: "#556B2F",
    count: "2,400+",
    examples: ["Chinese Mantis", "Carolina Mantis", "Orchid Mantis"],
  },
  {
    id: "true-bugs",
    name: "True Bugs",
    scientificOrder: "Hemiptera",
    description: "Insects with piercing-sucking mouthparts",
    icon: "shield",
    color: "#8B6F47",
    count: "80,000+",
    examples: ["Stink Bug", "Cicada", "Aphid", "Water Strider"],
  },
];

export const SAMPLE_RESULTS = [
  {
    name: "Monarch Butterfly",
    scientificName: "Danaus plexippus",
    confidence: 94,
    category: "Butterflies & Moths",
    habitat: "Open fields, meadows, gardens across North America",
    diet: "Nectar from milkweed and various flowers",
    lifespan: "2-6 weeks (summer), up to 8 months (migratory)",
    size: "Wingspan: 8.9-10.2 cm (3.5-4 in)",
    characteristics: [
      "Distinctive orange and black wing pattern",
      "Known for long-distance migration up to 3,000 miles",
      "Caterpillars feed exclusively on milkweed",
      "Toxic to predators due to cardenolide compounds",
    ],
    funFact:
      "Monarchs are the only butterflies known to make a two-way migration, traveling up to 3,000 miles from North America to central Mexico.",
  },
];
