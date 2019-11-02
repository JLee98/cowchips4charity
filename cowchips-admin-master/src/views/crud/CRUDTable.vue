<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <transition name="slide">
          <b-card>
            <template slot="header">
              <b-row>
                <b-col>{{ this.$props.name }}</b-col>
                <b-col>
                  <b-button-group style="float:right">
                    <b-btn v-if="showAddButton" id="add-new" variant="success" @click="showCreateModal" >Add New</b-btn>
                    <b-btn id="download-button" variant="primary">
                      <download-excel :fetch="fetchExcelData" :fields="exportFormat">Export to Excel</download-excel>
                    </b-btn>
                  </b-button-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                <b-form-group class="mt-1">
                  <b-input-group>
                    <b-dropdown
                      id="tempDropdown"
                      v-model="selectedField"
                      text="Select field to search"
                    >
                      <template slot="button-content" v-if="selectedField !== null">
                        {{selectedField.label}}
                      </template>
                      <b-dropdown-item
                        v-for="field in fields"
                        :key="field.key"
                        v-if="field.label !== 'Actions' && field.label !== 'Organizations Count'"
                        @click="selectedField = field"
                      >{{ field.label }}</b-dropdown-item
                      >
                    </b-dropdown>
                    <b-form-input
                      v-model="filter"
                      placeholder="Type to Search"
                      :state="searchError"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-btn @click="search">Search</b-btn>
                      <b-btn @click="resetSearch">Reset Search</b-btn>
                    </b-input-group-append>
                    <b-form-invalid-feedback>
                      Please select a field
                    </b-form-invalid-feedback>
                  </b-input-group>
                </b-form-group>
                </b-col>
              </b-row>
            </template>
            <b-table
              striped
              bordered
              responsive="sm"
              :items="items"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
            >
              <template slot="actions" slot-scope="data">
                <slot name="additional-actions" :data="data"></slot>
                <i
                  v-if="showEditButton"
                  class="fa fa-edit"
                  @click="handleEditButtonClick(data.item._id)"
                ></i>
                <i
                  v-if="showDeleteButton"
                  class="fa fa-trash"
                  @click="showDeleteModal(data.item._id)"
                ></i>
              </template>
            </b-table>
            <nav>
              <b-pagination
                size="sm"
                :total-rows="maxPages"
                @change="pageChange"
                :per-page="1"
                v-model="currentPage"
                prev-text="Prev"
                next-text="Next"
                hide-goto-end-buttons
              ></b-pagination>
            </nav>
          </b-card>
        </transition>
      </b-col>
    </b-row>

    <b-modal
      ref="update"
      id="updateModal"
      @ok.prevent="onEditSubmit"
      :ok-disabled="$v.updateRecord.$invalid"
    >
      <b-alert v-if="updateError != null" show variant="danger">{{
        updateError
      }}</b-alert>
      <b-form>
        <slot name="update-form" :$v="$v" :updateRecord="updateRecord"></slot>
      </b-form>
      <template slot="modal-ok">
        Save
      </template>
    </b-modal>

    <b-modal
      ref="create"
      id="createModal"
      @ok.prevent="onCreateSubmit"
      :ok-disabled="$v.createRecord.$invalid"
    >
      <b-alert v-if="createError != null" show variant="danger">{{
        createError
      }}</b-alert>
      <b-form>
        <slot name="create-form" :$v="$v" :createRecord="createRecord"></slot>
      </b-form>
      <template slot="modal-ok">
        Save
      </template>
    </b-modal>

    <b-modal ref="deleteUser" id="deleteModal" @ok.prevent="deleteRecord()">
      <b-alert v-if="deleteError != null" show variant="danger">{{
        deleteError
      }}</b-alert>
      Are you sure that you want to delete this record?
      <template slot="modal-ok">
        Yes
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import axios from "axios";
import path from "path";
import Vue from "vue";

// TODO mask inputs

