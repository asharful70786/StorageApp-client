// src/components/Layout/Footer.jsx
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-16 border-t border-gray-200 bg-white/80 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <span className="font-semibold text-gray-800">CloudStorage</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/"
              target="_blank"
              className="hover:text-blue-600 transition"
            >
              GitHub
            </a>

            <a
              href="https://linkedin.com/"
              target="_blank"
              className="hover:text-blue-600 transition"
            >
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-xs">
            © {new Date().getFullYear()} CloudStorage
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;