
export enum Vault {
  ALL = 'All Vaults',
  VISUAL = 'Visual Vault',
  DIGITAL = 'Digital Vault'
}

export interface CaseStudy {
  challenge: string;
  strategy: string;
  result: string;
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
