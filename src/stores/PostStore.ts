import { create } from 'zustand';

export type IPost = {
  id: string;
  name: string;
  content: object;
  description: string;
  slug: string;
  thumbnail?: string;
  views: number;
  status: 'published' | 'archived';
  audience: 'clients' | 'employees';
  createdAt: string;
  updatedAt: string;
  userId: string;
  siteId: string;
};

export type IPostError = {
  type: string;
  message: string;
  status: number;
};

export type IPostState = {
  posts: IPost[];
  getPosts: (userId: string, siteId: string) => Promise<void>;
  createPost: (data: Partial<IPost>) => Promise<void>;
};

const PostsStore = create<IPostState>((set, get) => ({
  posts: [],

  getPosts: async (userId: string, siteId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/posts?userId=${userId}&siteId=${siteId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const posts = await response.json();
          set({ posts });
          resolve(posts);
        } else {
          const result = await response.json();
          const error: IPostError = {
            type: result.type || 'unknownError',
            message: result.message || 'Erro desconhecido',
            status: response.status,
          };
          reject(error);
        }
      } catch (err) {
        const customError: IPostError = {
          type: 'networkError',
          message: 'Erro de rede ou servidor',
          status: 500,
        };
        reject(customError);
      }
    });
  },

  createPost: (data: Partial<IPost>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/api/posts', {
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
          const error: IPostError = {
            type: result.type || 'unknownError',
            message: result.message || 'Erro desconhecido',
            status: response.status,
          };

          reject(error);

        }
      } catch (err) {
        const customError: IPostError = {
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
