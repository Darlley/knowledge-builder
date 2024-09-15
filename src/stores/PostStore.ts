import { PostType } from '@/types/PostType';
import { create } from 'zustand';

export type PostTypeError = {
  type: string;
  message: string;
  status: number;
};

export type PostTypeState = {
  posts: PostType[];
  recentPosts: PostType[];
  isLoading: boolean;
  getPosts: (userId: string, siteId: string) => Promise<void>;
  getRecentPosts: (userId: string, limit?: number) => Promise<void>;
  createPost: (siteId: string, data: Partial<PostType>) => Promise<PostType>;
  editPost: (siteId: string, postId: string, data: Partial<PostType>) => Promise<PostType>;
  deletePost: (siteId: string, postId: string) => Promise<void>;
};

const PostsStore = create<PostTypeState>((set, get) => ({
  posts: [],
  recentPosts: [],
  isLoading: false,

  getPosts: async (userId: string, siteId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `/api/sites/${siteId}/articles?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw await response.json();
      }

      const posts = await response.json();
      set({ posts, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getRecentPosts: async (userId: string, limit = 5) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `/api/sites/recent/articles?userId=${userId}&limit=${limit}&recent=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw await response.json();
      }

      const recentPosts = await response.json();
      set({ recentPosts, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createPost: async (siteId: string, data: Partial<PostType>) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/sites/${siteId}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }

      const newPost = await response.json();
      set((state) => ({ 
        posts: [newPost, ...state.posts],
        isLoading: false 
      }));
      return newPost;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  editPost: async (siteId: string, postId: string, data: Partial<PostType>) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/sites/${siteId}/articles/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await response.json();
      }

      const updatedPost = await response.json();
      set((state) => ({
        posts: state.posts.map(post => post.id === postId ? updatedPost : post),
        isLoading: false
      }));
      return updatedPost;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deletePost: async (siteId: string, postId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/sites/${siteId}/articles/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw await response.json();
      }

      set((state) => ({
        posts: state.posts.filter(post => post.id !== postId),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default PostsStore;
