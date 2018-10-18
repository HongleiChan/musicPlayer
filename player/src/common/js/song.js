import axios from 'axios'
export default class Song {
    constructor({id,alid,name,alname,singer,pic,publishTime,url}){
        this.id = id,
        this.alid = alid,
        this.name = name,
        this.alname = alname,
        this.singer = singer,
        this.pic = pic,
        this.publishTime = publishTime,
        this.url = url
    }
}

export function creatSong(musicData){
    return new Song({
        id: musicData.id,
        alid: musicData.al.id,
        name: musicData.name,
        alname: musicData.al.name,
        singer: filter(musicData.ar),
        pic: musicData.al.picUrl
    })
}

export function getMusicdetail(musicData){
    const url1 = 'http://118.118.118.156:3000/song/detail?ids='+musicData.id;
    axios.get(url1,{
        xhrFields: { withCredentials: true }
    }).then((res) => { 
        var songsdetail = res.data.songs[0]
        console.log(songsdetail)
        return songsdetail
        //console.log(songsdetail)
        }).catch((err) => {
        console.log(err)  
    });
   
}

export function getMusicUrl(musicData){
    const url2 = 'http://118.118.118.156:3000/music/url?id='+musicData.id;
    axios.get(url2,{
        xhrFields: { withCredentials: true }
    }).then((res) => { 
        var songsurl = res.data.data[0].url
        return songsurl
        //console.log(songsurl) 
        }).catch((err) => { 
        console.log(err)  
    });
}

export function filter(ar){
    let ret = []
    if(!ar){
        return ''
    }
    ar.forEach((s,index) => {
        if(index<5){
            ret.push(s.name)
        }
        else ret
    });
    return ret.join('/')
}