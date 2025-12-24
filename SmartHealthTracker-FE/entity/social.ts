export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  achievementUserId?: number;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  visibility: "PUBLIC" | "PRIVATE";
  share: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}