export default {
  name: "CRUDTable",
  props: {
    // The backend route that CRUD operations are exposed at.
    url: {
      type: String,
      required: true
    },
    // Fields array for the CRUD table documentation can be found here: https://bootstrap-vue.js.org/docs/components/table/#field-definition-reference
    fields: {
      type: Array,
      required: true
    },
    // Name of the CRUD table
    name: {
      type: String,
      required: true
    },
    // Function that runs before a record is updated that will do any transforms that are required
    updateTransform: {
      type: Function
    },
    // Function that runs before a record is created that will do any transforms that are required
    createTransform: {
      type: Function
    },
    loadEditDataTransform: {
      type: Function,
      required: false,
      default: data => {
        return data;
      }
    },
    // Validations object documentation can be found here: https://monterail.github.io/vuelidate/#sub-builtin-validators
    validations: {
      type: Object,
      default: () => {
        return {
          createRecord: {},
          updateRecord: {}
        };
      }
    },
    pagination: {
      type: Boolean,
      default: () => false
    },
    showEditButton: {
      type: Boolean,
      default: () => true
    },
    showDeleteButton: {
      type: Boolean,
      default: () => true
    },
    showAddButton: {
      type: Boolean,
      default: () => true
    },
    exportFormat: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getRecords();
  },
  data: () => {
    return {
      deleteId: null,
      createRecord: {},
      updateRecord: {},
      filter: null,
      items: [],
      updateError: null,
      deleteError: null,
      createError: null,
      currentPage: 1,
      searchObject: null,
      perPage: 0,
      maxPages: 10,
      selectedField: null,
      searchError: null,
    };
  },
  validations() {
    return this.validations;
  },
  methods: {
    getRowCount(items) {
      return items.length;
    },
    deleteRecord() {
      const id = this.deleteId;
      axios
        .delete(path.join(this.url, id))
        .then(() => {
          this.hideDeleteModal();
          this.deleteError = null;
          this.clearRecords();
          this.getRecords();
        })
        .catch(err => {
          this.deleteError = err.response;
        });
    },
    handleEditButtonClick(id) {
      this.updateError = null;
      this.clearRecords();
      this.updateRecord.id = id;
      this.fillEditForm();
      this.showUpdateModal();
    },
    onEditSubmit() {
      let finalUpdatedRecord;
      finalUpdatedRecord = this.updateTransform
        ? (finalUpdatedRecord = this.updateTransform(this.updateRecord))
        : (finalUpdatedRecord = this.updateRecord);

      axios
        .put(path.join(this.url, this.updateRecord._id), finalUpdatedRecord)
        .then(() => {
          this.updateError = null;
          this.hideUpdateModal();
          this.clearRecords();
          this.getRecords();
        })
        .catch(err => {
          this.updateError = err.response.data.error[0].message;
        });
    },
    onCreateSubmit() {
      let finalCreateRecord;
      finalCreateRecord = this.createTransform
        ? (finalCreateRecord = this.createTransform(this.createRecord))
        : (finalCreateRecord = this.createRecord);

      axios
        .post(this.url, finalCreateRecord)
        .then(() => {
          this.hideCreateModal();
          this.clearRecords();
          this.getRecords();
        })
        .catch(err => {
          this.createError = err.response.data.error[0].message;
        });
    },
    fillEditForm() {
      axios
        .get(path.join(this.url, this.updateRecord.id))
        .then(res => {
          this.updateRecord = this.loadEditDataTransform(res.data);
        })
        .catch(() => {
          this.updateError = "Error Retrieving Record";
        });
    },
    clearRecords() {
      this.deleteId = null;
      this.createRecord = {};
      this.updateRecord = {};

      if (this.$v.createRecord.$params) {
        Object.keys(this.$v.createRecord.$params).forEach(key => {
          Vue.set(this.createRecord, key, "");
        });
      }
    },
    showCreateModal() {
      this.clearRecords();
      this.createError = null;
      this.$refs.create.show();
    },
    showUpdateModal() {
      this.updateError = null;
      this.$refs.update.show();
    },
    showDeleteModal(id) {
      this.deleteError = null;
      this.clearRecords();
      this.deleteId = id;
      this.$refs.deleteUser.show();
    },
    hideCreateModal() {
      this.$refs.create.hide();
    },
    hideUpdateModal() {
      this.$refs.update.hide();
    },
    hideDeleteModal() {
      this.$refs.deleteUser.hide();
    },
    getRecords() {
      axios
        .get(this.url, {
          params: {
            populate: true,
            page: 1
          }
        })
        .then(res => {
          this.currentPage = 1
          this.items = res.data
          console.log(this.items)
          this.maxPages = res.headers.numpages;
        })
        .catch(err => console.error(err.response));
    },
    pageChange(page) {
      if (this.searchObject === null) {
        if (page <= this.maxPages) {
          axios.get(this.url, {
              params: {
                page: page,
                populate: true,
              }
            })
            .then(res => {
              this.items = res.data;
            })
            .catch(err => console.error(err.response));
        }
      } else {
        axios.post(path.join(this.url, 'search'), this.searchObject, {
            params: {
              page: page,
              populate: true,
            }
          })
          .then(res => {
            this.items = res.data;
          })
          .catch(err => console.error(err.response));
      }
    },
    resetSearch() {
      this.searchObject = null
      this.filter = ''
      this.selectedField = null
      this.searchError = null
      this.getRecords();
    },
    stringSearch() {
      this.searchObject = {
        [this.selectedField.key]: {
          $regex: this.filter,
          $options: 'i'
        }
      };
      axios.post(path.join(this.url, 'search'), this.searchObject, {
          params: {
            populate: true,
          }
        })
        .then(res => {
          this.items = res.data;
          this.maxPages = res.headers.numpages;
        })
        .catch(err => console.error(err.response));
    },
    dateSearch() {
      this.searchObject = {
        [this.selectedField.key]: {
          $gte: this.filter
        }
      };
      axios.post(path.join(this.url, 'search') + '?populate=true', this.searchObject)
        .then(res => {
          this.items = res.data;
          this.maxPages = res.headers.numpages;
        })
        .catch(err => console.error(err.response));
    },
    embeddedSearch() {
      let search = this.selectedField.key.substr(this.selectedField.key.indexOf('.') + 1)

      if(search !== '_id') {
        this.searchObject = {
          path: 'userID',
          match: {
            [search]: {
              $regex: this.filter,
              $options: 'i'
            }
          }
        };
      }
      else {
        this.searchObject = {
          path: 'userID',
          match: {
            [search]: this.filter
          }
        };
      }
      axios.post(path.join(this.url, 'search'), this.searchObject, {
        params: {
          populate: true,
        }
      })
        .then(res => {
          this.items = res.data;
          this.maxPages = res.headers.numpages;
        })
        .catch(err => console.error(err.response));
    },
    numberSearch() {
      if(this.selectedField.key === 'amount' || this.selectedField.key === 'price') {// This is a money search and must be converted from dollars to cents
        this.searchObject = {
          [this.selectedField.key]: parseFloat(this.filter) * 100
        };
      }
      else {
        this.searchObject = {
          [this.selectedField.key]: this.filter
        };
      }
      axios.post(path.join(this.url, 'search'), this.searchObject, {
        params: {
          populate: true,
        }
      })
        .then(res => {
          this.items = res.data;
          this.maxPages = res.headers.numpages;
        })
        .catch(err => console.error(err.response));
    },
    search() {
      if (this.selectedField !== null) {
        this.searchError = null
        if (this.selectedField.type === 'embedded') {
          this.embeddedSearch()
        } else if (this.selectedField.type === 'date') { // If we are working with a time or date
          this.dateSearch()
        } else if (this.selectedField.type === 'string') {
          this.stringSearch()
        } else if (this.selectedField.type === 'number') {
          this.numberSearch()
        }
      }
      else {
        this.searchError = false;
      }
    },
    async fetchExcelData() {
      if(this.maxPages !== undefined) { // If there has not been a search get all of the items
        let response = await axios.get(this.url, {
          params: {
            populate: true,
          }
        })
        let tempData = response.data
        return tempData
      }
      else {
        return this.items
      }
    },
  }
};
</script>

<style>
i {
  padding-right: 0.5em;
  cursor: pointer;
}
.fa-trash {
  color: red;
}
.fa-edit {
  color: darkorange;
}
</style>
