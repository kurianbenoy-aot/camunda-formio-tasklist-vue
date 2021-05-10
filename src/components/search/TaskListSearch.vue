<template>
  <div class="cft-input-search-filter">
    <b-col
      class="cft-filter-container"
      xl="12"
      lg="12"
      md="12"
      sm="12"
    >

      <div v-if="selectedSearchQueries.length">
        <TaskListSearchType/>
        {{selectedSearchQueries}}
        <div
          class="cftf-search-item-box mr-2"
          v-for="(query, index) in selectedSearchQueries"
          :key="query.label + index"
        >
          <b-row>
            <b-col cols="1">
              <i class="fa fa-times cftf-x" @click="deleteSearchQueryElement(query,index)"></i>
            </b-col>
            <b-col cols="5" sm="5">
              <b-nav-item-dropdown :text=query.label title="type">
                <b-dropdown-item-button
                  v-for="updateSearch in searchListElements"
                  :key="updateSearch.label"
                  href="#"
                  @click="updateSearchQueryElement(updateSearch, index)"
                >
                  {{updateSearch.label}}
                </b-dropdown-item-button>
              </b-nav-item-dropdown>
            </b-col>
            <span v-if="query.type === 'variables'"> 
              <span>: </span>     
              <span
                v-if="showVariableValue[index] === 'a'"
                @click="updatevariableinput(index)"
              > ??
              </span>
              <span v-if="showVariableValue[index]==='i'">
                <span class="cft-variable-box">
                <span
                  @click="showVariableValueItem(index)"
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box" @click="showVariableValueItem(index)"></i
                ></span>
                <b-row align-h="end">
                  <b-col cols="8" class="cft-search-variable-input">
                <b-form-input
                  v-model="searchVariableValue[index]"
                  v-on:keyup.enter="showVariableValueItem(index)"
                />
                  </b-col>
                </b-row>
              </span>
              </span>
              <span
                class="cft-search-cursor"
                v-if="showVariableValue[index] === 's'&&query.type === 'variables'"
                @click="updatevariableinput(index)"
              >
                {{ searchVariableValue[index] }}
              </span>
          </b-row>
          <b-row>
            <b-col cols="2">
              <b-nav-item-dropdown :text="query.operator">
                <b-dropdown-item-button
                v-for="x in query.compares"
                :key="x"
                href="#"
                @click="updateSearchQueryOperators(x, index)"
                v-model="query.operator"
                >
                {{x}}
                </b-dropdown-item-button>
              </b-nav-item-dropdown>
            </b-col>
            <div class="cft-rhs-container">
              <span
                v-if="showSearchs[index] === 'a'"
                @click="updatesearchinput(index)"
                class="cft-search-cursor"
              >
                ??</span
              >
              <span v-if="showSearchs[index] === 'i' &&query.type==='date'">
                <b-form-datepicker
                size="sm"
                v-model="setDate[index]"
                @input="
                  setSearchQueryValue(setDate[index], query, index); 
                  showsearchValueItem(index); 
                "
                >
                </b-form-datepicker>
              </span>
              <span v-if="showSearchs[index] === 's'&& query.type ==='date'" @click="updatesearchinput(index)">
                {{formatDate(query.name)}}
              </span>
              <span v-if="showSearchs[index] === 'i' && query.type !=='date'">
              <span class="cft-icon-actions">
                <span @click="
                    setSearchQueryValue(searchValueItem[index], query, index);
                    showsearchValueItem(index);
                  "
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box" @click="showsearchValueItem(index)"></i
              ></span>
              <b-form-input
                v-model="searchValueItem[index]"
                v-on:keyup.enter="
                  setSearchQueryValue(searchValueItem[index], query, index);
                  showsearchValueItem(index);
                "
              />
              </span>
              <span
                v-if="showSearchs[index] === 's' && query.type !=='date'"
                @click="updatesearchinput(index)"
              >
                {{ query.name }}
              </span>
            </div>
          </b-row>
        </div>
      </div>
      <TaskListAddSearchIgnoreCase
        :queryList="queryList"
        :tasklength="tasklength"
        :isVariableTypeInSelectedSearchQuery="isVariableTypeInSelectedSearchQuery"
        :searchListElements="searchListElements"
        @add-to-selected-search-query="addToSelectedSearchQuery"
      />
    </b-col>
  </div>
