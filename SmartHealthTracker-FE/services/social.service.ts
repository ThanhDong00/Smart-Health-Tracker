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
  visibility: "PUBLIC" | "PRIVATE" | "GROUP";
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
  visibility?: "PUBLIC" | "PRIVATE" | "GROUP";
  groupId?: number | null;
}

export interface CreateCommentDto {
  content: string;
}

export interface Group {
  id: number;
  owner: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  name: string;
  description?: string;
  createdAt: string;
  memberCount: number;
  joinedByMe: boolean;
  public: boolean;
}

export interface GroupInvitation {
  inviteId: number;
  groupId: number;
  groupName: string;
  groupDescription?: string;
  invitedBy: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  relation: string;
  createdAt: string;
  expiresAt: string;
}

export interface GroupMember {
  user: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface InviteSearchResult {
  user: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  email: string;
  alreadyMember: boolean;
  pendingInvited: boolean;
}

export interface SendInviteDto {
  invitedUserId: number;
  relation?: string;
}

export interface GroupInviteResponse {
  inviteId: number;
  groupId: number;
  invitedUser: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  relation: string;
  status: string;
  createdAt: string;
  expiresAt: string;
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

  // Get group feed with pagination
  getGroupFeed: async (
    groupId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginationResponse<Post>>> => {
    try {
      const response = await apiClient.get(`/social/posts/${groupId}/feed`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching group feed:", error);
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

  // Create group
  createGroup: async (data: CreateGroupDto): Promise<ApiResponse<Group>> => {
    try {
      const response = await apiClient.post("/social/groups", data);
      return response.data;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  },

  // Get my groups
  getMyGroups: async (): Promise<ApiResponse<Group[]>> => {
    try {
      const response = await apiClient.get("/social/groups/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching my groups:", error);
      throw error;
    }
  },

  // Get pending invitations
  getPendingInvitations: async (): Promise<ApiResponse<GroupInvitation[]>> => {
    try {
      const response = await apiClient.get("/social/groups/invites/pending");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
      throw error;
    }
  },

  // Accept group invitation
  acceptInvitation: async (inviteId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post(
        `/social/groups/invites/${inviteId}/accept`
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      throw error;
    }
  },

  // Decline group invitation
  declineInvitation: async (inviteId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post(
        `/social/groups/invites/${inviteId}/decline`
      );
      return response.data;
    } catch (error) {
      console.error("Error declining invitation:", error);
      throw error;
    }
  },

  // Get group members
  getGroupMembers: async (
    groupId: number
  ): Promise<ApiResponse<GroupMember[]>> => {
    try {
      const response = await apiClient.get(`/social/groups/${groupId}/members`);
      return response.data;
    } catch (error) {
      console.error("Error fetching group members:", error);
      throw error;
    }
  },

  // Remove group member
  removeMember: async (
    groupId: number,
    memberId: number
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.delete(
        `/social/groups/${groupId}/members/${memberId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  },

  // Search users for group invite
  searchUsersForInvite: async (
    groupId: number,
    query: string
  ): Promise<ApiResponse<InviteSearchResult[]>> => {
    try {
      const response = await apiClient.get(
        `/social/groups/${groupId}/invite-search`,
        {
          params: { q: query },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users for invite:", error);
      throw error;
    }
  },

  // Send group invitation
  sendGroupInvite: async (
    groupId: number,
    data: SendInviteDto
  ): Promise<ApiResponse<GroupInviteResponse>> => {
    try {
      const response = await apiClient.post(
        `/social/groups/${groupId}/invites`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error sending group invite:", error);
      throw error;
    }
  },
};
