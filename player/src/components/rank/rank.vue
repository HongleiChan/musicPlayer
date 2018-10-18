<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" ref="toplist">
            <ul>
                <li class="item"
                @click="selectItem(item)" 
                v-for="(item,index) in topList"
                :key="index"
                >
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.creator.avatarUrl"/>
                    </div>
                    <ul class="songlist">
                        <span>{{item.name}}</span>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {playlistMixin} from 'common/js/mixin'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {mapMutations} from 'vuex'
export default {
    mixins: [playlistMixin],
    components:{
        Scroll,
        Loading
    },
    data(){
        return{
            topList:[]
        }
    },
    created(){
        this._getTopList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      selectItem(item){
        this.$router.push({
            path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList(){
          for(var i=0;i<24;i++){
            const url = 'http://118.118.118.156:3000/top/list?idx='+i
            this.$axios.get(url,{
                    xhrFields: { withCredentials: true }
                }).then((res) => {
                    this.topList.push(res.data.playlist) 
                    //console.log(this.topList)
                }).catch((err) => {
                    console.log(err)  
                });
          }
          //console.log(this.topList)
      },
      ...mapMutations({
          setTopList: 'SET_TOP_LIST'
      })
    },
    watch: {
      topList() {
        setTimeout(() => {
          this.$Lazyload.lazyLoadHandler()
        }, 20)
      }
    },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

