
import { Vault, Project, Service, ArtItem } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'QuickVend',
    vault: Vault.DIGITAL,
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
    description: 'Empowering Nigerian Local Vendors with Mobile-First Sales Management.',
    tags: ['React Native', 'NativeWind', 'Fintech'],
    caseStudy: {
      challenge: 'Local vendors in Nigeria struggle to track credit, debt, and daily profits accurately using paper ledgers. They need a simple, offline-capable digital solution for high-velocity environments.',
      strategy: 'We developed a high-performance React Native application focused on a 10-second sale entry flow. We utilized NativeWind for styling and optimized for low-end Android devices common in the local market.',
      result: 'An intuitive interface that allows a vendor to record a sale in under 10 seconds, reducing daily reconciliation time and eliminating ledger errors by 100%.'
    }
  },
  {
    id: '2',
    title: 'SkillBridge Africa',
    vault: Vault.DIGITAL,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    description: 'Bridging the Gap Between Trainers and Tech Learners Across the Continent.',
    tags: ['Full-Stack', 'LMS', 'Next.js'],
    caseStudy: {
      challenge: 'Specialized trainers in Africa lack a centralized platform to showcase their portfolios, manage diverse learner interactions, and verify skills effectively.',
      strategy: 'Engineered a robust Trainer Profile system with integrated repository links and automated deployment tracking, focusing on a mobile-first UI for African accessibility.',
      result: 'Developed a comprehensive ecosystem that facilitates seamless trainer-to-learner interactions and verifiable skill badges, now used by hundreds of tech enthusiasts.'
    }
  },
  {
    id: '3',
    title: 'The Visual Vault: Lagos Pulse',
    vault: Vault.VISUAL,
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a747b?auto=format&fit=crop&q=80&w=800',
    description: 'Cinematic storytelling through high-octane event coverage and drone cinematography.',
    tags: ['Drone', '4K Video', 'Editing'],
    caseStudy: {
      challenge: 'Traditional event coverage lacked the cinematic scale needed to match the prestige of modern Lagos summits.',
      strategy: 'Utilized high-altitude drone maneuvers and synchronized multi-cam 4K feeds to create an immersive "Live Reel" experience.',
      result: 'Delivered a 60-second high-energy sizzle reel that boosted client engagement by 45% on social platforms.'
    }
  }
];

export const ART_ITEMS: ArtItem[] = [
  {
    id: 'art1',
    name: 'Cyberpunk Skyline',
    price: '₦250,000',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600',
    category: 'Original Canvas'
  },
  {
    id: 'art2',
    name: 'Neural Abstract',
    price: '₦180,000',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600',
    category: 'Framed Print'
  }
];

export const CREATIVE_SERVICES: Service[] = [
  { id: 'cs1', title: 'Media Production', items: ['Cinematic Ads', 'Corporate Docs', 'Product Photography'], icon: '🎥' },
  { id: 'cs2', title: 'Innovation Media', items: ['Drone Coverage', 'Livestreaming', 'Event Capture'], icon: '🚁' }
];

export const DIGITAL_SERVICES: Service[] = [
  { id: 'ds1', title: 'Digital Architecture', items: ['Custom Full-Stack Web', 'React Native Apps', 'UI/UX Design'], icon: '💻' },
  { id: 'ds2', title: 'Strategic Growth', items: ['Brand Identity', 'Social Management', 'Content Strategy'], icon: '📈' }
];
