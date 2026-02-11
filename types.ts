
export enum Vault {
  ALL = 'All Vaults',
  VISUAL = 'Visual Vault',
  DIGITAL = 'Digital Vault'
}

export type CaseStudyBlockType = 'text' | 'media';

export interface CaseStudyBlock {
  id: string;
  type: CaseStudyBlockType;
  label?: string; // e.g. "The Challenge", "Technical Strategy"
  content?: string; // For text blocks
  url?: string; // For media blocks
  media_type?: 'image' | 'video'; // For media blocks
}

export interface CaseStudy {
  blocks: CaseStudyBlock[];
  challenge?: string; // Legacy support (optional)
  strategy?: string; // Legacy support (optional)
  result?: string; // Legacy support (optional)
}

export interface Project {
  id: string;
  title: string;
  vault: Vault;
  image_url: string;
  description: string;
  tags: string[];
  case_study?: CaseStudy;
}

export interface Service {
  id: string;
  title: string;
  items: string[];
  icon: string;
}

export interface ArtItem {
  id: string;
  name: string;
  price: string;
  image_url: string;
  category: string;
  stock_count: number;
  is_sold_out: boolean;
}

export interface Order {
  id: string;
  created_at: string;
  item_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity: number;
  delivery_type: 'doorstep' | 'bus_park';
  delivery_details?: string; // General/Legacy
  house_number?: string;
  street?: string;
  city?: string;
  state?: string;
  landmark?: string;
  landmark_description?: string;
  park_name?: string;
  delivery_fee?: number;
  vat?: number;
  processing_fee?: number;
  total_price: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  payment_reference?: string;
  item?: ArtItem;
}

export interface DeliveryFee {
  id: string;
  state: string;
  park_name: string;
  fee: number;
}

export type ProjectRoute = 'MEDIA' | 'DIGITAL' | 'SOCIAL' | 'ART' | null;

export interface QuoteFormData {
  route: ProjectRoute;
  name: string;
  email: string;
  details: Record<string, any>;
  budget: string;
  timeline: string;
}
