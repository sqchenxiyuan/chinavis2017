import "./styles/common.scss"

import moment from "moment"
import "moment/locale/zh-cn"

// import "script-loader!echarts/dist/echarts.min.js"
// import "script-loader!echarts-bmap/dist/echarts-bmap.js"
import echarts from "echarts"
import "echarts/extension/bmap/bmap.js"

import chinaMap from "echarts/map/json/china.json"
echarts.registerMap("china", chinaMap)

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