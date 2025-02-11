import { DevicePlanner } from './DevicePlanner';
import { useTokenStore } from '../Context/useTokenStore';
import { LoginForm } from './LoginForm';

export function App() {
    const { hasToken } = useTokenStore();

    return hasToken()
        ? (
            <DevicePlanner
            />
        )
        : (
            <LoginForm
            />
        )

}

