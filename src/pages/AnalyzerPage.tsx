import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Scan, 
  MapPin, 
  Scale, 
  Ruler, 
  AlertCircle, 
  Sparkles, 
  Info, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { CameraCapture } from '../components/CameraCapture';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AnalysisRecord, UserMeasurements } from '../types';

interface AnalyzerPageProps {
  initialImageUrl?: string;
  onAnalysisComplete: (result: AnalysisRecord) => void;
  onNavigate: (page: string) => void;
}

// Client-side image compressor for lightning-fast uploads
async function optimizeImage(fileOrDataUrl: File | string, maxDimension = 800, quality = 0.82): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl: compressedDataUrl, mimeType: 'image/jpeg' });
      } else {
        resolve({
          dataUrl: typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '',
          mimeType: 'image/jpeg'
        });
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({ 
  initialImageUrl, 
  onAnalysisComplete,
  onNavigate
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Uploaded image state
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  // Location
  const [location, setLocation] = useState<string>(user?.location || 'Austin, TX, USA');
  const [isChangingLocation, setIsChangingLocation] = useState<boolean>(false);

  // Optional collapsible measurements drawer
  const [showOptionalDetails, setShowOptionalDetails] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [condition, setCondition] = useState<UserMeasurements['condition']>('clean');
  const [customWeight, setCustomWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g');
  const [userNotes, setUserNotes] = useState<string>('');

  // Processing state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Analyzing image with AI...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    e.target.value = '';
  };

  const processFile = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Please upload a supported image format: JPG, JPEG, PNG, or WEBP.');
      return;
    }
    setError(null);
    try {
      const optimized = await optimizeImage(file);
      setImagePreview(optimized.dataUrl);
      setMimeType(optimized.mimeType);
    } catch {
      // Fallback
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleCameraCapture = async (base64Image: string) => {
    try {
      const optimized = await optimizeImage(base64Image);
      setImagePreview(optimized.dataUrl);
      setMimeType(optimized.mimeType);
    } catch {
      setImagePreview(base64Image);
      setMimeType('image/jpeg');
    }
    setError(null);
  };

  const handleStartAnalysis = async () => {
    if (!imagePreview) {
      setError('Please upload or snap a photo of a waste item first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStatusMessage('Identifying material & verifying municipal recycling rules...');

    try {
      const measurements: UserMeasurements = {
        quantity: Math.max(1, quantity),
        condition,
        weight: customWeight ? parseFloat(customWeight) : undefined,
        weightUnit
      };

      const res = await api.classifyWaste({
        imageBase64: imagePreview,
        mimeType,
        location,
        userMeasurements: measurements,
        userNotes: userNotes.trim()
      });

      onAnalysisComplete(res.data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please check your image or internet connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Streamlined Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fast AI Waste Detection</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Instant Waste Material Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload or snap a photo of any item. Our computer vision model will instantly identify the material, verify municipal rules, and calculate transformed products automatically.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Main Upload / Preview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Upload Dropzone or Image Preview */}
        {!imagePreview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-3xl p-10 text-center transition-all flex flex-col items-center justify-center min-h-[320px] ${
              dragOver 
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg,image/png,image/webp,image/jpg" 
              className="hidden" 
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Drop your waste item photo here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports bottles, cans, boxes, plastic wrappers, containers, and e-waste (JPG, PNG, WEBP).
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors">
                Browse Files
              </span>
              <span className="text-xs text-slate-400 font-medium">or</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowCamera(true); }}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Take Photo with Camera</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-16/9 sm:aspect-21/9 max-h-[360px] flex items-center justify-center border border-slate-200">
              <img 
                src={imagePreview} 
                alt="Waste item preview" 
                className="w-full h-full object-contain"
              />

              {/* Scanning Laser Animation */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-full absolute top-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-bounce"></div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/50">
                    <Scan className="w-6 h-6 animate-spin" />
                  </div>

                  <p className="text-base font-bold text-white mb-1">
                    Analyzing Material in Real-Time
                  </p>
                  <p className="text-xs text-emerald-300 font-mono">
                    {statusMessage}
                  </p>
                </div>
              )}

              {/* Remove button */}
              {!isAnalyzing && (
                <button
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Actions Bar under preview */}
            {!isAnalyzing && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex items-center space-x-1 text-slate-600 hover:text-emerald-700 font-semibold"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap new photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 text-slate-600 hover:text-emerald-700 font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose different file</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg,image/png,image/webp,image/jpg" 
                  className="hidden" 
                />
              </div>
            )}
          </div>
        )}

        {/* Location Jurisdiction Pill */}
        <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">Verifying municipal guidelines for:</span>
            {!isChangingLocation ? (
              <span className="font-bold text-slate-900">{location}</span>
            ) : (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => setIsChangingLocation(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsChangingLocation(false)}
                autoFocus
                className="px-2 py-0.5 rounded border border-emerald-500 text-xs font-bold"
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsChangingLocation(!isChangingLocation)}
            className="text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            {isChangingLocation ? 'Done' : 'Change Location'}
          </button>
        </div>

        {/* Primary Instant Analysis Button (Prominent & Clear) */}
        <div>
          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={!imagePreview || isAnalyzing}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isAnalyzing ? (
              <>
                <Scan className="w-5 h-5 animate-spin" />
                <span>Running Rapid AI Analysis...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Scan & Classify Item Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            No forms required! AI auto-estimates dimensions and material weights.
          </p>
        </div>

        {/* Optional Custom Batch Drawer (Clean, Collapsed by Default) */}
        <div className="border-t border-slate-200/80 pt-4">
          <button
            type="button"
            onClick={() => setShowOptionalDetails(!showOptionalDetails)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Optional: Custom Quantity or Exact Measured Weight</span>
              <span className="text-[10px] text-slate-400 uppercase font-normal">(Not required)</span>
            </div>
            {showOptionalDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showOptionalDetails && (
            <div className="p-4 mt-2 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 text-xs">
              
              <div className="p-2.5 rounded-xl bg-blue-50/70 text-blue-900 text-[11px] flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>These fields are purely optional. If left blank, standard industry estimates are applied automatically.</span>
              </div>

              {/* Quantity Quick Presets */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Item Count / Batch Size:</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: '1 Single Item', val: 1 },
                    { label: 'Pack of 6', val: 6 },
                    { label: 'Bag of 20', val: 20 },
                    { label: 'Bulk (50+)', val: 50 }
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setQuantity(preset.val)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        quantity === preset.val
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <div className="flex items-center space-x-1 ml-auto">
                    <span className="text-slate-500 text-[11px]">Custom:</span>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 text-center bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Condition Chips */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Condition:</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'clean', label: 'Clean & Empty' },
                    { id: 'soiled', label: 'Needs Light Rinse' },
                    { id: 'contaminated', label: 'Greasy / Paint Contaminated' },
                    { id: 'crushed', label: 'Crushed / Flattened' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCondition(c.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        condition === c.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Measured Weight */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Measured Scale Weight (If you weighed it):
                </label>
                <div className="flex items-center space-x-2 max-w-xs">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    placeholder="e.g. 28 (auto if blank)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                  />
                  <div className="flex rounded-lg overflow-hidden border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('g')}
                      className={`px-2.5 py-1 font-bold ${weightUnit === 'g' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}
                    >
                      g
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`px-2.5 py-1 font-bold ${weightUnit === 'kg' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}
                    >
                      kg
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Item Description / Clue */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Item Description or Type Hint (Optional):
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Sterling silver chain, tin soup can, glass jar, #2 milk jug..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs placeholder:text-slate-400"
                />
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

    </div>
  );
};
