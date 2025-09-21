"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  async function handleUserLogin(values) {
    setIsSubmitting(true);

    console.log(values);

    axios
      .post(`/api/auth/login`, values)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        let errorMessage = "Login failed";
        let description = "Please check your credentials and try again";

        console.log(error);

        if (error.status === 401 || error.status === 404) {
          errorMessage = "Invalid credentials";
          description = "Please check your email/UID and password";
        } else if (error.status === 423) {
          errorMessage = "Account temporarily locked";
          description = "Please try again after some time or contact support";
        } else if (error.status === 403) {
          errorMessage = "Account not activated";
          description = "Please verify your email or contact support";
        } else if (error.status === 429) {
          errorMessage = "Too many attempts";
          description = "Please wait before trying again";
        } else if (error.status >= 500) {
          errorMessage = "Server error";
          description = "Please try again later";
        }

        toast.error(errorMessage, {
          description,
          duration: 4000,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    if (true) {
      console.log("Login successful:");

      toast.success(`Welcome back, ${"Mohammad Rizwan"}! 🎉`, {
        description: `You are now signed in as ${"Student"}`,
        duration: 3000,
      });

      router.push("/profile");
    } else {
      throw new Error(result.message || "Login failed");
    }
  }
  return (
    <>
      <div className="min-h-screen relative overflow-hidden py-8">
        <div className="inset-0 z-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="container flex justify-center mx-auto">
                <img src="/almasync.png" className="h-16" alt="logo image" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg  max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row min-h-[600px]">
                <div className="hidden md:block md:w-5/12 bg-orange-500 relative overflow-hidden">
                  <div
                    className="absolute inset-0 z-0 opacity-10"
                    style={{
                      backgroundImage:
                        "url('https://d8it4huxumps7.cloudfront.net/uploads/images/login/border-vector-image.png?d=943x2825')",
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  ></div>
                  <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="p-8 flex-grow">
                      <div className="h-full flex flex-col">
                        <div className="transition-opacity duration-500 opacity-0 hidden">
                          <div className="aspect-w-16 aspect-h-9 mb-4">
                            <img
                              src="https://d8it4huxumps7.cloudfront.net/uploads/images/65799bf7b8ae5_frame_1000013237.png?d=700x700"
                              alt="Connect with Alumni"
                              className="w-full h-72 object-cover rounded-lg"
                            />
                          </div>
                          <div className="mt-4 text-gray-900">
                            <h3 className="text-lg font-bold">
                              Connect with Alumni
                            </h3>
                            <p className="mt-2 text-sm text-gray-800">
                              Join a vibrant community of graduates and expand
                              your professional network
                            </p>
                          </div>
                        </div>
                        <div className="transition-opacity duration-500 opacity-0 hidden">
                          <div className="aspect-w-16 aspect-h-9 mb-4">
                            <img
                              src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3829b1d2da_jobs_internships.png?d=996x803"
                              alt="Access Opportunities"
                              className="w-full h-72 object-cover rounded-lg"
                            />
                          </div>
                          <div className="mt-4 text-gray-900">
                            <h3 className="text-lg font-bold">
                              Access Opportunities
                            </h3>
                            <p className="mt-2 text-sm text-gray-800">
                              Discover exclusive job postings and career
                              advancement opportunities
                            </p>
                          </div>
                        </div>
                        <div className="transition-opacity duration-500 opacity-100">
                          <div className="aspect-w-16 aspect-h-9 mb-4">
                            <img
                              src="https://d8it4huxumps7.cloudfront.net/uploads/images/un-pro/upgrade-banner-image.png?d=813x639"
                              alt="Stay Updated"
                              className="w-full h-72 object-cover rounded-lg"
                            />
                          </div>
                          <div className="mt-4 text-gray-900">
                            <h3 className="text-lg font-bold">Stay Updated</h3>
                            <p className="mt-2 text-sm text-gray-800">
                              Get the latest news and updates from your alma
                              mater
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/90 p-6 backdrop-blur-md mt-auto border-t border-amber-100/50 shadow-lg">
                      <div className="text-center space-y-4">
                        <div className="pt-2 border-t border-amber-100">
                          <p className="text-sm text-gray-600 mb-2">
                            By joining alma-sync, you agree to our
                          </p>
                          <div className="flex justify-center items-center space-x-4 text-sm font-medium">
                            <Button variant="link">Terms</Button>
                            <div className="w-1 h-1 rounded-full bg-amber-300"></div>
                            <Button variant="link">Privacy</Button>
                            <div className="w-1 h-1 rounded-full bg-amber-300"></div>
                            <Button variant="link">Guidelines</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-7/12 bg-white flex flex-col">
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                      <div className="mb-8">
                        <div className="flex items-start space-x-2">
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome back to Alma-Sync!
                            <span className="ml-2 inline-block animate-wave">
                              👋
                            </span>
                          </h2>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            Sign in to your account to continue your journey
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-xs font-medium text-amber-700">
                              🎓 Alumni Network
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-700">
                              💼 Job Opportunities
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-xs font-medium text-green-700">
                              🤝 Mentorship
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <Form {...form}>
                          <form
                            className="space-y-5 mt-2"
                            onSubmit={form.handleSubmit(handleUserLogin)}
                          >
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-foreground">
                                    Email or UID
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      placeholder="Enter Email or UID"
                                      className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                      {...field}
                                      disabled={isSubmitting}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-foreground">
                                    Password
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={
                                          showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter password"
                                        className="h-10 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-amber-600 placeholder:font-light"
                                        {...field}
                                        disabled={isSubmitting}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center justify-between">
                              <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="rounded border-gray-300 cursor-pointer"
                                        disabled={isSubmitting || isLoading}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm text-muted-foreground cursor-pointer">
                                      Remember Me
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm text-red-500 hover:text-opacity-80 cursor-pointer"
                                onClick={() => router.push("/reset-password")}
                              >
                                Forgot Your Password?
                              </Button>
                            </div>

                            <Button
                              type="submit"
                              className="w-full h-12 text-sm font-medium bg-amber-600 hover:bg-green-600 text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
                              disabled={isSubmitting || isLoading}
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Log In"
                              )}
                            </Button>
                          </form>
                        </Form>

                        <div className="text-center text-sm mt-2 text-muted-foreground">
                          <>
                            Don't Have An Account?{" "}
                            <Button
                              variant="link"
                              className="p-0 h-auto text-sm text-amber-600 hover:text-opacity-80 font-medium cursor-pointer"
                              onClick={() => router.push("/register")}
                            >
                              Register Now.
                            </Button>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
