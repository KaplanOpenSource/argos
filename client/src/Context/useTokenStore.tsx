import axios, { AxiosError, AxiosHeaders, AxiosInstance } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const windowBaseUrl = (window.location.port === '8080' || window.location.port === '') ? '' : 'http://127.0.0.1:8080';

interface TokenStore {
    baseUrl: string;
    token: string | null;
    setBaseUrl: (newBaseUrl: string) => void;
    doLogin: (username: string, password: string) => Promise<void>;
    doLogout: () => Promise<void>;
    isLoggedIn: () => boolean;
    axiosSecure: () => AxiosInstance;
}

export const useTokenStore = create<TokenStore>()(
    persist(
        (set, get) => ({
            baseUrl: windowBaseUrl,
            token: null,
            setBaseUrl: (newBaseUrl: string) => {
                set({ baseUrl: newBaseUrl })
            },
            isLoggedIn: () => {
                return get().token !== null && get().token !== undefined && get().token !== ''
            },
            axiosSecure: () => {
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
                        set({ token: null });
                        return undefined;
                    }
                    return Promise.reject(error);
                });

                return ax;
            },
            doLogin: async (username: string, password: string) => {
                try {
                    const data = await get().axiosSecure().post("login",
                        { username, password },
                    );
                    if (!data) {
                        throw "Wrong username or password";
                    }
                    set({ token: data.data.access_token });
                } catch (e: any) {
                    console.log(e);
                    alert(e?.response?.data?.msg || e)
                }
            },
            doLogout: async () => {
                try {
                    const data = await get().axiosSecure().post("logout");
                } catch (e: any) {
                    console.log(e);
                    alert(e?.response?.data?.msg || e)
                }
                set({ token: null });
            },
        }),
        {
            name: 'token-store', // name of the item in localStorage
        }
    )
);
