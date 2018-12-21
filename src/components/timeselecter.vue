<template>
    <div ref="container" class="time-selector-container">
        <div class="selected-container" :style="selectedContainerStyle" @mousedown="dragTimeHandel">
        </div>
        <div class="selector-handle" :style="startHandleStyle" @mousedown="dragStartHandel"></div>
        <div class="selector-handle" :style="endHandleStyle" @mousedown="dragEndHandel"></div>
    </div>
</template>

<script>
import eventBus from "./eventbus.js"

export default {
    props: {
        startTime: Number,
        endTime: Number,
        minTime: Number,
        initStart: {
            type: Number,
            default: 0
        },
        initEnd: {
            type: Number,
            default: 1
        }
    },
    data(){
        let props = this.$props
        let minP = props.minTime / (props.endTime - props.startTime)
        console.log(minP)
        return {
            start: props.initStart,
            end: props.initEnd,
            minP: minP
        }
    },
    computed: {
        selectedContainerStyle(){
            return {
                left: this.start * 100 + "%",
                width: (this.end - this.start) * 100 + "%",
            }
        },
        startHandleStyle(){
            return {
                left: this.start * 100 + "%",
            }
        },
        endHandleStyle(){
            return {
                left: this.end * 100 + "%",
            }
        },
    },
    methods: {
        dragStartHandel(e){
            let startMX = e.clientX //开始的鼠标位置
            let countainerRect = this.$refs.container.getBoundingClientRect()
            let startPX = countainerRect.width * this.start //开始的浮标位置

            let updateStart = e => {
                let countainerRect = this.$refs.container.getBoundingClientRect()
                let nowMX = e.clientX
                let nowStart = ( e.clientX - startMX + startPX) / countainerRect.width
                this.start = nowStart
                if (this.start < 0) this.start = 0
                if (this.start > this.end - this.minP) this.start = this.end - this.minP
                e.stopPropagation()
                e.preventDefault()
            }

            let mouseMove = e => {
                updateStart(e)
            }

            let mouseUp = e => {
                updateStart(e)
                this.updateState()

                window.removeEventListener("mousemove", mouseMove)
                window.removeEventListener("mouseup", mouseUp)
            }

            window.addEventListener("mousemove", mouseMove)
            window.addEventListener("mouseup", mouseUp)
        },
        dragEndHandel(e){
            let startMX = e.clientX //开始的鼠标位置
            let countainerRect = this.$refs.container.getBoundingClientRect()
            let startPX = countainerRect.width * this.end //开始的浮标位置

            let updateEnd = e => {
                let countainerRect = this.$refs.container.getBoundingClientRect()
                let nowMX = e.clientX
                let nowEnd = ( e.clientX - startMX + startPX) / countainerRect.width
                this.end = nowEnd
                if (this.end > 1) this.end = 1
                if (this.end < this.start + this.minP) this.end = this.start + this.minP
                e.stopPropagation()
                e.preventDefault()
            }

            let mouseMove = e => {
                updateEnd(e)
            }

            let mouseUp = e => {
                updateEnd(e)
                this.updateState()

                window.removeEventListener("mousemove", mouseMove)
                window.removeEventListener("mouseup", mouseUp)
            }

            window.addEventListener("mousemove", mouseMove)
            window.addEventListener("mouseup", mouseUp)
        },
        dragTimeHandel(e){
            let countainerRect = this.$refs.container.getBoundingClientRect()
            let startMX = e.clientX //开始的鼠标位置
            let startPX = countainerRect.width * this.start //开始的浮标位置
            let pWidth = this.end - this.start//开始和结束间的范围

            let update = e => {
                let countainerRect = this.$refs.container.getBoundingClientRect()
                let nowMX = e.clientX
                let nowPX = (e.clientX - startMX + startPX) / countainerRect.width
                
                if (nowPX < 0) nowPX = 0
                if (nowPX > 1 - pWidth) nowPX = 1 - pWidth

                this.start = nowPX
                this.end = nowPX + pWidth
                e.stopPropagation()
                e.preventDefault()
            }

            let mouseMove = e => {
                update(e)
            }

            let mouseUp = e => {
                update(e)
                this.updateState()

                window.removeEventListener("mousemove", mouseMove)
                window.removeEventListener("mouseup", mouseUp)
            }

            window.addEventListener("mousemove", mouseMove)
            window.addEventListener("mouseup", mouseUp)
        },
        updateState(){
            let startTime = (this.endTime - this.startTime) * this.start + this.startTime
            let endTime = (this.endTime - this.startTime) * this.end + this.startTime
            this.$emit("update", {
                startTime,
                endTime
            })
        },
        selectTimeRangeByTag(timeName){
            switch (timeName){
                case "ALL":
                    this.start = 0
                    this.end = 1
                    break
                case "MONTH":
                    this.selectTimeRangeByTime(30 * 24 * 3600 * 1000)
                    break
                case "WEEK":
                    this.selectTimeRangeByTime(7 * 24 * 3600 * 1000)
                    break
                case "DAY":
                    this.selectTimeRangeByTime(24 * 3600 * 1000)
                    break
            }
            this.updateState()
        },
        selectTimeRangeByTime(time){
            
        }
    }
}
</script>

<style lang="scss" scoped>
.time-selector-container{
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid black;
}

.selected-container{
    cursor: move;
    position: absolute;
    height: 100%;
    background: red;
}

.selector-handle{
    cursor: e-resize;
    position: absolute;
    background: black;
    width: 10px;
    top: 50%;
    height: 50%;
    transform: translate(-50%, -50%);
}
</style>

