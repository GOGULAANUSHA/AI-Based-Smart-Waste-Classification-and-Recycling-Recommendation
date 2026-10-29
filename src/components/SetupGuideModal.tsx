import React, { useState } from 'react';
import { Terminal, Copy, Check, X, FileCode, Server, ShieldCheck, Cpu } from 'lucide-react';

interface SetupGuideModalProps {
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const quickStartCommands = `# 1. Clone repository & enter directory
git clone <repo-url>
cd ecocycle-ai

# 2. Install dependencies (Node 20+ recommended)
npm install

# 3. Configure environment variables (.env)
cp .env.example .env
# Set GEMINI_API_KEY=your_gemini_api_key

# 4. Start full-stack development server (Express + Vite)
npm run dev

# 5. Open in browser at http://localhost:3000`;

  const pythonAlternativeGuide = `# Alternative Python FastAPI/PyTorch ML microservice setup:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install fastapi uvicorn torch torchvision pillow python-dotenv
uvicorn app:app --port 8000 --reload`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">VS Code Setup & Project Execution Guide</h2>
              <p className="text-xs text-slate-400">Section 11 Architecture & Deployment Documentation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs mb-1">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Runtime Engine</span>
              </div>
              <p className="text-xs text-slate-600">Full-Stack TypeScript: Node 20+, Express & Vite HMR proxy</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center space-x-2 text-blue-800 font-semibold text-xs mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>AI Computer Vision</span>
              </div>
              <p className="text-xs text-slate-600">Gemini 3.8 Flash Multimodal Vision + Resilient Heuristic Engine</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex items-center space-x-2 text-purple-800 font-semibold text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Auth & Persistence</span>
              </div>
              <p className="text-xs text-slate-600">PBKDF2 Password Hashing, Bearer Token Auth, File/SQLite DB</p>
            </div>
          </div>

          {/* Quick Start Commands */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Execution Commands (Node.js & Express)</span>
              </h3>
              <button
                onClick={() => copyToClipboard(quickStartCommands, 'quickstart')}
                className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
              >
                {copiedSection === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'quickstart' ? 'Copied!' : 'Copy commands'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed">
              {quickStartCommands}
            </pre>
          </div>

          {/* Project Folder Structure */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Project Folder Structure</h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
              <div>ecocycle-ai/</div>
              <div className="pl-4">├── server.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Express API server & Vite middleware mount</div>
              <div className="pl-4">├── server/</div>
              <div className="pl-8">├── db.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# PBKDF2 auth, persistence, user analytics</div>
              <div className="pl-8">└── classifier.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Gemini 3.8 Flash multimodal vision engine</div>
              <div className="pl-4">├── src/</div>
              <div className="pl-8">├── components/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Navbar, CameraCapture, SetupGuideModal</div>
              <div className="pl-8">├── context/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# AuthContext (session, login, register)</div>
              <div className="pl-8">├── pages/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Analyzer, Results, Upcycling, Guide, Dashboard</div>
              <div className="pl-8">├── services/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# REST API client for backend</div>
              <div className="pl-8">└── types/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# TypeScript interface definitions</div>
              <div className="pl-4">├── data/database.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Persistent database records & users</div>
              <div className="pl-4">├── package.json &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Scripts, dependencies, and configuration</div>
              <div className="pl-4">└── .env.example &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Environment variable templates</div>
            </div>
          </div>

          {/* Python PyTorch Alternative */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Optional: Python / PyTorch Model Integration
              </h3>
              <button
                onClick={() => copyToClipboard(pythonAlternativeGuide, 'python')}
                className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
              >
                {copiedSection === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'python' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              If deploying a self-hosted PyTorch MobileNetV3 waste classifier alongside the Node service, mount this endpoint:
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto leading-relaxed">
              {pythonAlternativeGuide}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
