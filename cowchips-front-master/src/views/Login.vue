<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12 shadow">
                <v-toolbar dark color="#4B7634">
                  <v-toolbar-title>Login</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <v-btn
                        icon
                        large
                        to="/"
                        slot="activator"
                    >
                      <v-icon large>arrow_back</v-icon>
                    </v-btn>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <v-alert v-if="error" :value="true" type="error">{{error}}</v-alert>
                  <v-form style="width: 90%">
                    <v-text-field prepend-icon="person" id="email" placeholder="Email" v-model="email" browser-autocomplete="off"></v-text-field>
                    <v-text-field prepend-icon="lock" id="password" :type="'password'" placeholder="Password" v-model="password"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#4B7634" id="submit" @click.prevent="submit">Login</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import axios from 'axios'
  import localStorage from '@/helpers/localStorage'
  import { authTokenName } from '@/config/auth'

  export default {
    name: 'Login',
    data() {
      return {
        error: '',
        email: '',
        password: '',
      }
    },
    beforeCreate() {
      if(localStorage.isUserLoggedIn()) {
        this.$router.push('/')
      }
    },
    methods: {
      submit() {
        const self = this
        axios.post('/login', {
          email: this.email,
          password: this.password
        })
          .then(res => {
            const token = res.data.token
            localStorage.setCookie(authTokenName, token)
            axios.defaults.headers['Authorization'] = localStorage.getCookie(authTokenName)
            this.$router.push(self.$route.query.redirect ? self.$route.query.redirect : '/')
          })
          .catch(err => {
            this.error = err.response ? err.response.data.error : err
            console.error(err)
          })
      }
    }
  }
</script>

<style>
  .shadow {
    box-shadow: 0px 7px 8px -4px rgba(0,0,0,0.2);
    overflow-x: hidden;
    width: 90%;
  }
</style>
