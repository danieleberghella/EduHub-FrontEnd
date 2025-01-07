import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Homepage = () => {
    const { user, logout, userPath } = useAuth();
    return (
        <div className="min-h-screen flex w-full justify-center items-center bg-[#2a3c61]">
            <div className="flex flex-col justify-center items-center w-full h-full min-h-screen bg-homepage-background bg-repeat bg-center">
                <div className="grid grid-cols-1 gap-16 w-full max-w-lg ">
                    <Card className="flex flex-col w-full justify-between items-center gap-8 p-12 border-2 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg">
                        <CardTitle className="font-extrabold text-5xl text-[#2a3c61]">
                            EduHub
                        </CardTitle>
                        <CardDescription className="font-medium text-lg text-[#2a3c61]/80">
                            Your School Companion
                        </CardDescription>
                        <div className="flex w-full m-auto gap-4 items-center">
                            {user ? <><Link to={`/${userPath}`} className="w-2/3">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full bg-[#2a3c61] text-white hover:text-white hover:bg-[#1a2744] shadow-lg"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                                <span className="text-[#2a3c61]/70">or</span>
                                <Button onClick={() => logout()}
                                    variant="outline"
                                    className="w-2/3 rounded-full bg-[#2a3c61] text-white hover:text-white hover:bg-[#1a2744] shadow-lg"
                                >
                                    Log Out
                                </Button>
                            </>
                                :
                                <><Link to={"auth/signup"} className="w-2/3">
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full bg-[#2a3c61] text-white hover:text-white hover:bg-[#1a2744] shadow-lg"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                                    <span className="text-[#2a3c61]/60">or</span>
                                    <Link to={"auth/login"} className="w-2/3">
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-full bg-[#2a3c61] text-white hover:text-white hover:bg-[#1a2744] shadow-lg"
                                        >
                                            Log In
                                        </Button>
                                    </Link></>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
