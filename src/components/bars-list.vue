<template>
    <div class="bars-list-container">
        <div class="list-title">网吧列表</div>
        <div class="list-content">
            <div class="bar-item" v-for="bar in bars" :key="bar.id">{{bar.name}}</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    computed:{
        bars(){
            return this.$store.getters.selectedBars
        }
    }
}
</script>

<style lang="scss">
.bars-list-container{
    box-sizing: border-box;
    position:absolute; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height:100%;

    border: 1px solid black;
    display: flex;
    flex-direction: column;
}

.list-title{
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    border: 1px solid black;
}

.list-content{
    flex:1;
    overflow: auto;

    .bar-item{

        &:hover{
            cursor: pointer;
            background: black;
            color: white;
        }
    }
}
</style>

