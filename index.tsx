import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  Lock, Smartphone, Mail, Shield, Scale, ChevronRight, Info, Eye, EyeOff,
  Users, DollarSign, Activity, AlertCircle, Trash2, RefreshCw, Zap
} from 'lucide-react';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

type ViewMode = 'USER' | 'ADMIN' | 'AUTH' | 'LOADING';
type TabType = 'dashboard' | 'wallet' | 'admin_overview';

const STORAGE_KEYS = {
  SESSION: 'tarefapro_v3_session',
  STATS: 'tarefapro_v3_stats'
};

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
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
<<<<<<< HEAD
  const [withdrawStatus, setWithdrawStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

=======
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawStatus, setWithdrawStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
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

  const fetchCloudData = useCallback(async () => {
    setIsSyncing(true);
<<<<<<< HEAD
    await new Promise(r => setTimeout(r, 600));
=======
    await new Promise(r => setTimeout(r, 800)); // Simula latência de rede
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) setPlatformStats(JSON.parse(savedStats));
    setIsSyncing(false);
  }, []);

  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (savedSession) {
      const { viewMode: savedMode, userData: savedUser } = JSON.parse(savedSession);
      setUserData(savedUser);
      setViewMode(savedMode);
      setActiveTab(savedMode === 'ADMIN' ? 'admin_overview' : 'dashboard');
    } else {
      setViewMode('AUTH');
    }
    fetchCloudData();
  }, [fetchCloudData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isWesley = formData.email.toLowerCase() === ADMIN_EMAIL && formData.password === ADMIN_PASS;
      const newMode: ViewMode = isWesley ? 'ADMIN' : 'USER';
      const newUserData = {
        ...userData,
        email: formData.email,
        name: isWesley ? "Wesley Bizerra" : (formData.name || "Consultor"),
        pixKey: isWesley ? ADMIN_PIX : (userData.pixKey || "")
      };
      setUserData(newUserData);
      setViewMode(newMode);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ viewMode: newMode, userData: newUserData }));
      setActiveTab(isWesley ? 'admin_overview' : 'dashboard');
<<<<<<< HEAD
    }, 1000);
