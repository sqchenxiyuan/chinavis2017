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
                <timeselecter :startTime="1475251200000" :endTime="1482768000000" :minTime="24 * 3600 * 1000" @update="updateTime"></timeselecter>
            </div>
        </div>
        <div class="center-container">
            <div class="controler">
                <button @click="startSelect">选择</button>
                <button @click="clearSelect">清除选择</button>
                <button>网吧</button>
                <button>上网记录</button>
                <button>流动人口</button>
            </div>
        </div>
        <div class="right-container">
            <div class="bars-conatiner">
                <div style="positon: absolute; top: 0; left: 0;width:100%;height: 100%; background: red"></div>
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

export default {
    methods:{
        startSelect(){
            this.$refs.baidumap.startSelect()
        },
        clearSelect(){
            this.$refs.baidumap.clearSelect()
        },
        updateTime(range){
            eventBus.$emit("timeRangeChange", range)
        }
    },
    components: {
        baidumap,
        records,
        timeselecter,
        personHeatmap,
        personFromMap
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
        }

        .time-selector-conatiner{
            height: 50px;
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
            flex: 6;
        }

        .others-conatiner{
            flex: 4;
            display: flex;

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
