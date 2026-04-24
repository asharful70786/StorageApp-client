// src/components/Layout/Footer.jsx
import { motion } from "framer-motion";

import { FiCloud } from "react-icons/fi";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mt-16 border-t border-slate-200 bg-[#f8f9fc] md:pl-60"
    >
      <div className="px-6 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_8px_20px_rgba(59,130,246,0.25)]">
  <FiCloud className="text-white" />
</div>

            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-900 sm:text-xl">
               CloudStorage
              </p>
              <p className="truncate text-sm text-slate-500">
                Secure file CloudStorage platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
            <a href="/features" className="transition hover:text-slate-900">
              Features
            </a>

            <a href="/terms" className="transition hover:text-slate-900 text-red-500">
              Terms
            </a>

            <span className="text-slate-400">
              © {new Date().getFullYear()} CloudStorage. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;