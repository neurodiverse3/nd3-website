import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Clock, Keyboard, Shield, Smartphone, Eye, Maximize2, ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { getLabBySlug, getLabs } from '../../../lib/strapi';
import RichTextRenderer from '../../../components/RichTextRenderer';
import LabEmbedder from '../../../components/labs/LabEmbedder';
import DataPersistencePanel from '../../../components/labs/DataPersistencePanel';
import LabFullscreenWrapper from '../../../components/labs/LabFullscreenWrapper';
import KeyboardShortcutsOverlay from '../../../components/labs/KeyboardShortcutsOverlay';

export const revalidate = 86400; // Cache for 24 hours, revalidated on-demand

const renderFallbackDescription = (text) => {
  if (!text) return <p>This experimental lab provides alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.</p>;
  
  const blocks = text.split('\n\n');
  return blocks.map((block, bIdx) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={bIdx} className="text-lg font-black uppercase tracking-wider text-[var(--fg)] mt-8 mb-3 border-b border-[var(--rule)] pb-1.5 font-display select-none">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={bIdx} className="text-xl font-black uppercase tracking-wider text-[var(--fg)] mt-8 mb-4 font-display select-none">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={bIdx} className="text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-8 mb-4 font-display select-none">
          {trimmed.replace('# ', '')}
        </h1>
      );
    }
    if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
      const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
      const firstItem = items[0].replace(/^[-*]\s+/, '');
      const listItems = [firstItem, ...items.slice(1)];
      return (
        <ul key={bIdx} className="list-disc pl-5 space-y-2 text-[16px] text-[var(--muted)] my-4 leading-relaxed font-sans">
          {listItems.map((item, iIdx) => (
            <li key={iIdx}>{item}</li>
          ))}
        </ul>
      );
    }
    if (trimmed.includes('\n1. ') || trimmed.startsWith('1. ')) {
      const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean);
      const firstItem = items[0].replace(/^\d+\.\s+/, '');
      const listItems = [firstItem, ...items.slice(1)];
      return (
        <ol key={bIdx} className="list-decimal pl-5 space-y-2 text-[16px] text-[var(--muted)] my-4 leading-relaxed font-sans">
          {listItems.map((item, iIdx) => (
            <li key={iIdx}>{item}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={bIdx} className="text-[16px] leading-relaxed text-[var(--muted)] font-sans">
        {trimmed}
      </p>
    );
  });
};

const LAB_METADATA = {
  'acoustic-shield': {
    setupTime: '30 sec',
    complexity: 'DEEP DIVE',
    useCases: [
      'You\'re in a noisy open-plan office and can\'t focus',
      'Your coworker is loud-typing or talking nearby',
      'You need to read or write for 30+ minutes without auditory distraction',
      'You\'re transitioning between tasks and need a stable audio floor',
    ],
    shortcuts: { 'Space': 'Play/Pause', 'B': 'Toggle Binaural', 'T': 'Toggle Timer' },
  },
  'dopamine-snacks': {
    setupTime: '10 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'You\'re stuck scrolling and can\'t break the loop',
      'Your brain is in executive paralysis and needs a physical reset',
      'You\'ve been at your desk for 2+ hours without moving',
      'You feel restless but can\'t articulate why',
    ],
    shortcuts: { 'Space': 'Roll Snack', 'R': 'Reset' },
  },
  'visual-snow-shield': {
    setupTime: '15 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'Screen brightness is causing eye strain or headaches',
      'You\'re working late and need to reduce blue light exposure',
      'Visual snow or light sensitivity is making screens uncomfortable',
      'You want a consistent visual filter across all tabs',
    ],
    shortcuts: { 'Space': 'Toggle Shield', 'G': 'Toggle Grain', 'W': 'Toggle Wash' },
  },
  'brown-noise-loop': {
    setupTime: '5 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'You need a simple, no-fuss focus sound that just works',
      'You\'re studying or reading and need background audio masking',
      'You want a timer-based focus session with audio',
      'Late evening when your brain won\'t wind down',
    ],
    shortcuts: { 'Space': 'Play/Pause', 'T': 'Toggle Timer', 'V': 'Toggle Visuals' },
  },
  'decision-coin': {
    setupTime: '5 sec',
    complexity: 'QUICK HIT',
    useCases: [
      'Deciding between two restaurants and starving while you think',
      'Choosing which task to start when both feel equally impossible',
      'Deciding whether to go to a thing or stay in',
      'Any "either is fine, but I can\'t pick" loop',
    ],
    shortcuts: { 'Space': 'Flip Coin', 'R': 'Reset Labels' },
  },
  'spoon-tracker': {
    setupTime: '15 sec',
    complexity: 'DEEP DIVE',
    useCases: [
      'Mornings when you\'re not sure what kind of day this is going to be',
      'After a heavy day, to see what you spent energy on',
      'During recovery from burnout, rebuilding a sense of your capacity',
      'You keep overcommitting and crashing at 3pm',
    ],
    shortcuts: { 'Space': 'Add Task', 'R': 'Reset Day' },
  },
  'sensory-audit': {
    setupTime: '2 min',
    complexity: 'DEEP DIVE',
    useCases: [
      'You feel "off" but can\'t pinpoint what\'s wrong',
      'You\'re in a new environment and want to assess sensory load',
      'Before starting a long work session in an unfamiliar space',
      'You suspect sensory overload but aren\'t sure which domain is the culprit',
    ],
    shortcuts: { 'Enter': 'Select Rating', 'Backspace': 'Go Back', 'R': 'Restart Audit' },
  },
};

