import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, sendOtp, verifyOtp } from "./api/authApi";
import { registerUser } from "./api/userApi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setServerError("");
      setOtpError("");
      setOtpSent(false);
      setOtpVerified(false);
      setCountdown(0);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) return setOtpError("Please enter your email first.");
    try {
      setIsSending(true);
      await sendOtp(formData.email);
      setOtpSent(true);
      setCountdown(60);
      setOtpError("");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setOtpError("Please enter OTP.");
    try {
      setIsVerifying(true);
      await verifyOtp(formData.email, otp);
      setOtpVerified(true);
      setOtpError("");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return setOtpError("Please verify your email with OTP.");
    try {
      await registerUser({ ...formData, otp });
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background-color: #f7f7f5;
        }

        /* ── Left panel ── */
        .reg-panel {
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
        @media (min-width: 900px) { .reg-panel { display: flex; } }

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
          flex-shrink: 0;
        }
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
          max-width: 300px;
          margin: 0 0 32px;
        }

        /* Feature bullets */
        .panel-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .panel-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          color: #5a5a5a;
        }
        .feature-dot {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f3f2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-dot svg { color: #6366f1; }

        .panel-footer-note {
          font-size: 12px;
          color: #b0adab;
          line-height: 1.5;
        }

        /* Deco circles */
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

        /* ── Form area ── */
        .reg-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .reg-card {
          width: 100%;
          max-width: 420px;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
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
          font-size: 30px;
          color: #1a1a1a;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .form-desc {
          font-size: 14px;
          color: #8a8a8a;
          margin: 0 0 28px;
        }

        /* Error / success banners */
        .banner {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 18px;
          font-size: 13px;
        }
        .banner-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          color: #dc2626;
        }
        .banner-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
        }

        /* Field */
        .field {
          margin-bottom: 18px;
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
        .field-input.is-verified {
          border-color: #4ade80;
          box-shadow: 0 0 0 3px rgba(74,222,128,0.1);
        }
        .field-input.has-action { padding-right: 110px; }
        .field-input.has-right-icon { padding-right: 46px; }

        /* Inline field action button */
        .field-action-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, opacity 0.2s;
          white-space: nowrap;
        }
        .field-action-btn-primary {
          background: #1a1a1a;
          color: #fff;
        }
        .field-action-btn-primary:hover { background: #333; }
        .field-action-btn-primary:disabled {
          background: #d1d0cd;
          color: #8a8a8a;
          cursor: not-allowed;
        }
        .field-action-btn-success {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          cursor: default;
        }

        /* Show/hide icon */
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

        /* OTP section */
        .otp-section {
          background: #fafaf8;
          border: 1.5px solid #e8e6e1;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 18px;
        }
        .otp-section-label {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .otp-hint {
          font-size: 12.5px;
          color: #8a8a8a;
          margin: 8px 0 0;
        }

        /* Step indicator */
        .steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 24px;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          color: #b0adab;
          font-weight: 500;
        }
        .step.active { color: #1a1a1a; }
        .step.done { color: #16a34a; }
        .step-num {
          width: 22px; height: 22px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          background: #e8e6e1;
          color: #8a8a8a;
          flex-shrink: 0;
        }
        .step.active .step-num { background: #1a1a1a; color: #fff; }
        .step.done .step-num { background: #16a34a; color: #fff; }
        .step-line {
          flex: 1;
          height: 1.5px;
          background: #e8e6e1;
          margin: 0 8px;
        }
        .step-line.done { background: #16a34a; }

        /* Submit */
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
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          background: #2d2d2d;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .btn-submit:active:not(:disabled) { transform: scale(0.99); }
        .btn-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .btn-submit-success {
          background: #16a34a !important;
          opacity: 1 !important;
        }

        /* Footer */
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
          margin: 22px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #e8e6e1; }
        .divider-text {
          font-size: 12px;
          color: #b0adab;
          font-weight: 500;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .google-wrap { display: flex; justify-content: center; }
      `}</style>

      <div className="reg-root">

        {/* ── Left Panel ── */}
        <div className="reg-panel">
          <div className="deco-circle deco-circle-1" />
          <div className="deco-circle deco-circle-2" />
          <div className="deco-circle deco-circle-3" />

          <div className="panel-brand">
            <div className="panel-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              Your files,<br /><em>always</em><br />within reach.
            </h1>
            <p className="panel-sub">
              Join thousands of teams who trust CloudStorage
              for secure, fast, and organised file management.
            </p>
            <div className="panel-features">
              {[
                { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, text: "256-bit AES encryption on every file" },
                { icon: <><circle cx="17" cy="21" r="3"/><circle cx="7" cy="21" r="3"/><path d="M12 3v4"/><path d="M12 3C7 3 3 7 3 12h18c0-5-4-9-9-9z"/><path d="M7 21H3a9 9 0 0 1 0-18"/></>, text: "Role-based access for your whole team" },
                { icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>, text: "Access on any device, anytime" },
              ].map((f, i) => (
                <div className="panel-feature" key={i}>
                  <div className="feature-dot">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {f.icon}
                    </svg>
                  </div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          <p className="panel-footer-note">
            By creating an account you agree to our Terms of Service<br />and Privacy Policy.
          </p>
        </div>

        {/* ── Form Area ── */}
        <div className="reg-form-area">
          <div className="reg-card">

            {/* Mobile brand */}
            <div className="mobile-brand">
              <div className="panel-brand-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              </div>
              <div className="panel-brand-name" style={{fontFamily:"'DM Sans',sans-serif"}}>CloudStorage</div>
            </div>

            <p className="form-greeting">Get started free</p>
            <h2 className="form-title">Create your account</h2>
            <p className="form-desc">15 GB free. No credit card required.</p>

            {/* Step indicator */}
            <div className="steps">
              <div className={`step ${formData.name && formData.email ? "done" : "active"}`}>
                <div className="step-num">
                  {formData.name && formData.email
                    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : "1"}
                </div>
                Details
              </div>
              <div className={`step-line ${otpVerified ? "done" : ""}`} />
              <div className={`step ${otpVerified ? "done" : otpSent ? "active" : ""}`}>
                <div className="step-num">
                  {otpVerified
                    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : "2"}
                </div>
                Verify
              </div>
              <div className={`step-line ${isSuccess ? "done" : ""}`} />
              <div className={`step ${isSuccess ? "done" : otpVerified ? "active" : ""}`}>
                <div className="step-num">
                  {isSuccess
                    ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : "3"}
                </div>
                Done
              </div>
            </div>

            {/* Error banner */}
            {serverError && (
              <div className="banner banner-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {serverError}
              </div>
            )}

            {/* Success banner */}
            {isSuccess && (
              <div className="banner banner-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Account created! Redirecting you now…
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="field">
                <label className="field-label">Full name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              {/* Email + Send OTP */}
              <div className="field">
                <label className="field-label">Email address</label>
                <div className="field-wrap">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`field-input has-action${serverError ? " has-error" : ""}${otpVerified ? " is-verified" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSending || countdown > 0 || otpVerified}
                    className={`field-action-btn ${otpVerified ? "field-action-btn-success" : "field-action-btn-primary"}`}
                  >
                    {otpVerified
                      ? <>
                          <svg style={{display:"inline",marginRight:4,verticalAlign:"middle"}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Verified
                        </>
                      : isSending ? "Sending…"
                      : countdown > 0 ? `Resend in ${countdown}s`
                      : otpSent ? "Resend OTP"
                      : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP entry */}
              {otpSent && !otpVerified && (
                <div className="otp-section">
                  <p className="otp-section-label">
                    <svg style={{display:"inline",marginRight:5,verticalAlign:"middle"}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Verify your email
                  </p>
                  <div className="field-wrap">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`field-input has-action${otpError ? " has-error" : ""}`}
                      style={{letterSpacing:"0.25em", fontWeight:600}}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifying}
                      className="field-action-btn field-action-btn-primary"
                    >
                      {isVerifying ? "Checking…" : "Verify"}
                    </button>
                  </div>
                  {otpError && (
                    <p style={{fontSize:12.5, color:"#dc2626", marginTop:8, marginBottom:0}}>
                      {otpError}
                    </p>
                  )}
                  <p className="otp-hint">We sent a 4-digit code to {formData.email}</p>
                </div>
              )}

              {/* Show OTP error if not sent yet but triggered */}
              {!otpSent && otpError && (
                <div className="banner banner-error" style={{marginBottom:14}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {otpError}
                </div>
              )}

              {/* Password */}
              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="field-input has-right-icon"
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

              <button
                type="submit"
                disabled={!otpVerified || isSuccess}
                className={`btn-submit${isSuccess ? " btn-submit-success" : ""}`}
              >
                {isSuccess
                  ? <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Account Created
                    </>
                  : "Create Account"}
              </button>
            </form>

            <p className="form-footer">
              Already have an account?&nbsp;
              <Link to="/login">Sign in</Link>
            </p>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with</span>
              <div className="divider-line" />
            </div>

            <div className="google-wrap">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const data = await loginWithGoogle(credentialResponse.credential);
                  if (!data.error) navigate("/");
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

export default Register;