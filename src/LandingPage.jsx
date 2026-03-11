import { useState, useEffect, useRef } from "react";
import { FiCloud, FiShield, FiTrendingUp, FiLock, FiUpload, FiFolder, FiUsers, FiArrowRight, FiCheck, FiStar } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdOutlineSpeed, MdOutlineAutoAwesome } from "react-icons/md";

const highlights = [
  "Zero infrastructure headaches",
  "Pay for what you use",
  "Enterprise-grade security",
  "99.99% uptime SLA",
];

const features = [
  {
    icon: <FiUpload size={22} />,
    title: "Instant Uploads",
    description: "Files go up fast and stay accessible without delay or queuing overhead slowing your team down.",
    accent: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",
  },
  {
    icon: <FiShield size={22} />,
    title: "Granular Access Control",
    description: "Define exactly who can see, edit, or share every file. Nothing leaks. Nothing gets lost.",
    accent: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
  },
  {
    icon: <FiTrendingUp size={22} />,
    title: "Usage-Based Costs",
    description: "Infrastructure costs track real usage — not theoretical peaks. Your bills reflect what you actually need.",
    accent: "#059669", bg: "#ecfdf5", border: "#a7f3d0",
  },
  {
    icon: <MdOutlineSpeed size={22} />,
    title: "Elastic Performance",
    description: "Handles spikes without pre-provisioning. The system scales to meet demand then quietly steps back.",
    accent: "#d97706", bg: "#fffbeb", border: "#fde68a",
  },
];

const useCases = [
  { icon: <FiFolder size={20} />, title: "Team File Hubs", description: "Shared folders with role-based access for teams that need structure without friction.", accent: "#2563eb" },
  { icon: <FiUsers size={20} />, title: "Client Delivery", description: "Send large files to clients with expiring links and delivery confirmation — no extra tools.", accent: "#7c3aed" },
  { icon: <FiCloud size={20} />, title: "App-Integrated Storage", description: "API-first design lets you embed storage directly inside your product without extra overhead.", accent: "#059669" },
  { icon: <FiLock size={20} />, title: "Compliance-Ready Archiving", description: "Retention policies, audit logs, and encrypted vaults for regulated industries.", accent: "#d97706" },
];

const benefits = [
  "Faster daily workflows for end users",
  "Reduced operational cost over time",
  "Less time spent managing infrastructure",
  "Higher confidence in file security",
  "Simpler onboarding for new team members",
  "Stable performance as usage grows",
];

