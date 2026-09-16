export type CsvRow = Record<string, string>;

/** Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas and newlines. */
export function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  row.push(field);
  rows.push(row);

  const nonEmpty = rows.filter((r) => r.some((v) => v.trim() !== ""));
  if (nonEmpty.length === 0) return [];

  const headers = nonEmpty[0].map((h) => h.trim().toLowerCase());
  return nonEmpty.slice(1).map((r) => {
    const obj: CsvRow = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? "").trim();
    });
    return obj;
  });
}

/** Accepts "lat,lon", "lat lon", "lat/lon", "lat;lon" and returns [lat, lon]. */
export function parseCoordinates(value: string): [number, number] | null {
  if (!value) return null;
  const parts = value
    .replace(/[()[\]]/g, "")
    .split(/[,;/\s]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  const lat = Number(parts[0]);
  const lon = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return [lat, lon];
}

export type RouteRecord = {
  routeId: string;
  routeNo: string;
  depIcao: string;
  arrIcao: string;
  depAirport: string;
  arrAirport: string;
  aircraft: string;
  dep: [number, number];
  arr: [number, number];
};

export type AirportRecord = {
  name: string;
  icao: string;
  coords: [number, number];
  flights: string;
  moreToKnow: string;
};

type RouteApiResponse = {
  ok: boolean;
  routes?: RouteRecord[];
  airports?: AirportRecord[];
  error?: string;
};

let apiDataPromise: Promise<RouteApiResponse> | undefined;

async function fetchMapData(): Promise<RouteApiResponse> {
  if (!apiDataPromise) {
    apiDataPromise = fetch("/api/routes", { headers: { accept: "application/json" } })
      .then(async (res) => {
        const data = (await res.json()) as RouteApiResponse;
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load route API");
        return data;
      })
      .catch((error) => {
        apiDataPromise = undefined;
        throw error;
      });
  }
  return apiDataPromise;
}

/** Route and airport data is served by the app API, sourced from the repository CSV files. */
export async function fetchRoutes(): Promise<RouteRecord[]> {
  const data = await fetchMapData();
  return data.routes ?? [];
}

export async function fetchAirports(): Promise<AirportRecord[]> {
  const data = await fetchMapData();
  return data.airports ?? [];
}
