"use client";
import React, { useRef } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  
  const inputRefs = useRef([]);
  const router = useRouter();
  const { handleForgotPassword, handleOtpVerification, handlePasswordReset } = useAuthOperations();

  const isFormValid = password.length >= 8 && password === confirmPassword;

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendVerificationCode = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await handleForgotPassword(email);
      if (result?.success) {
        setCodeSent(true);
      }
    } catch (error) {
      console.error('Send code failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isCodeComplete) {
      toast.error('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    try {
      const otpData = { otp: code.join("") };
      const result = await handleOtpVerification(email, otpData);
      if (result?.success) {
        setCodeVerified(true);
        setVerificationToken(result.data?.token || 'verified');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const result = await handleForgotPassword(email);
      if (result?.success) {
        setCode(["", "", "", "", "", ""]); // Clear the code input
      }
    } catch (error) {
      console.error('Resend code failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const result = await handlePasswordReset(email, verificationToken, password);
      if (result?.success) {
        // Success handling and redirect is managed by useAuthOperations
      }
    } catch (error) {
      console.error('Password update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex font-sans">
        <div className="w-full  flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            <div className="flex justify-center mb-8">
              <Image
                src="/almasync.png"
                width={200}
                height={50}
                alt="AlmaSync Logo"
              />
            </div>

            {!codeSent && !codeVerified && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl text-foreground">Reset Password</h2>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll send you a reset code.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] placeholder:font-light"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendVerificationCode}
                  disabled={isLoading || !email.trim()}
                  className="w-full h-12 text-sm font-medium text-white  rounded-lg shadow-none cursor-pointer bg-amber-600 hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>

                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <div>
                    Remember Your Password?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                      style={{ color: "#3F3FF3" }}
                      onClick={() => router.push("/login")}
                    >
                      Back to Login.
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {codeSent && !codeVerified && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <Button
                    variant="ghost"
                    className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCodeSent((prev)=>false)
                      setCode(["", "", "", "", "", ""])
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  <h2 className="text-3xl text-foreground">Verify Code</h2>
                  <p className="text-muted-foreground">
                    Enter the 6-digit code sent to your email address.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center gap-3">
                      {code.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleCodeChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold border-gray-400 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706]"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={!isCodeComplete || isLoading}
                  className="w-full h-12 text-sm font-medium text-white rounded-lg shadow-none cursor-pointer bg-amber-600 hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <div>
                    Didn't receive the code?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                      style={{ color: "#3F3FF3" }}
                      onClick={handleResendCode}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Resend Code"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {codeVerified && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCodeSent((prev)=>false)
                      setCodeVerified((prev)=>false)
                      setCode(["", "", "", "", "", ""])
                    }}
                    className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  <h2 className="text-3xl text-foreground">Set New Password</h2>
                  <p className="text-muted-foreground">
                    Create a strong password for your account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#D97706] pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {password &&
                    confirmPassword &&
                    password !== confirmPassword && (
                      <p className="text-sm text-red-500">
                        Passwords don't match
                      </p>
                    )}
                </div>

                <Button
                  onClick={handleUpdatePassword}
                  disabled={!isFormValid || isLoading}
                  className="w-full h-12 text-sm font-medium text-white rounded-lg shadow-none cursor-pointer bg-amber-600 hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>

                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <div>
                    Remember Your Password?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                      style={{ color: "#3F3FF3" }}
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
