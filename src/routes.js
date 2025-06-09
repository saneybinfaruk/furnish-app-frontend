import { createRouter, createWebHistory } from "vue-router";

import ProductDetails from "./pages/Details.vue";
import About from "./pages/About.vue";
import Cart from "./pages/Cart.vue";
import Dashboard from "./pages/Dashboard.vue";
import DHome from "../src/components/dashboard/DHome.vue";
import ProductList from "./components/dashboard/product/ProductList.vue";
import AddProduct from "./components/dashboard/product/AddProduct.vue";
import CategoryList from "./components/dashboard/category/CategoryList.vue";
import AddCategory from "./components/dashboard/category/AddCategory.vue";
import SubCategoryList from "./components/dashboard/subcategory/SubCategoryList.vue";
import Profile from "./pages/Profile.vue";
import Info from "./components/profile/AccountInfo.vue";
import Reviews from "./components/profile/Reviews.vue";
import Addresses from "./components/profile/Addresses.vue";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import { useAuthStore } from "./store/store";
import Checkout from "./pages/Checkout.vue";
import OrderDetails from "./components/profile/MyOrderDetails.vue";
import Shop from "./pages/Shop.vue";
import Home from "./pages/Home.vue";
import Store from "./pages/Store.vue";
import Stores from "./pages/Stores.vue";
import OrderConfirmation from "./pages/OrderConfirmation.vue";
import Vendors from "./components/dashboard/vendors/Vendors.vue";
import Orders from "./components/dashboard/orders/Orders.vue";
import VendorsDetails from "./components/dashboard/vendors/VendorsDetails.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/products",
    name: "products",
    component: Shop,
  },
  {
    path: "/products/:id",
    name: "productDetails",
    component: ProductDetails,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
  },
  {
    path: "/stores",
    name: "Stores",
    component: Stores,
  },
  {
    path: "/stores/:storeId",
    name: "StoreDetail",
    component: Store,
    props: true,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/order-confirmation",
    name: "order-confirmation",
    component: OrderConfirmation,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      hideSubNav: true,
      requiresAuth: true,
      requiresRole: ["admin", "vendor"],
    },
    children: [
      {
        path: "home",
        name: "dashboard-home",
        component: DHome,
      },
      {
        path: "vendors",
        name: "vendors",
        component: Vendors,
      },
      {
        path: "vendors/:slug",
        name: "vendor-details",
        component: VendorsDetails,
        props: true,
      },
      {
        path: "orders",
        name: "orders",
        component: Orders,
      },
      {
        path: "product-list",
        component: ProductList,
      },
      {
        path: "add-product",
        component: AddProduct,
      },
      {
        path: "category-list",
        name: "Category List",
        component: CategoryList,
      },
      {
        path: "add-category",
        name: "Add Category",
        component: AddCategory,
      },
      {
        path: "add-category/1",
        name: "Edit Category",
        component: AddCategory,
      },
      {
        path: "sub-category-list",
        name: "Sub Category List",
        component: SubCategoryList,
      },
    ],
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "info" },
      {
        path: "info",
        name: "info",
        component: Info,
      },
      {
        path: "my-orders",
        name: "my-orders",
        component: Orders,
      },
      {
        path: "my-orders/:id",
        name: "order-details",
        component: OrderDetails,
        props: true,
      },
      {
        path: "my-product-reviews",
        name: "my-product-reviews",
        component: Reviews,
      },
      {
        path: "my-addresses",
        name: "my-addresses",
        component: Addresses,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log("isAuthenticated ", authStore.user.token);

  // Redirect authenticated users from login/register to home
  if (authStore.user.token && (to.name === "login" || to.name === "register")) {
    return next({ name: "home" });
  }

  // Check role access for routes with requiresRole meta
  if (to.meta.requiresRole && !to.meta.requiresRole.includes(authStore.user.role)) {
    return next({ name: "home" });
  }

  // Redirect unauthenticated users trying to access protected routes
  if (to.meta.requiresAuth && !authStore.user.token) {
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  next();
});

export default router;
