<template>
  <crud-table
    url="/admin/games"
    name="Games"
    :fields="fields"
    :validations="validations"
    :create-transform="createTransform"
    :export-format="exportFormat"
  >

    <template slot="update-form" slot-scope="slotProps">
      <b-form-group label="Name">
        <b-form-input id="update-name" v-model="slotProps.$v.updateRecord.name.$model" :state="!slotProps.$v.updateRecord.name.$error ? '' : false" ></b-form-input>
        <b-form-invalid-feedback v-if="!slotProps.$v.updateRecord.name.required" >Name is required</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Start Time">
        <date-picker name="date" v-model="slotProps.$v.updateRecord.startTime.$model" :config="datePickerOptions"></date-picker>
      </b-form-group>
      <b-form-group label="End Time">
        <date-picker name="date" v-model="slotProps.$v.updateRecord.endTime.$model" :config="datePickerOptions"></date-picker>
      </b-form-group>
      <b-form-group label="Price">
        <b-form-input id="update-price" type="number" v-model="slotProps.$v.updateRecord.price.$model" :state="!slotProps.$v.updateRecord.price.$error ? '' : false" ></b-form-input>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.price.required" >Price is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.price.numeric" >Price must be a number</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Stream URL">
        <b-form-input id="update-stream-url" type="url" v-model="slotProps.$v.updateRecord.streamUrl.$model" :state="!slotProps.$v.updateRecord.streamUrl.$error ? '' : false" ></b-form-input>
        <b-form-invalid-feedback v-if="!slotProps.$v.updateRecord.streamUrl.required" >Stream URL is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.streamUrl.url" >Stream URL must be a URL</b-form-invalid-feedback>
      </b-form-group>
    </template>

    <template slot="create-form" slot-scope="slotProps">
      <b-form-group label="Name">
        <b-form-input id="create-name" v-model="slotProps.$v.createRecord.name.$model" :state="!slotProps.$v.createRecord.name.$error ? '' : false" ></b-form-input>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.name.required" >Name is required</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Start Time">
        <date-picker name="date" v-model="slotProps.createRecord.startTime" :config="datePickerOptions"></date-picker>
      </b-form-group>
      <b-form-group label="End Time">
        <date-picker name="date" v-model="slotProps.createRecord.endTime" :config="datePickerOptions"></date-picker>
      </b-form-group>
      <b-form-group label="Price">
        <b-form-input id="create-price" type="number" v-model="slotProps.$v.createRecord.price.$model" :state="!slotProps.$v.createRecord.price.$error ? '' : false" ></b-form-input>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.price.required" >Price is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.price.numeric" >Price must be a number</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Stream URL">
        <b-form-input id="create-stream-url" type="url" v-model="slotProps.$v.createRecord.streamUrl.$model" :state="!slotProps.$v.createRecord.streamUrl.$error ? '' : false" ></b-form-input>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.streamUrl.required" >Stream URL is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!slotProps.$v.createRecord.streamUrl.url" >Stream URL must be a URL</b-form-invalid-feedback>
      </b-form-group>
    </template>

    <template slot="additional-actions" slot-scope="slotProps">
      <i class="fa fa-th" @click="editGameBoard(slotProps.data.item._id)" title="Edit Game Board"></i>
      <i class="fa fa-graduation-cap" @click="editOrganizations(slotProps.data.item._id)" title="Edit Organizations List"></i>
      <i class="fa fa-diamond" v-if="slotProps.data.item.winningTile == null" @click="selectWinningTile(slotProps.data.item._id)" title="Select Winning Tile"></i>
      <i class="fa fa-trophy" v-if="slotProps.data.item.winningTile != null" @click="winners(slotProps.data.item._id)" title="View Winners"></i>
      <i class="fa fa-line-chart" @click="goToAnalytics(slotProps.data.item._id)" title="View Analytics"></i>

    </template>



  </crud-table>



</template>

<script>
  import CrudTable from '@/views/crud/CRUDTable'
  import moment from 'moment'
  import { required, url, numeric } from 'vuelidate/lib/validators'

  export default {
    name: "Games",
    components: {
      CrudTable
    },
    data() {
      return {
        fields: [
          {
            key: 'name',
            label: 'Name',
            type: 'string',
          },
          {
            key: 'startTime',
            formatter: this.convertUtcToLocal,
            label: 'Start Time',
            type: 'date',
          },
          {
            key: 'endTime',
            formatter: this.convertUtcToLocal,
            label: 'End Time',
            type: 'date',
          },
          {
            key: 'price',
            formatter: this.priceFormatter,
            label: 'Price',
            type: 'number',
          },
          {
            key: 'streamUrl',
            label: 'Stream Url',
            type: 'string',
          },
          {
            key: 'organizations',
            label: 'Organizations Count',
            formatter: this.arrCount,
            type: 'number'
          },
          {
            key: 'winningTile',
            label: 'Winning Tile',
            type: 'number',
          },
          {
            key: 'actions',
            label: 'Actions',
          }
        ],
        validations: {
          updateRecord: {
            name: {
              required
            },
            startTime: {
              required
            },
            endTime: {
              required
            },
            price: {
              required,
              numeric
            },
            streamUrl: {
              required,
              url
            }
          },
          createRecord: {
            name: {
              required
            },
            startTime: {
              required
            },
            endTime: {
              required
            },
            price: {
              required,
              numeric
            },
            streamUrl: {
              required,
              url
            }
          }
        },
        datePickerOptions: {
          format: 'YYYY-MM-DD hh:mm:ss',
          useCurrent: false,
          showClear: true,
          showClose: true,
        },
        exportFormat : {
          'Game Name' : 'name',
          'Game ID' : '_id',
          'Winning Tile' : 'winningTile',
          'Price (Cents)' : 'price',
          'Start Time' : 'startTime',
          'End Time' : 'endTime',
          'Stream URL' : 'streamUrl',
          'Board' : 'board',
        }
      }
    },
    methods: {
      editGameBoard(id) {
        console.log('editGameBoard for game: ' + id)
        this.$router.push('/gameboard/' + id)
      },
      editOrganizations(id) {
        console.log('editOrganizations for game:' + id)
        this.$router.push('/games/organizations/' +id)
      },
      selectWinningTile(id) {
        console.log('selectWinningTile for game:' + id)
        this.$router.push('/games/winning-tile/' +id)
      },
      goToAnalytics(id) {
        console.log('goToAnalytics for game:' + id)
        this.$router.push('/games/analytics/' + id)
      },
      convertUtcToLocal(time) {
        // TODO figure out how to add timezone to date format
        return moment(time).local().format('YYYY-MM-DD HH:mm:ss')
      },
      updateTransform(record) {
        return record
      },
      createTransform(record) {
        let tempRecord = {
          name: record.name,
          organizations: [],
          startTime: record.startTime,
          endTime: record.endTime,
          winningTile: null,
          board: [],
          price: record.price,
          streamUrl: record.streamUrl
        }
        return tempRecord
      },
      priceFormatter(cents) {
        return '$' + cents/100
      },
      arrCount(arr) {
        return arr.length
      },
      winners(id) {
        this.$router.push('/games/winners/' + id)
      }
    }
  }
</script>

<style scoped>
  .fa-th {
    color: dodgerblue;
  }
</style>
