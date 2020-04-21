<template>
  <td :style="btnColor()"</td>
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
        return 'background-color: white; color: black;' : ''
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
