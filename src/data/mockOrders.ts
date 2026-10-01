import type { Order } from '../types'
import { products } from './mockProducts'

export const mockOrders: Order[] = [
  {
    code: '#DH-2024-1082',
    items: [
      { product: products.find((p) => p.slug === 'dau-trau-npk-20-20-15')!, quantity: 10 },
      { product: products.find((p) => p.slug === 'beam-75wp')!, quantity: 5 },
    ],
    subtotal: 7060000,
    shippingFee: 0,
    total: 7060000,
    recipientName: 'Nguyễn Văn Hùng',
    recipientPhone: '0918 234 567',
    address: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, Cần Thơ',
    paymentMethod: 'VIETQR',
    status: 'SHIPPING',
    paymentStatus: 'PAID',
    createdAt: '08:35 Hôm nay',
    estimatedDelivery: '14:00 Hôm nay',
    notes: 'Giao tại bến xuồng Kênh Xáng, gọi trước 15 phút.',
    deliveries: [
      {
        id: 'DEL-1082-1',
        status: 'FAILED',
        items: [{ product: products.find((p) => p.slug === 'dau-trau-npk-20-20-15')!, quantity: 5 }],
        deliveryDate: '10:00 Hôm nay',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        failReason: 'Khách hàng đi vắng, không liên lạc được',
      },
      {
        id: 'DEL-1082-2',
        status: 'IN_TRANSIT',
        items: [
          { product: products.find((p) => p.slug === 'dau-trau-npk-20-20-15')!, quantity: 10 },
          { product: products.find((p) => p.slug === 'beam-75wp')!, quantity: 5 }
        ],
        driverName: 'Nguyễn Văn B',
        driverPhone: '0909876543',
      }
    ],
    hallmark: {
      certification: 'Sản Phẩm Đạt Chuẩn VietGAP',
      traceCode: 'VG-2024-1082',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VG-2024-1082',
      description: 'Lô hàng được kiểm định bởi Sở Nông nghiệp & PTNT Cần Thơ. Đảm bảo 100% không dư lượng thuốc BVTV.'
    }
  },
  {
    code: '#DH-2024-1080',
    items: [
      { product: products.find((p) => p.slug === 'ure-ca-mau-hat-duc')!, quantity: 15 },
      { product: products.find((p) => p.slug === 'map-lotus-125wp')!, quantity: 40 },
    ],
    subtotal: 9620000,
    shippingFee: 0,
    total: 9620000,
    recipientName: 'Nguyễn Văn Hùng',
    recipientPhone: '0918 234 567',
    address: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, Cần Thơ',
    paymentMethod: 'SEASONAL_CREDIT',
    status: 'PROCESSING',
    paymentStatus: 'CREDIT_APPROVED',
    createdAt: '07:15 Hôm nay',
    estimatedDelivery: 'Sáng mai 08:30',
    notes: 'Tín dụng mùa vụ Đông Xuân 2025 — Thanh toán sau thu hoạch.',
  },
  {
    code: '#DH-2024-1084',
    items: [
      { product: products.find((p) => p.slug === 'fuji-one-40ec')!, quantity: 6 },
      { product: products.find((p) => p.slug === 'anvil-5sc')!, quantity: 2 },
    ],
    subtotal: 1240000,
    shippingFee: 30000,
    total: 1270000,
    recipientName: 'Nguyễn Văn Hùng',
    recipientPhone: '0918 234 567',
    address: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, Cần Thơ',
    paymentMethod: 'VIETQR',
    status: 'PENDING_PAYMENT',
    paymentStatus: 'AWAITING_AGENT_VERIFICATION',
    createdAt: '11:10 Hôm nay',
    notes: 'Đã chuyển khoản VietQR qua Vietcombank STK 19006828999.',
  },
  {
    code: '#DH-2024-8703',
    items: [
      { product: products.find((p) => p.slug === 'lua-giong-st25')!, quantity: 6 },
    ],
    subtotal: 4320000,
    shippingFee: 180000,
    total: 4500000,
    recipientName: 'Nguyễn Văn Hùng',
    recipientPhone: '0918 234 567',
    address: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, Cần Thơ',
    paymentMethod: 'SEASONAL_CREDIT',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    createdAt: '30/08/2024',
    notes: 'Vụ Hè Thu 2024 — Đã tất toán nợ.',
  },
]

export function getOrderByCode(code: string): Order | undefined {
  return mockOrders.find((o) => o.code === code)
}
