// AdminRegister.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminRegister() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const token = new URLSearchParams(search).get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing invite token.");
        }
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setOk("");

        if (!token) return setError("Invite token is required.");
        if (!password || password.length < 8)
            return setError("Password must be at least 8 characters.");
        if (password !== confirm)
            return setError("Passwords do not match.");

        try {
            const res = await fetch("https://sogas-backend.onrender.com/api/auth/accept-invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to complete registration.");
                return;
            }

            setOk("Account created! Redirecting to admin login...");
            setTimeout(() => navigate("/admin/login"), 1200);

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-navy">
            <div className="w-full max-w-md bg-deep-blue p-8 rounded-2xl shadow-lg border border-soft-blue">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">Accept Invite</h1>
                <p className="text-light-blue text-sm text-center mb-6">
                    Set your password to activate your admin account.
                </p>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {ok && (
                    <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm">
                        {ok}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-light-blue text-sm font-semibold mb-2">
                            New PAssword
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-soft-blue"
                            placeholder="Password must be at least 8 characters"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-light-blue text-sm font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input 
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-soft-blue"
                            placeholder="Re-enter your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={!token}
                        className="w-full bg-soft-blue hover:bg-light-blue disabled:opacity-50 text-dark-navy font-bold py-3 rounded-lg transition"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}