<template>
  <crud-table
    url="/admin/donations"
    name="Donations"
    :fields="fields"
    :show-edit-button="false"
    :show-delete-button="false"
    :show-add-button="false"
    :export-format="exportFormat"
  >
  </crud-table>
</template>

<script>
  import CrudTable from '@/views/crud/CRUDTable'

  export default {
    name: "Donations",
    components: {
      CrudTable
    },
    computed: {

    },
    data() {
      return {
        fields: [
          {
            key: 'userID.name',
            label: "Name",
            type: 'embedded'
          },
          {
            key: 'userID._id',
            sortable: true,
            label: "User ID",
            type: 'embedded'
          },
          {
            key: 'amount',
            label: "Amount ($)",
            type: 'number',
            formatter: value => {
              return value / 100;
            }
          },
          {
            key: 'tiles',
            label: 'Selected Tiles',
            type: 'number',
            formatter: tilesArray => {
              return tilesArray.toString()
            }
          },
          {
            key: 'date',
            label: 'Date',
            type: 'date',
            sortable: true,
            formatter: date => {
              let dateObject = new Date(Date.parse(date));
              return dateObject.toLocaleString();
            }
          },
        ],
        exportFormat : {
          'Donation ID' : '_id',
          'Date' : 'date',
          'Donation Amount (Cents)' : 'amount',
          'Selected Tiles' : 'tiles',
          'Game Name' : 'gameID.name',
          'User Name' : 'userID.name',
          'User Email' : 'userID.email',
          'User Phone' : 'userID.phone',
          'Organization Name' : 'gameID.name',
        }
      }
    },
    methods: {
    },
  }
</script>
