import DefaultLayout from "@/layouts/default";
import {EyeFilledIcon} from '../icons/EyeFilledIcon'
import {EyeSlashFilledIcon} from "@/icons/EyeSlashFilledIcon";
import React, {useEffect} from "react";
import {
    Tabs,
    Tab,
    Input,
    Button,
    Card,
    CardBody,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {useUserStore} from "@/store/useUserStore";
import {title} from "@/components/primitives";
import {env} from "@/env";
import {Link} from "@nextui-org/link";

export default function AuthPage() {
    const [selected, setSelected] = React.useState("login");
    const [isVisible, setIsVisible] = React.useState(false);
    const { isLoggedIn, setIsLoggedIn } = useUserStore();
    const navigate = useNavigate();


    useEffect(()=>{
        if(isLoggedIn){
            navigate("/");
        }
    },[isLoggedIn, navigate])

    const toggleVisibility = () => setIsVisible(!isVisible);
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        name: "",
    });
    const [errors, setErrors] = React.useState({
        username: "",
        password: "",
        name: "",
    });
    const [generalError, setGeneralError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setGeneralError("");
    };
    const toggleTab = (key: string) =>{
        setSelected(key);
        setGeneralError("");
        setErrors({ username: "", password: "", name: "" });
    }
    const handleSubmit = async (type: "login" | "sign-up") => {
        setLoading(true);
        setErrors({ username: "", password: "", name: "" });
        setGeneralError("");

        const url =
            type === "login"
                ? `${env.REACT_APP_BACKEND_URL}/auth/signin`
                : `${env.REACT_APP_BACKEND_URL}/auth/signup`;

        const body =
            type === "login"
                ? {
                    username: formData.username,
                    password: formData.password,
                }
                : {
                    username: formData.username,
                    name: formData.name,
                    password: formData.password,
                };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);


                const newErrors: any = { username: "", password: "", name: "" };
                if (Array.isArray(errorData.message)) {
                    errorData.message.forEach((msg: string) => {
                        if (msg.toLowerCase().includes("username")) newErrors.username = msg;
                        if (msg.toLowerCase().includes("password")) newErrors.password = msg;
                        if (msg.toLowerCase().includes("name")) newErrors.name = msg;
                    });
                } else {
                    setGeneralError(errorData.message || "An unknown error occurred.");
                }
                setErrors(newErrors);
                throw new Error(errorData.message || "Something went wrong");
            }

            await response.json();
            if(type === "login"){
                setIsLoggedIn(true);
                navigate("/");
            }

            setFormData({ username: "", password: "", name: "" });
            setSelected("login");
        } catch (error: any) {
            if (!generalError) {
                setGeneralError(error.message || "An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center">
                    <h1 className={`py-3 mx-auto ${title()}`}>Let's get you in</h1>
                    <div className="flex flex-col w-full mx-auto pt-5">
                        <Card className="max-w-full w-[340px] h-fit">
                            <CardBody className="overflow-hidden">
                                <Tabs
                                    fullWidth
                                    size="md"
                                    aria-label="Tabs form"
                                    selectedKey={selected}
                                    onSelectionChange={(key) => toggleTab(key as string)}
                                >
                                    {/* Login Form */}
                                    <Tab key="login" title="Login" >
                                        <form
                                            className="flex flex-col gap-4"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmit("login");
                                            }}
                                        >
                                            <Input
                                                isRequired
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                label="Username"
                                                placeholder="Enter your username"
                                                errorMessage={!!errors.username}
                                            />
                                            <Input
                                                isRequired
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                label="Password"
                                                placeholder="Enter your password"
                                                endContent={
                                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                                        {isVisible ? (
                                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                        ) : (
                                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                        )}
                                                    </button>
                                                }
                                                type={isVisible ? "text" : "password"}
                                                errorMessage={!!errors.password}
                                            />
                                            {generalError && (
                                                <p className="text-red-500 text-center text-sm">{generalError}</p>
                                            )}
                                            <div className="flex gap-2 justify-end">
                                                <Button fullWidth color="primary" isLoading={loading} type={"submit"}>
                                                    Login
                                                </Button>
                                            </div>
                                            <p className="text-center text-small">
                                                Need to create an account?{" "}
                                                <Link size="sm" onPress={() => setSelected("sign-up")}>
                                                    Sign up
                                                </Link>
                                            </p>
                                        </form>
                                    </Tab>

                                    {/* Sign Up Form */}
                                    <Tab key="sign-up" title="Sign up">
                                        <form
                                            className="flex flex-col gap-4 h-[300px]"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmit("sign-up");
                                            }}
                                        >
                                            <Input
                                                isRequired
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                label="Name"
                                                placeholder="Enter your name"
                                                errorMessage={!!errors.name}
                                            />
                                            <Input
                                                isRequired
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                label="Username"
                                                placeholder="Enter your username"
                                                errorMessage={!!errors.username}
                                            />
                                            <Input
                                                isRequired
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                label="Password"
                                                placeholder="Enter your password"
                                                endContent={
                                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                                        {isVisible ? (
                                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                        ) : (
                                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                        )}
                                                    </button>
                                                }
                                                type={isVisible ? "text" : "password"}
                                                errorMessage={!!errors.password}
                                            />
                                            {generalError && (
                                                <p className="text-red-500 text-center text-sm">{generalError}</p>
                                            )}
                                            <div className="flex gap-2 justify-end">
                                                <Button fullWidth color="primary" isLoading={loading} type={"submit"}>
                                                    Sign up
                                                </Button>
                                            </div>
                                            <p className="text-center text-small">
                                                Already have an account?{" "}
                                                <Link size="sm" onPress={() => setSelected("login")}>
                                                    Login
                                                </Link>
                                            </p>
                                        </form>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
}