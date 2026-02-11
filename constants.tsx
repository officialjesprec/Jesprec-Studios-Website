
import { Vault, Project, Service, ArtItem } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'QuickVend',
    vault: Vault.DIGITAL,
    image_url: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
    description: 'Empowering Nigerian Local Vendors with Mobile-First Sales Management.',
    tags: ['React Native', 'NativeWind', 'Fintech'],
    case_study: {
      blocks: [],
      challenge: 'Local vendors in Nigeria struggle to track credit, debt, and daily profits accurately using paper ledgers.',
      strategy: 'We developed a high-performance React Native application focused on a 10-second sale entry flow.',
      result: 'An intuitive interface that allows a vendor to record a sale in under 10 seconds.'
    }
  },
  {
    id: '2',
    title: 'SkillBridge Africa',
    vault: Vault.DIGITAL,
    image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    description: 'Bridging the Gap Between Trainers and Tech Learners Across the Continent.',
    tags: ['Full-Stack', 'LMS', 'Next.js'],
    case_study: {
      blocks: [],
      challenge: 'Specialized trainers in Africa lack a centralized platform to showcase their portfolios.',
      strategy: 'Engineered a robust Trainer Profile system with integrated repository links and automated deployment tracking.',
      result: 'Developed a comprehensive ecosystem that facilitates seamless trainer-to-learner interactions.'
    }
  },
  {
    id: '3',
    title: 'The Visual Vault: Lagos Pulse',
    vault: Vault.VISUAL,
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    description: 'Cinematic storytelling through high-octane event coverage and drone cinematography.',
    tags: ['Drone', '4K Video', 'Editing'],
    case_study: {
      blocks: [],
      challenge: 'Traditional event coverage lacked the cinematic scale needed to match the prestige of modern Lagos summits.',
      strategy: 'Utilized high-altitude drone maneuvers and synchronized multi-cam 4K feeds to create an immersive "Live Reel" experience.',
      result: 'Delivered a 60-second high-energy sizzle reel that boosted client engagement by 45% on social platforms.'
    }
  },
  {
    id: '4',
    title: 'Neon Cyberpunk Fashion',
    vault: Vault.VISUAL,
    image_url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800',
    description: 'Futuristic fashion brand campaign featuring avant-garde neon aesthetics.',
    tags: ['Photography', 'Art Direction', 'Fashion'],
    case_study: {
      blocks: [],
      challenge: 'The brand needed a visual identity that screamed "future-ready" without alienating contemporary audiences.',
      strategy: 'Combined practical neon lighting with HDR photography to create a surreal, cyberpunk atmosphere.',
      result: 'The campaign went viral on Instagram, increasing brand fellowship by 200% in two weeks.'
    }
  },
  {
    id: '5',
    title: 'EcoTech App UI',
    vault: Vault.DIGITAL,
    image_url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800',
    description: 'Clean, modern mobile interface for tracking personal carbon footprints.',
    tags: ['UI/UX', 'Mobile Design', 'Sustainability'],
    case_study: {
      blocks: [],
      challenge: 'Making carbon tracking engaging rather than guilt-inducing for the average user.',
      strategy: 'Used gamification elements and a lush, nature-inspired color palette to reward positive behaviors.',
      result: 'User retention rates are 40% higher than the industry average for sustainability apps.'
    }
  },
  {
    id: '6',
    title: 'Minimalist Architecture',
    vault: Vault.VISUAL,
    image_url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800',
    description: 'Architectural visualization focusing on light, shadow, and concrete textures.',
    tags: ['3D Rendering', 'Architecture', 'Minimalism'],
    case_study: {
      blocks: [],
      challenge: 'Representing the soul of a building before it even exists.',
      strategy: 'Focused on hyper-realistic lighting engines to simulate the exact way sunlight would hit the structure at different times of day.',
      result: 'The developer sold 80% of the units off-plan based solely on these visualizations.'
    }
  },
  {
    id: '7',
    title: 'Afro-Fusion Beats',
    vault: Vault.VISUAL,
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    description: 'Album art and branding for an upcoming Afro-fusion artist.',
    tags: ['Branding', 'Graphic Design', 'Music'],
    case_study: {
      blocks: [],
      challenge: 'Creating a visual language that fuses traditional African patterns with modern pop aesthetics.',
      strategy: 'Digitized authentic textile patterns and remixed them with bold, contemporary typography.',
      result: 'The album cover was featured in several design blogs for its innovative use of cultural heritage.'
    }
  },
  {
    id: '8',
    title: 'SmartHome Hub',
    vault: Vault.DIGITAL,
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    description: 'IoT dashboard for managing connected home devices with voice control integration.',
    tags: ['IoT', 'React', 'Dashboard'],
    case_study: {
      blocks: [],
      challenge: 'Controlling dozens of devices from different manufacturers in a single, unified interface.',
      strategy: 'Built a modular dashboard system where users can group devices by room or function.',
      result: 'Simplified home management for users, reducing the average time to execute a "good night" routine by 85%.'
    }
  },
  {
    id: '9',
    title: 'Urban Explorer',
    vault: Vault.VISUAL,
    image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800',
    description: 'Street photography series capturing the hidden geometry of city life.',
    tags: ['Photography', 'Urban', 'Fine Art'],
    case_study: {
      blocks: [],
      challenge: 'Finding beauty and order in the chaos of a bustling metropolis.',
      strategy: 'Shot exclusively at golden hour to capture long shadows and dramatic contrasts.',
      result: 'The series was exhibited at a local gallery and sold out its limited run of prints.'
    }
  },
  {
    id: '10',
    title: 'NextGen Banking',
    vault: Vault.DIGITAL,
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    description: 'Reimagining the digital banking experience for Gen Z users.',
    tags: ['Fintech', 'App Design', 'Security'],
    case_study: {
      blocks: [],
      challenge: 'Making banking transparent and accessible for a generation that distrusts traditional finance.',
      strategy: 'Focused on plain language, instant notifications, and social features for splitting bills.',
      result: 'The app achieved a 4.8-star rating on the App Store within three months of launch.'
    }
  }
];

export const ART_ITEMS: ArtItem[] = [
  {
    id: 'art1',
    name: 'Cyberpunk Skyline',
    price: '₦250,000',
    image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600',
    category: 'Original Canvas',
    stock_count: 5,
    is_sold_out: false
  },
  {
    id: 'art2',
    name: 'Neural Abstract',
    price: '₦180,000',
    image_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600',
    category: 'Framed Print',
    stock_count: 10,
    is_sold_out: false
  },
  {
    id: 'art3',
    name: 'Liquid Gold',
    price: '₦320,000',
    image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600',
    category: 'Mixed Media',
    stock_count: 2,
    is_sold_out: false
  },
  {
    id: 'art4',
    name: 'Geometric Silence',
    price: '₦150,000',
    image_url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&q=80&w=600',
    category: 'Acrylic on Wood',
    stock_count: 0,
    is_sold_out: true
  },
  {
    id: 'art5',
    name: 'Neon Dreams',
    price: '₦210,000',
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600',
    category: 'Digital Print',
    stock_count: 20,
    is_sold_out: false
  },
  {
    id: 'art6',
    name: 'Urban Decay',
    price: '₦280,000',
    image_url: 'https://images.unsplash.com/photo-1493612276216-9c59019558f3?auto=format&fit=crop&q=80&w=600',
    category: 'Photography',
    stock_count: 8,
    is_sold_out: false
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
