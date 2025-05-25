import { Dispatch, RefObject, SetStateAction, ChangeEvent } from 'react';

// Extend the FormData interface to include selectedPlan
declare module '@/components/PersonalDetails' {
  export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    expertise: string[];
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
    expertiseFields: string[];
    regions?: Array<{ name: string; subRegions: string[] }>;
    fileInputRef: RefObject<HTMLInputElement>;
    setFormData?: Dispatch<SetStateAction<FormData>>;
  }

  const PersonalDetails: React.FC<PersonalDetailsProps>;
  export default PersonalDetails;
} 