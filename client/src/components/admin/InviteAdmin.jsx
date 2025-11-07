// InviteAdmin.jsx
import { useState } from "react";
import api from "../../lib/api";

export default function InviteAdmin() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
      
        try {
          const token = localStorage.getItem("token");
          await api.post(
            "auth/invite",
            { email },
            { headers: { Authorization: `Bearer ${token}` } }
          );
      
          setMessage("Invite sent successfully.");
          setEmail("");
        } catch (err) {
          console.error(err);
          const msg =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Error sending invite.";
          setError(msg);
        } finally {
          setLoading(false);
        }
      }

    return (
        <div className="bg-light-blue rounded-xl p-12 mb-8">

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-white text-dark-navy focus:outline-none focus:ring-2 focus:ring-soft-blue"
                    placeholder="Enter the email of the user you wish to invite"
                    required
                />

                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-rust text-dark-navy font-semibold px-6 py-3 rounded-lg transition"
                >
                    {loading ? "Sending..." : "Send Invite" }
                </button>
            </form>

            {message && (
                <p className="text-green-400 mt-3 font-semibold">{message}</p>
            )}

            {error && (
                <p className="text-red-400 mt-3 font-semibold">{error}</p>
            )}
        </div>
    );
}