const technicalProof = [
  "Object storage with CDN edge caching",
  "AES-256 encryption at rest and in transit",
  "S3-compatible API surface",
  "Role-based access with audit trail",
  "Automatic deduplication to cut storage costs",
  "Webhook support for event-driven workflows",
];

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let s = 0;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1800, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FloatingDots() {
  const dots = useRef([...Array(18)].map((_, i) => ({
    w: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.14 + 0.04,
    dur: Math.random() * 8 + 7,
    delay: Math.random() * 6,
    color: ["#2563eb","#7c3aed","#059669"][i % 3],
  }))).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {dots.map((d,i) => (
        <div key={i} style={{
          position:"absolute", width:d.w, height:d.w, borderRadius:"50%",
          background:d.color, left:`${d.left}%`, top:`${d.top}%`,
          opacity:d.opacity,
          animation:`floatDot ${d.dur}s ease-in-out ${d.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function StorageApp() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const iv = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 3200);
    return () => clearInterval(iv);
  }, []);

  const af = features[activeFeature];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f8f9fc", color:"#111827", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes floatDot{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-22px) scale(1.15)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
        @keyframes pulseRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.9);opacity:0}}
        @keyframes gridScroll{from{transform:translateY(0)}to{transform:translateY(64px)}}
        .fu1{animation:fadeUp .75s ease .08s both}
        .fu2{animation:fadeUp .75s ease .22s both}
        .fu3{animation:fadeUp .75s ease .38s both}
        .fu4{animation:fadeUp .75s ease .52s both}
        .shimmer-text{
          background:linear-gradient(90deg,#2563eb 0%,#7c3aed 35%,#059669 65%,#2563eb 100%);
          background-size:300% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:shimmer 5s linear infinite}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:28px;transition:box-shadow .25s,transform .25s}
        .card:hover{box-shadow:0 12px 40px rgba(0,0,0,.08);transform:translateY(-4px)}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;background:#111827;color:#fff;font-weight:600;font-size:15px;padding:14px 32px;border-radius:50px;border:none;cursor:pointer;font-family:inherit;letter-spacing:-.01em;transition:background .2s,transform .2s,box-shadow .2s;text-decoration:none}
        .btn-primary:hover{background:#1f2937;transform:translateY(-2px);box-shadow:0 10px 30px rgba(17,24,39,.2)}
        .tag{display:inline-flex;align-items:center;gap:6px;background:#f0f4ff;border:1px solid #c7d7fe;color:#2563eb;padding:6px 14px;border-radius:50px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
        .stat-card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px 24px;text-align:center}
        .feature-tab{padding:16px 18px;border-radius:14px;cursor:pointer;transition:background .2s,border-color .2s;border:1px solid transparent}
        .feature-tab.active{background:#fff;border-color:#e5e7eb;box-shadow:0 4px 20px rgba(0,0,0,.06)}
        .feature-tab:hover:not(.active){background:rgba(0,0,0,.03)}
        .check-item{display:flex;align-items:center;gap:12px;padding:11px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6}
        .check-item:last-child{border-bottom:none}
        .mono{font-family:'Space Mono',monospace}
        .grid-bg{background-image:linear-gradient(rgba(37,99,235,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.04) 1px,transparent 1px);background-size:56px 56px;animation:gridScroll 18s linear infinite}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#f8f9fc}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px}
      `}</style>

    

      {/* HERO */}
      <section style={{ position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0 }} />
        <FloatingDots />
        <div style={{ position:"absolute",top:"15%",left:"5%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,.07) 0%,transparent 70%)",filter:"blur(50px)" }} />
        <div style={{ position:"absolute",bottom:"10%",right:"5%",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%)",filter:"blur(50px)" }} />

        <div style={{ position:"relative",zIndex:1,textAlign:"center",maxWidth:860,padding:"0 24px",paddingTop:110 }}>
          <div className="fu1" style={{ marginBottom:26 }}>
            <span className="tag"><HiOutlineSparkles size={12} /> Smart Cloud Storage</span>
          </div>
          <h1 className="fu2" style={{ fontSize:"clamp(40px,6.5vw,78px)",fontWeight:700,lineHeight:1.06,letterSpacing:"-.04em",marginBottom:26,color:"#0f172a" }}>
            File storage that stays{" "}
            <span className="shimmer-text">fast, secure,</span>
            <br />and cost-efficient.
          </h1>
          <p className="fu3" style={{ fontSize:18,color:"#6b7280",lineHeight:1.75,maxWidth:560,margin:"0 auto 40px",fontWeight:400 }}>
            StorageApp helps teams store, manage, and deliver files without the usual mess of slow access, unnecessary infrastructure cost, or operational complexity.
          </p>
          <div className="fu4" style={{ marginBottom:52 }}>
            <a href="/login" className="btn-primary" style={{ fontSize:16,padding:"16px 44px" }}>
              Continue to dashboard <FiArrowRight size={16} />
            </a>
          </div>
          <div className="fu4" style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
            {highlights.map((h,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:7,background:"#fff",border:"1px solid #e5e7eb",padding:"8px 16px",borderRadius:50,fontSize:13,color:"#374151",boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                <FiCheck size={12} color="#059669" strokeWidth={3} /> {h}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
          <div style={{ width:1,height:48,background:"linear-gradient(to bottom,transparent,#d1d5db)" }} />
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#9ca3af" }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:"70px 44px",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:18 }}>
          {[
            { label:"Uptime SLA",              value:99.99, suffix:"%" },
            { label:"Faster access vs legacy", value:3,     suffix:"x" },
            { label:"Cost reduction avg.",     value:40,    suffix:"%" },
            { label:"Teams using it",          value:2800,  suffix:"+" },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div className="mono" style={{ fontSize:44,fontWeight:700,color:"#111827",lineHeight:1 }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ marginTop:10,fontSize:13,color:"#9ca3af",letterSpacing:".03em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"70px 44px",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:56 }}>
          <span className="tag" style={{ marginBottom:18,display:"inline-flex" }}><MdOutlineAutoAwesome size={12} /> Platform Capabilities</span>
          <h2 style={{ fontSize:"clamp(28px,4vw,46px)",fontWeight:700,letterSpacing:"-.03em",marginTop:16,color:"#0f172a" }}>
            Built to reduce friction
            <span style={{ color:"#9ca3af" }}> for users<br />and waste for the business.</span>
          </h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:36,alignItems:"center" }}>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {features.map((f,i) => (
              <div key={i} className={`feature-tab${activeFeature===i?" active":""}`} onClick={() => setActiveFeature(i)}>
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{ width:44,height:44,borderRadius:13,background:activeFeature===i?f.bg:"#f9fafb",border:`1px solid ${activeFeature===i?f.border:"#e5e7eb"}`,display:"flex",alignItems:"center",justifyContent:"center",color:activeFeature===i?f.accent:"#9ca3af",transition:"all .3s",flexShrink:0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight:600,fontSize:15,color:activeFeature===i?"#111827":"#6b7280" }}>{f.title}</div>
                    {activeFeature===i && <div style={{ fontSize:13,color:"#9ca3af",marginTop:5,lineHeight:1.6 }}>{f.description}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:af.bg,border:`1px solid ${af.border}`,borderRadius:28,padding:48,minHeight:320,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",position:"relative",overflow:"hidden",transition:"background .4s,border-color .4s" }}>
            <div style={{ position:"absolute",width:200,height:200,borderRadius:"50%",border:`1px solid ${af.accent}18`,top:"50%",left:"50%",transform:"translate(-50%,-50%)" }} />
            <div style={{ position:"absolute",width:310,height:310,borderRadius:"50%",border:`1px solid ${af.accent}0d`,top:"50%",left:"50%",transform:"translate(-50%,-50%)" }} />
            <div style={{ width:84,height:84,borderRadius:"50%",background:"#fff",border:`1px solid ${af.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:af.accent,marginBottom:22,position:"relative",boxShadow:`0 8px 30px ${af.accent}20`,transition:"color .3s,box-shadow .3s" }}>
              {af.icon}
              <div style={{ position:"absolute",inset:-10,borderRadius:"50%",border:`1px solid ${af.accent}25`,animation:"pulseRing 2.2s ease-out infinite" }} />
            </div>
            <h3 style={{ fontSize:22,fontWeight:700,marginBottom:10,letterSpacing:"-.02em",color:"#0f172a" }}>{af.title}</h3>
            <p style={{ fontSize:14,color:"#6b7280",textAlign:"center",lineHeight:1.7,maxWidth:270 }}>{af.description}</p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section style={{ padding:"70px 44px",background:"#fff",borderTop:"1px solid #f3f4f6",borderBottom:"1px solid #f3f4f6" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <span className="tag" style={{ marginBottom:16,display:"inline-flex" }}><FiStar size={12} /> Real-World Use Cases</span>
            <h2 style={{ fontSize:"clamp(26px,4vw,42px)",fontWeight:700,letterSpacing:"-.03em",marginTop:16,color:"#0f172a" }}>How teams benefit from it</h2>
            <p style={{ fontSize:16,color:"#9ca3af",marginTop:14,maxWidth:460,margin:"14px auto 0",lineHeight:1.7 }}>
              Built around everyday file-handling pain points. This is storage that actually helps.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20 }}>
            {useCases.map((u,i) => (
              <div key={i} className="card">
                <div style={{ width:46,height:46,borderRadius:13,background:`${u.accent}10`,border:`1px solid ${u.accent}25`,display:"flex",alignItems:"center",justifyContent:"center",color:u.accent,marginBottom:18 }}>
                  {u.icon}
                </div>
                <h3 style={{ fontSize:16,fontWeight:600,marginBottom:9,letterSpacing:"-.01em",color:"#111827" }}>{u.title}</h3>
                <p style={{ fontSize:13,color:"#9ca3af",lineHeight:1.65 }}>{u.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS + TECHNICAL */}
      <section style={{ padding:"70px 44px",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:48 }}>
          <div>
            <span className="tag" style={{ marginBottom:18,display:"inline-flex" }}>What users feel</span>
            <h3 style={{ fontSize:28,fontWeight:700,letterSpacing:"-.02em",margin:"16px 0 24px",color:"#0f172a" }}>Clear product outcomes</h3>
            <div>
              {benefits.map((b,i) => (
                <div key={i} className="check-item">
                  <div style={{ width:22,height:22,borderRadius:"50%",background:"#ecfdf5",border:"1px solid #a7f3d0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <FiCheck size={11} color="#059669" strokeWidth={3} />
                  </div>
                  {b}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="tag" style={{ marginBottom:18,display:"inline-flex",background:"#f5f3ff",borderColor:"#ddd6fe",color:"#7c3aed" }}>Technical proof</span>
            <h3 style={{ fontSize:28,fontWeight:700,letterSpacing:"-.02em",margin:"16px 0 24px",color:"#0f172a" }}>Without the noise</h3>
            <div style={{ background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:16,overflow:"hidden" }}>
              {technicalProof.map((t,i) => (
                <div key={i} className="mono" style={{ padding:"13px 20px",fontSize:12,color:"#6b7280",borderBottom:i<technicalProof.length-1?"1px solid #f3f4f6":"none",display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ color:"#7c3aed",fontWeight:700 }}>→</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EFFICIENCY CARD */}
      <section style={{ padding:"0 44px 80px",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:32,padding:"56px 52px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,position:"relative",overflow:"hidden",boxShadow:"0 4px 30px rgba(0,0,0,.05)" }}>
          <div style={{ position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,.05) 0%,transparent 70%)" }} />
          <div>
            <span className="tag" style={{ marginBottom:16,display:"inline-flex" }}>Built with practicality</span>
            <h2 style={{ fontSize:"clamp(22px,3vw,36px)",fontWeight:700,letterSpacing:"-.03em",margin:"16px 0 16px",lineHeight:1.15,color:"#0f172a" }}>
              Improved efficiency without rebuilding everything.
            </h2>
            <p style={{ fontSize:15,color:"#9ca3af",lineHeight:1.75 }}>
              The platform was improved to operate more efficiently while keeping core application logic, workflows, and product behavior stable.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
            <div style={{ background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:16,padding:22 }}>
              <div style={{ color:"#059669",fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",marginBottom:14 }}>What improved</div>
              {["Lower infrastructure waste","Better handling of variable demand","More efficient operating model"].map((item,i) => (
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:10,fontSize:13,color:"#374151",lineHeight:1.45 }}>
                  <span style={{ color:"#059669",fontWeight:700,marginTop:1 }}>↑</span> {item}
                </div>
              ))}
            </div>
            <div style={{ background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:16,padding:22 }}>
              <div style={{ color:"#2563eb",fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",marginBottom:14 }}>What stayed</div>
              {["Core application logic","Authentication and sessions","Business workflows and data flow"].map((item,i) => (
                <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:10,fontSize:13,color:"#374151",lineHeight:1.45 }}>
                  <span style={{ color:"#2563eb",fontWeight:700,marginTop:1 }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"90px 44px 120px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 65%)" }} />
        <div style={{ position:"relative",zIndex:1 }}>
          <span className="tag" style={{ marginBottom:24,display:"inline-flex" }}>Ready to continue?</span>
          <h2 style={{ fontSize:"clamp(30px,5vw,60px)",fontWeight:700,letterSpacing:"-.04em",lineHeight:1.06,marginBottom:20,color:"#0f172a" }}>
            A storage platform built<br />to stay with you.
          </h2>
          <p style={{ fontSize:17,color:"#9ca3af",maxWidth:440,margin:"0 auto 44px",lineHeight:1.7 }}>
            Secure, efficient, and easy to live with. No bloated promises. Just practical infrastructure that works.
          </p>
          <a href="/login" className="btn-primary" style={{ fontSize:16,padding:"17px 50px" }}>
            Continue to dashboard <FiArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}