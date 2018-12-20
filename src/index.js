import "./styles/common.scss"
// import "script-loader!echarts/dist/echarts.min.js"
// import "script-loader!echarts-bmap/dist/echarts-bmap.js"
import echarts from "echarts"
import "echarts/extension/bmap/bmap.js"

import Vue from "vue"

import Vuex from "vuex"
Vue.use(Vuex)

import storeConfig from "./store/index.js"
let store = new Vuex.Store(storeConfig)

//热力图
import App from "./app.vue"
store.dispatch("init").then(_ => {
    new Vue(Object.assign(App, {
        store
    })).$mount("#app")
})