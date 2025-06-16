import { Dispatch, RefObject, SetStateAction, ChangeEvent } from 'react';

interface ExpertiseField {
  id: string;
  name: string;
}

// Extend the FormData interface to include selectedPlan
declare module '@/components/PersonalDetails' {
  export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    expertise: string[]; // This stores expertise IDs
    regions: string[];
    photo: File | null;
    cv: File | null;
    selectedPlan?: string | null;
  }

  export interface PersonalDetailsProps {
    formData: FormData;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMultiSelect: (item: string, category: "expertise" | "regions") => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    nextStep: () => void;
    expertiseFields: ExpertiseField[];
    regions?: Array<{ name: string; subRegions: string[] }>;
    fileInputRef: RefObject<HTMLInputElement>;
    setFormData?: Dispatch<SetStateAction<FormData>>;
  }

  const PersonalDetails: React.FC<PersonalDetailsProps>;
  export default PersonalDetails;
} 