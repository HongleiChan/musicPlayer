<template>
    <transition name="slide">
        <music-list 
        :title="title"
        :rank="rank" 
        :bgImage="bgImage"
        :songs="songs" ></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {creatSong} from 'common/js/song.js'
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            songlist:[],
            songs:[],
            rank: true
        }
    },
    created() {
      this._getMusicList()
    },
    methods:{
        _getMusicList(){
            if (!this.topList.id) {
                this.$router.push('/rank')
                return
            }
            const url = 'http://118.118.118.156:3000/playlist/detail?id='+this.topList.id
            this.$axios.get(url,{
                xhrFields: { withCredentials: true }
            }).then((res) => {
                this.songlist = res.data.playlist.tracks
                //console.log(this.songlist)
                setTimeout(()=>{
                    this.songs = this._normalizeSongs(this.songlist)
                    //console.log(this.songs) 
                },20)
            }).catch((err) => {
                console.log(err)  
            });
        },
        _normalizeSongs(list){
            let ret = []
            //console.log(list)
            list.forEach((item,index)=>{
                let musicData = item;
                if(musicData.id && musicData.al.id){
                    ret.push(creatSong(musicData))
                }
            })
            return ret
        }
    },
    computed:{
        title(){
            return this.topList.name
        },
        bgImage(){
            if (this.songs.length) {
                return this.songs[0].pic
            }
            return ''
        },
        ...mapGetters([
            'topList'
        ])
    },
    components:{
        MusicList
    }    
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
