<template>
    <scroll class="suggest" 
            :data="result" 
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @beforeScroll="listScroll"
            ref="suggest"
            @scrollToEnd="searchMore">
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
            <loading v-show="hasMore" title=""></loading>
            <div v-show="!hasMore">
                <no-result title="抱歉，暂无更多搜索结果"></no-result>
            </div>
        </ul>
        <div v-show="!result.length" class="no-result-wrapper">
                <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
        <top-tip ref="toptip">
          <div class="tip-title">
            <i class="icon-ok"></i>
            <span class="text">这首歌没有版权哦</span>
          </div>
        </top-tip>
    </scroll>
</template>

<script>
import {filter} from 'common/js/song.js'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {creatSong} from 'common/js/song.js'
import NoResult from 'base/no-result/no-result'
import {mapMutations, mapActions} from 'vuex';
import TopTip from 'base/top-tip/top-tip';
export default {
    components:{
        Scroll,
        Loading,
        NoResult,
        TopTip
    },
    data(){
        return{
            result:[],
            pullup:true,
            hasMore: true,
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
            this.hasMore = true
            this.$refs.suggest.scrollTo(0,0)
            const url1 = 'http://118.118.118.156:3000/search?keywords='+ this.query + '&limit=30&offset=0'
            const url2 = 'http://118.118.118.156:3000/search?keywords='+ this.query + '&limit=30&type=100'
            this.$axios.get(url1,{
                xhrFields: { withCredentials: true }
            }).then((res) => {
                //console.log(res)
                this._chekMore(res.data.result.songs)
                if(res.data.result.songs == null){
                    return
                }
                this.result = res.data.result.songs
                //console.log(this.result)
            }).catch((err) => { 
                console.log(err)  
            });
        },
        searchMore(){
            if(!this.hasMore){
                return
            }
            this.type++;
            const url = 'http://118.118.118.156:3000/search?keywords='+ this.query + '&limit=30&offset=' + this.type
            this.$axios.get(url,{
                xhrFields: { withCredentials: true }
            }).then((res) => {
                this.result = this.result.concat(res.data.result.songs)
                this._chekMore(data)
                //console.log(this.result)
            }).catch((err) => { 
                console.log(err)  
            });
        },
        _chekMore(data){
            if(data == null){
                this.hasMore = false
                return
            }
            if(data.length % 30 == 0){
                this.hasMore = true
            }
            else{
                this.hasMore = false
            }
        },
        getIconCls(item){
            return 'icon-music'
        },
        getDisplayName(item){
            return `${item.name}-${filter(item.artists)}`
        },
        selectItem(item){
            const url1 = 'http://118.118.118.156:3000/music/url?id='+item.id;
            this.$axios.get(url1,{
                xhrFields: { withCredentials: true }
            }).then((res) => { 
                //console.log(res.data.data[0].url)
                if(res.data.data[0].url == null){
                    this.$refs.toptip.show()
                    return
                }
                else{
                    const url2 = 'http://118.118.118.156:3000/song/detail?ids='+item.id
                    this.$axios.get(url2,{
                        xhrFields: { withCredentials: true }
                    }).then((res) => { 
                        //console.log(res.data)
                        this.songtype = res.data.songs[0]
                        setTimeout(()=>{
                            this.song = this._normalizeSongs(this.songtype)
                            //console.log(this.song)
                            this.insertSong(this.song)
                        },20)
                    }).catch((err) => {
                        console.log(err)  
                    });
                    this.$emit('select')
                }
            }).catch((err) => { 
                console.log(err)  
            });
        },
        _genResult(data){

        },
        _normalizeSongs(data){
            let ret = {}
            let musicData = data;
            //console.log(musicData)
            if(musicData.id && musicData.al.id){
                ret = creatSong(musicData)
            }
            return ret
        },
        listScroll(){
            this.$emit('listScroll')
        },
        refresh(){
            this.$refs.suggest.refresh()
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
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
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>