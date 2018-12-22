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


        bus: eventBus
    },
    getters: {
        getBars(state){
            return state.bars
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
                return res.data.bars
            })
            return commit("setBars", bars)
        }
    }
}

export default storeConfig