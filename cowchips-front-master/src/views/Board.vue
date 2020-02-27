<template>
  <div>
    <table class="whole">

    </table>
  </div>
</template>

<script>
  import path from 'path'
  import axios from 'axios'
  import Tile from '@/components/Tile'
  import localStorageNames from '@/config/localStorageNames'

  export default {
    name: "Game",
    components: {
      Tile
    },
    mounted() {
      this.getGameBoard()
    },
    data() {
      return {
        board: [],
        selected: [],
        price: 0
      }
    },
    methods: {
      getGameBoard() {
        let gameId = this.$localStorage.get(localStorageNames.gameId)
        if(!gameId)
          return
      },
    },
  }
</script>

<style scoped>

  .whole {
    height: 95%;
    width: 100%;
    background-image: url("../assets/grass_background.jpg");
  }

  table {
    padding: 20px;
  }

  .game_tile {
    text-align: center;
    width: 5em;
    padding: 5px;

    border-radius: 15px;
    font-size: 22px;
    color: white;
    background-color: #4e3b25;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    overflow-x: hidden;
  }

  .words {
  text-align: center;
  padding-top: 10px;
  font-size: 22px;
  color: green;
  }

</style>
