<template>
  <div class="whole">
    <v-img
        :src="require('../assets/play-cow-patty.jpg')"
        width="100%"
    ></v-img>
    <div class="button-container">

      <table v-if="isUserLoggedIn()" class="whole">
        <tr>
          <td class="custom-button main-button" @click="routerChange('/play')">Play</td>
          <td class="custom-button other-buttons" @click="routerChange('/about')">About</td>
        </tr>
        <tr>
          <td class="custom-button other-buttons" @click="routerChange('/account')">Account</td>
          <td class="custom-button other-buttons" @click="logout()">Logout</td>
        </tr>
      </table>
      <table v-else class="whole">
        <tr>
          <td class="custom-button main-button" @click="routerChange('/donation?full=true')">Donate</td>
          <td class="custom-button other-buttons" @click="routerChange('/about')">About</td>
        </tr>
        <tr>
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
    height: 95%;
    width: 100%;
  }

  .button-container {
    height: 73%;
    width: 100%;
  }

  .custom-button {
    border-radius: 20px;
    text-align: center;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    width: 50%;
    overflow-x: hidden;
  }

  .main-button {
    background-color: #555555;
    color: white;
  }

  .other-buttons {
    background-color: #EFF9F0;
  }
</style>
