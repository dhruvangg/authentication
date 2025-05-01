import { Outlet } from 'react-router';
import { AuthProvider } from '../Context/AuthContext';

export const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};
