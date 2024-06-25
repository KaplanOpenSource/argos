import { useContext } from 'react';
import { DevicePlanner } from './DevicePlanner';
import { TokenContext } from './TokenContext';
import { LoginForm } from './LoginForm';

export function App() {
    const { token, hasToken } = useContext(TokenContext);

    // console.log(token)
    return hasToken
        ? (
            <DevicePlanner
            />
        )
        : (
            <LoginForm
            />
        )

}

