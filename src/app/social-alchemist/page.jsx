"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  Copy, 
  Check, 
  ArrowLeft, 
  Settings, 
  Trash2, 
  Plus, 
  Download, 
  RefreshCw,
  Key,
  BookOpen,
  Volume2
} from 'lucide-react';
import { client } from '../../lib/strapi';

// Dynamic brand SVG Platform Icons
const XIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const TiktokIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.74-2.07 6.97-5.46 8.22-3.39 1.25-7.39.4-9.87-2.12-2.48-2.52-3.13-6.52-1.61-9.76 1.52-3.24 5.05-5.18 8.62-4.77v4.07c-2-.31-4.04.57-5.01 2.37-.97 1.8-.6 4.09.91 5.46 1.52 1.37 3.86 1.34 5.35-.07.97-.96 1.44-2.34 1.37-3.7V0h.03z"/>
  </svg>
);

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 16, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function SocialAlchemist() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState("");
  
  const [sourceText, setSourceText] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");

  const [platform, setPlatform] = useState("x"); // x, youtube, tiktok, instagram, facebook
  const [tone, setTone] = useState("advocate"); // advocate, brutalist, sensory, analytical
  const [framework, setFramework] = useState("pas"); // pas, aida, hso, cheatsheet

  // Generated results
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [outputTextBlocks, setOutputTextBlocks] = useState([]); // Array of strings (X slides, YouTube script blocks, Facebook paragraphs, etc.)
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Settings for direct APIs
  const [showSettings, setShowSettings] = useState(false);
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [apiPreference, setApiPreference] = useState("local"); // local, gemini, openai

  // Load API keys & posts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOpenaiKey(localStorage.getItem("nd3_alchemist_openai_key") || "");
      setGeminiKey(localStorage.getItem("nd3_alchemist_gemini_key") || "");
      setApiPreference(localStorage.getItem("nd3_alchemist_pref") || "local");
    }

    client.fetch(`*[_type == "post"] | order(date desc){ _id, title, excerpt, "bodyText": body[].children[].text }`)
      .then(data => {
        setBlogPosts(data || []);
        setLoadingPosts(false);
      })
      .catch(err => {
        console.error("Failed to query posts from Sanity: ", err);
        setLoadingPosts(false);
      });
  }, []);

  // Handle Sanity post select
  const handleSelectPost = (postId) => {
    setSelectedPostId(postId);
    if (!postId) {
      setSourceTitle("");
      setSourceText("");
      return;
    }
    const post = blogPosts.find(p => p._id === postId);
    if (post) {
      setSourceTitle(post.title || "");
      // Re-compile body children texts to flat string
      const flatText = Array.isArray(post.bodyText) 
        ? post.bodyText.filter(Boolean).join("\n\n") 
        : post.excerpt || "";
      setSourceText(flatText);
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    localStorage.setItem("nd3_alchemist_openai_key", openaiKey);
    localStorage.setItem("nd3_alchemist_gemini_key", geminiKey);
    localStorage.setItem("nd3_alchemist_pref", apiPreference);
    setShowSettings(false);
  };

  // Local Copywriting Engine Heuristics
  const generateLocalHeuristics = () => {
    const title = sourceTitle || "Neurodivergent Systems & Space";
    const body = sourceText || "Paste your blog text to begin transmuting it into high-impact social structures.";
    
    // Quick extract key sentences or lists
    const sentences = body
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 15);
    
    const keyTakeaways = sentences.slice(1, 5);
    const primaryConcept = sentences[0] || "Neurodivergent focus and sensory design systems.";

    // Framework Cues
    let frameworkHeadline = "";
    let agitationStatement = "";
    let solutionOverview = "";
    let ctaPrompt = `Read the full, detailed neurodiuvers3 blog post: "${title}" to integrate these sensory systems immediately.`;

    if (tone === "advocate") {
      frameworkHeadline = `🧠 Executive overwhelm isn't a willpower issue. It's a sensory loading failure.`;
      agitationStatement = `We expect neurodivergent brains to navigate high-luminance, chaotic digital environments using tools designed for neurotypical cognitive loads. This builds cortisol debt.`;
      solutionOverview = `Instead of forcing your focus nodes to conform, build tactile physical environments.`;
    } else if (tone === "brutalist") {
      frameworkHeadline = `🛑 STOP OVER-COMPLICATING ADHD FOCUS.`;
      agitationStatement = `Your planning apps are designed to harvest attention, not support execution. They introduce visual noise and cognitive friction.`;
      solutionOverview = `Strip the noise. Switch to high-contrast, physical, low-dopamine tracking canvas templates immediately.`;
    } else if (tone === "sensory") {
      frameworkHeadline = `🌿 A quiet sanctuary for your hyperactive nervous system.`;
      agitationStatement = `Feel the hum of office lighting? The spike of screen spikes? It’s not in your head. Your auditory and visual sensory receptors are processing massive spikes.`;
      solutionOverview = `Soften the glare. Use Brownian hums, fractal grain masks, and structured sensory menu resets.`;
    } else { // analytical
      frameworkHeadline = `📊 The neurobiology of attention and spatial processing.`;
      agitationStatement = `Studies demonstrate that cognitive load increases exponentially when spatial memory cues (like tactile checklists) are replaced with nested digital applications.`;
      solutionOverview = `Data validates that physical, high-contrast tracking interfaces lower cortisol response by 24%.`;
    }

    if (platform === "x") {
      // Thread representation
      return [
        `1/ HOOK: ${frameworkHeadline}\n\nHere is a simple, neurodivergent-grounded system to bypass executive blockages and protect your sensory batteries. A short thread 🧵👇`,
        `2/ THE PROBLEM (PAS):\n${agitationStatement}\n\nNested menus and notifications add cognitive drag.`,
        `3/ THE REMEDY:\n${solutionOverview}\n\nStart by isolating tasks into physical visual queues.`,
        `4/ ACTIONS:\n• Step 1: Implement low-stimulus workspaces.\n• Step 2: Use low-frequency auditory drones (140Hz).\n• Step 3: Roll for sensory menus when loops occur.`,
        `5/ TRANSITION:\nThis isn't a quick fix; it's structural accommodation. Respect your neurology.\n\nRead the full detailed post "${title}" at neurodivers3.co.uk 👇\n\n#ADHD #Neurodivergent #Sensory`
      ];
    } else if (platform === "youtube") {
      return [
        `🎥 Suggested Video Titles:\n1. Why Digital Planners Ruin ADHD Focus (And The Sensory Fix)\n2. Bypassing Executive Dysfunction: A Neurodivergent System\n3. Inside My Low-Stimulus Focus Environment`,
        `🎬 Episode Storyboard & Script Outline (PAS):\n\n[0:00 - 0:30] Hook:\nVisual: High-contrast close up of screen switching to physical paper.\nAudio: "${frameworkHeadline} Let's talk about why you're burnt out."\n\n[0:30 - 2:00] Agitation:\nVisual: Bulleted text highlights showing visual noise indicators.\nAudio: "${agitationStatement}"\n\n[2:00 - 5:00] Solution:\nVisual: Walking through the custom planner layout.\nAudio: "${solutionOverview}"`,
        `📝 SEO Video Description:\n\nIf you have ADHD or autism, traditional productivity frameworks feel like a trap. In this video, we break down the neurological grounding of sensory focus environments and outline physical, low-stimulus templates that ease executive friction.\n\nTimestamps:\n0:00 The ADHD Productivity Trap\n1:15 Cortisol Loading & Sensory Spikes\n3:10 Building a Visual Sanctuary\n4:45 Tactile Workflows Demo\n\nLink to full guide: neurodivers3.co.uk/blog/${title.toLowerCase().replace(/\s+/g, '-')}`
      ];
    } else if (platform === "tiktok") {
      return [
        `🎭 TikTok / Reels Concept: "Why traditional planners break your ADHD brain"\n🎬 Est Duration: 45 seconds`,
        `[VISUAL SCENE] Ripped paper with bold marker text: "TRADITIONAL PLANNERS ARE LIARS".\n[AUDIO / VOICEOVER] "Ever buy a gorgeous digital planner only to abandon it in three days? It's not because you're lazy. It's because nested digital menus cause cognitive overwhelm."`,
        `[VISUAL SCENE] Soft ambient shot of Acoustic focus drone playing on a retro smartphone.\n[AUDIO / VOICEOVER] "Your ND brain needs immediate spatial memory anchors. Here's what you do: switch to physical, low-stimulus single-page trackers. Toned to sage or void black."`,
        `[VISUAL SCENE] Quick aesthetic close up of checking off a box.\n[AUDIO / VOICEOVER] "Pair this with a low-frequency 140Hz hum to mask ambient sounds. Ready to unmask your productivity? Link in bio to read the full breakdown."`
      ];
    } else if (platform === "instagram") {
      return [
        `📸 Instagram Post Copy:\n\n🧠 ${frameworkHeadline}\n\n.\n.\nTraditional planners fail neurodivergent brains because they assume typical executive capacity. When you're in burnout, a complex digital ecosystem just adds cortisol load.\n\nWe need visual, low-stimulus anchors. Things that exist in physical space, not behind two folders and a password check.\n\n👉 Swiping this post shows three spatial micro-habits you can implement today:\n\n1️⃣ Use physical paper for high-friction tasks.\n2️⃣ Activate a Brownian drone (140Hz) to shield your auditory nodes.\n3️⃣ Build micro-sensory menus for rapid cognitive reset.\n\n🧠 What is your primary sensory overload trigger? Let's discuss in the comments.\n\n🔗 Click the link in our bio to read the full guide: "${title}".\n\n---\n#ADHD #AutismAdvocate #NeurodivergentLifestyle #SensoryOverload #SensoryShield #ExecutiveDysfunction #Unmasking #ADHDGuide`
      ];
    } else { // facebook
      return [
        `👥 Facebook Community Post:\n\nHey everyone. I wanted to share some thoughts on why so many ND folk struggle with traditional "productivity" systems, and why we need structural accommodation instead of more discipline.\n\n${frameworkHeadline}\n\n${agitationStatement}\n\nWhen we plan in a nested digital workspace, our brain experiences continuous sensory micro-spikes. We are fighting visual noise, notifications, and luminance spikes just to write down our checklist. It's highly inefficient and exhausting.\n\nLately, I’ve shifted entirely to physical, low-stimulus templates designed specifically for neurodivergent sensory profiles (using sage/sage green or low-stress charcoal, and monospace fonts for structural clarity).\n\nIf you want to read the science behind why physical visual anchors lower cortisol loading, I wrote a detailed breakdown on the blog:\n👉 neurodivers3.co.uk/blog/${title.toLowerCase().replace(/\s+/g, '-')}\n\nHave you tried physical layouts? Do they work better than digital apps for your focus, or do you prefer a hybrid structure? Let's chat in the comments! 👇`
      ];
    }
  };

  // Perform Alchemical Transmutation
  const handleTransmute = async () => {
    setIsTransmuting(true);
    setCopiedIndex(null);
    setCopiedAll(false);

    // Simulate alchemical delay for tactile feedback
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (apiPreference === "local" || (!openaiKey && !geminiKey)) {
      // Run local copywriting heuristics
      const localResult = generateLocalHeuristics();
      setOutputTextBlocks(localResult);
      setIsTransmuting(false);
      return;
    }

    const title = sourceTitle || "Neurodivergent Focus Systems";
    const body = sourceText || "ADHD and autistic focus setups.";
    const userPrompt = `
      You are an expert neurodivergent copywriter and editor for the lifestyle blog "neurodivers3".
      Transmute the following blog post article into social media content.
      
      BLOG POST TITLE: "${title}"
      BLOG POST BODY:
      "${body}"

      PLATFORM TARGET: ${platform.toUpperCase()}
      TONE STYLE: ${tone.toUpperCase()} (advocate = neurodivergent advocate, brutalist = bold and direct, sensory = calming and soothing, analytical = scientific and evidence-based)
      COPYWRITING FRAMEWORK: ${framework.toUpperCase()} (pas = Problem-Agitate-Solve, aida = Attention-Interest-Action, hso = Hook-Story-Offer, cheatsheet = actionable summary)

      OUTPUT INSTRUCTIONS:
      Format the output as a clean JSON array of strings, where each string represents a logical post, slide, video chapter, or column script step. Do not include any markdown fences like \`\`\`json outside the raw output.
      For X Thread, return 4-6 sequential thread posts under 280 chars each.
      For YouTube, return 3 blocks: [1] suggested titles, [2] video script/storyboard, [3] SEO description.
      For TikTok, return 3-4 blocks of script storyboard mapping visual scenes to voiceover transcripts.
      For Instagram, return a detailed caption with paragraphs, emoji hook, and hashtags.
      For Facebook, return an engaging long-form community essay with clean line breaks.
    `;

    try {
      if (apiPreference === "gemini" && geminiKey) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userPrompt }] }]
            })
          }
        );
        const resData = await response.json();
        const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        // Parse JSON array
        try {
          const parsed = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
          if (Array.isArray(parsed)) {
            setOutputTextBlocks(parsed);
          } else {
            setOutputTextBlocks([text]);
          }
        } catch {
          // Fallback splits if not perfect JSON
          setOutputTextBlocks(text.split(/\n\n---\n\n/));
        }
      } else if (apiPreference === "openai" && openaiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a professional alchemical copywriter specialized in neurodivergent lifestyles. Return ONLY a valid JSON array of strings." },
              { role: "user", content: userPrompt }
            ]
          })
        });
        const resData = await response.json();
        const text = resData?.choices?.[0]?.message?.content || "";
        
        try {
          const parsed = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
          if (Array.isArray(parsed)) {
            setOutputTextBlocks(parsed);
          } else {
            setOutputTextBlocks([text]);
          }
        } catch {
          setOutputTextBlocks(text.split(/\n\n---\n\n/));
        }
      }
    } catch (err) {
      console.error("AI Generation failed, falling back to local formulas: ", err);
      setOutputTextBlocks(generateLocalHeuristics());
    } finally {
      setIsTransmuting(false);
    }
  };

  // Handle slide edit
  const handleEditBlock = (index, value) => {
    setOutputTextBlocks(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Add block
  const handleAddBlock = () => {
    setOutputTextBlocks(prev => [...prev, "New transmuted snippet block. Edit this in-place..."]);
  };

  // Remove block
  const handleRemoveBlock = (index) => {
    setOutputTextBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // Copy individual block
  const handleCopyBlock = (index, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Copy all blocks
  const handleCopyAll = () => {
    const divider = platform === "x" ? "\n\n---\n\n" : "\n\n";
    navigator.clipboard.writeText(outputTextBlocks.join(divider));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download raw TXT file
  const handleDownloadTxt = () => {
    const divider = platform === "x" ? "\n\n---\n\n" : "\n\n";
    const blob = new Blob([outputTextBlocks.join(divider)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transmuted_${platform}_${tone}_alchemist.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-24 px-4 md:px-12 lg:px-24 bg-bg-primary text-fg-primary w-full max-w-7xl mx-auto flex flex-col justify-start text-left">
      
      {/* Top Admin Header Banner */}
      <div className="mb-12 border-b-4 border-fg-primary pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full mt-4">
        <div>
          <div className="inline-flex items-center gap-2 text-text-muted uppercase font-black text-[10px] tracking-widest mb-4 font-mono select-none">
            EST. 2026 · STANDALONE ALCHEMIST ENGINE
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-fg-primary leading-none font-display">
            SOCIAL ALCHEMIST<span className="text-accent-pink inline-block ml-0.5">.</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base font-normal mt-4 max-w-2xl leading-relaxed">
            Transmute raw blog essays, outlines, and notes into highly engaging, scroll-stopping copy tailored for YouTube, TikTok, X, Instagram, and Facebook.
          </p>
        </div>

        {/* API Credentials Trigger */}
        <button 
          onClick={() => setShowSettings(true)}
          className="px-4 py-2.5 border border-[var(--rule)] hover:border-accent-pink hover:text-white bg-[#0a0a0f] text-[var(--muted)] font-black uppercase text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer select-none rounded-none shrink-0"
        >
          <Settings size={14} /> AI CONFIG
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Column: Source Input & Platform Controls (cols-5) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
          
          {/* Post Select Box */}
          <div className="border border-[var(--rule)] bg-bg-primary/40 p-6 flex flex-col gap-4 shadow-[4px_4px_0px_var(--rule)]">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--rule)]/60 pb-3">
              <BookOpen size={12} className="text-accent-pink" /> 1. CHOOSE SOURCE CONTENT
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">IMPORT LIVE BLOG POST</label>
              {loadingPosts ? (
                <div className="h-10 w-full border border-dashed border-[var(--rule)] bg-black/20 animate-pulse" />
              ) : (
                <select 
                  value={selectedPostId} 
                  onChange={(e) => handleSelectPost(e.target.value)}
                  className="w-full bg-black border border-[var(--rule)] text-white px-3 py-2 text-xs font-mono outline-none cursor-pointer focus:border-accent-pink rounded-none"
                >
                  <option value="">-- PASTE RAW DRAFT TEXT INSTEAD --</option>
                  {blogPosts.map(post => (
                    <option key={post._id} value={post._id}>
                      {post.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">RAW WORKSPACE CONTENT</label>
              <input 
                type="text"
                placeholder="Topic Title (Optional)"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                className="w-full bg-black border border-[var(--rule)] text-white px-3 py-2 text-xs font-mono outline-none focus:border-accent-pink rounded-none placeholder-[var(--muted)]/50"
              />
              <textarea
                placeholder="Paste blog content, raw script outlines, or thought structures here..."
                rows={12}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full bg-black border border-[var(--rule)] text-white px-3 py-3 text-xs font-sans leading-relaxed outline-none focus:border-accent-pink rounded-none resize-y placeholder-[var(--muted)]/50"
              />
              <div className="text-[10px] font-mono text-[var(--muted)] text-right">
                {sourceText.length} characters
              </div>
            </div>
          </div>

          {/* Social Platform & Framework Selection */}
          <div className="border border-[var(--rule)] bg-bg-primary/40 p-6 flex flex-col gap-6 shadow-[4px_4px_0px_var(--rule)]">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--rule)]/60 pb-3">
              <Cpu size={12} className="text-accent-pink" /> 2. SOCIAL TARGET PRESETS
            </div>

            {/* Target Social Platform Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">SELECT TARGET CHANNELS</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon size={12} /> },
                  { id: 'tiktok', label: 'TikTok', icon: <TiktokIcon size={12} /> },
                  { id: 'x', label: 'X', icon: <XIcon size={12} /> },
                  { id: 'instagram', label: 'Instagram', icon: <InstagramIcon size={12} /> },
                  { id: 'facebook', label: 'Facebook', icon: <FacebookIcon size={12} /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPlatform(item.id)}
                    className={`flex flex-col items-center justify-center py-2.5 border text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer rounded-none gap-1.5 ${
                      platform === item.id 
                        ? 'bg-white text-black border-white shadow-[2px_2px_0px_var(--accent-pink)]' 
                        : 'bg-transparent text-[var(--muted)] border-[var(--rule)] hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advocate Tones */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">ADVOCACY WRITING TONE</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'advocate', label: '🧠 Autistic Advocate' },
                  { id: 'brutalist', label: '🛑 Brutalist Direct' },
                  { id: 'sensory', label: '🌿 Soft & Sensory' },
                  { id: 'analytical', label: '📊 Analytical Scientific' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTone(item.id)}
                    className={`py-2 border text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer rounded-none text-center ${
                      tone === item.id 
                        ? 'bg-accent-pink text-white border-accent-pink shadow-[2px_2px_0px_white]' 
                        : 'bg-transparent text-[var(--muted)] border-[var(--rule)] hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Copywriting Frameworks */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">COPYWRITING FRAMEWORK</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pas', label: 'Problem-Agitate-Solve' },
                  { id: 'aida', label: 'Attention-Interest-Action' },
                  { id: 'hso', label: 'Hook-Story-Offer' },
                  { id: 'cheatsheet', label: 'Actionable Cheat-Sheet' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFramework(item.id)}
                    className={`py-2 border text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer rounded-none text-center ${
                      framework === item.id 
                        ? 'bg-accent-pink text-white border-accent-pink shadow-[2px_2px_0px_white]' 
                        : 'bg-transparent text-[var(--muted)] border-[var(--rule)] hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleTransmute}
              disabled={isTransmuting || !sourceText}
              className="w-full py-4 bg-white text-black border border-white hover:bg-transparent hover:text-white font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none rounded-none shadow-[4px_4px_0px_var(--accent-pink)] active:scale-[0.98]"
            >
              {isTransmuting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> ALCHEMICAL TRANSMUTATION...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> TRANSMUTE TO SOCIAL COPY
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Platform Visual Workspace Editor (cols-7) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <div className="border border-[var(--rule)] bg-bg-primary/20 p-6 flex flex-col gap-6 shadow-[6px_6px_0px_var(--rule)] w-full text-left">
            <div className="flex items-center justify-between border-b border-[var(--rule)]/60 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted)]">
                TRANSMUTED PREVIEW CANVAS
              </span>

              {outputTextBlocks.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyAll}
                    className="px-2.5 py-1 border border-[var(--rule)] hover:border-accent-pink hover:text-white bg-transparent text-[9px] font-mono text-[var(--muted)] font-black uppercase cursor-pointer"
                  >
                    {copiedAll ? <Check size={10} className="inline mr-1 text-green-400" /> : null}
                    {copiedAll ? 'COPIED ALL' : 'COPY COMPILATION'}
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="px-2.5 py-1 border border-[var(--rule)] hover:border-accent-pink hover:text-white bg-transparent text-[9px] font-mono text-[var(--muted)] font-black uppercase cursor-pointer flex items-center gap-1"
                  >
                    <Download size={10} /> DOWNLOAD TXT
                  </button>
                </div>
              )}
            </div>

            {isTransmuting ? (
              <div className="h-[480px] border border-dashed border-[var(--rule)]/60 bg-black/25 flex flex-col items-center justify-center gap-4 text-[var(--muted)] uppercase tracking-wider font-mono text-xs select-none">
                <div className="w-12 h-12 border-4 border-t-accent-pink border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full" />
                <span>Transmuting Cognitive Outlines...</span>
              </div>
            ) : outputTextBlocks.length === 0 ? (
              <div className="h-[480px] border border-dashed border-[var(--rule)]/60 bg-black/25 flex flex-col items-center justify-center gap-2 text-[var(--muted)] uppercase tracking-wider font-mono text-xs text-center px-8 select-none leading-relaxed">
                <Sparkles size={24} className="text-[var(--rule)] animate-pulse" />
                <span>Alchemist Canvas Empty</span>
                <p className="text-[10px] lowercase normal-case text-text-muted mt-2 max-w-sm">
                  Select a live blog article or type your thoughts in the workspace, set your presets, and click Transmute to generate editorial-grade mockups.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Smartphone Twitter Simulator */}
                {platform === "x" && (
                  <div className="w-full max-w-md mx-auto bg-black border-[3px] border-[var(--rule)] rounded-[24px] p-5 shadow-2xl relative select-text">
                    <div className="w-24 h-4 bg-[var(--rule)] rounded-full mx-auto mb-6 relative -top-2" />
                    
                    <div className="space-y-5">
                      {outputTextBlocks.map((block, idx) => (
                        <div key={idx} className="flex gap-3 text-left relative border-b border-[var(--rule)]/30 pb-4 last:border-b-0 last:pb-0">
                          {/* Avatar Circle */}
                          <div className="w-8 h-8 bg-accent-pink text-white font-mono font-black flex items-center justify-center text-[10px] rounded-full select-none uppercase shrink-0">
                            ND3
                          </div>

                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center gap-1.5 select-none">
                              <span className="text-[11px] font-black uppercase text-white hover:underline cursor-pointer">neurodivers³</span>
                              <span className="text-[9px] font-mono text-[var(--muted)] font-bold">@neurodivers3</span>
                            </div>

                            <textarea
                              value={block}
                              onChange={(e) => handleEditBlock(idx, e.target.value)}
                              rows={4}
                              className="w-full bg-transparent border-none text-xs text-[#E7E9EA] p-0 outline-none resize-none font-sans leading-relaxed focus:ring-0"
                            />

                            <div className="flex items-center justify-between text-[9px] font-mono select-none">
                              <span className={`font-bold ${block.length > 280 ? 'text-red-500 font-black' : 'text-[var(--muted)]'}`}>
                                {block.length} / 280 chars
                              </span>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCopyBlock(idx, block)}
                                  className="text-[var(--muted)] hover:text-accent-pink transition-colors font-bold uppercase cursor-pointer"
                                >
                                  {copiedIndex === idx ? 'COPIED' : 'COPY'}
                                </button>
                                <button
                                  onClick={() => handleRemoveBlock(idx)}
                                  className="text-[var(--muted)] hover:text-red-400 transition-colors font-bold uppercase cursor-pointer"
                                >
                                  REMOVE
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TikTok Storyboard Dual-Column editor */}
                {platform === "tiktok" && (
                  <div className="space-y-4">
                    {outputTextBlocks.map((block, idx) => {
                      const lines = block.split('\n');
                      const visualPart = lines.find(l => l.startsWith('[VISUAL')) || '[VISUAL SCENE] Outline...';
                      const audioPart = lines.find(l => l.startsWith('[AUDIO') || l.startsWith('[VOICEOVER')) || '[VOICEOVER] Verbal dialogue...';
                      const otherPart = lines.filter(l => !l.startsWith('[VISUAL') && !l.startsWith('[AUDIO') && !l.startsWith('[VOICEOVER')).join('\n');
                      
                      return (
                        <div key={idx} className="border border-[var(--rule)] bg-black/40 p-4 flex flex-col gap-3 relative hover:border-accent-pink/40 transition-colors">
                          <div className="flex justify-between items-center select-none border-b border-[var(--rule)]/60 pb-2">
                            <span className="text-[9px] font-mono text-accent-pink font-black uppercase">STEP 0{idx + 1} SCRIPT BLOCK</span>
                            <div className="flex gap-2 text-[9px] font-mono">
                              <button
                                onClick={() => handleCopyBlock(idx, block)}
                                className="text-[var(--muted)] hover:text-white cursor-pointer"
                              >
                                {copiedIndex === idx ? 'COPIED' : 'COPY BLOCK'}
                              </button>
                              <button
                                onClick={() => handleRemoveBlock(idx)}
                                className="text-[var(--muted)] hover:text-red-400 cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Visual cue card */}
                            <div className="flex flex-col gap-1.5 text-left">
                              <span className="text-[9px] font-mono text-[var(--muted)] font-black uppercase">🎬 STORYBOARD / VISUAL FRAME</span>
                              <textarea
                                value={visualPart}
                                onChange={(e) => {
                                  const updatedBlock = `${e.target.value}\n${audioPart}${otherPart ? '\n' + otherPart : ''}`;
                                  handleEditBlock(idx, updatedBlock);
                                }}
                                rows={3}
                                className="w-full bg-black border border-[var(--rule)] text-xs text-[var(--muted)] px-3 py-2 outline-none font-mono focus:border-accent-pink resize-none"
                              />
                            </div>

                            {/* Audio dialogue card */}
                            <div className="flex flex-col gap-1.5 text-left">
                              <span className="text-[9px] font-mono text-[var(--muted)] font-black uppercase">🗣️ VERBAL VOICE-OVER / SPEECH</span>
                              <textarea
                                value={audioPart}
                                onChange={(e) => {
                                  const updatedBlock = `${visualPart}\n${e.target.value}${otherPart ? '\n' + otherPart : ''}`;
                                  handleEditBlock(idx, updatedBlock);
                                }}
                                rows={3}
                                className="w-full bg-[#0a0a0f] border border-[var(--rule)] text-xs text-white px-3 py-2 outline-none font-sans leading-relaxed focus:border-accent-pink resize-none"
                              />
                            </div>
                          </div>

                          {otherPart && (
                            <textarea
                              value={otherPart}
                              onChange={(e) => {
                                const updatedBlock = `${visualPart}\n${audioPart}\n${e.target.value}`;
                                handleEditBlock(idx, updatedBlock);
                              }}
                              className="w-full bg-transparent border-none text-[10px] font-mono text-[var(--muted)] outline-none resize-none p-0"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* YouTube Storyboard & Chapters Card */}
                {platform === "youtube" && (
                  <div className="space-y-6">
                    {outputTextBlocks.map((block, idx) => {
                      const isTitle = block.startsWith("🎥") || idx === 0;
                      const isScript = block.startsWith("🎬") || idx === 1;
                      const isDesc = block.startsWith("📝") || idx === 2;

                      return (
                        <div key={idx} className="border border-[var(--rule)] bg-black/40 p-5 flex flex-col gap-3 relative">
                          <div className="flex justify-between items-center select-none border-b border-[var(--rule)]/60 pb-2">
                            <span className="text-[9px] font-mono text-accent-pink font-black uppercase">
                              {isTitle ? "TITLE RECOMMENDATIONS" : isScript ? "SCRIPT STORYBOARD OUTLINE" : "SEO VIDEO DESCRIPTION"}
                            </span>
                            <div className="flex gap-2 text-[9px] font-mono">
                              <button
                                onClick={() => handleCopyBlock(idx, block)}
                                className="text-[var(--muted)] hover:text-white cursor-pointer"
                              >
                                {copiedIndex === idx ? 'COPIED' : 'COPY'}
                              </button>
                              <button
                                onClick={() => handleRemoveBlock(idx)}
                                className="text-[var(--muted)] hover:text-red-400 cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>

                          <textarea
                            value={block}
                            onChange={(e) => handleEditBlock(idx, e.target.value)}
                            rows={isTitle ? 4 : isScript ? 10 : 8}
                            className={`w-full bg-transparent border-none p-0 outline-none text-xs leading-relaxed resize-none focus:ring-0 ${
                              isTitle ? 'font-mono text-[var(--muted)]' : 'font-sans text-white'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Instagram Scroll Caption layout */}
                {platform === "instagram" && (
                  <div className="space-y-4">
                    {outputTextBlocks.map((block, idx) => (
                      <div key={idx} className="border border-[var(--rule)] bg-black/40 p-5 flex flex-col gap-3 relative">
                        <div className="flex justify-between items-center select-none border-b border-[var(--rule)]/60 pb-2">
                          <span className="text-[9px] font-mono text-accent-pink font-black uppercase">INSTAGRAM CAPTION CARD</span>
                          <div className="flex gap-2 text-[9px] font-mono">
                            <button
                              onClick={() => handleCopyBlock(idx, block)}
                              className="text-[var(--muted)] hover:text-white cursor-pointer"
                            >
                              {copiedIndex === idx ? 'COPIED' : 'COPY'}
                            </button>
                            <button
                              onClick={() => handleRemoveBlock(idx)}
                              className="text-[var(--muted)] hover:text-red-400 cursor-pointer"
                              >
                              REMOVE
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={block}
                          onChange={(e) => handleEditBlock(idx, e.target.value)}
                          rows={14}
                          className="w-full bg-transparent border-none text-xs text-white p-0 outline-none font-sans leading-relaxed focus:ring-0 resize-y"
                        />
                        
                        <div className="text-[9px] font-mono text-[var(--muted)] text-right select-none">
                          {block.length} characters
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Facebook Advocacy Community Essay */}
                {platform === "facebook" && (
                  <div className="space-y-4">
                    {outputTextBlocks.map((block, idx) => (
                      <div key={idx} className="border border-[var(--rule)] bg-black/40 p-5 flex flex-col gap-3 relative">
                        <div className="flex justify-between items-center select-none border-b border-[var(--rule)]/60 pb-2">
                          <span className="text-[9px] font-mono text-accent-pink font-black uppercase">FB COMMUNITY ADVOCACY ESSAY</span>
                          <div className="flex gap-2 text-[9px] font-mono">
                            <button
                              onClick={() => handleCopyBlock(idx, block)}
                              className="text-[var(--muted)] hover:text-white cursor-pointer"
                            >
                              {copiedIndex === idx ? 'COPIED' : 'COPY'}
                            </button>
                            <button
                              onClick={() => handleRemoveBlock(idx)}
                              className="text-[var(--muted)] hover:text-red-400 cursor-pointer"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={block}
                          onChange={(e) => handleEditBlock(idx, e.target.value)}
                          rows={14}
                          className="w-full bg-transparent border-none text-xs text-white p-0 outline-none font-sans leading-relaxed focus:ring-0 resize-y"
                        />

                        <div className="text-[9px] font-mono text-[var(--muted)] text-right select-none">
                          {block.length} characters
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add dynamic new block button */}
                <button
                  onClick={handleAddBlock}
                  className="w-full py-3 bg-transparent text-[var(--muted)] border border-dashed border-[var(--rule)] hover:border-accent-pink hover:text-white transition-all text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer select-none rounded-none mt-4"
                >
                  <Plus size={12} /> ADD SLIDE / PARAGRAPH BLOCK
                </button>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* AI Key Configuration settings Drawer/Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#0a0a0f] border-4 border-fg-primary p-6 relative z-10 shadow-[8px_8px_0px_var(--accent-pink)] text-left"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent-pink border-b border-[var(--rule)] pb-3 mb-6">
                <Key size={14} /> AI ENGINE CREDENTIALS CONFIG
              </div>

              <p className="text-[11px] text-[var(--muted)] leading-relaxed mb-6 font-sans">
                💡 Credentials are stored strictly inside your browser's secure <strong>localStorage</strong>. They are called directly from your client machine to the API endpoints and are never transmitted to any third-party backend servers.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">AI ENGINE PREFERENCE</label>
                  <select
                    value={apiPreference}
                    onChange={(e) => setApiPreference(e.target.value)}
                    className="w-full bg-black border border-[var(--rule)] text-white px-3 py-2 text-xs font-mono outline-none cursor-pointer focus:border-accent-pink rounded-none"
                  >
                    <option value="local">LOCAL COPYWRITING ENGINE (NO KEYS REQUIRED)</option>
                    <option value="gemini">GEMINI API ENGINE (CLIENT-SIDE)</option>
                    <option value="openai">OPENAI API ENGINE (CLIENT-SIDE)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">GEMINI API KEY</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-black border border-[var(--rule)] text-white px-3 py-2 text-xs font-mono outline-none focus:border-accent-pink rounded-none placeholder-[var(--muted)]/35"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold font-mono text-[var(--muted)] uppercase">OPENAI API KEY</label>
                  <input
                    type="password"
                    placeholder="sk-proj-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full bg-black border border-[var(--rule)] text-white px-3 py-2 text-xs font-mono outline-none focus:border-accent-pink rounded-none placeholder-[var(--muted)]/35"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 py-3 bg-white text-black border border-white hover:bg-transparent hover:text-white font-black uppercase text-xs tracking-wider transition-all cursor-pointer rounded-none text-center"
                >
                  SAVE & CLOSE
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-3 bg-transparent text-[var(--muted)] border border-[var(--rule)] hover:border-white hover:text-white font-black uppercase text-xs tracking-wider transition-all cursor-pointer rounded-none text-center"
                >
                  CANCEL
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
