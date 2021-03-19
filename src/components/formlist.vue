<template>
  <b-container fluid>
    <h3 class="cftf-taskhead">Form</h3>
    <div class="overflow-auto">

      <!-- <b-table :items="formList" :fields="fields"
       head-variant="light" :bordered=true :outlined=true
       :current-page="currentPage" :per-page="perPage">
      </b-table> -->

      <b-table-simple hover small caption-top responsive :bordered=true :outlined=true
      :per-page="perPage">
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>Form</b-th>
            <b-th>Operations</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="form in formList" :key="form.formId">
            <b-th> {{form.formName}}</b-th>
            <b-th><b-button variant="primary"><i class="bi bi-pencil"></i> Submit New</b-button> </b-th>
          </b-tr>
        </b-tbody>
      </b-table-simple>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalrows"
        :per-page="perPage"
        aria-controls="form-table"
        ></b-pagination>

      <p> Current page is: {{currentPage}}</p>
    </div>
  </b-container>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../camundaFormIOTasklist.scss'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Component, Vue } from 'vue-property-decorator'
import { BootstrapVue } from 'bootstrap-vue'
import CamundaRest from '../services/camunda-rest'
import { Form } from 'vue-formio';

Vue.use(BootstrapVue)

@Component({
  components: {
    Form,
  }
})
export default class FormList extends Vue{
  private formList: Array<object> = []
  private actualFormNames = []
  private fields = [
    "formName",
    "Operations"
  ]
  private perPage = 10
  private currentPage = 1
  private formioUrl: any = ''

  get totalrows() {
    return this.formList.length;
  }

  mounted() {
    const token = localStorage.getItem('authToken')
    const bpmUrl = localStorage.getItem('bpmApiUrl')
    this.formioUrl = localStorage.getItem('formioApiUrl')
    CamundaRest.listForms(token, bpmUrl).then((response) =>
    {
      this.formList = response.data;
    });
  }
}
</script>