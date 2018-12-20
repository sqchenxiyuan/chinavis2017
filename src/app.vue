<template>
    <div>
        <div>
            <div id="container" style="position:relative; display: inline-block; width: 600px; height: 50vh;">
                <baidumap ref="baidumap"></baidumap>
            </div>
            <button id="select" @click="startSelect">选择</button>
            <button id="select-clear" @click="clearSelect">清除选择</button>
        </div>
        <div style="position:relative; display: inline-block; width: 600px; height: 50vh;">
            <records></records>
        </div>
    </div>
</template>

<script>
import baidumap from "./components/map.vue"
import records from "./components/records.vue"

export default {
    methods:{
        startSelect(){
            this.$refs.baidumap.startSelect()
        },
        clearSelect(){
            this.$refs.baidumap.clearSelect()
        }
    },
    components:{
        baidumap,
        records
    }
}
</script>