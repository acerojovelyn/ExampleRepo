import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes=[
  {
    path:'/home',
    name:'Home',
    component: () => import( '../views/Home.vue')
  },
  {
    path:'/tekkin_printing',
    name:'TekkingPrinting',
    component: () => import( '../components/Printing/TekkinPrinting.vue')
  },
  {
    path:'/tekkin_sending',
    name:'TekkinSending',
    component: () => import( '../components/Sending/TekkinSending.vue')
  },
  {
    path:'/tekkin_finished',
    name:'FinishedPlans',
    component: () => import( '../components/Finished/FinishedPlans.vue')
  },
  {
    path:'/tekkin_cancelled',
    name:'CancelledPlans',
    component: () => import( '../components/Cancelled/CancelledPlans.vue')
  },
  {
    path:'/tekkin_formula',
    name:'Formula',
    component: () => import( '../components/Formula/Formula.vue')
  },
   {
    path:'/tekkin_SubconEmail',
    name:'Subcon Email',
    component: () => import( '../components/EmailAddSub/SubconEmail.vue')
  },
  {
    path:'/tekkin_Accounts',
    name:'Accounts',
    component: () => import( '../components/Accounts/Accounts.vue')
  },
  {
    path: '/login',
    name: 'Loginpage',
    component: () => import('../views/Loginpage.vue')
  },

  
  
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  if (to.path === '/login') {
    if(store.state.userInfo){
      next('/tekkin_sending')
    }else{
      next()
    }
  }else if (to.path === '/') {
    next('/tekkin_sending')
  }
  else{
    if(store.state.userInfo){
      next()
    }else{
      next('/login')
    }
  }
})

// router.beforeEach((to, from, next) => {
//   let cookies = Vue.prototype.$cookies
//   if(to.path==='/login'){
//     if(cookies.isKey('FileManagementUser') == true){
//       next('/')
//     }else{
//       next()
//     }
//   }else{
//     if(cookies.isKey('FileManagementUser') == true){
//       next()
//     }else[
//       next('/login')
//     ]
//   }
// })


export default router