const fallbackLabs = {
  'acoustic-shield': {
    title: "Acoustic Shield",
    tag: "SYNTH",
    category: { title: "ACOUSTIC SHIELDS" },
    excerpt: "A layered ambient hum that sits underneath the noise around you. Includes an optional Binaural Focus Hum mode for deeper focus.",
    toolComponentKey: 'acoustic-shield',
    descriptionText: `### What it is

A single-button ambient sound generators. Layered brown noise, soft hum, and optional low-frequency binaural carrier tuned to help with focus and sensory overwhelm. No music, no rhythm, no variation · just a stable acoustic blanket you can leave running for hours.

### How to use

1. Open the page (or embed it inside a blog post).
2. Press Play.
3. Adjust volume to a level that feels "present" but not loud.
4. Optional: toggle Binaural Focus Hum if using headphones. Leave it off if you're on speakers or sharing the room.
5. Leave it running. It stops when you close the tab or press Stop.

### Why it helps

For neurodivergent brains, predictable sound can reduce the cognitive load of filtering out unpredictable environmental noise. Brown noise covers the frequency range of most office and household sounds. The binaural low-frequency carrier adds a gentle spatial cue that some people find anchoring during deep-focus work.

### Safety notes

- Headphones only for binaural mode. The binaural carrier uses a slight frequency offset between left and right channels. It won't work properly on speakers and may feel uncomfortable if you're not wearing headphones.
- Not for use while driving or operating machinery. This is a focus tool, not a background-music-for-tasks tool. If your task requires situational awareness, don't use headphones.
- Epilepsy caution. Binaural beats are not the same as strobe or flicker triggers, but if you have a history of sound- or vestibular-triggered seizures, skip the binaural toggle and use the standard brown noise layer only.
- Volume default is low. We set the starting volume to ~30% of system level. Your ears should never feel "pushed into." Adjust up slowly if needed.

### Technical notes

- Generated entirely in the browser via the Web Audio API. No audio files to stream, no server, no buffering, no dropped connections.
- No tracking. No analytics. No cookies. The page does not know you were here.
- Settings (volume, binaural on/off, last-used mode) are saved to localStorage only. No account. No cloud.
- Embeddable: the same component can drop into any blog post as an inline player.`
  },
  'dopamine-snacks': {
    title: "Dopamine Snacks",
    tag: "DOPAMINE",
    category: { title: "DOPAMINE RESETS" },
    excerpt: "Roll for a sensory reset. Simple physical tasks that interrupt digital loops.",
    toolComponentKey: 'dopamine-menu',
    descriptionText: "ADHD and AuDHD brains are prone to cognitive loops and execution paralysis. When dopamine levels drop, the temptation is to seek low-effort digital stimulation (social feeds, tab switching). 'Dopamine Snacks' are designed as rapid, physical, low-dopamine-barrier interventions. They provide physical, sensory changes that reset the autonomic nervous system and release nervous energy, making it easier to return to active work."
  },
  'visual-snow-shield': {
    title: "Visual Snow Shield",
    tag: "VISUAL",
    category: { title: "VISUAL & SPACE" },
    toolComponentKey: 'visual-snow-shield',
    descriptionText: `### What it is

A full-screen visual overlay that reduces the brightness, contrast, and visual noise of the page underneath. Designed for people who experience visual snow, light sensitivity, or sensory overload from bright screens. The standalone version works as a tab you keep open behind your work · or you can invoke it over the current tab via a browser extension hand-off.

### How to use

1. Open the page.
2. Click the Shield button to activate the overlay.
3. Use the Intensity slider to adjust how dark the wash is. Start at ~40% and nudge up or down.
4. Optional: toggle Reduced Motion to dampen any animations or auto-playing content on the underlying page.
5. Switch to your work tab. The shield tab sits behind it, toning down the overall screen brightness through the browser window.

### Why it helps

Visual snow and light sensitivity can make standard screen brightness feel aggressive, even at low device settings. This tool adds a controllable dark wash on top of everything, independent of OS brightness controls. For some users, reducing contrast and adding a subtle tint is more effective than simply dimming.

### Full-page vs extension

- Standalone page: Open the tool in its own tab. Keep it behind your work tab. The browser window itself becomes the "filter." Works on any device with a browser.
- Browser extension (future): A one-click button that applies the overlay directly to the current tab, without needing a second tab open. Hand-off from the standalone page.

### Safety notes

- Not a medical device. This is a comfort tool, not a treatment. If visual snow is new, severe, or worsening, see an optometrist or neurologist.
- Motion damping is passive. The reduced-motion toggle relies on the underlying site respecting prefers-reduced-motion. It cannot force-stop auto-playing video or GIFs on sites that ignore the preference.
- Extension hand-off is optional. The standalone page works without installing anything.

### Technical notes

- Pure CSS + JavaScript overlay. No WebGL, no canvas, no heavy rendering.
- No tracking. No analytics. No cookies.
- Intensity and reduced-motion preference saved to localStorage.
- Works on mobile browsers but is most effective on desktop where multi-tab windowing is easier.`
  },
  'brown-noise-loop': {
    title: "Brown Noise Loop",
    tag: "FOCUS",
    category: { title: "ACOUSTIC SHIELDS" },
    excerpt: "A single play button, a volume slider, a 60-minute timer. Brown noise generated client-side · no streaming, no buffering, no account.",
    toolComponentKey: 'brown-noise-loop',
    descriptionText: `### What it is

Brown noise is a steady, low-frequency hum · deeper and softer than white noise. For a lot of ADHD and autistic brains, it sits underneath the auditory chaos of a normal environment and gives the focus circuit something to lean on. It's not music. There's nothing to anticipate. That's the whole point.

### How to use

1. Hit play. Adjust the volume to a level that feels like a presence, not a sound.
2. Optionally toggle the 60-minute timer if you want it to stop on its own.
3. Put on headphones for the cleanest version, or use speakers if your environment allows.
4. Pair it with a single task. Leave it running. Close the tab when you're done.

### Why it helps

A constant, predictable audio signal reduces the auditory system's need to scan the environment for new inputs. For brains that are sensitive to background noise (or that struggle to ignore it), this can free up a meaningful amount of working memory. It is not a focus aid because it is interesting. It is a focus aid because it is uninteresting.

### Accessibility & safety

- Volume defaults to a low level (about 30%). Adjust upward only as needed.
- No autoplay. You always have to press play.
- No flashing visuals, no animation that ignores prefers-reduced-motion.
- Generated client-side in your browser using the Web Audio API. Nothing streams, nothing leaves your device.
- If you experience tinnitus that worsens with low-frequency sound, this tool may not be for you. Try the Acoustic Shield lab instead, which lets you blend higher frequencies in.

### When it helps

- Trying to read or write in a too-quiet room where every small sound becomes a distraction.
- Working in a too-loud room where the noise has too much information in it.
- That late-evening hour when the day has ended but the brain hasn't.
- Bridging a transition between two tasks when the gap is the thing making it hard to start.

### When it doesn't

- When you're tired and need rest, not focus aid. Noise can keep the brain pretending it's still working when it isn't.
- When you've got the volume up too high. Brown noise that's too loud stops being a floor and becomes the thing you're paying attention to.
- When the actual problem is sensory overload, not under-stimulation. In that case, do the Sensory Audit first.`
  },
  'decision-coin': {
    title: "Decision Coin",
    tag: "DECISIONS",
    category: { title: "DOPAMINE RESETS" },
    excerpt: "Tap to flip. Two custom labels. Useful for the decisions your brain refuses to make on its own. Not for the answer · for the feeling.",
    toolComponentKey: 'decision-coin',
    descriptionText: `### What it is

A coin with two labels you choose (e.g. *Rest* / *Push*, *Yes* / *No*, *Now* / *Later*). You tap it, it flips, it lands on one side. The point isn't to obey the coin. The point is to notice your reaction · the half-second of relief or disappointment that tells you which option you actually wanted.

### How to use

1. Pick the two options. Type them into the labels.
2. Tap the coin. Don't think.
3. The instant it lands, notice your gut reaction · a tiny *yes* or *oh no* before any reasoning kicks in.
4. Go with the option your gut wanted, regardless of which side the coin actually landed on.

The coin remembers your last labels via localStorage so you don't have to retype them next time.

### Why it helps

ADHD brains often have a working answer already but can't access it through deliberation. The coin removes deliberation. The micro-emotional response to the result is information your conscious mind couldn't reach by thinking harder. This is the technique I use most often when I'm stuck between two reasonable options and the thinking has stopped helping.

### Accessibility & safety

- Fully keyboard-accessible. Tap with mouse, tap, or press Space.
- Animation respects prefers-reduced-motion · a static reveal replaces the flip if you've opted out.
- Labels saved to your browser's localStorage. Nothing leaves your device. Clearing browser storage clears the labels.
- Not for high-stakes decisions. If the cost of being wrong is large, use a different tool.

### When to use it

- Deciding between two restaurants and starving while you think.
- Deciding which task to start when both feel equally impossible.
- Deciding whether to go to a thing or stay in.
- Any "either is fine, but I can't pick" loop.

### When not to use it

- Decisions with genuinely different costs. Don't flip a coin on big medical, financial, or relationship calls. The coin is for paralysis, not for outsourcing real consequences.
- Decisions where one option is what you want but you're avoiding it. The coin will surface this, but it's not telling you anything you don't already know.
- Days when even the coin feels like too much. On those days, the answer is no decision at all.`
  },
  'spoon-tracker': {
    title: "Spoon Tracker",
    tag: "ENERGY",
    category: { title: "VISUAL & SPACE" },
    excerpt: "Drag spoons in and out across the day. A visible energy budget for brains that need to see the maths.",
    toolComponentKey: 'spoon-tracker',
    descriptionText: `### What it is

The Spoon Tracker is a visual rendering of *spoon theory* · the idea that on any given day, you have a finite, limited number of units of energy ("spoons") and that ordinary activities spend them at different rates. The tracker lets you drag spoons in and out across the day so the cost of what you're doing is visible to you in real time, instead of being a vague feeling.

### How to use

1. At the start of the day, set your starting spoon count. Most people land between 6 and 12 on a good day. Lower on a bad one.
2. As you do things, drag spoons out of the tray and into the *spent* column. Use the suggested costs or set your own.
3. Use the *banked* column for energy you're choosing to protect for later.
4. At the end of the day, glance at the pattern. Don't analyse · just notice.

Resets at midnight by default. There's a manual reset button if you want to start over earlier.

### Why it helps

For brains that struggle to feel the cost of an activity until they've already paid it, externalising the budget is the difference between a sustainable day and a crash at 3pm. The tracker isn't trying to be accurate. It's trying to be *visible*. The act of moving a spoon is itself a tiny, useful pause.

### Accessibility & safety

- Fully keyboard-accessible. Drag-and-drop works with mouse, touch, and keyboard.
- Saves to your browser's localStorage. Nothing leaves your device. Cross-device sync is not available and isn't planned for launch.
- Resets at midnight in your local timezone. The manual reset button is always available.
- This is not a clinical tool. It's a visual aid. If your energy patterns are clinically concerning, please talk to someone qualified.

### When it helps

- Mornings when you're not sure what kind of day this is going to be.
- After a heavy day, to see what you spent on what.
- During recovery from burnout, when you're rebuilding a sense of how much you actually have.

### When it doesn't

- When you're already over-monitoring yourself. Spoon counting can become its own anxiety; if you find yourself updating the tracker more often than you're living the day, close it.
- When the number is consistently below 5 for weeks. That's not a tracking problem, that's a flag.`
  },
  'sensory-audit': {
    title: "Sensory Audit",
    tag: "SENSORY",
    category: { title: "VISUAL & SPACE" },
    excerpt: "A guided 7-question environmental self-audit. Outputs likely sensory drains and one targeted change.",
    toolComponentKey: 'sensory-audit',
    descriptionText: `### What it is

The Sensory Audit is a short, guided self-audit of the environment you're currently in. It walks you through the seven sensory domains most likely to be silently draining your energy, asks you a single question about each, and produces a one-page summary at the end · with one suggested change to try first. It's the free, 5-minute version of the *Sensory Audit Workbook*.

### How to use

1. Click *Start the audit*. The 7 questions appear one at a time.
2. For each domain (light, sound, smell, temperature, clothing, posture, screen), pick the option that best matches your current state. Don't overthink.
3. At the end, you get a one-page summary of the domains likely costing you most · and a single suggested change.
4. No signup required to see the result. The page is yours to read, screenshot, ignore, or act on.
5. Optionally, at the bottom, save the result to a printable PDF or grab the deeper *Sensory Audit Workbook*.

### Why it helps

Most late-diagnosed autistic adults have spent years filtering out their own sensory needs to fit a workplace, classroom, or family environment that wasn't built with them in mind. The filtering becomes invisible · you no longer notice the cost of the fluorescent light or the seam in the shirt, because you've trained yourself not to. The audit makes one of those costs visible again, which is the first step in deciding whether to keep paying it.

### Accessibility & safety

- Fully keyboard-navigable. Skip questions you don't want to answer.
- No tracking, no signup, no email required to see the result.
- Results are saved to your browser's localStorage only if you choose to save them. Otherwise nothing is stored.
- Result is descriptive, not diagnostic. It does not assess autism, ADHD, sensory processing disorder, or any other clinical condition.
- If the audit surfaces patterns that feel significant, the next step is a conversation with a clinician, not a tool on a website.

### How to read the score

- **0–4** · You're fine. The wrong feeling is from somewhere else. Worth checking emotional or physical inputs instead.
- **5–10** · You're paying a quiet cost. One or two changes will probably help (dim a light, move seats, put earplugs in).
- **11+** · You're in sensory debt. The single most useful thing you can do is leave or change the room.

### What it isn't

A pathology check. A high score isn't a diagnosis, it's information. Most neurodivergent brains run higher numbers than neurotypical ones in the same room. The point isn't to feel less. It's to act on the data.`
  }
};

