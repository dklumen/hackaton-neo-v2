import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// World map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SimpleMapGlobe = ({ locations = [], onLocationSelect }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 180 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#F5F5F5" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
        
        {locations.map(location => (
          <Marker
            key={location.id}
            coordinates={[location.lng, location.lat]}
            onClick={() => onLocationSelect(location)}
          >
            <circle
              r={5}
              fill={
                location.status === "online" ? "#10B981" :
                location.status === "warning" ? "#F59E0B" : "#EF4444"
              }
              stroke="#fff"
              strokeWidth={2}
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default SimpleMapGlobe;