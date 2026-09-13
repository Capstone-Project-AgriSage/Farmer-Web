import { createBrowserRouter } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AiDoctor from "./pages/AiDoctor";
import Knowledge from "./pages/Knowledge";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Staff from "./pages/Staff";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <span className="material-symbols-outlined text-[72px] text-text-muted">explore_off</span>
      <h1 className="text-2xl font-bold text-text-primary mt-4 mb-2">Trang không tồn tại</h1>
      <p className="text-text-muted text-sm mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-colors">
        Về trang chủ
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/admin", Component: Admin },
  { path: "/admin/:adminPage", Component: Admin },
  { path: "/quan-tri", Component: Admin },
  { path: "/quan-tri/:adminPage", Component: Admin },
  { path: "/staff", Component: Staff },
  { path: "/staff/:staffPage", Component: Staff },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "gioi-thieu", Component: About },
      { path: "san-pham", Component: Products },
      { path: "san-pham/:slug", Component: ProductDetail },
      { path: "bac-si-ai", Component: AiDoctor },
      { path: "kien-thuc", Component: Knowledge },
      { path: "kien-thuc/:slug", Component: ArticleDetail },
      { path: "lien-he", Component: Contact },
      { path: "gio-hang", Component: Cart },
      { path: "dang-nhap", Component: Login },
      { path: "quen-mat-khau", Component: ForgotPassword },
      { path: "ho-so", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
