"use client";
import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Cpu, 
  Layers, 
  Trash2, 
  Plus, 
  BookOpen, 
  TrendingUp, 
  Check, 
  Maximize2,
  RefreshCw
} from 'lucide-react';

import { PRESETS } from '../../data/presets';


export default function PrintableArchitect() {
  const [activeTab, setActiveTab] = useState('research'); // 'research' or 'designer'
  const [prompt, setPrompt] = useState('ADHD Study Alignment Sheet');
  const [isAIPlanning, setIsAIPlanning] = useState(false);
  const [planningStep, setPlanningStep] = useState(0);
  const [exportMode, setExportMode] = useState('prefilled'); // 'prefilled' or 'blank'
  const [isExporting, setIsExporting] = useState(false);
  
  // Customiser state linked to active canvas sheet
  const [sheet, setSheet] = useState(PRESETS.dopamine);
  
  // Generated AI research data
  const [researchData, setResearchData] = useState({
    title: "Daily Dopamine Menu",
    niche: "ADHD Task Management",
    demand: "V. High (95/100)",
    price: "$7.00",
    audience: "ADHDers, AuDHD, Burned Out Minds",
    neuroReason: PRESETS.dopamine.neuroReason,
    keywords: PRESETS.dopamine.keywords,
    copy: "A highly tactical, sensory-friendly daily menu layout designed to break through the dreaded ADHD task paralysis loop. It separates daily activities into low-friction starters, essential mains, ambient sides, and rewarding desserts to align task execution with natural dopamine levels."
  });

  // Handle active preset loading
  const handleLoadPreset = (presetId) => {
    const p = PRESETS[presetId];
    if (p) {
      setSheet(JSON.parse(JSON.stringify(p))); // Deep clone
      setResearchData({
        title: p.title,
        niche: p.niche,
        demand: p.demand,
        price: p.price,
        audience: p.audience,
        neuroReason: p.neuroReason,
        keywords: p.keywords,
        copy: `A highly tactical, sensory-friendly printable template designed specifically for your ${p.niche} audience. Built to optimize executive function based on curated neurodivergent best-seller analytics.`
      });
      setActiveTab('designer');
    }
  };

  // AI planner simulator
  const handleAIResearchAndGenerate = () => {
    if (!prompt.trim()) return;
    setIsAIPlanning(true);
    setPlanningStep(1);

    setTimeout(() => {
      setPlanningStep(2);
      setTimeout(() => {
        setPlanningStep(3);
        setTimeout(() => {
          setPlanningStep(4);
          setTimeout(() => {
            const lowerPrompt = prompt.toLowerCase();
            let matchedNiche = "Neurodivergent Life Skills";
            let demandScore = "High (91/100)";
            let pricing = "$8.50";
            let reasons = "De-congests cognitive memory loops, giving clear spatial bounds to organise information and lessen working memory decay.";
            let kws = ["neurodivergent organiser", "adhd templates", "printable routines"];
            let audienceType = "ADHDers, Autistic adults, and executive thinkers";
            let customSections = [];

            if (lowerPrompt.includes('sleep') || lowerPrompt.includes('night') || lowerPrompt.includes('evening')) {
              matchedNiche = "ADHD Evening & Sleep Alignment";
              demandScore = "V. High (93/100)";
              pricing = "$9.00";
              reasons = "Establishes a low-dopamine wind-down routine. ADHD brains struggle to shut off because they naturally seek high stimulation under physical exhaustion. Tracking visual steps anchors transition nodes.";
              kws = ["adhd sleep tracker", "evening wind down chart", "insomnia printable", "low dopamine routine"];
              audienceType = "ADHDers, Night-Owls, and Over-stimulated thinkers";
              customSections = [
                {
                  id: 'winddown',
                  title: "Low-Dopamine Transition Ritual (Start 1 Hour Before Bed)",
                  type: 'checklist',
                  items: [
                    { text: "Switch off bright ceiling lights; turn on amber lamp/candle", checked: false },
                    { text: "Put phone on charger outside immediate sleeping room", checked: false },
                    { text: "Engage in non-screen stimulation (read book, doodling, stretch)", checked: false },
                    { text: "Sip warm chamomile or caffeine-free herbal tea", checked: false }
                  ]
                },
                {
                  id: 'mindclear',
                  title: "Cognitive Shutdown / Worry Brain Dump",
                  type: 'notes',
                  text: "Dump everything left undone today onto this sheet. It will wait for you tomorrow. Free your brain to sleep..."
                },
                {
                  id: 'sensoryprep',
                  title: "Sensory Environment Settings",
                  type: 'checklist',
                  items: [
                    { text: "Set bedroom thermostat to cool sleeping temperature", checked: false },
                    { text: "Turn on ambient brown noise shield or white noise loop", checked: false },
                    { text: "Ensure heavy blackout curtains are sealed", checked: false }
                  ]
                }
              ];
            } else if (lowerPrompt.includes('meal') || lowerPrompt.includes('eat') || lowerPrompt.includes('cook') || lowerPrompt.includes('food')) {
              matchedNiche = "Autism-Friendly Meal & Sensory Planners";
              demandScore = "High (87/100)";
              pricing = "$11.00";
              reasons = "Reduces the food-initiation crisis. Autistic and ADHD thinkers suffer from decision paralysis around food and sensory aversion. Factoring texture, effort load, and comfort meals prevents skipped meals.";
              kws = ["autism meal planner", "sensory food journal", "executive dysfunction eating", "easy adhd recipes"];
              audienceType = "Autistic individuals, ARFID support, and sensory-sensitive eaters";
              customSections = [
                {
                  id: 'comfort',
                  title: "My Safe / Comfort Meals (Zero Effort & Sensory Friendly)",
                  type: 'checklist',
                  items: [
                    { text: "Standard noodles or sensory-safe plain pasta", checked: false },
                    { text: "Toasted white bread with butter/spread", checked: false },
                    { text: "Pre-packaged sensory-consistent snack pouch", checked: false }
                  ]
                },
                {
                  id: 'weekly',
                  title: "Effort-Mapped Weekly Menu Options",
                  type: 'checklist',
                  items: [
                    { text: "High Effort Day: Cooked protein and grains", checked: false },
                    { text: "Low Effort Day: Frozen meal / heat-and-eat", checked: false },
                    { text: "Zero Effort Day: Safe snack plate / grazing platter", checked: false }
                  ]
                },
                {
                  id: 'texture',
                  title: "Daily Sensory Food Profile Notes (Textures & Flavors)",
                  type: 'notes',
                  text: "Track how different food profiles interact with your nervous system today (e.g., crunchy, smooth, high acid)..."
                }
              ];
            } else {
              matchedNiche = `Branded ${prompt}`;
              demandScore = "High (91/100)";
              pricing = "$8.00";
              reasons = `Specially customised template that segments the "${prompt}" process into distinct brutalist tracking blocks, designed to minimise overwhelm and visual distraction.`;
              kws = [`${prompt.toLowerCase()} tracker`, "adhd planner", "neurodivergent tools"];
              audienceType = "Neurodivergent creators, ADHD students, and autistic adults";
              customSections = [
                {
                  id: 'action',
                  title: `${prompt} · Tactical Action Checklist`,
                  type: 'checklist',
                  items: [
                    { text: `Initiate first low-barrier step of ${prompt}`, checked: false },
                    { text: `Perform mid-point sensory focus checks`, checked: false },
                    { text: `Log completion milestones and rewards`, checked: false }
                  ]
                },
                {
                  id: 'notes',
                  title: `Reflections & System Adjustments`,
                  type: 'notes',
                  text: `Write down adjustments you want to make to the ${prompt} system today. What friction did you encounter?`
                }
              ];
            }

            const customGeneratedPreset = {
              id: 'custom-ai',
              title: prompt,
              subtitle: `A highly custom, branded ${matchedNiche.toLowerCase()} template specifically structured to optimize executive capacity.`,
              niche: matchedNiche,
              demand: demandScore,
              price: pricing,
              audience: audienceType,
              neuroReason: reasons,
              keywords: kws,
              theme: "void",
              font: "mono",
              watermark: true,
              scaleLabel: "SENSORY COGNITIVE BANDWIDTH",
              scaleVal: 7,
              sections: customSections
            };

            setSheet(customGeneratedPreset);
            setResearchData({
              title: customGeneratedPreset.title,
              niche: customGeneratedPreset.niche,
              demand: customGeneratedPreset.demand,
              price: customGeneratedPreset.price,
              audience: customGeneratedPreset.audience,
              neuroReason: customGeneratedPreset.neuroReason,
              keywords: customGeneratedPreset.keywords,
              copy: `This custom ${customGeneratedPreset.niche} digital sheet has been dynamically planned, generated, and fully compiled by the AI Architect. Ready for you to tweak, style, and immediately export as a branded, print-ready digital product.`
            });
            
            setIsAIPlanning(false);
            setPlanningStep(0);
            setActiveTab('designer');
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleUpdateSheetTitle = (newVal) => {
    setSheet(prev => ({ ...prev, title: newVal }));
  };

  const handleUpdateSheetSubtitle = (newVal) => {
    setSheet(prev => ({ ...prev, subtitle: newVal }));
  };

  const handleUpdateSectionTitle = (sectionIdx, newVal) => {
    setSheet(prev => {
      const updated = { ...prev };
      updated.sections[sectionIdx].title = newVal;
      return updated;
    });
  };

  const handleUpdateChecklistItemText = (sectionIdx, itemIdx, newVal) => {
    setSheet(prev => {
      const updated = { ...prev };
      updated.sections[sectionIdx].items[itemIdx].text = newVal;
      return updated;
    });
  };

  const handleUpdateNotesText = (sectionIdx, newVal) => {
    setSheet(prev => {
      const updated = { ...prev };
      updated.sections[sectionIdx].text = newVal;
      return updated;
    });
  };

  const handleAddChecklistItem = (sectionIdx) => {
    setSheet(prev => {
      const updated = { ...prev };
      updated.sections[sectionIdx].items.push({ text: "Click to customise this goal item", checked: false });
      return updated;
    });
  };

  const handleRemoveChecklistItem = (sectionIdx, itemIdx) => {
    setSheet(prev => {
      const updated = { ...prev };
      updated.sections[sectionIdx].items.splice(itemIdx, 1);
      return updated;
    });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { compileBrandedPDF } = await import('../../lib/pdfBuilder');
      const blob = await compileBrandedPDF(sheet, exportMode);

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${sheet.title.toLowerCase().replace(/\s+/g, '_')}_fillable.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      
    } catch (error) {
      console.error("Interactive PDF Compilation failed: ", error);
      alert("Something went wrong compiling the interactive PDF. Falling back to browser print engine...");
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Two Column Creator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12 items-start w-full relative">
        
        {/* Left Column: Sidebar Controls Panel */}
        <aside className="border-2 border-border-rule bg-[#09090b] p-6 shadow-[4px_4px_0px_var(--rule)] flex flex-col gap-6 text-left no-print">
          
          {/* Tab Selector */}
          <div className="flex gap-2 border-b border-border-rule pb-4 select-none">
            <button
              onClick={() => setActiveTab('research')}
              className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border transition-all cursor-pointer rounded-none ${
                activeTab === 'research'
                  ? 'bg-accent-pink border-white text-black font-black shadow-[2px_2px_0px_#fff]'
                  : 'border-border-rule text-text-muted hover:text-white hover:border-white'
              }`}
            >
              <Sparkles size={12} className="inline mr-1.5" /> 1. AI STRATEGIST
            </button>
            
            <button
              onClick={() => setActiveTab('designer')}
              className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border transition-all cursor-pointer rounded-none ${
                activeTab === 'designer'
                  ? 'bg-accent-pink border-white text-black font-black shadow-[2px_2px_0px_#fff]'
                  : 'border-border-rule text-text-muted hover:text-white hover:border-white'
              }`}
            >
              <Layers size={12} className="inline mr-1.5" /> 2. DESIGN TWEAKS
            </button>
          </div>

          {/* TAB 1: AI STRATEGIC PLANNER */}
          {activeTab === 'research' && (
            <div className="flex flex-col gap-6">
              
              {/* Product Idea Seed Prompt */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">RESEARCH & COMPILE PROMPT:</label>
                  <span className="text-xs md:text-sm font-mono text-accent-pink bg-accent-pink-soft px-1.5 py-0.5 border border-border-rule">AI ASSISTANT ACTIVE</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., ADHD sleep tracker or Autism food journal"
                    disabled={isAIPlanning}
                    className="flex-1 h-11 bg-black border border-border-rule focus:border-accent-pink px-3 text-xs text-white outline-none rounded-none font-sans font-medium focus-ring"
                  />
                  <button
                    onClick={handleAIResearchAndGenerate}
                    disabled={isAIPlanning || !prompt.trim()}
                    className="px-4 bg-white text-black border-2 border-white font-black text-xs uppercase tracking-wider hover:bg-transparent hover:text-white cursor-pointer select-none transition-all flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {isAIPlanning ? 'RUNNING...' : 'AI RESEARCH'}
                  </button>
                </div>
                <div className="text-xs md:text-sm text-text-muted leading-relaxed font-sans mt-1">
                  💡 Try typing <span className="text-[#FF2E88] font-mono cursor-pointer hover:underline" onClick={() => setPrompt("ADHD Sleep & Evening Routine")}>"ADHD sleep routine"</span> or <span className="text-[#2E62FF] font-mono cursor-pointer hover:underline" onClick={() => setPrompt("Autism Sensory Food Audit")}>"Autism Sensory Food Audit"</span> to watch the AI build custom specialized templates.
                </div>
              </div>

              {/* AI Generative Loader Screen */}
              {isAIPlanning && (
                <div className="border border-border-rule bg-[#040406] p-6 text-center space-y-4 animate-pulse select-none">
                  <Cpu className="text-accent-pink mx-auto animate-spin" size={24} />
                  <div className="space-y-1">
                    <span className="font-mono text-xs md:text-sm uppercase font-bold tracking-widest text-accent-pink block">AI AGENTIC PROCESSOR</span>
                    <p className="text-xs text-white font-mono uppercase tracking-wide">
                      {planningStep === 1 && "Stage 1: Crawling niche demand metrics..."}
                      {planningStep === 2 && "Stage 2: Structuring neurological grounding justification..."}
                      {planningStep === 3 && "Stage 3: Drafting conversion product description & SEO strategy..."}
                      {planningStep === 4 && "Stage 4: Generating custom layout nodes & compiling canvas..."}
                    </p>
                  </div>
                  <div className="w-full bg-[#111115] h-1.5 border border-border-rule overflow-hidden">
                    <div 
                      className="bg-accent-pink h-full transition-all duration-300" 
                      style={{ width: `${planningStep * 25}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Market Research Strategy Card */}
              {!isAIPlanning && researchData && (
                <div className="border border-border-rule bg-[#050508] p-5 flex flex-col gap-4 font-sans text-xs">
                  <div className="flex items-center gap-2 border-b border-border-rule pb-3">
                    <TrendingUp className="text-accent-pink" size={14} />
                    <span className="font-mono text-xs md:text-sm font-black uppercase text-white tracking-wider">MARKET SEGMENT & MARKETING DATA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono text-xs md:text-sm">
                    <div>
                      <span className="text-text-muted uppercase block">ESTIMATED DEMAND:</span>
                      <span className="text-white font-bold">{researchData.demand}</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">REC. STORE PRICE:</span>
                      <span className="text-accent-pink font-bold">{researchData.price}</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">TARGET NICHE:</span>
                      <span className="text-white font-bold uppercase">{researchData.niche}</span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">TARGET AUDIENCE:</span>
                      <span className="text-white font-bold">{researchData.audience}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border-rule">
                    <span className="font-mono text-xs md:text-sm text-text-muted uppercase tracking-wider block">NEURODIVERGENT GROUNDING STRATEGY (WHY IT SELLS):</span>
                    <p className="text-xs text-text-muted leading-relaxed font-sans">{researchData.neuroReason}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-xs md:text-sm text-text-muted uppercase tracking-wider block">TARGET HIGH-CONVERSION KEYWORDS:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {researchData.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#121216] border border-border-rule font-mono text-xs md:text-sm uppercase tracking-wide text-white">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-dashed border-border-rule pt-3 mt-1">
                    <span className="font-mono text-xs md:text-sm text-accent-pink uppercase font-bold tracking-wider block">STORE DESCRIPTION COPY (PRE-COMPILED):</span>
                    <p className="text-xs md:text-sm text-text-muted font-sans leading-relaxed italic bg-black/40 p-2.5 border border-border-rule/50">
                      "{researchData.copy}"
                    </p>
                  </div>
                </div>
              )}

              {/* Bestseller Presets Hub */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-border-rule pb-2">
                  <BookOpen className="text-white" size={12} />
                  <span className="font-mono text-xs md:text-sm font-black uppercase text-white tracking-widest">LOAD BESTSELLING ETSY PRESETS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                  <button
                    onClick={() => handleLoadPreset('dopamine')}
                    className="p-3 border border-border-rule hover:border-accent-pink bg-black/50 text-left cursor-pointer transition-all flex flex-col gap-1 rounded-none hover:-translate-y-0.5 active:scale-95"
                  >
                    <span className="font-mono text-xs md:text-sm font-bold text-accent-pink uppercase">1. DOPAMINE MENU</span>
                    <span className="text-text-muted font-sans text-xs md:text-sm">Break paralysis.</span>
                  </button>
                  <button
                    onClick={() => handleLoadPreset('executive')}
                    className="p-3 border border-border-rule hover:border-accent-pink bg-black/50 text-left cursor-pointer transition-all flex flex-col gap-1 rounded-none hover:-translate-y-0.5 active:scale-95"
                  >
                    <span className="font-mono text-xs md:text-sm font-bold text-[#2E62FF] uppercase">2. EXEC ALIGNMENT</span>
                    <span className="text-text-muted font-sans text-xs md:text-sm">Expedite work layers.</span>
                  </button>
                  <button
                    onClick={() => handleLoadPreset('sensory')}
                    className="p-3 border border-border-rule hover:border-accent-pink bg-black/50 text-left cursor-pointer transition-all flex flex-col gap-1 rounded-none hover:-translate-y-0.5 active:scale-95"
                  >
                    <span className="font-mono text-xs md:text-sm font-bold text-[#5A8A60] uppercase">3. SENSORY AUDIT</span>
                    <span className="text-text-muted font-sans text-xs md:text-sm">Log drains & glimmers.</span>
                  </button>
                  <button
                    onClick={() => handleLoadPreset('routine')}
                    className="p-3 border border-border-rule hover:border-accent-pink bg-black/50 text-left cursor-pointer transition-all flex flex-col gap-1 rounded-none hover:-translate-y-0.5 active:scale-95"
                  >
                    <span className="font-mono text-xs md:text-sm font-bold text-accent-pink uppercase">4. NOW / NEXT BOARD</span>
                    <span className="text-text-muted font-sans text-xs md:text-sm">Anchor routines.</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VISUAL STYLE CUSTOMISER & LAYOUT TWEAKS */}
          {activeTab === 'designer' && (
            <div className="flex flex-col gap-6">

              {/* PDF Export Mode Toggle */}
              <div className="flex flex-col gap-2 font-mono text-xs md:text-sm select-none">
                <label className="font-mono text-xs md:text-sm text-accent-pink tracking-widest uppercase font-bold">EXPORT TYPE FORMAT:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportMode('prefilled')}
                    className={`flex-1 py-2.5 text-xs md:text-sm text-center border font-bold cursor-pointer transition-all ${
                      exportMode === 'prefilled'
                        ? 'bg-white text-black border-white shadow-[2px_2px_0px_#FF2E88]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    PRE-FILLED GUIDE
                  </button>
                  <button
                    onClick={() => setExportMode('blank')}
                    className={`flex-1 py-2.5 text-xs md:text-sm text-center border font-bold cursor-pointer transition-all ${
                      exportMode === 'blank'
                        ? 'bg-white text-black border-white shadow-[2px_2px_0px_#FF2E88]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    BLANK FILLABLE PDF
                  </button>
                </div>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed font-sans mt-0.5">
                  {exportMode === 'prefilled' 
                    ? '💾 Exports with all your pre-filled custom texts and checklist goals intact.' 
                    : '✏️ Generates empty fillable lines and interactive checkboxes in the PDF, letting customers check items and type text directly inside the file!'}
                </p>
              </div>

              {/* Brand Theming */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">BRAND SYSTEM COLORWAY:</label>
                <div className="flex gap-2 font-mono text-xs md:text-sm select-none">
                  <button
                    onClick={() => setSheet(prev => ({ ...prev, theme: 'void' }))}
                    className={`flex-1 py-2 text-center border font-bold cursor-pointer transition-all ${
                      sheet.theme === 'void'
                        ? 'bg-[#FF2E88] text-white border-white shadow-[2px_2px_0px_#fff]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    VOID (PINK)
                  </button>
                  <button
                    onClick={() => setSheet(prev => ({ ...prev, theme: 'warm-charcoal' }))}
                    className={`flex-1 py-2 text-center border font-bold cursor-pointer transition-all ${
                      sheet.theme === 'warm-charcoal'
                        ? 'bg-[#2E62FF] text-white border-white shadow-[2px_2px_0px_#fff]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    WARM CREAM (BLUE)
                  </button>
                  <button
                    onClick={() => setSheet(prev => ({ ...prev, theme: 'incubation' }))}
                    className={`flex-1 py-2 text-center border font-bold cursor-pointer transition-all ${
                      sheet.theme === 'incubation'
                        ? 'bg-[#5A8A60] text-white border-white shadow-[2px_2px_0px_#fff]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    FOREST (SAGE)
                  </button>
                </div>
              </div>

              {/* Typography toggles */}
              <div className="flex flex-col gap-2 select-none">
                <label className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">BRAND FONT FAMILY:</label>
                <div className="flex gap-2 font-mono text-xs md:text-sm">
                  <button
                    onClick={() => setSheet(prev => ({ ...prev, font: 'mono' }))}
                    className={`flex-1 py-2 text-center border font-bold cursor-pointer transition-all ${
                      sheet.font === 'mono'
                        ? 'bg-white text-black border-white shadow-[2px_2px_0px_var(--accent)]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    TECHNICAL MONOSPACE
                  </button>
                  <button
                    onClick={() => setSheet(prev => ({ ...prev, font: 'sans' }))}
                    className={`flex-1 py-2 text-center border font-bold cursor-pointer transition-all ${
                      sheet.font === 'sans'
                        ? 'bg-white text-black border-white shadow-[2px_2px_0px_var(--accent)]'
                        : 'border-border-rule text-text-muted hover:border-white'
                    }`}
                  >
                    SENSORY SANS-SERIF
                  </button>
                </div>
              </div>

              {/* Layout Watermark Toggles */}
              <div className="flex flex-col gap-2 font-mono text-xs md:text-sm select-none">
                <label className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">LAYOUT OPTIONS:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-text-muted">
                    <input
                      type="checkbox"
                      checked={sheet.watermark}
                      onChange={(e) => setSheet(prev => ({ ...prev, watermark: e.target.checked }))}
                      className="rounded-none accent-accent-pink w-4 h-4 cursor-pointer"
                    />
                    <span>INCLUDE neurodivers³ LOGO FOOTER</span>
                  </label>
                </div>
              </div>

              {/* Capacity Slider Label Config */}
              <div className="flex flex-col gap-2 font-mono">
                <label className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">DASHBOARD BATTERY LABEL:</label>
                <input
                  type="text"
                  value={sheet.scaleLabel || ""}
                  onChange={(e) => setSheet(prev => ({ ...prev, scaleLabel: e.target.value }))}
                  className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 text-xs text-white outline-none rounded-none"
                />
              </div>

              {/* Tasks Tweaker (Manage Section Structure) */}
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border-rule pb-2">
                  <span className="text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">MANAGE CHECKLIST BLOCKS</span>
                </div>
                <div className="space-y-3 font-sans text-xs select-none">
                  {sheet.sections.map((sec, secIdx) => {
                    if (sec.type !== 'checklist') return null;
                    return (
                      <div key={sec.id} className="border border-border-rule bg-[#040405] p-3 space-y-2">
                        <div className="flex justify-between items-center border-b border-border-rule/45 pb-1.5">
                          <span className="font-mono text-xs md:text-sm font-bold text-accent-pink uppercase">{sec.title.substring(0, 30)}...</span>
                          <button
                            onClick={() => handleAddChecklistItem(secIdx)}
                            className="px-2 py-0.5 bg-[#121216] border border-border-rule font-mono text-xs md:text-sm uppercase tracking-wide text-white hover:border-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus size={10} /> ADD ITEM
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                          {sec.items.map((it, itIdx) => (
                            <div key={itIdx} className="flex gap-1 items-center">
                              <input
                                type="text"
                                value={it.text}
                                onChange={(e) => handleUpdateChecklistItemText(secIdx, itIdx, e.target.value)}
                                className="flex-1 bg-black border border-border-rule px-2 py-1 text-xs md:text-sm text-white focus:border-accent-pink outline-none rounded-none"
                              />
                              <button
                                onClick={() => handleRemoveChecklistItem(secIdx, itIdx)}
                                className="p-1 hover:text-red-500 text-text-muted transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Bottom Export Trigger Action */}
          <div className="border-t border-border-rule pt-6 mt-2 flex flex-col gap-3 font-sans">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full py-4 bg-[var(--color-accent-pink,#FF2E88)] hover:bg-[#ff007f] text-black font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#ffffff] rounded-none shrink-0 disabled:opacity-50 select-none"
            >
              {isExporting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> GENERATING EDITABLE PDF...
                </>
              ) : (
                <>
                  <Download size={14} /> EXPORT BRANDED EDITABLE PDF
                </>
              )}
            </button>
            <div className="text-xs md:text-sm text-text-muted font-mono leading-relaxed text-center italic">
              📌 Tip: Generates a high-fidelity vector PDF featuring fully interactive checkboxes and clickable text fields compatible with all device readers!
            </div>
          </div>
        </aside>

        {/* Right Column: Physical A4 Styled Canvas Preview */}
        <div className="flex flex-col items-center justify-start w-full relative">
          
          {/* Active Preset Overlay indicator */}
          <div className="w-full max-w-[800px] mb-3 flex justify-between items-center font-mono text-xs md:text-sm text-text-muted uppercase tracking-wider px-2 no-print">
            <span>PREVIEWING physical layout (A4 Ratio)</span>
            <span className="flex items-center gap-1.5"><Maximize2 size={10} /> EDIT TEXT FIELDS INLINE BELOW</span>
          </div>

          {/* Interactive sheet wrapper */}
          <div 
            id="printable-canvas"
            className={`printable-canvas-print-layer w-full max-w-[800px] aspect-[1/1.414] bg-[#ffffff] border-4 border-black text-[#111111] p-8 md:p-12 shadow-2xl flex flex-col justify-between items-stretch text-left font-sans select-text relative overflow-hidden ${
              sheet.theme === 'warm-charcoal' ? 'bg-[#FCFBF7]' : ''
            }`}
          >
            <div className="space-y-6 md:space-y-8">
              
              {/* Branded printable header element */}
              <div className="flex justify-between items-end border-b-4 border-black pb-5 md:pb-6">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`font-mono text-xs md:text-sm md:text-xs md:text-sm font-black uppercase tracking-[0.2em] border border-black px-2 py-0.5 ${
                        sheet.theme === 'void' ? 'bg-[#FF2E88]/15 text-[#FF2E88]' : ''
                      } ${
                        sheet.theme === 'warm-charcoal' ? 'bg-[#2E62FF]/15 text-[#2E62FF]' : ''
                      } ${
                        sheet.theme === 'incubation' ? 'bg-[#4A6B53]/15 text-[#4A6B53]' : ''
                      }`}
                    >
                      neurodivers³ · SYSTEM SHEET
                    </span>
                  </div>
                  <input
                    type="text"
                    value={sheet.title}
                    onChange={(e) => handleUpdateSheetTitle(e.target.value)}
                    className={`text-2xl md:text-4xl font-black uppercase tracking-tighter bg-transparent border-b border-transparent hover:border-black/20 focus:border-black focus:bg-black/5 outline-none w-full ${
                      sheet.font === 'mono' ? 'font-mono' : 'font-display'
                    }`}
                  />
                  <input
                    type="text"
                    value={sheet.subtitle}
                    onChange={(e) => handleUpdateSheetSubtitle(e.target.value)}
                    className="text-xs md:text-sm md:text-[12px] text-[#444444] font-medium leading-relaxed bg-transparent border-b border-transparent hover:border-black/20 focus:border-black focus:bg-black/5 outline-none w-full"
                  />
                </div>

                {/* Date stamp without REF */}
                <div className="hidden md:flex flex-col items-end text-xs md:text-sm font-mono border border-black p-2.5 bg-[#eaeaea]/10 text-[#222222] shrink-0 self-end mb-1">
                  <span>DATE: _________________</span>
                </div>
              </div>

              {/* Dynamic Brain State scale gauge */}
              {sheet.scaleLabel && (
                <div className="border-2 border-black p-4 bg-white select-none">
                  <div className="flex justify-between items-center font-mono text-xs md:text-sm md:text-xs md:text-sm font-black uppercase text-[#111111] mb-2.5 tracking-wider">
                    <span>{sheet.scaleLabel}</span>
                    <span 
                      className={`text-xs md:text-sm px-1.5 py-0.5 border border-black font-bold ${
                        sheet.theme === 'void' ? 'bg-[#FF2E88] text-white' : ''
                      } ${
                        sheet.theme === 'warm-charcoal' ? 'bg-[#2E62FF] text-white' : ''
                      } ${
                        sheet.theme === 'incubation' ? 'bg-[#4A6B53] text-white' : ''
                      }`}
                    >
                      LEVEL: {sheet.scaleVal}/10
                    </span>
                  </div>
                  
                  {/* Print-friendly scale indicators */}
                  <div className="flex gap-1.5 md:gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
                      const isActive = v <= sheet.scaleVal;
                      return (
                        <div
                          key={v}
                          onClick={() => setSheet(prev => ({ ...prev, scaleVal: v }))}
                          className={`flex-1 h-6 md:h-7 border-2 border-black flex items-center justify-center font-mono text-xs font-black cursor-pointer rounded-none transition-all active:scale-90 ${
                            isActive
                              ? sheet.theme === 'void' 
                                ? 'bg-[#FF2E88] text-white' 
                                : sheet.theme === 'warm-charcoal' 
                                  ? 'bg-[#2E62FF] text-white' 
                                  : 'bg-[#4A6B53] text-white'
                              : 'bg-transparent'
                          }`}
                        >
                          <span className={isActive ? "text-[#111] text-xs md:text-sm md:text-xs block" : "hidden"}>●</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Brutalist Columns & Checklists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {sheet.sections.map((sec, secIdx) => {
                  
                  // Render notes-block
                  if (sec.type === 'notes') {
                    const isBlank = exportMode === 'blank';
                    return (
                      <div 
                        key={sec.id} 
                        className="border-2 border-black p-4 flex flex-col md:col-span-2 min-h-[140px] md:min-h-[160px] bg-white text-[#111111]"
                      >
                        <div className="flex justify-between items-center border-b border-black pb-2 mb-3">
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => handleUpdateSectionTitle(secIdx, e.target.value)}
                            className="font-mono text-xs md:text-sm md:text-xs md:text-sm font-black uppercase text-[#111111] bg-transparent border-none outline-none focus:bg-black/5 w-full tracking-wider"
                          />
                        </div>
                        <textarea
                          value={isBlank ? "" : sec.text}
                          placeholder={isBlank ? "Click to write notes or log sensory status..." : ""}
                          onChange={(e) => handleUpdateNotesText(secIdx, e.target.value)}
                          className="fillable-textarea flex-1 bg-transparent border-none text-xs md:text-sm md:text-[12px] leading-relaxed text-[#222222] font-sans resize-none outline-none focus:bg-black/5 w-full h-full min-h-[100px]"
                        />
                      </div>
                    );
                  }

                  // Render standard checklist
                  return (
                    <div 
                      key={sec.id} 
                      className="border-2 border-black p-4 bg-white flex flex-col justify-start"
                    >
                      <div className="flex items-center border-b border-black pb-2 mb-3">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateSectionTitle(secIdx, e.target.value)}
                          className="font-mono text-xs md:text-sm md:text-xs md:text-sm font-black uppercase text-[#111111] bg-transparent border-none outline-none focus:bg-black/5 w-full tracking-wider"
                        />
                      </div>
                      <div className="space-y-3 flex-1">
                        {sec.items.map((item, itemIdx) => {
                          const isBlank = exportMode === 'blank';
                          return (
                            <div key={itemIdx} className="flex gap-2.5 items-center">
                              <input 
                                type="checkbox" 
                                defaultChecked={isBlank ? false : item.checked}
                                onChange={(e) => {
                                  setSheet(prev => {
                                    const updated = { ...prev };
                                    updated.sections[secIdx].items[itemIdx].checked = e.target.checked;
                                    return updated;
                                  });
                                }}
                                className="fillable-checkbox w-4 h-4 md:w-4.5 md:h-4.5 border-2 border-black rounded-none cursor-pointer accent-[#111] shrink-0" 
                              />
                              <input
                                type="text"
                                value={isBlank ? "" : item.text}
                                placeholder={isBlank ? "Type item goal here..." : ""}
                                onChange={(e) => handleUpdateChecklistItemText(secIdx, itemIdx, e.target.value)}
                                className="fillable-input flex-1 bg-transparent border-none text-xs md:text-sm md:text-[12px] font-medium leading-tight text-[#222222] focus:bg-black/5 outline-none py-0.5"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Branded printable footer watermark */}
            {sheet.watermark && (
              <div className="border-t-2 border-black pt-4 flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm md:text-xs md:text-sm font-mono uppercase tracking-wider text-[#333333] select-none gap-2 mt-6">
                <span>© {new Date().getFullYear()} neurodivers3.co.uk</span>
                <span 
                  className={`px-2 py-0.5 border border-black ${
                    sheet.theme === 'void' ? 'bg-[#FF2E88] text-white' : ''
                  } ${
                    sheet.theme === 'warm-charcoal' ? 'bg-[#2E62FF] text-white' : ''
                  } ${
                    sheet.theme === 'incubation' ? 'bg-[#4A6B53] text-white' : ''
                  }`}
                >
                  SYSTEM CODE: ND3-P-{sheet.id.toUpperCase()} · BUILT FOR BRAINS
                </span>
                <span>DESIGNS FOR AN UNMASKED LIFE</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
