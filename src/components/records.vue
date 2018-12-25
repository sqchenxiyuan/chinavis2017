<template>
    <div ref="records" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;"></div>
</template>

<script>
import echarts from "echarts"
import moment from "moment"
import eventBus from "./eventbus.js"

import { querySurfTheInternetRecords } from "../interfaces/bars.js"

export default {
    data(){
        return {
            myChart: null,
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.somethingsUpdate)
        eventBus.$on("selectedBarsUpdate", this.somethingsUpdate)
        eventBus.$on("ageInternetTimeRangeUpdate", this.somethingsUpdate)

        this.initData()
        this.somethingsUpdate()
    },
    methods: {
        initData(recordData){
            let myChart = echarts.init(this.$refs.records)
            let option = {
                tooltip: {
                    trigger: "axis"
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    top: "10%",
                    containLabel: true,
                },
                brush: {
                    toolbox: ["lineX", "keep", "clear"],
                    xAxisIndex: 0
                },
                dataZoom: [
                    // {
                    //     show: true,
                    //     realtime: true,
                    //     start: 0,
                    //     end: 100
                    // },
                    {
                        type: "inside",
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        animation: false,
                        label: {
                            backgroundColor: "#505765"
                        }
                    }
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [],
                    axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#fff',//左边线的颜色
                        width:'1'//坐标线的宽度
                    }
                },
                },
                yAxis: {
                    type: "value",
                    axisLine: {
                    lineStyle: {
                       type: 'solid',
                       color:'#fff',
                       width:'1'
                   }
               },
                },
                series: [
                    {
                        type: "line",
                        smooth: true,
                        data: []
                    }
                ]
            }
            myChart.setOption(option)

            this.myChart = myChart
        },
        updateData(recordData){
            let myChart = this.myChart
            myChart.setOption({
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100
                    },
                    {
                        type: "inside",
                        realtime: true,
                        start: 0,
                        end: 100
                    }
                ],
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: recordData.map(record => moment((record.startTime + record.endTime) / 2 * 1000).format("YYYY-MM-DD HH:mm:ss dddd"))
                },
                series: [
                    {
                        type: "line",
                        smooth: true,
                        data: recordData.map(record => record.count)
                    }
                ]
            })
        },
        somethingsUpdate(){
            let range = this.$store.getters.timeRange
            let startTime = Math.floor(range.startTime / 1000)
            let endTime = Math.floor(range.endTime / 1000)
            let interval = 24 * 3600
            
            let timeWidth = endTime - startTime
            let safeWidth = timeWidth / 40
            if (safeWidth > 3600){
                interval = Math.ceil(safeWidth / 3600) * 3600
            } else if (safeWidth > 60){
                interval = Math.ceil(safeWidth / 60) * 60
            }

            let bars = this.$store.getters.getBars
            let selelctedBars = this.$store.getters.selectedBars
            if (bars.length === selelctedBars.length){
                selelctedBars = undefined
            } else {
                selelctedBars = selelctedBars.map(bar => bar.id).join(",")
            }

            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)

            querySurfTheInternetRecords({
                startTime: startTime,
                endTime: endTime,
                interval: interval,
                barIds: selelctedBars,
                ageTime: ageTime
            }).then(res => {
                let recordData = res.data
                this.updateData(recordData)
            })
        },
    }
}
</script>

