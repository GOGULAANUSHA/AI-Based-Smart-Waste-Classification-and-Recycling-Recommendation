import React from 'react';
import { 
  Scan, 
  Sparkles, 
  ArrowRight, 
  Recycle, 
  Leaf, 
  MapPin, 
  Factory, 
  ShieldCheck, 
  BarChart3, 
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectSampleImage?: (sample: { imageUrl: string; name: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectSampleImage }) => {
  const sampleItems = [
    {
      id: 'sample-pet',
      name: 'Clear PET Water Bottle',
      category: 'PET Plastic #1',
      badge: 'Curbside Recyclable',
      status: 'recyclable',
      imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=500&q=80',
      description: 'Transparent polymer beverage bottle with PP cap and wrap label.'
    },
    {
      id: 'sample-can',
      name: 'Aluminium Soda Can',
      category: 'Aluminium Metal',
      badge: 'Infinite Recyclable',
      status: 'recyclable',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80',
      description: 'Standard 330ml beverage can with pull tab. 95% energy saved vs virgin ore.'
    },
    {
      id: 'sample-box',
      name: 'Corrugated Shipping Box',
      category: 'Cardboard (PAP 20)',
      badge: 'Curbside Recyclable',
      status: 'recyclable',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=500&q=80',
      description: 'Clean unbleached kraft cardboard box with fluted inner corrugated core.'
    },
    {
      id: 'sample-silver',
      name: 'Sterling Silver Chain',
      category: 'Precious Metal (.925 Ag)',
      badge: 'Refinery Recyclable',
      status: 'recyclable',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
      description: 'Solid sterling silver jewelry chain. 100% infinitely recyclable via jewelry refiners or casting.'
    },
    {
      id: 'sample-multilayer',
      name: 'Metallized Chip Bag',
      category: 'Multilayer Composite #7',
      badge: 'Non-Curbside / Special',
      status: 'non-recyclable',
      imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
      description: 'Bonded polypropylene and aluminum foil film. Requires TerraCycle or dropoff.'
    }
  ];

  const handleQuickScan = (sample: typeof sampleItems[0]) => {
    if (onSelectSampleImage) {
      onSelectSampleImage(sample);
    } else {
      onNavigate('analyzer', { sampleUrl: sample.imageUrl });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-teal-50/20 to-transparent pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next-Gen Computer Vision & Circular Economy Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Smart Waste Classification &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Circular Upcycling
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Snap or upload a photo of any waste item. Our AI detects materials (PET, HDPE, Aluminum, Glass, Cardboard), verifies local municipal recycling acceptance, and calculates real products that can be transformed from your discarded materials.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('analyzer')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all"
              >
                <Scan className="w-4 h-4" />
                <span>Start AI Waste Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('guide')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm shadow-xs transition-colors"
              >
                <Recycle className="w-4 h-4 text-emerald-600" />
                <span>Browse Recycling Guide</span>
              </button>
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Camera & File Upload</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Municipal MRF Verification</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Factory className="w-4 h-4 text-emerald-600" />
                <span>Upcycling Yield Calculator</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Quick Test Samples (Instant 1-Click Verification) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Test Drive</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Test Real Samples with One Click
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Don't have a waste photo right now? Click any representative sample below to trigger live classification.
            </p>
          </div>

          <button
            onClick={() => onNavigate('analyzer')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Or upload custom photo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sampleItems.map((sample) => (
            <div 
              key={sample.id}
              onClick={() => handleQuickScan(sample)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img 
                  src={sample.imageUrl} 
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                    sample.status === 'recyclable' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}>
                    {sample.badge}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-600 block uppercase tracking-wide">
                    {sample.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5">
                    {sample.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {sample.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Run Live AI Scan</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works 4-Step Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
              End-to-End Circular Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              From Waste Identification to Product Transformation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Standard image classifiers stop at a simple label. EcoCycle AI connects material physics with municipal sorting reality and industrial upcycling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
              <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Scan className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Multimodal Vision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detects objects, multi-part components (cap vs body), polymer resins (PET, HDPE, PP), metals, and composites with confidence scores.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
              <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Municipal MRF Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verifies if your city's single-stream recycling trucks and recovery facilities accept that specific resin and condition.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
              <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Preparation Guide</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provides actionable steps: should you rinse, crush, peel the label, or keep the screw cap on to prevent sorting screens loss?
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
              <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">04</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Upcycling Yields</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates real manufactured products: fleece t-shirts, plastic lumber decking, and aluminum cans with DIY vs Industrial workflows.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="text-3xl font-black text-emerald-600 block">95%</span>
            <span className="text-xs font-semibold text-slate-800 mt-1 block">Energy Saved</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Recycling aluminium vs raw bauxite mining</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="text-3xl font-black text-teal-600 block">25 Bottles</span>
            <span className="text-xs font-semibold text-slate-800 mt-1 block">Fleece Fabric Yield</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Produces 1 adult recycled polyester garment</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="text-3xl font-black text-blue-600 block">5 - 7 Times</span>
            <span className="text-xs font-semibold text-slate-800 mt-1 block">Cardboard Pulp Cycles</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Cellulose fiber reuse before degradation</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <span className="text-3xl font-black text-purple-600 block">60 Days</span>
            <span className="text-xs font-semibold text-slate-800 mt-1 block">Closed-Loop Turnaround</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">From consumer recycling bin back to shelf</span>
          </div>
        </div>
      </section>

    </div>
  );
};
