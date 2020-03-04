<template>
  <crud-table url="/admin/users"
              name="Users"
              :fields="fields"
              :updateTransform="updateTransform"
              :create-transform="createTransform"
              :load-edit-data-transform="loadEditDataTransform"
              :export-format="exportFormat">

    <template slot="update-form" slot-scope="slotProps">
      <b-form-group label="Name">
        <b-form-input id="update-name" v-model="slotProps.updateRecord.name"></b-form-input>
      </b-form-group>
      <b-form-group label="Phone">
        <b-form-input id="update-phone" v-model="slotProps.updateRecord.phone"></b-form-input>
      </b-form-group>
      <b-form-group label="Password">
        <b-form-input type="password" id="update-password" v-model="slotProps.updateRecord.password" placeholder="Leave blank to keep the same password"></b-form-input>
      </b-form-group>
      <b-form-group label="Address">
        <b-form-input id="update-address" v-model="slotProps.updateRecord.address"></b-form-input>
      </b-form-group>
      <b-form-group label="City">
        <b-form-input id="update-city" v-model="slotProps.updateRecord.city"></b-form-input>
      </b-form-group>
      <b-form-group label="State">
        <b-form-input id="update-state" v-model="slotProps.updateRecord.state"></b-form-input>
      </b-form-group>
      <b-form-group label="ZIP Code">
        <b-form-input id="update-zip" v-model="slotProps.updateRecord.zip"></b-form-input>
      </b-form-group>
      <b-form-group label="Email">
        <b-form-input id="update-email" v-model="slotProps.updateRecord.email" readonly></b-form-input>
      </b-form-group>
    </template>

    <template slot="create-form" slot-scope="slotProps">
      <b-form-group label="Name">
        <b-form-input id="create-name" v-model="slotProps.createRecord.name"></b-form-input>
      </b-form-group>
      <b-form-group label="Email">
        <b-form-input id="create-email" v-model="slotProps.createRecord.email"></b-form-input>
      </b-form-group>
      <b-form-group label="Phone">
        <b-form-input id="create-phone" v-model="slotProps.createRecord.phone"></b-form-input>
      </b-form-group>
      <b-form-group label="Password">
        <b-form-input type="password" id="create-password" v-model="slotProps.createRecord.password"></b-form-input>
      </b-form-group>
      <b-form-group label="Date of Birth">
        <date-picker name="date" v-model="slotProps.createRecord.dob" :config="datePickerOptions"></date-picker>
      </b-form-group>
      <b-form-group label="Address">
        <b-form-input id="create-address" v-model="slotProps.createRecord.address"></b-form-input>
      </b-form-group>
      <b-form-group label="City">
        <b-form-input id="create-city" v-model="slotProps.createRecord.city"></b-form-input>
      </b-form-group>
      <b-form-group label="State">
        <b-form-input id="create-state" v-model="slotProps.createRecord.state"></b-form-input>
      </b-form-group>
      <b-form-group label="ZIP Code">
        <b-form-input id="create-zip" v-model="slotProps.createRecord.zip"></b-form-input>
      </b-form-group>
    </template>
  </crud-table>
</template>

<script>
  import CrudTable from '@/views/crud/CRUDTable'

  export default {
    name: "Users",
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
            type: 'string',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'string',
          },
          {
            key: 'phone',
            label: 'Phone',
            type: 'string',
          },
          {
            key: 'actions',
            label: 'Actions'
          },
        ],
        datePickerOptions: {
          format: 'YYYY-MM-DD',
          useCurrent: false,
          showClear: true,
          showClose: true,
        },
        exportFormat: {
          'User ID': '_id',
          'Name': 'name',
          'Email': 'email',
          'Phone Number': 'phone',
          'DOB': 'dob',
          'Address': 'location.address',
          'City': 'location.city',
          'State': 'location.state',
          'Zip': 'location.zip',

        }
      }
    },
    methods: {
      updateTransform(record) {
        let transformedRecord = {}
        if (record.password !== undefined) {
          transformedRecord = {
            name: record.name,
            phone: record.phone,
            password: record.password,
          }
        }
        else {
          transformedRecord = {
            name: record.name,
            phone: record.phone,

          }
        }
        if (record.address !== undefined && record.city !== undefined && record.state !== undefined && record.zip !== undefined) {
          transformedRecord['location'] = {
            address: record.address,
            city: record.city,
            state: record.state,
            zip: record.zip,
          }
        }
        return transformedRecord
      },
      createTransform(record) {
        let createRecord = {
          name: record.name,
          password: record.password,
          email: record.email,
          dob: record.dob,
          phone: record.phone,
          location: {
            address: record.address,
            city: record.city,
            state: record.state,
            zip: record.zip,
          }
        };
        return createRecord
      },
      loadEditDataTransform(data) {
        let newRecord = {}
        if (data.location === undefined) {
          newRecord = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            _id: data._id,
            address: undefined,
            city: undefined,
            state: undefined,
            zip: undefined,
          }
        }
        else {
          newRecord = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            _id: data._id,
            address: data.location.address,
            city: data.location.city,
            state: data.location.state,
            zip: data.location.zip,
          }
        }
        return newRecord
      }
    },
  }
</script>
