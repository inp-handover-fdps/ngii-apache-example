import { Tile } from "ol";
import { TileCoord } from "ol/tilecoord";
import TileState from "ol/TileState";

const BASE_URL = import.meta.env.VITE_NGII_BASE_URL;
const API_KEY = import.meta.env.VITE_NGII_API_KEY;

const fillzero = (n: number, digits: number) => {
  let zero = "";
  const n_ = n.toString();
  if (digits > n_.length) {
    for (let i = 0; digits - n_.length > i; i++) {
      zero += "0";
    }
  }
  return zero + n;
};

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

/** 배경지도 */
export const ngiiTileUrlFunction = (layerId: string, coordinate: TileCoord) => {
  const url =
    `${BASE_URL}/openapi/Gettile.do?apikey=` +
    API_KEY +
    "&service=" +
    "WMTS" +
    "&request=" +
    "GetTile" +
    "&version=" +
    "1.0.0" +
    "&layer=" +
    layerId +
    // + "&style=korean"
    "&format=image/png" +
    // + "&tilematrixset=korean"
    "&tilematrix=" +
    "L" +
    fillzero(coordinate[0] + 5, 2) +
    "&tilerow=" +
    coordinate[2] +
    "&tilecol=" +
    coordinate[1];
  return url;
};

/**
 *
 * @param tile 배경지도용
 * @param src
 */
export const ngiiTileLoadFunction = (tile: Tile, src: string) => {
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
