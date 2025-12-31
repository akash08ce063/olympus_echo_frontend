
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline text-primary">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" type="password" required className="bg-background/50" />
                        </div>
                        <Button type="submit" className="w-full text-base font-semibold">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-primary">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
