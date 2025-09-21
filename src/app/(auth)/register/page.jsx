"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { registerSchema } from "@/schemas/register.schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { es } from "zod/v4/locales";

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  // Redirect authenticated users
  useAuthGuard({ requireAuth: false });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isYearValid, setIsYearValid] = useState(true);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      uid: "",
      degree: "",
      department: "",
      admissionYear: "",
      passoutYear: "",
    },
  });

  async function handleUserRegister(values) {
    setIsSubmitting(true);

    try {
      // Validate year differences before API call
      const admission = parseInt(values.admissionYear);
      const passout = parseInt(values.passoutYear);
      const yearDifference = passout - admission;

      let yearValidationError = null;

      if (values.degree === "BTECH" && yearDifference !== 4) {
        yearValidationError =
          "For B.Tech, Admission Year and Passing Year must have exactly 4 years gap.";
      } else if (values.degree === "MTECH" && yearDifference !== 2) {
        yearValidationError =
          "For M.Tech, Admission Year and Passing Year must have exactly 2 years gap.";
      }

      if (yearValidationError) {
        setIsYearValid(false);
        toast.error(yearValidationError);
        return;
      } else {
        setIsYearValid(true);
      }

      // Determine role based on passout year
      const currentYear = new Date().getFullYear();
      const role = passout <= currentYear ? "alumni" : "student";

      const registerData = {
        ...values,
        admissionYear: admission,
        passoutYear: passout,
        college: "BVRIT", // Default college
        role: role, // Auto-determine role
      };

      console.log("Registration data:", registerData);

      // Call the authentication service
      const result = await register(registerData);
      
      // The success handling and redirect is now managed by authService and useAuthOperations
      if (result?.success) {
        // Success feedback is handled in the service
        // Redirect will be handled by useAuthOperations
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Error handling is done in the auth service
    } finally {
      setIsSubmitting(false);
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row">
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
                        <div className="transition-opacity duration-500 opacity-0 hidden ">
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
                        <div className="transition-opacity duration-500 opacity-100 ">
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

                <div className="w-full md:w-7/12 bg-white">
                  <div className="p-6 md:p-8">
                    <div
                      className="overflow-y-auto px-2 max-h-[70vh] space-y-4 pr-4"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "hsl(24.6, 95%, 53.1%)  transparent",
                      }}
                    >
                      <div className="mb-6">
                        <div className="flex items-start space-x-2">
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            Join Alma-Sync!
                            <span className="ml-2 inline-block animate-wave">
                              👋
                            </span>
                          </h2>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            Create your account and unlock a world of
                            opportunities
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

                      <Form {...form}>
                        <form
                          className=" px-2 space-y-4 pr-4"
                          onSubmit={form.handleSubmit(handleUserRegister)}
                        >
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  First Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter Firstname"
                                    className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  Last Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter Lastname"
                                    className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="Enter Email"
                                    className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                    {...field}
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
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter password"
                                      className="h-10 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-amber-600 placeholder:font-light"
                                      {...field}
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

                          <FormField
                            control={form.control}
                            name="uid"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  Enrollment Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter username or enrollment number"
                                    className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="degree"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  Degree
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 w-full border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706]">
                                      <SelectValue placeholder="Select degree" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="BTECH">
                                      {"Bachelor's Degree (BTECH)"}
                                    </SelectItem>
                                    <SelectItem value="MTECH">
                                      {"Master's Degree (MTECH)"}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  Department
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-10 border-gray-200 w-full focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light">
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="computer-science">
                                      Computer Science
                                    </SelectItem>
                                    <SelectItem value="electrical-engineering">
                                      Electrical Engineering
                                    </SelectItem>
                                    <SelectItem value="mechanical-engineering">
                                      Mechanical Engineering
                                    </SelectItem>
                                    <SelectItem value="civil-engineering">
                                      Civil Engineering
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex space-x-4">
                            <FormField
                              control={form.control}
                              name="admissionYear"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-sm font-medium text-foreground">
                                    Admission Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="2020"
                                      min="1992"
                                      max="2025"
                                      className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="passoutYear"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-sm font-medium text-foreground">
                                    Passing Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="2024"
                                      min="1996"
                                      max="2029"
                                      className="h-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {!isYearValid && (
                            <div className="">
                              <p className="text-red-500 text-xs min-h-[1rem]">
                                Invalid Admission Year and Passout Years for
                                Selected degree
                              </p>
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full h-12 text-sm font-medium text-white rounded-lg shadow-none cursor-pointer bg-amber-600 hover:bg-green-600"
                            disabled={isSubmitting || isLoading}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </div>
                    <div className="text-center text-sm mt-4 text-muted-foreground">
                      <>
                        Already Have An Account?{"  "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-amber-600 hover:text-opacity-80 font-medium cursor-pointer"
                          onClick={() => router.push("/login")}
                        >
                          Login.
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
    </>
  );
};

export default RegisterPage;
