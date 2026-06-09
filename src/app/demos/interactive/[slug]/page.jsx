import SpotlaneViewer from "../../../../components/SpotlaneViewer";

export default async function InteractiveDemoPage({ params }) {
  const { slug } = await params;

  return <SpotlaneViewer slug={slug} />;
}

export const metadata = {
  title: 'Interactive Demo',
};
