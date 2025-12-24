import apiClient from "@/config/axios";
import { ApiResponse } from "@/entity/apiResponse";

// Types for Social API
export interface Post {
  id: number;
  user: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
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
  user: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
}

export interface PaginationResponse<T> {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface CreatePostDto {
  content: string;
  imageUrl?: string;
  achievementUserId?: number;
  visibility?: "PUBLIC" | "PRIVATE";
  groupId?: number;
}

export interface CreateCommentDto {
  content: string;
}

export const socialService = {
  // Get all posts with pagination
  getPosts: async (
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginationResponse<Post>>> => {
    try {
      const response = await apiClient.get("/social/posts", {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Get post by ID
  getPostById: async (postId: number): Promise<ApiResponse<Post>> => {
    try {
      const response = await apiClient.get(`/social/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  // Create new post
  createPost: async (data: CreatePostDto): Promise<ApiResponse<Post>> => {
    try {
      const response = await apiClient.post("/social/posts", {
        ...data,
        visibility: data.visibility || "PUBLIC",
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Get post likes
  getPostLikes: async (postId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/social/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post likes:", error);
      throw error;
    }
  },

  // Like post
  likePost: async (postId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post(`/social/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },

  // Unlike post
  unlikePost: async (postId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.delete(`/social/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error unliking post:", error);
      throw error;
    }
  },

  // Get post comments
  getComments: async (
    postId: number,
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<PaginationResponse<Comment>>> => {
    try {
      const response = await apiClient.get(`/social/posts/${postId}/comments`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Create comment
  createComment: async (
    postId: number,
    data: CreateCommentDto
  ): Promise<ApiResponse<Comment>> => {
    try {
      const response = await apiClient.post(
        `/social/posts/${postId}/comments`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },
};
