
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { api } from './lib/api';
import { Loader2, Lock, LogOut } from 'lucide-react';

export function ForcePasswordChange() {
  const { logout } = useAuth(); // Need login to update user state if successful without full re-login, OR just logout.
  // Actually, easiest way to update "mustChangePassword" in context is to re-fetch user or just patch local state if possible.
  // AuthContext might not expose a "updateUser" method.
  // If we just logout/login it works. OR we can just reload the page/ fetch profile.
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/change-password', { newPassword: password });
      alert('Senha atualizada com sucesso! Por favor, faça login novamente.');
      logout();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
           <div className="mx-auto h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
             <Lock size={24} />
           </div>
           <h1 className="text-2xl font-bold tracking-tight">Alteração Obrigatória de Senha</h1>
           <p className="text-muted-foreground">O administrador solicitou que você redefina sua senha por segurança.</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Nova Senha</label>
                 <input 
                   type="password"
                   required
                   className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   placeholder="••••••••"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Confirmar Nova Senha</label>
                 <input 
                   type="password"
                   required
                   className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                   value={confirmPassword}
                   onChange={e => setConfirmPassword(e.target.value)}
                   placeholder="••••••••"
                 />
              </div>

              {error && <div className="text-sm text-destructive font-medium">{error}</div>}

              <button 
                 type="submit"
                 disabled={loading}
                 className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
              >
                 {loading && <Loader2 className="animate-spin h-4 w-4" />}
                 Atualizar Senha
              </button>
           </form>
        </div>

        <div className="text-center">
           <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 mx-auto">
              <LogOut size={14} /> Sair da conta
           </button>
        </div>
      </div>
    </div>
  );
}
