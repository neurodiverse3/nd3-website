// src/data/presets.js

export const PRESETS = {
  dopamine: {
    id: 'dopamine',
    title: "Daily Dopamine Menu",
    subtitle: "A sensory checklist to break through ADHD executive dysfunction and task paralysis.",
    niche: "ADHD Task Management",
    demand: "V. High (95/100)",
    price: "$7.00",
    audience: "ADHDers, AuDHD, Burned Out Minds",
    neuroReason: "Bypasses task initiation block by structuring low-effort entries (Starters) before focus work (Mains), with rewards (Desserts) to trigger natural dopamine loop completion.",
    keywords: ["ADHD planner", "dopamine menu", "executive dysfunction sheet", "sensory routine checklist"],
    theme: "void",
    font: "mono",
    watermark: true,
    scaleLabel: "CURRENT FOCUS CAPACITY",
    scaleVal: 6,
    sections: [
      {
        id: 'starters',
        title: "Starters (5-Min Sensory Resets)",
        type: 'checklist',
        items: [
          { text: "Splash face with ice cold water", checked: false },
          { text: "5 slow deep breaths in natural light", checked: false },
          { text: "Roll shoulders and rapid body shakeout", checked: false },
          { text: "Walk to the window and visually lock 3 distant objects", checked: false }
        ]
      },
      {
        id: 'mains',
        title: "Mains (Deep Focus Blocks - Limit to 2)",
        type: 'checklist',
        items: [
          { text: "Write 1 page or core creative layout blocks", checked: false },
          { text: "Clear administrative inbox or database file", checked: false }
        ]
      },
      {
        id: 'sides',
        title: "Sides (Supportive Ambient Habits)",
        type: 'checklist',
        items: [
          { text: "Run Brownian focus drone or white noise hum", checked: false },
          { text: "Keep a large 1L water canister on immediate desk", checked: false },
          { text: "Dim bright fluorescent light grids / use desk lamp", checked: false }
        ]
      },
      {
        id: 'desserts',
        title: "Desserts (Dopamine Rewards)",
        type: 'checklist',
        items: [
          { text: "10 mins active sensory fidget or stimming", checked: false },
          { text: "Step outside for standard solar exposure reset", checked: false },
          { text: "Listen to high-tempo favorite transition song", checked: false }
        ]
      }
    ]
  },
  executive: {
    id: 'executive',
    title: "Executive Alignment Grid",
    subtitle: "Map out chaotic daily cognitive load by energy expenditure rather than calendar urgency.",
    niche: "ADHD Productivity & Scaffolding",
    demand: "V. High (92/100)",
    price: "$10.00",
    audience: "AuDHD, High-Masking Autism, Professionals in Burnout",
    neuroReason: "Prevents executive collapse by matching tasks to daily cognitive battery reserves. Avoids scheduling complex tasks during standard sensory slumps.",
    keywords: ["executive dysfunction grid", "neurodivergent to do list", "energy tracker", "burnout planner"],
    theme: "warm-charcoal",
    font: "sans",
    watermark: true,
    scaleLabel: "COGNITIVE BATTERY STATUS",
    scaleVal: 4,
    sections: [
      {
        id: 'braindump',
        title: "Unstructured Cognitive Brain Dump",
        type: 'notes',
        text: "Write down everything currently rattling around in working memory. Clear the mental RAM so you can think..."
      },
      {
        id: 'highenergy',
        title: "High-Energy Channels (Creative / Critical Focus)",
        type: 'checklist',
        items: [
          { text: "Build initial framework and system outlines", checked: false },
          { text: "Tackle high-concentration reviews", checked: false }
        ]
      },
      {
        id: 'lowenergy',
        title: "Low-Energy Channels (Admin / Low-Strain Routine)",
        type: 'checklist',
        items: [
          { text: "Sort files, reply to direct messages, clear tags", checked: false },
          { text: "Standard utility cleanup or task sorting", checked: false },
          { text: "File receipts and complete system logs", checked: false }
        ]
      },
      {
        id: 'sensory',
        title: "Sensory Boundaries to Maintain",
        type: 'checklist',
        items: [
          { text: "Wear noise-cancelling shields in noisy rooms", checked: false },
          { text: "Enforce a strict screens-off eye reset every hour", checked: false }
        ]
      }
    ]
  },
  sensory: {
    id: 'sensory',
    title: "Sensory Battery & Audit Tracker",
    subtitle: "Identify environmental micro-drains and locate visual/auditory glimmers.",
    niche: "Autistic Self-Care Workbooks",
    demand: "High (88/100)",
    price: "$12.00",
    audience: "Highly Sensitive Persons (HSP), Autistic Thinkers, Sensory Avoiders",
    neuroReason: "Externalizes interoceptive tracking. Many sensory-sensitive individuals fail to notice sensory overload building up until a sudden shutdown or meltdown occurs.",
    keywords: ["sensory audit worksheet", "meltdown prevention guide", "autism trigger tracker", "sensory glimmers"],
    theme: "incubation",
    font: "sans",
    watermark: true,
    scaleLabel: "SENSORY OVERLOAD LEVEL",
    scaleVal: 3,
    sections: [
      {
        id: 'triggers',
        title: "Active Drains (Environmental Sensory Triggers)",
        type: 'checklist',
        items: [
          { text: "Fluorescent flicker or high blue-screen glare", checked: false },
          { text: "Continuous low-frequency background din or chatter", checked: false },
          { text: "Itchy fabric tags or rigid tight-fitting clothes", checked: false },
          { text: "Sudden unexpected context switches", checked: false }
        ]
      },
      {
        id: 'glimmers',
        title: "Active Rechargers (Sensory Glimmers)",
        type: 'checklist',
        items: [
          { text: "Weighted neck-wrap or deep muscle stimming", checked: false },
          { text: "Flickering warm candle or amber mood light", checked: false },
          { text: "Auditory shield hum (140Hz Brownian drone)", checked: false },
          { text: "Holding a hot, smooth ceramic mug of tea", checked: false }
        ]
      },
      {
        id: 'audit',
        title: "Daily Environmental Adjustments",
        type: 'checklist',
        items: [
          { text: "Wore acoustic earplugs in transit/public space", checked: false },
          { text: "Cleared visible active desk clutter down to 3 items", checked: false },
          { text: "Used orange/warm blue-light screen blockers", checked: false }
        ]
      }
    ]
  },
  routine: {
    id: 'routine',
    title: "Visual Now / Next Scaffold",
    subtitle: "A micro-focused layout to anchor task transitions and decrease initiation panic.",
    niche: "Neurodivergent Life Organizers",
    demand: "High (90/100)",
    price: "$8.00",
    audience: "Autistic Kids & Adults, ADHDers with Extreme Task Avoidance",
    neuroReason: "Minimizes working memory fatigue. By hiding the massive master list and presenting ONLY a single active task alongside its successor, task panic is neutralized.",
    keywords: ["now next board", "visual schedule template", "routine scaffold", "executive dysfunction board"],
    theme: "void",
    font: "mono",
    watermark: true,
    scaleLabel: "ANTICIPATED ANXIETY LEVEL",
    scaleVal: 5,
    sections: [
      {
        id: 'activeNow',
        title: "NOW · Single Focus Window (Do Only This)",
        type: 'notes',
        text: "Clean, wipe down, and organize my immediate computer desk surface."
      },
      {
        id: 'activeNext',
        title: "NEXT · The Immediate Horizon (No Stress Yet)",
        type: 'notes',
        text: "Draft and outline the newsletter copy block for neurodivers³."
      },
      {
        id: 'queue',
        title: "LATER · General Horizon Queue (Max 4)",
        type: 'checklist',
        items: [
          { text: "Reply to three urgent store customer inquiries", checked: false },
          { text: "Empty study wastebasket and organize notebooks", checked: false },
          { text: "15 mins physical movement or deep sensory stretching", checked: false }
        ]
      },
      {
        id: 'resets',
        title: "Transition Anchors Completed",
        type: 'checklist',
        items: [
          { text: "Hydration check-in (drank at least 500ml)", checked: false },
          { text: "Visual distance alignment (looked at horizons)", checked: false }
        ]
      }
    ]
  }
};
