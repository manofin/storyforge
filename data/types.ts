export type NavTab = "story" | "character" | "works" | "image";

export type Character = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  color: string;
  emoji: string;
  chatCount: number;
  likes: number;
  creator?: string;
  quote?: string;
  commentCount?: number;
  imageCount?: number;
};

export type Story = {
  id: string;
  title: string;
  summary: string;
  characterId: string;
  tags: string[];
  messageCount: number;
  color: string;
  emoji: string;
  isSeries?: boolean;
  seriesTitle?: string;
};

export type ArchiveItem = {
  id: string;
  title: string;
  count: number;
  emoji: string;
  color: string;
};

export type ChatSession = {
  id: string;
  title: string;
  preview: string;
  storyId?: string;
  characterId?: string;
  emoji: string;
  color: string;
  updatedAt: string;
};

export type SceneState = {
  time?: string;
  scene?: string;
  goal?: string;
  characters?: string;
  extra?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  kind?: "narrative" | "dialogue" | "context" | "status";
  state?: SceneState;
  showSceneImage?: boolean;
  streaming?: boolean;
};

export type WorkItem = {
  id: string;
  title: string;
  type: "story" | "character";
  visibility: "public" | "private" | "unlisted";
  status: "published" | "draft" | "unregistered";
  emoji: string;
  color: string;
  updatedAt: string;
};

export type ImageStyle = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type GeneratedImage = {
  id: string;
  prompt: string;
  styleId: string;
  color: string;
  ratio: string;
  liked: boolean;
};

export type ModelOption = {
  id: string;
  name: string;
  badge?: string;
  description: string;
  tier: "basic" | "standard" | "pro";
  mode?: "story" | "character" | "both";
};

export type ConversationMode = "story" | "character";

export type UtilitySettings = {
  playGuide: boolean;
  summaryMemory: boolean;
  conversationProfile: boolean;
  situationImage: boolean;
  characterInitiated: boolean;
  outputLength: "short" | "medium" | "long";
  userNote: string;
};
