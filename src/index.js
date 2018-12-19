import "./styles/common.scss"
// import "script-loader!echarts/dist/echarts.min.js"
// import "script-loader!echarts-bmap/dist/echarts-bmap.js"

//热力图
import { queryBars } from "./interfaces/bars.js"
import styleJson from "./utils/custom_map_config.json"
console.log(styleJson)

let globalBars = []

queryBars({
    limit: 10000
}).then(res => {
    let bars = res.data.bars
    globalBars = bars
    let data = bars.map(bar => {
        // let point = new BMap.Point(bar.longitude, bar.latitude)
        return [bar.longitude, bar.latitude, 1]  
        // map.addOverlay(marker) 
    })
    
    let div = document.createElement("div")
    div.style = "position:absolute;top:0;left:0;width:100%;height:100%"
    document.getElementById("container").appendChild(div)
    
    let myChart = echarts.init(div)
    initAsHeatmap(myChart, [106.55, 29.57], 8, data)

    // div = document.createElement("div")
    // div.style = "position:absolute;top:0;left:0;width:100%;height:100%"
    // document.getElementById("container").appendChild(div)
    
    // myChart = echarts.init(div)
    // initAsHeatmap(myChart, [106.55, 29.57], 8, data)

    // let bmap = myChart.getModel().getComponent("bmap").getBMap()
    // let lastZoom = 8

    // bmap.addEventListener("zoomend", function(data){
        
    //     let center = [bmap.getCenter().lng, bmap.getCenter().lat]
    //     let zoom = bmap.getZoom()
    //     console.log(zoom)
    //     if (bmap.getZoom() >= 14 && lastZoom < 14){
    //         myChart.clear()
            
    //         div.remove()

    //         div = document.createElement("div")
    //         div.style = "position:absolute;top:0;left:0;width:100%;height:100%"
    //         document.getElementById("container").appendChild(div)
            
    //         myChart = echarts.init(div)
    //         initAsHeatmap(myChart, center, zoom, data)
            
    //     } 
    //     // else if (bmap.getZoom() < 14 && lastZoom >= 14){
    //     //     options = {
    //     //         animation: false,
    //     //         bmap: {
    //     //             center: center,
    //     //             zoom: zoom,
    //     //             roam: true
    //     //         },
    //     //         visualMap: {
    //     //             show: false,
    //     //             top: "top",
    //     //             min: 0,
    //     //             max: 3,
    //     //             seriesIndex: 0,
    //     //             calculable: true,
    //     //             inRange: {
    //     //                 color: ["blue", "blue", "green", "yellow", "red"]
    //     //             }
    //     //         },
    //     //         series: [{
    //     //             type: "heatmap",
    //     //             coordinateSystem: "bmap",
    //     //             data: data,
    //     //             pointSize: 3,
    //     //             blurSize: 6
    //     //         }]
    //     //     }
    //     //     myChart.clear()
    //     //     // myChart.setOption(options)
    //     //     // bmap = myChart.getModel().getComponent("bmap").getBMap()
    //     //     // bmap.addControl(new BMap.MapTypeControl())
    //     // }
    //     lastZoom = zoom
    // })
})
function initAsHeatmap(myChart, center = [106.55, 29.57], zoom = 8, data){
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
        series: [{
            type: "heatmap",
            coordinateSystem: "bmap",
            data: data,
            pointSize: 3,
            blurSize: 6
        }, {
            type: "scatter",
            coordinateSystem: "bmap",
            data: data,
            pointSize: 3,
            blurSize: 6
        }]
    }
    myChart.setOption(options)
    console.log(2223)
    let bmap = myChart.getModel().getComponent("bmap").getBMap()
    bmap.addControl(new BMap.MapTypeControl({
        mapTypes: []
    }))

    
    let polygons = []
    let hoverdiv = document.createElement("div")
    let startCenter = bmap.pointToOverlayPixel(bmap.getCenter())
    hoverdiv.style = "position:absolute;top:0;left:0;width:100%;height:100%"

    let mouseDown = function(e){
        let Polygon = new BMap.Polygon()
        polygons.push(Polygon)
        let path = []
        path.push(getPointByxy(e.clientX, e.clientY))
        Polygon.setPath(path)
        bmap.addOverlay(Polygon)

        let mouseMove = function(e){
            path.push(getPointByxy(e.clientX, e.clientY))
            Polygon.setPath(path)
        }

        let mouseUp = function(e){
            path.push(getPointByxy(e.clientX, e.clientY))
            hoverdiv.removeEventListener("mousemove", mouseMove)
            hoverdiv.removeEventListener("mouseup", mouseUp)
            Polygon.setPath(path)
        }

        function getPointByxy(x, y){
            let rect = hoverdiv.getBoundingClientRect()
            let nowCenter = bmap.pointToOverlayPixel(bmap.getCenter())
            let point = bmap.overlayPixelToPoint(new BMap.Pixel(x + nowCenter.x - startCenter.x, y + nowCenter.y - startCenter.y))
            return point
        }

        hoverdiv.addEventListener("mousemove", mouseMove)
        hoverdiv.addEventListener("mouseup", mouseUp)
    }
    hoverdiv.addEventListener("mousedown", mouseDown)

    document.querySelector("#select").addEventListener("click", e => {
        document.getElementById("container").appendChild(hoverdiv)
    })

    document.querySelector("#select-close").addEventListener("click", e => {
        document.getElementById("container").removeChild(hoverdiv)
        console.log(polygons)
        data = globalBars.filter(bar => {
            return polygons.some(p => BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(bar.longitude, bar.latitude), p))
        })
        console.log(data)
    })

    document.querySelector("#select-clear").addEventListener("click", e => {
        polygons.forEach(polygon => bmap.removeOverlay(polygon))
        polygons = []
    })

    bmap.addEventListener("dragend", _ => {
        bmap.setCenter(bmap.getCenter())
        console.log(bmap.overlayPixelToPoint(new BMap.Pixel(0, 0)))
    })

    
}
