export interface Client {
  id: string;
  initials: string;
  name: string;
  address: string;
  lastVisit: string;
  tags: { label: string; color: string }[];
  colorClass: string;
  // Raw fields from JSON
  frecuencia: string;
  region: string;
  zona: string;
  atencion: string;
  mercaderistaNombre: string;
  mercaderistaRol: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  faces: number;
  present: boolean;
  lot?: string;
  expiry?: string;
  category?: string;
  available?: boolean;
  // State for selection
  selected?: boolean; 
  hasCompetition?: boolean;
  competitorData?: CompetitorProduct;
}

export interface CompetitorProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  faces: number;
  isRegistered: boolean;
  selected?: boolean;
  linkedProductId?: number; // ID of the Intervit product this competes with
}

export interface VisitState {
  user: {
      nombre: string;
      mercaderista: string;
  } | null;
  visitDate: string;
  client: Client | null;
  products: Product[];
  competitors: CompetitorProduct[];
}