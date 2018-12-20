<template>
    <div style="position:absolute; top: 0; left: 0; width: 100%; height:100%;">
        <div ref="map" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;"></div>
        <div v-show="selecting" style="cursor: crosshair;z-index: 10;position:absolute; top: 0; left: 0; width: 100%; height:100%;" @mousedown="go2select"></div>
    </div>
</template>

<script>
import echarts from "echarts"
import styleJson from "../utils/custom_map_config.json"

export default {
    data(){
        return {
            myChart: null,
            bmap: null,
            startCenter: null,
            selectPolygons: [],
            selecting: false,
        }
    },
    computed:{
        bars(){
            return this.$store.getters.getBars
        }
    },
    mounted(){
        let myChart = echarts.init(this.$refs.map)
        this.initAsHeatmap(myChart, [106.55, 29.57], 8)
        this.myChart = myChart
    },
    methods: {
        initAsHeatmap(myChart, center = [106.55, 29.57], zoom = 8){
            let bars = this.bars
            let data = bars.map(bar => {
                return [bar.longitude, bar.latitude, 1]  
            })
            let options = {
                animation: false,
                bmap: {
                    center: center,
                    zoom: zoom,
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
                    }
                },
                series: [
                    {
                        type: "heatmap",
                        coordinateSystem: "bmap",
                        data: data,
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
            myChart.setOption(options)
            let bmap = myChart.getModel().getComponent("bmap").getBMap()
            bmap.addControl(new BMap.MapTypeControl({
                mapTypes: []
            }))
            this.startCenter = bmap.pointToOverlayPixel(bmap.getCenter())
            this.bmap = bmap
        },
        startSelect(){
            this.selecting = true
        },
        clearSelect(){
            let bmap = this.bmap
            this.selectPolygons.forEach(polygon => bmap.removeOverlay(polygon))
            this.selectPolygons = []
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
            let data = bars.filter(bar => {
                return polygons.some(p => BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(bar.longitude, bar.latitude), p))
            })
            console.log(data)
        }
    }
}
</script>