export async function generateStaticParams() {
  let labs = [];
  try {
    labs = await getLabs();
  } catch (err) {
    console.warn('⚠️ [generateStaticParams] Failed to fetch lab slugs from Strapi:', err);
  }

  const sanitySlugs = labs.map(l => ({ slug: l.slug }));
  const mockSlugs = Object.keys(fallbackLabs).map(slug => ({ slug }));
  
  const allSlugs = [...sanitySlugs, ...mockSlugs];
  const uniqueSlugs = Array.from(new Set(allSlugs.map(s => s.slug))).map(slug => ({ slug }));
  return uniqueSlugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let lab = null;

  try {
    lab = await getLabBySlug(slug);
  } catch (err) {}

  if (!lab && fallbackLabs[slug]) {
    lab = fallbackLabs[slug];
  }

  if (!lab) {
    return {
      title: 'Lab not found - neurodivers3',
    };
  }

  const pageTitle = lab.seoTitle || lab.title;

  return {
    title: `${pageTitle} - neurodivers3`,
    description: lab.excerpt || "Alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.",
    openGraph: {
      title: `${pageTitle} - neurodivers3`,
      description: lab.excerpt || "Alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.",
    },
    twitter: {
      title: `${pageTitle} - neurodivers3`,
      description: lab.excerpt || "Alternative visual-spatial paths, sensory-friendly utilities, and resets specifically tailored for neurodivergent brains.",
    }
  };
}

