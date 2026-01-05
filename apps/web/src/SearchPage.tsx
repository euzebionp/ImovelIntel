import { useState } from 'react';
import { Search, Loader2, Building } from 'lucide-react';
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
                       <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <h3 className="font-semibold mb-4 text-lg border-b border-border pb-2">Resultado da Análise</h3>
                  
                  {result.intelligence && (
                      <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border">
                          <div className="flex justify-between items-start">
                              <div>
                                  <h4 className="font-medium text-foreground">Score de Saúde do Imóvel</h4>
                                  <p className="text-sm text-muted-foreground mt-1">Baseado em regularidade, endereço e pendências.</p>
                              </div>
                              <div className="flex flex-col items-end">
                                  <span className={`text-3xl font-bold ${result.intelligence.score >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                      {result.intelligence.score}/100
                                  </span>
                                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Classificação {result.intelligence.classification}</span>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mt-4">
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium mb-1">Inscrição Municipal</span>
                      <span className="font-mono text-foreground font-medium">{result.inscricao || 'Não encontrada'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium mb-1">Matrícula (Simulada)</span>
                      <span className="font-mono text-foreground">123.456.789</span>
                    </div>
                    <div className="col-span-2">
                       <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium mb-1">Proprietário</span>
                       <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{result.owner?.name}</span>
                          <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">{result.owner?.cpf}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3">
                        <button
                            className="bg-card hover:bg-accent text-foreground px-4 py-2 rounded-lg font-medium border border-border transition-colors flex items-center gap-2 text-sm"
                            onClick={() => alert('Imóvel marcado para publicação! O feed XML será atualizado.')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                            Publicar nos Portais
                        </button>

                        <a 
                            href={`http://localhost:8001${result.report_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
                            Baixar Relatório (PDF)
                        </a>
                    </div>
                </div>   </>
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
