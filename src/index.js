import "./styles/common.scss"
import * as d3 from "d3"
import styleJson from "./utils/custom_map_config.json"
let map = new BMap.Map("container")
let point = new BMap.Point(116.404, 39.915) 
map.centerAndZoom(point, 15)
map.enableScrollWheelZoom()
map.setMapStyleV2({styleJson: styleJson}) 
