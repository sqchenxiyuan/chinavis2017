<template>
    <div class="bars-list-container">
        <div class="list-title">网吧列表</div>
        <div class="list-content">
            <div class="bar-item" v-for="bar in bars" :key="bar.id" @click="selectBar(bar)">{{bar.name}}</div>
        </div>
    </div>
</template>

<script>

import eventBus from "./eventbus.js"
import { queryBarsInfo } from "../interfaces/bars.js"

export default {
    data(){
        return {
            bars: []
        }
    },
    computed: {
        barsMap(){
            return this.$store.getters.barsMap
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.update)
        eventBus.$on("selectedBarsUpdate", this.update)
        eventBus.$on("ageInternetTimeRangeUpdate", this.update)
        eventBus.$on("singleBarUpdate", this.update)

        this.update()
    },
    methods: {
        selectBar(bar){
            this.$store.commit("setSingleBar", bar)
        },
        update(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)

            queryBarsInfo({
                startTime,
                endTime,
                ageTime
            }).then(res => {
                let barsdata = res.data
                barsdata = barsdata.filter(data => data.count > 0)
                barsdata.forEach(data => {
                    if (this.barsMap[data.barId]){
                        data.name = this.barsMap[data.barId].name
                    } else {
                        data.name = "未知网吧"
                    }
                    data.id = data.barId
                })
                barsdata.sort((a, b) => {
                    return a.id - b.id
                })
                this.bars = barsdata 
            })
        }
    },
}
</script>

<style lang="scss">
.bars-list-container{
    box-sizing: border-box;
    position:absolute; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height:100%;

    border: 1px solid black;
    display: flex;
    flex-direction: column;
}

.list-title{
    color: #F5F5F5;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    border: 1px solid black;
}

.list-content{
    flex:1;
    overflow: auto;

    .bar-item{
        color:  #999;
        font-size: 12px;
        padding-top: 10px;
        &:hover{
            cursor: pointer;
            background: black;
            color: white;
        }
    }
}
</style>

