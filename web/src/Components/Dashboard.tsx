import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext"
import axiosInstance from "../Utils/axios"

function Dashboard() {
    const [profile, setProfile] = useState(null)
    const authContext = useAuth();
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    useEffect(() => {
        fetchProfile()
        async function fetchProfile() {
            try {
                const response = await axiosInstance.get('/auth/profile', {
                    withCredentials: true,
                });
                console.log(response);
                
                setProfile(response.data);
            } catch (error) {
                console.error("There was an error fetching the profile!", error);
            }
        }
        return () => {
            setProfile(null);
        }
    }, [])

    return (
        <div>
            {profile && <h1>Welcome {profile?.username}</h1>}
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard