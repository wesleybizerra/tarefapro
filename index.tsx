
import React, { useState, useEffect } from 'react';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, PlayCircle, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  ChevronRight, Lock, Smartphone, Mail, Shield, Scale, Info
} from 'lucide-react';

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
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${styles[variant]}`}>{children}</span>;
};

const USER_DATA = {
  name: "Carlos Silva",
  email: "carlos@exemplo.com.br",
  plan: "FREE",
  balance: { available: 42.50, pending: 12.00, totalPaid: 156.90 },
  pixKeyMasked: "123.***.***-04"
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('AUTH');
  const [authStep, setAuthStep] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setViewMode('USER');
    }, 800);
  };

  if (viewMode === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <TrendingUp size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">TarefaPro</h1>
            <p className="text-slate-500 text-sm">Plataforma de Micro-tarefas Profissionais</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 text-center">{authStep === 'LOGIN' ? 'Entrar na Conta' : 'Criar Conta Grátis'}</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {authStep === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nome</label>
                  <input type="text" placeholder="Nome Completo" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm" required />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">E-mail</label>
                <input type="email" placeholder="email@exemplo.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Senha</label>
                <input type="password" placeholder="••••••••" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm" required />
              </div>

              {authStep === 'REGISTER' && (
                <div className="flex items-start gap-3 p-2">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600" required />
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Aceito os <button type="button" onClick={() => setShowTerms(true)} className="text-indigo-600 font-bold underline">Termos de Uso</button> e concordo com o tratamento de dados conforme a LGPD para fins de pagamentos.
                  </p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                {loading ? 'Processando...' : (authStep === 'LOGIN' ? 'Acessar Painel' : 'Finalizar Cadastro')}
              </button>
            </form>

            <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-6 text-xs font-bold text-indigo-600 text-center hover:underline">
              {authStep === 'LOGIN' ? 'Não tem conta? Começar agora' : 'Já é membro? Entrar'}
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={14} /> <span className="text-[9px] font-bold uppercase">LGPD Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Lock size={14} /> <span className="text-[9px] font-bold uppercase">SSL 256-bit</span>
            </div>
          </div>
        </div>

        {/* MODAL TERMOS (COMPLIANCE) */}
        {showTerms && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 text-indigo-600">
                <Scale size={24} />
                <h3 className="text-xl font-black">Termos e Transparência</h3>
              </div>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p><strong>1. Natureza do Serviço:</strong> O TarefaPro é uma plataforma de micro-tarefas. Os valores pagos são recompensas por tempo e esforço, não constituindo vínculo empregatício ou investimento.</p>
                <p><strong>2. Proteção de Dados (LGPD):</strong> Sua chave PIX é armazenada de forma criptografada (AES-256) e compartilhada apenas com o processador Asaas no momento do saque.</p>
                <p><strong>3. Auditoria Financeira:</strong> Para prevenir fraudes e lavagem de dinheiro, saques podem passar por revisão manual de até 48 horas.</p>
                <p><strong>4. Pagamentos:</strong> As taxas de serviço (R$ 0,99 + 1%) são retidas no ato do saque para cobrir custos operacionais bancários.</p>
              </div>
              <button onClick={() => setShowTerms(false)} className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold">Entendi e Aceito</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          <span className="font-black text-lg">TarefaPro</span>
        </div>
        <nav className="space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Início" active />
          <NavItem icon={<Award size={18} />} label="Missões" />
          <NavItem icon={<Wallet size={18} />} label="Carteira" />
          <NavItem icon={<UserIcon size={18} />} label="Meu Perfil" />
        </nav>
        <div className="mt-auto pt-6 border-t">
          <button onClick={() => setViewMode('AUTH')} className="flex items-center gap-3 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black">Dashboard</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Resumo de Atividades</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">Saldo</p>
              <p className="text-lg font-black text-indigo-600">R$ {USER_DATA.balance.available.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black">
              CS
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Disponível" value={`R$ ${USER_DATA.balance.available.toFixed(2)}`} icon={<CheckCircle className="text-emerald-500" />} />
          <StatCard title="Pendente" value={`R$ ${USER_DATA.balance.pending.toFixed(2)}`} icon={<Clock className="text-amber-500" />} />
          <StatCard title="Total Recebido" value={`R$ ${USER_DATA.balance.totalPaid.toFixed(2)}`} icon={<ShieldCheck className="text-indigo-500" />} />
        </div>

        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-xl shadow-indigo-100">
          <div>
            <Badge variant="premium">Proteção Ativa</Badge>
            <h2 className="text-2xl font-bold mt-2">Sua conta está segura</h2>
            <p className="text-indigo-100 text-sm mt-1">Criptografia de ponta a ponta e auditoria LGPD ativa.</p>
          </div>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm shadow-lg">VERIFICAR DADOS</button>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: any }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      {icon}
    </div>
    <p className="text-2xl font-black">{value}</p>
  </div>
);

export default App;
