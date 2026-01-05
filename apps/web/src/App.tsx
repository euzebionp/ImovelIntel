import { 
  Building2, 
  Home, 
  Search, 
  Settings, 
  Users, 
  Wallet, 
  Menu,
  Bell,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';
import { api } from './lib/api';

import { SearchPage } from './SearchPage';
import { ClientsPage } from './ClientsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

interface DashboardStats {
  totalSearches: number;
  propertiesFound: number;
  creditsAvailable: number;
  newClients: number;
  searchesChange: string;
  propertiesChange: string;
  creditsChange: string;
  clientsChange: string;
}

interface Recentactivity {
  id: number;
  address: string;
  time: string;
  city: string;
  status: string;
}

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Recentactivity[]>([]);
  const [loading, setLoading] = useState(true);

  // If in admin creation mode (Settings)
  const [showAdminRegister, setShowAdminRegister] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent')
        ]);
        setStats(statsRes.data);
        setRecent(recentRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (showAdminRegister) {
      return (
          <div className="min-h-screen bg-background relative">
              <button 
                onClick={() => setShowAdminRegister(false)}
                className="absolute top-4 left-4 z-50 bg-secondary px-4 py-2 rounded-lg"
              >
                  Voltar para o Painel
              </button>
              <RegisterPage onLoginClick={() => setShowAdminRegister(false)} />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border h-screen fixed left-0 top-0 transition-all duration-300 z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Building2 className="text-primary-foreground h-5 w-5" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg tracking-tight text-foreground">ImovelIntel</span>
          )}
        </div>

        <nav className="p-4 space-y-2 flex flex-col h-[calc(100vh-80px)]">
          <NavItem 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isActive={activeTab === 'dashboard'} 
            expanded={sidebarOpen}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Buscar Imóveis" 
            isActive={activeTab === 'search'} 
            expanded={sidebarOpen}
            onClick={() => setActiveTab('search')}
          />
          <NavItem 
            icon={<Wallet size={20} />} 
            label="Carteira" 
            isActive={activeTab === 'wallet'} 
            expanded={sidebarOpen}
            onClick={() => setActiveTab('wallet')}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Clientes" 
            isActive={activeTab === 'clients'} 
            expanded={sidebarOpen}
            onClick={() => setActiveTab('clients')}
          />
          
          <div className="pt-4 mt-auto border-t border-border/50 space-y-2">
             <NavItem 
              icon={<Settings size={20} />} 
              label="Configurações" 
              isActive={activeTab === 'settings'} 
              expanded={sidebarOpen}
              onClick={() => setActiveTab('settings')}
            />
            <button 
                onClick={logout}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full group relative text-destructive hover:bg-destructive/10"
                )}
            >
                <div className={cn("shrink-0", !sidebarOpen && "mx-auto")}><LogOut size={20} /></div>
                {sidebarOpen && <span className="font-medium whitespace-nowrap">Sair</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40 px-8 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                 <p className="text-sm font-medium leading-none">{user?.name}</p>
                 <p className="text-xs text-muted-foreground mt-1">{user?.role}</p>
             </div>
             <button className="relative p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
               <Bell size={20} />
               <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-card"></span>
             </button>
             <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center font-bold text-muted-foreground">
               {user?.name.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {activeTab === 'search' ? (
            <SearchPage />
          ) : activeTab === 'dashboard' ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral</h1>
                <p className="text-muted-foreground mt-1">Bem-vindo ao painel de inteligência imobiliária.</p>
              </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
               Array(4).fill(0).map((_, i) => (
                 <div key={i} className="h-32 bg-secondary/50 rounded-xl animate-pulse"></div>
               ))
            ) : stats ? (
              <>
                <StatCard title="Total de Buscas" value={stats.totalSearches.toString()} change={stats.searchesChange} icon={<Search className="text-blue-500" />} />
                <StatCard title="Imóveis Encontrados" value={stats.propertiesFound.toString()} change={stats.propertiesChange} icon={<Building2 className="text-violet-500" />} />
                <StatCard title="Créditos Disponíveis" value={`R$ ${stats.creditsAvailable.toFixed(2)}`} change={stats.creditsChange} icon={<Wallet className="text-emerald-500" />} />
                <StatCard title="Novos Clientes" value={stats.newClients.toString()} change={stats.clientsChange} icon={<Users className="text-orange-500" />} />
              </>
            ) : null}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
               <h3 className="font-semibold text-lg mb-4">Buscas Recentes</h3>
               <div className="space-y-4">
                 {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-20 bg-secondary/50 rounded-lg animate-pulse"></div>
                    ))
                 ) : recent.map((item) => (
                   <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                         <Search size={18} className="text-muted-foreground group-hover:text-primary" />
                       </div>
                       <div>
                         <p className="font-medium text-foreground">{item.address}</p>
                         <p className="text-sm text-muted-foreground">Há {item.time} • {item.city}</p>
                       </div>
                     </div>
                     <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                       {item.status}
                     </span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
               <h3 className="font-semibold text-lg mb-4">Acesso Rápido</h3>
               <div className="space-y-3">
                 <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-3">
                    <Search size={18} /> Nova Busca CPF
                 </button>
                 <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-3">
                    <Building2 size={18} /> Nova Busca Matrícula
                 </button>
                 <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-3">
                    <Wallet size={18} /> Adicionar Créditos
                 </button>
               </div>
             </div>
          </div>
          </>
          ) : activeTab === 'clients' ? (
            <ClientsPage />
          ) : activeTab === 'settings' ? (
              <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Configurações</h2>
                  <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                      <h3 className="text-lg font-semibold">Conta</h3>
                      <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-secondary/20">
                           <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                               {user?.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                               <p className="font-medium">{user?.name}</p>
                               <p className="text-sm text-muted-foreground">{user?.email}</p>
                           </div>
                           <div className="ml-auto">
                               <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">{user?.role}</span>
                           </div>
                      </div>

                      {user?.role === 'ADMIN' && (
                          <div className="pt-4 border-t border-border">
                              <h3 className="text-lg font-semibold mb-4">Administração</h3>
                              <button 
                                onClick={() => setShowAdminRegister(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                  <UserPlus size={18} /> Cadastrar Novo Usuário/Admin
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>Funcionalidade "{activeTab}" em desenvolvimento.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, isActive, expanded, onClick }: { 
  icon: React.ReactNode, 
  label: string, 
  isActive: boolean, 
  expanded: boolean,
  onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full group relative",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <div className={cn("shrink-0", !expanded && "mx-auto")}>{icon}</div>
      {expanded && (
        <span className="font-medium whitespace-nowrap overflow-hidden transition-all">
          {label}
        </span>
      )}
      {!expanded && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border border-border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-sm">
          {label}
        </div>
      )}
    </button>
  )
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-foreground">{value}</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium">
        <span className={cn(
          isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          {change}
        </span>
        <span className="text-muted-foreground">desde o último mês</span>
      </div>
    </div>
  )
}

function AppContent() {
    const { isAuthenticated, isLoading } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
    }

    if (!isAuthenticated) {
        if (isRegistering) {
            return <RegisterPage onLoginClick={() => setIsRegistering(false)} />;
        }
        return <LoginPage onRegisterClick={() => setIsRegistering(true)} />;
    }

    return <AuthenticatedApp />;
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
