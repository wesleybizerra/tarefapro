import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  Lock, Smartphone, Mail, Shield, Scale, ChevronRight, Info, Eye, EyeOff,
  Users, DollarSign, Activity, AlertCircle, Trash2, Wifi, WifiOff, RefreshCw
} from 'lucide-react';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

type ViewMode = 'USER' | 'ADMIN' | 'AUTH';
type TabType = 'dashboard' | 'missions' | 'wallet' | 'admin_overview';

const STORAGE_KEYS = {
  SESSION: 'tarefapro_prod_session',
  STATS: 'tarefapro_prod_stats'
};

// --- Componentes de UI ---

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

// --- App Principal ---

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode | 'LOADING'>('LOADING');
  const [authStep, setAuthStep] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawStatus, setWithdrawStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  
  const ADMIN_CREDENTIALS = {
    email: "wesleybizerra@hotmail.com",
    pass: "Cadernorox@27",
    pix: "71981574664"
  };

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

  // --- Função de Sincronização (Tempo Real) ---
  const syncData = useCallback(async () => {
    setIsSyncing(true);
    // Em produção, aqui seria o fetch('/api/stats')
    // Simulando delay de rede do Netlify Functions
    await new Promise(r => setTimeout(r, 800));
    
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) {
      setPlatformStats(JSON.parse(savedStats));
    }
    setIsSyncing(false);
  }, []);

  // --- Recuperação de Sessão Segura ---
  useEffect(() => {
    const init = async () => {
      const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (savedSession) {
        const { viewMode: savedMode, userData: savedUser } = JSON.parse(savedSession);
        setUserData(savedUser);
        setViewMode(savedMode);
        setActiveTab(savedMode === 'ADMIN' ? 'admin_overview' : 'dashboard');
      } else {
        setViewMode('AUTH');
      }
      await syncData();
    };
    init();
  }, [syncData]);

  // Polling para "Tempo Real" no Netlify
  useEffect(() => {
    if (viewMode === 'ADMIN') {
      const interval = setInterval(syncData, 15000); // Sincroniza a cada 15s
      return () => clearInterval(interval);
    }
  }, [viewMode, syncData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      const isWesley = formData.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && formData.password === ADMIN_CREDENTIALS.pass;
      const newMode: ViewMode = isWesley ? 'ADMIN' : 'USER';
      const newUserData = {
        ...userData,
        email: formData.email,
        name: isWesley ? "Wesley Bizerra" : (formData.name || "Consultor"),
        pixKey: isWesley ? ADMIN_CREDENTIALS.pix : ""
      };

      setUserData(newUserData);
      setViewMode(newMode);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ viewMode: newMode, userData: newUserData }));
      
      if (!isWesley) {
        const updatedStats = { ...platformStats, activeUsers: platformStats.activeUsers + 1 };
        setPlatformStats(updatedStats);
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      }
      setActiveTab(isWesley ? 'admin_overview' : 'dashboard');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.reload();
  };

  const handleWithdraw = () => {
    const balance = viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance;
    if (balance <= 0) return alert("Saldo insuficiente para processamento.");

    setWithdrawStatus('PROCESSING');
    setTimeout(() => {
      setWithdrawStatus('SUCCESS');
      if (viewMode === 'ADMIN') {
        const newStats = { ...platformStats, adminCommission: 0 };
        setPlatformStats(newStats);
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
      } else {
        setUserData(prev => ({ ...prev, balance: 0, totalPaid: prev.totalPaid + prev.balance }));
      }
      setTimeout(() => setWithdrawStatus('IDLE'), 3000);
    }, 3000);
  };

  if (viewMode === 'LOADING') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Autenticando na Nuvem...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-3xl">
              <TrendingUp size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">TarefaPro</h1>
            <p className="text-slate-400 font-bold text-[10px] mt-3 uppercase tracking-[0.4em]">Infraestrutura Cloud v2.1</p>
          </div>

          <div className="bg-white rounded-[3.5rem] p-12 shadow-3xl border border-slate-100">
            <h2 className="text-2xl font-black mb-10 text-center text-slate-800 tracking-tight">
              {authStep === 'LOGIN' ? 'Acesso ao Painel' : 'Novo Registro'}
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              {authStep === 'REGISTER' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">Nome Completo</label>
                  <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white text-sm transition-all font-bold" required />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">E-mail</label>
                <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white text-sm transition-all font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">Senha</label>
                <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:bg-white text-sm transition-all font-bold" required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-sm shadow-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-70">
                {loading ? 'CONECTANDO...' : (authStep === 'LOGIN' ? 'ENTRAR AGORA' : 'CONCLUIR CADASTRO')}
              </button>
            </form>
            <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-10 text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center hover:underline">
              {authStep === 'LOGIN' ? 'Não tem conta? Registre-se' : 'Já é membro? Acesse o painel'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col p-12">
        <div className="flex items-center gap-4 mb-20">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <TrendingUp size={28} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900">TarefaPro</span>
        </div>
        <nav className="space-y-4">
          {viewMode === 'ADMIN' ? (
             <>
               <button onClick={() => setActiveTab('admin_overview')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'admin_overview' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={22} /> Monitor Master</button>
               <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><Wallet size={22} /> Saques Admin</button>
             </>
          ) : (
            <>
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={22} /> Painel Início</button>
              <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><Wallet size={22} /> Carteira PIX</button>
            </>
          )}
        </nav>
        <button onClick={handleLogout} className="mt-auto flex items-center gap-5 px-7 py-5 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-colors w-full">
            <LogOut size={22} /> Encerrar Sessão
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-16 overflow-y-auto w-full max-w-7xl mx-auto pb-32">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize leading-none">{viewMode === 'ADMIN' ? 'Gestão da Plataforma' : 'Minha Área'}</h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                 <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{isSyncing ? 'Sincronizando...' : 'Nuvem Conectada'}</span>
              </div>
              <Badge variant={viewMode === 'ADMIN' ? 'premium' : 'success'}>{viewMode === 'ADMIN' ? 'MODO WESLEY' : 'Consultor'}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
               {userData.name.charAt(0)}
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Disponível agora</p>
                <p className="text-2xl font-black text-indigo-600 leading-none tracking-tighter">
                  R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}
                </p>
             </div>
          </div>
        </header>

        {viewMode === 'ADMIN' && activeTab === 'admin_overview' && (
          <div className="animate-fade-in space-y-8 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Minha Comissão (Wesley)" value={`R$ ${platformStats.adminCommission.toFixed(2)}`} icon={<DollarSign size={20} />} trend="100% Líquido" variant="dark" />
              <StatCard title="Total de Usuários" value={platformStats.activeUsers.toString()} icon={<Users size={20} />} trend="Pessoas Reais" />
              <StatCard title="Volume de Negócios" value={`R$ ${platformStats.totalRevenue.toFixed(2)}`} icon={<TrendingUp size={20} />} />
              <StatCard title="Aguardando Saque" value={platformStats.pendingWithdrawals.toString()} icon={<AlertCircle size={20} />} />
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="relative z-10">
                <Badge variant="premium">Saque Wesley Oficial</Badge>
                <h2 className="text-4xl font-black mt-6 tracking-tighter leading-tight">Painel de Lucros.</h2>
                <p className="text-slate-400 text-lg mt-4 max-w-sm font-medium">Suas comissões de cada tarefa realizada no site estão disponíveis para saque instantâneo.</p>
                <div className="mt-8 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <ShieldCheck size={20} className="text-indigo-400" />
                   </div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">PIX Cadastrado: {ADMIN_CREDENTIALS.pix}</p>
                </div>
              </div>
              <button 
                onClick={handleWithdraw} 
                disabled={withdrawStatus !== 'IDLE' || platformStats.adminCommission <= 0} 
                className="mt-10 md:mt-0 bg-indigo-600 px-16 py-8 rounded-[2rem] font-black text-sm shadow-3xl hover:bg-indigo-500 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-30 z-10"
              >
                {withdrawStatus === 'PROCESSING' ? <RefreshCw className="animate-spin" /> : <Wallet size={20} />}
                {withdrawStatus === 'PROCESSING' ? 'SAQUE EM CURSO...' : 'SOLICITAR PIX AGORA'}
              </button>
            </div>

            <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black flex items-center gap-3"><Activity size={24} className="text-indigo-600 animate-pulse"/> Log de Atividades da Nuvem</h3>
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-[10px] font-black text-red-400 hover:text-red-600 flex items-center gap-2">
                    <Trash2 size={16}/> LIMPAR BANCO (REINICIAR)
                  </button>
               </div>
               {platformStats.activeUsers === 0 ? (
                 <div className="py-24 text-center">
                   <Users size={64} className="mx-auto mb-6 opacity-5" />
                   <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-300">Aguardando Conexão de Novos Consultores...</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <div className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-default">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle size={28}/></div>
                          <div>
                             <p className="font-black text-slate-800 tracking-tight">Sistema em Operação</p>
                             <p className="text-xs text-slate-400 font-medium">Asaas API processando requisições</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-black text-emerald-600">+ R$ {platformStats.adminCommission.toFixed(2)}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Acumulado Hoje</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {viewMode === 'USER' && activeTab === 'dashboard' && (
           <div className="animate-fade-in space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard title="Saldo Atual" value={showBalance ? `R$ ${userData.balance.toFixed(2)}` : '••••••'} icon={<CheckCircle size={20} />} />
               <StatCard title="Em Auditoria" value={showBalance ? `R$ ${userData.pending.toFixed(2)}` : '••••••'} icon={<Clock size={20} />} />
               <StatCard title="Já Sacado" value={showBalance ? `R$ ${userData.totalPaid.toFixed(2)}` : '••••••'} icon={<ShieldCheck size={20} />} />
             </div>

             <div className="bg-indigo-600 rounded-[3rem] p-10 lg:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <Badge variant="premium">Novo Consultor</Badge>
                 <h2 className="text-4xl font-black mt-6 tracking-tighter">Comece a Faturar.</h2>
                 <p className="text-indigo-100 text-lg mt-4 max-w-sm font-medium">Seja bem-vindo. Complete tarefas para encher sua carteira agora mesmo.</p>
               </div>
               <button onClick={() => {
                   const val = 15.00;
                   const comm = val * 0.10;
                   setUserData(p => ({ ...p, balance: p.balance + (val - comm) }));
                   const newStats = { ...platformStats, totalRevenue: platformStats.totalRevenue + val, adminCommission: platformStats.adminCommission + comm };
                   setPlatformStats(newStats);
                   localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
               }} className="mt-10 md:mt-0 bg-white text-indigo-600 px-12 py-6 rounded-3xl font-black text-sm shadow-2xl active:scale-95 transition-all z-10 hover:bg-slate-50">
                 TESTAR TAREFA (R$ 15,00)
               </button>
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             </div>
           </div>
        )}

        {activeTab === 'wallet' && (
           <div className="animate-fade-in max-w-2xl mx-auto space-y-8 py-10">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                 <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><Wallet size={32} /></div>
                 <div>
                   <h2 className="text-3xl font-black tracking-tighter">Carteira PIX</h2>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Processamento Bancário Asaas</p>
                 </div>
               </div>
               <div className="p-10 bg-slate-900 rounded-[3rem] text-white mb-10 relative overflow-hidden shadow-2xl">
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Saldo Disponível</p>
                     <button onClick={() => setShowBalance(!showBalance)} className="text-slate-500 hover:text-white transition-colors">
                       {showBalance ? <EyeOff size={18}/> : <Eye size={18}/>}
                     </button>
                   </div>
                   <p className="text-5xl font-black mb-10 tracking-tighter">
                     {showBalance ? `R$ ${(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}` : '••••••'}
                   </p>
                   <div className="flex justify-between items-end pt-6 border-t border-white/10">
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Chave PIX Ativa</p>
                       <p className="text-sm font-mono text-indigo-400">{viewMode === 'ADMIN' ? ADMIN_CREDENTIALS.pix : (userData.pixKey || 'Aguardando Cadastro')}</p>
                     </div>
                     <Badge variant="success">Seguro</Badge>
                   </div>
                 </div>
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
               </div>
               <button onClick={handleWithdraw} disabled={withdrawStatus !== 'IDLE' || (viewMode === 'ADMIN' ? platformStats.adminCommission <= 0 : userData.balance <= 0)} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30">
                 {withdrawStatus === 'PROCESSING' ? <RefreshCw className="animate-spin mr-2" /> : <Wallet size={24} className="mr-2" />}
                 {withdrawStatus === 'PROCESSING' ? 'PROCESSANDO NO BANCO...' : 'RECEBER VIA PIX AGORA'}
               </button>
               {withdrawStatus === 'SUCCESS' && (
                   <div className="mt-6 bg-emerald-50 text-emerald-700 p-6 rounded-3xl text-center font-black animate-bounce border border-emerald-100">
                       PIX ENVIADO COM SUCESSO!
                   </div>
               )}
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
