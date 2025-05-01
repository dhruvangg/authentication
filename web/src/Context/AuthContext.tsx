import { createContext, useContext, useState } from "react";

interface AuthContextType {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null)
 

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
    return useContext(AuthContext);
}