=======
    }, 1200);
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
  };

  const handleWithdraw = async () => {
    const amount = viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance;
    const pixToUse = viewMode === 'ADMIN' ? ADMIN_PIX : userData.pixKey;

    if (amount <= 0) return alert("Você não possui saldo para sacar.");
    if (!pixToUse) return alert("Cadastre uma chave PIX antes de sacar.");

    setWithdrawStatus('PROCESSING');
<<<<<<< HEAD

    try {
=======
    
    try {
      // CHAMADA REAL PARA O BACKEND DO NETLIFY
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
      const response = await fetch('/.netlify/functions/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          pixKey: pixToUse,
<<<<<<< HEAD
          pixKeyType: 'EVP',
=======
          pixKeyType: 'EVP', // Chave Aleatória por padrão
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
          description: `Saque TarefaPro - ${userData.name}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setWithdrawStatus('SUCCESS');
        if (viewMode === 'ADMIN') {
          const newStats = { ...platformStats, adminCommission: 0 };
          setPlatformStats(newStats);
          localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
        } else {
          setUserData(p => ({ ...p, balance: 0, totalPaid: p.totalPaid + p.balance }));
        }
      } else {
        throw new Error(data.error || 'Erro ao processar PIX');
      }
    } catch (e: any) {
<<<<<<< HEAD
      alert(`Erro no Saque: ${e.message}`);
      setWithdrawStatus('IDLE');
    } finally {
      setTimeout(() => setWithdrawStatus('IDLE'), 3000);
=======
      alert(`Erro: ${e.message}`);
      setWithdrawStatus('IDLE');
    } finally {
      setTimeout(() => setWithdrawStatus('IDLE'), 4000);
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
    }
  };

  const simulateTask = () => {
    const value = 25.00;
    const commission = value * 0.10;
    setUserData(p => ({ ...p, balance: p.balance + (value - commission) }));
<<<<<<< HEAD
    const newStats = {
      ...platformStats,
      totalRevenue: platformStats.totalRevenue + value,
      adminCommission: platformStats.adminCommission + commission,
      activeUsers: platformStats.activeUsers || 1
=======
    const newStats = { 
        ...platformStats, 
        totalRevenue: platformStats.totalRevenue + value, 
        adminCommission: platformStats.adminCommission + commission,
        activeUsers: platformStats.activeUsers || 1
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
    };
    setPlatformStats(newStats);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
  };

  if (viewMode === 'LOADING') return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <RefreshCw className="text-indigo-500 animate-spin mb-4" size={48} />
<<<<<<< HEAD
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Protegendo sua Conexão Cloud...</p>
=======
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Autenticando na Nuvem...</p>
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
    </div>
  );

  if (viewMode === 'AUTH') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3.5rem] p-12 shadow-3xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
            <Zap size={40} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">TarefaPro</h1>
<<<<<<< HEAD
          <Badge variant="premium">Acesso Wesley Master</Badge>
=======
          <Badge variant="premium">Plataforma Oficial</Badge>
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">E-mail</label>
<<<<<<< HEAD
            <input type="email" placeholder="wesleybizerra@hotmail.com" onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white transition-all font-bold" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Senha</label>
            <input type="password" placeholder="••••••••" onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white transition-all font-bold" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest">
            {loading ? 'Sincronizando...' : 'Entrar no Sistema'}
=======
            <input type="email" placeholder="wesleybizerra@hotmail.com" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white transition-all font-bold" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Senha</label>
            <input type="password" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white transition-all font-bold" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest">
            {loading ? 'Sincronizando...' : 'Acessar Painel'}
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-12">
        <div className="flex items-center gap-4 mb-20">
          <Zap className="text-indigo-600" size={32} fill="currentColor" />
<<<<<<< HEAD
          <span className="font-black text-2xl tracking-tighter text-slate-900">TarefaPro</span>
        </div>
        <nav className="space-y-4">
          {viewMode === 'ADMIN' ? (
            <button onClick={() => setActiveTab('admin_overview')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'admin_overview' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400'}`}><LayoutDashboard /> Gestão Wesley</button>
          ) : (
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400'}`}><LayoutDashboard /> Home</button>
          )}
          <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? (viewMode === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white') : 'text-slate-400'}`}><Wallet /> Carteira Asaas</button>
        </nav>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEYS.SESSION); window.location.reload(); }} className="mt-auto flex items-center gap-5 px-7 py-5 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-colors">
          <LogOut /> Encerrar
=======
          <span className="font-black text-2xl tracking-tighter">TarefaPro</span>
        </div>
        <nav className="space-y-4">
          {viewMode === 'ADMIN' ? (
            <button onClick={() => setActiveTab('admin_overview')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'admin_overview' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400'}`}><LayoutDashboard /> Gestão Master</button>
          ) : (
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400'}`}><LayoutDashboard /> Início</button>
          )}
          <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? (viewMode === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white') : 'text-slate-400'}`}><Wallet /> Carteira PIX</button>
        </nav>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEYS.SESSION); window.location.reload(); }} className="mt-auto flex items-center gap-5 px-7 py-5 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-colors">
          <LogOut /> Sair
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-16 overflow-y-auto pb-32">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
          <div>
<<<<<<< HEAD
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{viewMode === 'ADMIN' ? 'Dashboard Wesley' : 'Seu Painel'}</h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{isSyncing ? 'Carregando...' : 'Cloud Ativa'}</span>
              </div>
              <Badge variant={viewMode === 'ADMIN' ? 'premium' : 'success'}>{viewMode === 'ADMIN' ? 'ADMIN MASTER' : 'VERIFICADO'}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white p-4 pr-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">
              {userData.name.charAt(0)}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Saldo Líquido</p>
              <p className="text-3xl font-black text-indigo-600 tracking-tighter leading-none">
                R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}
              </p>
            </div>
