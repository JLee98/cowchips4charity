<template>
  <div class="v-content">

    <div class="background column left">
      <v-img
          :src="require('../assets/grass_background.jpg')"
      ></v-img>
    </div>

    <div class="column middle">

      <div class="logo">
        <v-img
            :src="require('../assets/play-cow-patty.jpg')"
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
        <p style="text-align:left;">
            <a href="https://www.facebook.com/Cow-Chips-4-Charity-107587673987973/?__tn__=%2Cd%2CP-R&eid=ARDgwL9hUxDdxBF-2durguaMnHFalhSnFCXUFQDY8IBkFG_JdSzhw_5O9m543j2JBsNDKFycFMBaPOil">Visit our Facebook Page</a>
            <span style="float:right;">
              Powered by Iowa State™ Engineers.
            </span>
        </p>
    </div>
    <div class="background column right">
      <v-img
          :src="require('../assets/grass_background.jpg')"
      ></v-img>
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
    height: 90px;
    width: 100%;
  }

  .column {
    float: left;
  }

  .left, .right {
    width: 15%;
  }

  .middle {
    width: 70%;
  }

  .row:after {
    content: "";
    display: table;
    clear: both;
  }

  .logo {
    margin: auto;
  }
  .background {
    background-image: url("../assets/grass_background.jpg");
  }

  .button-container {
    margin: auto;
    padding-top: 10px;
  }

  .custom-button {
    border-radius: 20px;
    text-align: center;
    font-size: 22px;
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
