import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, HeaderInternal, Icon, Counter } from '../components/UI';
import { CompetitorProduct, VisitState, Product } from '../types';
import { COMPETITORS_DATA } from '../data';

// Map raw JSON to CompetitorProduct interface
const INITIAL_COMPETITORS: CompetitorProduct[] = COMPETITORS_DATA.map(raw => ({
    id: raw.id,
    name: raw.nombre,
    brand: raw.marca,
    category: raw.linea,
    price: '',
    faces: 0,
    isRegistered: false,
    selected: false
}));

const CompetitorSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [items, setItems] = useState<CompetitorProduct[]>(INITIAL_COMPETITORS);
  const [dashboardProducts, setDashboardProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load existing competitor data and selected products from dashboard
    const saved = localStorage.getItem('visitState');
    if (saved) {
        const state: VisitState = JSON.parse(saved);
        
        // Load selected Intervit products to populate the dropdown
        setDashboardProducts(state.products || []);

        if (state.competitors && state.competitors.length > 0) {
            const merged = INITIAL_COMPETITORS.map(p => {
                const found = state.competitors.find(sc => sc.id === p.id);
                return found ? { ...p, ...found, selected: true } : p;
            });
            setItems(merged);
        }
    }
  }, []);

  const updateItem = (id: number, field: keyof CompetitorProduct, value: any) => {
      setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleSelection = (id: number) => {
      setItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const handleSave = () => {
     // Save competitors
     const selectedCompetitors = items.filter(i => i.selected);
     
     const saved = localStorage.getItem('visitState');
     if (saved) {
         const state: VisitState = JSON.parse(saved);
         state.competitors = selectedCompetitors;
         
         // Logic to associate competitor to specific product
         if (state.products.length > 0) {
             const updatedProducts = state.products.map(p => {
                 // Find if any selected competitor is linked to this product
                 const linkedCompetitor = selectedCompetitors.find(c => c.linkedProductId === p.id);
                 if (linkedCompetitor) {
                     return { ...p, hasCompetition: true, competitorData: linkedCompetitor };
                 } else {
                     return { ...p, hasCompetition: false, competitorData: undefined };
                 }
             });
             state.products = updatedProducts;
         }

         localStorage.setItem('visitState', JSON.stringify(state));
     }
     navigate('/dashboard');
  };

  const filteredItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' || item.category === activeFilter;
      return matchesSearch && matchesFilter;
  });

  const totalSelected = items.filter(i => i.selected).length;

  return (
    <Container className="pb-44">
      {/* Removed Filter Icon via prop */}
      <HeaderInternal title="Intervit" showBack={true} showFilter={false} />
      
      <main className="max-w-4xl mx-auto w-full px-4 pt-6 space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Icon name="assessment" className="text-primary" />
            Selección de Competencia
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Busque el producto competencia, asócielo a un producto Intervit y registre precios.
          </p>
        </section>

        <section className="sticky top-[70px] z-40 bg-background-light dark:bg-background-dark py-2 -mx-4 px-4 transition-all">
          <div className="relative group shadow-sm rounded-xl mb-3">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Icon name="search" className="text-gray-400 group-focus-within:text-primary transition-colors" />
             </div>
             <input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="block w-full pl-10 pr-4 py-3.5 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all text-base" 
               placeholder="Buscar marca o producto..." 
               type="text" 
             />
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 {['Todos', 'TERAPEUTICA', 'NUTRICIONAL', 'INTIMA', 'CORPORAL', 'CAPILAR'].map((cat, i) => (
                     <button 
                        key={i} 
                        onClick={() => setActiveFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === cat ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                     >
                         {cat}
                     </button>
                 ))}
              </div>
              <span className="text-xs font-medium text-primary whitespace-nowrap ml-2">{filteredItems.length} resultados</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
           {filteredItems.map(item => (
               <div key={item.id} className={`bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-md border relative overflow-hidden transition-all transform hover:scale-[1.01] ${item.selected ? 'border-primary ring-1 ring-primary/30' : 'border-gray-100 dark:border-gray-800'} ${item.isRegistered ? 'border-l-4 border-l-primary' : ''}`}>
                  {item.isRegistered && (
                      <div className="absolute top-3 right-3">
                         <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                            <Icon name="check_circle" className="text-[12px]" />
                            REGISTRADO
                         </span>
                      </div>
                  )}
                  <div className="mb-4 pr-16">
                     <h3 className="font-bold text-gray-800 dark:text-white text-base">{item.name}</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">{item.brand} • {item.category}</p>
                  </div>

                  {/* Association Dropdown */}
                  <div className="mb-4">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">Competencia de:</label>
                      <select 
                        value={item.linkedProductId || ''} 
                        onChange={(e) => updateItem(item.id, 'linkedProductId', parseInt(e.target.value))}
                        className="w-full text-sm p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                          <option value="">-- Seleccionar Producto Intervit --</option>
                          {dashboardProducts.map(dp => (
                              <option key={dp.id} value={dp.id}>{dp.name}</option>
                          ))}
                      </select>
                  </div>

                  <div className={`rounded-xl p-3 grid grid-cols-2 gap-4 border mb-4 ${item.isRegistered ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700' : 'border-transparent'}`}>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio Comp. ($)</label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                           <input 
                                value={item.price}
                                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                className="w-full pl-6 pr-2 py-2.5 text-center font-bold rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-primary text-sm shadow-sm" 
                                type="number" 
                                placeholder="0.00"
                            />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nº Caras</label>
                        <input 
                             value={item.faces}
                             onChange={(e) => updateItem(item.id, 'faces', parseInt(e.target.value) || 0)}
                             className="w-full py-2.5 text-center font-bold rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-primary text-sm shadow-sm" 
                             type="number"
                             placeholder="0"
                        />
                     </div>
                  </div>

                  <button 
                        onClick={() => toggleSelection(item.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${item.selected ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary text-white hover:bg-primary-dark'}`}
                    >
                        {item.selected ? 'Quitar de la lista' : 'Agregar a la lista'}
                    </button>
               </div>
           ))}
           {filteredItems.length === 0 && (
               <div className="col-span-full text-center py-8">
                   <p className="text-gray-500">No se encontraron productos de la competencia.</p>
               </div>
           )}
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Competencia seleccionada:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{totalSelected}</span>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/dashboard')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3.5 px-4 rounded-xl transition-colors text-sm">
                   Cancelar
                </button>
                <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm">
                   <Icon name="save" className="text-lg" />
                   Guardar y Volver
                </button>
             </div>
         </div>
      </footer>
    </Container>
  );
};

export default CompetitorSelection;