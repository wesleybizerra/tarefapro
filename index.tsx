import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  Lock, Smartphone, Mail, Shield, Scale, ChevronRight, Info
} from 'lucide-react';
import { Buffer } from 'buffer';

// Garantir que o Buffer esteja disponível globalmente para os serviços de criptografia
if (typeof window !== 'undefined') {
  // Fix: Cast window to any to avoid Property 'Buffer' does not exist on type 'Window'
  (window as any).Buffer = Buffer;
}

type ViewMode = 'USER' | 'ADMIN' | 'AUTH';
type TabType = 'dashboard' | 'missions' | 'wallet' | 'profile';

// --- Componentes Atômicos ---

const Badge = ({ children, variant = 'default' }: { children?: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    premium: 'bg-indigo-600 text-white shadow-sm',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${styles[variant]}`}>{children}</span>;
};

const StatCard = ({ title, value, icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-indigo-100 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

// --- Aplicação Principal ---

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('AUTH');
  const [authStep, setAuthStep] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);

  const USER_DATA = {
    name: "Carlos Silva",
    balance: { available: 42.50, pending: 12.00, totalPaid: 156.90 },
    pixKey: "123.***.***-04"
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setViewMode('USER');
    }, 1200);
  };

  // --- Renderizadores de Abas ---

  const renderDashboard = () => (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Disponível" value={`R$ ${USER_DATA.balance.available.toFixed(2)}`} icon={<CheckCircle className="text-emerald-500" size={20} />} trend="+R$ 12,50 hoje" />
        <StatCard title="Em Auditoria" value={`R$ ${USER_DATA.balance.pending.toFixed(2)}`} icon={<Clock className="text-amber-500" size={20} />} />
        <StatCard title="Total Recebido" value={`R$ ${USER_DATA.balance.totalPaid.toFixed(2)}`} icon={<ShieldCheck className="text-indigo-500" size={20} />} />
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200 relative overflow-hidden group">
        <div className="relative z-10">
          <Badge variant="premium">Proteção Ativa LGPD</Badge>
          <h2 className="text-3xl font-black mt-4 tracking-tighter">Saque PIX Instantâneo</h2>
          <p className="text-indigo-100 text-sm mt-3 max-w-md">
            Seu saldo pode ser resgatado agora mesmo via Asaas. O processamento leva menos de 5 minutos.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('wallet')}
          className="mt-8 md:mt-0 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 active:scale-95 z-10"
        >
          <Wallet size={18} /> SACAR AGORA
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all duration-700"></div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">Missões Recomendadas</h3>
          <button onClick={() => setActiveTab('missions')} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">Ver todas <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 1, title: 'Avaliação: Interface App Store', reward: 12.50, type: 'UX DESIGN' },
            { id: 2, title: 'Teste de Fluxo: Checkout', reward: 8.90, type: 'FEEDBACK' }
          ].map(m => (
            <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                  <Smartphone size={24} />
                </div>
                <div>
                  <Badge>{m.type}</Badge>
                  <h4 className="font-bold text-slate-800 mt-1">{m.title}</h4>
                  <p className="text-sm font-black text-emerald-600">R$ {m.reward.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderWallet = () => (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Wallet size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter">Minha Carteira</h2>
        </div>

        <div className="p-8 bg-slate-900 rounded-[2rem] text-white mb-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo Disponível</p>
            <p className="text-4xl font-black mb-6 tracking-tight">R$ {USER_DATA.balance.available.toFixed(2)}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chave PIX Cadastrada</p>
                <p className="text-sm font-mono text-indigo-300">{USER_DATA.pixKey}</p>
              </div>
              <Badge variant="success">Auditado</Badge>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="space-y-4">
          <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
            <ArrowUpRight size={20} /> SOLICITAR SAQUE PIX
          </button>
          <div className="flex items-center gap-2 justify-center py-4 text-slate-400">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Criptografia AES-256 e SSL Ativos</span>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Tela de Autenticação ---

  if (viewMode === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl rotate-3">
              <TrendingUp size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">TarefaPro</h1>
            <p className="text-slate-500 font-medium text-sm mt-2">Micro-tarefas Profissionais</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">
              {authStep === 'LOGIN' ? 'Painel de Acesso' : 'Registro de Consultor'}
            </h2>
            <form onSubmit={handleLogin} className="space-y-5">
              {authStep === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Nome Completo</label>
                  <input type="text" placeholder="Seu nome" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" placeholder="email@exemplo.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" placeholder="••••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-70 tracking-tight">
                {loading ? 'CONECTANDO...' : (authStep === 'LOGIN' ? 'ENTRAR AGORA' : 'FINALIZAR CADASTRO')}
              </button>
            </form>
            <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-8 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest text-center">
              {authStep === 'LOGIN' ? 'Não tem uma conta? Cadastre-se' : 'Já é membro? Acesse aqui'}
            </button>
          </div>

          <div className="mt-12 flex justify-center gap-6 grayscale opacity-40">
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> <span className="text-[10px] font-black uppercase">LGPD</span></div>
            <div className="flex items-center gap-2"><Lock size={16} /> <span className="text-[10px] font-black uppercase">SSL 256</span></div>
            <div className="flex items-center gap-2"><Scale size={16} /> <span className="text-[10px] font-black uppercase">TERMOS</span></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Layout Logado ---

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col p-10">
        <div className="flex items-center gap-4 mb-14">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <TrendingUp size={28} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900">TarefaPro</span>
        </div>

        <nav className="space-y-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
            { id: 'missions', label: 'Missões', icon: <Award size={22} /> },
            { id: 'wallet', label: 'Carteira PIX', icon: <Wallet size={22} /> },
            { id: 'profile', label: 'Minha Conta', icon: <UserIcon size={22} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-sm transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <div className="p-6 bg-slate-50 rounded-[2rem] mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Perfil</p>
            <p className="font-bold text-slate-800">Premium Ativo</p>
          </div>
          <button onClick={() => setViewMode('AUTH')} className="flex items-center gap-4 px-6 py-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors w-full">
            <LogOut size={22} /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 lg:p-14 overflow-y-auto w-full max-w-7xl mx-auto pb-24 lg:pb-14">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">
              {activeTab === 'dashboard' ? 'Painel Geral' : activeTab}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="success">Sistema Online</Badge>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servidor BR-1</p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-inner">
              CS
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Saldo Atual</p>
              <p className="text-xl font-black text-indigo-600 leading-none tracking-tight">R$ {USER_DATA.balance.available.toFixed(2)}</p>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab !== 'dashboard' && activeTab !== 'wallet' && (
          <div className="animate-fade-in text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Info size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Homologação Pendente</h2>
            <p className="text-slate-400 mt-2 max-w-xs mx-auto">Esta seção de <strong>{activeTab}</strong> está em auditoria final pela equipe de TI.</p>
          </div>
        )}
      </main>

      {/* Nav Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-around z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        {[
          { id: 'dashboard', icon: <LayoutDashboard size={22} /> },
          { id: 'missions', icon: <Award size={22} /> },
          { id: 'wallet', icon: <Wallet size={22} /> },
          { id: 'profile', icon: <UserIcon size={22} /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`p-4 rounded-2xl transition-all ${activeTab === item.id ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Iniciar Renderização ---

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}