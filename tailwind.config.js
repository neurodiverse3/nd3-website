const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface, var(--bg))",
        fg: "var(--fg)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        link: "var(--link, var(--accent))",
        pillar: {
          unmasked: "var(--pillar-unmasked)",
          tools: "var(--pillar-tools)",
          digital: "var(--pillar-digital)",
        },
        "pillar-card": {
          unmasked: "var(--pillar-card-unmasked)",
          tools: "var(--pillar-card-tools)",
          digital: "var(--pillar-card-digital)",
        },
      },
      backgroundImage: {
        "grad-hero": "var(--grad-hero)",
        "grad-progress": "var(--grad-progress)",
        "grad-meta": "var(--grad-meta)",
      },
    },
  },
  plugins: [],
};

export default config;
