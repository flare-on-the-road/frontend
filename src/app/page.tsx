'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  CCTVS_DATA, 
  ALERTS_DATA, 
  CCTVItem, 
  TrafficAlert 
} from '@/constants/cctvData';
import { 
  Shield, 
  Bell, 
  Video, 
  AlertTriangle, 
  Flame, 
  AlertCircle, 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  LogIn, 
  UserPlus, 
  Loader2 
} from 'lucide-react';

// Dynamically import Map component (client-side only to avoid SSR issues with Leaflet)
const Map = dynamic(() => import('@/components/organisms/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] md:min-h-[480px] bg-warm-100/40 rounded-2xl flex items-center justify-center border border-warm-200/40 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-flare-500 animate-spin" />
        <span className="text-slate-500 text-sm font-medium">지도를 불러오는 중...</span>
      </div>
    </div>
  )
});

export default function Home() {
  // Navigation active tab (local state)
  const [activeTab, setActiveTab] = useState<'home' | 'cctv' | 'alert' | 'stats' | 'qna'>('home');

  // CCTV Filter: 'all' | 'highway' | 'local'
  const [cctvFilter, setCctvFilter] = useState<'all' | 'highway' | 'local'>('all');
  
  // Alert Filter: 'all' | 'danger' | 'accident' | 'fire' | 'control' | 'normal'
  const [alertFilter, setAlertFilter] = useState<'all' | 'danger' | 'accident' | 'fire' | 'control' | 'normal'>('all');

  // Selected CCTV (for Map coordinates flying & sidebar highlight)
  const [selectedCctv, setSelectedCctv] = useState<CCTVItem | null>(null);

  // Filter CCTVs
  const filteredCctvs = useMemo(() => {
    if (cctvFilter === 'all') return CCTVS_DATA;
    return CCTVS_DATA.filter((item) => item.roadType === cctvFilter);
  }, [cctvFilter]);

  // Filter Alerts
  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'all') return ALERTS_DATA;
    return ALERTS_DATA.filter((item) => item.type === alertFilter);
  }, [alertFilter]);

  // Active operating count
  const operatingCount = useMemo(() => {
    return CCTVS_DATA.filter((item) => item.status === 'connected').length;
  }, []);

  // Handle alert card click: zooms to corresponding CCTV on the map
  const handleAlertClick = (alert: TrafficAlert) => {
    if (!alert.cctvId) return;
    const cctv = CCTVS_DATA.find((c) => c.id === alert.cctvId);
    if (cctv) {
      setSelectedCctv(cctv);
      // Smooth scroll to top map section if clicked from below
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to render alert icon
  const getAlertIcon = (type: string, className = "w-4 h-4") => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className={`${className} text-danger-critical`} />;
      case 'accident':
        return <AlertCircle className={`${className} text-danger-danger`} />;
      case 'fire':
        return <Flame className={`${className} text-danger-critical`} />;
      case 'control':
        return <Compass className={`${className} text-danger-caution`} />;
      default:
        return <CheckCircle2 className={`${className} text-danger-normal`} />;
    }
  };

  // Helper for alert border colors
  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'border-l-4 border-danger-critical';
      case 'accident':
        return 'border-l-4 border-danger-danger';
      case 'fire':
        return 'border-l-4 border-danger-critical';
      case 'control':
        return 'border-l-4 border-danger-caution';
      default:
        return 'border-l-4 border-danger-normal';
    }
  };

  // Helper for alert badge styling
  const getAlertBadgeStyle = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 text-danger-critical border-red-100';
      case 'accident':
        return 'bg-orange-50 text-danger-danger border-orange-100';
      case 'fire':
        return 'bg-red-50 text-danger-critical border-red-100';
      case 'control':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      default:
        return 'bg-green-50 text-danger-normal border-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-slate-800 flex flex-col font-sans">
      
      {/* ── HEADER (NAVBAR) ── */}
      <header className="sticky top-0 z-50 glass border-b border-warm-200/40 py-3.5 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-flare-500/10 p-2 rounded-xl text-flare-500 group-hover:bg-flare-500 group-hover:text-white transition-all duration-300">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              VisionGuard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-[15px]">
            <button 
              onClick={() => setActiveTab('home')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-flare-500 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              홈
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flare-500 rounded-full animate-fade-in" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('cctv')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'cctv' ? 'text-flare-500 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              실시간 CCTV
              {activeTab === 'cctv' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flare-500 rounded-full animate-fade-in" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('alert')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'alert' ? 'text-flare-500 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              교통상황 알림 및 예측
              {activeTab === 'alert' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flare-500 rounded-full animate-fade-in" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'stats' ? 'text-flare-500 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              교통통계
              {activeTab === 'stats' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flare-500 rounded-full animate-fade-in" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('qna')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'qna' ? 'text-flare-500 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              공지사항 및 Q&A
              {activeTab === 'qna' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flare-500 rounded-full animate-fade-in" />
              )}
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-warm-300 rounded-xl font-medium text-sm hover:bg-warm-100 text-slate-600 transition-all cursor-pointer">
              <LogIn className="w-4 h-4" />
              로그인
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-flare-500 hover:bg-flare-600 active:bg-flare-700 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all cursor-pointer">
              <UserPlus className="w-4 h-4" />
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        
        {/* Row 1: Interactive Map & CCTV List Section */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          
          {/* Left: Dynamic Leaflet Map */}
          <div className="lg:col-span-3 flex flex-col h-[400px] md:h-[520px]">
            <Map 
              cctvs={CCTVS_DATA} 
              selectedCctv={selectedCctv} 
              onSelectCctv={setSelectedCctv} 
            />
          </div>

          {/* Right: CCTV List Card Panel */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-2xl border border-warm-200/60 shadow-sm flex flex-col p-5 h-[400px] md:h-[520px] overflow-hidden">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-warm-100">
              <div className="flex items-center gap-2">
                <div className="bg-flare-50 p-2 rounded-lg text-flare-500">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">CCTV 목록</h2>
                  <p className="text-xs text-slate-400">총 {CCTVS_DATA.length}대 중 {operatingCount}대 운영중</p>
                </div>
              </div>
            </div>

            {/* Road Type Filter Buttons */}
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setCctvFilter('all')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  cctvFilter === 'all' 
                    ? 'bg-flare-500 text-white shadow-sm' 
                    : 'bg-warm-50 hover:bg-warm-100 text-slate-600'
                }`}
              >
                전체
              </button>
              <button 
                onClick={() => setCctvFilter('highway')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  cctvFilter === 'highway' 
                    ? 'bg-flare-500 text-white shadow-sm' 
                    : 'bg-warm-50 hover:bg-warm-100 text-slate-600'
                }`}
              >
                고속도로
              </button>
              <button 
                onClick={() => setCctvFilter('local')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  cctvFilter === 'local' 
                    ? 'bg-flare-500 text-white shadow-sm' 
                    : 'bg-warm-50 hover:bg-warm-100 text-slate-600'
                }`}
              >
                일반도로
              </button>
            </div>

            {/* CCTV Scrollable List */}
            <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-2.5">
              {filteredCctvs.map((cctv) => {
                const isSelected = selectedCctv?.id === cctv.id;
                return (
                  <div 
                    key={cctv.id}
                    onClick={() => setSelectedCctv(cctv)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-cream-100/60 border-flare-400/80 shadow-sm ring-1 ring-flare-400/40' 
                        : 'bg-warm-50/50 hover:bg-warm-100/50 border-warm-200/30'
                    }`}
                  >
                    {/* CCTV Thumbnail View */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-warm-200/80 border border-warm-200/50 shadow-inner">
                      <Image 
                        src={cctv.image} 
                        alt={cctv.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    </div>

                    {/* CCTV Text details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-flare-600 transition-colors">
                        {cctv.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {cctv.roadName} · {cctv.location}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          cctv.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`} />
                        <span className={`text-[10px] font-bold ${
                          cctv.status === 'connected' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {cctv.status === 'connected' ? '실시간 연결중' : '점검중'}
                        </span>
                      </div>
                    </div>

                    {/* Action icon */}
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${
                      isSelected ? 'translate-x-0.5 text-flare-500' : 'group-hover:translate-x-0.5'
                    }`} />
                  </div>
                );
              })}

              {filteredCctvs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                  <AlertCircle className="w-8 h-8 stroke-[1.5] mb-2" />
                  <p className="text-sm font-medium">해당 조건에 일치하는 CCTV가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Row 2: Real-time Traffic Alerts Section */}
        <section className="space-y-4">
          
          {/* Header & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-flare-500/10 p-2.5 rounded-xl text-flare-500 mt-0.5">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  실시간 교통 알림
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">최신 교통상황 및 긴급 알림을 실시간으로 확인하세요</p>
              </div>
            </div>

            {/* Alert Category Filter Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'danger', 'accident', 'fire', 'control'] as const).map((type) => {
                const label = type === 'all' ? '전체' :
                              type === 'danger' ? '위험' :
                              type === 'accident' ? '사고' :
                              type === 'fire' ? '화재' : '통제';
                return (
                  <button 
                    key={type}
                    onClick={() => setAlertFilter(type)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      alertFilter === type 
                        ? 'bg-flare-500 border-flare-500 text-white shadow-sm' 
                        : 'bg-white border-warm-200 text-slate-600 hover:bg-warm-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`bg-white/95 backdrop-blur-md rounded-2xl p-4.5 border border-warm-200/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 ${getAlertBorderColor(alert.type)}`}
              >
                <div>
                  {/* Badge & Area */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className={`px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 text-[11px] ${getAlertBadgeStyle(alert.type)}`}>
                      {getAlertIcon(alert.type, "w-3 h-3")}
                      {alert.typeName}
                    </span>
                    <span className="text-slate-400 font-medium">{alert.location}</span>
                  </div>

                  {/* Alert Title */}
                  <h3 className="font-bold text-slate-800 text-[14px] leading-tight mb-2 group-hover:text-flare-600 transition-colors">
                    {alert.title}
                  </h3>

                  {/* Alert Body Description */}
                  <p className="text-slate-500 text-[12px] leading-relaxed mb-4 line-clamp-2">
                    {alert.content}
                  </p>
                </div>

                {/* Footer Timestamp & CTA */}
                <div className="flex items-center justify-between pt-2.5 border-t border-warm-100/50 text-[11px]">
                  <span className="text-slate-400 font-mono">{alert.timestamp}</span>
                  <span className="text-flare-600 font-semibold flex items-center gap-0.5 group-hover:gap-1 transition-all">
                    자세히 보기
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="col-span-full bg-white/50 border border-warm-200/30 rounded-2xl py-12 flex flex-col items-center justify-center text-slate-400">
                <AlertCircle className="w-8 h-8 stroke-[1.5] mb-2" />
                <p className="text-sm font-medium">해당 카테고리의 교통 알림이 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-flare-400" />
            <span className="text-cream-50 font-bold text-sm tracking-wide">VisionGuard</span>
            <span className="text-slate-600">|</span>
            <span>지능형 실시간 교통 관제 & 안전 플랫폼</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream-50 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-cream-50 transition-colors">이용약관</a>
            <a href="#" className="hover:text-cream-50 transition-colors">고객지원</a>
          </div>
          <p className="text-slate-500">© 2026 VisionGuard Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
