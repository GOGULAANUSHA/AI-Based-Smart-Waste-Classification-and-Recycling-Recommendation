import React, { useState } from 'react';
import { 
  Factory, 
  Sparkles, 
  Hammer, 
  Layers, 
  Info, 
  ArrowLeft, 
  CheckCircle2, 
  Percent, 
  Wrench, 
  Scale, 
  Plus, 
  Minus,
  Sliders,
  RotateCcw,
  ExternalLink,
  Eye,
  X,
  Boxes
} from 'lucide-react';
import { AnalysisRecord, ProductTransformation } from '../types';

interface TransformationsPageProps {
  analysis: AnalysisRecord;
  onNavigate: (page: string, params?: any) => void;
}

export const TransformationsPage: React.FC<TransformationsPageProps> = ({ 
  analysis, 
  onNavigate 
}) => {
  // Allow user to dynamically scale quantity to see real-time manufacturing yield
  const [interactiveQuantity, setInteractiveQuantity] = useState<number>(
    analysis.userMeasurements.quantity || 1
  );
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const baseWeightG = (
    analysis.userMeasurements.weightUnit === 'kg' 
      ? (analysis.userMeasurements.weight || 0.02) * 1000 
      : (analysis.userMeasurements.weight || 20)
  );

  const totalGramsAvailable = Math.round(baseWeightG * interactiveQuantity);

  // Calculate dynamic yields based on user quantity
  const calculateDynamicYield = (trans: ProductTransformation, qty: number, totalG: number) => {
    const pName = trans.suggestedProduct.toLowerCase();

    // 0. Silver / Jewelry: Artisan Casting & Rings
    if (pName.includes('ring') || pName.includes('pendant') || pName.includes('casting') || pName.includes('jewelry') || pName.includes('grain')) {
      const rings = Math.max(0.5, Number((totalG / 9).toFixed(1)));
      return {
        metric: `~${rings} Handcrafted Sterling Silver Signet Ring(s) or Pendants`,
        calculationBasis: `Standard baseline: A solid adult sterling silver signet ring or medallion pendant weighs ~8-10g. With 98% crucible melting recovery, your ~${totalG}g yields ~${rings} heirloom cast pieces.`,
        unitLabel: 'Jewelry Pieces'
      };
    }

    // 0b. Silver / Wire & Sheet Stock
    if (pName.includes('wire') || pName.includes('spool') || pName.includes('sheet stock') || pName.includes('drawplate')) {
      const meters = Math.max(0.5, Number((totalG / 12).toFixed(1)));
      return {
        metric: `~${meters} Meters of 1.0mm (18-Gauge) Round Jeweler Wire`,
        calculationBasis: `12 grams of .925 sterling silver cast ingot cold-rolled and drawn through diamond dies yields ~1 meter of 18-gauge wire for artisan jewelry wrapping and findings.`,
        unitLabel: 'Meters'
      };
    }

    // 0c. Silver Bullion Bar & Electronic Paste
    if (pName.includes('bullion') || pName.includes('ingot') || pName.includes('silver bar') || pName.includes('contact paste') || pName.includes('solder')) {
      const troyOz = Number((totalG / 31.1).toFixed(2));
      const grams999 = Math.round(totalG * 0.925);
      return {
        metric: `~${troyOz} Troy Oz [~${grams999}g] .999 Fine Pure Silver Bullion / Electronic Paste`,
        calculationBasis: `Electrochemical Moebius refining extracts 99.9% pure silver from sterling scrap alloy for minting or solar photovoltaic conductive pastes. 1 troy oz = 31.1g.`,
        unitLabel: 'Troy Ounces'
      };
    }

    // 1. Polystyrene: Picture Frames & Interior Crown Moulding
    if (pName.includes('frame') || pName.includes('moulding') || pName.includes('molding')) {
      const frames = Math.max(0.1, Number((qty / 18).toFixed(1)));
      return {
        metric: `${frames} Decorative Picture Frame(s) [8x10"]`,
        calculationBasis: `Standard baseline: ~18 thermoformed polystyrene cups (~216g) produce 1 standard 8x10" architectural picture frame profile with 92% recovery efficiency. Your batch provides ~${totalG}g available PS polymer.`,
        unitLabel: 'Frames'
      };
    }

    // 2. Polystyrene: Commercial Coat Hangers
    if (pName.includes('hanger') || pName.includes('hook') || pName.includes('garment')) {
      const hangers = Math.max(0.2, Number((qty / 6).toFixed(1)));
      return {
        metric: `${hangers} Heavy-Duty Commercial Clothes Hanger(s)`,
        calculationBasis: `Injection molding uses ~72g recycled #6 PS resin pellets per rigid retail coat hanger. Your collection provides ~${totalG}g feed material (~${hangers} finished hangers).`,
        unitLabel: 'Hangers'
      };
    }

    // 3. Polystyrene / Direct DIY: Seedling Pots & Garden Flats
    if (pName.includes('seedling') || pName.includes('nursery') || pName.includes('pot') || pName.includes('propagation')) {
      return {
        metric: `${qty} Seedling Starter Pot(s) & Nursery Cups`,
        calculationBasis: `Direct 1:1 circular reuse with drainage hole perforation. Requires zero melt energy and generates 0 kg CO₂ emissions.`,
        unitLabel: 'Seedling Pots'
      };
    }

    // 4. PET: Fleece Jacket & Apparel
    if (pName.includes('fleece') || pName.includes('polyester') || pName.includes('apparel') || pName.includes('textile')) {
      const jackets = (totalG / 625).toFixed(1);
      const shirts = (totalG / 250).toFixed(1);
      return {
        metric: `${jackets} Fleece Jacket(s) or ${shirts} Sportswear Shirt(s)`,
        calculationBasis: `Standard baseline: ~25 PET bottles (500ml) yield 1 adult fleece pullover (~625g pure rPET filament). Your collection provides ~${totalG}g available resin.`,
        unitLabel: 'Garments'
      };
    }

    // 5. PET: Industrial Strapping Band
    if (pName.includes('strap') || pName.includes('band')) {
      const meters = Math.max(1, Math.round((qty * 10) / 8));
      return {
        metric: `~${meters} Meters of Heavy-Duty Industrial Strapping Band`,
        calculationBasis: `~8 PET bottles produce 10 meters of high-tensile machine strapping band for securing palletized freight.`,
        unitLabel: 'Meters'
      };
    }

    // 6. HDPE: Plastic Lumber 2x4 Board
    if (pName.includes('lumber') || pName.includes('deck') || pName.includes('board') || pName.includes('timber')) {
      const boards = (totalG / 8000).toFixed(2);
      return {
        metric: `${boards} Plastic Lumber 2x4 Board(s) [8ft length]`,
        calculationBasis: `1 durable extruded plastic lumber board requires ~8kg recycled polyolefin. Your batch contributes ${(Number(boards) * 100).toFixed(0)}% of a full structural board.`,
        unitLabel: 'Boards'
      };
    }

    // 7. HDPE: Park Benches
    if (pName.includes('bench') || pName.includes('furniture')) {
      const benches = (qty / 500).toFixed(2);
      return {
        metric: `${benches} Municipal Outdoor Park Bench(es)`,
        calculationBasis: `~500 recycled rigid plastic jugs produce 1 commercial weather-proof public park bench (~31 kg recycled resin).`,
        unitLabel: 'Benches'
      };
    }

    // 8. Aluminium: New Beverage Cans
    if (pName.includes('can') && (pName.includes('beverage') || pName.includes('soda') || pName.includes('closed-loop'))) {
      const newCans = Math.max(1, Math.floor(qty * 0.95));
      return {
        metric: `~${newCans} Brand-New Beverage Can(s)`,
        calculationBasis: `Aluminium recycling loses only ~5% slag dross in reverberatory smelters. Infinitely circular and back on grocery shelves within 60 days.`,
        unitLabel: 'Cans'
      };
    }

    // 9. Aluminium: Automotive Alloy Wheels
    if (pName.includes('wheel') || pName.includes('alloy') || pName.includes('rim')) {
      const wheels = (qty / 350).toFixed(2);
      return {
        metric: `${wheels} Lightweight Automotive Alloy Wheel Rim(s)`,
        calculationBasis: `~350 beverage cans (~5.25 kg) provide the refined aluminium required for 1 automotive cast wheel.`,
        unitLabel: 'Wheels'
      };
    }

    // 10. Cardboard: Molded Pulp Egg Cartons
    if (pName.includes('egg') || pName.includes('tray') || pName.includes('cushion')) {
      const cartons = Math.max(1, Math.round(qty * 3));
      return {
        metric: `~${cartons} Molded Pulp Egg Carton(s) [6-egg capacity]`,
        calculationBasis: `1 corrugated shipping box (~180g) yields ~3 vacuum-formed protective pulp cartons for eggs or electronics.`,
        unitLabel: 'Cartons'
      };
    }

    // 11. Cardboard: New Shipping Cartons
    if (pName.includes('box') || pName.includes('cardboard') || pName.includes('paper')) {
      const boxes = Math.max(1, Math.floor(qty * 0.85));
      return {
        metric: `~${boxes} Recycled Corrugated Packaging Carton(s)`,
        calculationBasis: `Paper fiber pulping achieves 85% mechanical yield after screening out tape, glue, and short broken fibrils.`,
        unitLabel: 'Boxes'
      };
    }

    // 12. Glass: New Glass Containers
    if (pName.includes('jar') || (pName.includes('glass') && pName.includes('bottle'))) {
      const bottles = Math.floor(qty * 0.98);
      return {
        metric: `~${bottles} New Container Glass Bottle(s) / Food Jar(s)`,
        calculationBasis: `100% direct closed-loop circular cullet. 1 bottle recycled yields 1 new bottle indefinitely with zero quality degradation.`,
        unitLabel: 'Jars'
      };
    }

    // 13. Glass: Fiberglass Thermal Insulation
    if (pName.includes('insulation') || pName.includes('fiberglass') || pName.includes('batt')) {
      const batts = (qty / 10).toFixed(1);
      return {
        metric: `~${batts} Residential Fiberglass Thermal Insulation Batt Roll(s)`,
        calculationBasis: `~10 glass containers (~2.8 kg) are spun into microscopic fibers that provide insulation for 15 sq ft of residential attic space.`,
        unitLabel: 'Batts'
      };
    }

    // 14. Compost & Garden Mulch
    if (pName.includes('mulch') || pName.includes('compost') || pName.includes('soil')) {
      const area = (qty * 0.15).toFixed(2);
      const humusKg = (qty * 0.18).toFixed(2);
      return {
        metric: `${area} m² Garden Weed Barrier or ~${humusKg} kg Enriched Soil Humus`,
        calculationBasis: `100% organic decomposition. Breaks down cleanly over 90 days, returning nitrogen, carbon, and soil moisture back to living earth.`,
        unitLabel: 'Compost'
      };
    }

    // 15. Multilayer Composite Eco-Plank
    if (pName.includes('eco-board') || pName.includes('panel') || pName.includes('sheet')) {
      const m2 = (qty / 200).toFixed(2);
      return {
        metric: `${m2} m² High-Density Waterproof Structural Eco-Board`,
        calculationBasis: `~200 multilayer snack packets compressed under thermal platens create 1 sq meter of rot-resistant subfloor sheeting.`,
        unitLabel: 'Panels'
      };
    }

    return {
      metric: `${qty} Transformed Unit Equivalent(s)`,
      calculationBasis: `Calculated from ~${totalG}g raw feed material at ~${trans.materialRecoveryPercentage}% recovery efficiency.`,
      unitLabel: 'Units'
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => onNavigate('results', { analysis })}
            className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Classification Verdict</span>
          </button>
          <div className="flex items-center space-x-2">
            <Factory className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Product Transformation & Upcycling Yields
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyzing circular manufacturing potential for <strong className="text-slate-800">{analysis.primaryObject}</strong> ({analysis.material}).
          </p>
        </div>

        <button
          onClick={() => onNavigate('analyzer')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Scan Another Item</span>
        </button>
      </div>

      {/* Interactive Yield Multiplier Bar */}
      <div className="p-6 rounded-3xl bg-emerald-950 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Batch Scaler</span>
            </div>
            <h2 className="text-lg font-bold">
              Adjust Waste Volume to Calculate Real Factory Yields
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Simulate individual home collections or bulk recycling drives to see exact quantities of finished goods produced.
            </p>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center bg-slate-800/80 rounded-2xl p-1.5 border border-slate-700">
            <button
              onClick={() => setInteractiveQuantity(Math.max(1, interactiveQuantity - 1))}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
              title="Decrease Quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="px-4 text-center min-w-[70px]">
              <span className="text-xl font-black text-emerald-400 block">{interactiveQuantity}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Items</span>
            </div>
            <button
              onClick={() => setInteractiveQuantity(interactiveQuantity + 1)}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
              title="Increase Quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1">Quick Presets:</span>
          {[1, 6, 18, 50, 100, 500].map((preset) => (
            <button
              key={preset}
              onClick={() => setInteractiveQuantity(preset)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                interactiveQuantity === preset
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {preset} pcs
            </button>
          ))}
          <div className="ml-auto text-[11px] text-emerald-300 font-mono font-semibold">
            ≈ {totalGramsAvailable >= 1000 ? `${(totalGramsAvailable / 1000).toFixed(2)} kg` : `${totalGramsAvailable} g`} Feed Material
          </div>
        </div>
      </div>

      {/* Disclaimers & Methodology (Section 6 Requirement) */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Transparent Engineering & Upcycling Methodology:</p>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            All yields are educational approximations calculated from industrial plastic compounding densities, extrusion thermal losses, and published life-cycle assessments (Association of Plastic Recyclers & Aluminum Association).
          </p>
        </div>
      </div>

      {/* Transformations Grid with Product Images */}
      <div className="space-y-6">
        {analysis.transformations && analysis.transformations.length > 0 ? (
          analysis.transformations.map((trans, idx) => {
            const dynamicYield = calculateDynamicYield(trans, interactiveQuantity, totalGramsAvailable);
            const isDIY = trans.transformationType === 'diy';

            return (
              <div 
                key={trans.id || idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Product Image & Title Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-slate-100">
                  
                  {/* Visual Image Banner */}
                  {trans.imageUrl && (
                    <div className="md:col-span-4 relative h-48 md:h-auto min-h-[190px] bg-slate-100 overflow-hidden group">
                      <img 
                        src={trans.imageUrl} 
                        alt={trans.suggestedProduct}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Image Zoom Trigger */}
                      <button
                        onClick={() => setSelectedImage({ url: trans.imageUrl!, title: trans.suggestedProduct })}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs flex items-center space-x-1 transition-all cursor-pointer"
                        title="View Full Product Image"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold">Enlarge</span>
                      </button>

                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md ${
                          isDIY 
                            ? 'bg-amber-500/90 text-white shadow-sm' 
                            : 'bg-blue-600/90 text-white shadow-sm'
                        }`}>
                          {isDIY ? '🛠️ DIY Upcycle' : '🏭 Factory Re-melt'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Header Details */}
                  <div className={`${trans.imageUrl ? 'md:col-span-8' : 'md:col-span-12'} p-6 sm:p-7 flex flex-col justify-between space-y-4`}>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isDIY 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {isDIY ? '🛠️ DIY Home Upcycling' : '🏭 Industrial Reprocessing'}
                          </span>
                          {trans.difficulty && (
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">
                              Difficulty: {trans.difficulty}
                            </span>
                          )}
                        </div>

                        {/* Recovery percentage badge */}
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <Percent className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{trans.materialRecoveryPercentage}% Material Recovery</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                        {trans.suggestedProduct}
                      </h3>
                    </div>

                    {/* Calculated Yield Highlight Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1">
                          <Boxes className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Calculated Upcoming Production Yield ({interactiveQuantity} items):</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Live Scaler Output
                        </span>
                      </div>
                      
                      <div className="text-lg sm:text-2xl font-black text-emerald-950 tracking-tight">
                        {dynamicYield.metric}
                      </div>

                      <p className="text-xs text-emerald-900/80 mt-1.5 font-medium leading-relaxed">
                        {dynamicYield.calculationBasis}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Technical Specifications */}
                <div className="p-6 sm:p-7 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Suitability rationale */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                    <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Why This Material Is Suitable</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {trans.suitability}
                    </p>
                  </div>

                  {/* Required process / tools */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                    <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Required Tools & Transformation Stages</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {trans.requiredToolsOrProcess}
                    </p>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-sm text-slate-500">No transformations generated for this material.</p>
          </div>
        )}
      </div>

      {/* Image Modal for inspecting finished products */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full text-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h4 className="font-bold text-sm text-slate-200 truncate pr-4">
                {selectedImage.title}
              </h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-4/3 bg-black">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-xs text-slate-400 bg-slate-950 flex items-center justify-between">
              <span>Finished Upcycled Product Reference</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
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
