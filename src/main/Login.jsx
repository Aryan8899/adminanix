import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@anix.in" && password === "Admin@123") {
        onLogin();
      } else {
        setError("Invalid credentials. Use admin@anix.in / Admin@123");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffd6e0 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden"
    }}>
      {/* BG blobs */}
      <div style={{ position: "absolute", top: -120, right: -120, width: 450, height: 450, borderRadius: "50%", background: "rgba(209,73,91,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -100, width: 350, height: 350, borderRadius: "50%", background: "rgba(209,73,91,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: "rgba(209,73,91,0.04)", pointerEvents: "none" }} />

      <div style={{
        background: "#fff", borderRadius: 22,
        padding: "52px 48px", width: 420,
        boxShadow: "0 12px 60px rgba(209,73,91,0.14), 0 2px 16px rgba(0,0,0,0.06)",
        position: "relative"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-block", background: "#d1495b", color: "#fff",
            fontWeight: "bold", fontSize: 28, letterSpacing: 4,
            padding: "10px 24px", borderRadius: 10, marginBottom: 14
          }}>ANIX</div>
          <div style={{ color: "#999", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Admin Portal</div>
          <div style={{ width: 40, height: 2, background: "#f5c0c8", margin: "14px auto 0" }} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="admin@anix.in"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{
            background: "#fff0f2", border: "1px solid #f5c0c8", borderRadius: 10,
            padding: "11px 16px", marginBottom: 20, color: "#c0392b", fontSize: 13
          }}>{error}</div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "15px", background: loading ? "#e8949e" : "#d1495b",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 15,
            fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: 0.5, fontFamily: "inherit", transition: "background 0.2s"
          }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <p style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: "#ccc", letterSpacing: 0.3 }}>
          admin@anix.in &nbsp;·&nbsp; Admin@123
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700, color: "#666",
  marginBottom: 8, letterSpacing: 1, textTransform: "uppercase"
};

const inputStyle = {
  width: "100%", padding: "13px 16px", border: "1.5px solid #f0d0d5",
  borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box",
  fontFamily: "Georgia, serif", background: "#fff9fa", color: "#1a1a1a"
};