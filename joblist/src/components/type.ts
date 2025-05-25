export interface Region {
    name: string;
    subRegions: string[];
    coordinates?: [number, number][]; // For map boundaries
  }
  
  export interface FormData {
    regions: string[];
  }
  
  export interface MapContainerProps {
    regions: Region[];
    selectedRegions: string[];
    onRegionSelect: (regionName: string, field: keyof FormData) => void;
  }