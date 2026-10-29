import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  Info, 
  Edit3, 
  Tag, 
  Share2,
  Factory
} from 'lucide-react';
import { AnalysisRecord } from '../types';

interface ResultsPageProps {
  analysis: AnalysisRecord;
  onNavigate: (page: string, params?: any) => void;
  onUpdateAnalysis?: (updated: AnalysisRecord) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ 
  analysis, 
  onNavigate,
  onUpdateAnalysis 
}) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord>(analysis);
  const [isEditingMaterial, setIsEditingMaterial] = useState<boolean>(false);
  const [editedMaterial, setEditedMaterial] = useState<string>(analysis.material);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Trigger eco confetti when item is recyclable
  useEffect(() => {
    if (analysis.recyclability === 'recyclable') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#14b8a6', '#06b6d4', '#84cc16']
        });
      } catch {
        // Fallback without error
      }
    }
  }, [analysis.recyclability]);

  const handleConfirmMaterial = () => {
    setUserConfirmed(true);
  };

  const handleSaveMaterialEdit = () => {
    const updated = {
      ...currentAnalysis,
      material: editedMaterial,
      confidence: 100 // User confirmed manual edit
    };
    setCurrentAnalysis(updated);
    setIsEditingMaterial(false);
    setUserConfirmed(true);
    if (onUpdateAnalysis) {
      onUpdateAnalysis(updated);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `EcoCycle: ${currentAnalysis.primaryObject} is ${currentAnalysis.recyclability}`,
        text: `Check out recycling instructions and transformation yields for ${currentAnalysis.material} on EcoCycle AI.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const recyclabilityConfig = {
    recyclable: {
      title: 'Curbside Recyclable',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      headerBg: 'from-emerald-500/10 to-teal-500/5 border-emerald-200',
      summary: 'Accepted in regular municipal single-stream curbside collection bins in this location.'
    },
    'non-recyclable': {
      title: 'Non-Recyclable through Ordinary Facilities',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle,
      iconColor: 'text-red-500',
      headerBg: 'from-red-500/10 to-amber-500/5 border-red-200',
      summary: 'Not accepted in standard curbside blue bins. Requires specialized drop-off collection, mail-in program, or landfill disposal.'
    },
    uncertain: {
      title: 'Manual Verification Required',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      headerBg: 'from-amber-500/10 to-yellow-500/5 border-amber-200',
      summary: 'Material composition is ambiguous or depends on micro-facility sorting capabilities. Check your exact district rules.'
    }
  }[currentAnalysis.recyclability];

  const StatusIcon = recyclabilityConfig.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Status */}
      <div className={`p-6 sm:p-8 rounded-3xl border bg-gradient-to-r ${recyclabilityConfig.headerBg} shadow-xs`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-2xl bg-white shadow-sm ${recyclabilityConfig.iconColor}`}>
              <StatusIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${recyclabilityConfig.badgeClass}`}>
                  {recyclabilityConfig.title}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentAnalysis.location}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {currentAnalysis.primaryObject}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {currentAnalysis.localAcceptanceDetails || recyclabilityConfig.summary}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onNavigate('transformations', { analysis: currentAnalysis })}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all"
            >
              <Factory className="w-4 h-4" />
              <span>Upcycling Yields</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('analyzer')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Image & Material Specification */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Scanned Image Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 bg-slate-900 flex items-center justify-center">
              <img 
                src={currentAnalysis.imageUrl} 
                alt={currentAnalysis.primaryObject} 
                className="w-full h-full object-contain"
              />
              {currentAnalysis.resinCode && (
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-white font-mono text-xs font-bold flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resin: {currentAnalysis.resinCode}</span>
                </div>
              )}
            </div>

            {/* AI Confidence & Confirmation */}
            <div className="p-4 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Detection Confidence</span>
                </span>
                <span className="font-bold text-emerald-700">{currentAnalysis.confidence}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentAnalysis.confidence}%` }}
                ></div>
              </div>

              {/* Confirm / Edit Material requirement from Section 2 */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                {!isEditingMaterial ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] text-slate-500">
                      {userConfirmed ? '✓ Material confirmed by you' : 'Prediction accurate?'}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {!userConfirmed && (
                        <button
                          onClick={handleConfirmMaterial}
                          className="px-2 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsEditingMaterial(true)}
                        className="px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-semibold flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Select or type verified material:
                    </label>
                    <input
                      type="text"
                      value={editedMaterial}
                      onChange={(e) => setEditedMaterial(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-medium"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsEditingMaterial(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveMaterialEdit}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detected Sub-Objects breakdown */}
          {currentAnalysis.detectedObjects && currentAnalysis.detectedObjects.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Detected Components & Layers</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentAnalysis.detectedObjects.map((obj, i) => (
                  <span 
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200"
                  >
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Measurements summary */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-900">Physical Metrics</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Quantity & Weight</span>
                <span className="font-bold text-slate-800">
                  {currentAnalysis.userMeasurements.quantity} item(s) • {currentAnalysis.userMeasurements.weight}{currentAnalysis.userMeasurements.weightUnit || 'g'}
                </span>
                {currentAnalysis.userMeasurements.isWeightEstimated && (
                  <span className="text-[9px] text-amber-600 block mt-0.5">Estimated mass</span>
                )}
              </div>

              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Condition</span>
                <span className="font-bold text-slate-800 capitalize">
                  {currentAnalysis.userMeasurements.condition}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Recycling Instructions, Preparation & Verification Sources */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preparation Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Recycling Preparation Checklist</span>
              </h2>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                Step-by-Step
              </span>
            </div>

            <ul className="space-y-2.5">
              {currentAnalysis.preparationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Material Limitations & Sorting Facility Pitfalls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>MRF Sorting Limitations & Contamination Risks</span>
            </h3>
            <p className="text-xs text-slate-500">
              Why Materials Recovery Facilities (MRFs) encounter sorting jams or degraded bale quality:
            </p>
            <ul className="space-y-2">
              {currentAnalysis.limitations.map((limit, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                  • {limit}
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Disposal Instructions if Non-Recyclable */}
          {currentAnalysis.safeDisposalInstructions && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
              <h4 className="font-bold flex items-center space-x-1.5 text-red-800">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Safe Alternative Disposal Instructions</span>
              </h4>
              <p className="leading-relaxed">{currentAnalysis.safeDisposalInstructions}</p>
            </div>
          )}

          {/* Upcycling & Product Transformation Section with Visual Product Thumbnails */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-5 border border-emerald-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Factory className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Circular Upcycling Engine
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                {currentAnalysis.transformations?.length || 0} Products Identified
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                What Can Be Manufactured from This {currentAnalysis.primaryObject}?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Based on {currentAnalysis.userMeasurements.quantity} item(s) (~{currentAnalysis.userMeasurements.weight}{currentAnalysis.userMeasurements.weightUnit || 'g'}), here are concrete products this recovered material can be converted into:
              </p>
            </div>

            {/* Visual Transformation Cards Grid */}
            {currentAnalysis.transformations && currentAnalysis.transformations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentAnalysis.transformations.map((t, idx) => (
                  <div 
                    key={t.id || idx}
                    onClick={() => onNavigate('transformations', { analysis: currentAnalysis })}
                    className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
                  >
                    {t.imageUrl && (
                      <div className="relative h-28 rounded-xl overflow-hidden bg-slate-700">
                        <img 
                          src={t.imageUrl} 
                          alt={t.suggestedProduct}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-300 uppercase">
                          {t.transformationType === 'diy' ? '🛠️ DIY' : '🏭 Industrial'}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-white">
                          {t.materialRecoveryPercentage}% Recovery
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {t.suggestedProduct}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {t.approximateYield}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('transformations', { analysis: currentAnalysis })}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              <span>Explore Interactive Scaler & Manufacturing Yields</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Verified Sources & Municipal Links (Section 3) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Guidelines & Authority Sources</span>
              </h3>
              <span className="text-[10px] text-slate-400">Online Verification</span>
            </div>

            <div className="space-y-2">
              {currentAnalysis.sources?.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-colors group"
                >
                  <div className="pr-2">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                      {src.title}
                    </p>
                    {src.organization && (
                      <p className="text-[10px] text-slate-500">{src.organization}</p>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
