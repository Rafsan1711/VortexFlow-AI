import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const privacyPolicyContent = `
# Privacy Policy

**Last Updated:** March 02, 2026

Welcome to VortexFlow AI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.

## 1. Information We Collect

We may collect information about you in a variety of ways. The information we may collect via the Application includes:

*   **Personal Data:** Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application or when you choose to participate in various activities related to the Application.
*   **Derivative Data:** Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
*   **Financial Data:** Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Application.

## 2. Use of Your Information

Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:

*   Create and manage your account.
*   Process your transactions and send you related information, including purchase confirmations and invoices.
*   Send you technical notices, updates, security alerts, and support and administrative messages.
*   Respond to your comments, questions, and requests and provide customer service.
*   Communicate with you about products, services, offers, promotions, rewards, and events offered by us and others, and provide news and information we think will be of interest to you.
*   Monitor and analyze trends, usage, and activities in connection with our Application.

## 3. Disclosure of Your Information

We may share information we have collected about you in certain situations. Your information may be disclosed as follows:

*   **By Law or to Protect Rights:** If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
*   **Third-Party Service Providers:** We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.

## 4. Security of Your Information

We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.

## 5. Contact Us

If you have questions or comments about this Privacy Policy, please contact us at:

**Email:** Please contact us through our official support channels.
`;

export default function PrivacyPolicyDoc() {
  return (
    <div className="space-y-12">
      <div className="doc-card">
        <div className="doc-badge mb-4">Legal</div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyPolicyContent}</ReactMarkdown>
      </div>
    </div>
  );
}
