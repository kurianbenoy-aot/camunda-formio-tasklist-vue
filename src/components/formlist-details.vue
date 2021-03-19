<template>
  <div>
    <Form src="testUrl">
    </Form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'vue-formio';
@Component({
  components: {
    Form
  }
})
export default class FormDetails extends Vue{
    
  private formioUrl: any = ''
  private testUrl = ''
  
  mounted() {
    this.formioUrl = localStorage.getItem('formioApiUrl') + '/form/';
    this.testUrl = this.formioUrl.concat(this.$route.params.fId);
  }
}
</script>