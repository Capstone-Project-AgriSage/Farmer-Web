import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { ordersApi } from '../../../api/ordersApi'
import type { MyDeliveryTracking } from '../../../api/types'

/** How often the driver's position is read again while the card is shown. */
const REFRESH_MS = 15_000
/** A last position older than this is a lost signal (FLOW_2 §9a). */
const STALE_MS = 3 * 60 * 1000
// Can Tho, when there is no point yet.
const STORE_AREA: LatLngTuple = [10.0341, 105.788]

const clock = (iso: string) => new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })

function FitOnce({ points }: { points: LatLngTuple[] }) {
  const map = useMap()
  const done = useRef(false)
  useEffect(() => {
    if (done.current || points.length === 0) return
    done.current = true
    if (points.length === 1) map.setView(points[0], 15)
    else map.fitBounds(points, { padding: [28, 28], maxZoom: 16 })
  }, [map, points])
  return null
}

interface DriverTrackingCardProps {
  orderId: string
  deliveryId: string
  /** The trip has just ended: the page reads the deliveries again to show the result. */
  onEnded?: () => void
}

/**
 * "Tài xế đang giao" (FLOW_2 §9a): where the driver of this delivery is while the trip runs, read again every 15
 * seconds. Nothing is shown before the trip starts, after it ends, or if the position cannot be read.
 */
export default function DriverTrackingCard({ orderId, deliveryId, onEnded }: DriverTrackingCardProps) {
  const [tracking, setTracking] = useState<MyDeliveryTracking | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const wasRunning = useRef(false)
  const ended = useRef(onEnded)
  ended.current = onEnded

  useEffect(() => {
    const controller = new AbortController()
    const read = () => {
      ordersApi
        .getDeliveryTracking(orderId, deliveryId, controller.signal)
        .then((value) => {
          setTracking(value)
          setNow(Date.now())
          if (wasRunning.current && !value.inProgress) ended.current?.()
          wasRunning.current = value.inProgress
        })
        .catch(() => { /* keep the last position; the next round tries again */ })
    }
    read()
    const timer = window.setInterval(read, REFRESH_MS)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [orderId, deliveryId])

  const route = useMemo(() => (tracking?.trail ?? []).map((p) => [p.latitude, p.longitude] as LatLngTuple), [tracking])
  if (!tracking?.inProgress) return null

  const last = tracking.lastPoint
  const stale = !last || now - new Date(last.recordedAt).getTime() > STALE_MS
  const status = !last ? 'Chưa có tín hiệu vị trí' : stale ? `Mất tín hiệu từ ${clock(last.recordedAt)}` : `Cập nhật lúc ${clock(last.recordedAt)}`
  const driver: LatLngTuple | null = last ? [last.latitude, last.longitude] : null
  const destination: LatLngTuple | null = tracking.destination ? [tracking.destination.latitude, tracking.destination.longitude] : null
  const points = [...(driver ? [driver] : []), ...(destination ? [destination] : []), ...route]

  return (
    <section className="mt-4 border border-brand-dark/15 rounded-[var(--radius-surface)] bg-white overflow-hidden" data-testid="driver-tracking">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[15px] font-medium text-text-primary">
            Tài xế đang giao{tracking.driver?.fullName ? `: ${tracking.driver.fullName}` : ''}
          </p>
          <p className={`text-[13px] ${stale ? 'text-status-warning' : 'text-brand-dark'}`} data-testid="driver-tracking-status">{status}</p>
        </div>
        {tracking.driver?.phoneNumber && (
          <a href={`tel:${tracking.driver.phoneNumber}`} className="text-[14px] font-medium text-brand-dark underline underline-offset-2">
            Gọi tài xế
          </a>
        )}
      </div>
      {/* `isolate` keeps Leaflet's panes (z-index up to 1000) under the site's header and dialogs. */}
      <div className="relative isolate h-[260px]" data-testid="driver-tracking-map">
        <MapContainer center={points[0] ?? STORE_AREA} zoom={14} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {route.length > 1 && <Polyline positions={route} pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.8 }} />}
          {destination && (
            <CircleMarker center={destination} radius={7} pathOptions={{ color: '#991b1b', fillColor: '#ef4444', fillOpacity: 0.95, weight: 2 }}>
              <Tooltip direction="top" offset={[0, -8]}>Địa chỉ nhận hàng</Tooltip>
            </CircleMarker>
          )}
          {driver && (
            <CircleMarker
              center={driver}
              radius={9}
              pathOptions={stale
                ? { color: '#475569', fillColor: '#94a3b8', fillOpacity: 0.95, weight: 2 }
                : { color: '#166534', fillColor: '#22c55e', fillOpacity: 0.95, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -8]}>{status}</Tooltip>
            </CircleMarker>
          )}
          <FitOnce points={points} />
        </MapContainer>
      </div>
    </section>
  )
}
