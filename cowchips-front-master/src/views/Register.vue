<template>

  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12 shadow">
                <v-toolbar dark color="#4B7634">
                  <v-toolbar-title>Register</v-toolbar-title>
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
                    <v-text-field prepend-icon="person" id="name" placeholder="Name" v-model="user.name" browser-autocomplete="off"></v-text-field>
                    <v-text-field prepend-icon="email" id="email" placeholder="Email" v-model="user.email" browser-autocomplete="off"></v-text-field>
                    <v-text-field prepend-icon="lock" id="password" :type="'password'" placeholder="Password" v-model="user.password"></v-text-field>
                    <v-text-field prepend-icon="lock" id="password-verify" :type="'password'" placeholder="Verify Password" v-model="passwordVerify"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#4B7634" id="submit" @click.prevent="submit">Register</v-btn>
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
    name: "Register",
    data() {
      return {
        error: '',
        user: {
          name: '',
          email: '',
          password: ''
        },
        passwordVerify: ''
      }
    },

    methods: {
      submit() {
        if(this.user.password !== this.passwordVerify) {
          this.error = 'Password and Verified Password Must Match'
          return
        }

        axios.post('/register', this.user)
          .then(res => {
            const token = res.data.token
            localStorage.setCookie(authTokenName, token)
            axios.defaults.headers['Authorization'] = localStorage.getCookie(authTokenName)
            this.$router.push('/home')
          })
          .catch(err => {
            this.error = err.response ? err.response.data.error[0].message : err.message
          })
      }
    }
  }
</script>

<style scoped>

</style>
