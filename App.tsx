
import React, { useState, useEffect } from 'react';
import {
  Wallet, CheckCircle, Clock, ArrowUpRight, Award,
  ShieldCheck, TrendingUp, LayoutDashboard, LogOut, User as UserIcon,
  Lock, Smartphone, Mail, Shield, Scale, ChevronRight, Info
} from 'lucide-react';
import { ViewMode, TabType } from './types.ts';

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

<<<<<<< HEAD
const StatCard = ({ title, value, icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-indigo-100 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
=======
const USER_DATA = {
    name: "Carlos Silva",
    email: "carlos@exemplo.com.br",
    plan: "FREE",
    balance: { available: 42.50, pending: 12.00, totalPaid: 156.90 },
    pixKeyMasked: "123.***.***-04"
};

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: any }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
        <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            {icon}
        </div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
>>>>>>> 78732ff (fix: ajuste de build e deploy para Railway)
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

<<<<<<< HEAD
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setViewMode('USER');
    }, 1000);
  };

  const renderDashboard = () => (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Disponível" value={`R$ ${USER_DATA.balance.available.toFixed(2)}`} icon={<CheckCircle className="text-emerald-500" size={20} />} trend="+12% hoje" />
        <StatCard title="Em Auditoria" value={`R$ ${USER_DATA.balance.pending.toFixed(2)}`} icon={<Clock className="text-amber-500" size={20} />} />
        <StatCard title="Total Pago" value={`R$ ${USER_DATA.balance.totalPaid.toFixed(2)}`} icon={<ShieldCheck className="text-indigo-500" size={20} />} />
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200 relative overflow-hidden group">
        <div className="relative z-10">
          <Badge variant="premium">Proteção Ativa LGPD</Badge>
          <h2 className="text-3xl font-black mt-4">Saque PIX Instântaneo</h2>
          <p className="text-indigo-100 text-sm mt-3 max-w-md">
            Seu saldo disponível pode ser resgatado a qualquer momento. Processamento via Asaas em menos de 5 minutos.
          </p>
=======
    if (viewMode === 'AUTH') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl rotate-3">
                            <TrendingUp size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">TarefaPro</h1>
                        <p className="text-slate-500 text-sm font-medium">Sua jornada financeira começa aqui</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
                        <h2 className="text-xl font-bold mb-6 text-center text-slate-800">
                            {authStep === 'LOGIN' ? 'Bem-vindo de volta' : 'Crie sua conta grátis'}
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            {authStep === 'REGISTER' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nome Completo</label>
                                    <input type="text" placeholder="Ex: João Silva" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" required />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">E-mail Profissional</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="email" placeholder="email@exemplo.com" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" required />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Senha Segura</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="password" placeholder="••••••••" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" required />
                                </div>
                            </div>

                            {authStep === 'REGISTER' && (
                                <div className="flex items-start gap-3 p-2">
                                    <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
                                    <p className="text-[10px] text-slate-500 leading-snug">
                                        Aceito os <button type="button" onClick={() => setShowTerms(true)} className="text-indigo-600 font-bold hover:underline">Termos de Uso</button> e consinto com o processamento de dados sob a LGPD.
                                    </p>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (authStep === 'LOGIN' ? 'Entrar Agora' : 'Começar a Ganhar')}
                            </button>
                        </form>

                        <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-6 text-xs font-bold text-indigo-600 text-center hover:underline">
                            {authStep === 'LOGIN' ? 'Não tem conta? Crie uma em 1 minuto' : 'Já possui conta? Faça o login'}
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <ShieldCheck size={14} /> <span className="text-[9px] font-bold uppercase tracking-widest">LGPD Ativa</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Lock size={14} /> <span className="text-[9px] font-bold uppercase tracking-widest">Criptografia SSL</span>
                        </div>
                    </div>
                </div>

                {showTerms && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl max-h-[85vh] overflow-y-auto border border-slate-100">
                            <div className="flex items-center gap-3 mb-6 text-indigo-600">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <Scale size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Transparência e Compliance</h3>
                            </div>
                            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                                <p className="p-3 bg-slate-50 rounded-xl border-l-4 border-indigo-500 italic">"Sua segurança é nosso maior ativo."</p>
                                <p><strong>1. Serviço:</strong> O TarefaPro atua como mediador de micro-tarefas digitais. O saldo gerado é fruto de esforço real e não constitui aplicação financeira.</p>
                                <p><strong>2. Proteção de Dados:</strong> Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, suas chaves PIX nunca são armazenadas em texto limpo. Utilizamos AES-256 para garantir que apenas o motor de pagamentos acesse o dado no ato do saque.</p>
                                <p><strong>3. Saques:</strong> Processados via API Asaas. Podem incidir taxas bancárias de R$ 0,99 por transação para manutenção da rede segura.</p>
                                <p><strong>4. Segurança:</strong> Monitoramento 24/7 contra atividades fraudulentas. Contas suspeitas podem ser bloqueadas para auditoria manual.</p>
                            </div>
                            <button onClick={() => setShowTerms(false)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">Li e concordo com os termos</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row animate-fade-in">
            {/* Mobile Nav */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-[100]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <TrendingUp size={18} />
                    </div>
                    <span className="font-black text-lg tracking-tighter">TarefaPro</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col p-8 fixed h-full transition-transform lg:static z-[100] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="hidden lg:flex items-center gap-2 mb-10">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <TrendingUp size={22} />
                    </div>
                    <span className="font-black text-xl tracking-tighter">TarefaPro</span>
                </div>
                <nav className="space-y-1">
                    <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} />
                    <NavItem icon={<Award size={18} />} label="Missões" active={activeTab === 'missions'} onClick={() => { setActiveTab('missions'); setMobileMenuOpen(false); }} />
                    <NavItem icon={<Wallet size={18} />} label="Carteira PIX" active={activeTab === 'wallet'} onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }} />
                    <NavItem icon={<UserIcon size={18} />} label="Configurações" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }} />
                </nav>
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <button onClick={() => setViewMode('AUTH')} className="flex items-center gap-3 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors w-full p-2">
                        <LogOut size={18} /> Sair com segurança
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Olá, {USER_DATA.name}!</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Status: Membro {USER_DATA.plan}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2.5 pr-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                            {USER_DATA.name.charAt(0)}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Saldo Líquido</p>
                            <p className="text-xl font-black text-indigo-600 leading-tight">R$ {USER_DATA.balance.available.toFixed(2)}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Disponível agora" value={`R$ ${USER_DATA.balance.available.toFixed(2)}`} icon={<CheckCircle className="text-emerald-500" size={20} />} />
                    <StatCard title="Em Auditoria" value={`R$ ${USER_DATA.balance.pending.toFixed(2)}`} icon={<Clock className="text-amber-500" size={20} />} />
                    <StatCard title="Lucro Acumulado" value={`R$ ${USER_DATA.balance.totalPaid.toFixed(2)}`} icon={<ShieldCheck className="text-indigo-500" size={20} />} />
                </div>

                <div className="bg-indigo-600 rounded-[2.5rem] p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                    <div className="relative z-10 text-center md:text-left">
                        <div className="flex justify-center md:justify-start">
                            <Badge variant="premium">Proteção Total LGPD</Badge>
                        </div>
                        <h2 className="text-3xl font-black mt-4 leading-tight">Segurança de Nível Bancário</h2>
                        <p className="text-indigo-100 text-sm mt-3 max-w-md">
                            Seus dados de pagamento são criptografados com <strong>AES-256-GCM</strong>.
                            Nenhum colaborador tem acesso à sua chave PIX completa.
                        </p>
                    </div>
                    <button className="mt-8 md:mt-0 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform relative z-10 flex items-center gap-2">
                        <Smartphone size={18} /> CONFIGURAR PIX
                    </button>

                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/15 transition-all"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                </div>

                {/* Task List Preview */}
                <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Missões Recomendadas</h3>
                        <button className="text-indigo-600 text-xs font-bold uppercase tracking-widest hover:text-indigo-700">Ver todas as missões</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: 1, title: 'Avaliação de Interface Premium', reward: 12.50, type: 'UI/UX' },
                            { id: 2, title: 'Check de Segurança de Fluxo', reward: 8.90, type: 'QA' }
                        ].map(mission => (
                            <div key={mission.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <Badge variant="default">{mission.type}</Badge>
                                        <h4 className="font-bold text-slate-800 mt-1">{mission.title}</h4>
                                        <p className="text-sm text-emerald-600 font-bold">R$ {mission.reward.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 text-slate-400 p-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowUpRight size={22} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
>>>>>>> 78732ff (fix: ajuste de build e deploy para Railway)
        </div>
        <button 
          onClick={() => setActiveTab('wallet')}
          className="mt-8 md:mt-0 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
        >
          <Wallet size={18} /> SACAR AGORA
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">Missões de Hoje</h3>
          <button onClick={() => setActiveTab('missions')} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">Ver todas <ChevronRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 1, title: 'Avaliação: Interface App Store', reward: 12.50, type: 'UX DESIGN' },
            { id: 2, title: 'Teste de Fluxo: Checkout E-commerce', reward: 8.90, type: 'FEEDBACK' }
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
          <h2 className="text-2xl font-black">Minha Carteira</h2>
        </div>
        
        <div className="p-8 bg-slate-900 rounded-[2rem] text-white mb-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo Disponível</p>
            <p className="text-4xl font-black mb-6">R$ {USER_DATA.balance.available.toFixed(2)}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chave PIX Ativa</p>
                <p className="text-sm font-mono text-indigo-300">{USER_DATA.pixKey}</p>
              </div>
              <Badge variant="success">Seguro</Badge>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="space-y-4">
          <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
            <ArrowUpRight size={20} /> EFETUAR SAQUE AGORA
          </button>
          <div className="flex items-center gap-2 justify-center py-4 text-slate-400">
             <Shield size={14} />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Transação protegida por SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (viewMode === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in">
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
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" placeholder="email@exemplo.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Senha Segura</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" placeholder="••••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-70">
                {loading ? 'Validando Acesso...' : (authStep === 'LOGIN' ? 'ENTRAR NO PAINEL' : 'CONCLUIR CADASTRO')}
              </button>
            </form>
            <button onClick={() => setAuthStep(authStep === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full mt-8 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
              {authStep === 'LOGIN' ? 'Não possui conta? Registre-se' : 'Já é membro? Acesse aqui'}
            </button>
          </div>
          
          <div className="mt-12 flex justify-center gap-6 grayscale opacity-40">
             <div className="flex items-center gap-2"><ShieldCheck size={16}/> <span className="text-[10px] font-bold">LGPD</span></div>
             <div className="flex items-center gap-2"><Lock size={16}/> <span className="text-[10px] font-bold">SSL</span></div>
             <div className="flex items-center gap-2"><Scale size={16}/> <span className="text-[10px] font-bold">TERMOS</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seu Status</p>
            <p className="font-bold text-slate-800">Membro Premium</p>
          </div>
          <button onClick={() => setViewMode('AUTH')} className="flex items-center gap-4 px-6 py-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors w-full">
            <LogOut size={22} /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-14 overflow-y-auto w-full max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab === 'dashboard' ? 'Início' : activeTab}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="success">Online</Badge>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Painel de Controle v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
             <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-inner">
               CS
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Saldo Atual</p>
                <p className="text-xl font-black text-indigo-600 leading-none">R$ {USER_DATA.balance.available.toFixed(2)}</p>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab !== 'dashboard' && activeTab !== 'wallet' && (
           <div className="animate-fade-in text-center py-32 bg-white rounded-[3rem] border border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
               <Info size={40} />
             </div>
             <h2 className="text-2xl font-black text-slate-800">Em Breve</h2>
             <p className="text-slate-400 mt-2 max-w-xs mx-auto">A funcionalidade de {activeTab} está sendo finalizada pela nossa equipe.</p>
           </div>
        )}
      </main>

      {/* Bottom Nav - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-around z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2rem]">
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

export default App;
