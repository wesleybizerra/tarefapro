
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, LayoutDashboard, LogOut,
  Users, DollarSign, Activity, RefreshCw, Zap, User
} from 'lucide-react';
import { Buffer } from 'buffer';

// Fix: Cast window to any to avoid TypeScript error about Buffer property not existing on Window.
if (typeof window !== 'undefined') {
  (window as any).Buffer = (window as any).Buffer || Buffer;
}

// --- TIPOS ---
type ViewMode = 'USER' | 'ADMIN' | 'AUTH' | 'LOADING';
type TabType = 'dashboard' | 'wallet' | 'admin_overview';

// --- COMPONENTES DE UI ---
const Badge = ({ children, variant = 'default' }: { children?: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    premium: 'bg-indigo-600 text-white shadow-md',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[variant]}`}>{children}</span>;
};

const StatCard = ({ title, value, icon, trend, variant = 'light' }: { title: string, value: string, icon: any, trend?: string, variant?: 'light' | 'dark' }) => (
  <div className={`${variant === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} p-6 rounded-[2.5rem] border ${variant === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm hover:shadow-xl transition-all duration-300 group`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${variant === 'dark' ? 'bg-slate-800 text-indigo-400' : 'bg-slate-50 text-slate-500'} rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
        {icon}
      </div>
      {trend && <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">{trend}</span>}
    </div>
    <p className={`text-[11px] font-black ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-[0.2em] mb-1`}>{title}</p>
    <p className="text-2xl font-black tracking-tighter">{value}</p>
  </div>
);

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOADING');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const ADMIN_EMAIL = "wesleybizerra@hotmail.com";
  const ADMIN_PASS = "Cadernorox@27";
  const ADMIN_PIX = "71981574664";

  const [platformStats, setPlatformStats] = useState({
    totalRevenue: 0.00,
    adminCommission: 0.00,
    activeUsers: 0,
    pendingWithdrawals: 0
  });

  const [userData, setUserData] = useState({
    name: "Consultor",
    email: "",
    balance: 0.00,
    pending: 0.00,
    totalPaid: 0.00,
    pixKey: ""
  });

  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  useEffect(() => {
    const savedSession = localStorage.getItem('tarefapro_session');
    const savedStats = localStorage.getItem('tarefapro_stats');

    if (savedStats) {
      try {
        setPlatformStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Erro ao carregar stats");
      }
    }

    if (savedSession) {
      try {
        const { viewMode: savedMode, userData: savedUser } = JSON.parse(savedSession);
        setUserData(savedUser);
        setViewMode(savedMode);
        setActiveTab(savedMode === 'ADMIN' ? 'admin_overview' : 'dashboard');
      } catch (e) {
        setViewMode('AUTH');
      }
    } else {
      setViewMode('AUTH');
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const isWesley = formData.email.toLowerCase() === ADMIN_EMAIL && formData.password === ADMIN_PASS;

      const newMode: ViewMode = isWesley ? 'ADMIN' : 'USER';
      const newUserData = {
        ...userData,
        email: formData.email,
        name: isWesley ? "Wesley Bizerra" : (formData.name || (isLoginMode ? "Consultor" : formData.name)),
        pixKey: isWesley ? ADMIN_PIX : (userData.pixKey || "Pendente_Configuração")
      };

      setUserData(newUserData);
      setViewMode(newMode);
      localStorage.setItem('tarefapro_session', JSON.stringify({ viewMode: newMode, userData: newUserData }));
      setActiveTab(isWesley ? 'admin_overview' : 'dashboard');
    }, 800);
  };

  const handleWithdraw = async () => {
    const amount = viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance;
    const pixToUse = viewMode === 'ADMIN' ? ADMIN_PIX : userData.pixKey;

    if (amount <= 0) return alert("Você não possui saldo para sacar.");

    setWithdrawStatus('PROCESSING');

    try {
      const response = await fetch('/api/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          pixKey: pixToUse,
          description: `Saque TarefaPro - ${userData.name}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setWithdrawStatus('SUCCESS');
        if (viewMode === 'ADMIN') {
          setPlatformStats(p => ({ ...p, adminCommission: 0 }));
        } else {
          setUserData(p => ({ ...p, balance: 0, totalPaid: p.totalPaid + p.balance }));
        }
      } else {
        throw new Error(data.details || data.error || 'Erro no saque');
      }
    } catch (e: any) {
      setWithdrawStatus('ERROR');
      setErrorMessage(e.message);
    } finally {
      setTimeout(() => setWithdrawStatus('IDLE'), 4000);
    }
  };

  const simulateTask = () => {
    const value = 25.00;
    const commission = value * 0.10;
    setUserData(p => ({ ...p, balance: p.balance + (value - commission) }));
    const newStats = {
      ...platformStats,
      totalRevenue: platformStats.totalRevenue + value,
      adminCommission: platformStats.adminCommission + commission,
      activeUsers: Math.max(platformStats.activeUsers, 1)
    };
    setPlatformStats(newStats);
    localStorage.setItem('tarefapro_stats', JSON.stringify(newStats));
  };

  if (viewMode === 'LOADING') return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <RefreshCw className="text-indigo-500 animate-spin mb-4" size={48} />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Iniciando Proteção Cloud...</p>
    </div>
  );

  if (viewMode === 'AUTH') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6">
            <Zap size={40} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">TarefaPro</h1>
          <Badge variant="premium">{isLoginMode ? 'Acesso Seguro' : 'Nova Conta'}</Badge>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLoginMode && (
            <div className="relative">
              <input
                type="text"
                placeholder="Nome Completo"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold focus:border-indigo-300 transition-colors"
                required
              />
              <User className="absolute right-6 top-5 text-slate-300" size={20} />
            </div>
          )}

          <input
            type="email"
            placeholder="E-mail"
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold focus:border-indigo-300 transition-colors"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-bold focus:border-indigo-300 transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-6 bg-indigo-600 text-white rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all uppercase disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLoginMode ? 'Entrar' : 'Criar minha conta')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors"
          >
            {isLoginMode ? (
              <span>Ainda não tem conta? <strong className="text-indigo-600">Cadastre-se</strong></span>
            ) : (
              <span>Já possui uma conta? <strong className="text-indigo-600">Entrar agora</strong></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-12">
        <div className="flex items-center gap-4 mb-20">
          <Zap className="text-indigo-600" size={32} fill="currentColor" />
          <span className="font-black text-2xl text-slate-900">TarefaPro</span>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab(viewMode === 'ADMIN' ? 'admin_overview' : 'dashboard')}
            className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab !== 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <LayoutDashboard /> Home
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Wallet /> Carteira
          </button>
        </nav>
        <button
          onClick={() => { localStorage.removeItem('tarefapro_session'); window.location.reload(); }}
          className="mt-auto flex items-center gap-5 px-7 py-5 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-colors"
        >
          <LogOut /> Sair
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-16 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 leading-none">Olá, {userData.name.split(' ')[0]}</h1>
            <Badge variant={viewMode === 'ADMIN' ? 'premium' : 'success'}>{viewMode === 'ADMIN' ? 'ADMIN MASTER' : 'CONSULTOR'}</Badge>
          </div>
          <div className="bg-white p-4 pr-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">{userData.name.charAt(0)}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Saldo</p>
              <p className="text-2xl font-black text-indigo-600 tracking-tighter">R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}</p>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && viewMode === 'USER' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Disponível" value={`R$ ${userData.balance.toFixed(2)}`} icon={<Wallet />} />
              <StatCard title="Pagamentos" value={`R$ ${userData.totalPaid.toFixed(2)}`} icon={<CheckCircle />} />
              <StatCard title="Auditoria" value="R$ 0,00" icon={<Clock />} />
            </div>
            <div className="bg-indigo-600 rounded-[3.5rem] p-16 text-white text-center shadow-2xl">
              <h2 className="text-5xl font-black mb-4">Iniciar Trabalho.</h2>
              <p className="text-indigo-100 text-xl mb-10">Realize tarefas de teste para gerar comissões automáticas.</p>
              <button onClick={simulateTask} className="bg-white text-indigo-600 px-20 py-8 rounded-[2.5rem] font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                TESTAR TAREFA (R$ 25,00)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'admin_overview' && viewMode === 'ADMIN' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Sua Comissão" value={`R$ ${platformStats.adminCommission.toFixed(2)}`} icon={<DollarSign />} variant="dark" trend="10% Líquido" />
              <StatCard title="Volume Total" value={`R$ ${platformStats.totalRevenue.toFixed(2)}`} icon={<Activity />} />
              <StatCard title="Membros" value={platformStats.activeUsers.toString()} icon={<Users />} />
              <StatCard title="Pendentes" value="0" icon={<Clock />} />
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white border border-slate-800">
              <h2 className="text-4xl font-black">Gestão Master Cloud</h2>
              <p className="text-slate-400 mt-4">Painel de controle financeiro vinculado à API Asaas.</p>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto py-10 animate-fade-in">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
              <h2 className="text-3xl font-black mb-10">Resgate PIX</h2>
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white mb-10">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-4">Valor para Saque</p>
                <p className="text-6xl font-black">R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}</p>
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-500">Destino</p>
                    <p className="text-indigo-400 font-mono text-sm">{viewMode === 'ADMIN' ? ADMIN_PIX : userData.pixKey}</p>
                  </div>
                  <Badge variant="success">Asaas Transfere</Badge>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={withdrawStatus === 'PROCESSING' || (viewMode === 'ADMIN' ? platformStats.adminCommission <= 0 : userData.balance <= 0)}
                className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              >
                {withdrawStatus === 'PROCESSING' ? <RefreshCw className="animate-spin" /> : <Zap fill="currentColor" />}
                {withdrawStatus === 'PROCESSING' ? 'PROCESSANDO...' : 'SACAR AGORA'}
              </button>

              {withdrawStatus === 'SUCCESS' && <div className="mt-8 p-6 bg-emerald-50 text-emerald-700 rounded-3xl text-center font-black animate-bounce">SUCESSO! DINHEIRO ENVIADO.</div>}
              {withdrawStatus === 'ERROR' && <div className="mt-8 p-6 bg-red-50 text-red-700 rounded-3xl text-center font-black">{errorMessage}</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Renderização robusta
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
