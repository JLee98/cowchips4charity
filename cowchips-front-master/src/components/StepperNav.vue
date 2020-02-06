<template>
  <div id="stepperNav">
    <v-btn class="custom-button" id="back" v-if="!disallowBack" flat @click="back">Back</v-btn>
    <v-btn class="custom-button" id="next" v-if="!disallowNext" flat @click="next">Next</v-btn>
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

.custom-button {
  border-radius: 20px;
  text-align: center;
  font-size: 22px;
  color: white;
  background-color: #4e3b25;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  overflow-x: hidden;
}

</style>
