<template>
  <v-stepper-content :step="step">
    <v-card class="mb-5 scroll" color="grey lighten-1" :height="height" :width="width">
      <slot></slot>
    </v-card>
    <stepper-nav :disallow-next="disallowNext" :disallow-back="disallowBack" @next="next" @back="back"></stepper-nav>
  </v-stepper-content>
</template>

<script>
  import StepperNav from './StepperNav'

  export default {
    name: 'StepperItem',
    components: {
      StepperNav
    },
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize)
    },
    data() {
      return {
        windowHeight: 0,
        windowWidth: 0,
        headerHeight: 0,
        navHeight: 0,
        itemPaddingWidth: 0
      }
    },
    props: {
      step: String,
      disallowNext: Boolean,
      disallowBack: Boolean
    },
    methods: {
      next() {
        this.$emit('next')
      },
      back() {
        this.$emit('back')
      },
      handleResize() {
        this.getWindowWidth()
        this.getWindowHeight()
        this.getHeaderHeight()
        this.getNavHeight()
        this.getContentPaddingWidth()
      },
      getWindowWidth() {
        this.windowWidth = window.innerWidth
      },
      getWindowHeight() {
        this.windowHeight = window.innerHeight
      },
      getHeaderHeight() {
        if(!document.getElementsByClassName('v-stepper__header')[0])
          return

        this.headerHeight = document.getElementsByClassName('v-stepper__header')[0].clientHeight
      },
      getNavHeight() {
        if(!document.getElementById('stepperNav'))
          return

        this.navHeight = document.getElementById('stepperNav').clientHeight
      },
      getContentPaddingWidth() {
        const content = document.getElementsByClassName('v-stepper__content')[0]
        if(!content)
          return

        const paddingStr = window.getComputedStyle(content).getPropertyValue('padding-left')
        this.itemPaddingWidth = paddingStr.substring(0, paddingStr.length-2)
      }
    },
    computed: {
      width() {
        return this.windowWidth-this.itemPaddingWidth*2-10 + 'px'
      },
      height() {
        return this.windowHeight-this.headerHeight-this.navHeight-120 + 'px'
      }
    }
  }
</script>

<style scoped>


</style>
