<template>
  <div id="stepperNav">
    <v-btn id="back" v-if="!disallowBack" flat @click="back">Back</v-btn>
    <v-btn id="next" v-if="!disallowNext" color="primary" @click="next">Next</v-btn>
  </div>
</template>

<script>
  export default {
    name: 'StepperNav',
    props: {
      disallowNext: Boolean,
      disallowBack: Boolean
    },
    methods: {
      next () {
        this.$emit('next')
      },
      back () {
        this.$emit('back')
      }
    }
  }
</script>

<style scoped>

</style>
