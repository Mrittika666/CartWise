
import { useState } from "react";

function Login({ onLogin }) {
    const [mode, setMode] = useState("login");
    const [accountType, setAccountType] = useState("user");
    const [businessId, setBusinessId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        clearMessages();
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setBusinessId("");
    };

    const handleLoginSignup = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);

        try {
            const endpoint = mode === "signup" ? "register" : "login";

            const requestBody = mode === "signup"
                ? { name, email, password }
                : { email, password, accountType, businessId };

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Something went wrong");
            }

            let loginData = data;

            if (mode === "signup") {
                const loginResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email,
                            password,
                            accountType: "user",
                        }),
                    }
                );

                loginData = await loginResponse.json();

                if (!loginResponse.ok || !loginData.success) {
                    throw new Error(loginData.message || "Please login.");
                }
            }

            localStorage.setItem("token", loginData.token);
            localStorage.setItem("user", JSON.stringify(loginData.user));
            onLogin?.(loginData.user, loginData.token);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to send OTP");
            }

            setSuccess(data.message);
            setMode("verify");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        clearMessages();
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/verify-reset-otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "OTP verification failed");
            }

            setResetToken(data.resetToken);
            setSuccess("OTP verified successfully!");
            setMode("reset");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        clearMessages();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        resetToken,
                        newPassword: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Password reset failed");
            }

            setSuccess("Password reset successfully! Please login.");
            setPassword("");
            setConfirmPassword("");
            setOtp("");
            setResetToken("");
            setMode("login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const heading = {
        login: "Let's get you shopping!",
        signup: "Join the CartWise family!",
        forgot: "Forgot your password?",
        verify: "Verify your email",
        reset: "Create new password",
    };

    const description = {
        login: "Sign in to continue your smarter shopping journey.",
        signup: "Create an account and discover smarter shopping.",
        forgot: "Enter your registered email address to receive an OTP.",
        verify: "Enter the 6-digit OTP sent to your email.",
        reset: "Choose a new password for your CartWise account.",
    };

    return (
        <div className="login-page">
            <div className="auth-card">

                <div className="auth-logo">
                    <span className="auth-logo-icon">C</span>
                    <span>CartWise</span>
                </div>

                <div className="auth-heading">
                    <h1>{heading[mode]}</h1>
                    <p>{description[mode]}</p>
                </div>

                <div className="auth-illustration">
                    <div className="auth-orbit orbit-one"></div>
                    <div className="auth-orbit orbit-two"></div>
                    <span className="floating-item item-one">✨</span>
                    <span className="floating-item item-two">🎁</span>
                    <span className="shopping-bag">🛍️</span>
                    <span className="floating-item item-three">⭐</span>
                    <span className="floating-item item-four">🧡</span>
                    <p>Smart choices. Better shopping.</p>
                </div>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                {(mode === "login" || mode === "signup") && (
                    <form onSubmit={handleLoginSignup}>

                        {mode === "login" && (
                            <div className="login-field">
                                <label>Login As</label>
                                <select
                                    value={accountType}
                                    onChange={(e) => {
                                        setAccountType(e.target.value);
                                        setBusinessId("");
                                        clearMessages();
                                    }}
                                    required
                                >
                                    <option value="user">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}

                        {mode === "login" && accountType === "admin" && (
                            <div className="login-field">
                                <label>Business ID</label>
                                <input
                                    type="password"
                                    placeholder="Enter your Business ID"
                                    value={businessId}
                                    onChange={(e) => setBusinessId(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {mode === "signup" && (
                            <div className="login-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    minLength={2}
                                    required
                                />
                            </div>
                        )}

                        <div className="login-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {mode === "login" && (
                            <div className="forgot-password">
                                <button
                                    type="button"
                                    onClick={() => switchMode("forgot")}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button className="login-submit" disabled={loading}>
                            {loading
                                ? "Please wait..."
                                : mode === "signup"
                                    ? "Create Account →"
                                    : accountType === "admin"
                                        ? "Admin Login →"
                                        : "Log in →"}
                        </button>
                    </form>
                )}

                {mode === "forgot" && (
                    <form onSubmit={handleSendOtp}>
                        <div className="login-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className="login-submit" disabled={loading}>
                            {loading ? "Sending OTP..." : "Send OTP →"}
                        </button>
                    </form>
                )}

                {mode === "verify" && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="login-field">
                            <label>6-Digit OTP</label>
                            <input
                                type="text"
                                placeholder="Enter your OTP"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                inputMode="numeric"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button className="login-submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP →"}
                        </button>
                    </form>
                )}

                {mode === "reset" && (
                    <form onSubmit={handleResetPassword}>
                        <div className="login-field">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        <button className="login-submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password →"}
                        </button>
                    </form>
                )}

                <div className="login-switch">
                    {mode === "login" && (
                        <>
                            Don't have an account?
                            <button type="button" onClick={() => switchMode("signup")}>
                                Create account
                            </button>
                        </>
                    )}

                    {mode === "signup" && (
                        <>
                            Already have an account?
                            <button type="button" onClick={() => switchMode("login")}>
                                Log in
                            </button>
                        </>
                    )}

                    {!["login", "signup"].includes(mode) && (
                        <button type="button" onClick={() => switchMode("login")}>
                            ← Back to Login
                        </button>
                    )}
                </div>

                <div className="auth-footer">
                    Secure shopping. Smarter choices. ❤️
                </div>
            </div>
        </div>
    );
}

export default Login;
