interface Post {
  id: string;
  user: {
    fullName: string;
    avartarUrl: string;
  };
  createdAt: string;
  content: string;
  imageUrl?: string;
  likeCount?: number;
  commentCount?: number;
  visibility?: "PUBLIC";
  share?: boolean;
}
