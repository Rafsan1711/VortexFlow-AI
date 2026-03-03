import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const aboutContent = `
# About VortexFlow AI

VortexFlow AI is a next-generation conversational platform engineered to redefine how humans interact with artificial intelligence. By leveraging state-of-the-art large language models and a meticulously crafted user interface, we provide a workspace that is as powerful as it is intuitive.

---

## Our Mission

To democratize access to advanced AI while maintaining the highest standards of privacy, performance, and user experience. We believe that AI should be a seamless extension of human creativity, not a replacement for it.

## Why VortexFlow?

### 🚀 Performance First
Built on a high-performance stack, VortexFlow ensures that your interactions are lightning-fast. No more waiting—just flow.

### 🛡️ Privacy by Design
Your data is yours. We implement industry-standard encryption and transparent data policies to ensure your conversations remain private.

### 🎨 Crafted Interface
Every pixel in VortexFlow is placed with intention. Our dark-mode optimized UI reduces eye strain and helps you focus on what matters: the conversation.

### 🔄 Seamless Sync
Whether you're on your desktop or mobile, your chats are always with you. Real-time synchronization keeps your workflow uninterrupted.

---

## The Technology

VortexFlow AI is powered by the **Gemini 3.0** series models, providing:
*   **Deep Reasoning:** For complex problem solving and coding.
*   **Creative Writing:** For content generation and brainstorming.
*   **Contextual Memory:** For long-form conversations that feel natural.

## Get in Touch

We are constantly evolving. If you have suggestions, feedback, or just want to chat about the future of AI, reach out to us.

**Contact:** Reach out to us through our official support channels.
**Twitter:** [@VortexFlowAI](https://twitter.com/vortexflowai)
`;

export default function AboutDoc() {
  return (
    <div className="space-y-12">
      <div className="doc-card">
        <div className="doc-badge mb-4">Version 1.0.0</div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutContent}</ReactMarkdown>
      </div>
    </div>
  );
}
