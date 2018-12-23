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

import { queryAgeCount } from "../interfaces/bars.js"

export default {
    data(){
        return {
            ageChart: null,
            fromChart: null
        }
    },
    mounted(){
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

            let hours = ["12a", "1a", "2a", "3a", "4a", "5a", "6a",
                "7a", "8a", "9a", "10a", "11a",
                "12p", "1p", "2p", "3p", "4p", "5p",
                "6p", "7p", "8p", "9p", "10p", "11p"]
            let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

            let data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]

            let option = {
                polar: {},
                tooltip: {
                    formatter: function (params) {
                        return params.value[2] + " commits in " + hours[params.value[1]] + " of " + days[params.value[0]]
                    }
                },
                angleAxis: {
                    type: "category",
                    data: hours,
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#999",
                            type: "dashed"
                        }
                    },
                    axisLine: {
                        show: false
                    }
                },
                radiusAxis: {
                    type: "category",
                    data: days,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate: 45
                    }
                },
                series: [{
                    name: "Punch Card",
                    type: "scatter",
                    coordinateSystem: "polar",
                    symbolSize: function (val) {
                        return val[2] * 2
                    },
                    data: data,
                    animationDelay: function (idx) {
                        return idx * 5
                    }
                }]
            }
            timeChart.setOption(option)
            this.timeChart = timeChart
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
                        radius: ["0%", "30%"],
                        avoidLabelOverlap: false,
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {value: 310, name: "本地人"},
                            {value: 11 * 33, name: "外地人"},
                        ]
                    },
                    {
                        name: "访问来源",
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
                        data: [
                            {value: 310, name: "重庆"},
                            {value: 11, name: "北京"},
                            {value: 11, name: "天津"},
                            {value: 11, name: "河北"},
                            {value: 11, name: "山西"},
                            {value: 11, name: "内蒙古"},
                            {value: 11, name: "辽宁"},
                            {value: 11, name: "吉林"},
                            {value: 11, name: "黑龙江"},
                            {value: 11, name: "上海"},
                            {value: 11, name: "江苏"},
                            {value: 11, name: "浙江省"},
                            {value: 11, name: "安徽"},
                            {value: 11, name: "福建"},
                            {value: 11, name: "江西"},
                            {value: 11, name: "山东"},
                            {value: 11, name: "河南"},
                            {value: 11, name: "湖北"},
                            {value: 11, name: "湖南"},
                            {value: 11, name: "广东"},
                            {value: 11, name: "广西"},
                            {value: 11, name: "四川"},
                            {value: 11, name: "云南"},
                            {value: 11, name: "贵州"},
                            {value: 11, name: "西藏"},
                            {value: 11, name: "陕西"},
                            {value: 11, name: "甘肃"},
                            {value: 11, name: "青海"},
                            {value: 11, name: "宁夏"},
                            {value: 11, name: "新疆"},
                            {value: 11, name: "台湾"},
                            {value: 11, name: "香港"},
                            {value: 11, name: "澳门"},
                        ]
                    }
                ]
            }
            fromChart.setOption(option)
            this.fromChart = fromChart
        },
        update(){
            this.updateAgeChart()
        },
        updateAgeChart(){
            queryAgeCount().then(res => {
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
                console.log(secondData)

                let option = {
                    series: [
                        {
                            data: data.map(d => {
                                console.log(d)
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
