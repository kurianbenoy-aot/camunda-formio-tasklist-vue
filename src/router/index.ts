import VueRouter, { RouteConfig } from 'vue-router'
import Vue from 'vue'
import FormDetailsList from '@/components/formlist-details.vue';
import FormList from '@/components/formlist.vue';
import Tasklist from '@/views/tasklist.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Tasklist',
    component: Tasklist
  },
  {
    path: '/form',
    name: 'Formio forms list',
    component: FormList
  },
  {
    path: '/form',
    name: 'formioFormlist',
    props: true,
    component: FormList,
  },
  {
    path: '/form/:fId',
    name: 'formioFormDetails',
    props: true,
    component: FormDetailsList,
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
