<template>
    <div class="bars-statistic-container">
        <div ref="time" class="internet-time-distribution"></div>
        <div class="others">
            <div ref="age" class="age-distribution"></div>
            <div ref="from" class="from-distribution"></div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts"

import eventBus from "./eventbus.js"

import { queryAgeCount, queryInternetTimeDistribution, queryProvinceUsercount } from "../interfaces/bars.js"

export default {
    data(){
        return {
            ageChart: null,
            fromChart: null
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.update)
        eventBus.$on("selectedBarsUpdate", this.update)
        eventBus.$on("ageInternetTimeRangeUpdate", this.update)
        eventBus.$on("singleBarUpdate", this.update)

        this.initChart()
        this.update()
    },
    methods: {
        initChart(){
            this.initTimeChart()
            this.initAgeChart()
            this.initFromChart()
        },
        initTimeChart(){
            let timeChart = echarts.init(this.$refs.time)

            let hours = ["0", "1", "2", "3", "4", "5", "6",
                "7", "8", "9", "10", "11", "12", 
                "13", "14", "15", "16", "17",
                "18", "19", "20", "21", "22", "23"]
            let days = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]

            let option = {
                tooltip: {
                    formatter: function (params) {
                        return params.value[2] + " commits in " + hours[params.value[1]] + " of " + days[params.value[0]]
                    },
                },
                xAxis: {
                    type: "category",
                    data: hours,
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#fff",
                            type: "dashed",
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel:{
                        color:'#fff'
                    }
                },
                brush: {
                    toolbox: ["polygon", "lineX", "lineY", "keep", "clear"],
                    throttleType: "debounce",
                    throttleDelay: 700,
                },
                yAxis: {
                    type: "category",
                    data: days,
                    axisLine: {
                        show: false
                    },
                    axisLabel:{
                        color:'#fff',
                        fontSize:'12px'
                    }
                },
                series: [{
                    type: "scatter",
                    symbolSize: function (val) {
                        return Math.log(val[2]) / Math.log(10)
                    },
                    data: [],
                    animationDelay: function (idx) {
                        return idx * 5
                    }
                }],

            }
            timeChart.setOption(option)
            
            this.timeChart = timeChart
        },
        updateTimeChart(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)
            let barIds = this.$store.getters.selectedBars.map(bar => bar.id).join(",")
            if (this.$store.getters.singleBar) barIds = this.$store.getters.singleBar.id

            let range = this.$store.getters.timeRange
            queryInternetTimeDistribution({
                startTime: startTime,
                endTime: endTime,
                ageTime: ageTime,
                barIds: barIds
            }).then(res => {
                let rawdata = res.data
                let data = []

                let min = Infinity
                let max = 0

                for (let i = 0; i < 7; i++){
                    for (let j = 0; j < 24; j++){
                        data.push([i, j, rawdata[i * 24 + j]])
                        if (max < rawdata[i * 24 + j]){
                            max = rawdata[i * 24 + j]
                        }

                        if (min > rawdata[i * 24 + j]){
                            min = rawdata[i * 24 + j]
                        }
                    }
                }
                data = data.map(function (item) {
                    return [item[1], item[0], item[2]]
                })

                let secondData = [
                    {value: 0, name: "未成年"},
                    {value: 0, name: "成年人"},
                    {value: 0, name: "老年人"},
                ]

                let option = {
                    series: [
                        {
                            data: data,
                            symbolSize: function (val) {
                                let data = val[2]
                                let p = (data - min) / (max - min)
                                return p * 10
                            },
                        }
                    ],
                }

                this.timeChart.setOption(option)
            })
        },
        initAgeChart(){
            let ageChart = echarts.init(this.$refs.age)
            let option = {
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        type: "pie",
                        radius: ["50%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: []
                    },
                    {
                        type: "pie",
                        radius: ["0%", "32%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: []
                    }
                ]
            }
            ageChart.setOption(option)
            this.ageChart = ageChart
        },
        updateAgeChart(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)
            let barIds = this.$store.getters.selectedBars.map(bar => bar.id).join(",")
            if (this.$store.getters.singleBar) barIds = this.$store.getters.singleBar.id

            queryAgeCount({
                startTime: startTime,
                endTime: endTime,
                ageTime: ageTime,
                barIds: barIds
            }).then(res => {
                let data = res.data

                let secondData = [
                    {value: 0, name: "未成年"},
                    {value: 0, name: "成年人"},
                    {value: 0, name: "老年人"},
                ]

                data.forEach(d => {
                    if (d.age < 18){
                        secondData[0].value += d.count
                    } else if (d.age >= 65){
                        secondData[2].value += d.count
                    } else {
                        secondData[1].value += d.count
                    }
                })

                let option = {
                    series: [
                        {
                            data: data.map(d => {
                                return {
                                    value: d.count,
                                    name: d.age
                                }
                            })
                        },
                        {
                            data: secondData
                        }
                    ]
                }
                this.ageChart.setOption(option)
            })
        },
        update(){
            this.updateAgeChart()
            this.updateTimeChart()
            this.updateFromChart()
        },
        initFromChart(){
            let fromChart = echarts.init(this.$refs.from)
            let option = {
                // tooltip: {
                //     trigger: "item",
                //     formatter: "{a} <br/>{b}: {c} ({d}%)"
                // },
                // legend: {
                //     orient: "vertical",
                //     x: "left",
                //     data: ["本地人", "外地人"]
                // },
                series: [
                    {
                        name: "访问来源",
                        type: "pie",
                        radius: ["80%", "90%"],
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        avoidLabelOverlap: false,
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: []
                    },
                    {
                        name: "访问来源",
                        type: "pie",
                        radius: ["0%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: []
                    }
                ]
            }
            fromChart.setOption(option)
            this.fromChart = fromChart
        },
        updateFromChart(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let ageTime = JSON.stringify(this.$store.getters.ageTimeRange)
            let barIds = this.$store.getters.selectedBars.map(bar => bar.id).join(",")
            if (this.$store.getters.singleBar) barIds = this.$store.getters.singleBar.id

            queryProvinceUsercount({
                startTime: startTime,
                endTime: endTime,
                ageTime: ageTime,
                barIds: barIds
            }).then(res => {
                let rdata = res.data
                let data = Object.keys(rdata).map(key => {
                    return {
                        name: key,
                        value: rdata[key]
                    }
                })
                let chongqingIndex = data.findIndex(d => d.name === "重庆")
                data.splice(0, 0, data.splice(chongqingIndex, 1)[0])

                let localData = {value: data[0].value, name: "本地人"}
                let otherData = {value: data.reduce((sum, d) => sum + d.value, 0) - data[0].value, name: "外地人"}
                this.fromChart.setOption({
                    series: [
                        {
                            data: [
                                localData,
                                otherData,
                            ]
                        },
                        {
                            data
                        }
                    ]
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bars-statistic-container{
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid black;
    box-sizing: border-box;
    display: flex;

    .internet-time-distribution{
        flex: 2;
    }

    .others{
        flex: 1;
        display: flex;
        flex-direction: column;

        div{
            flex: 1;
        }
    }
}
</style>
