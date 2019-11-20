/*
    1、搜索框中输入内容，在内容中显示歌曲列表， 热门评论，
    歌曲封面
    2、点击播放按钮，播放对应的歌曲
    3、点击mv按钮，播放歌曲mv，播放mv时，点击空白区域关闭mv
*/
// 设置axios的基地址
axios.defaults.baseURL = 'https://autumnfish.cn';

var vm = new Vue({
    el: '#player',
    data: {
        query: '',
        musicList: [],
        musicCover:'',
        hotComments: [],
        isPlaying: false,
        musicUrl: '',
        mvUrl: '',
        isShow: false,
        hotPlayer: ['邓紫棋','薛之谦','张杰','张靓颖','陈奕迅']
    },
    methods: {
        async searchMusic() {
            if(this.query.length == 0) {
                return false;
            }
            //根据搜索内容查询歌曲
           let ret = await axios.get('/search?keywords='+ this.query );
            // console.log(ret);
            // 获取歌曲列表数据
            // console.log(ret.data.result.songs);
            this.musicList = ret.data.result.songs;

            let flag = this.hotPlayer.some(item =>{
                if(this.query == item ) {
                    return true;
                }
            });
            // console.log(flag);
            if (flag) {
                return false;
            } else {
                this.hotPlayer.splice(0,1);
                this.hotPlayer.push(this.query);
            }
            //清空搜索内容
            this.query ='';
        },
        //播放音乐
        async playMusic(id) {
            // 根据歌曲id查询歌曲信息
            let ret = await axios.get('/song/detail?ids='+id);
            // console.log(ret.data.songs[0]);
            music = ret.data.songs[0];
            // 设置歌曲封面
            this.musicCover = music.al.picUrl;
            // 设置唱针动画
            // this.isPlaying = true;
            //获取热门评论信息
            let Comments = await axios.get('/comment/hot?type=0&id='+ id);
            // console.log(Comments);
            this.hotComments = Comments.data.hotComments;
            //获取歌曲的url
            let url = await axios.get('/song/url?id='+ id);
            // console.log(url);
            this.musicUrl = url.data.data[0].url;
            
            
        },
        //播放mv
        async playMV(id){
            this.isShow = true;
            // 根据mvid查询mv
            let mvurl = await axios.get('https://autumnfish.cn/mv/url?id='+ id);
            // console.log(mvurl);
            // 暂停歌曲播放
            this.$refs.audio.pause()

            this.mvUrl = mvurl.data.data.url;
            // console.log(this.mvUrl);   
        },
        play() {
            this.isPlaying = true;
            // 清空mv的信息
            this.mvUrl = ''
        },
        pause() {
            this.isPlaying = false;
        },
        hide() {
            this.isShow = false;
            //暂停mv
            this.$refs.video.pause()

        },

         // 搜索历史记录中的歌曲
         historySearch(history) {
            this.query = history;
            this.searchMusic();
            // this.showHistory = false;
          }
    }
});