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
            <div class="controler">
                <button @click="startSelect">选择</button>
                <button @click="clearSelect">清除选择</button>
                <button @click="updateMapType('BARS')">网吧</button>
                <button @click="updateMapType('INTERNET_RECORD')">上网记录</button>
                <button @click="updateMapType('FLOAT_PERSON')">流动人口</button>
                <button @click="updateMapType('UNDER_AGE')">未成年人口</button>
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
                <div class="person-from-heatmap">
                    <personFromMap></personFromMap>
                </div>
            </div>
            <div class="controler-conatiner">
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

export default {
    methods:{
        startSelect(){
            this.$refs.baidumap.startSelect()
        },
        clearSelect(){
            this.$refs.baidumap.clearSelect()
        },
        updateMapType(type){
            this.$refs.baidumap.updateType(type)
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
            margin-top: 20px;
        }

        .time-selector-conatiner{
            height: 40px;
        }
    }

    .center-container{
        width: 50px;
        
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
            margin-top: 30px;
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
</style>
