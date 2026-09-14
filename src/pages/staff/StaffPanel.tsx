import AiQueueScreen from "./AiQueueScreen"
import DealerProfileScreen from "./DealerProfileScreen"
import DebtScreen from "./DebtScreen"
import OrdersScreen from "./OrdersScreen"
import PosScreen from "./PosScreen"
import StockScreen from "./StockScreen"
import type { StaffSection } from "./StaffTypes"
import VietQrScreen from "./VietQrScreen"

export default function StaffPanel({ section }: { section: StaffSection }) {
  switch (section) {
    case "ai":
      return <AiQueueScreen />
    case "stock":
      return <StockScreen />
    case "orders":
      return <OrdersScreen />
    case "debt":
      return <DebtScreen />
    case "vietqr":
      return <VietQrScreen />
    case "dealer":
      return <DealerProfileScreen />
    case "pos":
    default:
      return <PosScreen />
  }
}
