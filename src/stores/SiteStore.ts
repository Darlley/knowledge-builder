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
  getSites: () => Promise<void>;
  createSite: (data: Partial<ISite>) => Promise<void>;
};

const SiteStore = create<ISiteState>((set, get) => ({
  sites: [],

  getSites: async () => {
    try {
      const response = await fetch('/api/sites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os sites');
      }

      
      const sites = await response.json();
      console.log(sites)
      set({ sites });
    } catch (error) {
      console.error('Erro ao buscar os sites:', error);
      set({ sites: [] });
    }
  },

  createSite: (data: Partial<ISite>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/api/sites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {

          get().getSites();

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
