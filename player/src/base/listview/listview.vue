<template>
    <scroll class="listview" :data='data' ref="listview">
        <ul>
            <li class="list-group">
                <h2 class="list-group-title">热门歌手 Top100</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="(item,index) in data"
                    :key="index"
                    class="list-group-item"
                    >
                        <img class="avatar" v-lazy="item.picUrl">
                        <span class="name">Top{{index+1}} {{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
export default {
    props:{
        data:{
            type:Array,
            default:[]
        }
    },
    computed:{
        
    },
    components:{
        Scroll
    },
    methods:{
        refresh() {
            this.$refs.listview.refresh()
        },
        selectItem(item){
            this.$emit('select',item)
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

