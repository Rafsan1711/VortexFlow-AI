import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const termsContent = `
# Terms of Service

**Last Updated:** March 02, 2026

Welcome to VortexFlow AI. These Terms of Service ("Terms") govern your access to and use of our website and services. Please read these Terms carefully before using our services.

## 1. Acceptance of Terms

By accessing or using our services, you agree to be bound by these Terms and all terms incorporated by reference. If you do not agree to all of these terms, do not use our services.

## 2. Changes to Terms

We reserve the right to change or modify these Terms at any time and in our sole discretion. If we make changes to these Terms, we will provide notice of such changes, such as by sending an email notification, providing notice through our services, or updating the "Last Updated" date at the beginning of these Terms.

## 3. User Accounts

When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.

*   You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password, whether your password is with our service or a third-party service.
*   You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

## 4. Acceptable Use

You agree not to use the services to:

*   Violate any applicable law or regulation.
*   Infringe upon the rights of others.
*   Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.
*   Transmit any unsolicited or unauthorized advertising, promotional materials, junk mail, spam, chain letters, pyramid schemes, or any other form of solicitation.
*   Transmit any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment.

## 5. Intellectual Property

The service and its original content, features, and functionality are and will remain the exclusive property of VortexFlow AI and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of VortexFlow AI.

## 6. Termination

We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.

## 7. Limitation of Liability

In no event shall VortexFlow AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.

## 8. Governing Law

These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.

## 9. Contact Us

If you have any questions about these Terms, please contact us at:

**Email:** Please contact us through our official support channels.
`;

export default function TermsOfServiceDoc() {
  return (
    <div className="space-y-12">
      <div className="doc-card">
        <div className="doc-badge mb-4">Legal</div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{termsContent}</ReactMarkdown>
      </div>
    </div>
  );
}
