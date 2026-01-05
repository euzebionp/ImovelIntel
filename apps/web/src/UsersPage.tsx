
import { useState, useEffect } from 'react';
import { api } from './lib/api';
import { Loader2, Trash2, UserCog, ShieldAlert, Shield, KeyRound } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  // Reset Password Modal State
  const [resetModal, setResetModal] = useState<{open: boolean, userId: string, userName: string} | null>(null);
  const [resetForm, setResetForm] = useState({ newPassword: '', adminPassword: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Falha ao carregar usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza? Isso apagará TODOS os dados deste usuário (leads, histórico, carteira).')) return;
    
    setProcessing(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir usuário.');
    } finally {
      setProcessing(null);
    }
  };

  const handleRoleUpdate = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Mudar permissão para ${newRole}?`)) return;

    setProcessing(id);
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar permissão.');
    } finally {
      setProcessing(null);
    }
  };

  const handleOpenReset = (u: User) => {
      setResetModal({ open: true, userId: u.id, userName: u.fullName });
      setResetForm({ newPassword: '', adminPassword: '' });
  };

  const handleSubmitReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!resetModal) return;

      setProcessing('RESET');
      try {
          await api.post(`/users/${resetModal.userId}/reset-password`, {
              newPassword: resetForm.newPassword,
              adminPassword: resetForm.adminPassword
          });
          alert('Senha redefinida com sucesso! O usuário deverá trocá-la no próximo login.');
          setResetModal(null);
      } catch (err: any) {
          alert(err.response?.data?.message || 'Falha ao redefinir senha. Verifique sua senha de administrador.');
      } finally {
          setProcessing(null);
      }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-destructive p-8">{error}</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
           <p className="text-muted-foreground">Administre contas, permissões e acesso.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2">
           <Shield size={16} /> Área Segura (Admin)
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Data Cadastro</th>
              <th className="px-6 py-4">Permissão</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{u.fullName || 'Sem nome'}</td>
                <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                <td className="px-6 py-4 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {u.role === 'ADMIN' && <ShieldAlert size={12} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.id !== currentUser?.id && (
                        <>
                             <button 
                                onClick={() => handleOpenReset(u)}
                                disabled={!!processing}
                                className="p-2 hover:bg-orange-100 text-muted-foreground hover:text-orange-600 rounded-lg transition-colors"
                                title="Redefinir Senha"
                            >
                                <KeyRound size={18} />
                            </button>
                            <button 
                                onClick={() => handleRoleUpdate(u.id, u.role)}
                                disabled={!!processing}
                                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="Alterar Permissão"
                            >
                                <UserCog size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(u.id)}
                                disabled={!!processing}
                                className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                title="Excluir Usuário"
                            >
                                {processing === u.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                        </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">Nenhum usuário encontrado.</div>
        )}
      </div>

      {/* Reset Password Modal */}
      {resetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-border">
                      <h3 className="text-lg font-semibold">Redefinir Senha</h3>
                      <p className="text-sm text-muted-foreground">Defina uma senha temporária para <strong>{resetModal.userName}</strong>.</p>
                  </div>
                  <form onSubmit={handleSubmitReset} className="p-6 space-y-4">
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Nova Senha Temporária</label>
                          <input 
                              type="text" 
                              required
                              className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                              value={resetForm.newPassword}
                              onChange={e => setResetForm({...resetForm, newPassword: e.target.value})}
                              placeholder="Ex: Temp123"
                          />
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium text-sm">
                              <Shield size={16} /> Autenticação de Segurança
                          </div>
                          <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Confirme sua senha de administrador para autorizar esta alteração.</p>
                          <input 
                              type="password" 
                              required
                              className="w-full px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800 bg-background"
                              value={resetForm.adminPassword}
                              onChange={e => setResetForm({...resetForm, adminPassword: e.target.value})}
                              placeholder="Sua senha de admin"
                          />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button"
                              onClick={() => setResetModal(null)}
                              className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                          >
                              Cancelar
                          </button>
                          <button 
                              type="submit"
                              disabled={!!processing}
                              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                          >
                              {processing === 'RESET' && <Loader2 className="animate-spin h-4 w-4" />}
                              Confirmar Redefinição
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
