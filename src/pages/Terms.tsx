import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service | Advileads';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Effective date: September 02, 2025
      </p>

      <div className="prose prose-zinc mt-8 dark:prose-invert prose-headings:font-semibold prose-a:text-teal-600 hover:prose-a:text-teal-500 dark:prose-a:text-teal-400 dark:hover:prose-a:text-teal-300">
        <h2>1. Agreement to Terms</h2>
        <p>By using Advileads, you agree to these Terms. If you do not agree, do not use the Services.</p>

        <h2>2. Accounts</h2>
        <p>You are responsible for your account and must provide accurate information. Keep your login credentials secure and notify us immediately of any unauthorized access.</p>

        <h2>3. Acceptable Use</h2>
        <ul>
          <li>No misuse or interference with the Services.</li>
          <li>No unauthorized access to data or systems.</li>
          <li>Comply with all applicable laws and regulations.</li>
          <li>No spamming, phishing, or distributing malware.</li>
          <li>No reverse engineering or attempting to access source code.</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The Services and all content are owned by Advileads or its licensors. We grant you a limited,
          non-exclusive, non-transferable license to use the Services as permitted by these Terms.
        </p>

        <h2>5. Subscriptions &amp; Billing</h2>
        <p>
          Paid plans require valid payment information. Fees are non-refundable except as required by law
          or stated in our refund policy. We may change prices with notice; your continued use constitutes
          acceptance of new pricing.
        </p>

        <h2>6. Third‑Party Services</h2>
        <p>
          The Services may integrate with third-party services. These services have their own terms and
          privacy policies, and we are not responsible for their content or practices.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
          INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, ADVISELEADS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate your access to the Services at any time, with or without cause,
          and without notice. Upon termination, your right to use the Services will immediately cease.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the jurisdiction in which Advileads is established,
          without regard to its conflict of law provisions.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We'll provide notice of material changes.
          Your continued use of the Services constitutes acceptance of the updated Terms.
        </p>

        <h2>12. Contact</h2>
        <p>
          Questions about these Terms? Email us at{' '}
          <a href="mailto:support@advileads.com" className="focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded">
            support@advileads.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
