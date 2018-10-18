<template>
<transition name="slide">
    <music-list :songs='songs' :title='title' :bg-image='bgImage'></music-list>
</transition>
</template>

<script>
import Player from '../player/player'
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {creatSong} from 'common/js/song.js'
export default {
    components:{
        MusicList
    },
    data(){
        return{
            songs:[],
            songsdetail:[],
            songsurl:[],
            songlist:[]
        }
    },
    computed:{
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.picUrl
        },
        ...mapGetters([
             'singer'
        ])
    },
    created(){
        this._getDetail()
    },
    methods:{
        _getDetail(){
            if(!this.singer.id){
                this.$router.push('/singer')
                return
            }
            const url = 'http://118.118.118.156:3000/artists?id='+this.singer.id
            this.$axios.get(url,{
                xhrFields: { withCredentials: true }
            }).then((res) => { 
                this.songlist = res.data.hotSongs
                setTimeout(()=>{
                    this.songs = this._normalizeSongs(this.songlist)
                    //console.log(this.songs) 
                },20)
            }).catch((err) => {
                console.log(err)  
            });
        },
        _getcheck(list){
            for(var i=0;i<list.length;i++){
                this._getSongtime(list[i]);
                this._getSongUrl(list[i]);
            }
            // console.log(this.songsdetail)
            // console.log(this.songsurl)
        },
        _normalizeSongs(list){
            let ret = []
            list.forEach((item,index)=>{
                let musicData = item;
                if(musicData.id && musicData.al.id){
                    ret.push(creatSong(musicData))
                }
            })
            return ret
        }
    },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