=======
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{viewMode === 'ADMIN' ? 'Painel do Wesley' : 'Área do Consultor'}</h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{isSyncing ? 'Conectando...' : 'Servidor Ativo'}</span>
              </div>
              <Badge variant={viewMode === 'ADMIN' ? 'premium' : 'success'}>{viewMode === 'ADMIN' ? 'ADMINISTRADOR' : 'VERIFICADO'}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white p-4 pr-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">
               {userData.name.charAt(0)}
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Saldo em Conta</p>
                <p className="text-3xl font-black text-indigo-600 tracking-tighter">
                  R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}
                </p>
             </div>
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
          </div>
        </header>

        {viewMode === 'ADMIN' && activeTab === 'admin_overview' && (
          <div className="space-y-8 animate-fade-in">
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Comissão Wesley (10%)" value={`R$ ${platformStats.adminCommission.toFixed(2)}`} icon={<DollarSign />} variant="dark" trend="Líquido Asaas" />
              <StatCard title="Consultores" value={platformStats.activeUsers.toString()} icon={<Users />} />
              <StatCard title="Volume Geral" value={`R$ ${platformStats.totalRevenue.toFixed(2)}`} icon={<Activity />} />
              <StatCard title="Pendente" value="0" icon={<Clock />} />
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden border border-slate-800">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-4xl font-black tracking-tighter">Gestão Financeira Cloud.</h2>
                <p className="text-slate-400 text-lg mt-4 font-medium">As tarefas executadas pelos usuários alimentam sua comissão automaticamente. O saque cai na conta {ADMIN_PIX}.</p>
                <div className="mt-8 flex items-center gap-3 text-[11px] font-black uppercase text-indigo-400 bg-white/5 p-4 rounded-2xl w-fit border border-white/10">
                  <ShieldCheck size={18} /> Destino Master: {ADMIN_PIX}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
            </div>
=======
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <StatCard title="Minha Lucro (10%)" value={`R$ ${platformStats.adminCommission.toFixed(2)}`} icon={<DollarSign />} variant="dark" trend="Real-time" />
               <StatCard title="Total Consultores" value={platformStats.activeUsers.toString()} icon={<Users />} />
               <StatCard title="Volume de Tarefas" value={`R$ ${platformStats.totalRevenue.toFixed(2)}`} icon={<Activity />} />
               <StatCard title="Saques Hoje" value="0" icon={<Clock />} />
             </div>
             <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden border border-slate-800">
               <div className="relative z-10 max-w-lg">
                 <h2 className="text-4xl font-black tracking-tighter">Gestão de Lucros.</h2>
                 <p className="text-slate-400 text-lg mt-4 font-medium">Todas as tarefas geram 10% de comissão imediata para você. O saque é enviado para sua chave cadastrada.</p>
                 <div className="mt-8 flex items-center gap-3 text-[11px] font-black uppercase text-indigo-400 bg-white/5 p-4 rounded-2xl w-fit border border-white/5">
                    <ShieldCheck size={18} /> Sua Chave PIX: {ADMIN_PIX}
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
             </div>
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
          </div>
        )}

        {viewMode === 'USER' && activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Meu Saldo" value={`R$ ${userData.balance.toFixed(2)}`} icon={<Wallet />} />
              <StatCard title="Auditoria" value="R$ 0,00" icon={<RefreshCw />} />
              <StatCard title="Pagamentos" value={`R$ ${userData.totalPaid.toFixed(2)}`} icon={<CheckCircle />} />
            </div>
            <div className="bg-indigo-600 rounded-[3.5rem] p-16 text-white text-center shadow-3xl relative overflow-hidden group">
              <h2 className="text-5xl font-black tracking-tighter mb-4">Iniciar Trabalho.</h2>
              <p className="text-indigo-100 text-xl mb-10 max-w-md mx-auto">Simule uma tarefa para testar o fluxo de pagamento e comissão do sistema.</p>
              <button onClick={simulateTask} className="bg-white text-indigo-600 px-20 py-8 rounded-[2.5rem] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">
                TESTAR TAREFA (R$ 25,00)
              </button>
            </div>
=======
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard title="Disponível" value={`R$ ${userData.balance.toFixed(2)}`} icon={<Wallet />} />
               <StatCard title="Em Auditoria" value="R$ 0,00" icon={<RefreshCw />} />
               <StatCard title="Total Pago" value={`R$ ${userData.totalPaid.toFixed(2)}`} icon={<CheckCircle />} />
             </div>
             <div className="bg-indigo-600 rounded-[3.5rem] p-16 text-white text-center shadow-3xl relative overflow-hidden">
                <h2 className="text-5xl font-black tracking-tighter mb-4">Gerar Renda.</h2>
                <p className="text-indigo-100 text-xl mb-10 max-w-md mx-auto">Sua conta está habilitada. Execute a tarefa teste para ver seu saldo subir.</p>
                <button onClick={simulateTask} className="bg-white text-indigo-600 px-20 py-8 rounded-[2.5rem] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">
                   TESTAR TAREFA (R$ 25,00)
                </button>
             </div>
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="max-w-2xl mx-auto py-10 animate-fade-in">
<<<<<<< HEAD
            <div className="bg-white p-12 rounded-[3.5rem] shadow-3xl border border-slate-100">
              <h2 className="text-3xl font-black tracking-tighter mb-10">Resgate de Saldo</h2>
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white mb-10 shadow-2xl">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Valor disponível para PIX</p>
                <p className="text-6xl font-black tracking-tighter mb-10">R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}</p>
                <div className="border-t border-white/10 pt-8 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Enviando para PIX</p>
                    <p className="text-indigo-400 font-mono text-sm">{viewMode === 'ADMIN' ? ADMIN_PIX : (userData.pixKey || 'Vincule seu PIX')}</p>
                  </div>
                  <Badge variant="success">Processo via Asaas</Badge>
                </div>
              </div>
              <button onClick={handleWithdraw} disabled={withdrawStatus !== 'IDLE' || (viewMode === 'ADMIN' ? platformStats.adminCommission <= 0 : userData.balance <= 0)} className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-3xl hover:bg-indigo-700 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3">
                {withdrawStatus === 'PROCESSING' ? <RefreshCw className="animate-spin" /> : <Zap fill="currentColor" size={24} />}
                {withdrawStatus === 'PROCESSING' ? 'PROCESSANDO NO BANCO...' : 'SOLICITAR PIX IMEDIATO'}
              </button>
              {withdrawStatus === 'SUCCESS' && (
                <div className="mt-8 p-6 bg-emerald-50 text-emerald-700 rounded-3xl text-center font-black animate-bounce border border-emerald-100">
                  SOLICITAÇÃO ENVIADA À ASAAS!
                </div>
              )}
            </div>
