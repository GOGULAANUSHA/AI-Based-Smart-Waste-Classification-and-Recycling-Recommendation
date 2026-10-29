import React from 'react';
import { Recycle, ShieldCheck, Terminal, Heart, Leaf, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenSetupModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSetupModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                EcoCycle<span className="text-emerald-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering communities with computer vision classification, municipal recycling verification, and circular upcycling transformation algorithms.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <Leaf className="w-4 h-4" />
              <span>Zero-Waste Circular Economy Initiative</span>
            </div>
          </div>

          {/* Col 2: Core Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application Suite
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('analyzer')} className="hover:text-emerald-400 transition-colors">
                  AI Waste Analyzer (Multimodal)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guide')} className="hover:text-emerald-400 transition-colors">
                  Recycling Encyclopedia & Codes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Personal Carbon & Diversion Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-emerald-400 transition-colors">
                  Municipal Scan Records
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Verification */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Verified Guidelines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1">
                <span>US EPA WARM & Recycling Model</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>Association of Plastic Recyclers (APR)</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>Aluminum Association Closed-Loop</span>
              </li>
              <li className="flex items-center space-x-1">
                <span>WRAP UK Resource Action Framework</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Info & Developer Setup */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Developer & Execution
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-stack implementation featuring Vite React, Express backend, secure authentication, and Gemini 3.8 Flash multimodal vision.
            </p>
            {onOpenSetupModal && (
              <button
                onClick={onOpenSetupModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-medium hover:bg-emerald-900 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>VS Code Setup & Run Guide</span>
              </button>
            )}
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EcoCycle AI. Clean technology for a sustainable planet.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Certified Municipal MRF Alignment</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
