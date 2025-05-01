import { useAuth } from "../Context/AuthContext"
import axiosInstance from "../Utils/axios"

function Dashboard() {

    const authContext = useAuth();
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user } = authContext;

    const handleClick = () => {
        axiosInstance.get('/verify', {
            withCredentials: true,
        }).then(response => {
            console.log(response.data)
        }).catch(error => {
            console.error("There was an error fetching the dashboard!", error);
        })

    }
    return (
        <div>
            {user && <h1>Welcome {user.username}</h1>}
            <h1>Dashboard</h1>
            <button onClick={handleClick}>Click</button>
        </div>
    )
}

export default Dashboard