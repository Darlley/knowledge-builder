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
  getSites: (userId: string) => Promise<void>;
  getSite: (siteId: string) => Promise<ISite>; // Modificado para retornar Promise<ISite>
  createSite: (userId: string, data: Partial<ISite>) => Promise<void>;
  updateSite: (siteId: string, userId: string, data: Partial<ISite>) => Promise<void>;
};

const SiteStore = create<ISiteState>((set, get) => ({
  sites: [],
  currentSite: null,

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

  getSite: async (siteId: string): Promise<ISite> => {
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const site: ISite = await response.json();
        set({ currentSite: site });
        return site; // Retorna o site diretamente
      } else {
        const result = await response.json();
        throw {
          type: result.type || 'unknownError',
          message: result.message || 'Erro desconhecido',
          status: response.status,
        } as ISiteError;
      }
    } catch (err) {
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

  updateSite: (siteId: string, userId: string, data: Partial<ISite>) => {
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
}));

export default SiteStore;
