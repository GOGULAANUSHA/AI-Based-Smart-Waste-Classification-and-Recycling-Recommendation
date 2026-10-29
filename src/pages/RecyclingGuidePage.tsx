import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Scan, 
  Tag, 
  Factory,
  Layers,
  Info
} from 'lucide-react';
import { MaterialGuideItem } from '../types';
import { api } from '../services/api';

interface RecyclingGuidePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const RecyclingGuidePage: React.FC<RecyclingGuidePageProps> = ({ onNavigate }) => {
  const [guideItems, setGuideItems] = useState<MaterialGuideItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await api.getMaterialGuide();
        setGuideItems(res.data);
      } catch (err) {
        console.error('Failed to load guide:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGuide();
  }, []);

  const filteredItems = guideItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commonUses.some(u => u.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.transformationProducts.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'curbside') {
      return item.recyclability.toLowerCase().includes('high') || item.recyclability.toLowerCase().includes('curbside') || item.recyclability.toLowerCase().includes('infinite');
    }
    if (activeFilter === 'specialized') {
      return item.recyclability.toLowerCase().includes('specialized') || item.recyclability.toLowerCase().includes('medium');
    }
    if (activeFilter === 'non-recyclable') {
      return item.recyclability.toLowerCase().includes('low') || item.recyclability.toLowerCase().includes('rarely');
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Circular Materials Encyclopedia</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Comprehensive Recycling & Resin Code Guide
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed sorting rules, optical sorting characteristics, resin identification codes (RIC 1-7), and industrial transformation pathways for everyday materials.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material, resin, or item (e.g. PET, milk jug, pizza box)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Materials' },
            { id: 'curbside', label: 'Curbside Recyclable' },
            { id: 'specialized', label: 'Specialized Drop-Off' },
            { id: 'non-recyclable', label: 'Landfill / Rarely Recycled' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Guide Cards Grid */}
      {loading ? (
        <div className="text-center p-12">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading verified materials database...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No matching materials found</h3>
          <p className="text-xs text-slate-500 mt-1">Try another search term or clear filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isCurbside = item.recyclability.toLowerCase().includes('high') || item.recyclability.toLowerCase().includes('infinite') || item.recyclability.toLowerCase().includes('curbside');
            const isLow = item.recyclability.toLowerCase().includes('low') || item.recyclability.toLowerCase().includes('rarely');

            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-1 rounded-md bg-slate-900 text-emerald-400">
                      {item.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isCurbside
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isLow
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.recyclability}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.name}
                  </h3>

                  {/* Common Uses Tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.commonUses.map((use, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {use}
                      </span>
                    ))}
                  </div>

                  {/* Preparation Tips */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block">
                      Preparation Rules:
                    </span>
                    <p className="leading-relaxed">{item.tips}</p>
                  </div>

                  {/* Transformed Products */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 flex items-center space-x-1">
                      <Factory className="w-3 h-3" />
                      <span>Transformed Products:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.transformationProducts.map((prod, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Scan Action CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Have this item?</span>
                  <button
                    onClick={() => onNavigate('analyzer')}
                    className="flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Scan with AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
