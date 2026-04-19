"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.token) throw new Error("No token returned");
      localStorage.setItem("authToken", json.token);
      localStorage.setItem("authUser", username);
      router.push("/cases");
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container section space-y-6">
      <div className="maxw-hero titlebar-blue">
        <h1 className="text-xl font-raleway font-bold">Login</h1>
      </div>

      <section className="maxw-hero auth-card maxw-auth">
        <div className="field">
          <label className="label">Username</label>
          <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field mt-2">
          <label className="label">Password</label>
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="alert error mt-3">Error: {error}</div>}
        <div className="form-actions mt-3">
          <button className="btn btn-primary hover-bloom" onClick={login} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          <a href="/" className="nav-link">← Back</a>
        </div>
      </section>
    </main>
  );
}
