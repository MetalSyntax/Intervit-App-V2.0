import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, HeaderInternal, Button, Icon, Counter } from '../components/UI';
import { VisitState } from '../types';

const VisitDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [visitState, setVisitState] = useState<VisitState>({
      user: null,
      visitDate: new Date().toISOString().split('T')[0],
      client: null,
      products: [],
      competitors: []
  });

  useEffect(() => {
      const saved = localStorage.getItem('visitState');
      if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.user) {
              navigate('/'); // Redirect if not logged in
              return;
          }
          if (!parsed.visitDate) {
              parsed.visitDate = new Date().toISOString().split('T')[0];
          }
          setVisitState(parsed);
      } else {
          navigate('/'); // Redirect if no state
      }
  }, [navigate]);

  const updateDate = (date: string) => {
      const newState = { ...visitState, visitDate: date };
      setVisitState(newState);
      localStorage.setItem('visitState', JSON.stringify(newState));
  };

  const handleDeleteProduct = (id: number) => {
      const updatedProducts = visitState.products.filter(p => p.id !== id);
      const newState = { ...visitState, products: updatedProducts };
      setVisitState(newState);
      localStorage.setItem('visitState', JSON.stringify(newState));
  };

  const handleExportCSV = () => {
      if (visitState.products.length === 0) {
          alert("No hay productos para exportar.");
          return;
      }

      const headers = ["ID", "SKU", "Nombre", "Categoria", "Precio", "Inventario", "Caras", "Presencia", "Lote", "Vence", "Competencia", "Precio Comp.", "Caras Comp."];
      const rows = visitState.products.map(p => [
          p.id,
          p.sku,
          `"${p.name}"`, // Quote strings to handle commas
          p.category,
          p.price,
          p.stock,
          p.faces,
          p.present ? "SI" : "NO",
          p.lot || "",
          p.expiry || "",
          p.hasCompetition ? `"${p.competitorData?.name || 'Genérico'}"` : "NO",
          p.hasCompetition ? p.competitorData?.price : "",
          p.hasCompetition ? p.competitorData?.faces : ""
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `visita_${visitState.client?.name || 'sin_cliente'}_${visitState.visitDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const userName = visitState.user ? `${visitState.user.nombre}` : 'Usuario';

  return (
    <Container>
      <HeaderInternal title="Panel de Gestión" showCart={false} showBack={false} />
      
      <main className="max-w-4xl mx-auto w-full px-4 pb-24 pt-6 space-y-8">
        <section className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white uppercase">BIENVENIDO!, {userName.toUpperCase()}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Gestión de Ventas</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Icon name="store" className="text-primary text-xl" />
            Seguimiento para el Punto de Venta
          </h2>
          <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-3xl shadow-soft space-y-4 border border-gray-100 dark:border-gray-800">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Fecha de Visita</label>
              <div className="relative">
                <input 
                    className="w-full rounded-2xl border-gray-200 dark:border-gray-700 focus:border-primary focus:ring focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 px-4 shadow-sm transition-all" 
                    type="date" 
                    value={visitState.visitDate}
                    onChange={(e) => updateDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Cliente Seleccionado</label>
              <div 
                onClick={() => navigate('/clients')}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 h-12 px-4 flex items-center justify-between cursor-pointer hover:border-primary transition-all group"
              >
                <span className={`font-bold ${visitState.client ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {visitState.client ? visitState.client.name : 'Seleccionar Cliente...'}
                </span>
                <Icon name="edit" className="text-primary text-sm opacity-50 group-hover:opacity-100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Frecuencia</label>
                <div className="relative">
                    <input 
                        className="w-full rounded-2xl border-gray-200 dark:border-gray-700 bg-[#FEFBF2] dark:bg-gray-800 text-gray-900 dark:text-white h-10 px-3 text-sm font-medium shadow-sm"
                        readOnly
                        value={visitState.client?.frecuencia || '-'}
                    />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Región</label>
                <div className="relative">
                    <input 
                        className="w-full rounded-2xl border-gray-200 dark:border-gray-700 bg-[#FEFBF2] dark:bg-gray-800 text-gray-900 dark:text-white h-10 px-3 text-sm font-medium shadow-sm"
                        readOnly
                        value={visitState.client?.region || '-'}
                    />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Buttons for other views */}
        <section className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/products')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-primary transition-all group text-left">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon name="shopping_cart" className="text-blue-500" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Productos</h3>
                <p className="text-xs text-gray-400">Gestionar pedido</p>
            </button>
            <button onClick={() => navigate('/competitors')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-primary transition-all group text-left">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon name="assessment" className="text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">Competencia</h3>
                <p className="text-xs text-gray-400">Registro de precios</p>
            </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 flex items-center justify-between px-1">
            <span className="flex items-center gap-2">
              <Icon name="list_alt" className="text-primary text-xl" />
              Productos Agregados
            </span>
            <span className="text-xs font-medium bg-primary/10 text-primary-dark px-3 py-1 rounded-full border border-primary/20">{visitState.products.length} ítem(s)</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {visitState.products.length > 0 ? (
                visitState.products.map(product => (
                <div key={product.id} className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 p-0 overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-dark"></div>
                    <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="pr-4">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{product.category}</span>
                        <h3 className="font-bold text-gray-800 dark:text-white text-base leading-tight">{product.name}</h3>
                        </div>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-danger transition-colors p-1 -mr-2 -mt-2">
                        <Icon name="delete_outline" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-semibold text-center">Cant. Inventario</p>
                        <Counter value={product.stock} onChange={() => {}} readOnly={true} />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-semibold text-center">Caras Intervit</p>
                        <Counter value={product.faces} onChange={() => {}} readOnly={true} />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-y-3 gap-x-1 text-xs border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="text-center">
                        <p className="text-gray-400 mb-0.5">Precio</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">${product.price}</p>
                        </div>
                        <div className="text-center border-l border-gray-100 dark:border-gray-700">
                        <p className="text-gray-400 mb-0.5">Presencia</p>
                        <p className={`font-bold ${product.present ? 'text-green-600' : 'text-red-500'}`}>{product.present ? 'Si' : 'No'}</p>
                        </div>
                        <div className="text-center border-l border-gray-100 dark:border-gray-700">
                        <p className="text-gray-400 mb-0.5">Lote</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{product.lot || '-'}</p>
                        </div>
                        <div className="text-center border-l border-gray-100 dark:border-gray-700">
                        <p className="text-gray-400 mb-0.5">Vence</p>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{product.expiry || '-'}</p>
                        </div>
                    </div>

                    {/* Competitor Data Section */}
                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 -mx-5 px-5 pb-1">
                        {product.hasCompetition ? (
                            <div className="bg-red-50/50 dark:bg-red-900/10 p-2 rounded-lg">
                                <div className="flex items-start gap-2 mb-2">
                                <Icon name="warning" className="text-red-400 text-sm mt-0.5" />
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
                                    <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">Competencia Directa</span>
                                    {product.competitorData?.name || 'Competencia Registrada'}
                                </p>
                                </div>
                                <div className="flex justify-between items-center pl-6 text-xs mb-2">
                                <span className="px-2 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Caras: <b className="text-gray-900 dark:text-white">{product.competitorData?.faces}</b></span>
                                <span className="px-2 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Precio: <b className="text-gray-900 dark:text-white">${product.competitorData?.price}</b></span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-2 italic">
                                <Icon name="check_circle_outline" className="text-green-500 text-sm" />
                                Sin competencia registrada
                            </div>
                        )}
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <Icon name="remove_shopping_cart" className="text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-500">No hay productos agregados</p>
                </div>
            )}
          </div>
        </section>

        <div className="pt-4 space-y-3 pb-8">
          <Button onClick={handleExportCSV}>
             <Icon name="download" className="mr-2" /> Guardar Registro (CSV)
          </Button>
          <Button variant="danger" onClick={() => navigate('/')}>
             <Icon name="logout" className="mr-2" /> Cerrar sesión
          </Button>
        </div>

        <footer className="text-center space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Todos los derechos reservados © 2025.<br />
            Creado por MetalSyntax para Intervit.
          </p>
        </footer>
      </main>
    </Container>
  );
};

export default VisitDashboard;