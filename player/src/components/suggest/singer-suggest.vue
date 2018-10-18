<template>
    <scroll class="suggest" 
            :data="result" 
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @beforeScroll="listScroll"
            ref="suggest">
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result"
                :key="index" >
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
        </ul>
        <div v-show="!result.length" class="no-result-wrapper">
                <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
import {filter} from 'common/js/song.js'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {creatSong} from 'common/js/song.js'
import NoResult from 'base/no-result/no-result'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex';
export default {
    components:{
        Scroll,
        Loading,
        NoResult
    },
    data(){
        return{
            result:[],
            pullup:true,
            type:0,
            song:[],
            songtype:[],
            beforeScroll: true,
            singer:[]
        }
    },
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:true
        }
    },
    methods:{
        search(){
            this.type = 1
            this.$refs.suggest.scrollTo(0,0)
            const url = 'http://118.118.118.156:3000/search?keywords='+ this.query + '&limit=30&type=100'
            this.$axios.get(url,{
                xhrFields: { withCredentials: true }
            }).then((res) => {
                if(res.data.result.artists == null){
                    return
                }
                this.result = res.data.result.artists
                //console.log(this.result)
            }).catch((err) => { 
                console.log(err)  
            });
        },
        getIconCls(item){
            return 'icon-mine'
        },
        getDisplayName(item){
            return `${item.name}`
        },
        selectItem(item){
            const singer = item
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            //console.log(singer)
            this.setSinger(singer)
        },
        listScroll(){
            this.$emit('listScroll')
        },
        refresh(){
            this.$refs.suggest.refresh()
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    watch:{
        query(){
            this.search()
        }
    }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>