export default async function LabSlugPage(props) {
  const params = await props.params;
  const slug = params.slug;

  let lab = null;

  try {
    lab = await getLabBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch lab by slug: ", err);
  }

  if (!lab && fallbackLabs[slug]) {
    lab = fallbackLabs[slug];
  }

  if (!lab) {
    notFound();
  }

  const componentKey = lab.toolComponentKey || slug;
  const metadata = LAB_METADATA[slug] || {
    setupTime: '1 min',
    complexity: 'QUICK HIT',
    useCases: ['You need a quick sensory-friendly tool'],
    shortcuts: { 'Space': 'Activate' },
  };

  let allLabs = [];
  try {
    allLabs = await getLabs();
  } catch (err) {
    allLabs = Object.values(fallbackLabs).map(l => ({ ...l, slug: l.slug || '' }));
  }

  const currentIndex = allLabs.findIndex(l => (l.slug || '') === slug);
  const prevLab = currentIndex > 0 ? allLabs[currentIndex - 1] : null;
  const nextLab = currentIndex < allLabs.length - 1 ? allLabs[currentIndex + 1] : null;

  const relatedLabs = allLabs
    .filter(l => (l.slug || '') !== slug && l.category?.title === lab.category?.title)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-start text-left">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-mono text-[var(--muted)] uppercase tracking-wider mb-6">
        <Link href="/labs" className="hover:text-[var(--accent)] transition-colors">
          LABS
        </Link>
        <span>/</span>
        <Link href={`/labs?category=${lab.category?.slug || ''}`} className="hover:text-[var(--accent)] transition-colors">
          {lab.category?.title || 'EXPERIMENT'}
        </Link>
        <span>/</span>
        <span className="text-[var(--fg)]">{lab.title}</span>
      </nav>

      {/* Back button */}
      <Link 
        href="/labs" 
        className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8 self-start cursor-pointer font-mono"
      >
        <ArrowLeft size={12} /> BACK TO EXPERIMENTAL PLAYGROUND
      </Link>

      {/* Header */}
      <div className="border-b-4 border-fg-primary pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--rule)]">
              {lab.category?.title || "EXPERIMENT"} · {lab.tag || "LAB"}
            </span>
            <span className={`text-sm font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${
              metadata.complexity === 'DEEP DIVE'
                ? 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                : 'border-green-500/30 text-green-500 bg-green-500/5'
            }`}>
              {metadata.complexity}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--fg)] leading-none mt-2 font-display">
            {lab.title}
          </h1>
          <p className="text-[16px] text-[var(--muted)] font-sans mt-4 leading-relaxed max-w-3xl">
            {lab.excerpt}
          </p>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-4 py-3 px-4 border border-[var(--rule)] bg-black/20 mb-8 text-sm font-mono uppercase tracking-wider text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-[var(--accent)]" />
          <span>{metadata.setupTime} setup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Keyboard size={12} className="text-[var(--accent)]" />
          <span>Full keyboard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Smartphone size={12} className="text-[var(--accent)]" />
          <span>Mobile ready</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-green-500" />
          <span className="text-green-500">No tracking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye size={12} className="text-[var(--accent)]" />
          <span>Data stays local</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
        {/* Left Side: Discussion & Showcase Narrative */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)]">
            BACKGROUND & FUNCTION
          </h2>
          <div className="prose prose-invert max-w-none text-[15px] text-[var(--muted)] leading-relaxed space-y-4 font-sans">
            {lab.description ? (
              <RichTextRenderer content={lab.description} />
            ) : (
              renderFallbackDescription(lab.descriptionText)
            )}
          </div>

          {/* Try This When Section */}
          <div className="border border-[var(--rule)] bg-black/20 p-5 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <Zap size={14} className="text-[var(--accent)]" />
              TRY THIS WHEN...
            </h3>
            <ul className="space-y-2">
              {metadata.useCases.map((useCase, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)] leading-relaxed">
                  <span className="text-[var(--accent)] mt-0.5 shrink-0">→</span>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>

          {/* External Link */}
          {lab.isExternal && lab.externalUrl && (
            <div className="pt-4">
              <a 
                href={lab.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] border border-[var(--accent)] hover:bg-transparent hover:text-[var(--accent)] transition-all font-black uppercase text-sm tracking-wider cursor-pointer"
              >
                LAUNCH EXTERNAL APPLICATION <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Prev/Next Navigation */}
          {(prevLab || nextLab) && (
            <div className="border border-[var(--rule)] bg-black/20 p-4 space-y-3">
              <span className="text-sm font-mono text-[var(--muted)] uppercase tracking-widest block font-bold">
                NAVIGATE LABS
              </span>
              <div className="grid grid-cols-2 gap-3">
                {prevLab ? (
                  <Link
                    href={`/labs/${prevLab.slug}`}
                    className="flex items-center gap-2 p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
                  >
                    <ChevronLeft size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-sm font-mono text-[var(--muted)] uppercase block">PREVIOUS</span>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase truncate block">{prevLab.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="p-3 border border-[var(--rule)]/30 opacity-30">
                    <span className="text-sm font-mono text-[var(--muted)] uppercase block">PREVIOUS</span>
                    <span className="text-sm font-black text-[var(--muted)] uppercase">-</span>
                  </div>
                )}
                {nextLab ? (
                  <Link
                    href={`/labs/${nextLab.slug}`}
                    className="flex items-center gap-2 p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer justify-end text-right"
                  >
                    <div className="overflow-hidden">
                      <span className="text-sm font-mono text-[var(--muted)] uppercase block">NEXT</span>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase truncate block">{nextLab.title}</span>
                    </div>
                    <ChevronRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0" />
                  </Link>
                ) : (
                  <div className="p-3 border border-[var(--rule)]/30 opacity-30 text-right">
                    <span className="text-sm font-mono text-[var(--muted)] uppercase block">NEXT</span>
                    <span className="text-sm font-black text-[var(--muted)] uppercase">-</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Labs */}
          {relatedLabs.length > 0 && (
            <div className="border border-[var(--rule)] bg-black/20 p-5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                YOU MIGHT ALSO LIKE
              </h3>
              <div className="space-y-2">
                {relatedLabs.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/labs/${related.slug}`}
                    className="flex items-center justify-between p-3 border border-[var(--rule)] hover:border-[var(--accent)] transition-colors group cursor-pointer"
                  >
                    <div>
                      <span className="text-sm font-black text-[var(--fg)] group-hover:text-[var(--accent)] uppercase block">{related.title}</span>
                      <span className="text-sm font-mono text-[var(--muted)] uppercase tracking-wider">{related.tag}</span>
                    </div>
                    <ArrowLeft size={12} className="text-[var(--muted)] group-hover:text-[var(--accent)] rotate-180 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Dynamic Interactive Tool Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* Fullscreen Toggle */}
          <LabFullscreenWrapper slug={componentKey} />

          {/* Data Persistence Panel */}
          <DataPersistencePanel />
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay shortcuts={metadata.shortcuts} />
    </div>
  );
}
