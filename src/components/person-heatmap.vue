<template>
    <div ref="records" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;background-color:#404A59"></div>
</template>

<script>
import echarts from "echarts"

import eventBus from "./eventbus.js"
import { queryPersonTimeCount } from "../interfaces/bars.js"

export default {
    data(){
        return {
            myChart: null,
            
            scatterdata: [],
        }
    },
    mounted(){
        eventBus.$on("timeRangeUpdate", this.updateData)
        eventBus.$on("selectedBarsUpdate", this.updateData)
        eventBus.$on("ageInternetTimeRangeUpdate", this.updateData)
        eventBus.$on("typeUpdate", this.updateData)

        this.initData()
        this.updateData()
    },
    methods: {
        initData(){
            let myChart = echarts.init(this.$refs.records, "dark")
            let option = {
                tooltip: {
                    trigger: "item",
                    formatter: params => {
                        let data = params.value
                        return `${data[1]}岁-${data[0]}小时：${data[2]}`   
                    }
                },
                brush: {
                    toolbox: ["polygon", "keep", "clear"],
                    throttleType: "debounce",
                    throttleDelay: 300
                },
                xAxis: {
                    name: "上网时长",
                    nameLocation: "center",
                    type: "category",
                    data: [],
                },
                yAxis: {
                    name: "上网年龄",
                    type: "category",
                    data: [],
                },
                grid: {
                    bottom: "30px",
                    left: "30px",
                    right: "10px"
                },
                visualMap: {
                    type: "continuous",
                    min: 0,
                    max: 1000,
                    calculable: true,
                    orient: "horizontal",
                    left: "center",
                    top: "0%",
                },
                series: [
                    {
                        type: "scatter",
                        data: [],
                        symbol: "rect",
                        symbolSize: 0,
                        animation: false
                    },
                    {
                        type: "heatmap",
                        data: [],
                        itemStyle: {
                            emphasis: {
                                borderColor: "#333",
                                borderWidth: 1
                            }
                        },
                        animation: false
                    }]
            }
            myChart.setOption(option)

            myChart.on("brushselected", e => {
                this.computeNewRange(e.batch[0].selected[0].dataIndex)
            })

            this.myChart = myChart
        },
        updateData(){
            let timerange = this.$store.getters.timeRange
            let startTime = Math.floor(timerange.startTime / 1000)
            let endTime = Math.floor(timerange.endTime / 1000)
            let barIds = this.$store.getters.selectedBars.map(bar => bar.id).join(",")
            let type = this.$store.getters.type

            queryPersonTimeCount({
                startTime,
                endTime,
                barIds,
                maxTime: 24 * 3600,
                interval: 3600,
                type
            }).then(res => {
                let agetimecountData = res.data
                let myChart = this.myChart

                let age = 100
                let time = 24

                let xData = []
                let yData = []

                for (let i = 0; i <= time; i++){
                    xData.push(i)
                } 

                for (let i = 0; i <= age; i++){
                    yData.push(i)
                } 

                let heatmapdata = []
                let scatterdata = []
                agetimecountData.forEach(d => {
                    if (d.count > 0){
                        heatmapdata.push([d.internetTime, d.age, d.count])
                    }
                    scatterdata.push([d.internetTime, d.age, 1])
                })
                this.scatterdata = scatterdata

                myChart.setOption({
                    xAxis: {
                        data: xData
                    },
                    yAxis: {
                        data: yData
                    },
                    series: [{
                        data: scatterdata,
                    }, {
                        data: heatmapdata,
                    }]
                })
            })
        },
        computeNewRange(dataIndex){
            if (dataIndex.length === 0){
                if (this.$store.getters.ageTimeRange.length > 0){
                    this.$store.commit("setAgeInternetTimeRange", [])
                }
                return
            } 

            let datas = this.scatterdata
            let HOUR = 3600

            let ageMap = new Map()

            dataIndex.forEach(index => {
                let data = datas[index]
                let age = data[1]
                let time = data[0]
                
                if (ageMap.has(age)){
                    ageMap.get(age).push(time * HOUR)
                } else {
                    ageMap.set(age, [time * HOUR])
                }
            })

            let ageArr = []
            ;([...ageMap.keys()]).forEach(age => {
                ageArr.push({
                    age,
                    data: ageMap.get(age)
                })
            })
            ageArr = ageArr.map(ageData => {
                let age = ageData.age
                let data = ageData.data
                data.sort((a, b) => a - b)

                let times = []
                let timeItem = [data[0], data[0]]
                times.push(timeItem)
                for (let i = 1;i < data.length; i++){
                    if (data[i] === 24){
                        data[i] = 24 * 300
                    }

                    if (data[i] === data[i - 1] + HOUR){
                        timeItem[1] += HOUR
                    } else {
                        timeItem = [data[i], data[i]]
                        times.push(timeItem)
                    }
                }

                return {
                    age,
                    times
                }
            })
            
            this.$store.commit("setAgeInternetTimeRange", ageArr)
        }
    }
}
</script>

