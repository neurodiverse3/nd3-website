"use client";
import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full border-2 border-dashed border-accent-pink/60 bg-black/45 p-6 md:p-8 text-left my-8 shadow-[4px_4px_0px_rgba(255,46,136,0.15)] select-none">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 bg-accent-pink-soft border border-accent-pink/30 text-accent-pink shrink-0 leading-none rounded-none">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-3 flex-grow">
              <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-accent-pink">
                LAB COMPONENT ERROR
              </h4>
              <p className="text-base font-sans text-text-muted leading-relaxed">
                This interactive element failed to load or crashed. This is usually due to a transient connection failure or state conflict.
              </p>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-accent-pink bg-accent-pink-soft text-accent-pink hover:bg-accent-pink hover:text-bg-primary font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-[2px_2px_0px_rgba(255,46,136,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer focus-ring"
              >
                <RotateCcw size={12} />
                <span>RELOAD ELEMENT</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
