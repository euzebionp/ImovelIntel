
import { useState } from 'react';
import { api } from './lib/api';
import { Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

export function RegisterPage({ onLoginClick }: { onLoginClick: () => void }) {
  // If user is logged in as ADMIN, this page might behave differently (create admin),
  // but for public registration, it's standard USER role.
  
  const { user } = useAuth(); // To check if current user is ADMIN
  const isAdminCreating = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' // Default to USER
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isAdminCreating ? '/auth/admin/register' : '/auth/register';
      await api.post(endpoint, {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: isAdminCreating ? formData.role : 'USER'
      });
      setSuccess(true);
      if (!isAdminCreating) {
          // If public registration, maybe auto-login or redirect?
          // For now, show success and button to login
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
             <div className="w-full max-w-md text-center space-y-6">
                 <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                     <CheckCircle2 size={40} />
                 </div>
                 <h2 className="text-2xl font-bold">Cadastro realizado com sucesso!</h2>
                 <p className="text-muted-foreground">Sua conta foi criada. Você já pode acessar o sistema.</p>
                 
                 {isAdminCreating ? (
                     <button onClick={() => setSuccess(false)} className="bg-primary text-white px-6 py-2 rounded-lg">Criar Outro</button>
                 ) : (
                     <button onClick={onLoginClick} className="bg-primary text-white px-6 py-2 rounded-lg w-full">Ir para Login</button>
                 )}
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
       {/* Left Side (Same as Login) */}
       <div className="bg-zinc-900 border-r border-border p-12 hidden lg:flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-cyan-500/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">ImovelIntel</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Junte-se a nós.</h2>
          <p className="text-zinc-400 text-lg">Crie sua conta e comece a explorar o mercado imobiliário com inteligência de dados.</p>
        </div>
        <div className="text-zinc-500 text-sm relative z-10">&copy; 2026 ImovelIntel Inc.</div>
      </div>

      {/* Right Side form */}
      <div className="bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
                {isAdminCreating ? 'Novo Usuário (Admin)' : 'Criar Conta'}
            </h1>
            <p className="text-muted-foreground mt-2">Preencha os dados abaixo para se registrar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Completo</label>
              <input 
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                placeholder="Seu nome"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                placeholder="nome@exemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <input 
                    type="password" 
                    required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar</label>
                <input 
                    type="password" 
                    required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
                </div>
            </div>

            {isAdminCreating && (
                <div className="space-y-2 pt-2 border-t border-border">
                    <label className="text-sm font-medium block">Nível de Acesso</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="role" 
                                value="USER" 
                                checked={formData.role === 'USER'} 
                                onChange={e => setFormData({...formData, role: 'USER'})}
                            />
                            <span>Usuário</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="role" 
                                value="ADMIN" 
                                checked={formData.role === 'ADMIN'} 
                                onChange={e => setFormData({...formData, role: 'ADMIN'})} // TypeScript might complain if state is typed strictly
                            />
                            <span className="font-semibold text-primary">Administrador</span>
                        </label>
                    </div>
                </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {isAdminCreating ? 'Criar Usuário' : 'Criar Conta'}
            </button>
          </form>

          {!isAdminCreating && (
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <button onClick={onLoginClick} className="font-medium text-primary hover:underline">
                Faça Login
                </button>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
