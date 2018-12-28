<template>
    <div class="app-conatiner">
        <div class="left-container">
            <div class="baidumap-conatiner">
                <baidumap ref="baidumap"></baidumap>
            </div>
            <div class="records-conatiner">
                <records></records>
            </div>
            <div class="time-selector-conatiner">
                <timeselecter :startTime="1475251200000" :endTime="1482768000000" :minTime="24 * 3600 * 1000"></timeselecter>
            </div>
        </div>
        <div class="center-container">
            <div class="controler" style="flex: 6">
                <button @click="startSelect" style="padding:0 11.5px;">选择</button>
                <button @click="clearSelect">清除选择</button>
                <button :class="{'active':activeType==='BARS'}" class="group1" @click="updateMapType('BARS')" style="padding:0 11px;">网吧</button>
                <button :class="{'active':activeType==='INTERNET_RECORD'}" @click="updateMapType('INTERNET_RECORD')">上网记录</button>
                
                <button class="group2" @click="downloadData">下载数据</button>

                <button class="group2" :class="{'active':type===0}" @click="updateType(0)">全部</button>
                <button :class="{'active':type===1}" @click="updateType(1)">未成年</button>
                <button :class="{'active':type===2}" @click="updateType(2)">流动人口</button>
            </div>
            <div style="flex: 4">
                <button :class="{'active':timeInterval === 24 * 3600}" @click="selelctShowTimeTnterval(24 * 3600)">1D</button>
                <button :class="{'active':timeInterval === 12 * 3600}" @click="selelctShowTimeTnterval(12 * 3600)">12H</button>
                <button :class="{'active':timeInterval === 6 * 3600}" @click="selelctShowTimeTnterval(6 * 3600)">6H</button>
                <button :class="{'active':timeInterval === 3 * 3600}" @click="selelctShowTimeTnterval(3 * 3600)">3H</button>
                <button :class="{'active':timeInterval === 3600}" @click="selelctShowTimeTnterval(3600)">1H</button>
            </div>
        </div>
        <div class="right-container">
            <div class="bars-conatiner">
                <div class="list-container">
                    <barsList></barsList>
                </div>
                <div class="statistics-container">
                    <barsStatistics></barsStatistics>
                </div>
            </div>
            <div class="others-conatiner">
                <div class="person-time-heatmap" >
                    <personHeatmap></personHeatmap>
                </div>
                <!-- <div style="width: 20px"></div> -->
                <div class="person-from-heatmap">
                    <personFromMap></personFromMap>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import eventBus from "./components/eventbus.js"

import baidumap from "./components/map.vue"
import records from "./components/records.vue"
import timeselecter from "./components/timeselecter.vue"
import personHeatmap from "./components/person-heatmap.vue"
import personFromMap from "./components/person-from-map.vue"
import barsList from "./components/bars-list.vue"
import barsStatistics from "./components/bars-statistics.vue"

import { exportData } from "./interfaces/bars.js"

export default {
    data(){
        return {
            activeType: "BARS"
        }
    },
    computed: {
        timeInterval(){
            return this.$store.getters.timeInterval
        },
        type(){
            return this.$store.getters.type
        }
    },
    methods: {
        startSelect(){
            this.$refs.baidumap.startSelect()
        },
        clearSelect(){
            this.$refs.baidumap.clearSelect()
        },
        updateMapType(type){
            this.activeType = type
            this.$refs.baidumap.updateType(type)
        },
        updateType(type){
            this.$store.commit("setType", type)
        },
        downloadData(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)
            let barIds = this.$store.getters.selectedBars.map(bar => bar.id).join(",")

            exportData({
                startTime: startTime,
                endTime: endTime,
                ageTime: ageTime,
                barIds: barIds
            })
        },
        selelctShowTimeTnterval(time){
            this.$store.commit("setTimeInterval", time)
        }
    },
    components: {
        baidumap,
        records,
        timeselecter,
        personHeatmap,
        personFromMap,
        barsList,
        barsStatistics
    }
}
</script>

<style lang="scss" scoped>
.app-conatiner{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    overflow: hidden;

    .left-container{
        flex: 1;
        display: flex;
        flex-direction: column;

        div{
            position:relative;
            width: 100%; 

        }

        .baidumap-conatiner{
            flex: 6;
            display: flex;
        }

        .records-conatiner{
            flex: 4;
            background-color: #404A59;
        }

        .time-selector-conatiner{
            height: 32px;
        }
    }

    .center-container{
        width: 50px;
        display: flex;
        flex-direction: column;
        
        .group1,.group2{
            margin-top: 15px;
        }
    }
   
    
    .right-container{
        flex: 1;
        display: flex;
        flex-direction: column;
        

        .bars-conatiner{
            position: relative;
            flex: 6;
            display: flex;

            .list-container, .statistics-container{
                position: relative;
            }

            .list-container{
                width: 150px;
            }

            .statistics-container{
                flex: 1;

            }
        }

        .others-conatiner{
            position: relative;
            flex: 4;
            display: flex;
            height: 286px;

            .person-time-heatmap, .person-from-heatmap{
                flex: 1;
                position: relative;
                
            }
        }

        .controler-conatiner{
            height: 50px;
        }
    }
}

button{
    background-color:  #404a59;
    border: none;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    font-family: '微软雅黑';
    color:#F5F5F5;
    outline: none;
    cursor: pointer;

    &.active{
        background-color: #23262D;
        border: 1px solid #fff;
        border-left: none; 
    }
}
</style>
