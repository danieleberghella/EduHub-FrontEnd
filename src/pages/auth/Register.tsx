import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const API_URL = import.meta.env.VITE_API_URL;

const registerFormSchema = z
    .object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const Register = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    /* react hook form implementation */
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        defaultValues: initialValues,
        resolver: zodResolver(registerFormSchema),
    });

    const submitHandler: SubmitHandler<RegisterFormValues> = (data) => {
        setError(false);
        setSuccess(false);
        axios
            .post(`${STORAGE_URL}/auth/register`, data)
            .then((res) => {
                console.log(res.data);
                setSuccess(true);
            })
            .catch((err) => {
                setError(true);
                console.log(err);
            });

        const javaUserSignup = `email=${data.email}&password=${data.password}`
        axios.post(`${API_URL}/signup`, new URLSearchParams({
            email: data.email,
            password: data.password
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((res) => {
                console.log("Java SignUp Res", res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="container max-w-md mx-auto py-6 space-y-5">
            <div className="mb-4">
                <h1 className="font-bold text-2xl">Register</h1>
                <p>Register a new user</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
                <Input
                    {...register("name")}
                    placeholder="First name"
                    type="text"
                    className={cn(errors.name && "outline outline-destructive")}
                />
                {errors.name && (
                    <span className="text-destructive">{errors.name.message as string}</span>
                )}
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
                {errors.password && (
                    <span className="text-destructive">{errors.password.message as string}</span>
                )}
                <div className="relative">
                    <Input
                        {...register("confirmPassword", { required: true })}
                        placeholder="Confirm Password"
                        className="pr-10"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                    />
                    <Button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0 size-8 cursor-pointer"
                        variant="ghost"
                        onClick={() => {
                            setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                        }}>
                        <span className="pointer-events-none">
                            {isConfirmPasswordVisible ? <EyeOff /> : <Eye />}
                        </span>
                    </Button>
                </div>
                {errors.confirmPassword && (
                    <span className="text-destructive">
                        {errors.confirmPassword.message as string}
                    </span>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Invia
                </Button>
            </form>
            {success && (
                <Alert variant="success">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Registration Successful!</AlertTitle>
                    <AlertDescription>
                        You have successfully registered! Please login{" "}
                        <Link to="/auth/login" className="underline font-bold">
                            here
                        </Link>
                    </AlertDescription>
                </Alert>
            )}
            {error && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error during registration</AlertTitle>
                    <AlertDescription>There was an error during the registration</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default Register;
