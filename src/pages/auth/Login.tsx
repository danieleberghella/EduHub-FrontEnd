import { LoginForm } from "@/components/LoginForm"

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-homepage-background bg-repeat bg-center">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
