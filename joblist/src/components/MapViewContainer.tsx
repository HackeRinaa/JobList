import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { MapContainerProps } from './type';
import { FeatureCollection } from 'geojson';

// Fix for default marker icons
// Using a type assertion with a more specific interface for the Icon.Default prototype
interface IconDefaultPrototype extends L.Icon.Default {
  _getIconUrl?: string;
}

delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapViewContainer: React.FC<MapContainerProps> = ({ 
  regions, 
  selectedRegions, 
  onRegionSelect 
}) => {
  // Helper function to toggle all subregions of a region
  const handleRegionClick = (regionName: string) => {
    // Find the region object
    const region = regions.find(r => r.name === regionName);
    if (!region) return;
    
    // Check if all subregions are selected
    const allSubregionsSelected = region.subRegions.every(
      subRegion => selectedRegions.includes(subRegion)
    );
    
    // Toggle all subregions
    if (allSubregionsSelected) {
      // If all are selected, deselect all
      region.subRegions.forEach(subRegion => {
        if (selectedRegions.includes(subRegion)) {
          onRegionSelect(subRegion, "regions");
        }
      });
    } else {
      // If not all are selected, select all
      region.subRegions.forEach(subRegion => {
        if (!selectedRegions.includes(subRegion)) {
          onRegionSelect(subRegion, "regions");
        }
      });
    }
  };
  
  // Convert array of coordinate points to proper GeoJSON polygon format
  const prepareCoordinates = (coordinates: [number, number][]) => {
    // Make sure we have enough coordinates (at least 3 for a polygon)
    if (coordinates.length < 3) {
      // If not enough points, create a small rectangle around the first point
      // This is just a fallback for missing data
      if (coordinates.length > 0) {
        const [lat, lng] = coordinates[0];
        return [
          [lng, lat],
          [lng + 0.1, lat],
          [lng + 0.1, lat + 0.1],
          [lng, lat + 0.1],
          [lng, lat] // Close the polygon
        ];
      }
      // If no coordinates at all, return a default
      return [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]];
    }
    
    // Make sure the polygon is closed (first point = last point)
    const coordsCopy = [...coordinates];
    if (coordsCopy[0][0] !== coordsCopy[coordsCopy.length - 1][0] || 
        coordsCopy[0][1] !== coordsCopy[coordsCopy.length - 1][1]) {
      coordsCopy.push(coordsCopy[0]);
    }
    
    // Convert to GeoJSON format [longitude, latitude]
    return coordsCopy.map(([lat, lng]) => [lng, lat]);
  };
  
  return (
    <MapContainer 
      center={[37.9838, 23.7275] as L.LatLngExpression}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {/* Render each region as a separate GeoJSON to make click handling easier */}
      {regions.map((region) => {
        // Check if all subregions are selected
        const allSubregionsSelected = region.subRegions.every(
          subRegion => selectedRegions.includes(subRegion)
        );
        
        // Check if some but not all subregions are selected
        const someSubregionsSelected = region.subRegions.some(
          subRegion => selectedRegions.includes(subRegion)
        ) && !allSubregionsSelected;
        
        const featureData: FeatureCollection = {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            properties: { 
              name: region.name, 
              subRegions: region.subRegions 
            },
            geometry: {
              type: "Polygon",
              coordinates: [prepareCoordinates(region.coordinates || [])]
            }
          }]
        };
        
        return (
          <GeoJSON
            key={region.name}
            data={featureData}
            pathOptions={
              allSubregionsSelected ? {
                fillColor: '#FB7600',
                weight: 2,
                opacity: 1,
                color: '#FFFFFF',
                fillOpacity: 0.8,
              } : someSubregionsSelected ? {
                fillColor: '#FB7600',
                weight: 2,
                opacity: 1,
                color: '#FFFFFF',
                fillOpacity: 0.4,
              } : {
                fillColor: '#3388ff',
                weight: 2,
                opacity: 1,
                color: '#3388ff',
                fillOpacity: 0.4,
              }
            }
            eventHandlers={{
              click: () => handleRegionClick(region.name)
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default MapViewContainer;