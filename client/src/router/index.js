import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import roleManagement from "../components/Management/roleManagement.component.vue";
import userManagement from "../components/Management/userManagement.component.vue";
import activityManagement from "../components/Management/activityManagement.component.vue";
import contactManagement from "../components/Management/contactManagement.component.vue";
import dealsManagement from "../components/Management/dealsManagement.component.vue";
import test from "../components/Management/test.component.vue";
import Nav from "../components/navBar/navBar.component.vue";
import calendar from "../components/Management/calendar.component.vue";
import profileManagement from "../components/Management/profileManagement.component.vue";
import dashboard from "../components/dashboard/dashboard.component.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../components/auth/login.component.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/Nav",
    name: "Nav",
    component: () => import("../components/navBar/navBar.component.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/updatePassword",
    name: "updatePassword",
    component: () => import("../components/auth/updatePassword.component.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/forgetPassword",
    name: "forgetPassword",
    component: () => import("../components/auth/forgetPassword.component.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/resetPassword/:token",
    name: "resetPassword",
    component: () => import("../components/auth/resetPassword.component.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/register/:token",
    name: "register",
    component: () => import("../components/auth/register.component.vue"),
    meta: {
      //requiresAuth: true
    },
  },
  {
    path: "/roleManagement",
    name: "roleManagement",
    components: {
      default: roleManagement,
      NavBar: Nav,
    },
    meta: {
      //requiresAuth: true
    },
  },
  {
    path: "/activityManagement",
    name: "activityManagement",
    components: {
      default: activityManagement,
      NavBar: Nav,
    },
    meta: {
      // requiresAuth: true
    },
  },
  // {
  //   path: "/contactManagement",
  //   name: "contactManagement",
  //   components: {
  //     default: contactManagement,
  //     NavBar: Nav,
  //   },
  //   meta: {
  //     //  requiresAuth: true
  //   },
  // },
  {
    path: "/dealsManagement",
    name: "dealsManagement",
    components: {
      default: dealsManagement,
      NavBar: Nav,
    },
    meta: {
      //  requiresAuth: true,
    },
  },
  {
    path: "/userManagement",
    name: "userManagement",
    components: {
      default: userManagement,
      NavBar: Nav,
    },
    meta: {
      //  requiresAuth: true,
    },
  },
  {
    path: "/profileManagement",
    name: "profileManagement",
    components: {
      default: profileManagement,
      NavBar: Nav,
    },
    meta: {
      // requiresAuth: true,
    },
  },
  {
    path: "/calendar",
    name: "calendar",
    components: {
      default: calendar,
      NavBar: Nav,
    },
    meta: {
      //requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    components: {
      default: dashboard,
      NavBar: Nav,
    },
    meta: {
      // requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (localStorage.getItem("token") == null) {
//       next({
//         path: "/login",
//         params: {
//           nextUrl: to.fullPath,
//         },
//       });
//     } else {
//       next();
//     }
//   }

// else if (to.matched.some(record => record.meta.guest)) {
//   if (localStorage.getItem('token') == null) {
//     next()
//   } else {
//     next({
//       name: ''
//     })
//   }
// } else {
//   next()
// }
//});
export default router;
