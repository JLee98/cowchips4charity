<template>
  <crud-table url="/admin/organizations"
              name="Organizations"
              :fields="fields"
              :updateTransform="updateTransform"
              :export-format="exportFormat">

    <template slot="update-form" slot-scope="slotProps">
      <b-form-group label="Name">
        <b-form-input id="update-name" v-model="slotProps.updateRecord.name"></b-form-input>
      </b-form-group>
      <b-form-group label="Abbreviation">
        <b-form-input id="update-abbreviations" v-model="slotProps.updateRecord.abbreviation"></b-form-input>
      </b-form-group>
      <b-form-group label="Photo">
        <b-form-input id="update-photo" v-model="slotProps.updateRecord.photo"></b-form-input>
      </b-form-group>
      <b-form-group label="Email">
        <b-form-input id="update-email" v-model="slotProps.updateRecord.email"></b-form-input>
      </b-form-group>
    </template>

    <template slot="create-form" slot-scope="slotProps">
      <b-form-group label="Name">
        <b-form-input id="create-name" v-model="slotProps.createRecord.name"></b-form-input>
      </b-form-group>
      <b-form-group label="Email">
        <b-form-input id="create-email" v-model="slotProps.createRecord.email"></b-form-input>
      </b-form-group>
      <b-form-group label="Abbreviation">
        <b-form-input id="create-abbreviation" v-model="slotProps.createRecord.abbreviation"></b-form-input>
      </b-form-group>
      <b-form-group label="Photo">
        <b-form-input id="create-photo" v-model="slotProps.createRecord.photo"></b-form-input>
      </b-form-group>
    </template>

    <template slot="additional-actions" slot-scope="slotProps">
      <i class="fa fa-line-chart" @click="goToAnalytics(slotProps.data.item._id)" title="View Analytics"></i>
    </template>

  </crud-table>
</template>

<script>
  import CrudTable from '@/views/crud/CRUDTable'

  export default {
    name: "Organizations",
    components: {
      CrudTable
    },
    data() {
      return {
        fields: [
          {
            key: 'name',
            sortable: true,
            label: 'Name',
            type: 'string'
          },
          {
            key: 'email',
            label: 'Email',
            type: 'string',
          },
          {
            key: 'abbreviation',
            label: 'Abbreviation',
            type: 'string',
          },
          {
            key: 'photo',
            label: 'Photo',
            type: 'string',
          },
          {
            key: 'actions',
            label: 'Actions',
          }
        ],
        uploadedFile: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos',
        exportFormat: {
          'Organization Name' : 'name',
          'Organization ID' : '_id',
          'Abbreviation' : 'abbreviation',
          'Email' : 'email',
          'Photo' : 'photo',
        }
      }
    },
    methods: {
      updateTransform(record) {
        let transformedRecord = {
          name: record.name,
          email: record.email,
          abbreviation: record.abbreviation,
          photo: record.photo,
        }
        return transformedRecord
      },
      goToAnalytics(id) {
        console.log('goToAnalytics for game:' + id)
        this.$router.push('/organizations/analytics/' + id)
      },

    },
  }
</script>
