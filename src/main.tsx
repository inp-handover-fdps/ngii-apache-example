import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { get } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

proj4.defs(
  "EPSG:5179",
  "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"
);

register(proj4);
const p = get("EPSG:5179")!;
p.setExtent([-200000.0, -28024123.62, 31824123.62, 4000000.0]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
