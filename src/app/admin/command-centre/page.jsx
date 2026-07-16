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
  Cpu,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  GitBranch,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CommandCentre() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // 'wake-up' or 'redeploy'
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLocal, setIsLocal] = useState(false);
  const passcodeInputRef = React.useRef(null);

  // Check if we have a saved passcode in localStorage
  useEffect(() => {
    setIsLocal(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const savedPasscode = localStorage.getItem('nd3_admin_passcode');
    if (savedPasscode) {
      setPasscode(savedPasscode);
      verifySavedPasscode(savedPasscode);
    } else {
      setLoading(false);
      setTimeout(() => passcodeInputRef.current?.focus(), 100);
    }
  }, []);

  const verifySavedPasscode = async (code) => {
    try {
      const res = await fetch('/api/admin/diagnostics', {
        headers: { 'x-admin-passcode': code }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('nd3_admin_passcode');
      }
    } catch (err) {
      console.error('Failed to verify saved passcode:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/diagnostics', {
        headers: { 'x-admin-passcode': passcode }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsAuthenticated(true);
        localStorage.setItem('nd3_admin_passcode', passcode);
        setPasscodeError(false);
      } else {
        setPasscodeError(true);
        setIsAuthenticated(false);
        setTimeout(() => setPasscodeError(false), 2000);
      }
    } catch (err) {
      setErrorMessage('Connection error. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nd3_admin_passcode');
    setIsAuthenticated(false);
    setPasscode('');
    setData(null);
  };

  const fetchDiagnostics = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    const activePasscode = passcode || localStorage.getItem('nd3_admin_passcode');
    try {
      const res = await fetch('/api/admin/diagnostics', {
        headers: { 'x-admin-passcode': activePasscode }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else if (res.status === 401) {
        handleLogout();
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
      const interval = setInterval(() => fetchDiagnostics(), 20000); // Auto-refresh every 20s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const triggerAction = async (action) => {
    setActionLoading(action);
    setActionMessage('');
    const activePasscode = passcode || localStorage.getItem('nd3_admin_passcode');
    try {
      const res = await fetch('/api/admin/diagnostics', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': activePasscode 
        },
        body: JSON.stringify({ action })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setActionMessage(json.message);
        setTimeout(() => setActionMessage(''), 4000);
        setTimeout(() => fetchDiagnostics(), 2000);
      } else {
        setActionMessage(`Error: ${json.error || 'Action failed'}`);
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
          bg: 'bg-emerald-950/30 border-emerald-500/30 text-[#00ff88]',
          dot: 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]',
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
          bg: 'bg-rose-950/30 border-rose-500/30 text-[#ff2e88]',
          dot: 'bg-[#ff2e88] shadow-[0_0_10px_#ff2e88]',
          label: 'OFFLINE'
        };
      case 'error':
        return {
          bg: 'bg-rose-950/30 border-rose-500/30 text-[#ff2e88]',
          dot: 'bg-[#ff2e88] shadow-[0_0_10px_#ff2e88]',
          label: 'ERROR'
        };
      case 'missing_key':
        return {
          bg: 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500',
          dot: 'bg-zinc-600',
          label: 'MISSING KEY'
        };
      default:
        return {
          bg: 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400',
          dot: 'bg-zinc-500',
          label: 'UNKNOWN'
        };
    }
  };

  if (!isAuthenticated && !loading) {
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
                ref={passcodeInputRef}
                type="password"
                placeholder="ENTER PASSCODE"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`w-full bg-[#121216] border-2 ${passcodeError ? 'border-[#ff2e88] animate-shake' : 'border-zinc-800 focus:border-[#ff2e88]'} px-4 py-3 text-sm rounded-none outline-none transition-colors font-mono tracking-widest text-center text-zinc-100`}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-zinc-100 text-black border-2 border-zinc-100 font-black text-xs uppercase tracking-widest py-3 hover:bg-[#ff2e88] hover:border-[#ff2e88] hover:text-black transition-colors cursor-pointer"
            >
              AUTHENTICATE
            </button>
          </form>

          {errorMessage && (
            <p className="text-rose-400 text-center text-xs mt-3">{errorMessage}</p>
          )}

          <div className="mt-6 border-t border-zinc-800/60 pt-4 text-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
              Setup a custom passcode in Vercel via <code className="text-zinc-500 bg-[#121216] px-1 py-0.5 border border-zinc-800">COMMAND_CENTRE_PASSWORD</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const prodStrapiBadge = getStatusBadge(data?.prodStrapi?.status);
  const resendBadge = getStatusBadge(data?.resend?.status);
  const polarBadge = getStatusBadge(data?.polar?.status);

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
            disabled={refreshing || loading}
            className="flex items-center gap-2 border-2 border-zinc-800 bg-[#0c0c0f] hover:border-zinc-400 px-4 py-2 text-xs font-bold uppercase transition-colors select-none cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'REFRESHING...' : 'REFRESH'}</span>
          </button>
          
          <button
            onClick={handleLogout}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          
          {/* Left Column: Status Grid & Controls (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Service Status Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Activity size={16} className="text-[#00ff88]" />
                <span>PRODUCTION INFRASTRUCTURE MONITOR</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Production Strapi */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between min-h-[110px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold block">CMS ENGINE</span>
                      <span className="text-xs font-black uppercase tracking-wider">STRAPI (RENDER)</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${prodStrapiBadge.bg}`}>
                      {prodStrapiBadge.label}
                    </span>
                  </div>

                  {data?.render && data.render.status === 'online' && (
                    <div className="mt-3 text-[10px] text-zinc-400 space-y-1 border-t border-zinc-800/60 pt-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">SERVICE:</span> 
                        <span className={data.render.serviceStatus === 'active' ? 'text-[#00ff88] font-bold' : 'text-[#ff2e88] font-bold'}>
                          {data.render.serviceStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 font-mono">DEPLOY:</span> 
                        <span className="text-[#00e5ff] font-bold">{data.render.deployStatus.toUpperCase()}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center text-[10px] border-t border-zinc-800/40 pt-2">
                    <span className="text-zinc-500 font-mono">
                      {data?.prodStrapi?.latencyMs ? `${data.prodStrapi.latencyMs}ms latency` : 'neurodivers3-backend'}
                    </span>
                    {data?.prodStrapi?.error && (
                      <span className="text-amber-400 font-mono truncate max-w-[120px]" title={data.prodStrapi.error}>
                        {data.prodStrapi.error}
                      </span>
                    )}
                  </div>
                </div>

                {/* Resend */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between min-h-[110px]">
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
                      {data?.resend?.status === 'online' ? `${data?.resend?.domainsCount} Active Domains` : 'API Connection'}
                    </span>
                    {data?.resend?.error && (
                      <span className="text-[#ff2e88] font-mono truncate max-w-[120px]" title={data.resend.error}>{data.resend.error}</span>
                    )}
                  </div>
                </div>

                {/* Polar.sh */}
                <div className="border border-zinc-800 bg-[#111115] p-4 flex flex-col justify-between min-h-[110px]">
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
                      {data?.polar?.status === 'online' ? `${data?.polar?.productsCount} Active Products` : 'Platform API'}
                    </span>
                    {data?.polar?.error && (
                      <span className="text-[#ff2e88] font-mono truncate max-w-[120px]">{data.polar.error}</span>
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
                  className="flex-1 min-w-[200px] border-2 border-zinc-800 hover:border-[#00ff88] bg-[#111115] hover:bg-[#00ff88]/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer disabled:opacity-45 disabled:hover:border-zinc-800 disabled:hover:bg-transparent"
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
                  disabled={actionLoading === 'redeploy' || data?.vercel?.status !== 'online'}
                  className="flex-1 min-w-[200px] border-2 border-zinc-800 hover:border-[#00e5ff] bg-[#111115] hover:bg-[#00e5ff]/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer disabled:opacity-45 disabled:hover:border-zinc-800 disabled:hover:bg-transparent"
                >
                  <span className="block text-[#00e5ff] mb-1">🚀 TRIGGER VERCEL REDEPLOY</span>
                  <span className="text-[10px] text-zinc-500 normal-case font-normal">
                    {data?.vercel?.status !== 'online' 
                      ? 'CLI deployment only available locally.' 
                      : 'Triggers a production rebuild on Vercel using local files.'}
                  </span>
                </button>

                {/* IndexNow Submit */}
                <button
                  onClick={() => triggerAction('submit-indexnow')}
                  disabled={actionLoading === 'submit-indexnow'}
                  className="flex-1 min-w-[200px] border-2 border-zinc-800 hover:border-[#ffaa00] bg-[#111115] hover:bg-[#ffaa00]/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-left transition-all cursor-pointer disabled:opacity-45 disabled:hover:border-zinc-800 disabled:hover:bg-transparent"
                >
                  <span className="block text-[#ffaa00] mb-1">🔍 SUBMIT TO INDEXNOW</span>
                  <span className="text-[10px] text-zinc-500 normal-case font-normal">
                    {actionLoading === 'submit-indexnow' 
                      ? 'Submitting sitemap URLs...' 
                      : 'Submits all sitemap URLs to Bing/MS IndexNow for instant indexing.'}
                  </span>
                </button>
              </div>

              {actionMessage && (
                <div className="mt-4 p-3 bg-[#111115] border border-zinc-800 text-xs font-bold text-[#00ff88] animate-in fade-in slide-in-from-bottom-2">
                  &gt; {actionMessage}
                </div>
              )}
            </div>

            {/* Vercel Deployments / System Activity Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Layers size={16} className="text-[#00e5ff]" />
                <span>ACTIVITY LOGS & BUILD TIMELINE</span>
              </h2>

              <div className="space-y-3 font-mono">
                {data?.vercel?.deployments?.length > 0 ? (
                  data.vercel.deployments.map((dep, idx) => {
                    let stateColor = 'text-zinc-500 border-zinc-800';
                    let stateLabel = dep.state;
                    
                    if (dep.state === 'READY') {
                      stateColor = 'text-[#00ff88] border-[#00ff88]/30 bg-emerald-950/10';
                    } else if (dep.state === 'BUILDING') {
                      stateColor = 'text-[#00e5ff] border-[#00e5ff]/30 bg-cyan-950/10 animate-pulse';
                    } else if (dep.state === 'ERROR' || dep.state === 'FAILED') {
                      stateColor = 'text-[#ff2e88] border-[#ff2e88]/30 bg-rose-950/10';
                    }

                    return (
                      <div 
                        key={idx}
                        className="border border-zinc-800/60 bg-[#09090c] p-4 flex flex-col md:flex-row justify-between gap-4 text-xs hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1.5 text-left">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 border ${stateColor}`}>
                              {stateLabel}
                            </span>
                            <span className="text-zinc-500 font-bold uppercase text-[10px]">
                              {dep.target === 'production' ? 'Production' : 'Preview'}
                            </span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-zinc-500">{formatTimeAgo(dep.createdAt)}</span>
                          </div>
                          <p className="text-zinc-300 font-sans font-normal leading-relaxed">
                            {dep.commitMessage}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <span className="text-zinc-600">SHA:</span>
                            <span className="font-mono text-zinc-400">{dep.commitSha?.slice(0, 7) || 'N/A'}</span>
                            <span>•</span>
                            <span className="text-zinc-600">Branch:</span>
                            <span className="text-zinc-400 flex items-center gap-1">
                              <GitBranch size={10} />
                              {dep.branch || 'main'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 border-zinc-800/40 pt-2.5 md:pt-0">
                          <a 
                            href={`https://${dep.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#00e5ff] hover:underline flex items-center gap-1.5 font-bold uppercase"
                          >
                            <span>INSPECT URL</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-zinc-800/80 bg-[#09090c] p-6 text-center text-xs text-zinc-500 leading-relaxed font-sans">
                    <AlertCircle size={20} className="text-zinc-600 mx-auto mb-2.5" />
                    To load Vercel build logs and commit history, run this command centre locally in development mode (`npm run dev`). The live production dashboard will rely on static cache.
                  </div>
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
                {/* Production Stats */}
                <div className="border border-zinc-800 bg-[#111115] p-4">
                  <span className="text-[10px] font-bold text-[#00ff88] block mb-3 border-b border-zinc-800/60 pb-1.5">
                    PRODUCTION DATABASE (SUPABASE)
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3.5 border border-zinc-800 bg-black/40">
                      <span className="block text-xl font-black text-[#00ff88]">{data?.stats?.production?.posts}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">POSTS</span>
                    </div>
                    <div className="p-3.5 border border-zinc-800 bg-black/40">
                      <span className="block text-xl font-black text-[#00ff88]">{data?.stats?.production?.chapters}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">CHAPTERS</span>
                    </div>
                    <div className="p-3.5 border border-zinc-800 bg-black/40">
                      <span className="block text-xl font-black text-[#00ff88]">{data?.stats?.production?.labs}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">LABS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Panel */}
            <div className="border-2 border-zinc-800 bg-[#0c0c0f] p-6 shadow-[4px_4px_0px_#111]">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 mb-5 flex items-center gap-2">
                <Link2 size={16} className="text-[#00e5ff]" />
                <span>QUICK LINKS</span>
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
                    VERCEL PROJECT
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-300" />
                </a>

                {/* Git Repo */}
                <a 
                  href="https://github.com/neurodiverse3/neurodivers3" 
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

                {/* Local Studio (Dev Only) */}
                {isLocal && (
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
                )}

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
