import { queryBars } from "../interfaces/bars.js"
import eventBus from "../components/eventbus.js"

let storeConfig = {
    state: {
        bars: [],
        
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
        selectedBars(state){
            if (state.selectedBars.length === 0){
                return state.bars
            }
            return state.selectedBars
        },
        timeRange(state){
            return state.timeRange
        }
    },
    mutations: {
        setBars(state, bars){
            state.bars = bars
        },
        setSelectedBars(state, bars){
            state.selectedBars = bars
            state.bus.$emit("selectedBarsUpdate")
        },
        setTimeRange(state, range){
            state.timeRange = range
            state.bus.$emit("timeRangeUpdate")
        },
        setAgeInternetTimeRange(state, range){
            state.ageInternetTimeRange = range
            state.bus.$emit("ageInternetTimeRangeUpdate")
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