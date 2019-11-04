<template>
  <td :style="btnColor()" @click="handleClick">{{this.number}}</td>
</template>

<script>
  export default {
    name: 'Tile',
    props: {
      selected: Array,
      number: Number,
    },
    methods: {
      handleClick() {
        this.$emit('selected', this.number)
      },
      btnColor() {
        return this.selected.includes(this.number) ? 'background-color: #5C2C17; color: white;' : ''
      }
    },
  }
</script>

<style scoped>
  td {
    width: 16%;
    border-style: solid;
    border-width: 2px;
    border-radius: 50%;
  }
</style>
