import jsonp from 'common/js/jsonp'          //引入jsonp
import {commonParams,options} from './config'  
import axios from 'axios'  
//引入config.js
export function getRecommend(){
   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
   const data = Object.assign({},commonParams,{     //es6的assign将commonParams和
    uin: 0,                      //之后的对象合并为一起，放在
    platform:'h5',                   //前面的{}之中。
    needNewCode: 1,
   })
   return jsonp(url,data,options)
}