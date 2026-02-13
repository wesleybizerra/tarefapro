
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, LayoutDashboard, LogOut,
  Users, DollarSign, Zap, Star, Trophy, ArrowRightLeft,
  CreditCard, Smartphone, Mail, Hash, ChevronRight, Activity, Loader2
} from 'lucide-react';

type ViewMode = 'USER' | 'ADMIN' | 'AUTH' | 'LOADING';
type TabType = 'dashboard' | 'missions' | 'plans' | 'wallet' | 'admin_overview';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    premium: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[variant]}`}>{children}</span>;
};

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOADING');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userData, setUserData] = useState<any>({
    name: "Usuário", email: "", points: 0, balance: 0.00, plan: 'FREE', pixKey: '', pixType: 'CPF', completedMissions: []
  });
  const [platformStats, setPlatformStats] = useState<any>({ adminCommission: 0, activeUsers: 0, members: [] });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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
    if (!userData.email) return;
    try {
      const res = await fetch(`/api/sync?email=${userData.email}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUserData(prev => ({ ...prev, ...data.user }));
          if (viewMode === 'ADMIN') setPlatformStats(data.stats);
        }
      }
    } catch (e) { }
  }, [userData.email, viewMode]);

  useEffect(() => {
    const saved = localStorage.getItem('tarefapro_session');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setViewMode(user.role === 'ADMIN' ? 'ADMIN' : 'USER');
      setActiveTab(user.role === 'ADMIN' ? 'admin_overview' : 'dashboard');
    } else {
      setViewMode('AUTH');
    }
  }, []);

  useEffect(() => {
    if (userData.email) {
      const interval = setInterval(fetchSync, 10000);
      return () => clearInterval(interval);
    }
  }, [userData.email, fetchSync]);

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
        setViewMode(data.user.role === 'ADMIN' ? 'ADMIN' : 'USER');
        setActiveTab(data.user.role === 'ADMIN' ? 'admin_overview' : 'dashboard');
      } else { alert(data.error); }
    } finally { setLoading(false); }
  };

  const completeMission = async (missionId: number, points: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/complete-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, missionId, points: Number(points) })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUserData(data.user);
        localStorage.setItem('tarefapro_session', JSON.stringify(data.user));
        alert(`Sucesso! Você ganhou ${data.earnedPoints} pontos.`);
      } else {
        alert(data.error || "Erro ao completar missão.");
      }
    } catch (e) {
      alert("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const isMissionCompleted = (missionId: number) => {
    if (!userData.completedMissions || !Array.isArray(userData.completedMissions)) return false;
    const today = new Date().toISOString().split('T')[0];
    return userData.completedMissions.some((m: any) => m.id === missionId && m.date === today);
  };

  if (viewMode === 'LOADING') return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black text-2xl animate-pulse">TAREFAPRO...</div>;

  if (viewMode === 'AUTH') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl">
            <Zap fill="currentColor" size={32} />
          </div>
          <h1 className="text-2xl font-black">TarefaPro</h1>
          <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">{isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta'}</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-3">
          {!isLoginMode && <input type="text" placeholder="Nome Completo" required onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:border-indigo-600 outline-none" />}
          <input type="email" placeholder="E-mail" required onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:border-indigo-600 outline-none" />
          <input type="password" placeholder="Senha" required onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border border-transparent focus:border-indigo-600 outline-none" />
          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg hover:scale-[1.02] transition-transform">
            {loading ? 'Aguarde...' : (isLoginMode ? 'Entrar' : 'Começar Agora')}
          </button>
        </form>
        <button onClick={() => setIsLoginMode(!isLoginMode)} className="w-full mt-6 text-slate-400 font-bold text-sm">
          {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
        </button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <aside className="w-80 bg-white border-r p-10 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-12 font-black text-2xl">
          <div className="p-2 bg-indigo-600 rounded-xl text-white"><Zap fill="currentColor" size={20} /></div>
          TarefaPro
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab(viewMode === 'ADMIN' ? 'admin_overview' : 'dashboard')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'dashboard' || activeTab === 'admin_overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          {viewMode === 'USER' && (
            <>
              <button onClick={() => setActiveTab('missions')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'missions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Trophy size={18} /> Missões Diárias
              </button>
              <button onClick={() => setActiveTab('plans')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Star size={18} /> Planos VIP
              </button>
              <button onClick={() => setActiveTab('wallet')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Wallet size={18} /> Minha Carteira
              </button>
            </>
          )}
        </nav>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center gap-3 px-6 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-red-500 transition-colors">
          <LogOut size={18} /> Sair
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Olá, {userData.name?.split(' ')[0]}</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant="success">{userData.role}</Badge>
              <Badge variant={userData.plan === 'FREE' ? 'default' : 'premium'}>{userData.plan}</Badge>
            </div>
          </div>
          <div className="flex gap-4">
            <Card className="flex items-center gap-4 py-3 px-6">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Trophy size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pontos</p>
                <p className="text-xl font-black text-slate-900">{(userData.points || 0).toLocaleString()}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 py-3 px-6">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</p>
                <p className="text-xl font-black text-emerald-600">R$ {(userData.balance || 0).toFixed(2)}</p>
              </div>
            </Card>
          </div>
        </header>

        {activeTab === 'missions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight">Missões Profissionais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyMissions.map((m) => {
                const completed = isMissionCompleted(m.id);
                return (
                  <Card key={m.id} className={`flex items-center justify-between transition-all ${completed ? 'bg-slate-50 opacity-70' : 'hover:border-indigo-200'}`}>
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-indigo-600'}`}>
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h3 className={`font-black ${completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{m.title}</h3>
                        <p className="text-xs text-slate-400 font-medium">{m.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${completed ? 'text-slate-300' : 'text-indigo-600'}`}>+{m.points} PTS</p>
                      <button
                        disabled={completed || loading}
                        onClick={() => completeMission(m.id, m.points)}
                        className={`mt-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${completed
                            ? 'bg-emerald-500 text-white cursor-default'
                            : 'bg-slate-900 text-white hover:bg-indigo-600'
                          } disabled:opacity-50`}
                      >
                        {completed ? 'Concluída' : loading ? 'Processando...' : 'Concluir'}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white relative overflow-hidden">
            <h2 className="text-4xl font-black mb-4 tracking-tighter">Multiplique sua Renda Diária</h2>
            <button onClick={() => setActiveTab('missions')} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Ir para Missões</button>
          </Card>
        )}

        {/* Outras abas simplificadas para garantir estabilidade visual */}
        {(activeTab === 'plans' || activeTab === 'wallet') && (
          <div className="text-center p-20 bg-white rounded-[3rem] border border-dashed">
            <Clock className="mx-auto text-slate-300 mb-4" size={48} />
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Em Breve</h2>
            <p className="text-slate-400 font-bold text-sm mt-2">Funcionalidade sendo otimizada para produção.</p>
            <button onClick={() => setActiveTab('dashboard')} className="mt-8 text-indigo-600 font-black uppercase text-xs tracking-widest underline">Voltar ao Início</button>
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
