import { queryBars } from "../interfaces/bars.js"
import eventBus from "../components/eventbus.js"

let storeConfig = {
    state: {
        bars: [],
        
        type: 0,
        timeInterval: 24 * 3600, //时间间隔
        singleBar: null,
        selectedBars: [],
        timeRange: {
            startTime: 1475251200000,
            endTime: 1482768000000
        },
        ageInternetTimeRange: [],


        bus: eventBus
    },
    getters: {
        getBars(state){
            return state.bars
        },
        barsMap(state){
            let bars = state.bars
            let map = {}
            bars.forEach(bar => map[bar.id] = bar)
            return map
        },
        singleBar(state){
            return state.singleBar
        },
        selectedBars(state){
            return state.selectedBars
        },
        timeRange(state){
            return state.timeRange
        },
        ageTimeRange(state){
            return state.ageInternetTimeRange
        },
        timeInterval(state){
            return state.timeInterval
        },
        type(state){
            return state.type
        }
    },
    mutations: {
        setBars(state, bars){
            state.bars = bars
        },
        setSingleBar(state, bar){
            state.singleBar = bar
            state.bus.$emit("singleBarUpdate")
        },
        setSelectedBars(state, bars){
            state.singleBar = null
            state.selectedBars = bars
            state.bus.$emit("selectedBarsUpdate")
        },
        setTimeRange(state, range){
            state.singleBar = null
            state.timeRange = range
            state.bus.$emit("timeRangeUpdate")
        },
        setAgeInternetTimeRange(state, range){
            state.singleBar = null
            state.ageInternetTimeRange = range
            state.bus.$emit("ageInternetTimeRangeUpdate")
        },
        setTimeInterval(state, interval){
            state.timeInterval = interval
            state.bus.$emit("timeIntervalUpdate")
        },
        setType(state, type){
            state.type = type
            state.bus.$emit("typeUpdate")
        }
    },
    actions: {
        init({dispatch}){
            return dispatch("loadBars")
        },
        async loadBars({commit}){
            let bars = await queryBars({
                limit: 10000
            }).then(res => {
                return res.data
            })
            return commit("setBars", bars)
        }
    }
}

export default storeConfig