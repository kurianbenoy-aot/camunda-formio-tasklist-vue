<template>
    <div>
      <b-row>
        <b-col cols="10">
          <b-form-input
            type="text"
            class="cft-filter"
            placeholder="Filter Tasks"
            @click="cftshowSearchList"
            size="sm"
          />
        </b-col>
        <b-col cols="2">
          {{ tasklength }}
        </b-col>
      </b-row>
      <b-list-group v-if="showSearchList" class="cft-search-items">
        <b-list-group-item
          button
          v-for="(s, idx) in searchListElements"
          :key="s.label"
          @click="
            addSearchElementItem(s);
            setActiveSearchItem(idx);
          "
          :class="{ 'cft-search-item-selected': idx == activeSearchItem }"
        >
          {{ s.label }}
        </b-list-group-item>
      </b-list-group>
      <span v-if="isVariableTypeInSelectedSearchQuery">
        <span>
      <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="variablesEndType"
        name="flavour-2"
      >
        <span class="cft-name-value-container">For Variables, ignore case of
        <b-form-checkbox value="variableNamesIgnoreCase" @change="callTaskVariablesEndApi">name</b-form-checkbox>
        <b-form-checkbox value="variableValuesIgnoreCase" @change="callTaskVariablesEndApi">value.</b-form-checkbox>
        </span>
      </b-form-checkbox-group>
        </span>
      </span>
    </div>
</template>

<script lang="ts">
// import Vue from 'vue'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
export default class TaskListSearchInput extends Vue{


  @Prop({}) private tasklength!: number;
  @Prop({}) private selectedSearchQueries !: any;
  @Prop({}) private operator !: Array<string>;
  @Prop({}) private showSearchs !: Array<string>;
  @Prop({}) private showUpdatesearch !: Array<boolean>;
  @Prop({}) private showSearchQueryOperators !: Array<boolean>;
  @Prop({}) private showVariableValue !: Array<string>;

  private activeSearchItem = 0;
  private isVariableTypeInSelectedSearchQuery = false;
  private showSearchList = false;


  setActiveSearchItem(index: number) {
    this.activeSearchItem = index;
  }

  cftshowSearchList() {
    this.showSearchList = !this.showSearchList;
  }

  addToSelectedSearchQuery(item: any) {
    this.selectedSearchQueries.push(item);
    if (this.selectedSearchQueries === []) {
      this.operator[0] = item["compares"][0];
      this.showSearchs[0] = "a";
      this.showUpdatesearch[0] = false;
      this.showSearchQueryOperators[0] = false;
      if(item.type==="variables"){
        this.showVariableValue[0] = "a";
        // this.isVariableTypeInSelectedSearchQuery = true;
      }
    } 
    else {
      this.operator[this.selectedSearchQueries.length - 1] = item["compares"][0];
      this.showSearchs[this.selectedSearchQueries.length - 1] = "a";
      this.showUpdatesearch[this.selectedSearchQueries.length - 1] = false;
      this.showSearchQueryOperators[this.selectedSearchQueries.length - 1] = false;
      if(item.type==="variables"){
        this.showVariableValue[this.selectedSearchQueries.length - 1] = 'a';
        // this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
    this.showSearchList = false;
  }

callTaskVariablesEndApi() {
    this.queryList['variableNamesIgnoreCase'] = false;
    this.queryList['variableValuesIgnoreCase'] = false;
    
    for(const variablevalue in this.variablesEndType) {
      this.queryList[this.variablesEndType[variablevalue]] = true;
      this.updateTasklistResult()
    }
    //on changing to false also updating values required
  }

    
}
</script>