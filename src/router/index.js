import Vue from 'vue'
import VueRouter from 'vue-router'
import List from '../views/List.vue'
import Form from '../views/Form.vue'
import Login from '../views/Login.vue'
import Register from '../views/register.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/list',
    name: 'list',
    component: List
  },
  {
    path: '/form',
    name: 'form',
    component: Form
  },
  

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
