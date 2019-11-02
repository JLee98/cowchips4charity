<template>
  <div>

    <b-row>
      <b-col>
        <b-button variant="primary" @click.prevent="back">Back</b-button>
      </b-col>
      <b-col>
        Organizations
      </b-col>
    </b-row>

    <b-row>
      <strong>Mac Tip: To select multiple options hold command when clicking</strong>
    </b-row>

    <b-row>
      <strong>Windows Tip: To select multiple options hold control when clicking</strong>
    </b-row>

    <b-row>
      <b-form-select multiple :select-size="10" v-model="selected" :options="options" />
      <div class="mt-3">Selected: <strong>{{ selectedNames }}</strong></div>
    </b-row>

    <b-row>
      <b-button variant="success" @click.prevent="submitOrgs">Submit</b-button>
    </b-row>

  </div>
</template>

<script>
  import axios from 'axios'
  import BRow from "bootstrap-vue/src/components/layout/row";
  import path from 'path'

  export default {
    name: "GameOrganizations",
    components: {BRow},
    created(){
      this.getOrganizations();
      this.getCurrentOrgs();
    },
    data(){
      return {
        selected: [],
        organizations: [],
        options: [],
        currentOrgs: [],
      }
    },
    computed: {
      selectedNames: function() {
        let tempArray = []
        for(let i = 0; i < this.selected.length; i++)
        {
          for(let j = 0; j < this.options.length; j++)
          {
            if(this.selected[i] == this.options[j].value)
            {
              tempArray.push(this.options[j].text)
            }
          }
        }
        return tempArray.toString()
      }
    },
    methods: {
      getOrganizations() {
        axios.get('/admin/organizations')
          .then(res => {
            this.organizations = res.data
            this.createOptions()
            this.updateView()
          })
          .catch(err => {
            console.log(err)
          })
      },
      getCurrentOrgs() {
        this.selected = []
        axios.get(path.join('/admin/games', this.$route.params.id))
          .then(res => {
            for(let i = 0; i < res.data.organizations.length; i++)
            {
              this.selected.push(
                res.data.organizations[i]
              )
            }
            this.updateView()
          })
          .catch(err => {
            console.log(err)
          })

      },
      updateView(){
        this.$forceUpdate()
      },
      back() {
        this.$router.push('/games')
      },
      createOptions() {
        this.options = []
        for(let i = 0; i < this.organizations.length; i++) {
          this.options.push({
            value: this.organizations[i]._id,
            text: this.organizations[i].name
          })
        }
      },
      submitOrgs() {
        axios.put(path.join('admin/games', this.$route.params.id), {
          organizations: this.selected
        })
          .then( () => {
            this.$router.push('/games');
          })

      }
    }
  }
</script>

<style scoped>

</style>
