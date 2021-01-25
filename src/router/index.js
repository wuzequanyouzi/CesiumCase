import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
const PolylineTrailLink = () => import("../components/specialEffects/PolylineTrailLink/Index.vue");
const ScalePrimitive = () => import("../components/specialEffects/ScalePrimitive/Index.vue");
const GoogleMap = () => import("../components/baseMap/GoogleMap/Index.vue");
const GaodeMap = () => import("../components/baseMap/GaodeMap/Index.vue");
const BaiduMap = () => import("../components/baseMap/BaiduMap/Index.vue");
const Tianditu = () => import("../components/baseMap/TiandituMap/Index.vue");
const PointClusterer = () => import("../components/pointsOptions/PointClusterer/Index.vue");
const PointRotation = () => import("../components/pointsOptions/PointRotation/Index.vue");

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/PolylineTrailLink',
    name: 'PolylineTrailLink',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PolylineTrailLink
  },
  {
    path: '/ScalePrimitive',
    name: 'ScalePrimitive',
    component: ScalePrimitive
  },
  {
    path: '/GoogleMap',
    name: 'GoogleMap',
    component: GoogleMap
  },
  {
    path: '/GaodeMap',
    name: 'GaodeMap',
    component: GaodeMap
  },
  {
    path: '/BaiduMap',
    name: 'BaiduMap',
    component: BaiduMap
  },
  {
    path: '/Tianditu',
    name: 'Tianditu',
    component: Tianditu
  },
  {
    path: '/PointClusterer',
    name: 'PointClusterer',
    component: PointClusterer
  },
  {
    path: '/PointRotation',
    name: 'PointRotation',
    component: PointRotation
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
