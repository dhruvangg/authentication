import { SubmitHandler, useForm } from "react-hook-form"
import axiosInstance from "../Utils/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

type FormData = {
    username: string;
    password: string;
}

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const navigate = useNavigate()

    const onSubmit: SubmitHandler<FormData> = data => {
        console.log(data)

        axiosInstance.post('/auth/login', data)
            .then(response => {
                console.log(response)
                navigate('/dashboard')
            }).catch(error => {
                console.error("There was an error logging in!", error);
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register("username", { required: true })} placeholder="Username" />
            {errors.username && <span>This field is required</span>}

            <input type="password" {...register("password", { required: true })} placeholder="Password" />
            {errors.password && <span>This field is required</span>}

            <button type="submit">Login</button>
        </form>
    )
}

export default Login