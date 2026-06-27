export const fallbackLabs = {
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
