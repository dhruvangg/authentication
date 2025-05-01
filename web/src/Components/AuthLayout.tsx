import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import axiosInstance from '../Utils/axios';

export const AuthLayout = () => {
    const [auth, setAuth] = useState({ isLoading: true, isAuthenticated: false, user: null });

    useEffect(() => {
        axiosInstance.get('/auth/session', { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setAuth({ isAuthenticated: true, user: response.data, isLoading: false });
                } else {
                    setAuth({ isAuthenticated: false, isLoading: false, user: null });
                }
            }).catch(() => setAuth({ isAuthenticated: false, isLoading: false, user: null }));

    }, []);

    console.log(auth);


    if (auth.isLoading) return <div>Loading...</div>;
    if (!auth.isAuthenticated) return <Navigate to="/" replace />;

    return <Outlet />; 
};
