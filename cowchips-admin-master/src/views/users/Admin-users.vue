<template>
  <crud-table
    url="/admin/admins"
    name="Admin Users"
    :fields="fields"
    :updateTransform="updateTransform"
    :create-transform="createTransform"
    :export-format="exportFormat"
  >
      <template slot="update-form" slot-scope="slotProps">
        <b-form-group label="Name">
          <b-form-input id="update-name" v-model="slotProps.updateRecord.name"></b-form-input>
        </b-form-group>
        <b-form-group label="New Password">
          <b-form-input type="password" id="update-password" v-model="slotProps.updateRecord.password" placeholder="Leave blank to keep the same password"></b-form-input>
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
          <b-form-input  id="create-email" v-model="slotProps.createRecord.email"></b-form-input>
        </b-form-group>
        <b-form-group label="Password">
          <b-form-input type="password" id="create-password" v-model="slotProps.createRecord.password"></b-form-input>
        </b-form-group>
    </template>
  </crud-table>
</template>

<script>
  import CrudTable from '@/views/crud/CRUDTable'

  export default {
    name: "Admin-Users",
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
            sortable: true,
          },
          {
            key: 'email',
            label: 'Email',
            type: 'string',
          },
          {
            key: 'actions',
            label: 'Actions'
          }
        ],
        exportFormat: {
          'Admin Name' : 'name',
          'ID' : '_id',
          'Email' : 'email',
        }
      }
    },
    methods: {
      updateTransform(record) {
        let transformedRecord = (record.password === undefined) ?
          { name: record.name, } :
          { name: record.name, password: record.password,}
        return transformedRecord
      },
      createTransform(record) {
        let transformedRecord = {
          name: record.name,
          password: record.password,
          email: record.email,
          permissions: 1
        }
        return transformedRecord
      }
    }
  }
</script>

<style>

</style>
