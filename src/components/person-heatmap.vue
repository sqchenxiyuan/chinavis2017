<template>
    <div ref="records" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;background-color:#404A59"></div>
</template>

<script>
import echarts from "echarts"

import { queryPersonTimeCount } from "../interfaces/bars.js"

export default {
    data(){
        return {
            myChart: null,
            
            scatterdata: [],
        }
    },
    mounted(){
        this.initData()
        queryPersonTimeCount({
            maxTime: 24 * 3600,
            interval: 3600,
        }).then(res => {
            let data = res.data
            this.updateData(data)
        })
    },
    methods: {
        initData(){
            let myChart = echarts.init(this.$refs.records)
            let option = {
                tooltip: {
                    trigger: "none",
                    axisPointer: {
                        type: "cross"
                    },  
                },
                brush: {
                    toolbox: ["polygon", "lineX", "lineY", "keep", "clear"],
                    throttleType: "debounce",
                    throttleDelay: 700
                },
                xAxis: {
                    type: "category",
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
                    type: "category",
                    data: [],
                    axisLine: {
                    lineStyle: {
                       type: 'solid',
                       color:'#fff',
                       width:'1'
                   }
               },
                },
                grid:{
                    show: true,
                    borderColor: "#fff"
                },
                visualMap: {
                    type: "continuous",
                    min: 0,
                    max: 1000,
                    calculable: true,
                    orient: "horizontal",
                    left: "center",
                    top: "0%",
                    inRange: {
                        color: ["#50a3ba", "#eac736", "#d94e5d"],
                        // symbolSize: [30, 100]
                    },
                     textStyle: {
                        color: "#fff"
                    }
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
        updateData(agetimecountData){
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
        },
        computeNewRange(dataIndex){
            if(dataIndex.length === 0) return 

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

