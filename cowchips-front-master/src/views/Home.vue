<template>
  <div class="whole">
    <div class="logo">
      <v-img
          :src="require('../assets/play-cow-patty.jpg')"
          max-width=1000px
      ></v-img>
    </div>
      <div class="button-container">

      <table v-if="isUserLoggedIn()" class="whole">
        <tr>
          <td class="custom-button other-buttons" @click="routerChange('/play')">Play</td>
          <td class="custom-button other-buttons" @click="routerChange('/about')">About</td>
          <td class="custom-button other-buttons" @click="routerChange('/account')">Account</td>
          <td class="custom-button other-buttons" @click="logout()">Logout</td>
        </tr>
      </table>
      <table v-else class="whole">
        <tr>
          <td class="custom-button other-buttons" @click="routerChange('/donation?full=true')">Donate</td>
          <td class="custom-button other-buttons" @click="routerChange('/about')">About</td>
          <td class="custom-button other-buttons" @click="routerChange('/login')">Login</td>
          <td class="custom-button other-buttons" @click="routerChange('/register')">Register</td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script>
  import {authTokenName} from '@/config/auth'
  import localStorage from '@/helpers/localStorage'

  export default {
    methods: {
      logout() {
        console.log('logout!')
        localStorage.setCookie(authTokenName, '')
        localStorage.eraseCookie(authTokenName)
        this.$forceUpdate()
      },
      isUserLoggedIn() {
        return localStorage.isUserLoggedIn()
      },
      routerChange(url) {
        this.$router.push(url)
      }
    }
  }
</script>

<style scoped>
  .whole {
    height: 25%;
    width: 100%;
  }

  .logo {
    display: block;
    margin=left: auto;
    margin=right: auto;
  }

  .button-container {
    margin: auto;
    height: 100%;
    width: 75%;
  }

  .custom-button {
    border-radius: 20px;
    text-align: center;
    font-size: 25px;
    color: white;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    width: 25%;
    overflow-x: hidden;
  }

  .other-buttons {
    background-color: #4e3b25;
  }
</style>
