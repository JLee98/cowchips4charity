<template>
  <div class="test">
    <div :class="{ center: !full, 'not-center': full  }">
      <v-flex>
      <v-btn
          icon
          large
          to="/"
          slot="activator">
        <v-icon large>arrow_back</v-icon>
      </v-btn>
       </v-flex>
      <fieldset class="donation-fieldset" v-if="full">
        <div class="row">
          <label class="donation-label" for="name">Name</label>
          <input class="donation-input" id="name" type="text" placeholder="Jane Doe" autocomplete="off" v-model="name">
        </div>
        </fieldset>
     <fieldset class="donation-fieldset" v-if="full">
        <div class="row">
          <label class="donation-label" for="total">Amount</label>
          <input class="donation-input" id="total" type="text" placeholder="0" autocomplete="off" v-model="amount">
        </div>
      </fieldset>
      <fieldset class="donation-fieldset">
        <div ref="card"></div>
      </fieldset>
      <button class="checkout" @click="purchase">Pay ${{total}}</button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import localStorageNames from '@/config/localStorageNames'
  import localStorage from '@/helpers/localStorage'


  // let stripe = Stripe('pk_test_YCINwBsny5MG5yYQwzwMnD5i')
  let stripe = Stripe('pk_test_fCDuJuMMRehjDU2lK1WSL7C800LCMM1NsI')
  let elements = stripe.elements()
  let card = undefined

  export default {
    data() {
      return {
        name: '',
        amount: 0
      }
    },
    mounted() {
      card = elements.create('card', {
        iconStyle: 'solid',
        style: {
          base: {
            iconColor: '#4B7634',
            color: ' #4B7634',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':-webkit-autofill': {
              color: '#4B7634',
            },
            '::placeholder': {
              color: '#4B7634',
            },
          },
          invalid: {
            iconColor: '#4B7634',
            color: '#4B7634',
          },
        },
      })
      card.mount(this.$refs.card)
    },
    beforeDestroy() {
      card.destroy(this.$refs.card)
    },
    methods: {
      purchase() {
        let self = this

        stripe.createToken(card).then(function(result) {
          if (result.error) {
            self.hasCardErrors = true
            self.$forceUpdate() // Forcing the DOM to update so the Stripe Element can update.
            return
          }

          const toSend = {
            amount: self.full ? self.amount*100 : self.$localStorage.get(localStorageNames.amount),
            source: result.token.id,
            currency: 'USD',
            organizationID: self.$localStorage.get(localStorageNames.orgId),
            gameID: self.$localStorage.get(localStorageNames.gameId),
            date: new Date().toISOString(),
            tiles: JSON.parse(self.$localStorage.get(localStorageNames.selected))
          }
          console.log(toSend)

          axios.post('/donation', toSend)
            .then(res => {
              console.log(res)
              for (let property in localStorageNames) {
                if (localStorageNames.hasOwnProperty(property)) {
                  console.log(localStorageNames[property])
                  self.$localStorage.remove(localStorageNames[property])
                }
              }
              self.$router.push('/thankyou')
            })
            .catch(err => {
              console.error(err)
            })
        })
      },
      isUserLoggedIn() {
        return localStorage.isUserLoggedIn()
      }
    },
    computed: {
      full() {
        return !!this.$route.query.full
      },
      total() {
        // TODO make this a param instead of isUserLoggedIn
        return this.full ? this.amount : this.$localStorage.get(localStorageNames.amount) / 100
      }
    }
  }
</script>

<style>

  .test {
    background-image: url("../assets/grass_background.jpg");
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
  }

  .backBtn
  {
      margin-left: 10px;
  }

  .checkout {
    display: block;
    width: calc(100% - 60%);
    height: 40px;
    margin: 0 auto;
    margin-top: 10%;
    background-color: #4e3b25;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 #4B7634;
    border-radius: 4px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  .donation-fieldset {
    width: calc(100% - 30%);
    margin: 0 auto;
    padding-top: 1em;
    border-style: none;
    background-color: #ffffff;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 #4B7634;
    border-radius: 4px;
  }

  .center {
    position: absolute;
    width: 100%;
    top: 50%;
    height: 100px;
    margin-top: -50px;
  }

  .not-center {

  }

  .donation-label {
    width: 0%;
    min-width: 10%;
    padding: 11px 0;
    color: #4B7634;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .donation-input
  {
    width: 100%;
    padding: 11px 15px 11px 0;
    color: #4B7634;
    background-color: transparent;
    -webkit-animation: 1ms void-animation-out;
  }
  #name
  {
      color: #4B7634;
      background-color: transparent;
  }

  .row {
    display: -ms-flexbox;
    display: flex;
    width: 80%;
    -ms-flex-align: center;
    align-items: center;
  }

</style>
