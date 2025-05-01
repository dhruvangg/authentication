import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    auth: {
        isAuthenticated: boolean;
        user: any | null;
        isLoading: boolean;
    };
    setAuth: React.Dispatch<React.SetStateAction<{
        isAuthenticated: boolean;
        user: any | null;
        isLoading: boolean;
    }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { ReactNode } from "react";
import axiosInstance from "../Utils/axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        isLoading: true,
    });

    useEffect(() => {
        axiosInstance.get('/auth/session', { withCredentials: true }).then(response => {
            if (response.status === 200) {
                setAuth({ isAuthenticated: true, user: response.data.user, isLoading: false });
            } else {
                setAuth({ isAuthenticated: false, user: null, isLoading: false });
            }
        }).catch(() => setAuth({ isAuthenticated: false, user: null, isLoading: false }));
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>    
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
    return useContext(AuthContext);
}
