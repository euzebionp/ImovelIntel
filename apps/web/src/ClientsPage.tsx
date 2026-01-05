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
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus leads e oportunidades.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Nome</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Contatos</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Orçamento</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Estágio</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Origem</th>
              {user?.role === 'ADMIN' && <th className="px-6 py-4 font-medium text-muted-foreground">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Nenhum cliente cadastrado.
                    </td>
                </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{lead.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
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
                <td className="px-6 py-4 text-muted-foreground">{lead.source}</td>
                {user?.role === 'ADMIN' && (
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => openEditModal(lead)}
                                className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-primary transition-colors"
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
            <div className="bg-card p-6 rounded-xl border border-border w-full max-w-md shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4">{editingLead ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
                <form onSubmit={handleCreateOrUpdateLead} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome Completo</label>
                        <input 
                            name="name" 
                            required 
                            className="w-full px-3 py-2 rounded-md border border-input bg-background" 
                            placeholder="Ex: João da Silva" 
                            defaultValue={editingLead?.name}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Telefone</label>
                            <input 
                                name="phone" 
                                className="w-full px-3 py-2 rounded-md border border-input bg-background" 
                                placeholder="(11) 99999-9999" 
                                defaultValue={editingLead?.phone}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Orçamento (R$)</label>
                            <input 
                                name="budget" 
                                type="number" 
                                className="w-full px-3 py-2 rounded-md border border-input bg-background" 
                                placeholder="500000" 
                                defaultValue={editingLead?.budget}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input 
                            name="email" 
                            type="email" 
                            className="w-full px-3 py-2 rounded-md border border-input bg-background" 
                            placeholder="joao@email.com" 
                            defaultValue={editingLead?.email}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => { setShowNewLeadModal(false); setEditingLead(null); }}
                            className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
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
