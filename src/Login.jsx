import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./api/authApi";
import { loginUser } from "./api/userApi";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      if (data.error) setServerError(data.error);
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err.response?.data?.error || "Something went wrong.");
    }
  };

  const hasError = Boolean(serverError);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background-color: #f7f7f5;
        }

        /* ── Left decorative panel ── */
        .login-panel {
          display: none;
          width: 42%;
          background: #ffffff;
          border-right: 1px solid #e8e6e1;
          padding: 48px;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) { .login-panel { display: flex; } }

        .panel-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .panel-brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .panel-brand-icon svg { color: #fff; }
        .panel-brand-name {
          font-size: 17px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.3px;
        }
        .panel-brand-tagline {
          font-size: 12px;
          color: #9b9b9b;
          font-weight: 400;
        }

        .panel-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 0;
        }
        .panel-headline {
          font-family: 'DM Serif Display', serif;
          font-size: 42px;
          line-height: 1.15;
          color: #1a1a1a;
          margin: 0 0 16px;
        }
        .panel-headline em {
          font-style: italic;
          color: #6366f1;
        }
        .panel-sub {
          font-size: 15px;
          color: #6b6b6b;
          line-height: 1.6;
          max-width: 320px;
          margin: 0;
        }

        .panel-stats {
          display: flex;
          gap: 32px;
        }
        .stat-item {}
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #1a1a1a;
        }
        .stat-label {
          font-size: 12px;
          color: #9b9b9b;
          margin-top: 2px;
        }

        /* decorative circles */
        .deco-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .deco-circle-1 {
          width: 280px; height: 280px;
          border: 1px solid #ebebeb;
          top: -80px; right: -100px;
        }
        .deco-circle-2 {
          width: 180px; height: 180px;
          border: 1px solid #f0f0f0;
          top: 40px; right: -40px;
        }
        .deco-circle-3 {
          width: 200px; height: 200px;
          background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%);
          bottom: 80px; right: 20px;
        }

        /* ── Right form area ── */
        .login-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        @media (min-width: 900px) { .mobile-brand { display: none; } }

        .form-greeting {
          font-size: 13px;
          font-weight: 500;
          color: #6366f1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #1a1a1a;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .form-desc {
          font-size: 14px;
          color: #8a8a8a;
          margin: 0 0 36px;
        }

        /* Error banner */
        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #dc2626;
        }

        /* Field */
        .field {
          margin-bottom: 20px;
        }
        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #4a4a4a;
          margin-bottom: 7px;
          letter-spacing: -0.1px;
        }
        .field-wrap {
          position: relative;
        }
        .field-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e4e2dd;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #c4c2bc; }
        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .field-input.has-error {
          border-color: #f87171;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.1);
        }
        .field-input.has-right-icon {
          padding-right: 46px;
        }
        .field-icon-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: #b0adab;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .field-icon-btn:hover { color: #6366f1; }

        /* Submit btn */
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: #1a1a1a;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: -0.2px;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          margin-top: 4px;
        }
        .btn-submit:hover {
          background: #2d2d2d;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .btn-submit:active { transform: scale(0.99); }

        /* Footer links */
        .form-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 13.5px;
          color: #8a8a8a;
        }
        .form-footer a {
          color: #6366f1;
          font-weight: 500;
          text-decoration: none;
        }
        .form-footer a:hover { text-decoration: underline; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #e8e6e1;
        }
        .divider-text {
          font-size: 12px;
          color: #b0adab;
          font-weight: 500;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* Google btn wrapper */
        .google-wrap {
          display: flex;
          justify-content: center;
        }
      `}</style>

      <div className="login-root">
        {/* ── Left Panel ── */}
        <div className="login-panel">
          <div className="deco-circle deco-circle-1" />
          <div className="deco-circle deco-circle-2" />
          <div className="deco-circle deco-circle-3" />

          <div className="panel-brand">
            <div className="panel-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <div>
              <div className="panel-brand-name">CloudStorage</div>
              <div className="panel-brand-tagline">Secure file storage platform</div>
            </div>
          </div>

          <div className="panel-hero">
            <h1 className="panel-headline">
              Store files<br />with <em>total</em><br />confidence.
            </h1>
            <p className="panel-sub">
              15 GB free. Role-based sharing, encrypted vaults,
              and an API-first design built for teams.
            </p>
          </div>

          <div className="panel-stats">
            <div className="stat-item">
              <div className="stat-num">15 GB</div>
              <div className="stat-label">Free storage</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">256-bit</div>
              <div className="stat-label">AES encryption</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* ── Form Area ── */}
        <div className="login-form-area">
          <div className="login-card">

            {/* Mobile brand */}
            <div className="mobile-brand">
              <div className="panel-brand-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              </div>
              <div className="panel-brand-name" style={{fontFamily:"'DM Sans',sans-serif"}}>CloudStorage</div>
            </div>

            <p className="form-greeting">Welcome back</p>
            <h2 className="form-title">Sign in to your account</h2>
            <p className="form-desc">Enter your credentials to continue.</p>

            {hasError && (
              <div className="error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email" className="field-label">Email address</label>
                <div className="field-wrap">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`field-input${hasError ? " has-error" : ""}`}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password" className="field-label">Password</label>
                <div className="field-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`field-input has-right-icon${hasError ? " has-error" : ""}`}
                  />
                  <button
                    type="button"
                    className="field-icon-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit">
                Sign in
              </button>
            </form>

            <p className="form-footer">
              Don't have an account?&nbsp;
              <Link to="/register">Create one</Link>
            </p>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with</span>
              <div className="divider-line" />
            </div>

            <div className="google-wrap">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const data = await loginWithGoogle(credentialResponse.credential);
                    if (!data.error) navigate("/");
                  } catch (err) {
                    console.error("Google login failed:", err);
                  }
                }}
                onError={() => console.log("Login Failed")}
                theme="outline"
                text="continue_with"
                useOneTap
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;