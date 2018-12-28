<template>
    <div class="bars-list-container">
        <div class="list-title">网吧列表
        </div>
        <div class="list-title">
            <select v-model="sortType" class="list-select">
                <option value="COUNT">数量</option>
                <option value="UNDER">未成年</option>
                <option value="UNDERP">未成年比例</option>
            </select>
            <!-- <button style="float: right" @click="changeSortType">{{sortType === "COUNT" ? "数量" : "未成年"}}</button> -->
        </div>
        <div class="list-content">
            <div class="bar-item" v-for="bar in bars" :class="{warning: bar.under_age_count > 0}" :key="bar.id" @click="selectBar(bar)">
                {{bar.name}}
                <span v-if="sortType === 'COUNT'" style="float: right">{{bar.count}}</span>
                <span v-if="sortType === 'UNDER'" style="float: right">{{bar.under_age_count}}</span>
                <span v-if="sortType === 'UNDERP'" style="float: right">{{bar.p}}</span>
            </div>
        </div>
    </div>
</template>

<script>

import eventBus from "./eventbus.js"
import { queryBarsInfo } from "../interfaces/bars.js"

export default {
    data(){
        return {
            bars: [],
            sortType: "COUNT"
        }
    },
    computed: {
        barsMap(){
            return this.$store.getters.barsMap
        }
    },
    watch: {
        sortType(nv){
            this.changeSortType()
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.update)
        eventBus.$on("selectedBarsUpdate", this.update)
        eventBus.$on("ageInternetTimeRangeUpdate", this.update)
        eventBus.$on("singleBarUpdate", this.update)
        eventBus.$on("typeUpdate", this.update)

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
            let type = this.$store.getters.type

            queryBarsInfo({
                startTime,
                endTime,
                ageTime,
                type
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
                    data.p = (data.under_age_count / data.count * 100).toFixed(2)
                })
                this.bars = barsdata 
                this.changeSortType()
            })
        },
        changeSortType(){
            this.bars.sort((a, b) => {
                if (a.count === b.count){
                    return a.id - b.id
                } else {
                    if (this.sortType === "COUNT"){
                        return b.count - a.count
                    } else if (this.sortType === "UNDER") {
                        return b.under_age_count - a.under_age_count
                    } else {
                        return b.p - a.p
                    }
                }
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
    position: relative;
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

        &.warning{
            background: #dd6b66;
            color: white;

            &:hover{
                background: darken(#dd6b66, 20%);
            }
        }
    }
}

.list-select{
    position: absolute;
    display: block;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;

    color: #fff;
    background: rgb(35, 38, 45);
    border: 0;
}
</style>

