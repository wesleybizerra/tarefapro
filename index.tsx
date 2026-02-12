
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Wallet, CheckCircle, Clock, LayoutDashboard, LogOut,
  Users, DollarSign, Activity, RefreshCw, Zap, User as UserIcon
} from 'lucide-react';

type ViewMode = 'USER' | 'ADMIN' | 'AUTH' | 'LOADING';
type TabType = 'dashboard' | 'wallet' | 'admin_overview';

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

const StatCard = ({ title, value, icon, variant = 'light' }: { title: string, value: string, icon: any, variant?: 'light' | 'dark' }) => (
  <div className={`${variant === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} p-6 rounded-[2.5rem] border ${variant === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm flex-1`}>
    <div className={`p-3 w-fit mb-4 ${variant === 'dark' ? 'bg-slate-800 text-indigo-400' : 'bg-slate-50 text-slate-500'} rounded-2xl`}>
      {icon}
    </div>
    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{title}</p>
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

  const [platformStats, setPlatformStats] = useState<any>({
    totalRevenue: 0.00, adminCommission: 0.00, activeUsers: 0, members: []
  });

  const [userData, setUserData] = useState<any>({
    name: "Visitante", email: "", balance: 0.00, totalPaid: 0.00, pixKey: "", role: "USER"
  });

  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const fetchStats = async () => {
    if (viewMode === 'ADMIN') {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setPlatformStats(data);
      } catch (e) { console.error("Sync error"); }
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchStats, 5000);
    fetchStats();
    return () => clearInterval(interval);
  }, [viewMode]);

  useEffect(() => {
    const saved = localStorage.getItem('tarefapro_session');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setViewMode(user.role === 'ADMIN' ? 'ADMIN' : 'USER');
      setActiveTab(user.role === 'ADMIN' ? 'admin_overview' : 'dashboard');
    } else { setViewMode('AUTH'); }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
        const mode: ViewMode = data.user.role === 'ADMIN' ? 'ADMIN' : 'USER';
        setViewMode(mode);
        setActiveTab(mode === 'ADMIN' ? 'admin_overview' : 'dashboard');
        localStorage.setItem('tarefapro_session', JSON.stringify(data.user));
      } else { setErrorMessage(data.error); }
    } catch (e) { setErrorMessage('Erro de conexão'); }
    finally { setLoading(false); }
  };

  const simulateTask = async () => {
    const res = await fetch('/api/user/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userData.email, value: 25.00 })
    });
    const data = await res.json();
    if (res.ok) setUserData((p: any) => ({ ...p, balance: data.newBalance }));
  };

  if (viewMode === 'LOADING') return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando...</div>;

  if (viewMode === 'AUTH') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-xl">
        <div className="text-center mb-8">
          <Zap className="text-indigo-600 mx-auto mb-4" size={40} fill="currentColor" />
          <h1 className="text-2xl font-black">TarefaPro</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-tighter">{isLoginMode ? 'Login' : 'Cadastro'}</p>
        </div>
        {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center">{errorMessage}</div>}
        <form onSubmit={handleAuth} className="space-y-3">
          {!isLoginMode && <input type="text" placeholder="Nome" onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none" required />}
          <input type="email" placeholder="E-mail" onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none" required />
          <input type="password" placeholder="Senha" onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none" required />
          <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg disabled:opacity-50">{loading ? '...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}</button>
        </form>
        <button onClick={() => setIsLoginMode(!isLoginMode)} className="w-full mt-6 text-slate-400 font-bold text-sm">{isLoginMode ? 'Criar conta' : 'Já tenho conta'}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <aside className="w-80 bg-white border-r p-10 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10 font-black text-xl"><Zap className="text-indigo-600" fill="currentColor" /> TarefaPro</div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab(viewMode === 'ADMIN' ? 'admin_overview' : 'dashboard')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase ${activeTab !== 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>Home</button>
          <button onClick={() => setActiveTab('wallet')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>Carteira</button>
        </nav>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-auto text-slate-400 font-black text-xs uppercase">Sair</button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div><h1 className="text-3xl font-black">Olá, {userData.name}</h1><Badge variant="success">{userData.role}</Badge></div>
          <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase">Saldo</p><p className="text-2xl font-black text-indigo-600">R$ {(viewMode === 'ADMIN' ? platformStats.adminCommission : userData.balance).toFixed(2)}</p></div>
        </header>

        {activeTab === 'dashboard' && viewMode === 'USER' && (
          <div className="space-y-6">
            <div className="flex gap-4"><StatCard title="Saldo" value={`R$ ${userData.balance.toFixed(2)}`} icon={<Wallet />} /></div>
            <div className="bg-indigo-600 p-12 rounded-[3rem] text-white text-center">
              <h2 className="text-3xl font-black mb-4">Gerar Comissão</h2>
              <button onClick={simulateTask} className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black">RESGATAR R$ 25,00</button>
            </div>
          </div>
        )}

        {activeTab === 'admin_overview' && viewMode === 'ADMIN' && (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4">
              <StatCard title="Comissão" value={`R$ ${platformStats.adminCommission.toFixed(2)}`} icon={<DollarSign />} variant="dark" />
              <StatCard title="Membros" value={platformStats.activeUsers.toString()} icon={<Users />} />
            </div>
            <div className="bg-white p-8 rounded-[2rem] border">
              <h3 className="font-black mb-6 uppercase text-xs tracking-widest">Membros Online</h3>
              <div className="space-y-4">
                {platformStats.members?.map((m: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <div><p className="font-black text-sm">{m.name}</p><p className="text-[10px] text-slate-400">{m.email}</p></div>
                    <div className="text-right font-black text-indigo-600">R$ {m.balance.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
