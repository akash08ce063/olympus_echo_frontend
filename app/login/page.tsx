"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { SignInValidate } from "@/lib/validation/auth-validation";
import { toast } from "sonner";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();
    const supabase = createClient();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const { errors: validationErrors, isError } = SignInValidate(email, password);
        setErrors(validationErrors);

        if (!isError) {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            setLoading(false);

            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    toast.warning("Please confirm your email before logging in. Check your inbox.");
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.success("Successfully logged in!");
                router.push("/dashboard");
            }
        }
    };

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) toast.error(error.message);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/40">
            <Card className="mx-auto max-w-sm w-full border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center font-heading">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`bg-background/50 ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && (
                                <small className="text-red-500 text-xs">{errors.email}</small>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`bg-background/50 ${errors.password ? "border-red-500" : ""}`}
                            />
                            {errors.password && (
                                <small className="text-red-500 text-xs">{errors.password}</small>
                            )}
                        </div>
                        <Button type="submit" className="w-full text-base font-semibold" disabled={loading}>
                            {loading ? "Loading..." : "Login"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                        >
                            <IconBrandGoogle className="mr-2 h-4 w-4" />
                            Login with Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-primary">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
