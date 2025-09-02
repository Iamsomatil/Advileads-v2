import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Advileads
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modern lead generation platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/pricing" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/features" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/blog" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/about" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">About</Link></li>
              <li><Link to="/careers" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/partners" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/terms" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().getFullYear()} Advileads. All rights reserved.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 md:mt-0">
            Built with ❤️ using React & Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
