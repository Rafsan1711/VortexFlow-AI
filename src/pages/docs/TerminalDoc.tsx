import { motion } from 'framer-motion';

export default function TerminalDoc() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="prose prose-invert max-w-none"
    >
      <h1 className="text-4xl font-bold mb-6 text-[#F0F0FF]">VortexFlow Terminal</h1>
      
      <p className="text-[#9898B8] text-lg mb-8 leading-relaxed">
        The VortexFlow Terminal is a built-in command environment for power users.
        Launch it from any chat by typing <code className="bg-[#1A1A24] px-2 py-1 rounded text-[#00D4FF]">/terminal+++</code> in the message input.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4 text-[#F0F0FF] border-b border-white/10 pb-2">Getting Started</h2>
      <p className="text-[#9898B8] mb-6">
        Type <code className="bg-[#1A1A24] px-2 py-1 rounded text-[#00D4FF]">/terminal+++</code> in the chat input to open the terminal.
        No additional setup required.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4 text-[#F0F0FF] border-b border-white/10 pb-2">Built-in Commands</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#5C5C7A] text-sm uppercase tracking-wider">
              <th className="py-4 px-4 font-medium">Command</th>
              <th className="py-4 px-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-[#9898B8]">
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">help</code></td>
              <td className="py-3 px-4">List all available commands</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">clear</code></td>
              <td className="py-3 px-4">Clear the terminal screen</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">exit</code></td>
              <td className="py-3 px-4">Close the terminal</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">plugins</code></td>
              <td className="py-3 px-4">Open the Plugin Store</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">version</code></td>
              <td className="py-3 px-4">Show VortexFlow version</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">whoami</code></td>
              <td className="py-3 px-4">Display your account info</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">date</code></td>
              <td className="py-3 px-4">Show current date and time</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">echo &lt;text&gt;</code></td>
              <td className="py-3 px-4">Print text to terminal</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00D4FF]">history</code></td>
              <td className="py-3 px-4">Show command history</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4 text-[#F0F0FF] border-b border-white/10 pb-2">Plugin Commands</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#5C5C7A] text-sm uppercase tracking-wider">
              <th className="py-4 px-4 font-medium">Command</th>
              <th className="py-4 px-4 font-medium">Plugin</th>
            </tr>
          </thead>
          <tbody className="text-[#9898B8]">
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$g--geoai</code></td>
              <td className="py-3 px-4">GeoAI Country Guesser</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$g--awg</code></td>
              <td className="py-3 px-4">AI Word Guess</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$g--dtb</code></td>
              <td className="py-3 px-4">Dots &amp; Boxes</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$g--bco</code></td>
              <td className="py-3 px-4">Battle Craft Odyssey</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$t--pt3</code></td>
              <td className="py-3 px-4">3D Periodic Table</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$g--sps</code></td>
              <td className="py-3 px-4">Sliding Puzzle Solver</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 px-4"><code className="text-[#00E5A0]">$--cat</code></td>
              <td className="py-3 px-4">Chess Analysis Tool</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4 text-[#F0F0FF] border-b border-white/10 pb-2">Tips & Tricks</h2>
      <ul className="list-disc pl-6 text-[#9898B8] space-y-2 mb-8">
        <li>Use <strong className="text-[#F0F0FF]">↑ / ↓ arrow keys</strong> to navigate command history</li>
        <li>Use <strong className="text-[#F0F0FF]">Tab</strong> to autocomplete commands</li>
        <li>Type <code className="bg-[#1A1A24] px-2 py-1 rounded text-[#00D4FF]">back</code> inside a plugin to return to the terminal</li>
        <li>Press <strong className="text-[#F0F0FF]">ESC</strong> to quickly exit a plugin view</li>
      </ul>
    </motion.div>
  );
}