</template>

<script lang="ts">
import '../../styles/camundaFormIOTasklistSearch.scss'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { 
  FilterSearchTypes,
  getDeletedVariableIndex,
  getVariableOperator,
  searchValueObject,
  taskSearchFilters,
} from "../../services/search-constants";
import {getFormattedDateAndTime, getISODateTime} from '../../services/format-time';
import TaskListAddSearchIgnoreCase from './TaskListAddSearchIgnoreCase.vue';
import TaskListSearchType from './TaskListSearchType.vue';
import vSelect from 'vue-select'

@Component({
  components: {
    TaskListAddSearchIgnoreCase,
    TaskListSearchType,
    vSelect
  }
})
export default class TaskListSearch extends Vue {
  @Prop({}) private tasklength!: number;

  private searchListElements: any = taskSearchFilters;
  // private searchLabels: any = (Object.values(taskSearchFilters).map((values: any) => values.label));
  private queryType = "ALL";
  private selectedSearchQueries: any = [];
  private setUpdatesearchindex = 0;
  private searchValueItem: any = [];
  private searchVariableValue: any = [];
  // private operator: Array<string> = [];
  private showSearchs: Array<string> = []; //3 states - a, i, s
  private showVariableValue: Array<string> = [];
  private queryList: any = {
    "taskVariables": [],
    "processVariables": []
  };
  private isVariableTypeInSelectedSearchQuery = false;
  private setDate: Array<string> = [];


  updatesearchinput(index: number) {
    this.searchValueItem[index] = '';
    Vue.set(this.showSearchs, index, "i");
  }

  showsearchValueItem(index: number) {
    Vue.set(this.showSearchs, index, "s");
  }

  makeInputNull(index: number) {
    Vue.set(this.showSearchs, index, "a");
  }

  updatevariableinput(index: number) {
    this.searchVariableValue[index] = '';
    Vue.set(this.showVariableValue, index, "i");
  }

  showVariableValueItem(index: number) {
    Vue.set(this.showVariableValue, index, "s")
  }

  formatDate(date: Date) {
    return getFormattedDateAndTime(date);
  }

