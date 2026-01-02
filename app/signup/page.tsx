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
import { SignUpValidate } from "@/lib/validation/auth-validation";
import { toast } from "sonner";

export default function SignupForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullName = `${firstName} ${lastName}`.trim();
        const { errors: validationErrors, isError } = SignUpValidate(email, password, fullName);
        setErrors(validationErrors);

        if (!isError) {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name: fullName },
                },
            });
            setLoading(false);

            if (error) {
                if (error.message.includes("already registered")) {
                    toast.error("This email is already registered. Please sign in instead.");
                } else {
                    toast.error(error.message);
                }
            } else {
                if (data.user?.identities?.length === 0) {
                    toast.error("User already exists. Please sign in instead.");
                } else {
                    toast.success("Sign up successful! Please check your email for confirmation.");
                    router.push("/login");
                }
            }
        }
    };

    const handleGoogleSignUp = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) toast.error(error.message);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/40">
            <Card className="mx-auto max-w-sm w-full border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center font-heading">Sign Up</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={`bg-background/50 ${errors.name ? "border-red-500" : ""}`}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={`bg-background/50 ${errors.name ? "border-red-500" : ""}`}
                                />
                            </div>
                        </div>
                        {errors.name && (
                            <small className="text-red-500 text-xs -mt-2">{errors.name}</small>
                        )}
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
                            <Label htmlFor="password">Password</Label>
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
                            {loading ? "Creating account..." : "Create an account"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignUp}
                        >
                            <IconBrandGoogle className="mr-2 h-4 w-4" />
                            Sign up with Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
