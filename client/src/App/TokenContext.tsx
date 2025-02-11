import axios, { AxiosInstance, AxiosError, AxiosHeaders } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenStore {
  baseUrl: string;
  setBaseUrl: (newBaseUrl: string) => void;
  token: string | null;
  saveToken: (userToken: string) => void;
  removeToken: () => void;
  hasToken: () => boolean;
  axiosToken: () => AxiosInstance;
  doLogin: (username: string, password: string) => Promise<void>;
  doLogout: () => Promise<void>;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      baseUrl: (window.location.port === '8080' || window.location.port === '') ? '' : 'http://127.0.0.1:8080',
      setBaseUrl: (newBaseUrl: string) => set({ baseUrl: newBaseUrl }),
      token: null,
      saveToken: (userToken: string) => set({ token: userToken }),
      removeToken: () => set({ token: null }),
      hasToken: () => get().token !== null && get().token !== undefined && get().token !== '',
      axiosToken: () => {
        const headers: Partial<AxiosHeaders> = {
          "Content-Type": "application/json",
        };
        if (get().token) {
          headers.Authorization = 'Bearer ' + get().token;
        }
        const ax = axios.create({
          baseURL: get().baseUrl,
          headers,
        });

        ax.interceptors.response.use(response => response, (error: AxiosError) => {
          if (error?.response?.status === 401) {
            get().removeToken();
            return undefined;
          }
          return Promise.reject(error);
        });

        return ax;
      },
      doLogin: async (username: string, password: string) => {
        try {
          const data = await get().axiosToken().post("login",
            { username, password },
          );
          if (!data) {
            throw "Wrong username or password";
          }
          get().saveToken(data.data.access_token);
        } catch (e: any) {
          console.log(e);
          alert(e?.response?.data?.msg || e)
        }
      },
      doLogout: async () => {
        try {
          const data = await get().axiosToken().post("logout");
        } catch (e: any) {
          console.log(e);
          alert(e?.response?.data?.msg || e)
        }
        get().removeToken();
      },
    }),
    {
      name: 'token-store', // name of the item in localStorage
    }
  )
);
