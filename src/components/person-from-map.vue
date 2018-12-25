<template>
    <div ref="person-from-map" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;background-color:#404A59;margin-left:20px;"></div>
</template>

<script>
import echarts from "echarts"

import eventBus from "./eventbus.js"
import { queryProvinceUsercount } from "../interfaces/bars.js"

export default {
    data(){
        return {
            myChart: null
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.updateChart)
        eventBus.$on("selectedBarsUpdate", this.updateChart)
        eventBus.$on("ageInternetTimeRangeUpdate", this.updateChart)

        this.initData()
        this.updateChart()
    },
    methods: {
        initData(){
            let myChart = echarts.init(this.$refs["person-from-map"])
            let option = {
                backgroundColor: "#404a59",
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        return params.name + " : " + params.data.truevalue
                    }
                },
                legend: {
                    orient: "vertical",
                    y: "bottom",
                    x: "right",
                    data: ["pm2.5"],
                    textStyle: {
                        color: "#fff"
                    }
                },
                visualMap: {
                    min: 0,
                    max: 200,
                    calculable: false,
                    inRange: {
                        color: ["#50a3ba", "#eac736", "#d94e5d"]
                    },
                    textStyle: {
                        color: "#fff"
                    },
                    orient: "horizontal",
                    top: 10,
                    left: 10
                },
                geo: {
                    map: "china",
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#323c48",
                            borderColor: "#111"
                        },
                        emphasis: {
                            areaColor: "#2a333d"
                        }
                    }
                },
                series: [
                    {
                        type: "map",
                        mapType: "china",
                        coordinateSystem: "geo",
                        data: [],
                        symbolSize: 12,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                borderColor: "#fff",
                                borderWidth: 1
                            }
                        }
                    }
                ]
            }
            myChart.setOption(option)

            this.myChart = myChart
        },
        updateChart(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)
            let barIds = this.$store.getters.selectedBars.map(bar => bar.id).join(",")

            queryProvinceUsercount({
                startTime: startTime,
                endTime: endTime,
                ageTime: ageTime,
                barIds: barIds
            }).then(res => {
                let rdata = res.data
                let max = 0
                let min = Infinity
                let data = Object.keys(rdata).map(key => {
                    let log10count = Math.log(rdata[key] + 1) / Math.log(10)

                    if (max < log10count) max = Math.ceil(log10count)
                    if (min > log10count) min = Math.floor(log10count)

                    return {
                        name: key,
                        truevalue: rdata[key],
                        value: log10count
                    }
                })

                this.myChart.setOption({
                    
                    visualMap: {
                        min,
                        max,
                        text: [Math.pow(10, max), 0],
                    },
                    series: [{
                        data
                    }]
                })
            })
        }
    }
}
</script>

