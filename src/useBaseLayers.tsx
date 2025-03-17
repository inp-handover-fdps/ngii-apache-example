import TileLayer from "ol/layer/Tile";
import { get as getProjection } from "ol/proj";
import { toSize } from "ol/size";
import { XYZ } from "ol/source";
import { useMemo } from "react";

import { Tile } from "ol";
import TileState from "ol/TileState";
import { ngiiTileUrlFunction } from "./ngii";

const base64ImageStringToBlob = (base64ImageString: string) => {
  const byteCharacters = atob(base64ImageString);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });
  return blob;
};

const ngiiTileLoadFunction = (tile: Tile, src: string) => {
  const t = tile as unknown as { getImage: () => HTMLImageElement };
  const image = t.getImage();

  const xhr = new XMLHttpRequest();
  xhr.responseType = "arraybuffer";
  xhr.addEventListener("loadend", function () {
    const base64Image = btoa(
      new Uint8Array(this.response).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    const blob = base64ImageStringToBlob(base64Image);
    const imageUrl = URL.createObjectURL(blob);
    image.src = imageUrl;
  });
  xhr.addEventListener("error", function () {
    tile.setState(TileState.ERROR);
  });
  xhr.open("GET", src);
  xhr.send();
};

/** 기본 배경지도 */
export default function useBaseLayers() {
  const projection = useMemo(() => {
    const p = getProjection("EPSG:5179")!;
    return p;
  }, []);

  const koreanMapLayer = useMemo(() => {
    const tl = new TileLayer({
      source: new XYZ({
        tileUrlFunction: (coordinate) => {
          // satellite_map, korean_map
          return ngiiTileUrlFunction("korean_map", coordinate);
        },
        tileLoadFunction: ngiiTileLoadFunction,
        projection,
        maxResolution: 2088.96,
        tileSize: toSize([256, 256]),
      }),
    });

    tl.set("name", "한국 배경 지도(ngii)");
    return tl;
  }, [projection]);

  const satelliteMapLayer = useMemo(() => {
    return new TileLayer({
      source: new XYZ({
        tileUrlFunction: (coordinate) => {
          // satellite_map, korean_map
          return ngiiTileUrlFunction("satellite_map", coordinate);
        },
        tileLoadFunction: ngiiTileLoadFunction,
        projection,
        maxResolution: 2088.96,
        tileSize: toSize([256, 256]),
      }),
      visible: false,
    });
  }, [projection]);

  return { koreanMapLayer, satelliteMapLayer };
}
