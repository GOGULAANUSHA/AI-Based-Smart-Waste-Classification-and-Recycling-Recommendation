import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Upload, 
  Recycle, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Leaf, 
  Droplet, 
  Factory, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnalysisRecord } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectRecord: (record: AnalysisRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectRecord }) => {
  const { user, stats } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Sign in to Access Your Dashboard</h2>
        <p className="text-xs text-slate-500">
          Track your personal diversion metrics, saved scans, and circular upcycling impact.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const totalScans = stats?.totalAnalysed || 0;
  const recyclableCount = stats?.recyclableCount || 0;
  const specialDisposalCount = stats?.specialDisposalCount || 0;
  const co2Saved = stats?.co2SavedKg || 0;
  const waterSaved = stats?.waterSavedLitres || 0;
  const landfillDiverted = stats?.landfillDivertedKg || 0;
  const recentAnalyses = stats?.recentAnalyses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Eco Warrior Profile
              </span>
              {user.location && (
                <span className="text-xs text-slate-300">
                  📍 {user.location}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
              You are actively diverting valuable materials from local incinerators and municipal landfills. Here is your circular economy impact summary.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('analyzer')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/30 transition-all hover:scale-102"
            >
              <Scan className="w-4 h-4" />
              <span>Start New Analysis</span>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Scanned</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalScans}</div>
          <p className="text-[11px] text-slate-500">Materials catalogued</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Curbside Recyclable</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{recyclableCount}</div>
          <p className="text-[11px] text-slate-500">Standard blue bin accepted</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Special Drop-Off</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{specialDisposalCount}</div>
          <p className="text-[11px] text-slate-500">E-waste / hazardous diverted</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Estimated CO2e Saved</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-600">{co2Saved} kg</div>
          <p className="text-[11px] text-slate-500">EPA WARM life-cycle metric</p>
        </div>

      </div>

      {/* Environmental Equivalencies Bar */}
      <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-900">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold block text-sm">Water & Landfill Diversion Equivalent</span>
            <span className="text-emerald-800 text-[11px]">
              Your recycling activity has conserved approximately <strong>{waterSaved} Litres of water</strong> and diverted <strong>{landfillDiverted} kg</strong> of solid waste from landfills.
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('guide')}
          className="shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors"
        >
          Explore Tips & Guides
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Scans */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Recycle className="w-4 h-4 text-emerald-600" />
              <span>Recent Waste Analyses</span>
            </h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View All ({totalScans})
            </button>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-500">No items scanned yet.</p>
              <button
                onClick={() => onNavigate('analyzer')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                Scan Your First Item
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((rec) => {
                const isRec = rec.recyclability === 'recyclable';
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      onSelectRecord(rec);
                      onNavigate('results', { analysis: rec });
                    }}
                    className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0">
                        <img 
                          src={rec.imageUrl} 
                          alt={rec.primaryObject} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {rec.primaryObject}
                          </span>
                          {rec.resinCode && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 rounded-sm text-slate-600 font-bold">
                              {rec.resinCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {rec.material} • {new Date(rec.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isRec 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isRec ? 'Recyclable' : 'Special / Residual'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcycling Recommendations & Daily Tip */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Recycling Tip of the Day */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Smart Sorting Tip of the Day</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Keep Caps on Compressed Bottles
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When loose plastic caps fall onto sorting MRF conveyor belts, they slip through 2-inch screen holes and end up in the landfill stream. Modern optical sorters capture caps when screwed firmly onto crushed bottles!
            </p>
          </div>

          {/* Quick Account Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Account & Location Settings</span>
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Municipal Region:</strong> {user.location || 'Global Guidelines'}</p>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="w-full mt-2 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Update Preferences
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
