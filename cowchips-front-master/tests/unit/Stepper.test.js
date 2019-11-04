import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import * as chai from 'chai'
import Vue from 'vue'
import StepperNav from '@/components/StepperNav'
import StepperItem from '@/components/StepperItem'
import Stepper from '@/views/Stepper'
import Organizations from '@/views/Organizations'

Vue.config.silent = true

Vue.use(Vuetify)

const expect = chai.expect

describe('Stepper', () => {
  
  it('appears', () => {
    const wrapper = mount(Stepper)
    expect(wrapper.is(Stepper)).to.eql(true)
    expect(wrapper.contains(StepperNav)).to.eql(true)
    expect(wrapper.contains(StepperItem)).to.eql(true)
  })
  
  it('back button decreases step', () => {
    const wrapper = mount(Stepper)
    const backButton = wrapper.find('#back')
    backButton.trigger('click')
    expect(wrapper.vm.$data.step).to.eql(0)
  })
  
  it('next button increases step', () => {
    const wrapper = mount(Stepper)
    const backButton = wrapper.find('#next')
    backButton.trigger('click')
    expect(wrapper.vm.$data.step).to.eql(2)
  })
  
  it('first page is Organizations', () => {
    const wrapper = mount(Stepper)
    expect(wrapper.find(Organizations).isEmpty()).to.eql(false)
  })
  
  it('second page is tiles', () => {
    const wrapper = mount(Stepper)
    expect(wrapper.text()).to.include('Tiles!')
  })
  
  it('third page is donate', () => {
  })
  
  it('Doesnt show back button on first step', () => {
    const wrapper = mount(Stepper)
    expect(wrapper.findAll('#back').length).to.eql(2)
  })
  
  it('Doesnt show next button on last step', () => {
    const wrapper = mount(Stepper)
    expect(wrapper.findAll('#next').length).to.eql(1)
  })
})
