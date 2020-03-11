<template>
  <crud-table
    :url=crudUrl
    name="Game Winners"
    :fields="fields"
    :export-format="exportFormat"
    :show-edit-button="false"
    :show-delete-button="false"
    :show-add-button="false"
    :pagination="false"
  >
  </crud-table>
</template>

<script>
  import CrudTable from '@/views/crud/CRUDTable'

  export default {
    name: "GameWinners",
    components: {
      CrudTable
    },
    data() {
      return {
        fields: [
          {
            key: 'userID.name',
            label: 'Name',
            type: 'string',
          },
          {
            key: 'userID.email',
            label: 'Email',
            type: 'string',
          },
          {
            key: 'userID.location.address',
            label: 'Address',
            type: 'string',
          },
          {
            key: 'userID.location.city',
            label: 'City',
            type: 'string',
          },
          {
            key: 'userID.location.state',
            label: 'State',
            type: 'string',
          },
          {
            key: 'userID.location.zip',
            label: 'Zip',
            type: 'string',
          },
        ],
        exportFormat: {
          'Name' : 'userID.name',
          'Email' : 'userID.email',
          'Address' : 'userID.location.address',
          'City' : 'userID.location.city',
          'State' : 'userID.location.state',
          'Zip' : 'userID.location.zip',
        }
      }
    },
    computed: {
      gameId() {
        return this.$route.params.id
      },
      crudUrl() {
        return '/admin/games/' + this.gameId + '/winners'
      }
    }
  }
</script>

<style scoped>

</style>
