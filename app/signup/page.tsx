
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

export default function SignupForm() {
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
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="Max" required className="bg-background/50" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Robinson" required className="bg-background/50" />
                            </div>
                        </div>
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
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required className="bg-background/50" />
                        </div>
                        <Button type="submit" className="w-full text-base font-semibold">
                            Create an account
                        </Button>
                        <Button variant="outline" className="w-full">
                            Sign up with GitHub
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