  addToSelectedSearchQuery(item: any) {
    this.selectedSearchQueries.push(item);
    if (this.selectedSearchQueries === []) {
      this.selectedSearchQueries[0]["operator"] = item["compares"][0]
      this.showSearchs[0] = "a";
      this.showVariableValue[0] = "a";
      if(item.type==="variables"){
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    } 
    else {
      this.selectedSearchQueries[this.selectedSearchQueries.length - 1]["operator"] = item["compares"][0]
      this.showSearchs[this.selectedSearchQueries.length - 1] = "a";
      this.showVariableValue[this.selectedSearchQueries.length - 1] = "a";
      if(item.type==="variables"){
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
  }

  deleteSearchQueryElement(query: any, index: number) {
    if(query.type==='variables'){
      this.queryList = getDeletedVariableIndex(query, this.selectedSearchQueries, this.selectedSearchQueries[index]["key"], this.queryList);
    }
    else {
      delete this.queryList[
        searchValueObject(this.selectedSearchQueries[index].key, this.selectedSearchQueries[index].operator)
      ];
    }
    this.selectedSearchQueries.splice(index, 1);

    this.isVariableTypeInSelectedSearchQuery = false;
    for (const idx in this.selectedSearchQueries) {
      if(this.selectedSearchQueries[idx]["type"]=== "variables") {
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
    this.updateTasklistResult()
  }

  updateSearchQueryElement(searchitem: any, index: number) {
    searchitem.name = this.selectedSearchQueries[index].name;
    if(this.selectedSearchQueries[index].type==='variables'){
      searchitem["variable"] = this.selectedSearchQueries[index].variable;
      this.queryList = getDeletedVariableIndex(
        this.selectedSearchQueries[index],
        this.selectedSearchQueries,
        this.selectedSearchQueries[index]["key"],
        this.queryList)
      ;
    }
    else {
      delete this.queryList[
        searchValueObject(this.selectedSearchQueries[index].key, this.selectedSearchQueries[index].operator)
      ];
    }
    Vue.set(this.selectedSearchQueries, index, searchitem);
    this.selectedSearchQueries[index].operator = searchitem["compares"][0];
    this.setSearchQueryValue(this.searchValueItem[index], this.selectedSearchQueries[index], index);
    this.searchListElements = taskSearchFilters;
  }

  updateSearchQueryOperators(item: any, index: number) {
    Vue.set(this.selectedSearchQueries[index].operator, index, item);
    // this.selectedSearchQueries[index].operator = operator;
    delete this.queryList[
      searchValueObject(this.selectedSearchQueries[index].key, this.selectedSearchQueries[index].operator)
    ];
    console.log("update search query", this.selectedSearchQueries)
    if(this.selectedSearchQueries[index].name !== '') {
      this.setSearchQueryValue(this.selectedSearchQueries[index].name, this.selectedSearchQueries[index], index);
    }
    // this.operator[index] = operator;
    // console.warn('entered operator update-> operator value->', operator)
    // console.warn('value of selected search query', this.selectedSearchQueries[index])
    // console.warn('date value in index->',index, this.searchValueItem[index])
    // if(this.selectedSearchQueries[index].type==='date'){
    //   this.setSearchQueryValue(this.setDate[index], this.selectedSearchQueries[index], this.operator[index], index);
    // }
    // else{
    //   this.setSearchQueryValue(this.searchValueItem[index], this.selectedSearchQueries[index], this.operator[index], index);
    // }
  }

  // updateSearchQueryOperators(operator: any, index: number) {
  //   delete this.queryList[
  //     searchValueObject(this.selectedSearchQueries[index].key, this.selectedSearchQueries[index].operator)
  //   ];
  //   this.selectedSearchQueries[index]["operator"] = operator;
  //   // this.operator[index] = operator;
  //   if(this.selectedSearchQueries[index].type==='date'){
  //     this.setSearchQueryValue(
  //       this.setDate[index],
  //       this.selectedSearchQueries[index],
  //       index
  //     );
  //   }
  //   else{
  //     this.setSearchQueryValue(
  //       this.searchValueItem[index],
  //       this.selectedSearchQueries[index],
  //       index);
  //   }
  // }


  setSearchQueryValue(item: any, query: any, idx: number) {
    const Vindex = searchValueObject(this.selectedSearchQueries[idx].key, this.selectedSearchQueries[idx].operator);
    this.selectedSearchQueries[idx]["name"] = item;
    switch(query.type) {
    case FilterSearchTypes.VARIABLES: {
      this.selectedSearchQueries[idx]["name"] = this.searchVariableValue[idx];
      this.selectedSearchQueries[idx]["variable"] = this.searchValueItem[idx];
      if(this.searchValueItem[idx] && this.searchVariableValue[idx]){
        this.queryList[query.key].push({
          "name": this.searchVariableValue[idx],
          "operator": getVariableOperator(item.operator),
          "value": this.searchValueItem[idx]
        })
        this.updateTasklistResult();
      }
      break;
    }
    case FilterSearchTypes.DATE: {
      this.queryList[Vindex] = getISODateTime(item);
      this.updateTasklistResult();
      break;
    }
    case FilterSearchTypes.STRING:
    case FilterSearchTypes.NORMAL:{
      if (item.operator === "like") {
        this.queryList[Vindex] = "%" + item + "%";
      } else {
        this.queryList[Vindex] = item;
      }
      this.updateTasklistResult();
      break;
    }
    default:
    }
  }

  @Emit('update-task-list')
  updateTasklistResult(){
    if(this.queryType === "ALL") {
      return this.queryList
    }
    else {
      return {orQueries: [this.queryList]}
    }
  }

  mounted() {
    this.updateTasklistResult();
    
    this.$root.$on('call-updateSearchQueryType', (para: any) => {
      this.queryType = para.queryType;
      this.updateTasklistResult();
    })

    this.$root.$on('call-updateTaskList', (para: any) => {
      this.queryList = para.queryList;
      this.updateTasklistResult();
    })
  }

  beforeDestroy() {
    this.$root.$off('call-updateSearchQueryType');
    this.$root.$off('call-updateTaskList');
  }
}
</script>
