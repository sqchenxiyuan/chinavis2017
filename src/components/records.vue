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
        eventBus.$on("timeIntervalUpdate", this.somethingsUpdate)
        eventBus.$on("typeUpdate", this.somethingsUpdate)

        this.initData()
        this.somethingsUpdate()
    },
    methods: {
        initData(recordData){
            let myChart = echarts.init(this.$refs.records, "dark")
            let option = {
                tooltip: {
                    trigger: "axis",
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    top: "10%",
                    containLabel: true,
                },
                legend: {
                    data: ["上网总量", "未成年上网数"],
                    textStyle: {
                        color: "#fff"
                    }
                },
                dataZoom: [      
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
                            type: "solid",
                            color: "#fff", //左边线的颜色
                            width: "1"//坐标线的宽度
                        }
                    },
                },
                yAxis: [
                    {
                        name: "上网总量",
                        type: "value",
                        axisLine: {
                            lineStyle: {
                                type: "solid",
                                color: "#fff",
                                width: "1"
                            }
                        },
                    },
                    {
                        name: "未成年上网数",
                        type: "value",
                        axisLine: {
                            lineStyle: {
                                type: "solid",
                                color: "#fff",
                                width: "1"
                            }
                        },
                    }
                ],
                series: [
                    {
                        name: "上网总量",
                        type: "line",
                        smooth: true,
                        yAxisIndex: 0,
                        data: []
                    },
                    {
                        name: "未成年上网数",
                        type: "line",
                        smooth: true,
                        yAxisIndex: 1,
                        lineStyle: {
                            color: "#50a3ba"
                        },
                        data: []
                    },
                ]
            }
            myChart.setOption(option)

            myChart.on("brushselected", e => {
                console.log(e)
                this.selelctedTime(e.batch[0].selected[0].dataIndex)
            })

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
                        data: recordData.map(record => record.count)
                    },
                    {
                        data: recordData.map(record => record.unadult_count)
                    }
                ]
            })
        },
        somethingsUpdate(){
            let range = this.$store.getters.timeRange
            let startTime = Math.floor(range.startTime / 1000)
            let endTime = Math.floor(range.endTime / 1000)
            let interval = this.$store.getters.timeInterval
            let bars = this.$store.getters.getBars
            let selelctedBars = this.$store.getters.selectedBars
            if (bars.length === selelctedBars.length){
                selelctedBars = undefined
            } else {
                selelctedBars = selelctedBars.map(bar => bar.id).join(",")
            }

            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)
            let type = this.$store.getters.type

            querySurfTheInternetRecords({
                startTime: startTime,
                endTime: endTime,
                interval: interval,
                barIds: selelctedBars,
                ageTime: ageTime,
                type
            }).then(res => {
                let recordData = res.data
                this.updateData(recordData)
            })
        },
        selelctedTime(dataIndex){
            console.log(dataIndex)
        }
    }
}
</script>

