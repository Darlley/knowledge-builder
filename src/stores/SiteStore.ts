import { create } from 'zustand';

export type ISite = {
  id: string;
  name: string;
  description: string;
  subdirectory: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type ISiteError = {
  type: string;
  message: string;
  status: number;
};

export type ISiteState = {
  sites: ISite[];
  getSites: (userId: string) => Promise<void>;
  createSite: (userId: string, data: Partial<ISite>) => Promise<void>;
};

const SiteStore = create<ISiteState>((set, get) => ({
  sites: [],

  getSites: async (userId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/sites?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const sites = await response.json();
          set({ sites });
          resolve(sites);
        } else {
          const result = await response.json();
          const error: ISiteError = {
            type: result.type || 'unknownError',
            message: result.message || 'Erro desconhecido',
            status: response.status,
          };
          reject(error);
        }
      } catch (err) {
        const customError: ISiteError = {
          type: 'networkError',
          message: 'Erro de rede ou servidor',
          status: 500,
        };
        reject(customError);
      }
    });
  },

  createSite: (userId: string, data: Partial<ISite>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/api/sites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId, ...data}),
        });

        if (response.ok) {

          resolve();

        } else {

          const result = await response.json();
          const error: ISiteError = {
            type: result.type || 'unknownError',
            message: result.message || 'Erro desconhecido',
            status: response.status,
          };

          reject(error);

        }
      } catch (err) {
        const customError: ISiteError = {
          type: 'networkError',
          message: 'Erro de rede ou servidor',
          status: 500,
        };
        reject(customError);
      }
    });
  },
}));

export default SiteStore;
