<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-alert v-if="error" show variant="danger">{{this.error}}</b-alert>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input :state="!$v.email.$error ? '' : false" v-model="$v.email.$model" type="text" class="form-control" placeholder="Username" autocomplete="off" />
                    <b-form-invalid-feedback v-if="!$v.email.required">Email is required</b-form-invalid-feedback>
                    <b-form-invalid-feedback v-if="!$v.email.email">Email must be a valid address</b-form-invalid-feedback>
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input :state="!$v.password.$error ? '' : false" v-model="$v.password.$model" type="password" class="form-control" placeholder="Password" autocomplete="off" />
                    <b-form-invalid-feedback v-if="!$v.password.required">Password is required</b-form-invalid-feedback>
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button :disabled="$v.$invalid" type="submit" id="submit" variant="primary" class="px-4" @click.prevent="submitLogin">Login</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>

              <template slot="footer">
                <span></span><server-connection></server-connection>
              </template>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import localStorage from '@/helpers/localStorage'
import { authTokenName } from '@/config/auth'
import ServerConnection from '@/components/ServerConnection'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  components: {ServerConnection},
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    }
  },
  methods: {
    submitLogin() {
      this.error = ''
      axios.post('/admin/login', {
        email: this.email,
        password: this.password
      })
        .then(res => {
          const token = res.data.token
          localStorage.setCookie(authTokenName, token)
          axios.defaults.headers['Authorization'] = localStorage.getCookie(authTokenName)
          this.$router.push('/dashboard')
        })
        .catch(err => {
          if (err.response && err.response.data.error) {
            this.error = err.response.data.error
          }
          else {
            this.error = 'Login Failed'
          }
        })
    },
  }
}
</script>
