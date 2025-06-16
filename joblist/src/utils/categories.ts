import { IconType } from 'react-icons';
import { JobCategory } from '@/types/prisma';
import { 
  FiTool, // General tools
  FiZap, // Electricity
  FiDroplet, // Plumbing
  FiPenTool, // Architect
  FiGrid, // Carpentry
  FiWind, // HVAC
  FiSettings, // Appliance repair
  FiHome, // General contractor
  FiLayout, // Interior designer
  FiCloud, // Landscaper
  FiBriefcase, // Mason
  FiUmbrella, // Roofer
  FiSquare, // Flooring
  FiShield, // Security
  FiSearch, // Inspector
  FiTrash2, // Cleaning
  FiAlertTriangle, // Pest control
  FiDroplet as FiPool, // Pool
  FiSun, // Solar
} from 'react-icons/fi';

export const categoryTranslations: Record<JobCategory, string> = {
  ELECTRICIAN: 'Ηλεκτρολογικά',
  PLUMBER: 'Υδραυλικά',
  PAINTER: 'Βαφές',
  CARPENTER: 'Ξυλουργικά',
  HVAC_TECHNICIAN: 'Ψύξη/Θέρμανση',
  APPLIANCE_REPAIR: 'Επισκευές Συσκευών',
  GENERAL_CONTRACTOR: 'Γενικές Εργασίες',
  ARCHITECT: 'Αρχιτέκτονας',
  INTERIOR_DESIGNER: 'Εσωτερική Διακόσμηση',
  LANDSCAPER: 'Κηπουρική',
  MASON: 'Χτίστης',
  ROOFER: 'Στέγες',
  FLOORING_SPECIALIST: 'Πατώματα',
  SECURITY_SYSTEM_INSTALLER: 'Συστήματα Ασφαλείας',
  HOME_INSPECTOR: 'Επιθεώρηση Κατοικίας',
  CLEANING_SERVICE: 'Καθαρισμοί',
  PEST_CONTROL: 'Απεντόμωση',
  POOL_MAINTENANCE: 'Συντήρηση Πισίνας',
  SOLAR_INSTALLER: 'Ηλιακά Συστήματα',
  SMART_HOME_TECHNICIAN: 'Έξυπνο Σπίτι',
};

export const categoryIcons: Record<JobCategory, IconType> = {
  ELECTRICIAN: FiZap,
  PLUMBER: FiDroplet,
  PAINTER: FiPenTool,
  CARPENTER: FiGrid,
  HVAC_TECHNICIAN: FiWind,
  APPLIANCE_REPAIR: FiSettings,
  GENERAL_CONTRACTOR: FiHome,
  ARCHITECT: FiPenTool,
  INTERIOR_DESIGNER: FiLayout,
  LANDSCAPER: FiCloud,
  MASON: FiBriefcase,
  ROOFER: FiUmbrella,
  FLOORING_SPECIALIST: FiSquare,
  SECURITY_SYSTEM_INSTALLER: FiShield,
  HOME_INSPECTOR: FiSearch,
  CLEANING_SERVICE: FiTrash2,
  PEST_CONTROL: FiAlertTriangle,
  POOL_MAINTENANCE: FiPool,
  SOLAR_INSTALLER: FiSun,
  SMART_HOME_TECHNICIAN: FiTool,
};

export function isValidJobCategory(category: string): category is JobCategory {
  return Object.values(JobCategory).includes(category as JobCategory);
}

export function validateJobCategories(categories: string[]): JobCategory[] {
  return categories.filter(isValidJobCategory);
}

export function getAllCategories(): JobCategory[] {
  return Object.values(JobCategory);
}

export function getCategoryLabel(category: JobCategory): string {
  return category.replace(/_/g, ' ').toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Add any other category-related utility functions here 