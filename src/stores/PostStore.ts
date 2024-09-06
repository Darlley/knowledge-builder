import { PostType } from '@/types/PostType';
import { create } from 'zustand';

export type PostTypeError = {
  type: string;
  message: string;
  status: number;
};

export type PostTypeState = {
  posts: PostType[];
  getPosts: (userId: string, siteId: string) => Promise<void>;
  createPost: (siteId: string, data: Partial<PostType>) => Promise<void>;
};

const PostsStore = create<PostTypeState>((set, get) => ({
  posts: [],

  getPosts: async (userId: string, siteId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `/api/sites/${siteId}/posts?userId=${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          
          const posts = await response.json();
          set({ posts });
          resolve(posts);
        } else {
          const result = await response.json();
          const error: PostTypeError = {
            type: result.type || 'unknownError',
            message: result.message || 'Erro desconhecido',
            status: response.status,
          };
          reject(error);
        }
      } catch (err) {
        const customError: PostTypeError = {
          type: 'networkError',
          message: 'Erro de rede ou servidor',
          status: 500,
        };
        reject(customError);
      }
    });
  },

  createPost: (siteId: string, data: Partial<PostType>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/sites/${siteId}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          resolve();
        } else {
          const result = await response.json();
          const error: PostTypeError = {
            type: result.type || 'unknownError',
            message: result.message || 'Erro desconhecido',
            status: response.status,
          };

          reject(error);
        }
      } catch (err) {
        const customError: PostTypeError = {
          type: 'networkError',
          message: 'Erro de rede ou servidor',
          status: 500,
        };
        reject(customError);
      }
    });
  },
}));

export default PostsStore;
