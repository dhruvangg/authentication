import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext"
import axiosInstance from "../Utils/axios"

function Dashboard() {
    const [profile, setProfile] = useState(null)
    const authContext = useAuth();
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { auth } = authContext

    return (
        <div>
            <h1>Dashboard</h1>
            {auth.isLoading ? <p>Loading...</p> : <p>Welcome, {auth.user?.username}</p>}
        </div>
    )
}

export default Dashboard