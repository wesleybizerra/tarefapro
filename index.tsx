import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  Lock, Smartphone, Mail, Shield, Scale, ChevronRight, Info, Eye, EyeOff,
  Users, DollarSign, Activity, AlertCircle
} from 'lucide-react';
import { Buffer } from 'buffer';

// Correção global para Buffer
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

type ViewMode = 'USER' | 'ADMIN' | 'AUTH';
type TabType = 'dashboard' | 'missions' | 'wallet' | 'profile' | 'admin_overview' | 'admin_users';

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

// --- Aplicação Principal ---

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('AUTH');
  const [authStep, setAuthStep] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawStatus, setWithdrawStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  // Credenciais do Administrador
  const ADMIN_EMAIL = "wesleybizerra@hotmail.com";
  const ADMIN_PASS = "Cadernorox@27";
  const ADMIN_PIX = "71981574664";

  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const USER_DATA = {
    name: "Wesley Bizerra",
    balance: { available: 142.50, pending: 35.00, totalPaid: 1256.90 },
    pixKey: viewMode === 'ADMIN' ? ADMIN_PIX : "wesley***@email.com"
  };

  // Dados Simulados de Administração (Lucro do Dono do Site)
  const PLATFORM_STATS = {
    totalRevenue: 45890.00,
    adminCommission: 8245.50, // O que o Wesley tem pra sacar
    activeUsers: 1245,
    pendingWithdrawals: 12
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      if (formData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && formData.password === ADMIN_PASS) {
        setViewMode('ADMIN');
        setActiveTab('admin_overview');
      } else {
        setViewMode('USER');
        setActiveTab('dashboard');
      }
    }, 1500);
  };

  const handleWithdraw = () => {
    setWithdrawStatus('PROCESSING');
    // Simulação da chamada Asaas
    setTimeout(() => {
      setWithdrawStatus('SUCCESS');
      setTimeout(() => setWithdrawStatus('IDLE'), 4000);
    }, 3000);
  };

  // --- Painel do Administrador ---
  const renderAdminDashboard = () => (
    <div className="animate-fade-in space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Sua Comissão (Wesley)" value={`R$ ${PLATFORM_STATS.adminCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<DollarSign size={20} />} trend="Dono do Site" variant="dark" />
        <StatCard title="Usuários Ativos" value={PLATFORM_STATS.activeUsers.toString()} icon={<Users size={20} />} trend="+12 hoje" />
        <StatCard title="Volume Total (Geral)" value={`R$ ${PLATFORM_STATS.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<TrendingUp size={20} />} />
        <StatCard title="Saques Pendentes" value={PLATFORM_STATS.pendingWithdrawals.toString()} icon={<AlertCircle size={20} />} variant={PLATFORM_STATS.pendingWithdrawals > 0 ? 'light' : 'light'} />
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <Badge variant="premium">Área Administrativa Wesley</Badge>
          <h2 className="text-4xl font-black mt-6 tracking-tighter leading-none">Resgate seus lucros.</h2>
          <p className="text-slate-400 text-lg mt-4 max-w-md font-medium">
            Sua comissão acumulada de todas as tarefas realizadas pelos usuários está pronta. Saque agora para seu PIX cadastrado.
          </p>
          <div className="mt-8 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
               <ShieldCheck size={20} />
             </div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">PIX Configurado: {ADMIN_PIX}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 z-10">
          <button 
            onClick={handleWithdraw}
            disabled={withdrawStatus !== 'IDLE'}
            className="mt-10 md:mt-0 bg-indigo-600 text-white px-14 py-7 rounded-3xl font-black text-sm shadow-2xl hover:bg-indigo-500 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {withdrawStatus === 'PROCESSING' ? <Activity className="animate-spin" /> : <Wallet size={20} />}
            {withdrawStatus === 'PROCESSING' ? 'PROCESSANDO ASAAS...' : 'SACAR COMISSÃO PIX'}
          </button>
          {withdrawStatus === 'SUCCESS' && (
            <p className="text-emerald-400 font-bold text-xs animate-bounce">Saque enviado com sucesso!</p>
          )}
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 p-10">
         <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Activity size={20} className="text-indigo-600"/> Monitor de Atividade em Tempo Real</h3>
         <div className="space-y-4">
            {[
              { user: "User_9283", action: "Concluiu tarefa de R$ 15,00", commission: "R$ 1,50", time: "2 min atrás" },
              { user: "User_1102", action: "Solicitou saque de R$ 50,00", commission: "R$ 0,00", time: "5 min atrás" },
              { user: "User_4492", action: "Novo cadastro realizado", commission: "R$ 0,00", time: "12 min atrás" },
            ].map((log, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{log.user}</p>
                  <p className="text-xs text-slate-400">{log.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-600">+{log.commission}</p>
                  <p className="text-[10px] text-slate-300 uppercase font-bold">{log.time}</p>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  // --- Dashboard do Usuário Normal ---
  const renderDashboard = () => (
    <div className="animate-fade-in space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Saldo Disponível" value={showBalance ? `R$ ${USER_DATA.balance.available.toFixed(2)}` : '••••••'} icon={<CheckCircle size={20} />} trend="+R$ 42,50 hoje" />
        <StatCard title="Em Análise" value={showBalance ? `R$ ${USER_DATA.balance.pending.toFixed(2)}` : '••••••'} icon={<Clock size={20} />} />
        <StatCard title="Total Sacado" value={showBalance ? `R$ ${USER_DATA.balance.totalPaid.toFixed(2)}` : '••••••'} icon={<ShieldCheck size={20} />} />
      </div>

      <div className="bg-indigo-600 rounded-[3rem] p-8 lg:p-14 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <Badge variant="premium">Saque Instantâneo</Badge>
          <h2 className="text-4xl font-black mt-6 tracking-tighter leading-none">Dinheiro na conta em instantes.</h2>
          <p className="text-indigo-100 text-lg mt-4 max-w-md font-medium">
            Seu saldo está liberado para resgate via PIX. Sem taxas ocultas, direto para sua conta bancária.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('wallet')}
          className="mt-10 md:mt-0 bg-white text-indigo-600 px-12 py-6 rounded-3xl font-black text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95 z-10"
        >
          <Wallet size={20} /> SOLICITAR PIX
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tarefas Disponíveis</h3>
          <button onClick={() => setActiveTab('missions')} className="text-sm font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">Explorar todas</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 1, title: 'Feedback de Usabilidade: Banco X', reward: 15.00, type: 'FINANCEIRO' },
            { id: 2, title: 'Teste de Interface: E-commerce', reward: 12.50, type: 'UX REVIEW' },
          ].map(m => (
            <div key={m.id} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer group shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                  <Smartphone size={28} />
                </div>
                <div>
                  <Badge variant={m.reward > 10 ? 'success' : 'default'}>{m.type}</Badge>
                  <h4 className="font-black text-slate-800 mt-2 text-lg tracking-tight">{m.title}</h4>
                  <p className="text-sm font-black text-indigo-600 mt-0.5">R$ {m.reward.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <ArrowUpRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // --- Renderização da Carteira ---
  const renderWallet = () => (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8 py-10">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
            <Wallet size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Sua Carteira</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Processamento Bancário Seguro</p>
          </div>
        </div>
        
        <div className="p-10 bg-slate-900 rounded-[3rem] text-white mb-10 relative overflow-hidden shadow-2xl shadow-slate-200">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Saldo para Saque PIX</p>
              <button onClick={() => setShowBalance(!showBalance)} className="text-slate-500 hover:text-white transition-colors">
                {showBalance ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <p className="text-5xl font-black mb-10 tracking-tighter">
              {showBalance ? (viewMode === 'ADMIN' ? `R$ ${PLATFORM_STATS.adminCommission.toFixed(2)}` : `R$ ${USER_DATA.balance.available.toFixed(2)}`) : '••••••'}
            </p>
            <div className="flex justify-between items-end pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Chave PIX Cadastrada</p>
                <p className="text-sm font-mono text-indigo-400">{viewMode === 'ADMIN' ? ADMIN_PIX : USER_DATA.pixKey}</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                <ShieldCheck size={12}/> Verificada
              </div>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleWithdraw}
            disabled={withdrawStatus !== 'IDLE'}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {withdrawStatus === 'PROCESSING' ? <Activity className="animate-spin" /> : <ArrowUpRight size={24} />}
            {withdrawStatus === 'PROCESSING' ? 'PROCESSANDO ASAAS...' : 'SOLICITAR TRANSFERÊNCIA PIX'}
          </button>
          {withdrawStatus === 'SUCCESS' && (
             <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold text-sm">
               <CheckCircle size={20}/> Saque de R$ {viewMode === 'ADMIN' ? PLATFORM_STATS.adminCommission.toFixed(2) : USER_DATA.balance.available.toFixed(2)} enviado!
             </div>
          )}
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Transferência Direta via API Asaas</p>
        </div>
      </div>
    </div>
  );

  // --- Tela de Login ---
  if (viewMode === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-3xl">
              <TrendingUp size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">TarefaPro</h1>
            <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-[0.3em]">Gestão de Renda Extra</p>
          </div>

          <div className="bg-white rounded-[3.5rem] p-12 shadow-3xl border border-slate-100">
            <h2 className="text-2xl font-black mb-10 text-center text-slate-800 tracking-tight leading-none">
              {authStep === 'LOGIN' ? 'Painel de Acesso' : 'Nova Conta'}
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="exemplo@email.com" 
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white text-sm transition-all font-medium" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white text-sm transition-all font-medium" 
                    required 
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-sm shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-70 tracking-widest uppercase">
                {loading ? 'AUTENTICANDO...' : (authStep === 'LOGIN' ? 'ENTRAR AGORA' : 'CRIAR CONTA')}
              </button>
            </form>
            <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-10 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-[0.2em] text-center">
              {authStep === 'LOGIN' ? 'Não possui acesso? Registre-se' : 'Já é membro? Acesse aqui'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Desktop */}
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
               <button onClick={() => setActiveTab('admin_overview')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'admin_overview' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={22} /> Resumo Admin</button>
               <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><Wallet size={22} /> Sacar Comissões</button>
             </>
          ) : (
            <>
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={22} /> Dashboard</button>
              <button onClick={() => setActiveTab('missions')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'missions' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><Award size={22} /> Missões</button>
              <button onClick={() => setActiveTab('wallet')} className={`w-full flex items-center gap-5 px-7 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-50'}`}><Wallet size={22} /> Carteira PIX</button>
            </>
          )}
        </nav>

        <div className="mt-auto pt-10">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Perfil</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${viewMode === 'ADMIN' ? 'bg-indigo-500' : 'bg-emerald-500'} rounded-full animate-pulse`}></div>
              <p className="font-black text-slate-800 text-sm">{viewMode === 'ADMIN' ? 'Administrador' : 'Verificado Premium'}</p>
            </div>
          </div>
          <button onClick={() => setViewMode('AUTH')} className="flex items-center gap-5 px-7 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors w-full">
            <LogOut size={22} /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-16 overflow-y-auto w-full max-w-7xl mx-auto pb-32 lg:pb-16">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize leading-none">
              {viewMode === 'ADMIN' ? 'Gestão da Plataforma' : 'Painel de Controle'}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <Badge variant={viewMode === 'ADMIN' ? 'premium' : 'success'}>{viewMode === 'ADMIN' ? 'Modo Master' : 'Servidor Ativo'}</Badge>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asaas API v3 Conectada</p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
               {viewMode === 'ADMIN' ? 'WB' : 'CS'}
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Disponível agora</p>
                <p className="text-2xl font-black text-indigo-600 leading-none tracking-tighter">
                  R$ {viewMode === 'ADMIN' ? PLATFORM_STATS.adminCommission.toFixed(2) : USER_DATA.balance.available.toFixed(2)}
                </p>
             </div>
          </div>
        </header>

        {viewMode === 'ADMIN' && activeTab === 'admin_overview' && renderAdminDashboard()}
        {viewMode === 'USER' && activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'wallet' && renderWallet()}
        
        {((viewMode === 'USER' && activeTab === 'missions') || activeTab === 'profile') && (
           <div className="animate-fade-in text-center py-40 bg-white rounded-[4rem] border border-slate-100 shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
               <Info size={48} />
             </div>
             <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Em Manutenção</h2>
             <p className="text-slate-400 mt-3 max-w-xs mx-auto font-medium text-sm">A seção de <strong>{activeTab}</strong> está sendo atualizada.</p>
           </div>
        )}
      </main>

      {/* Nav Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 flex justify-around z-50 rounded-t-[3rem]">
        {[
          { id: 'dashboard', icon: <LayoutDashboard size={22} /> },
          { id: 'wallet', icon: <Wallet size={22} /> },
          { id: 'profile', icon: <UserIcon size={22} /> },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`p-5 rounded-[1.5rem] transition-all duration-300 ${activeTab === item.id ? 'text-white bg-indigo-600 shadow-xl' : 'text-slate-300'}`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

// Boot
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
