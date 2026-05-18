import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaSignOutAlt, FaLaptop, FaCheckCircle, FaTimesCircle, FaPause, FaPlay, FaTimes } from "react-icons/fa";
import { fetchSubscriptions, pauseSubscription, resumeSubscription, cancelSubscription } from "./api/subscriptionApi";
import { logoutAllSessions } from "./api/userApi";
import { useAuth } from "./context/AuthContext";

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  useEffect(() => {
    if (message) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadSubscription = async () => {
    try {
      const data = await fetchSubscriptions();
      if (Array.isArray(data) && data.length > 0) {
        setSubscription(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
  };

  const handleLogout = async () => {
    if (!window.confirm("Logout from this device?")) return;
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      showMessage("Logout failed");
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Logout from ALL devices? This will end sessions everywhere.")) return;
    try {
      await logoutAllSessions();
      await logout();
      navigate("/login");
    } catch (err) {
      showMessage("Logout all failed");
    }
  };

  const handleSubscriptionAction = async (action, actionFn, successMsg) => {
    if (!subscription) return;
    if (action === "cancel" && !window.confirm("Cancel your subscription?")) return;

    try {
      setLoading(true);
      await actionFn(subscription.razorpaySubscriptionId);
      showMessage(successMsg);
      await loadSubscription();
    } catch (err) {
      showMessage(`Action failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    active: { label: "Active", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    paused: { label: "Paused", class: "bg-amber-50 text-amber-700 border-amber-200" },
    cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-200" },
  };

  const getStatusConfig = (status) => statusConfig[status?.toLowerCase()] || statusConfig.active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24 md:pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FaArrowLeft className="text-sm" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Settings</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Manage your account</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-6">
        {/* Subscription Section */}
        {subscription ? (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4">
              <h2 className="text-white font-bold text-base">Subscription</h2>
              <p className="text-blue-100 text-xs mt-0.5">Manage your plan and billing</p>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <FaPlay className="text-sm" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{subscription.planName || "Pro Plan"}</p>
                    <p className="text-xs text-slate-500">Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold border ${getStatusConfig(subscription.status).class}`}>
                  {getStatusConfig(subscription.status).label}
                </span>
              </div>

              {/* Subscription Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {subscription.status === "active" && (
                  <button
                    onClick={() => handleSubscriptionAction("pause", pauseSubscription, "Subscription paused")}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    <FaPause className="text-xs" /> Pause
                  </button>
                )}
                {subscription.status === "paused" && (
                  <button
                    onClick={() => handleSubscriptionAction("resume", resumeSubscription, "Subscription resumed")}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    <FaPlay className="text-xs" /> Resume
                  </button>
                )}
                <button
                  onClick={() => handleSubscriptionAction("cancel", cancelSubscription, "Subscription cancelled")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <FaTimes className="text-xs" /> Cancel
                </button>
              </div>

              {/* Billing Details */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-medium uppercase tracking-wider mb-1">Subscription ID</p>
                  <p className="font-mono text-slate-700 font-semibold">{subscription.razorpaySubscriptionId?.slice(-8) || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium uppercase tracking-wider mb-1">Next Billing</p>
                  <p className="text-slate-700 font-semibold">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 text-center">
            <p className="text-sm text-slate-500 font-medium">No active subscription</p>
            <Link
              to="/plans"
              className="inline-flex items-center gap-2 mt-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
            >
              View Plans
            </Link>
          </section>
        )}

        {/* Account Section */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-900 px-5 py-4">
            <h2 className="text-white font-bold text-base">Account</h2>
            <p className="text-slate-400 text-xs mt-0.5">Sign out options</p>
          </div>

          <div className="p-5 space-y-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-all hover:bg-slate-50 hover:border-slate-300 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <FaSignOutAlt className="text-slate-500 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Logout</p>
                <p className="text-xs text-slate-500">Sign out from this device</p>
              </div>
            </button>

            <button
              onClick={handleLogoutAll}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-all hover:bg-slate-50 hover:border-slate-300 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <FaLaptop className="text-slate-500 text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Logout All Devices</p>
                <p className="text-xs text-slate-500">End all sessions everywhere</p>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-xl border border-slate-700">
              <FaCheckCircle className="text-emerald-400 text-sm" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;