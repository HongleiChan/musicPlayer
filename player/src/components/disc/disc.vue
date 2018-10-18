<template>
    <transition>
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list';
import {mapGetters} from 'vuex'
import {creatSong} from 'common/js/song.js'
export default {
    data() {
      return {
        songs: [],
        songlist:[]
      }
    },
    computed:{
        title(){
            return this.disc.name
        },
        bgImage(){
            return this.disc.picUrl
        },
        ...mapGetters([
            'disc'
        ])
    },
    created(){
        this._getSongList()
    },
    methods:{
        _getSongList(){
            if (!this.disc.id) {
                this.$router.push('/recommend')
                return
            }
            const url = 'http://118.118.118.156:3000/playlist/detail?id='+this.disc.id
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
            list.forEach((item,index)=>{
                let musicData = item;
                if(musicData.id && musicData.al.id){
                    ret.push(creatSong(musicData))
                }
            })
            return ret
        }
    },
    components:{
        MusicList
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>


