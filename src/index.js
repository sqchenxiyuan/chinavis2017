import "./styles/common.scss"
// import * as d3 from "d3"
import styleJson from "./utils/custom_map_config.json"
let map = new BMap.Map("container", {
    // minZoom: 8,
    enableMapClick: false
})
let point = new BMap.Point(106.55, 29.57) 
map.centerAndZoom(point, 8)
map.enableScrollWheelZoom()
map.setMapStyleV2({styleJson: styleJson})

let districtLoading = 0
let blist = []
getBoundary()

function getBoundary() {   
    addDistrict("重庆市")
}

/**
 * 添加行政区划
 * @param {} districtName 行政区划名
 * @returns  无返回值
 */
function addDistrict(districtName) {
    //使用计数器来控制加载过程
    districtLoading++
    let bdary = new BMap.Boundary()
    bdary.get(districtName, function (rs) { //获取行政区域
        let count = rs.boundaries.length //行政区域的点有多少个
        console.log(count)
        if (count === 0) {
            alert("未能获取当前输入行政区域")
            return
        }
        for (let i = 0; i < count; i++) {
            blist.push({ points: rs.boundaries[i], name: districtName })
        };
        //加载完成区域点后计数器-1
        districtLoading--
        if (districtLoading == 0) {
            //全加载完成后画端点
            drawBoundary()
        }
    })
}

function drawBoundary() {
    //包含所有区域的点数组
    let pointArray = []
 
    /*画遮蔽层的相关方法
    *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
    *      这样就做出了一个经过多次西北角的闭合多边形*/
    //定义中国东南西北端点，作为第一层
    let pNW = { lat: 59.0, lng: 73.0 }
    let pNE = { lat: 59.0, lng: 136.0 }
    let pSE = { lat: 3.0, lng: 136.0 }
    let pSW = { lat: 3.0, lng: 73.0 }
    //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
    let pArray = []
    pArray.push(pNW)
    pArray.push(pSW)
    pArray.push(pSE)
    pArray.push(pNE)
    pArray.push(pNW)
    //循环添加各闭合区域
    for (let i = 0; i < blist.length; i++) {
        //添加显示用标签层
        let label = new BMap.Label(blist[i].name, { offset: new BMap.Size(20, -10) })
        label.hide()
        // map.addOverlay(label)
 
        //添加多边形层并显示
        let ply = new BMap.Polygon(blist[i].points, { strokeWeight: 3, strokeColor: "#FF0000", fillOpacity: 0.01, fillColor: " #FFFFFF" }) //建立多边形覆盖物
        ply.name = blist[i].name
        ply.label = label
        // map.addOverlay(ply)
 
        //添加名称标签层
        let centerlabel = new BMap.Label(blist[i].name, { offset: new BMap.Size(0, 0) })
        centerlabel.setPosition(ply.getBounds().getCenter())
        // map.addOverlay(centerlabel)
 
        //将点增加到视野范围内
        let path = ply.getPath()
        pointArray = pointArray.concat(path)

        //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
        pArray = pArray.concat(path)
        pArray.push(pArray[0])
    }
    map.setViewport(pointArray)

    //添加遮蔽层
    let plyall = new BMap.Polygon(pArray, { strokeOpacity: 0.0000001, strokeColor: "#000000", strokeWeight: 0.00001, fillColor: "#ffffff", fillOpacity: 0.9 }) //建立多边形覆盖物
    // map.addOverlay(plyall)
}






import { queryBars } from "./interfaces/bars.js"
//点聚合
// queryBars({
//     limit: 10000
// }).then(res => {
//     let bars = res.data.bars
//     console.log(bars.length)
//     let markers = bars.map(bar => {
//         let point = new BMap.Point(bar.longitude, bar.latitude)
//         return new BMap.Marker(point)    
//         // map.addOverlay(marker) 
//     })
//     //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
//     let markerClusterer = new BMapLib.MarkerClusterer(map, {markers: markers})
// })

//热力图
queryBars({
    limit: 10000
}).then(res => {
    let bars = res.data.bars
    let hotmap = new BMapLib.HeatmapOverlay({"radius":10, "visible":true, "opacity":70})
    map.addOverlay(hotmap)
    let data = bars.map(bar => {
        // let point = new BMap.Point(bar.longitude, bar.latitude)
        return {"lng":bar.longitude,"lat":bar.latitude,"count":1}  
        // map.addOverlay(marker) 
    })
    hotmap.setDataSet({
        data: data,
        max: 5
    })
    //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
    // let markerClusterer = new BMapLib.MarkerClusterer(map, {markers: markers})
})