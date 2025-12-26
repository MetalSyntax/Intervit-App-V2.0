import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, HeaderInternal, Icon, Counter, Button } from '../components/UI';
import { Product, VisitState } from '../types';
import { PRODUCTS_DATA } from '../data';

// Map raw JSON to Product interface
const INITIAL_PRODUCTS: Product[] = PRODUCTS_DATA.map(raw => ({
    id: raw.id,
    sku: raw.id.toString(), // Use ID as SKU or leave blank if needed
    name: raw.descripcion,
    price: 0, // Default price
    stock: 0,
    faces: 0,
    lot: '',
    expiry: '',
    category: raw.linea,
    present: true,
    available: true,
    selected: false
}));

const ProductSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Load previously selected products from dashboard state
  useEffect(() => {
    const saved = localStorage.getItem('visitState');
    if (saved) {
        const state: VisitState = JSON.parse(saved);
        if (state.products && state.products.length > 0) {
            // Merge existing selections with catalog
            const merged = INITIAL_PRODUCTS.map(p => {
                const found = state.products.find(sp => sp.id === p.id);
                return found ? { ...p, ...found, selected: true } : p;
            });
            setProducts(merged);
        }
    }
  }, []);

  const updateProduct = (id: number, field: keyof Product, value: any) => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleSelection = (id: number) => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const handleSave = () => {
      const selected = products.filter(p => p.selected);
      const saved = localStorage.getItem('visitState');
      if (saved) {
          const state: VisitState = JSON.parse(saved);
          state.products = selected;
          localStorage.setItem('visitState', JSON.stringify(state));
      }
      navigate('/dashboard');
  };

  const filteredProducts = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.includes(searchTerm);
      const matchesFilter = activeFilter === 'Todo' || p.category === activeFilter;
      return matchesSearch && matchesFilter;
  });

  const totalSelected = products.filter(p => p.selected).length;

  return (
    <Container className="pb-44">
       <HeaderInternal title="Selección de Productos" showCart={false} />
       
       <main className="max-w-4xl mx-auto w-full relative">
         <div className="sticky top-[65px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm pt-4 pb-2 px-4 transition-all border-b border-transparent shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Icon name="inventory" className="text-primary" />
                Selección de Productos
            </h1>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors text-gray-400">
                 <Icon name="search" />
               </div>
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-surface-light dark:bg-surface-dark shadow-soft focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none" 
                 placeholder="Buscar por nombre o SKU..." 
                 type="text" 
               />
            </div>
            
            <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                   {['Todo', 'TERAPEUTICA', 'NUTRICIONAL', 'INTIMA', 'CORPORAL', 'CAPILAR'].map((tag, i) => (
                       <button 
                         key={i} 
                         onClick={() => setActiveFilter(tag)}
                         className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors ${activeFilter === tag ? 'bg-primary text-white' : 'bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                       >
                           {tag}
                       </button>
                   ))}
                </div>
                <span className="text-xs font-medium text-primary whitespace-nowrap ml-2">{filteredProducts.length} encontrados</span>
            </div>
         </div>

         <div className="px-4 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
             {filteredProducts.map(product => (
                 product.available ? (
                    <div key={product.id} className={`bg-surface-light dark:bg-surface-dark rounded-3xl p-4 shadow-soft border transition-all hover:border-primary/30 flex gap-4 ${product.selected ? 'border-primary ring-1 ring-primary/30' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="w-24 flex-shrink-0 flex flex-col gap-2">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden text-gray-300">
                                <Icon name="medication" className="text-4xl" />
                            </div>
                            <button 
                                onClick={() => toggleSelection(product.id)}
                                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${product.selected ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary text-white hover:bg-primary-dark'}`}
                            >
                                {product.selected ? 'Quitar' : 'Agregar'}
                            </button>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight pr-2">{product.name}</h3>
                                    <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${product.present ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                                    <span className="text-gray-300 mx-1">|</span>
                                    <div className="flex items-center text-primary text-sm font-bold">
                                        <span>$</span>
                                        <input 
                                            type="number" 
                                            value={product.price}
                                            onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                                            className="w-16 bg-transparent border-b border-primary/30 focus:border-primary focus:outline-none px-1 py-0 text-primary font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Lote</label>
                                    <input 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" 
                                        type="text" 
                                        value={product.lot}
                                        onChange={(e) => updateProduct(product.id, 'lot', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Vencimiento</label>
                                    <input 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" 
                                        type="text" 
                                        value={product.expiry}
                                        onChange={(e) => updateProduct(product.id, 'expiry', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Inventario</label>
                                    <input 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary text-center" 
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => updateProduct(product.id, 'stock', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Caras Int.</label>
                                    <input 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary text-center" 
                                        type="number"
                                        value={product.faces}
                                        onChange={(e) => updateProduct(product.id, 'faces', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Presencia</span>
                                <div className="flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                                    <button 
                                        onClick={() => updateProduct(product.id, 'present', true)}
                                        className={`px-3 py-1 rounded-lg shadow-sm text-xs font-bold transition-all ${product.present ? 'bg-white dark:bg-gray-600 text-primary dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
                                    >Sí</button>
                                    <button 
                                        onClick={() => updateProduct(product.id, 'present', false)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!product.present ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
                                    >No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <div key={product.id} className="bg-surface-light dark:bg-surface-dark rounded-3xl p-4 shadow-soft border border-gray-200 dark:border-gray-700 flex gap-4 transition-all opacity-80">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden grayscale">
                            <Icon name="spa" className="text-gray-300 text-4xl" />
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 flex items-center justify-center">
                                <span className="text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded-full">AGOTADO</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-600 dark:text-gray-400 text-sm leading-tight pr-2">{product.name}</h3>
                                <span className="w-2 h-2 rounded-full bg-gray-300 mt-1 flex-shrink-0"></span>
                            </div>
                            <div className="flex justify-between items-baseline mt-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                                <p className="text-sm font-bold text-gray-400">$ {product.price.toFixed(2)}</p>
                            </div>
                            <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                                <p className="text-xs text-gray-400 italic">Producto no disponible</p>
                            </div>
                        </div>
                    </div>
                 )
             ))}
             {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No se encontraron productos</p>
                </div>
             )}
         </div>
       </main>

       <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto space-y-3">
             <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Productos seleccionados:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{totalSelected}</span>
             </div>
             <div className="grid grid-cols-2 gap-3">
                 <Button variant="secondary" onClick={() => navigate('/dashboard')} className="rounded-xl">
                     Cancelar
                 </Button>
                 <Button onClick={handleSave} className="rounded-xl">
                     <Icon name="check" className="mr-2" /> Guardar
                 </Button>
             </div>
          </div>
       </div>
    </Container>
  );
};

export default ProductSelection;