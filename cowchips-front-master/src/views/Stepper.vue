<template>
  <v-stepper :value="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">Org Select</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 2" step="2">Tile Selection</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 3" step="3">Donation</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 4" step="4">Game</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <stepper-item step="1" @back="goHome" disallowNext>
        <organizations @next="upStep" :key="step"></organizations>
      </stepper-item>

      <stepper-item step="2" @back="downStep" @next="upStep">
        <game @next="upStep" :key="step"></game>
      </stepper-item>

      <stepper-item step="3" @back="downStep" @next="upStep">
        <donation @next="upStep" :key="step"></donation>
      </stepper-item>

      <stepper-item step="4" @back="downStep" disallowNext>
        <board :key="step"></board>
      </stepper-item>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import Organizations from './Organizations'
  import Donation from './Donation'
  import Game from './Game'
  import Board from './Board'
  import StepperItem from '@/components/StepperItem'

  export default {
    name: 'Layout',
    components: {
      StepperItem,
      Organizations,
      Game,
      Donation,
      Board
    },
    data() {
      return {
        step: 1
      }
    },
    computed: {
    },
    methods: {
      upStep() {
        this.step++
      },
      downStep() {
        this.step--
      },
      goHome() {
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>

</style>
