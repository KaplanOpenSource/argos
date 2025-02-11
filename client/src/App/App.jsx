import { useTokenStore } from '../Context/useTokenStore';
import { DevicePlanner } from './DevicePlanner';
import { LoginForm } from './LoginForm';

export function App() {
    const { isLoggedIn } = useTokenStore();

    return isLoggedIn()
        ? (
            <DevicePlanner
            />
        )
        : (
            <LoginForm
            />
        )

}

