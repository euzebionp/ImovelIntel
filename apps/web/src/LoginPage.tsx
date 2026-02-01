
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

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="relative overflow-hidden">
        <div className="futuristic-bg"></div>
        <div className="relative z-10 min-h-screen p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center logo-glow">
              <Building2 className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gradient">ImovelIntel</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">Inteligência Imobiliária para o seu negócio.</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} className="text-lg">Gerencie leads, encontre imóveis e transforme dados em oportunidades reais.</p>
        </div>
        
        <div className="text-white/50 text-sm">
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}> &copy; 2026 ImovelIntel Inc By Infoservicos.</span>
        </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="relative overflow-hidden">
        <div className="futuristic-bg"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Bem-vindo de volta</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} className="mt-2">Entre com suas credenciais para acessar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none backdrop-blur-sm" 
                placeholder="nome@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Senha</label>
              <input 
                type="password" 
                required
                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none backdrop-blur-sm" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/30">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-futuristic py-2.5 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Entrar
            </button>
          </form>

          <div className="text-center text-sm">
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Não tem uma conta? </span>
            <div className="flex flex-col gap-2 mt-2">
              <a 
                href="https://wa.me/5534998632929"
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-emerald-300 hover:text-emerald-200 hover:underline flex items-center justify-center gap-2"
              >
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Falar com o consultor Euzébio Borges</span>
              </a>
              <a 
                href="https://wa.me/5534991673559" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-emerald-300 hover:text-emerald-200 hover:underline flex items-center justify-center gap-2"
              >
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Falar com o consultor Lucas Almeida</span>
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
