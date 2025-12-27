import { useState } from 'react';
import { Search, Loader2, MapPin, Building } from 'lucide-react';
import { api } from './lib/api';

export function SearchPage() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setSearchStatus(null);
    try {
      const res = await api.post('/search/address', { address });
      setSearchStatus({ ...res.data, message: 'Busca iniciada! Aguardando o robô...' });
      
      // Start Polling
      pollStatus(res.data.searchId);
    } catch (error) {
      console.error(error);
      setSearchStatus({ status: 'ERROR', message: 'Falha ao iniciar busca.' });
      setLoading(false);
    }
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/search/${id}`);
        const status = res.data.status;
        
        if (status === 'COMPLETED') {
          setSearchStatus({ ...res.data, message: 'Busca concluída com sucesso!' });
          setLoading(false);
          clearInterval(interval);
        } else if (status === 'FAILED') {
          setSearchStatus({ ...res.data, message: 'Busca falhou.' });
          setLoading(false);
          clearInterval(interval);
        } else {
             setSearchStatus((prev: any) => ({ ...prev, status }));
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Buscar Dados do Imóvel</h2>
        <p className="text-muted-foreground">Digite o endereço ou CEP para localizar a Inscrição Municipal e Proprietário.</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
             <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Rua Pamplona, 1234 - Jardins, São Paulo"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button 
            disabled={loading}
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Buscar
          </button>
        </form>
      </div>

      {searchStatus && (
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                   {loading ? <Loader2 className="animate-spin text-primary" /> : <Building className="text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Status da Busca</h3>
                  <p className="text-sm text-muted-foreground">{searchStatus.message}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold font-mono">
                {searchStatus.status}
              </span>
           </div>
           
           {searchStatus.status === 'COMPLETED' && (
             <div className="p-6 space-y-4">
               {(() => {
                 try {
                   const result = JSON.parse(searchStatus.resultSummary);
                   return (
                     <>
                       <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                         <h4 className="font-medium text-emerald-600 mb-2 flex items-center gap-2">
                           <MapPin size={18} /> Dados Encontrados
                         </h4>
                         <p className="text-foreground">{result.message}</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-background rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Inscrição Municipal</p>
                            <p className="font-mono text-lg">{result.inscricao}</p>
                          </div>
                           <div className="p-4 bg-background rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Proprietário</p>
                            <p className="font-mono text-lg">{result.owner.name} (CPF {result.owner.cpf})</p>
                          </div>
                       </div>
                     </>
                   );
                 } catch (e) {
                   return <p className="text-destructive">Erro ao ler dados retornados.</p>;
                 }
               })()}

               <button className="w-full py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors border border-border">
                 Desbloquear Contato Completo (5 Créditos)
               </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
