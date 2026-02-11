import { createRouter, createWebHistory } from "vue-router"

import Home from "../components/Home.vue"
import Details from "../components/Details.vue"
import MainCanvas from "../layouts/MainCanvas.vue"

const routes = [
    {
    path: "/",
    component: MainCanvas,
    children: [
      { path: "", component: Home, name: "Home" },
      { path: "details/:id", component: Details, name: "Details" }
    ]
  }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router