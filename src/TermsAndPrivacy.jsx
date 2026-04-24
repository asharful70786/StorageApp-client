import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "overview",         label: "Overview" },
  { id: "acceptance",       label: "Acceptance of Terms" },
  { id: "account",          label: "Your Account" },
  { id: "storage",          label: "Storage & Files" },
  { id: "acceptable-use",   label: "Acceptable Use" },
  { id: "termination",      label: "Termination" },
  { id: "disclaimer",       label: "Disclaimers" },
  { id: "privacy-overview", label: "Privacy Overview" },
  { id: "data-collected",   label: "Data We Collect" },
  { id: "data-use",         label: "How We Use Data" },
  { id: "data-security",    label: "Security" },
  { id: "data-retention",   label: "Data Retention" },
  { id: "your-rights",      label: "Your Rights" },
  { id: "contact",          label: "Contact Us" },
];

const EFFECTIVE = "March 12, 2026";

const CheckIcon = ({ green }) => (
  <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center ${green ? "bg-green-50" : "bg-indigo-50"}`}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke={green ? "#16a34a" : "#6366f1"}
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const XIcon = () => (
  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center bg-red-50">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </span>
);

const Tag = ({ green }) => (
  <span className={`inline-block text-[10.5px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md mb-3 ${green ? "bg-green-50 text-green-600" : "bg-indigo-50 text-indigo-500"}`}>
    {green ? "Privacy Policy" : "Terms & Conditions"}
  </span>
);

const SectionCard = ({ id, children }) => (
  <section id={id} className="bg-white border border-gray-200 rounded-2xl p-8 mb-4 scroll-mt-20">
    {children}
  </section>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
    {children}
  </h2>
);

const Callout = ({ green, children }) => (
  <div className={`border-l-4 rounded-r-xl px-4 py-3 text-[13.5px] text-gray-700 leading-relaxed my-3 ${green ? "bg-green-50 border-green-400" : "bg-indigo-50 border-indigo-400"}`}>
    {children}
  </div>
);

export default function TermsAndPrivacy() {
  const [activeId, setActiveId] = useState("overview");
  const [tab, setTab]           = useState("terms");
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef             = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const sidebarBtn = (id, label) => (
    <button key={id} onClick={() => scrollTo(id)}
      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12.5px] font-normal transition-colors cursor-pointer border-0 block mb-0.5
        ${activeId === id ? "bg-indigo-50 text-indigo-600 font-medium" : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between" style={{ height: 60 }}>
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">CloudStorage</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-gray-400">Effective: {EFFECTIVE}</span>
          <Link to="/" className="text-[13px] font-medium text-indigo-500 no-underline px-3 py-1.5 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
            ← Back to app
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-14 text-center relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 mb-5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Legal Documents
          </span>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-3 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
            Terms, Conditions<br />
            &amp; <em className="text-indigo-500">Privacy Policy</em>
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
            We believe in plain language, not legal jargon. Here's exactly what we do with your
            data and what you agree to when using CloudStorage.
          </p>
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
            <button onClick={() => { setTab("terms"); scrollTo("overview"); }}
              className={`px-5 py-2 rounded-[10px] text-[13.5px] font-medium transition-all cursor-pointer border-0 ${tab === "terms" ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"}`}>
              📄 Terms &amp; Conditions
            </button>
            <button onClick={() => { setTab("privacy"); scrollTo("privacy-overview"); }}
              className={`px-5 py-2 rounded-[10px] text-[13.5px] font-medium transition-all cursor-pointer border-0 ${tab === "privacy" ? "bg-white text-gray-900 shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"}`}>
              🔒 Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-8 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-20 bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2 mb-1.5">Terms &amp; Conditions</p>
          {sections.slice(0, 7).map(({ id, label }) => sidebarBtn(id, label))}
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2 mt-4 mb-1.5">Privacy Policy</p>
          {sections.slice(7).map(({ id, label }) => sidebarBtn(id, label))}
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">

          {/* Mobile TOC */}
          <div className="lg:hidden mb-4">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13.5px] font-medium text-gray-800 flex items-center justify-between cursor-pointer">
              <span>📋 Jump to section</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
              </svg>
            </button>
            {menuOpen && (
              <div className="mt-1.5 bg-white border border-gray-200 rounded-xl p-2 flex flex-col gap-0.5">
                {sections.map(({ id, label }) => (
                  <button key={id} onClick={() => scrollTo(id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] cursor-pointer border-0 transition-colors
                      ${activeId === id ? "bg-indigo-50 text-indigo-600 font-medium" : "bg-transparent text-gray-500 hover:bg-gray-50"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══ TERMS & CONDITIONS ══ */}

          <SectionCard id="overview">
            <Tag /><SectionTitle>Overview</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>Welcome to <strong className="text-gray-900">CloudStorage</strong> — a secure, serverless file storage platform for individuals and teams. These Terms govern your use of all CloudStorage services.</p>
              <Callout><strong className="text-gray-900">Plain-language summary:</strong> By signing up, you get a secure place to store your files. We don't sell your data, we don't read your files, and we keep everything encrypted. In return, we ask you not to misuse the platform.</Callout>
              <p>Last updated: <strong className="text-gray-900">{EFFECTIVE}</strong>. We'll notify you via email or in-app banner when terms change.</p>
            </div>
          </SectionCard>

          <SectionCard id="acceptance">
            <Tag /><SectionTitle>Acceptance of Terms</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>By accessing or using CloudStorage — via email registration or Google OAuth — you acknowledge that you've read and agree to these Terms.</p>
              <p>If using CloudStorage on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.</p>
              <p><strong className="text-gray-900">Age requirement:</strong> You must be at least 13 years old. Users under 18 should have parental or guardian consent.</p>
            </div>
          </SectionCard>

          <SectionCard id="account">
            <Tag /><SectionTitle>Your Account</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>You may register via email + password or Google OAuth. With Google OAuth, we receive only your <strong className="text-gray-900">email address</strong> — no Google Drive, contacts, or any other data.</p>
              <Callout><strong className="text-gray-900">OTP Verification:</strong> Email registration requires a one-time password to verify your email. OTPs expire quickly and cannot be reused.</Callout>
              <ul className="space-y-2.5">
                {["You are responsible for maintaining the confidentiality of your credentials.", "Notify us immediately at hello@ashraful.in of any unauthorised access.", "We reserve the right to suspend accounts that violate these terms.", "You may not share your account credentials with others."].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5"><CheckIcon /><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard id="storage">
            <Tag /><SectionTitle>Storage &amp; Files</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>Each free account includes <strong className="text-gray-900">15 GB</strong> of encrypted storage. You retain full ownership of all files you upload.</p>
              <ul className="space-y-2.5">
                {["You own your files. We claim no intellectual property rights over your content.", "Files are encrypted at rest (AES-256) and in transit (TLS 1.3).", "We do not scan, analyse, or access the contents of your files.", "Shared files are governed by the permissions you configure.", "We may impose reasonable storage quotas and file-size limits."].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5"><CheckIcon /><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard id="acceptable-use">
            <Tag /><SectionTitle>Acceptable Use</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>You agree <strong className="text-gray-900">not</strong> to use CloudStorage to:</p>
              <ul className="space-y-2.5">
                {["Store or distribute illegal content of any kind.", "Upload malware, viruses, or software designed to harm systems.", "Attempt to reverse-engineer, hack, or compromise our infrastructure.", "Infringe upon intellectual property rights of third parties.", "Harass, threaten, or harm other users.", "Use the service to send unsolicited communications (spam).", "Circumvent storage limits or quotas through artificial means."].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5"><XIcon /><span>{t}</span></li>
                ))}
              </ul>
              <p>Violations may result in immediate account suspension without prior notice.</p>
            </div>
          </SectionCard>

          <SectionCard id="termination">
            <Tag /><SectionTitle>Termination</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>You may delete your account any time from account settings. Upon deletion, all files and personal data will be permanently removed within <strong className="text-gray-900">30 days</strong>, unless retention is required by law.</p>
              <Callout><strong className="text-gray-900">Note:</strong> We'll make reasonable efforts to notify you before account termination except in cases of illegal activity or immediate security threats.</Callout>
            </div>
          </SectionCard>

          <SectionCard id="disclaimer">
            <Tag /><SectionTitle>Disclaimers &amp; Liability</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>CloudStorage is provided <strong className="text-gray-900">"as is"</strong> without warranties of any kind. While we strive for 99.9% uptime, we cannot guarantee uninterrupted or error-free service.</p>
              <p>To the maximum extent permitted by law, CloudStorage shall not be liable for indirect, incidental, or consequential damages arising from your use of the service.</p>
              <p>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of courts in India.</p>
            </div>
          </SectionCard>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">🔒 Privacy Policy</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ══ PRIVACY POLICY ══ */}

          <SectionCard id="privacy-overview">
            <Tag green /><SectionTitle>Privacy Overview</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>Your privacy is a core design principle of CloudStorage — not an afterthought. This Policy explains exactly what data we collect, why, and how we protect it.</p>
              <Callout green><strong className="text-gray-900">The short version:</strong> We collect only your email address, used solely for authentication. We do not sell, rent, share, or monetise your personal data in any way. Your files stay yours.</Callout>
              <p>This policy applies to all users regardless of sign-up method — email + password or Google OAuth.</p>
            </div>
          </SectionCard>

          <SectionCard id="data-collected">
            <Tag green /><SectionTitle>Data We Collect</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>We collect the absolute minimum required to provide the service:</p>
              <ul className="space-y-2.5">
                {[
                  { t: "Email address", d: "Used only for account identification and authentication. Never shared with third parties." },
                  { t: "Display name", d: "Optional. Used only within your account profile." },
                  { t: "Hashed password", d: "If registering via email. Hashed with bcrypt at 12 salt rounds — your plaintext password is never stored." },
                  { t: "File metadata", d: "File names, sizes, and upload timestamps. We do not read file contents." },
                  { t: "JWT tokens", d: "Short-lived signed tokens used to maintain your session securely." },
                ].map(({ t, d }, i) => (
                  <li key={i} className="flex items-start gap-2.5"><CheckIcon green /><span><strong className="text-gray-900">{t}:</strong> {d}</span></li>
                ))}
              </ul>
              <Callout green><strong className="text-gray-900">Google OAuth users:</strong> We receive only your email via OAuth 2.0. We do not access your Google profile, contacts, calendar, Drive, or any other Google service.</Callout>
            </div>
          </SectionCard>

          <SectionCard id="data-use">
            <Tag green /><SectionTitle>How We Use Your Data</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>We use your data exclusively to operate and improve CloudStorage:</p>
              <ul className="space-y-2.5">
                {["Authenticating your identity when you log in.", "Delivering, managing, and displaying your files and folders.", "Sending OTP emails for email verification during registration.", "Sending critical security notifications (e.g. new device login alerts).", "Diagnosing technical issues and improving platform performance."].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5"><CheckIcon green /><span>{t}</span></li>
                ))}
              </ul>
              <p>We do <strong className="text-gray-900">not</strong> use your data for advertising, sell it to data brokers, or share it with any third parties except as required by law.</p>
            </div>
          </SectionCard>

          <SectionCard id="data-security">
            <Tag green /><SectionTitle>Security</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>Security is not a feature — it's the foundation of CloudStorage.</p>
              <div className="flex flex-wrap gap-2.5 my-2">
                {[["🔐","AES-256 at rest"],["🔒","TLS 1.3 in transit"],["🧂","bcrypt · 12 rounds"],["🪙","JWT signed sessions"],["☁️","Serverless architecture"],["📧","OTP email verification"]].map(([icon, label], i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[13px] font-medium text-gray-700">
                    <span className="text-base">{icon}</span>{label}
                  </div>
                ))}
              </div>
              <p>Our serverless architecture means no persistent servers to compromise. Each function execution is isolated, ephemeral, and runs with minimum required permissions.</p>
              <p>Passwords are hashed with bcrypt at 12 salt rounds — brute-force attacks are computationally infeasible against this standard.</p>
            </div>
          </SectionCard>

          <SectionCard id="data-retention">
            <Tag green /><SectionTitle>Data Retention</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>We retain your data only as long as your account is active or needed to provide the service.</p>
              <ul className="space-y-2.5">
                {["Account data (email, name) is retained while your account exists.", "Files and folders are retained until you delete them or close your account.", "Upon account deletion, all personal data and files are purged within 30 days.", "OTPs expire automatically and are deleted immediately after use or expiry.", "Authentication logs may be retained for up to 90 days for security purposes."].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5"><CheckIcon green /><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard id="your-rights">
            <Tag green /><SectionTitle>Your Rights</SectionTitle>
            <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">
              <p>Under GDPR, CCPA, and the Indian IT Act, you may have the following rights:</p>
              <ul className="space-y-2.5">
                {[
                  { t: "Right of Access", d: "Request a copy of all personal data we hold about you." },
                  { t: "Right to Rectification", d: "Correct inaccurate or incomplete data." },
                  { t: "Right to Erasure", d: "Request deletion of your account and all associated data." },
                  { t: "Right to Portability", d: "Export your files and data in a standard format at any time." },
                  { t: "Right to Object", d: "Object to processing of your data in certain circumstances." },
                  { t: "Withdraw Consent", d: "Google OAuth users can revoke access via Google Account settings at any time." },
                ].map(({ t, d }, i) => (
                  <li key={i} className="flex items-start gap-2.5"><CheckIcon green /><span><strong className="text-gray-900">{t}:</strong> {d}</span></li>
                ))}
              </ul>
              <p>To exercise any right, contact us below. We'll respond within <strong className="text-gray-900">30 days</strong>.</p>
            </div>
          </SectionCard>

          <SectionCard id="contact">
            <Tag green /><SectionTitle>Contact Us</SectionTitle>
            <div className="rounded-2xl p-8 text-white" style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)" }}>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Have questions or concerns?</h3>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">We're a small, transparent team. If you have questions about these terms, your privacy, or how your data is handled — we'd love to hear from you.</p>
              <a href="mailto:hello@ashraful.in"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-5 py-2.5 rounded-xl no-underline hover:opacity-90 transition-opacity">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                hello@ashraful.in
              </a>
            </div>
          </SectionCard>

        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 text-center py-8 px-4">
        <p className="text-[13px] text-gray-400">© {new Date().getFullYear()} CloudStorage. All rights reserved.</p>
        <p className="text-[13px] text-gray-400 mt-1">
          Effective date: {EFFECTIVE} &nbsp;·&nbsp;
          <Link to="/" className="text-indigo-500 no-underline hover:underline">Back to app</Link>
        </p>
      </footer>
    </div>
  );
}