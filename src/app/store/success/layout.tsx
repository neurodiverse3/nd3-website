import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed - neurodivers³',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
