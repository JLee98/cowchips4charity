<template>
  <v-card style="width: 90%">
    <v-toolbar dark>
      <v-toolbar-title>{{new Date(date).toLocaleDateString()}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <h3>${{amount/100}}</h3>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-layout align-center justify-start row fill-height wrap>
        <v-flex :key="tile" xs3 v-for="tile in tiles">
          <div :class="{ winning: tile === winningTile, tile: true }">{{tile}}</div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'GameHistory',
    props: {
      date: String,
      amount: Number,
      tiles: Array,
      winningTile: Number
    }
  }
</script>

<style scoped>
  .winning {
    background-color: green;
  }

  .tile {
    margin-bottom: 0.5em;
    border-style: solid;
    border-width: 2px;
    border-radius: 50%;
    text-align: center;
    width: 1.5em;
  }
</style>
