import {createRouter, createWebHistory} from "vue-router";
import Home from "./pages/Home.vue";
import ProductDetails from "./pages/Details.vue";
import About from "./pages/About.vue";
import Cart from "./pages/Cart.vue";
import Dashboard from "./pages/Dashboard.vue";
import DHome from "./dashboard/DHome.vue";
import AddProduct from "./dashboard/AddProduct.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/products/:id',
        name: 'productDetails',
        component: ProductDetails,
        props: true
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { hideSubNav : true },
        children: [
            {
                path: 'home',
                component: DHome
            },
            {
                path: 'add-product',
                component: AddProduct
            }

        ]
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;