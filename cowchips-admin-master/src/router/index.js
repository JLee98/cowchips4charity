import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Login = () => import('@/views/pages/Login')

const Users = () => import('@/views/users/Users')
const Games = () => import('@/views/games/Games')
const GameBoard = () => import('@/views/games/GameBoard')
const GameOrganizations = () => import('@/views/games/GameOrganizations')
const GameWinningTile = () => import('@/views/games/GameWinningTile')
import GameWinners from "@/views/games/GameWinners";

const Admins = () => import('@/views/users/Admin-users')

// Organizations
const Organizations = () => import('@/views/organizations/Organizations')

//Donations
const Donations = () => import('@/views/donations/Donations')

Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/users',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          name: 'users',
          component: Users,
        },
        {
          path: 'games',
          name: 'games',
          component: Games,
        },
        {
          path: 'games',
          name: 'games',
          component: Games,
        },
        {
          path: 'admin-users',
          name: 'admin-users',
          component: Admins,
        },
        {
          path: 'organizations',
          name: 'organizations',
          component: Organizations,
        },
        {
          path: 'donations',
          name: 'donations',
          component: Donations
        },
        {
          path: 'gameboard/:id',
          name: 'GameBoard',
          component: GameBoard,
        },
        {
          path: '/games/organizations/:id',
          name: 'GameOrganizations',
          component: GameOrganizations,
        }
        ,
        {
          path: '/games/winning-tile/:id',
          name: 'GameWinningTile',
          component: GameWinningTile,
        },
        {
          path: '/games/winners/:id',
          name: 'GameWinners',
          component: GameWinners
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    { path: "*",
      component: Page404
    }
  ]
})
