import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownToLine, FileUp, Globe2, LoaderCircle, RotateCcw } from 'lucide-react'

export const Route = createFileRoute('/route-map-exporter')({ component: RouteMapExporter })

type Point = { lat: number; lon: number }
type FlightRoute = { from: Point; to: Point }
type FeatureCollection = { features: Array<{ geometry: { type: string; coordinates: any } }> }

const WORLD_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson'
const key = (v: string) => v.trim().toLowerCase().replace(/[ _-]/g, '')
const pick = (row: Record<string, string>, names: string[]) => {
  const found = Object.keys(row).find(k => names.includes(key(k)))
  return found ? row[found]?.trim() : ''
}
const num = (v: string) => v === '' ? NaN : Number(v)
const aliases = {
  fromLat: ['originlat', 'fromlat', 'departurelat', 'startlat', 'sourcelat', 'originlatitude', 'fromlatitude'],
  fromLon: ['originlon', 'originlng', 'fromlon', 'fromlng', 'departurelon', 'departurelng', 'startlon', 'startlng', 'sourcelon', 'sourcelng', 'originlongitude', 'fromlongitude'],
  toLat: ['destinationlat', 'destlat', 'tolat', 'arrivallat', 'endlat', 'targetlat', 'destinationlatitude', 'tolatitude'],
  toLon: ['destinationlon', 'destinationlng', 'destlon', 'destlng', 'tolon', 'tolng', 'arrivallon', 'arrivallng', 'endlon', 'endlng', 'targetlon', 'targetlng', 'destinationlongitude', 'tolongitude'],
}
function parseCsv(text: string): FlightRoute[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []
  const parseLine = (line: string) => {
    const cells: string[] = []
    let current = '', quoted = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"' && line[i + 1] === '"' && quoted) { current += '"'; i++ }
      else if (c === '"') quoted = !quoted
      else if (c === ',' && !quoted) { cells.push(current.trim()); current = '' }
      else current += c
    }
    cells.push(current.trim())
    return cells
  }
  const headers = parseLine(lines[0])
  return lines.slice(1).flatMap(line => {
    const values = parseLine(line)
    const row = Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
    const from = { lat: num(pick(row, aliases.fromLat)), lon: num(pick(row, aliases.fromLon)) }
    const to = { lat: num(pick(row, aliases.toLat)), lon: num(pick(row, aliases.toLon)) }
    return [from, to].every(p => Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180) ? [{ from, to }] : []
  })
}
function project(lon: number, lat: number, w: number, h: number) {
  const clamped = Math.max(-80, Math.min(84, lat))
  const x = (lon + 180) / 360 * w
  const rad = clamped * Math.PI / 180
  const merc = Math.log(Math.tan(Math.PI / 4 + rad / 2))
  const max = Math.log(Math.tan(Math.PI / 4 + 84 * Math.PI / 360))
  const min = Math.log(Math.tan(Math.PI / 4 - 80 * Math.PI / 360))
  return { x, y: (max - merc) / (max - min) * h }
}
function geometryPaths(world: FeatureCollection, w: number, h: number) {
  const paths: string[] = []
  const ringPath = (ring: number[][]) => ring.map(([lon, lat], i) => {
    const p = project(lon, lat, w, h)
    return `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ') + ' Z'
  for (const feature of world.features ?? []) {
    const g = feature.geometry
    if (g?.type === 'Polygon') for (const ring of g.coordinates) paths.push(ringPath(ring))
    if (g?.type === 'MultiPolygon') for (const polygon of g.coordinates) for (const ring of polygon) paths.push(ringPath(ring))
  }
  return paths
}
function RouteMapExporter() {
  const [routes, setRoutes] = useState<FlightRoute[]>([])
  const [world, setWorld] = useState<FeatureCollection | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [loadingWorld, setLoadingWorld] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [resolution, setResolution] = useState('3840')
  const [lineColor, setLineColor] = useState('#dff7ff')
  const [lineWidth, setLineWidth] = useState(1)
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 1200, H = 620
  useEffect(() => {
    fetch(WORLD_URL).then(r => { if (!r.ok) throw new Error('Map data unavailable'); return r.json() })
      .then(setWorld).catch(() => setError('Could not load world outlines. Check your connection and refresh.'))
      .finally(() => setLoadingWorld(false))
  }, [])
  const landPaths = useMemo(() => world ? geometryPaths(world, W, H) : [], [world])
  const bg = theme === 'dark' ? '#070b10' : '#ffffff'
  const land = theme === 'dark' ? '#202b35' : '#f0f3f5'
  const coast = theme === 'dark' ? '#53616d' : '#b5c0c8'
  const onUpload = async (file?: File) => {
    if (!file) return
    setError('')
    setFileName(file.name)
    const parsed = parseCsv(await file.text())
    if (!parsed.length) {
      setRoutes([])
      setError('No usable routes found. CSV needs origin and destination latitude/longitude columns (for example origin_lat, origin_lon, destination_lat, destination_lon).')
      return
    }
    setRoutes(parsed)
  }
  const routePath = (r: FlightRoute) => {
    const a = project(r.from.lon, r.from.lat, W, H)
    const b = project(r.to.lon, r.to.lat, W, H)
    let dx = b.x - a.x
    if (dx > W / 2) dx -= W
    if (dx < -W / 2) dx += W
    const endX = a.x + dx
    const lift = Math.min(140, Math.max(26, Math.abs(dx) * 0.17 + Math.abs(b.y - a.y) * 0.12))
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${((a.x + endX) / 2).toFixed(2)} ${(Math.min(a.y, b.y) - lift).toFixed(2)} ${endX.toFixed(2)} ${b.y.toFixed(2)}`
  }
  const exportPng = async () => {
    const svg = svgRef.current
    if (!svg) return
    const clone = svg.cloneNode(true) as SVGSVGElement
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', resolution)
    clone.setAttribute('height', String(Math.round(Number(resolution) * H / W)))
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Number(resolution); canvas.height = Math.round(Number(resolution) * H / W)
      const ctx = canvas.getContext('2d')
      if (!ctx) { URL.revokeObjectURL(url); return }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob(png => {
        if (!png) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(png); a.download = 'air-astana-virtual-route-map.png'; a.click()
        URL.revokeObjectURL(a.href)
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); setError('PNG export failed. Please try again.') }
    img.src = url
  }
  return <main className="min-h-screen bg-[#f4f7f8] px-4 py-8 text-slate-900 md:px-8">
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[.18em] text-teal-800"><Globe2 size={14}/> Air Astana Virtual · Design utility</div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Route map exporter</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">Turn your route CSV into a minimalist world map. Just coastlines and fine flight arcs — no airport labels or route details.</p></div>
        <a href="/" className="text-sm font-semibold text-teal-800 hover:text-teal-600">← Back to website</a>
      </header>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><p className="font-semibold">Live preview</p><p className="mt-1 text-xs text-slate-500">{routes.length} routes plotted · 1200 × 620 preview</p></div><button onClick={() => { setRoutes([]); setFileName(''); setError('') }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"><RotateCcw size={14}/> Reset</button></div>
          <div className="bg-slate-950 p-2 sm:p-4">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Minimalist world map showing flight routes" className="block h-auto w-full" style={{ background: bg }}>
              <rect width={W} height={H} fill={bg}/>
              {Array.from({length: 7}, (_, i) => <line key={'v'+i} x1={i*W/6} y1="0" x2={i*W/6} y2={H} stroke={coast} strokeOpacity=".12" strokeWidth=".6"/>)}
              {Array.from({length: 5}, (_, i) => <line key={'h'+i} x1="0" y1={i*H/4} x2={W} y2={i*H/4} stroke={coast} strokeOpacity=".12" strokeWidth=".6"/>)}
              {landPaths.map((d, i) => <path key={i} d={d} fill={land} stroke={coast} strokeWidth=".55" fillRule="evenodd" />)}
              {routes.map((r, i) => <path key={i} d={routePath(r)} fill="none" stroke={lineColor} strokeOpacity=".8" strokeWidth={lineWidth} strokeLinecap="round" />)}
            </svg>
          </div>
          {loadingWorld && <p className="flex items-center gap-2 px-5 py-3 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={16}/> Loading world outlines…</p>}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs text-slate-500"><span>{fileName || 'No CSV selected yet'}</span><span>Minimal · label-free · high-resolution PNG</span></div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">01 / Import routes</h2>
            <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 px-4 py-6 text-center hover:bg-teal-50"><FileUp className="text-teal-800" size={24}/><span className="text-sm font-semibold">Choose CSV file</span><span className="text-xs text-slate-500">Your file stays in this browser</span><input type="file" accept=".csv,text/csv" className="sr-only" onChange={e => void onUpload(e.target.files?.[0])}/></label>
            <p className="mt-3 text-xs leading-5 text-slate-500">Expected columns: origin_lat, origin_lon, destination_lat, destination_lon. Common variants such as from_lat / to_lat are accepted.</p>
            {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">{error}</p>}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">02 / Appearance</h2>
            <label className="mt-4 block text-xs font-medium text-slate-600">Map background</label>
            <div className="mt-2 grid grid-cols-2 gap-2">{(['dark','light'] as const).map(t => <button key={t} onClick={() => setTheme(t)} className={`rounded-xl border px-3 py-2.5 text-sm capitalize ${theme === t ? 'border-teal-700 bg-teal-50 font-semibold text-teal-900' : 'border-slate-200 hover:bg-slate-50'}`}>{t === 'dark' ? 'Black map' : 'White map'}</button>)}</div>
            <label className="mt-4 block text-xs font-medium text-slate-600">Route line colour</label><input aria-label="Route line colour" type="color" value={lineColor} onChange={e => setLineColor(e.target.value)} className="mt-2 h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1"/>
            <label className="mt-4 flex items-center justify-between text-xs font-medium text-slate-600">Line thickness <span>{lineWidth.toFixed(1)} px</span></label><input aria-label="Line thickness" type="range" min=".4" max="2" step=".1" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} className="mt-3 w-full accent-teal-700"/>
            <label className="mt-4 block text-xs font-medium text-slate-600">Export width</label><select value={resolution} onChange={e => setResolution(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="1920">1920 px · Full HD</option><option value="3840">3840 px · 4K</option><option value="5760">5760 px · 6K</option></select>
            <button onClick={() => void exportPng()} disabled={!routes.length || !world} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowDownToLine size={17}/> Export PNG</button>
          </div>
          <p className="px-2 text-xs leading-5 text-slate-500">Note: this first version requires latitude/longitude columns in the CSV. Airport-code-only files need an airport coordinate lookup added before their routes can be drawn accurately.</p>
        </aside>
      </section>
    </div>
  </main>
}
