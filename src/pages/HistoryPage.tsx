import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  Scale, 
  Ruler, 
  Download, 
  Scan, 
  ArrowRight,
  Eye,
  X,
  Factory,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnalysisRecord } from '../types';
import { api } from '../services/api';

interface HistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectRecord: (record: AnalysisRecord) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, onSelectRecord }) => {
  const { user, refreshMe } = useAuth();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [recyclabilityFilter, setRecyclabilityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Selected detail modal
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.getHistory({
        search: search.trim() || undefined,
        recyclability: recyclabilityFilter !== 'all' ? recyclabilityFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      });
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [search, recyclabilityFilter, categoryFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deleteAnalysis(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
      await refreshMe();
    } catch (err) {
      console.error('Failed to delete analysis:', err);
      alert('Failed to delete analysis record.');
    } finally {
      setDeletingId(null);
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecocycle_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit & Verification Trail</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Waste Analysis History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Archived computer vision scans, municipal verdicts, and upcycling calculations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={exportJSON}
            disabled={records.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={() => onNavigate('analyzer')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scans by object, resin, or material..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={recyclabilityFilter}
            onChange={(e) => setRecyclabilityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Verdicts</option>
            <option value="recyclable">Recyclable</option>
            <option value="non-recyclable">Special / Landfill</option>
            <option value="uncertain">Uncertain</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="plastic">Plastics</option>
            <option value="metal">Metals</option>
            <option value="glass">Glass</option>
            <option value="cardboard">Cardboard</option>
            <option value="mixed">Mixed / Multilayer</option>
            <option value="e-waste">E-Waste</option>
          </select>
        </div>

      </div>

      {/* Records Table / Grid */}
      {loading ? (
        <div className="text-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading your history records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No analysis records found</h3>
          <p className="text-xs text-slate-500">
            {search ? 'Try clearing your search query.' : 'Start scanning items to build your personal diversion log.'}
          </p>
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
          >
            Analyze First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map((rec) => {
            const isRec = rec.recyclability === 'recyclable';
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                    <img 
                      src={rec.imageUrl} 
                      alt={rec.primaryObject} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        isRec 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {isRec ? 'Recyclable' : 'Special Disposal'}
                      </span>
                    </div>

                    {rec.resinCode && (
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-white font-mono text-[10px] font-bold">
                        {rec.resinCode}
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                      <span>📍 {rec.location}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {rec.primaryObject}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {rec.material}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Qty: {rec.userMeasurements.quantity}</span>
                      <span>Weight: ~{rec.userMeasurements.weight || 30}{rec.userMeasurements.weightUnit || 'g'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Inspection</span>
                  </span>

                  {user && (
                    <button
                      onClick={(e) => handleDelete(rec.id, e)}
                      disabled={deletingId === rec.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Inspection Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                  Scan Record ID: {selectedRecord.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedRecord.primaryObject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img 
                    src={selectedRecord.imageUrl} 
                    alt={selectedRecord.primaryObject} 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Material:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedRecord.material}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Recycling Status:</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                      selectedRecord.recyclability === 'recyclable' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRecord.recyclability}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Location Rules:</span>
                    <span className="font-medium text-slate-800">{selectedRecord.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Scanned At:</span>
                    <span className="text-slate-600">{new Date(selectedRecord.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Preparation Steps */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Preparation Instructions</h4>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                  {selectedRecord.preparationSteps?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              {/* Upcycling Products */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Recommended Recycled Products</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRecord.transformations?.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                      <span className="font-bold text-emerald-950 block">{t.suggestedProduct}</span>
                      <span className="text-[11px] text-emerald-800 mt-1 block">{t.approximateYield}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  onSelectRecord(selectedRecord);
                  onNavigate('transformations', { analysis: selectedRecord });
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <Factory className="w-3.5 h-3.5" />
                <span>Open Upcycling Calculator</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
