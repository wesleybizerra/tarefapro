
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
    name: "Usuário", email: "", points: 0, balance: 0.00, plan: 'FREE', pixKey: '', pixType: 'CPF'
  });
  const [platformStats, setPlatformStats] = useState<any>({ adminCommission: 0, activeUsers: 0, members: [] });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Missões Diárias Estáticas
  const dailyMissions = [
    { id: 1, title: "Avaliar App na Store", points: 150, description: "Dê 5 estrelas e comente algo positivo." },
    { id: 2, title: "Responder Pesquisa de Mercado", points: 350, description: "Pesquisa sobre hábitos de consumo." },
    { id: 3, title: "Assistir Vídeo Tutorial", points: 80, description: "Aprenda a usar a plataforma em 2 min." },
    { id: 4, title: "Seguir no Instagram", points: 120, description: "Acompanhe as novidades da TarefaPro." },
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
            // Limpa a URL
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
      const interval = setInterval(fetchSync, 5000);
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
    } catch (e) { alert("Erro ao gerar pagamento"); }
    finally { setLoading(false); }
  };

  const completeMission = async (missionId: number) => {
    try {
      const res = await fetch('/api/complete-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, missionId })
      });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        alert(`Sucesso! Você ganhou ${data.earnedPoints} pontos.`);
      }
    } catch (e) { }
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
    } catch (e) { }
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
        <div className="mt-8 pt-8 border-t">
          <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Conta Teste Master</p>
          <button
            onClick={() => setFormData({ email: 'wesleybizerra01@outlook.com', password: 'Cadernorox@27', name: '' })}
            className="w-full text-xs font-bold text-indigo-600 bg-indigo-50 py-3 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Preencher Dados Elite (wesleybizerra01)
          </button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Overlay de Pagamento */}
      {paymentProcessing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
          <div className="text-center p-10 bg-white rounded-[3rem] text-slate-900 shadow-2xl">
            <Loader2 className="animate-spin text-indigo-600 mx-auto mb-6" size={60} />
            <h2 className="text-2xl font-black mb-2">Processando Plano</h2>
            <p className="text-slate-500 font-bold">Verificando sua assinatura com o Mercado Pago...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
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

      {/* Main Content */}
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

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-full bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white relative overflow-hidden">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-4xl font-black mb-4 tracking-tighter">Multiplique sua Renda Diária</h2>
                <p className="text-indigo-100 font-medium mb-8">Complete missões, acumule pontos e troque por dinheiro real direto no seu PIX.</p>
                <button onClick={() => setActiveTab('missions')} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-50 transition-colors">Começar Missões</button>
              </div>
              <Zap className="absolute right-[-20px] bottom-[-20px] text-white/10" size={300} fill="currentColor" />
            </Card>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-black tracking-tight">Missões Diárias</h2>
              <p className="text-slate-400 text-xs font-bold uppercase">Reseta em 14h 22m</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyMissions.map((m) => (
                <Card key={m.id} className="flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-400 font-medium">{m.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-600">+{m.points} PTS</p>
                    <button onClick={() => completeMission(m.id)} className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">Concluir</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-3xl font-black tracking-tight mb-2">Planos de Aceleração</h2>
              <p className="text-slate-400 font-medium">Aumente seus ganhos em até 30% e desbloqueie recursos exclusivos de saque.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'start', name: 'Iniciante', price: 5, bonus: '5%', color: 'slate' },
                { id: 'pro', name: 'Pro VIP', price: 10, bonus: '15%', color: 'indigo', featured: true },
                { id: 'elite', name: 'Elite Master', price: 15, bonus: '30%', color: 'purple' },
              ].map((p) => (
                <Card key={p.id} className={`flex flex-col ${p.featured ? 'border-indigo-600 ring-4 ring-indigo-50' : ''} ${userData.plan === p.name.split(' ')[0].toUpperCase() ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="mb-6">
                    <h3 className="text-xl font-black">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black">R$ {p.price.toFixed(2)}</span>
                      <span className="text-slate-400 text-xs font-bold uppercase">/ único</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle size={16} className="text-emerald-500" /> Bônus de {p.bonus} nos pontos</li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle size={16} className="text-emerald-500" /> Suporte Prioritário</li>
                    {p.id !== 'start' && <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle size={16} className="text-emerald-500" /> Saque Via PIX Instantâneo</li>}
                    {p.id === 'elite' && <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle size={16} className="text-emerald-500" /> Missões VIP (5x Pontos)</li>}
                  </ul>
                  <button
                    onClick={() => buyPlan(p.id)}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${userData.plan === p.id.toUpperCase() ? 'bg-slate-200 text-slate-400' : p.featured ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                  >
                    {userData.plan === p.name.split(' ')[0].toUpperCase() ? 'Plano Atual' : 'Comprar Agora'}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <ArrowRightLeft className="text-indigo-600" />
                <h2 className="font-black text-xl">Trocar Pontos</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl text-center">
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Seus Pontos Atuais</p>
                <p className="text-4xl font-black text-indigo-600 mb-4">{userData.points.toLocaleString()}</p>
                <div className="flex items-center justify-between text-xs font-black text-slate-400 border-t pt-4">
                  <span>1.000 PTS</span>
                  <ChevronRight size={14} />
                  <span>R$ 1,00</span>
                </div>
              </div>
              <button onClick={convertPoints} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100">
                Converter em R$ {(userData.points / 1000).toFixed(2)}
              </button>
            </Card>

            <Card className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <Smartphone className="text-emerald-600" />
                <h2 className="font-black text-xl">Sacar Via PIX</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {['CPF', 'EMAIL', 'CELULAR', 'ALEATORIA'].map(type => (
                    <button key={type} onClick={() => setUserData({ ...userData, pixType: type })} className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${userData.pixType === type ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{type}</button>
                  ))}
                </div>
                <input type="text" placeholder="Sua Chave PIX" value={userData.pixKey} onChange={e => setUserData({ ...userData, pixKey: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-emerald-600" />
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
                    <span>Disponível para Saque:</span>
                    <span className="font-black text-lg">R$ {userData.balance.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700">
                  Solicitar Saque
                </button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Processamento em até 24 horas úteis</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'admin_overview' && viewMode === 'ADMIN' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-900 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Seu Lucro (Comissão)</p>
                <p className="text-3xl font-black text-indigo-400">R$ {platformStats.adminCommission.toFixed(2)}</p>
                <div className="mt-4 p-2 bg-slate-800 rounded-lg inline-flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase">
                  <Activity size={12} /> Taxa de Ganho: 2x
                </div>
              </Card>
              <Card>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Membros Ativos</p>
                <p className="text-3xl font-black">{platformStats.activeUsers}</p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black uppercase text-xs tracking-widest">Lista de Membros</h3>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="divide-y">
                {platformStats.members?.map((m: any, i: number) => (
                  <div key={i} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black">{m.name[0]}</div>
                      <div>
                        <p className="font-black text-sm">{m.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{m.plan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-indigo-600">R$ {m.balance.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{m.points} Pontos</p>
                    </div>
                  </div>
                ))}
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
