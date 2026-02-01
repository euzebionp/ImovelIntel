import { useState, useEffect } from 'react';
import { api } from './lib/api';
import { Plus, Phone, Mail, Pencil, Trash } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: {
    name: string;
    color: string;
  };
  budget: number;
  source: string;
}

export function ClientsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/crm/leads');
      setLeads(res.data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        budget: Number(formData.get('budget')),
        source: 'MANUAL',
        userId: user?.id || 'demo-user-id' 
    };

    try {
        if (editingLead) {
             await api.put(`/crm/leads/${editingLead.id}`, data);
             alert('Cliente atualizado com sucesso!');
        } else {
             await api.post('/crm/leads', data);
             alert('Cliente cadastrado com sucesso!');
        }
        setShowNewLeadModal(false);
        setEditingLead(null);
        fetchLeads();
    } catch (error: any) {
        console.error("Failed to save lead", error);
        const errorMsg = error.response?.data?.message || 'Erro ao salvar cliente.';
        alert(`Erro: ${errorMsg}`);
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
      try {
          await api.delete(`/crm/leads/${id}`);
          setLeads(leads.filter(l => l.id !== id));
      } catch (error: any) {
          console.error("Failed to delete lead", error);
          alert('Erro ao excluir cliente. Verifique se você tem permissão.');
      }
  }

  const openEditModal = (lead: Lead) => {
      setEditingLead(lead);
      setShowNewLeadModal(true);
  }

  const openNewModal = () => {
      setEditingLead(null);
      setShowNewLeadModal(true);
  }

  if (loading) return <div className="p-8">Carregando clientes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Gestão de Clientes</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Gerencie seus leads e oportunidades.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="btn-futuristic px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="glass-card rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-white/70">Nome</th>
              <th className="px-6 py-4 font-medium text-white/70">Contatos</th>
              <th className="px-6 py-4 font-medium text-white/70">Orçamento</th>
              <th className="px-6 py-4 font-medium text-white/70">Estágio</th>
              <th className="px-6 py-4 font-medium text-white/70">Origem</th>
              {user?.role === 'ADMIN' && <th className="px-6 py-4 font-medium text-white/70">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {leads.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/60">
                        Nenhum cliente cadastrado.
                    </td>
                </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs text-white/60">
                    {lead.phone && <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>}
                    {lead.email && <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">
                    {lead.budget ? `R$ ${lead.budget.toLocaleString('pt-BR')}` : '-'}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${lead.stage?.color}20`, color: lead.stage?.color || '#888' }}
                  >
                    {lead.stage?.name || 'Novo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/70">{lead.source}</td>
                {user?.role === 'ADMIN' && (
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => openEditModal(lead)}
                                className="p-2 hover:bg-white/10 rounded-md text-blue-400 hover:text-blue-300 transition-colors"
                                title="Editar"
                            >
                                <Pencil size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(lead.id)}
                                className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                                title="Excluir"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Reuse Modal for Create/Edit */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-bold mb-6 text-white">{editingLead ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
                <form onSubmit={handleCreateOrUpdateLead} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Nome Completo</label>
                        <input 
                            name="name" 
                            required 
                            className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm" 
                            placeholder="Ex: João da Silva" 
                            defaultValue={editingLead?.name}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Telefone</label>
                            <input 
                                name="phone" 
                                className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm" 
                                placeholder="(11) 99999-9999" 
                                defaultValue={editingLead?.phone}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Orçamento (R$)</label>
                            <input 
                                name="budget" 
                                type="number" 
                                className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm" 
                                placeholder="500000" 
                                defaultValue={editingLead?.budget}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Email</label>
                        <input 
                            name="email" 
                            type="email" 
                            className="w-full px-3 py-2 rounded-md border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm" 
                            placeholder="joao@email.com" 
                            defaultValue={editingLead?.email}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => { setShowNewLeadModal(false); setEditingLead(null); }}
                            className="px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-md transition-colors border border-white/20"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn-futuristic px-4 py-2 rounded-md text-sm font-medium text-white"
                        >
                            {editingLead ? 'Atualizar Cliente' : 'Salvar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
