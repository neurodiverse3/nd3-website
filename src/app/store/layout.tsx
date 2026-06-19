import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Toolkit · neurodivers\u00B3",
  description:
    "Tactile, visual-spatial, restartable planners and digital resources designed for autistic and ADHD brains.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
