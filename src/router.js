import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import PageNotFound from './components/pageNotFound.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',

  routes: [ 
       {
       path: '/login',
       name: 'login',
       component:login
       },

       {
       path: '/home',
       name: 'home',
       meta: {requiresAuth: true},
       component: () => import('./components/home.vue')
       },

       { path: "*", component: PageNotFound }
   
  ]
})

router.beforeEach((to, from, next) => {

     if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('auth') == null) {
            next({path: '/login'})
        } else {
            next()
        }
    }else{
        next() 
    }
})

export default router