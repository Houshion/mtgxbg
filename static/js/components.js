import Vue from 'vue'
Vue.component('o-textarea', {
  props: [
      'value',
      'holder',
      'id',
      'cols',
      'rows',
    ],
  template: `
    <textarea
        v-bind:name="id ? id : 'content'"
        v-bind:id="id ? id : 'content'"
        v-bind:cols="cols ? cols : 30"
        v-bind:rows="rows ? rows : 10"
        v-bind:placeholder="holder"
        v-bind:value="value"
    >
    </textarea>
    `
})
