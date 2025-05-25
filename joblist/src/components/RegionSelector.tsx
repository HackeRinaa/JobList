import { useState, useRef, useEffect } from 'react';
import MapViewContainer from './MapViewContainer';
import { Region } from './type';

interface RegionSelectorProps {
  formData: {
    regions: string[];
  };
  handleMultiSelect: (value: string, field: "expertise" | "regions") => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ formData, handleMultiSelect }) => {
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Create refs for the checkboxes
  const checkboxRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Enhanced Greek region data with coordinates
  const regions: Region[] = [
    {
      name: "Αττική",
      subRegions: ["Αθήνα", "Πειραιάς", "Γλυφάδα", "Μαρούσι", "Κηφισιά", "Νέα Σμύρνη", "Καλλιθέα"],
      coordinates: [
        [37.98, 23.72],
        [38.05, 23.80],
        [37.90, 23.80],
        [37.90, 23.65]
      ]
    },
    {
      name: "Θεσσαλονίκη",
      subRegions: ["Κέντρο", "Καλαμαριά", "Νεάπολη", "Πυλαία", "Τούμπα", "Σταυρούπολη"],
      coordinates: [
        [40.63, 22.94],
        [40.65, 23.00],
        [40.58, 23.00],
        [40.58, 22.90]
      ]
    },
    {
      name: "Πάτρα",
      subRegions: ["Κέντρο", "Αγυιά", "Γλαύκος", "Ψαροφάι", "Οβρυά"],
      coordinates: [
        [38.25, 21.73],
        [38.30, 21.80],
        [38.20, 21.80],
        [38.20, 21.70]
      ]
    },
    {
      name: "Ηράκλειο",
      subRegions: ["Κέντρο", "Νέα Αλικαρνασσός", "Γάζι", "Αγία Τριάδα"],
      coordinates: [
        [35.33, 25.13],
        [35.36, 25.20],
        [35.30, 25.20],
        [35.30, 25.08]
      ]
    },
    {
      name: "Λάρισα",
      subRegions: ["Κέντρο", "Νεάπολη", "Γιάννουλη", "Φαλάνη"],
      coordinates: [
        [39.63, 22.41],
        [39.67, 22.48],
        [39.60, 22.48],
        [39.60, 22.38]
      ]
    },
    {
      name: "Βόλος",
      subRegions: ["Κέντρο", "Νέα Ιωνία", "Αγριά", "Άνω Βόλος"],
      coordinates: [
        [39.36, 22.94],
        [39.40, 23.00],
        [39.32, 23.00],
        [39.32, 22.90]
      ]
    },
    {
      name: "Ιωάννινα",
      subRegions: ["Κέντρο", "Ανατολή", "Κατσικά", "Πεδινή"],
      coordinates: [
        [39.66, 20.85],
        [39.70, 20.92],
        [39.62, 20.92],
        [39.62, 20.80]
      ]
    },
    {
      name: "Χανιά",
      subRegions: ["Κέντρο", "Νέα Χώρα", "Χαλέπα", "Σούδα"],
      coordinates: [
        [35.51, 24.01],
        [35.54, 24.08],
        [35.48, 24.08],
        [35.48, 23.96]
      ]
    }
  ];

  // Toggle expanding/collapsing a region in the UI
  const toggleRegion = (regionName: string) => {
    setExpandedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(name => name !== regionName)
        : [...prev, regionName]
    );
  };

  // Function to toggle entire region including all subregions
  const toggleEntireRegion = (region: Region) => {
    const regionSubsSelected = region.subRegions.filter(sub => 
      formData.regions.includes(sub)
    ).length;
    
    const isFullySelected = regionSubsSelected === region.subRegions.length;
    
    if (isFullySelected) {
      // Remove all subregions
      region.subRegions.forEach(sub => {
        if (formData.regions.includes(sub)) {
          handleMultiSelect(sub, "regions");
        }
      });
    } else {
      // Add all missing subregions
      region.subRegions.forEach(sub => {
        if (!formData.regions.includes(sub)) {
          handleMultiSelect(sub, "regions");
        }
      });
    }
  };

  // Handle clicking on a region name button (should toggle checkboxes and expand/collapse)
  const handleRegionButtonClick = (region: Region, expandOnly = false) => {
    // Toggle expansion
    toggleRegion(region.name);
    
    // If expandOnly is false, also toggle the checkbox state
    if (!expandOnly) {
      toggleEntireRegion(region);
    }
  };

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.subRegions.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Set indeterminate state for checkboxes using useEffect
  useEffect(() => {
    filteredRegions.forEach(region => {
      const regionSubsSelected = region.subRegions.filter(sub => formData.regions.includes(sub)).length;
      const isRegionPartiallySelected = regionSubsSelected > 0 && regionSubsSelected < region.subRegions.length;
      
      const checkbox = checkboxRefs.current[`region-${region.name}`];
      if (checkbox) {
        checkbox.indeterminate = isRegionPartiallySelected;
      }
    });
  }, [formData.regions, filteredRegions]);

  return (
    <div className="mt-6">
      <label className="block text-gray-800 mb-2 font-medium">Περιοχές Εξυπηρέτησης</label>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Region list */}
        <div className="w-full md:w-1/3 border border-gray-200 rounded-lg overflow-y-auto max-h-96">
          <input
            type="text"
            placeholder="Αναζήτηση περιοχών..."
            className="w-full p-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          
          {filteredRegions.map((region) => {
            const regionSubsSelected = region.subRegions.filter(sub => formData.regions.includes(sub)).length;
            const isRegionFullySelected = regionSubsSelected === region.subRegions.length;
            const isRegionPartiallySelected = regionSubsSelected > 0 && regionSubsSelected < region.subRegions.length;
            
            return (
              <div key={region.name} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <div className="flex items-center px-4 py-3">
                  <input
                    type="checkbox"
                    id={`region-${region.name}`}
                    checked={isRegionFullySelected}
                    onChange={() => toggleEntireRegion(region)}
                    className="h-4 w-4 text-[#FB7600] focus:ring-[#FB7600] border-gray-300 rounded cursor-pointer"
                    ref={(el) => {
                      checkboxRefs.current[`region-${region.name}`] = el;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRegionButtonClick(region)}
                    className={`w-full px-2 text-left flex items-center justify-between ${
                      isRegionFullySelected 
                        ? "text-[#FB7600] font-semibold"
                        : isRegionPartiallySelected 
                          ? "text-[#FB7600]"
                          : "text-gray-700"
                    }`}
                  >
                    <span>{region.name}</span>
                    <span className={`text-sm ${isRegionPartiallySelected ? "text-[#FB7600]" : "text-gray-500"}`}>
                      {regionSubsSelected} / {region.subRegions.length}
                    </span>
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleRegionButtonClick(region, true)}
                    aria-label={expandedRegions.includes(region.name) ? "Collapse" : "Expand"}
                  >
                    {expandedRegions.includes(region.name) ? "▲" : "▼"}
                  </button>
                </div>
                
                {expandedRegions.includes(region.name) && (
                  <div className="pl-10 pr-4 pb-3 space-y-2 bg-gray-50">
                    {region.subRegions.map((subRegion) => (
                      <div key={subRegion} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`subregion-${subRegion}`}
                          checked={formData.regions.includes(subRegion)}
                          onChange={() => handleMultiSelect(subRegion, "regions")}
                          className="h-4 w-4 text-[#FB7600] focus:ring-[#FB7600] border-gray-300 rounded cursor-pointer"
                        />
                        <label 
                          htmlFor={`subregion-${subRegion}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer w-full"
                          onClick={() => handleMultiSelect(subRegion, "regions")}
                        >
                          {subRegion}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Map visualization */}
        <div className="w-full md:w-2/3 h-96 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 text-sm text-gray-600">
            Κάντε κλικ στον χάρτη για να επιλέξετε περιοχές
          </div>
          <MapViewContainer
            regions={regions}
            selectedRegions={formData.regions}
            onRegionSelect={handleMultiSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;