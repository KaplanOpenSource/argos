import { createContext, useState } from 'react';

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

    return (
        <TokenContext.Provider value={{
            setToken: saveToken,
            token,
            removeToken,
            hasToken
        }}>
            {children}
        </TokenContext.Provider>
    )
}
