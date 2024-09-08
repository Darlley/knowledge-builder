import { PostType } from '@/types/PostType';
import { create } from 'zustand';

export type PostTypeError = {
  type: string;
  message: string;
  status: number;
};

export type PostTypeState = {
  posts: PostType[];
  getPost: (params: {
    userId: string, siteId: string, postId: string
  }) => Promise<PostType>;
  getPosts: (userId: string, siteId: string) => Promise<void>;
  createPost: (siteId: string, data: Partial<PostType>) => Promise<void>;
  editPost: (siteId: string, postId: string, data: Partial<PostType>) => Promise<void>;
  deletePost: (siteId: string, postId: string) => Promise<void>;
};

const PostsStore = create<PostTypeState>((set, get) => ({
  posts: [],

  getPost: async (params: {
    userId: string, siteId: string, postId: string
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `/api/sites/${params.siteId}/articles/${params.postId}?userId=${params.userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          
          const post = await response.json();
          console.log("getPost", post)
          resolve(post);
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

  getPosts: async (userId: string, siteId: string) => {
    return new Promise(async (resolve, reject) => {
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
        const response = await fetch(`/api/sites/${siteId}/articles`, {
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

  editPost: (siteId: string, postId: string, data: Partial<PostType>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/sites/${siteId}/articles/${postId}`, {
          method: 'PATCH',
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

  deletePost: (siteId: string, postId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/sites/${siteId}/articles/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
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
