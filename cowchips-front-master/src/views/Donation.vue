<template>
  <div class="test">
    <div :class="{ center: !full, 'not-center': full  }">
      <v-btn to="/" v-if="full">Back</v-btn>
      <fieldset class="donation-fieldset" v-if="full">
        <div class="row">
          <label class="donation-label" for="name">Name</label>
          <input class="donation-input" id="name" type="text" placeholder="Jane Doe" autocomplete="off" v-model="name">
        </div>
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

  let stripe = Stripe('pk_test_YCINwBsny5MG5yYQwzwMnD5i')
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
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':-webkit-autofill': {
              color: '#fce883',
            },
            '::placeholder': {
              color: '#87BBFD',
            },
          },
          invalid: {
            iconColor: '#FFC7EE',
            color: '#FFC7EE',
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
    background-color: #6772e5;
    width: 98%;
    height: 100%;
    text-align: center;
    position: relative;
  }

  .checkout {
    display: block;
    width: calc(100% - 30px);
    height: 40px;
    margin: 40px 15px 0;
    background-color: #f6a4eb;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 #ffb9f6;
    border-radius: 4px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  .donation-fieldset {
    margin: 0 15px 20px;
    padding-top: 1em;
    border-style: none;
    background-color: #7795f8;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 #829fff;
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
    width: 15%;
    min-width: 70px;
    padding: 11px 0;
    color: #c4f0ff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .donation-input {
    width: 100%;
    padding: 11px 15px 11px 0;
    color: #fff;
    background-color: transparent;
    -webkit-animation: 1ms void-animation-out;
  }

  .row {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 15px;
  }

</style>
