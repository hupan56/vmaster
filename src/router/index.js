import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/Login.vue'
import home from '../views/home/Home.vue'
import Welcome from '../views/home/Welcome.vue'
import Users from '../views/home/user/users.vue'
import Rights from '../views/home/power/rights/rights.vue'
import Roles from '../views/home/power/roles/Roles.vue'
Vue.use(VueRouter)

const routes = [
    {
      path:"/login",
      component:login
    },
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/home",
      component: home,
      redirect:"/welcome",
      children:[ 
        {
        path:"/welcome",
        component: Welcome
        },
        {
          path:"/users",
          component: Users
        },
        {
          path:"/rights",
          component: Rights
        },
        {
          path:"/roles",
          component: Roles
        }
    ]
     
    }
   
]

const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to,fom,next)=>{
    if(to.path=="/login") return next();
    //获取token
   const token =window.sessionStorage.getItem("token");
   if(!token) return next("/login");
   else return next()
})

export default router
