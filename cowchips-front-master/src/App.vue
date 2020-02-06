<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      //
    }
  }
}
</script>

<style>
  @import './assets/main.css';

  input {
    border: none;
  }
  label {
    z-index: 7;
  }

</style>
