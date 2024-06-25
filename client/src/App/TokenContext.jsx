import axios from 'axios';
import { createContext, useState } from 'react';
import { baseUrl } from '../Context/FetchExperiment';

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
        return axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? 'Bearer ' + token : undefined,
            },
        });
    }
    const doLogin = async (username, password) => {
        try {
            const data = await axiosToken().post("login",
                { username, password },
            );
            setToken(data.data.access_token);
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.msg || e)
        }
    }

    const doLogout = async () => {
        try {
            const data = await axiosToken().post("logout");
            removeToken();
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.msg || e)
        }
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