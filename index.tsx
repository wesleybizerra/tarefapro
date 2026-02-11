import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  Lock, Smartphone, Mail, Shield, Scale, ChevronRight, Info
} from 'lucide-react';
import { Buffer } from 'buffer';

// Polyfill indispensável para criptografia no browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

type ViewMode = 'USER' | 'ADMIN' | 'AUTH';
type TabType = 'dashboard' | 'missions' | 'wallet' | 'profile';

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
    }, 1000);
  };

  if (viewMode === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl rotate-3">
              <TrendingUp size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">TarefaPro</h1>
            <p className="text-slate-500 font-medium text-sm mt-2">Sua produtividade convertida em renda</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black mb-8 text-center text-slate-800">
              {authStep === 'LOGIN' ? 'Bem-vindo de volta' : 'Crie sua conta grátis'}
            </h2>
            <form onSubmit={handleLogin} className="space-y-5">
              {authStep === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Nome Completo</label>
                  <input type="text" placeholder="Como deseja ser chamado?" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required />
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
              <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-70">
                {loading ? 'Validando Acesso...' : (authStep === 'LOGIN' ? 'ENTRAR NO PAINEL' : 'CONCLUIR CADASTRO')}
              </button>
            </form>
            <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-8 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest text-center">
              {authStep === 'LOGIN' ? 'Não possui conta? Registre-se' : 'Já é membro? Acesse aqui'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
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
          <button onClick={() => setViewMode('AUTH')} className="flex items-center gap-4 px-6 py-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors w-full">
            <LogOut size={22} /> Sair da Conta
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-14 overflow-y-auto w-full max-w-7xl mx-auto pb-24 lg:pb-14">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{activeTab}</h1>
            <Badge variant="success">Sistema Ativo</Badge>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
             <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-inner">CS</div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Saldo</p>
                <p className="text-xl font-black text-indigo-600">R$ {USER_DATA.balance.available.toFixed(2)}</p>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Disponível" value={`R$ ${USER_DATA.balance.available.toFixed(2)}`} icon={<CheckCircle className="text-emerald-500" size={20} />} trend="+12% hoje" />
              <StatCard title="Em Auditoria" value={`R$ ${USER_DATA.balance.pending.toFixed(2)}`} icon={<Clock className="text-amber-500" size={20} />} />
              <StatCard title="Total Pago" value={`R$ ${USER_DATA.balance.totalPaid.toFixed(2)}`} icon={<ShieldCheck className="text-indigo-500" size={20} />} />
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <Badge variant="premium">Proteção Ativa LGPD</Badge>
                <h2 className="text-3xl font-black mt-4">Saque PIX Instântaneo</h2>
                <p className="text-indigo-100 text-sm mt-3 max-w-md">Resgate seu saldo em menos de 5 minutos via Asaas.</p>
              </div>
              <button onClick={() => setActiveTab('wallet')} className="mt-8 md:mt-0 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">SACAR AGORA</button>
            </div>
          </div>
        ) : (
           <div className="animate-fade-in text-center py-32 bg-white rounded-[3rem] border border-slate-100">
             <Info size={40} className="mx-auto text-slate-200 mb-6" />
             <h2 className="text-2xl font-black text-slate-800">Em Breve</h2>
             <p className="text-slate-400 mt-2">A funcionalidade de {activeTab} está sendo homologada.</p>
           </div>
        )}
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around z-50 rounded-t-[2rem] shadow-2xl">
        {['dashboard', 'missions', 'wallet', 'profile'].map(id => (
          <button key={id} onClick={() => setActiveTab(id as TabType)} className={`p-4 rounded-2xl ${activeTab === id ? 'text-white bg-indigo-600 shadow-lg' : 'text-slate-400'}`}>
            {id === 'dashboard' && <LayoutDashboard size={22} />}
            {id === 'missions' && <Award size={22} />}
            {id === 'wallet' && <Wallet size={22} />}
            {id === 'profile' && <UserIcon size={22} />}
          </button>
        ))}
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
