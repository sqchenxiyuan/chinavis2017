<template>
    <div style="position:absolute; top: 0; left: 0; width: 100%; height:100%;">
        <div ref="map" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;"></div>
        <div v-show="selecting" style="cursor: crosshair;z-index: 10;position:absolute; top: 0; left: 0; width: 100%; height:100%;" @mousedown="go2select"></div>
        <div ref="search">
            <input v-model="searchValue"></input>
            <button @click="searchPOI">搜索</button>
        </div>
    </div>
</template>

<script>
import echarts from "echarts"
import styleJson from "../utils/custom_map_config.json"

import eventBus from "./eventbus.js"
import { queryBarsInfo } from "../interfaces/bars.js"

export default {
    data(){
        return {
            myChart: null,
            bmap: null,
            startCenter: null,
            selectPolygons: [],
            selecting: false,

            type: "BARS",

            searchValue: "",
            searchHandle: null
        }
    },
    computed: {
        bars(){
            return this.$store.getters.getBars
        }
    },
    watch: {
        type(nv, ov){
            if (nv != ov){
                this.updateChart()
            }
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.updateChart)
        eventBus.$on("selectedBarsUpdate", this.updateChart)
        eventBus.$on("ageInternetTimeRangeUpdate", this.updateChart)

        this.initChart()
        this.updateChart()
    },
    methods: {
        initChart(){
            let myChart = echarts.init(this.$refs.map)

            let option = {
                bmap: {
                    center: [106.55, 29.57],
                    zoom: 8,
                    roam: true,
                    mapStyle: {
                        styleJson: styleJson
                    }
                },
                visualMap: {
                    show: false,
                    top: "top",
                    min: 0,
                    max: 3,
                    seriesIndex: 0,
                    calculable: true,
                    inRange: {
                        color: ["blue", "blue", "green", "yellow", "red"]
                    },
                },
                series: [
                    {
                        type: "heatmap",
                        coordinateSystem: "bmap",
                        data: [],
                        pointSize: 3,
                        blurSize: 6
                    }, 
                    // {
                    //     type: "scatter",
                    //     coordinateSystem: "bmap",
                    //     data: data,
                    //     pointSize: 3,
                    //     blurSize: 6,
                    //     itemStyle: {
                    //         color: "purple"
                    //     }
                    // }
                ]
            }
            myChart.setOption(option)

            let bmap = myChart.getModel().getComponent("bmap").getBMap()
            bmap.addControl(new BMap.MapTypeControl({
                mapTypes: []
            }))

            bmap.setMinZoom(7)

            let navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
            })
            bmap.addControl(navigationControl)

            //搜索控件
            function SearchControl(){
                // 默认停靠位置和偏移量
                this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT
                this.defaultOffset = new BMap.Size(10, 10)
            }
            SearchControl.prototype = new BMap.Control()
            SearchControl.prototype.initialize = map => {
                map.getContainer().appendChild(this.$refs.search)
                return this.$refs.search
            }
            let searchControl = new SearchControl()
            bmap.addControl(searchControl)
            searchControl.setOffset(new BMap.Size(60, 10))

            let searchHandle = new BMap.LocalSearch(bmap, {
                renderOptions: {map: bmap}
            })
            this.searchHandle = searchHandle



            
            this.startCenter = bmap.pointToOverlayPixel(bmap.getCenter())
            this.bmap = bmap
            this.myChart = myChart
        },
        updateType(type){
            this.type = type
        },
        updateChart(){
            let myChart = this.myChart

            if (this.type === "INTERNET_RECORD"){
                return this.updateInternetRecordMap()
            }

            if (this.type === "FLOAT_PERSON"){
                return this.updateFloatPersonMap()
            }

            if (this.type === "UNDER_AGE"){
                return this.updateUnderAgeMap()
            }

            let bars = this.bars
            let data = bars.map(bar => {
                return [bar.longitude, bar.latitude, 1]  
            })

            myChart.setOption({
                visualMap: {
                    min: 0,
                    max: 3,
                },
                series: [
                    {
                        data: data
                    }
                ]
            })
        },
        updateInternetRecordMap(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)

            queryBarsInfo({
                startTime,
                endTime,
                ageTime
            }).then(res => {
                let myChart = this.myChart
                let data = res.data
                let barMap = this.$store.getters.barsMap

                let all = 0

                data = data.map(barData => {
                    let bar = barMap[barData.barId]
                    all += barData.count
                    return [bar.longitude, bar.latitude, barData.count]
                })

                myChart.setOption({
                    visualMap: {
                        min: 0,
                        max: all / data.length * 1.5,
                    },
                    series: [
                        {
                            data: data
                        }
                    ]
                })
            })
        },
        updateFloatPersonMap(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)

            queryBarsInfo({
                startTime,
                endTime,
                ageTime
            }).then(res => {
                let myChart = this.myChart
                let data = res.data
                let barMap = this.$store.getters.barsMap

                let all = 0

                data = data.map(barData => {
                    let bar = barMap[barData.barId]
                    all += barData.float_count
                    return [bar.longitude, bar.latitude, barData.float_count]
                })

                myChart.setOption({
                    visualMap: {
                        min: 0,
                        max: all / data.length * 1.5,
                    },
                    series: [
                        {
                            data: data
                        }
                    ]
                })
            })
        },
        updateUnderAgeMap(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)

            queryBarsInfo({
                startTime,
                endTime,
                ageTime
            }).then(res => {
                let myChart = this.myChart
                let data = res.data
                let barMap = this.$store.getters.barsMap

                let all = 0

                data = data.map(barData => {
                    let bar = barMap[barData.barId]
                    all += barData.under_age_count
                    return [bar.longitude, bar.latitude, barData.under_age_count]
                })

                myChart.setOption({
                    visualMap: {
                        min: 0,
                        max: all / data.length * 1.5,
                    },
                    series: [
                        {
                            data: data
                        }
                    ]
                })
            })
        },
        startSelect(){
            this.selecting = true
        },
        clearSelect(){
            let bmap = this.bmap
            this.selectPolygons.forEach(polygon => bmap.removeOverlay(polygon))
            this.selectPolygons = []
            this.selelctOver()
        },
        go2select(e){
            let div = e.target
            let bmap = this.bmap

            let polygons = this.selectPolygons
            let startCenter = this.startCenter

            let Polygon = new BMap.Polygon()
            polygons.push(Polygon)
            let path = []
            path.push(getPointByxy(e.clientX, e.clientY))
            Polygon.setPath(path)
            bmap.addOverlay(Polygon)

            let mouseMove = e => {
                path.push(getPointByxy(e.clientX, e.clientY))
                Polygon.setPath(path)
            }

            let mouseUp = e => {
                path.push(getPointByxy(e.clientX, e.clientY))
                div.removeEventListener("mousemove", mouseMove)
                div.removeEventListener("mouseup", mouseUp)
                Polygon.setPath(path)
                this.selelctOver()
                this.selecting = false
            }

            function getPointByxy(x, y){
                let rect = div.getBoundingClientRect()
                let nowCenter = bmap.pointToOverlayPixel(bmap.getCenter())
                let point = bmap.overlayPixelToPoint(new BMap.Pixel(x + nowCenter.x - startCenter.x, y + nowCenter.y - startCenter.y))
                return point
            }

            div.addEventListener("mousemove", mouseMove)
            div.addEventListener("mouseup", mouseUp)
        },
        selelctOver(){
            let polygons = this.selectPolygons
            let bars = this.bars
            bars = bars.filter(bar => {
                return polygons.some(p => BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(bar.longitude, bar.latitude), p))
            })
            this.$store.commit("setSelectedBars", bars)
        },
        searchPOI(){
            let bmap = this.bmap
            this.searchHandle.search(this.searchValue)
        }
    }
}
</script>

