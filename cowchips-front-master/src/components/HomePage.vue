<template>
  <v-img
      :src="require('../assets/play-cow-patty.jpg')"
      width="95%"
  ></v-img>

      <!--<v-flex>-->
        <!--<div style="text-align: center;">-->
          <!--<v-btn v-if="!isUserLoggedIn()" round to="/login">Login</v-btn>-->
          <!--<v-btn v-if="!isUserLoggedIn()" round to="/register">Register</v-btn>-->
          <!--<span v-if="isUserLoggedIn()">Logged in as: {{userEmail}}</span>-->
          <!--<v-btn v-if="isUserLoggedIn()" round  to="/account">Account</v-btn>-->
          <!--<v-btn v-if="isUserLoggedIn()" round  @click="logout" >Logout</v-btn>-->
        <!--</div>-->
      <!--</v-flex>-->

      <!--<v-flex md-center xs12>-->
        <!--<div style="text-align: center;">-->
          <!--<v-btn large dark round to="/play">Play</v-btn>-->
          <!--<v-btn large dark round to="/donation?full=true">Donate</v-btn>-->
        <!--</div>-->
      <!--</v-flex>-->

      <!--<v-flex md-center>-->
        <!--&lt;!&ndash;<div style="text-align: center;">&ndash;&gt;-->
        <!--<div class="center2">-->
          <!--<v-btn round to="/about">About</v-btn>-->
        <!--</div>-->
      <!--</v-flex>-->
</template>

<script>
  import {authTokenName} from '@/config/auth'
  import localStorage from '@/helpers/localStorage'
  import axios from 'axios'

  export default {
    name: 'HomePage',
    created() {
      if(!this.isUserLoggedIn())
        return

      axios.get('/account')
        .then(res => {
          this.userEmail = res.data.email
        })
        .catch(err => {

        })
    },
    data: () => ({
      booRadleyFoundation: [
        {
          text: 'home page',
          href: 'http://www.booradleyfoundation.org/'
        }
      ],
      userEmail: ''
    }),
    computed: {
      email() {
        if (this.$store.state.user)
          return ' ' + this.$store.state.user.email
        return ''
      }
    },

  }
</script>

<style>

</style>
