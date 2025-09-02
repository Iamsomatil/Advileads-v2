import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Advileads';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Effective date: September 02, 2025
      </p>

      <div className="prose prose-zinc mt-8 dark:prose-invert prose-headings:font-semibold prose-a:text-teal-600 hover:prose-a:text-teal-500 dark:prose-a:text-teal-400 dark:hover:prose-a:text-teal-300">
        <p>
          This Privacy Policy explains how Advileads ("we", "us", "our") collects, uses,
          and shares information about you when you use our websites, products, and
          services (collectively, the "Services").
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Account &amp; Contact Data:</strong> name, email, company, role.</li>
          <li><strong>Usage Data:</strong> interactions with the app, device &amp; browser info, approximate location.</li>
          <li><strong>Cookies &amp; Similar:</strong> for authentication, preferences, and analytics.</li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>Provide, maintain, and improve the Services.</li>
          <li>Process transactions and send related information.</li>
          <li>Personalize content and features.</li>
          <li>Monitor and analyze usage and trends.</li>
          <li>Detect, prevent, and address security issues.</li>
        </ul>

        <h2>How We Share Information</h2>
        <p>
          We may share information with vendors and service providers who work on our
          behalf; with professional advisors; in connection with business transfers; and
          to comply with laws or protect rights. We do not sell personal information.
        </p>

        <h2>Data Retention</h2>
        <p>We retain personal data only as long as necessary for the Services and legal purposes.</p>

        <h2>Your Choices</h2>
        <ul>
          <li>Access, update, or delete your account information.</li>
          <li>Opt out of marketing emails via the unsubscribe link.</li>
          <li>Control cookies in your browser settings.</li>
        </ul>

        <h2>Security</h2>
        <p>
          We use appropriate technical and organizational measures, but no system is 100% secure.
        </p>

        <h2>Children</h2>
        <p>Our Services are not directed to children under 13, and we don't knowingly collect data from them.</p>

        <h2>International Transfers</h2>
        <p>Your information may be processed in countries with different data protection laws than yours.</p>

        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:support@advileads.com" className="focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded">support@advileads.com</a>.</p>

        <h2>Changes</h2>
        <p>We may update this policy periodically and will revise the effective date above.</p>
      </div>
    </div>
  );
}
