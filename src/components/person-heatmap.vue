<template>
    <div ref="records" style="position:absolute; top: 0; left: 0; width: 100%; height:100%;"></div>
</template>

<script>
import echarts from "echarts"

import { queryPersonTimeCount } from "../interfaces/bars.js"

export default {
    data(){
        return {
            myChart: null
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
                    xAxisIndex: 0
                },
                xAxis: {
                    type: "category",
                    data: []
                },
                yAxis: {
                    type: "category",
                    data: []
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
                        color: ["yellow", "red"],
                        symbolSize: [30, 100]
                    }
                },
                series: [{
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

            let data = []
            agetimecountData.forEach(d => {
                if (d.count > 0){
                    data.push([d.internetTime, d.age, d.count])
                }
            })

            myChart.setOption({
                xAxis: {
                    type: "category",
                    data: xData
                },
                yAxis: {
                    type: "category",
                    data: yData
                },
                series: [{
                    type: "heatmap",
                    data: data,
                    itemStyle: {
                        emphasis: {
                            borderColor: "#333",
                            borderWidth: 1
                        }
                    },
                    animation: false
                }]
            })
        }
    }
}
</script>

