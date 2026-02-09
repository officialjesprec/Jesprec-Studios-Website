
export enum Vault {
  VISUAL = 'Visual Vault',
  DIGITAL = 'Digital Vault',
  ART = 'Art Vault'
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
  image: string;
  description: string;
  tags: string[];
  caseStudy?: CaseStudy;
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
  image: string;
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
