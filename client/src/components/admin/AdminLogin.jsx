// AdminLogin.jsx
import { Bluetooth } from "lucide-react";
import { useState } from "react";

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch("https://sogas-backend.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Login failed");
                return;
            }

            // Save Token
            localStorage.setItem("token", data.token);

            // Redirect to Dashboard
            window.location.href = "/admin/dashboard";

        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-navy">
            <div className="w-full max-w-md bg-deep-blue p-8 rounded-2xl shadow-lg border border-soft-blue">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Admin Login
                </h1>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>    
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-light0blue text-sm font-semibold mb-2">
                            Email
                        </label>

                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-soft-blue"
                            placeholder="Enter your email address."
                            required
                        />    
                    </div>

                    <div>
                        <label className="block text-light-blue text-sm font-semibold mb-2">
                            Password
                        </label>

                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-soft-blue"
                            placeholder="Enter your password."
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-soft-blue hover:bg-rust text-dark-navy font-bold py-3 rounded-lg transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}