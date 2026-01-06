
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { api } from './lib/api';
import { Building2, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return 
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="bg-zinc-900 border-r border-border p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">ImovelIntel</span>
          </div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Inteligência Imobiliária para o seu negócio.</h2>
          <p className="text-zinc-400 text-lg">Gerencie leads, encontre imóveis e transforme dados em oportunidades reais.</p>
        </div>
        
        <div className="text-zinc-500 text-sm relative z-10">
          &copy; 2026 ImovelIntel Inc By Infoservicos.
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-2">Entre com suas credenciais para acessar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                placeholder="nome@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Entrar
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <div className="flex flex-col gap-2 mt-2">
              <a 
                href="https://wa.me/5534998632929"
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-2"
              >
                Falar com o consultor Euzébio Borges
              </a>
              <a 
                href="https://wa.me/5534991673559" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-2"
              >
                Falar com o consultor Lucas Almeida
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  ;
}
