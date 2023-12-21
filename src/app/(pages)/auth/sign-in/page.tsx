"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid Email Address" }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export type SignIn = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (formData: SignIn) => {
    setIsPending(true);
    signIn("credentials", {
      ...formData,
      redirect: false,
      //callbackUrl: "/",
    })
      .then((cb) => {
        console.log(cb);
        setIsPending(false);
        if (cb?.ok) {
          router.push("/");
          toast.success("Logged In");
        } else {
          toast.error(cb?.error);
          //router.push("/unauthorized");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session && session.user) {
      router.back();
    }
  }, [session, router]);

  return (
    <div className="container relative flex flex-col items-center justify-center lg:px-0 mt-[15%]">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
        </div>

        {/* sign-in form */}
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* type */}

              {/* submit button */}
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-secondary" />
                )}
                Submit
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-center my-5 w-[350px] gap-3">
            <Separator className="w-[80px]" />
            <p className="text-sm">or</p>
            <Separator className="w-[80px]" />
          </div>

          {/* google sign in */}
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Continue with Google
          </Button>
        </div>

        <Link
          className={buttonVariants({
            variant: "link",
            className: "gap-1.5 mt-5",
          })}
          href="/auth/sign-up"
        >
          New here ? Sign-Up
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
