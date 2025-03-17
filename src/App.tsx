import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { OSM } from "ol/source";
import React from "react";

function App() {
  const map_ref = React.useRef<HTMLDivElement>(null);

  const view = React.useMemo(() => {
    return new View({
      center: [14133447.695112107, 4513703.814602685],
      zoom: 15,
      minZoom: 7,
      maxZoom: 22,
    });
  }, []);

  const mainMap = React.useMemo(() => {
    return new Map({
      layers: [new TileLayer({ source: new OSM() })],
      view,
    });
  }, [view]);

  React.useEffect(() => {
    if (!mainMap) return;
    mainMap.setTarget(map_ref.current || "");
    return () => {
      mainMap.setTarget("");
    };
  }, [mainMap]);

  return (
    <>
      <div ref={map_ref} style={{ height: "100dvh", width: "100dvw" }}></div>
    </>
  );
}

export default App;
