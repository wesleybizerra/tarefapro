
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, LayoutDashboard, LogOut,
  Users, DollarSign, Zap, Star, Trophy, ArrowRightLeft,
  CreditCard, Smartphone, Mail, Hash, ChevronRight, Activity, Loader2, AlertCircle, Info, Menu
} from 'lucide-react';

type ViewMode = 'USER' | 'ADMIN' | 'AUTH' | 'LOADING';
type TabType = 'dashboard' | 'missions' | 'plans' | 'wallet';

const Badge: React.FC<{ children: React.ReactNode; variant?: string }> = ({ children, variant = 'default' }) => {
  const styles: any = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    premium: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[variant] || styles.default}`}>{children}</span>;
};

const Card: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-sm p-4 lg:p-6 ${className}`}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOADING');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const dailyMissions = [
    { id: 1, title: "Avaliar App na Store", points: 150, description: "Dê 5 estrelas e comente algo positivo." },
    { id: 2, title: "Responder Pesquisa", points: 250, description: "Pesquisa rápida sobre hábitos diários." },
    { id: 3, title: "Assistir Vídeo Tutorial", points: 80, description: "Aprenda a lucrar mais em 1 minuto." },
    { id: 4, title: "Seguir no Instagram", points: 120, description: "Fique por dentro das promoções." },
    { id: 5, title: "Check-in Diário", points: 20, description: "Bônus por apenas abrir o app hoje." },
    { id: 6, title: "Compartilhar Link VIP", points: 180, description: "Compartilhe no seu status do WhatsApp." },
    { id: 7, title: "Ler Artigo de Dicas", points: 50, description: "Dicas de como economizar investindo." },
    { id: 8, title: "Feedback da Plataforma", points: 200, description: "Diga o que podemos melhorar." },
  ];

  const fetchSync = useCallback(async () => {
    if (!userData?.email) return;
    try {
      const res = await fetch(`/api/sync?email=${userData.email}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUserData(data.user);
      }
    } catch (e) { }
  }, [userData?.email]);

  useEffect(() => {
    const saved = localStorage.getItem('tarefapro_session');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setUserData(user);
        setViewMode(user.role === 'ADMIN' ? 'ADMIN' : 'USER');
      } catch (e) {
        setViewMode('AUTH');
      }
    } else {
      setViewMode('AUTH');
    }
  }, []);

  useEffect(() => {
    if (userData?.email) {
      const interval = setInterval(fetchSync, 10000);
      return () => clearInterval(interval);
    }
  }, [userData?.email, fetchSync]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(isLoginMode ? '/api/login' : '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        localStorage.setItem('tarefapro_session', JSON.stringify(data.user));
        setViewMode('USER');
        setActiveTab('dashboard');
      } else { alert(data.error); }
    } finally { setLoading(false); }
  };

  const completeMission = async (missionId: number, points: number) => {
    if (loading || !userData) return;
    setLoading(true);
    try {
      const res = await fetch('/api/complete-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, missionId, points })
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        alert(`Sucesso! Você ganhou ${data.earnedPoints} pontos.`);
      } else { alert(data.error); }
    } finally { setLoading(false); }
  };

  const buyPlan = async (planId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, email: userData.email })
      });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } catch (e) { alert("Erro ao gerar pagamento."); }
    finally { setLoading(false); }
  };

  const convertPoints = async () => {
    if ((userData?.points || 0) < 1000) return alert("Mínimo 1.000 pontos.");
    setLoading(true);
    try {
      const res = await fetch('/api/convert-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        alert("Pontos convertidos!");
      }
    } finally { setLoading(false); }
  };

  const handleWithdrawal = async () => {
    if ((userData?.balance || 0) < 1.0) return alert("Saldo insuficiente no app.");
    if (!userData?.pixKey) return alert("Preencha sua chave PIX.");
    setLoading(true);
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, pixKey: userData.pixKey, pixType: userData.pixType || 'CPF' })
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        alert(data.message);
      }
    } finally { setLoading(false); }
  };

  const isMissionCompleted = (missionId: number) => {
    if (!userData?.completedMissions) return false;
    const today = new Date().toISOString().split('T')[0];
    return userData.completedMissions.some((m: any) => m.id === missionId && m.date === today);
  };

  if (viewMode === 'LOADING') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black text-2xl animate-pulse">
      TAREFAPRO...
    </div>
  );

  if (viewMode === 'AUTH') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-6">
      <Card className="w-full max-w-md p-8 lg:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl">
            <Zap fill="currentColor" size={32} />
          </div>
          <h1 className="text-2xl font-black">TarefaPro</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            {isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </p>
        </div>
        <form onSubmit={handleAuth} className="space-y-3">
          {!isLoginMode && (
            <input
              type="text" placeholder="Nome" required
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:border-indigo-600 outline-none"
            />
          )}
          <input
            type="email" placeholder="E-mail" required
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:border-indigo-600 outline-none"
          />
          <input
            type="password" placeholder="Senha" required
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:border-indigo-600 outline-none"
          />
          <button
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-transform"
          >
            {loading ? 'Aguarde...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>
        <button onClick={() => setIsLoginMode(!isLoginMode)} className="w-full mt-6 text-slate-400 font-bold text-sm underline">
          {isLoginMode ? 'Criar nova conta' : 'Já possuo conta'}
        </button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-24 lg:pb-0">
      {/* Sidebar Desktop */}
      <aside className="w-80 bg-white border-r p-10 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-12 font-black text-2xl">
          <Zap className="text-indigo-600" fill="currentColor" size={24} /> TarefaPro
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('missions')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'missions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Trophy size={18} /> Missões
          </button>
          <button onClick={() => setActiveTab('plans')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Star size={18} /> Planos VIP
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Wallet size={18} /> Carteira
          </button>
        </nav>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center gap-3 px-6 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-red-500">
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* Navegação Inferior Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4 lg:hidden z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} /> <span className="text-[9px] font-black uppercase">Home</span>
        </button>
        <button onClick={() => setActiveTab('missions')} className={`flex flex-col items-center gap-1 ${activeTab === 'missions' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Trophy size={20} /> <span className="text-[9px] font-black uppercase">Missões</span>
        </button>
        <button onClick={() => setActiveTab('plans')} className={`flex flex-col items-center gap-1 ${activeTab === 'plans' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Star size={20} /> <span className="text-[9px] font-black uppercase">VIP</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center gap-1 ${activeTab === 'wallet' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Wallet size={20} /> <span className="text-[9px] font-black uppercase">Carteira</span>
        </button>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 lg:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="w-full md:w-auto flex justify-between items-center md:block">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tighter">Olá, {userData?.name?.split(' ')[0]}</h1>
              <div className="flex gap-2 mt-1 lg:mt-2">
                <Badge variant="success">{userData?.plan}</Badge>
              </div>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="lg:hidden text-slate-400 hover:text-red-500 p-2">
              <LogOut size={20} />
            </button>
          </div>

          <div className="flex gap-2 lg:gap-4 w-full md:w-auto">
            <Card className="flex-1 flex items-center gap-3 py-3 px-4 lg:px-6">
              <Trophy size={18} className="text-amber-600" />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Pontos</p>
                <p className="text-lg lg:text-xl font-black">{(userData?.points || 0).toLocaleString()}</p>
              </div>
            </Card>
            <Card className="flex-1 flex items-center gap-3 py-3 px-4 lg:px-6">
              <DollarSign size={18} className="text-emerald-600" />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Saldo</p>
                <p className="text-lg lg:text-xl font-black text-emerald-600">R$ {(userData?.balance || 0).toFixed(2)}</p>
              </div>
            </Card>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-4xl font-black mb-4 leading-tight">Ganhe Dinheiro Real<br className="hidden lg:block" /> Avaliando Apps</h2>
                <p className="mb-6 lg:mb-8 opacity-90 text-sm lg:text-base max-w-sm">Complete micro-tarefas diárias e receba via PIX instantâneo com segurança.</p>
                <button onClick={() => setActiveTab('missions')} className="bg-white text-indigo-600 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-black uppercase text-[10px] lg:text-xs shadow-xl active:scale-95 transition-transform">Iniciar Agora</button>
              </div>
              <Zap className="absolute right-[-40px] bottom-[-40px] text-white/10" size={200} fill="currentColor" />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><CheckCircle size={20} /></div>
                <div><h4 className="font-black text-sm">Simples</h4><p className="text-xs text-slate-400">Tarefas de 1 min.</p></div>
              </Card>
              <Card className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><Smartphone size={20} /></div>
                <div><h4 className="font-black text-sm">Via PIX</h4><p className="text-xs text-slate-400">Saques rápidos.</p></div>
              </Card>
              <Card className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center"><Star size={20} /></div>
                <div><h4 className="font-black text-sm">VIP</h4><p className="text-xs text-slate-400">Bônus exclusivos.</p></div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black tracking-tight">Missões Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              {dailyMissions.map(m => {
                const completed = isMissionCompleted(m.id);
                return (
                  <Card key={m.id} className={`flex items-center justify-between gap-4 ${completed ? 'opacity-60 bg-slate-50' : ''}`}>
                    <div className="flex-1">
                      <h3 className="font-black text-sm lg:text-base">{m.title}</h3>
                      <p className="text-[10px] lg:text-xs text-slate-400">{m.description}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs lg:text-sm font-black text-indigo-600">+{m.points} PTS</p>
                      <button
                        disabled={completed || loading}
                        onClick={() => completeMission(m.id, m.points)}
                        className={`mt-2 px-3 lg:px-4 py-2 rounded-xl text-[9px] lg:text-[10px] font-black uppercase transition-all active:scale-95 ${completed ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                      >
                        {completed ? 'Concluída' : loading ? '...' : 'Fazer'}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-tight">Potencialize seus Ganhos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {[
                { id: 'start', name: 'Start', price: 5, bonus: '5%', color: 'indigo' },
                { id: 'pro', name: 'Pro VIP', price: 10, bonus: '15%', featured: true, color: 'purple' },
                { id: 'elite', name: 'Elite Master', price: 15, bonus: '30%', color: 'amber' },
              ].map((p) => (
                <Card key={p.id} className={`${p.featured ? 'border-indigo-600 ring-4 ring-indigo-50 relative' : ''}`}>
                  {p.featured && <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Popular</div>}
                  <h3 className="text-lg lg:text-xl font-black">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xs font-bold">R$</span>
                    <span className="text-3xl font-black">{p.price.toFixed(2)}</span>
                  </div>
                  <ul className="mt-6 space-y-3 mb-8 text-xs font-bold text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Bônus de {p.bonus} nos ganhos</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Saque PIX Prioritário</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Suporte Exclusivo</li>
                  </ul>
                  <button onClick={() => buyPlan(p.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] lg:text-xs tracking-widest hover:bg-indigo-600 active:scale-95 transition-all">Ativar Agora</button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              <Card className="space-y-6">
                <h2 className="font-black text-lg lg:text-xl flex items-center gap-3"><ArrowRightLeft className="text-indigo-600" /> Trocar Pontos</h2>
                <div className="bg-slate-50 p-6 lg:p-8 rounded-[2rem] text-center border">
                  <p className="text-3xl lg:text-4xl font-black text-indigo-600">{(userData?.points || 0).toLocaleString()}</p>
                  <p className="text-[10px] lg:text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Equivale a R$ {Math.floor((userData?.points || 0) / 1000).toFixed(2)}</p>
                </div>
                <button
                  onClick={convertPoints}
                  disabled={loading || (userData?.points || 0) < 1000}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] lg:text-xs shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                >
                  Sacar para Saldo
                </button>
              </Card>

              <Card className="space-y-6">
                <h2 className="font-black text-lg lg:text-xl flex items-center gap-3"><Smartphone className="text-emerald-600" /> Saque PIX</h2>
                <div className="space-y-4">
                  <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
                    {['CPF', 'EMAIL', 'CELULAR', 'ALEATORIA'].map(t => (
                      <button
                        key={t}
                        onClick={() => setUserData({ ...userData, pixType: t })}
                        className={`flex-1 min-w-[70px] py-2 rounded-xl text-[9px] font-black border uppercase ${userData?.pixType === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text" placeholder="Sua Chave PIX"
                    value={userData?.pixKey || ''}
                    onChange={e => setUserData({ ...userData, pixKey: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-emerald-600 transition-all"
                  />
                  <div className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center text-xs lg:text-sm font-bold text-emerald-700 border border-emerald-100">
                    <span>Disponível:</span>
                    <span className="font-black text-base lg:text-lg">R$ {(userData?.balance || 0).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleWithdrawal}
                    disabled={loading || (userData?.balance || 0) < 1.0}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] lg:text-xs shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                  >
                    Confirmar Saque
                  </button>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="font-black text-lg lg:text-xl mb-6">Histórico de Saques</h2>
              <div className="overflow-x-auto -mx-4 lg:mx-0">
                <div className="inline-block min-w-full align-middle px-4 lg:px-0">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[9px] lg:text-[10px] uppercase font-black border-b">
                        <th className="pb-4 pr-4">Data</th>
                        <th className="pb-4 pr-4">Valor</th>
                        <th className="pb-4 pr-4">Chave</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] lg:text-sm font-bold">
                      {userData?.withdrawals?.map((w: any) => (
                        <tr key={w.id} className="border-b last:border-0">
                          <td className="py-4 pr-4 whitespace-nowrap">{new Date(w.date).toLocaleDateString()}</td>
                          <td className="py-4 pr-4 text-emerald-600 whitespace-nowrap">R$ {w.amount.toFixed(2)}</td>
                          <td className="py-4 pr-4 max-w-[100px] truncate">{w.pixKey}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-1">
                              <Badge variant={w.status === 'COMPLETED' ? 'success' : w.status === 'ERROR' ? 'danger' : 'warning'}>{w.status}</Badge>
                              {w.errorReason && (
                                <div className="group relative">
                                  <Info size={12} className="text-slate-400 cursor-help" />
                                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-[9px] p-2 rounded-lg w-40 shadow-xl z-50 right-0">
                                    {w.errorReason}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(!userData?.withdrawals || userData.withdrawals.length === 0) && (
                        <tr><td colSpan={4} className="py-8 text-center text-slate-400">Nenhum saque realizado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
