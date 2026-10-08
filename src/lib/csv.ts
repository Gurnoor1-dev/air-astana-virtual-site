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

async function fetchCsvFile(filename: string): Promise<CsvRow[]> {
  const response = await fetch(`/data/${filename}`, {
    headers: { accept: "text/csv" },
  });
  if (!response.ok) {
    throw new Error(`Could not load ${filename}`);
  }
  return parseCsv(await response.text());
}

/** Route and airport data is loaded directly from the published CSV assets. */
export async function fetchRoutes(): Promise<RouteRecord[]> {
  const rows = await fetchCsvFile("routes.csv");
  return rows.flatMap((row) => {
    const dep = parseCoordinates(row["dep_coordinates"]);
    const arr = parseCoordinates(row["arr_coordinates"]);
    if (!dep || !arr || !row["dep_icao"] || !row["arr_icao"]) return [];

    return [{
      routeId: row["route_id"] || row["route_no"],
      routeNo: row["route_no"],
      depIcao: row["dep_icao"].toUpperCase(),
      arrIcao: row["arr_icao"].toUpperCase(),
      depAirport: row["dep_airport"],
      arrAirport: row["arr_airport"],
      aircraft: row["aircraft_used"],
      dep,
      arr,
    }];
  });
}

export async function fetchAirports(): Promise<AirportRecord[]> {
  const rows = await fetchCsvFile("airports.csv");
  return rows.flatMap((row) => {
    const coords = parseCoordinates(row["airport_coordinates"]);
    if (!coords || !row["airport_icao"]) return [];

    return [{
      name: row["airport_name"],
      icao: row["airport_icao"].toUpperCase(),
      coords,
      flights: row["flights_from_this_airport"],
      moreToKnow: row["more_to_know"],
    }];
  });
}
