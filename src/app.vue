<template>
    <div>
        <div style="display:flex">
            <div>
                <div id="container" style="position:relative; display: inline-block; width: 600px; height: 50vh;">
                    <baidumap ref="baidumap"></baidumap>
                </div>
                <button id="select" @click="startSelect">选择</button>
                <button id="select-clear" @click="clearSelect">清除选择</button>
            </div>
            <div style="position:relative; display: inline-block; width: 600px; height: 50vh;">
                <personHeatmap></personHeatmap>
            </div>
        </div>
       
        <div style="display:flex">
             <div style="position:relative; width: 600px; height: 50vh;">
                <records></records>
            </div>
            <div style="position:relative; width: 600px; height: 50vh;">
                <personFromMap></personFromMap>
            </div>
        </div>
        <div style="position:relative; display: inline-block; width: 600px; height: 50px;">
            <timeselecter :startTime="1475251200000" :endTime="1482768000000" :minTime="24 * 3600 * 1000" @update="updateTime"></timeselecter>
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