<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12 shadow">
                <v-toolbar dark color="#4B7634">
                  <v-toolbar-title>Account</v-toolbar-title>
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
                    <v-text-field prepend-icon="home" id="address" placeholder="Address" v-model="user.location.address" browser-autocomplete="off"></v-text-field>
                    <v-text-field prepend-icon="location_city" id="city" placeholder="City" v-model="user.location.city" browser-autocomplete="off"></v-text-field>
                    <v-text-field prepend-icon="beenhere" id="state" placeholder="State" v-model="user.location.state" browser-autocomplete="off"></v-text-field>
                    <v-text-field prepend-icon="beenhere" id="zip" placeholder="Zip" v-model="user.location.zip" browser-autocomplete="off"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#5d8348" id="submit" @click.prevent="submit">Submit</v-btn>
                  <v-btn color="#5d8348" id="my-tiles" to="/account/tiles">View My Tiles</v-btn>
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

  export default {
    name: 'Account',

    created() {
      axios.get('/account')
        .then(res => {
          this.user = res.data
          if (this.user.location == null) {
            this.user.location = {}
          }
        })
        .catch( error => {
          console.log(error)
          console.log(error.response)
        })
    },

    data: () => ({
      error: '',
      user: {
        location: {}
      }
    }),

    methods: {
      submit () {
        const record = {
          name: this.user.name,
          location: {
            address: this.user.location.address,
            city: this.user.location.city,
            state: this.user.location.state,
            zip: this.user.location.zip
          }
        }

        axios.put('/account', record)
          .then(res => {
            this.$router.push('/home')
          })
          .catch(err => {
            console.log(err)
            console.log(err.response)
            this.error = err.response.data.error
          })
      },
    }
  }
</script>

<style scoped>

</style>
