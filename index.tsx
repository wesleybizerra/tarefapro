
import React, { useState, useEffect } from 'react';
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

  const fetchSync = async () => {
    try {
      const res = await fetch(`/api/sync?email=${userData.email}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        if (viewMode === 'ADMIN') setPlatformStats(data.stats);
      }
    } catch (e) { }
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const planId = params.get('plan');
      const email = params.get('email');

      if (status === 'success' && planId && email) {
        setPaymentProcessing(true);
        try {
          const res = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, planId })
          });
          if (res.ok) {
            const data = await res.json();
            setUserData(data.user);
            localStorage.setItem('tarefapro_session', JSON.stringify(data.user));
            alert(`Parabéns! Seu plano ${data.user.plan} foi ativado com sucesso.`);
            window.history.replaceState({}, document.title, "/");
          }
        } catch (e) {
          console.error("Erro ao confirmar plano", e);
        } finally {
          setPaymentProcessing(false);
        }
      }
    };

    const saved = localStorage.getItem('tarefapro_session');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setViewMode(user.role === 'ADMIN' ? 'ADMIN' : 'USER');
      setActiveTab(user.role === 'ADMIN' ? 'admin_overview' : 'dashboard');
      checkPaymentStatus();
    } else {
      setViewMode('AUTH');
    }
  }, []);

  useEffect(() => {
    if (userData.email) {
      const interval = setInterval(fetchSync, 10000);
      return () => clearInterval(interval);
    }
  }, [userData.email]);

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
    } catch (e) { alert("Erro ao gerar pagamento de produção"); }
    finally { setLoading(false); }
  };

  const completeMission = async (missionId: number, points: number) => {
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
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Erro ao processar missão.");
    }
  };

  const convertPoints = async () => {
    if (userData.points < 1000) return alert("Mínimo 1.000 pontos para trocar.");
    try {
      const res = await fetch('/api/convert-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });
      const data = await res.json();
      setUserData(data.user);
      alert("Pontos convertidos com sucesso!");
    } catch (e) { }
  };

  const isMissionCompleted = (missionId: number) => {
    const today = new Date().toISOString().split('T')[0];
    return userData.completedMissions?.some((m: any) => m.id === missionId && m.date === today);
  };

  if (viewMode === 'LOADING') return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black text-2xl animate-pulse">TAREFAPRO...</div>;

  if (viewMode === 'AUTH') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-indigo-200">
            <Zap fill="currentColor" size={32} />
          </div>
          <h1 className="text-2xl font-black">TarefaPro</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta'}</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-3">
          {!isLoginMode && <input type="text" placeholder="Nome Completo" required onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-600" />}
          <input type="email" placeholder="E-mail" required onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-600" />
          <input type="password" placeholder="Senha" required onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-600" />
          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform">
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
      {paymentProcessing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
          <div className="text-center p-10 bg-white rounded-[3rem] text-slate-900 shadow-2xl">
            <Loader2 className="animate-spin text-indigo-600 mx-auto mb-6" size={60} />
            <h2 className="text-2xl font-black mb-2">Plano de Produção</h2>
            <p className="text-slate-500 font-bold">Processando seu pagamento oficial...</p>
          </div>
        </div>
      )}

      <aside className="w-80 bg-white border-r p-10 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-12 font-black text-2xl">
          <div className="p-2 bg-indigo-600 rounded-xl text-white"><Zap fill="currentColor" size={20} /></div>
          TarefaPro
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab(viewMode === 'ADMIN' ? 'admin_overview' : 'dashboard')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'dashboard' || activeTab === 'admin_overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          {viewMode === 'USER' && (
            <>
              <button onClick={() => setActiveTab('missions')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'missions' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Trophy size={18} /> Missões Diárias
              </button>
              <button onClick={() => setActiveTab('plans')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Star size={18} /> Planos VIP
              </button>
              <button onClick={() => setActiveTab('wallet')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
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
            <h1 className="text-3xl font-black tracking-tighter">Olá, {userData.name.split(' ')[0]}</h1>
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
                <p className="text-xl font-black text-slate-900">{userData.points.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 py-3 px-6">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</p>
                <p className="text-xl font-black text-emerald-600">R$ {userData.balance.toFixed(2)}</p>
              </div>
            </Card>
          </div>
        </header>

        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-black tracking-tight">Missões Profissionais</h2>
              <p className="text-slate-400 text-xs font-bold uppercase">Disponíveis hoje</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyMissions.map((m) => {
                const completed = isMissionCompleted(m.id);
                return (
                  <Card key={m.id} className={`flex items-center justify-between transition-all ${completed ? 'bg-slate-50 border-slate-200 opacity-70' : 'hover:border-indigo-200'}`}>
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
                        disabled={completed}
                        onClick={() => completeMission(m.id, m.points)}
                        className={`mt-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${completed
                            ? 'bg-emerald-500 text-white cursor-default'
                            : 'bg-slate-900 text-white hover:bg-indigo-600'
                          }`}
                      >
                        {completed ? 'Concluída' : 'Concluir'}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Outras tabs mantêm a estrutura funcional original com os dados sincronizados */}
        {activeTab === 'dashboard' && (
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white relative overflow-hidden">
            <h2 className="text-4xl font-black mb-4 tracking-tighter">Multiplique sua Renda Diária</h2>
            <button onClick={() => setActiveTab('missions')} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Começar Missões</button>
          </Card>
        )}

        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'start', name: 'Iniciante', price: 5, bonus: '5%' },
              { id: 'pro', name: 'Pro VIP', price: 10, bonus: '15%', featured: true },
              { id: 'elite', name: 'Elite Master', price: 15, bonus: '30%' },
            ].map((p) => (
              <Card key={p.id} className={`${p.featured ? 'border-indigo-600 ring-4 ring-indigo-50' : ''}`}>
                <h3 className="text-xl font-black">{p.name}</h3>
                <p className="text-3xl font-black mt-2">R$ {p.price.toFixed(2)}</p>
                <ul className="mt-6 space-y-3 mb-8 text-sm font-bold text-slate-600">
                  <li><CheckCircle size={14} className="inline text-emerald-500 mr-2" /> Bônus de {p.bonus} nos ganhos</li>
                  <li><CheckCircle size={14} className="inline text-emerald-500 mr-2" /> Suporte de Produção</li>
                </ul>
                <button onClick={() => buyPlan(p.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Ativar Plano</button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