=======
             <div className="bg-white p-12 rounded-[3.5rem] shadow-3xl border border-slate-100">
                <h2 className="text-3xl font-black tracking-tighter mb-10">Solicitar PIX</h2>
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white mb-10 shadow-2xl">
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Valor para resgate</p>
                   <p className="text-6xl font-black tracking-tighter mb-10">R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}</p>
                   <div className="border-t border-white/10 pt-8 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Conta de Destino</p>
                        <p className="text-indigo-400 font-mono text-sm">{viewMode === 'ADMIN' ? ADMIN_PIX : (userData.pixKey || 'Vincular PIX no Perfil')}</p>
                      </div>
                      <Badge variant="success">PIX Ativo</Badge>
                   </div>
                </div>
                <button onClick={handleWithdraw} disabled={withdrawStatus !== 'IDLE' || (viewMode === 'ADMIN' ? platformStats.adminCommission <= 0 : userData.balance <= 0)} className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-3xl hover:bg-indigo-700 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3">
                   {withdrawStatus === 'PROCESSING' ? <RefreshCw className="animate-spin" /> : <Zap fill="currentColor" size={24} />}
                   {withdrawStatus === 'PROCESSING' ? 'PROCESSANDO SAQUE...' : 'CONFIRMAR SAQUE PIX'}
                </button>
                {withdrawStatus === 'SUCCESS' && (
                   <div className="mt-8 p-6 bg-emerald-50 text-emerald-700 rounded-3xl text-center font-black animate-bounce border border-emerald-100">
                      DINHEIRO ENVIADO COM SUCESSO!
                   </div>
                )}
             </div>
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
          </div>
        )}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
<<<<<<< HEAD
}
=======
}
>>>>>>> 46d733016c8728a7432888dc3beb8afab971025e
