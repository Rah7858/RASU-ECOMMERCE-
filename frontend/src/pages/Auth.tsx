import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type AuthTab = "login" | "signup";

interface LoginForm {
  identifier: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface VerifyForm {
  channel: "email" | "phone";
  email: string;
  phone: string;
  otp: string;
  maskedDestination?: string;
}

interface AuthProps {
  defaultTab?: AuthTab;
  isModal?: boolean;
  onClose?: () => void;
}

const Auth = ({ defaultTab = "login", isModal = false, onClose }: AuthProps) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [verifyForm, setVerifyForm] = useState<VerifyForm>({
    channel: "email",
    email: "",
    phone: "",
    otp: "",
    maskedDestination: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request");
  const [forgotForm, setForgotForm] = useState({
    emailOrPhone: "",
    otp: "",
    newPassword: "",
    maskedDestination: "",
  });
  const [otpChannel, setOtpChannel] = useState<"email" | "phone">("email");

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validatePhone = (value: string) => /^[6-9]\d{9}$/.test(value.trim());

  const validateOtp = (value: string) => /^\d{6}$/.test(value.trim());

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.identifier.trim()) {
      newErrors.identifier = "Email or phone number is required.";
    } else if (
      !validateEmail(loginForm.identifier) &&
      !validatePhone(loginForm.identifier)
    ) {
      newErrors.identifier = "Enter a valid email address or 10-digit phone number.";
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required.";
    } else if (loginForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};

    if (!signupForm.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!signupForm.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(signupForm.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!signupForm.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(signupForm.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!signupForm.password) {
      newErrors.password = "Password is required.";
    } else if (signupForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleApiError = async (response: Response) => {
    const data = await response.json().catch(() => null);
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0]?.msg || "Something went wrong. Please try again.";
    }
    return data?.message || "Something went wrong. Please try again.";
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setGeneralError("");
      return;
    }

    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: loginForm.identifier,
          password: loginForm.password,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        if (response.status === 403 && payload?.requiresVerification && payload?.email) {
          setVerifyForm({
            channel: payload.channel === "phone" ? "phone" : "email",
            email: payload.email,
            phone: payload.phone || "",
            otp: "",
            maskedDestination: payload.maskedDestination || "",
          });
          setShowVerification(true);
          setGeneralError(payload.message || "Verify your email before logging in.");
          return;
        }
        const errorMessage = payload?.message || "Something went wrong. Please try again.";
        setGeneralError(
          errorMessage === "Incorrect email/phone or password"
            ? "Incorrect email/phone or password. Use 'Forgot password?' if needed."
            : errorMessage
        );
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      localStorage.setItem("rasu_user", JSON.stringify(data.user));
      localStorage.setItem("rasu_token", data.token);
      window.dispatchEvent(new Event("rasu-auth-changed"));
      toast.success("Logged in successfully.");
      if (onClose) onClose();
      navigate("/profile");
    } catch (error) {
      setGeneralError("Unable to login right now. Please try again later.");
      toast.error("Unable to login right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateSignup();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setGeneralError("");
      return;
    }

    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          phone: signupForm.phone,
          password: signupForm.password,
          otpChannel,
        }),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(response);
        setGeneralError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      setVerifyForm({
        channel: data.channel === "phone" ? "phone" : "email",
        email: signupForm.email.trim().toLowerCase(),
        phone: signupForm.phone.trim(),
        otp: "",
        maskedDestination: data.maskedDestination || "",
      });
      setShowVerification(true);
      setGeneralError("");
      toast.success(
        data.channel === "phone"
          ? `Verification code sent to ${data.maskedDestination || "your phone"}.`
          : `Verification code sent to ${data.maskedDestination || "your email"}.`
      );
    } catch (error) {
      setGeneralError("Unable to create account right now. Please try again later.");
      toast.error("Unable to create account right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (verifyForm.channel === "email" && !validateEmail(verifyForm.email)) {
      newErrors.verifyEmail = "Enter a valid email address.";
    }

    if (verifyForm.channel === "phone" && !validatePhone(verifyForm.phone)) {
      newErrors.verifyPhone = "Enter a valid 10-digit mobile number.";
    }

    if (!validateOtp(verifyForm.otp)) {
      newErrors.verifyOtp = "Enter the 6-digit verification code.";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: verifyForm.channel,
          email: verifyForm.email,
          phone: verifyForm.phone,
          otp: verifyForm.otp,
        }),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(response);
        setGeneralError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      localStorage.setItem("rasu_user", JSON.stringify(data.user));
      localStorage.setItem("rasu_token", data.token);
      window.dispatchEvent(new Event("rasu-auth-changed"));
      toast.success("Verification completed successfully.");
      if (onClose) onClose();
      navigate("/profile");
    } catch {
      setGeneralError("Unable to verify email right now. Please try again later.");
      toast.error("Unable to verify email right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (verifyForm.channel === "email" && !validateEmail(verifyForm.email)) {
      setErrors({ verifyEmail: "Enter a valid email address." });
      return;
    }

    if (verifyForm.channel === "phone" && !validatePhone(verifyForm.phone)) {
      setErrors({ verifyPhone: "Enter a valid 10-digit mobile number." });
      return;
    }

    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: verifyForm.channel,
          email: verifyForm.email,
          phone: verifyForm.phone,
        }),
      });

      if (!response.ok) {
        const errorMessage = await handleApiError(response);
        setGeneralError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      setVerifyForm((previous) => ({
        ...previous,
        maskedDestination: data.maskedDestination || previous.maskedDestination,
      }));
      toast.success(
        data.channel === "phone"
          ? `Verification code sent to ${data.maskedDestination || "your phone"}.`
          : `Verification code sent to ${data.maskedDestination || "your email"}.`
      );
    } catch {
      setGeneralError("Unable to resend verification code right now.");
      toast.error("Unable to resend verification code right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const requestResetCode = async () => {
    const identifier = forgotForm.emailOrPhone.trim();
    if (!identifier) {
      setErrors({ forgotIdentifier: "Email or phone is required." });
      return;
    }
    if (!validateEmail(identifier) && !validatePhone(identifier)) {
      setErrors({ forgotIdentifier: "Enter a valid email address or 10-digit phone number." });
      return;
    }
    setErrors({});
    setGeneralError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: identifier }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to send reset code");
      if (!data?.maskedDestination) {
        throw new Error("No account found with this email or phone");
      }
      setForgotForm((prev) => ({ ...prev, maskedDestination: data.maskedDestination || "" }));
      setForgotStep("verify");
      toast.success(`Reset code sent to ${data.maskedDestination || "your email"}.`);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestResetCode();
  };

  const handleForgotPasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!validateOtp(forgotForm.otp)) newErrors.forgotOtp = "Enter the 6-digit reset code.";
    if (!forgotForm.newPassword || forgotForm.newPassword.length < 6)
      newErrors.forgotPassword = "Password must be at least 6 characters.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setGeneralError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: forgotForm.emailOrPhone.trim(),
          otp: forgotForm.otp.trim(),
          newPassword: forgotForm.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to reset password");
      toast.success("Password reset successfully. Please log in.");
      setShowForgotPassword(false);
      setForgotStep("request");
      setForgotForm({ emailOrPhone: "", otp: "", newPassword: "", maskedDestination: "" });
      setGeneralError("");
      setErrors({});
      setTab("login");
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const loginButtonLabel = useMemo(
    () => (isLoading ? "Logging in..." : "Login"),
    [isLoading]
  );

  const signupButtonLabel = useMemo(
    () => (isLoading ? "Creating account..." : "Create Account"),
    [isLoading]
  );

  const verifyButtonLabel = useMemo(
    () => (isLoading ? "Verifying..." : "Verify OTP"),
    [isLoading]
  );

  const containerClass = isModal ? "w-full max-w-md" : "min-h-screen flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-md">
        {!isModal && (
          <Button variant="ghost" onClick={() => navigate("/") }>
            Back to Home
          </Button>
        )}

        <Card className="mt-4">
          <CardHeader className="text-center">
            <CardTitle>Welcome to RASU</CardTitle>
            <CardDescription>
              {showForgotPassword
                ? forgotStep === "request"
                  ? "Enter your email or phone to receive a password reset code."
                  : `Reset code sent to ${forgotForm.maskedDestination || "your email"}. Enter it below.`
                : showVerification
                ? `Enter the OTP sent to ${verifyForm.maskedDestination || (verifyForm.channel === "phone" ? "your phone" : "your email")} to activate your account.`
                : "Sign in if you already have an account, or create a new account."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {showForgotPassword ? (
              <div className="space-y-4">
                {forgotStep === "request" ? (
                  <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-identifier">Email or Phone Number</Label>
                      <Input
                        id="forgot-identifier"
                        type="text"
                        placeholder="name@example.com or 9876543210"
                        value={forgotForm.emailOrPhone}
                        onChange={(e) => setForgotForm({ ...forgotForm, emailOrPhone: e.target.value })}
                      />
                      {errors.forgotIdentifier && (
                        <p className="text-sm text-destructive">{errors.forgotIdentifier}</p>
                      )}
                    </div>
                    {generalError && <p className="text-sm text-destructive">{generalError}</p>}
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Code"}
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setGeneralError("");
                        setErrors({});
                      }}
                    >
                      Back to Login
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-otp">Reset Code</Label>
                      <Input
                        id="forgot-otp"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={forgotForm.otp}
                        onChange={(e) => setForgotForm({ ...forgotForm, otp: e.target.value.replace(/\D/g, "") })}
                      />
                      {errors.forgotOtp && <p className="text-sm text-destructive">{errors.forgotOtp}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-new-password">New Password</Label>
                      <Input
                        id="forgot-new-password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={forgotForm.newPassword}
                        onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                      />
                      {errors.forgotPassword && <p className="text-sm text-destructive">{errors.forgotPassword}</p>}
                    </div>
                    {generalError && <p className="text-sm text-destructive">{generalError}</p>}
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      variant="outline"
                      onClick={requestResetCode}
                      disabled={isLoading}
                    >
                      Resend Code
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotStep("request");
                        setForgotForm({ emailOrPhone: "", otp: "", newPassword: "", maskedDestination: "" });
                        setGeneralError("");
                        setErrors({});
                      }}
                    >
                      Back to Login
                    </Button>
                  </form>
                )}
              </div>
            ) : showVerification ? (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                {verifyForm.channel === "email" ? (
                  <div className="space-y-2">
                    <Label htmlFor="verify-email">Email</Label>
                    <Input
                      id="verify-email"
                      type="email"
                      value={verifyForm.email}
                      onChange={(event) =>
                        setVerifyForm({
                          ...verifyForm,
                          email: event.target.value,
                        })
                      }
                    />
                    {errors.verifyEmail && (
                      <p className="text-sm text-destructive">{errors.verifyEmail}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="verify-phone">Phone Number</Label>
                    <Input
                      id="verify-phone"
                      inputMode="numeric"
                      maxLength={10}
                      value={verifyForm.phone}
                      onChange={(event) =>
                        setVerifyForm({
                          ...verifyForm,
                          phone: event.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                    {errors.verifyPhone && (
                      <p className="text-sm text-destructive">{errors.verifyPhone}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="verify-otp">Verification Code</Label>
                  <Input
                    id="verify-otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={verifyForm.otp}
                    onChange={(event) =>
                      setVerifyForm({
                        ...verifyForm,
                        otp: event.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                  {errors.verifyOtp && (
                    <p className="text-sm text-destructive">{errors.verifyOtp}</p>
                  )}
                </div>

                {generalError && (
                  <p className="text-sm text-destructive">{generalError}</p>
                )}

                <Button className="w-full" type="submit" disabled={isLoading}>
                  {verifyButtonLabel}
                </Button>

                <Button
                  className="w-full"
                  type="button"
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>

                <Button
                  className="w-full"
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowVerification(false);
                    setGeneralError("");
                    setErrors({});
                    setVerifyForm({
                      channel: "email",
                      email: "",
                      phone: "",
                      otp: "",
                      maskedDestination: "",
                    });
                  }}
                >
                  Back
                </Button>
              </form>
            ) : (
            <Tabs value={tab} onValueChange={(value) => {
              setTab(value as AuthTab);
              setErrors({});
              setGeneralError("");
            }}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-identifier">Email or Phone Number</Label>
                    <Input
                      id="login-identifier"
                      type="text"
                      placeholder="name@example.com or 9876543210"
                      value={loginForm.identifier}
                      onChange={(event) =>
                        setLoginForm({
                          ...loginForm,
                          identifier: event.target.value,
                        })
                      }
                    />
                    {errors.identifier && (
                      <p className="text-sm text-destructive">{errors.identifier}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm({
                          ...loginForm,
                          password: event.target.value,
                        })
                      }
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {generalError && (
                    <p className="text-sm text-destructive">{generalError}</p>
                  )}

                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {loginButtonLabel}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setForgotStep("request");
                        setForgotForm({
                          emailOrPhone: loginForm.identifier,
                          otp: "",
                          newPassword: "",
                          maskedDestination: "",
                        });
                        setGeneralError("");
                        setErrors({});
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Your name"
                      value={signupForm.name}
                      onChange={(event) =>
                        setSignupForm({
                          ...signupForm,
                          name: event.target.value,
                        })
                      }
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signupForm.email}
                      onChange={(event) =>
                        setSignupForm({
                          ...signupForm,
                          email: event.target.value,
                        })
                      }
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      value={signupForm.phone}
                      onChange={(event) =>
                        setSignupForm({
                          ...signupForm,
                          phone: event.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Get OTP On</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={otpChannel === "email" ? "default" : "outline"}
                        onClick={() => setOtpChannel("email")}
                      >
                        Gmail
                      </Button>
                      <Button
                        type="button"
                        variant={otpChannel === "phone" ? "default" : "outline"}
                        onClick={() => setOtpChannel("phone")}
                      >
                        Phone
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {otpChannel === "phone"
                        ? "Phone OTP needs SMS provider setup on backend."
                        : "OTP will be sent to your email inbox."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signupForm.password}
                      onChange={(event) =>
                        setSignupForm({
                          ...signupForm,
                          password: event.target.value,
                        })
                      }
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(event) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: event.target.value,
                        })
                      }
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {generalError && (
                    <p className="text-sm text-destructive">{generalError}</p>
                  )}

                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {signupButtonLabel}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
