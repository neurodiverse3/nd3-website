import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Toolkit - neurodivers³",
  description:
    "Tactile, visual-spatial, restartable planners and digital resources designed for autistic and ADHD brains.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://buy.polar.sh" crossOrigin="anonymous" />
      {children}
    </>
  );
}
