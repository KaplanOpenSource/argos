import axios from 'axios';
import { createContext, useState } from 'react';

export const baseUrl = (window.location.port === '8080' || window.location.port === '') ? '' : 'http://127.0.0.1:8080';
// export const baseUrl = 'https://argos.kaplanopensource.co.il';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    function getToken() {
        const userToken = localStorage.getItem('token');
        return userToken && userToken
    }

    const [token, setToken] = useState(getToken());

    function saveToken(userToken) {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };

    function removeToken() {
        localStorage.removeItem("token");
        setToken(null);
    }

    const hasToken = token !== null && token !== undefined && token != '';

    const axiosToken = () => {

        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        const ax = axios.create({
            baseURL: baseUrl,
            headers,
        });

        ax.interceptors.response.use(response => response, error => {
            if (error?.response?.status === 401) {
                removeToken();
                return undefined;
            }
            return Promise.reject(error);
        });

        return ax;
    }

    const doLogin = async (username, password) => {
        try {
            const data = await axiosToken().post("login",
                { username, password },
            );
            if (!data) {
                throw "Wrong username or password";
            }
            saveToken(data.data.access_token);
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.msg || e)
        }
    }

    const doLogout = async () => {
        try {
            const data = await axiosToken().post("logout");
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.msg || e)
        }
        removeToken();
    }

    return (
        <TokenContext.Provider value={{
            setToken: saveToken,
            token,
            removeToken,
            hasToken,
            doLogin,
            doLogout,
            axiosToken,
        }}>
            {children}
        </TokenContext.Provider>
    )
}
