"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Database, 
  Layers, 
  RefreshCw, 
  Link2, 
  ExternalLink, 
  Lock, 
  Unlock,
  AlertCircle,
  Cpu,
  Mail,
  ShoppingBag,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Simple passcode gate (can be bypassed in local dev)
const DEFAULT_PASSCODE = 'nd3-admin';

export default function CommandCentre() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // 'wake-up' or 'redeploy'
  const [actionMessage, setActionMessage] = useState('');

  // Check if we are running in development mode
  useEffect(() => {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setIsDevMode(isDev);
    
    // Auto-authorize if in dev mode
    if (isDev) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === DEFAULT_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const fetchDiagnostics = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/diagnostics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch diagnostics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDiagnostics();
      const interval = setInterval(() => fetchDiagnostics(), 20000); // Auto-refresh every 20s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const triggerAction = async (action) => {
    setActionLoading(action);
    setActionMessage('');
    try {
      const res = await fetch('/api/admin/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage(json.message);
        setTimeout(() => setActionMessage(''), 4000);
        // Trigger a fresh status pull shortly after
        setTimeout(() => fetchDiagnostics(), 2000);
      } else {
        setActionMessage(`Error: ${json.error}`);
      }
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to format date
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '--';
    const diff = Date.now() - new Date(timestamp).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return 'Just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString('en-GB');
  };

  // Helper to get status color classes
  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_10px_#10b981]',
          label: 'ONLINE'
        };
      case 'sleeping':
        return {
          bg: 'bg-amber-950/30 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse',
          label: 'SLEEPING'
        };
      case 'offline':
        return {
          bg: 'bg-rose-950/30 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400 shadow-[0_0_10px_#f43f5e]',
          label: 'OFFLINE'
        };
      case 'error':
        return {
          bg: 'bg-rose-950/30 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400 shadow-[0_0_10px_#f43f5e]',
          label: 'ERROR'
        };
      default:
        return {
          bg: 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400',
          dot: 'bg-zinc-500',
          label: 'UNKNOWN'
        };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060608] text-zinc-100 flex items-center justify-center p-6 font-mono selection:bg-[#ff2e88] selection:text-black">
        <div className="max-w-md w-full border-2 border-zinc-800 bg-[#0c0c0f] p-8 shadow-[8px_8px_0px_#111] relative">
          <div className="absolute -top-4 left-4 bg-[#ff2e88] text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-black">
            SECURITY GATE
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-[#ff2e88]" size={20} />
            <h1 className="text-sm font-black uppercase tracking-widest text-zinc-400">ND³ COMMAND CENTRE</h1>
          </div>

          <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
            Access to infrastructure diagnostics and controls is protected. Enter passcode to establish connection.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="ENTER PASSCODE"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`w-full bg-[#121216] border-2 ${passcodeError ? 'border-rose-500 animate-shake' : 'border-zinc-800 focus:border-[#ff2e88]'} px-4 py-3 text-sm rounded-none outline-none transition-colors font-mono tracking-widest text-center text-zinc-100`}
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-zinc-100 text-black border-2 border-zinc-100 font-black text-xs uppercase tracking-widest py-3 hover:bg-[#ff2e88] hover:border-[#ff2e88] hover:text-black transition-colors cursor-pointer"
            >
              AUTHENTICATE
            </button>
          </form>

          {isDevMode && (
            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full mt-3 border-2 border-dashed border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase tracking-widest py-2 hover:border-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              [BYPASS: RUNNING ON LOCALHOST]
            </button>
          )}
        </div>
      </div>
    );
  }

  const localStrapiBadge = getStatusBadge(data?.localStrapi?.status);
  const prodStrapiBadge = getStatusBadge(data?.prodStrapi?.status);
  const resendBadge = getStatusBadge(data?.resend?.status);
  const polarBadge = getStatusBadge(data?.polar?.status);
  const vercelBadge = getStatusBadge(data?.vercel?.status);

  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 py-[112px] px-6 md:px-16 max-w-7xl mx-auto flex flex-col justify-start font-mono selection:bg-[#00ff88] selection:text-black">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00ff88] uppercase tracking-widest mb-1 select-none">
            <Cpu size={12} className="animate-pulse" />
            <span>ND³ INFRASTRUCTURE CORE v1.0.0</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-100 font-display">
            COMMAND <span className="text-[#ff2e88] italic font-light">CENTRE</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDiagnostics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 border-2 border-zinc-800 bg-[#0c0c0f] hover:border-zinc-400 px-4 py-2 text-xs font-bold uppercase transition-colors select-none cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'REFRESHING...' : 'REFRESH'}</span>
          </button>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 border-2 border-zinc-800 bg-[#0c0c0f] hover:border-[#ff2e88] hover:text-[#ff2e88] px-4 py-2 text-xs font-bold uppercase transition-colors select-none cursor-pointer"
          >
            <Unlock size={14} />
            <span>LOCK</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-500 gap-4">
          <RefreshCw size={36} className="animate-spin text-[#ff2e88]" />
          <span className="text-sm tracking-widest uppercase">ESTABLISHING TELEMETRY CONNECTION...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Status Grid & Controls (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Service Status Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Activity size={16} className="text-[#00ff88]" />
                <span>SYSTEM STATUS MONITOR</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local Strapi */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold block">CMS ENGINE</span>
                      <span className="text-xs font-black uppercase tracking-wider">LOCAL STRAPI</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${localStrapiBadge.bg}`}>
                      {localStrapiBadge.label}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-mono">http://localhost:1337</span>
                    {data?.localStrapi?.error && (
                      <span className="text-rose-400 font-mono truncate max-w-[120px]">{data.localStrapi.error}</span>
                    )}
                  </div>
                </div>

                {/* Production Strapi */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold block">CMS ENGINE</span>
                      <span className="text-xs font-black uppercase tracking-wider">RENDER STRAPI</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${prodStrapiBadge.bg}`}>
                      {prodStrapiBadge.label}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-mono">
                      {data?.prodStrapi?.latencyMs ? `${data.prodStrapi.latencyMs}ms latency` : 'neurodivers3-backend'}
                    </span>
                    {data?.prodStrapi?.error && (
                      <span className="text-amber-400 font-mono truncate max-w-[150px]" title={data.prodStrapi.error}>
                        {data.prodStrapi.error}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resend */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold block">EMAIL GATEWAY</span>
                      <span className="text-xs font-black uppercase tracking-wider">RESEND API</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${resendBadge.bg}`}>
                      {resendBadge.label}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-mono">
                      {data?.resend?.domainsCount} Verified Domains
                    </span>
                    {data?.resend?.error && (
                      <span className="text-rose-400 font-mono truncate max-w-[120px]">{data.resend.error}</span>
                    )}
                  </div>
                </div>

                {/* Polar.sh */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold block">MONETIZATION</span>
                      <span className="text-xs font-black uppercase tracking-wider">POLAR.SH</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${polarBadge.bg}`}>
                      {polarBadge.label}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-mono">
                      {data?.polar?.productsCount} Active Products
                    </span>
                    {data?.polar?.error && (
                      <span className="text-rose-400 font-mono truncate max-w-[120px]">{data.polar.error}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Terminal size={16} className="text-[#ff2e88]" />
                <span>INFRASTRUCTURE CONTROLS</span>
              </h2>

              <div className="flex flex-wrap gap-4">
                {/* Wake Up Render */}
                <button
                  onClick={() => triggerAction('wake-up')}
                  disabled={actionLoading === 'wake-up' || data?.prodStrapi?.status === 'online'}
                  className="flex-1 min-w-[200px] border-2 border-zinc-800 hover:border-[#00ff88] bg-[#111115] hover:bg-[#00ff88]/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:bg-transparent"
                >
                  <span className="block text-[#00ff88] mb-1">⚡ WAKE UP RENDER CMS</span>
                  <span className="text-[10px] text-zinc-500 normal-case font-normal">
                    {data?.prodStrapi?.status === 'online' 
                      ? 'Render is already awake and responsive.' 
                      : 'Sends a burst of pings to spin up the Render free tier.'}
                  </span>
                </button>

                {/* Redeploy Vercel */}
                <button
                  onClick={() => triggerAction('redeploy')}
                  disabled={actionLoading === 'redeploy' || !isDevMode}
                  className="flex-1 min-w-[200px] border-2 border-zinc-800 hover:border-[#00e5ff] bg-[#111115] hover:bg-[#00e5ff]/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:bg-transparent"
                >
                  <span className="block text-[#00e5ff] mb-1">🚀 TRIGGER VERCEL REDEPLOY</span>
                  <span className="text-[10px] text-zinc-500 normal-case font-normal">
                    {!isDevMode 
                      ? 'CLI deployment only available locally.' 
                      : 'Triggers a production rebuild on Vercel using local files.'}
                  </span>
                </button>
              </div>

              {actionMessage && (
                <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 text-xs font-bold text-[#00ff88] animate-in fade-in slide-in-from-bottom-2">
                  &gt; {actionMessage}
                </div>
              )}
            </div>

            {/* Vercel Deployments Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Layers size={16} className="text-[#00e5ff]" />
                <span>RECENT VERCEL BUILD TIMELINE</span>
              </h2>

              <div className="space-y-3">
                {data?.vercel?.deployments?.length > 0 ? (
                  data.vercel.deployments.map((dep, idx) => {
                    let stateColor = 'text-zinc-500';
                    let stateBg = 'bg-zinc-900 border-zinc-800';
                    
                    if (dep.state === 'READY') {
                      stateColor = 'text-[#00ff88]';
                      stateBg = 'bg-emerald-950/20 border-emerald-500/20';
                    } else if (dep.state === 'BUILDING') {
                      stateColor = 'text-[#00e5ff]';
                      stateBg = 'bg-cyan-950/20 border-cyan-500/20 animate-pulse';
                    } else if (dep.state === 'ERROR' || dep.state === 'FAILED') {
                      stateColor = 'text-[#ff2e88]';
                      stateBg = 'bg-rose-950/20 border-rose-500/20';
                    }

                    return (
                      <div 
                        key={idx}
                        className="border border-zinc-800 bg-[#111115] p-4 flex flex-col md:flex-row justify-between gap-4 text-xs hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-black uppercase tracking-wider text-zinc-300">
                              {dep.target === 'production' ? 'Production' : 'Preview'}
                            </span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-500">{formatTimeAgo(dep.createdAt)}</span>
                          </div>
                          <p className="text-zinc-400 font-sans font-medium line-clamp-1">
                            {dep.commitMessage}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <span className="font-mono text-zinc-600">SHA:</span>
                            <span className="font-mono">{dep.commitSha?.slice(0, 7) || 'N/A'}</span>
                            <span>•</span>
                            <span className="font-mono text-zinc-600">Branch:</span>
                            <span>{dep.branch || 'main'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-between gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 border ${stateBg} ${stateColor}`}>
                            {dep.state}
                          </span>
                          <a 
                            href={`https://${dep.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 hover:underline"
                          >
                            <span>Inspect URL</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-500 py-4 text-center">
                    No recent deployment data. Run locally in development mode to load Vercel CLI builds.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Database Stats & Quick Links (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Database & Content Stats */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Database size={16} className="text-[#ffaa00]" />
                <span>CONTENT TELEMETRY</span>
              </h2>

              <div className="space-y-4">
                {/* Local Stats */}
                <div className="border border-zinc-800 bg-[#111115] p-4">
                  <span className="text-[10px] font-bold text-zinc-500 block mb-3 border-b border-zinc-800/60 pb-1.5">
                    LOCAL DATABASE (SQLITE)
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border border-zinc-800 bg-black/40">
                      <span className="block text-lg font-black text-zinc-300">{data?.stats?.local?.posts}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">POSTS</span>
                    </div>
                    <div className="p-2 border border-zinc-800 bg-black/40">
                      <span className="block text-lg font-black text-zinc-300">{data?.stats?.local?.chapters}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">CHAPTERS</span>
                    </div>
                    <div className="p-2 border border-zinc-800 bg-black/40">
                      <span className="block text-lg font-black text-zinc-300">{data?.stats?.local?.labs}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">LABS</span>
                    </div>
                  </div>
                </div>

                {/* Production Stats */}
                <div className="border border-zinc-800 bg-[#111115] p-4">
                  <span className="text-[10px] font-bold text-[#00ff88] block mb-3 border-b border-zinc-800/60 pb-1.5">
                    PRODUCTION DATABASE (SUPABASE)
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border border-zinc-800 bg-black/40">
                      <span className="block text-lg font-black text-[#00ff88]">{data?.stats?.production?.posts}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">POSTS</span>
                    </div>
                    <div className="p-2 border border-zinc-800 bg-black/40">
                      <span className="block text-lg font-black text-[#00ff88]">{data?.stats?.production?.chapters}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">CHAPTERS</span>
                    </div>
                    <div className="p-2 border border-zinc-800 bg-black/40">
                      <span className="block text-lg font-black text-[#00ff88]">{data?.stats?.production?.labs}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">LABS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Link2 size={16} className="text-[#00e5ff]" />
                <span>QUICK INFRA LINKS</span>
              </h2>

              <div className="flex flex-col gap-2.5">
                {/* Vercel Project */}
                <a 
                  href="https://vercel.com/oclews1990-9953s-projects/neurodivers3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-zinc-800 hover:border-zinc-500 bg-[#111115] hover:bg-zinc-800/20 p-3.5 text-xs text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-bold uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-zinc-100 group-hover:bg-[#00e5ff]" />
                    VERCEL DASHBOARD
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-300" />
                </a>

                {/* Git Repo */}
                <a 
                  href="https://github.com/ollie-ai/neurodivers3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-zinc-800 hover:border-zinc-500 bg-[#111115] hover:bg-zinc-800/20 p-3.5 text-xs text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-bold uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-zinc-100 group-hover:bg-[#ff2e88]" />
                    GITHUB REPOSITORY
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-300" />
                </a>

                {/* Local Strapi */}
                <a 
                  href="http://localhost:4001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-zinc-800 hover:border-zinc-500 bg-[#111115] hover:bg-zinc-800/20 p-3.5 text-xs text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-bold uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-zinc-100 group-hover:bg-[#ffaa00]" />
                    ND³ LOCAL STUDIO
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-300" />
                </a>

                {/* Render Strapi */}
                <a 
                  href="https://neurodivers3-backend.onrender.com/admin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-zinc-800 hover:border-zinc-500 bg-[#111115] hover:bg-zinc-800/20 p-3.5 text-xs text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-bold uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-zinc-100 group-hover:bg-[#00ff88]" />
                    RENDER STRAPI ADMIN
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-300" />
                </a>

                {/* Render Dashboard */}
                <a 
                  href="https://dashboard.render.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-zinc-800 hover:border-zinc-500 bg-[#111115] hover:bg-zinc-800/20 p-3.5 text-xs text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-bold uppercase tracking-wider group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-zinc-100 group-hover:bg-[#ffaa00]" />
                    RENDER DASHBOARD
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-300" />
                </a>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
