import { queryBars } from "../interfaces/bars.js"

let storeConfig = {
    state: {
        bars: []
    },
    getters: {
        getBars(state){
            return state.bars
        }
    },
    mutations:{
        setBars(state, bars){
            state.bars = bars
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