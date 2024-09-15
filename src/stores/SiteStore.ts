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
  currentSite: ISite | null;
  isLoading: boolean;
  getSites: (userId: string) => Promise<void>;
  getSite: (siteId: string) => Promise<ISite>;
  createSite: (userId: string, data: Partial<ISite>) => Promise<void>;
  updateSite: (siteId: string, userId: string, data: Partial<ISite>) => Promise<void>;
  deleteSite: (siteId: string, userId: string) => Promise<void>;
};

const SiteStore = create<ISiteState>((set, get) => ({
  sites: [],
  currentSite: null,
  isLoading: false,

  getSites: async (userId: string) => {
    set({ isLoading: true });
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
          set({ sites, isLoading: false });
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

  getSite: async (siteId: string): Promise<ISite> => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const site: ISite = await response.json();
        set({ currentSite: site, isLoading: false });
        return site;
      } else {
        const result = await response.json();
        throw {
          type: result.type || 'unknownError',
          message: result.message || 'Erro desconhecido',
          status: response.status,
        } as ISiteError;
      }
    } catch (err) {
      set({ isLoading: false });
      throw {
        type: 'networkError',
        message: 'Erro de rede ou servidor',
        status: 500,
      } as ISiteError;
    }
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

        const result = await response.json();

        if (response.ok) {
          resolve(result);
        } else {
          reject(result); // Propaga o erro completo retornado pela API
        }
      } catch (err) {
        reject({
          type: 'networkError',
          message: 'Erro de rede ou servidor',
          error: err
        });
      }
    });
  },

  updateSite: (siteId: string, userId: string, data: Partial<ISite>) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/sites/${siteId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId, ...data}),
        });

        if (response.ok) {
          const updatedSite = await response.json();
          set((state) => ({
            sites: state.sites.map((site) =>
              site.id === siteId ? updatedSite : site
            ),
          }));
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

  deleteSite: async (siteId: string, userId: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir o site');
      }

      // Atualiza o estado removendo o site excluído
      set((state) => ({
        sites: state.sites.filter((site) => site.id !== siteId),
      }));
    } catch (error) {
      console.error('Erro ao excluir o site:', error);
      throw error;
    }
  },
}));

export default SiteStore;
