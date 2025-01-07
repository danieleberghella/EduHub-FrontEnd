import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/PasswordInput";
import { DatePickerInput } from "@/components/common/DatePickerInput";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const signUpSchema = z.object({
    firstName: z.string().min(3, "First Name must be at least 3 characters"),
    lastName: z.string().min(3, "Last Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    birthDate: z.date({ invalid_type_error: "Invalid date" }).refine((date) => date <= new Date(), {
        message: "Birth Date must be in the past",
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string().min(8, "Password must be at least 8 characters"),
}).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ["passwordConfirmation"],
        });
    }
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const submitHandler: SubmitHandler<SignUpFormValues> = (data) => {
        axios
            .post(
                `${API_URL}/signup`,
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    birthdate: format(data.birthDate, "yyyy-MM-dd"),
                    password: data.password,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then(() => {
                setSuccess(true);
            })
            .catch(() => {
                setError(true);
            });
    };

    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#2a3c61] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl relative">
                <header className="p-6 text-center text-white space-y-2">
                    <h1 className="text-4xl font-bold tracking-wide">Join Us on EduHub</h1>
                    <p className="text-lg text-white/60">Fill in the details to create your account</p>
                </header>
                <form className="space-y-6 p-6" onSubmit={handleSubmit(submitHandler)}>
                    <Input
                        {...register("firstName")}
                        placeholder="First Name"
                        type="text"
                        className={cn("w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors", errors.firstName && "outline outline-destructive")}
                    />
                    {errors.firstName && (
                        <span className="text-white text-sm">{errors.firstName.message}</span>
                    )}

                    <Input
                        {...register("lastName")}
                        placeholder="Last Name"
                        type="text"
                        className={cn("w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors", errors.lastName && "outline outline-destructive")}
                    />
                    {errors.lastName && (
                        <span className="text-white text-sm">{errors.lastName.message}</span>
                    )}

                    <Input
                        {...register("email")}
                        placeholder="Email"
                        type="email"
                        className={cn("w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors", errors.email && "outline outline-destructive")}
                    />
                    {errors.email && (
                        <span className="text-white text-sm">{errors.email.message}</span>
                    )}

                    <Controller
                        name="birthDate"
                        control={control}
                        render={({ field }) => (
                            <DatePickerInput
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                className={cn("w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors", errors.birthDate && "outline outline-destructive")}
                            />
                        )}
                    />
                    {errors.birthDate && (
                        <span className="text-white text-sm">{errors.birthDate.message}</span>
                    )}

                    <PasswordInput
                        {...register("password")}
                        placeholder="Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={cn("w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors", errors.password && "outline outline-destructive")}
                    />
                    {errors.password && (
                        <span className="text-white text-sm">{errors.password.message}</span>
                    )}

                    <PasswordInput
                        {...register("passwordConfirmation")}
                        placeholder="Confirm Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className={cn("w-full px-4 py-3 bg-[#f5e6d8] rounded-full text-[#2a3c61] placeholder-[#2a3c61]/60 font-medium border-2 border-transparent focus:border-white/20 focus:outline-none transition-colors", errors.passwordConfirmation && "outline outline-destructive")}
                    />
                    {errors.passwordConfirmation && (
                        <span className="text-white text-sm">{errors.passwordConfirmation.message}</span>
                    )}
                    {!success && (
                        <Button type="submit" disabled={isSubmitting} className="w-full mt-6 px-4 py-3 bg-[#4a9d9c] rounded-full text-white font-bold hover:bg-[#3a8b8a] transition-colors disabled:opacity-70">
                            Sign Up
                        </Button>
                    )}

                    <div className="flex flex-col gap-4">
                        {!success && !error && (
                            <p className="text-center text-sm text-white/60">
                                Already signed up?{' '}
                                <Link to="/auth/login" className="text-[#f5e6d8] hover:text-white">Log In</Link>
                                <span>{' '}or go{' '}<Link to="/" className="text-[#f5e6d8] hover:text-white">Home</Link></span>
                            </p>
                        )}
                        {success && (
                            <Alert variant="success" className="bg-white">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Registration Successful!</AlertTitle>
                                <AlertDescription>
                                    You have successfully registered! Please {' --> '}<Link to="/auth/login" className="text-lg font-bold text-blue-700">Log In.</Link>
                                </AlertDescription>
                            </Alert>
                        )}
                        {!success && error && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>Registration failed. Try again.</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
