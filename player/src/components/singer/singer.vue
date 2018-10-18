<template>
    <div class="singer" ref="singer">
        <search-box class="box" placeholder="搜索歌手" ref="searchBox" @query="onQueryChange"></search-box>
        <list-view class="list" @select="selectSinger" :data="singers" ref="List" v-show="!query"></list-view>
        <div class="search-result" ref="searchResult" v-show="query">
            <singer-suggest @listScroll="blurInput" :query="query" ref="suggest"></singer-suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
import SingerSuggest from 'components/suggest/singer-suggest'
import SearchBox from 'base/search-box/search-box'

export default {
    mixins:[playlistMixin],
    components:{
        ListView,
        SearchBox,
        SingerSuggest
    },
    data(){
        return{
            singers:[],
            query:''
        }
    },
    created(){
        this._getSingerList()
    },
    methods:{
        handlePlaylist(playList) {
            if(playList.length){
                const bottom = playList.length > 0 ? '90px' : ''

                this.$refs.singer.style.bottom = bottom
                this.$refs.List.refresh()

                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()
            }
        },
        blurInput(){
            this.$refs.searchBox.blur()
        },
        onQueryChange(query){
            this.query = query
        },
        _getSingerList(){
            const url = "http://118.118.118.156:3000/toplist/artist"
            this.$axios.get(url,{
                xhrFields: { withCredentials: true }    
            }
            ).then((res) => {
                //console.log(res)
                this.singers = res.data.list.artists    
                //console.log(this.singers)
            }).catch((err) => {
                console.log(err)
            });
        },
        _nomallizeSinger(list){
            let map={
                hot:{
                    title: HOT_NAME,
                    items: []
                }
            }
            list.array.forEach((item,index) => {
                if(index<HOT_SINGER_LENGTH){
                    map.hot.items.push({
                        id:item.id,
                        name:item.name,
                        avatar:item.picUrl
                    })
                }
            });
        },
        selectSinger(singer){
           this.$router.push({
            path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        ...mapMutations({
            setSinger : 'SET_SINGER'
        })
    },
    watch:{
        query(newQuery){
            if(!newQuery){
                setTimeout(()=>{
                    this.$refs.List.refresh()
                },20)
            }
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
        .box
            margin-top : 20px
        .search-result
            background-color : $color-background-d
            position: fixed
            width: 100%
            top: 178px
            bottom: 0
</style>

