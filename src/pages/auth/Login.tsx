import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const API_URL = import.meta.env.VITE_API_URL;

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const initialValues = {
    email: "",
    password: "",
};

const Login = () => {
    const { setAsLogged } = useAuth();

    const [error, setError] = useState<"generic" | "credentials" | null>(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    /* react hook form implementation */
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        defaultValues: initialValues,
        resolver: zodResolver(loginFormSchema),
    });

    const submitHandler: SubmitHandler<LoginFormValues> = (data) => {
        setError(null);
        axios
            .post(`${STORAGE_URL}/auth/login`, data)
            .then(({ data: { token } }) => {
                setAsLogged(token);
            })
            .catch((err) => {
                setError(err.status === 401 ? "credentials" : "generic");
            });

        const javaUserSignup = `email=${data.email}&password=${data.password}`
        axios.post(`${API_URL}/login`, new URLSearchParams({
            email: data.email,
            password: data.password
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((res) => {
                console.log("Java Login Res", res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="container max-w-md mx-auto py-6 space-y-5">
            <div className="mb-4">
                <h1 className="font-bold text-2xl">Login</h1>
                <p>Sign in now</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
                <Input
                    {...register("email", { required: true })}
                    placeholder="Email"
                    type="email"
                />
                {errors.email && (
                    <span className="text-destructive">{errors.email.message as string}</span>
                )}
                <div className="relative">
                    <Input
                        {...register("password", { required: true })}
                        placeholder="Password"
                        className="pr-10"
                        type={isPasswordVisible ? "text" : "password"}
                    />
                    <Button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0 size-8 cursor-pointer"
                        variant="ghost"
                        onClick={() => {
                            setIsPasswordVisible(!isPasswordVisible);
                        }}>
                        <span className="pointer-events-none">
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                        </span>
                    </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Accedi
                </Button>
            </form>
            {error && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>
                        {error === "credentials" ? "Invalid credentials" : "Error during login"}
                    </AlertTitle>
                    <AlertDescription>
                        {error === "credentials"
                            ? "The provided credentials are not correct."
                            : "There was an error during login action"}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default Login;
