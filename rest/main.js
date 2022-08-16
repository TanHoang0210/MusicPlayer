const $ = document.querySelector.bind(document)
const $$= document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'f-PLAYER';
const playList = $('.playlist')

const heading = $('header h2');
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const main = document.getElementById("toast")

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'How You Like That',
            Singer: 'BLACKPINK',
            path: './asset/music/hylt.mp3',
            image: './asset/img/hylt.webp'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },
        {
            name: 'All By Myself',
            Singer: 'Céline Dion',
            path: './asset/music/allbymy.mp3',
            image: './asset/img/allbymy.jpg'
        },
        {
            name: 'My Heart Will Go On',
            Singer: 'Cesline Dion',
            path: './asset/music/dddd.mp3',
            image: './asset/img/titanic.jpg'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },
        {
            name: 'DDU-DU-DDU-DU',
            Singer: 'BLACKPINK',
            path: './asset/music/dddd.mp3',
            image: './asset/img/ddudu.gif'
        },

    ],
    setConfigs: function(key,value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    }
    ,
    //render
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return ` <div class="song ${index === this.currentIndex ? 'active':''}" data-index = ${index}>
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.Singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
            <div class="option-item">
            </div>
          </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    }
    ,
    //scrollTop
    handleEvent: function(){
        const cdWidth = cd.offsetWidth
        const _this = this;
        //xử lý quay đĩa
        const cdThumbAnimate = cdThumd.animate([
            {transform: 'rotate(360deg)' }
        ],{duration:10000,//quay trong 10s
            iterations: Infinity //lặp vô hạn
        }
        )
        //mac dinh dung khi tai lai trang
       cdThumbAnimate.pause()

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth/cdWidth
        }
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        //khi bài hát play =>
        audio.onplay = function(){
            _this.isPlaying = true
            audio.play();
            $('.player').classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi bài hát play =>
         audio.onpause = function(){
            _this.isPlaying = false
            audio.pause();
            $('.player').classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi bài hát hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.onchange = function(e){
            const  seekTime = audio.duration /100 * e.target.value
            audio.currentTime = seekTime
        }
            //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
            _this.nextSong()}
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
     }
         //khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong()}
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
     }
         //bật tắt random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfigs('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
            if(_this.isRandom)
            {

                showRanDomToast()
            }else{
                hidenRandomToast()
            }
     }
        //phát lại
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfigs('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
            if(_this.isRepeat)
            {

                showRepeatToast()
            }else{
                hidenRepeatToast()
            }
        }
        //tự nhảy bài khi end
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
            nextBtn.click()
            }
        }
        //lanwsg nghe click vao bafi hat dang phat
        playList.onclick = function(e){
            if(e.target.closest('.song:not(.active)') || !e.target.closest('.option') )
            {
                if(e.target.closest('.song:not(.active)')){
                    _this.currentIndex = Number(e.target.closest('.song:not(.active)').dataset.index)//khi ddeer thnah dataset sex thanh chuoi
                                                                                                    //phari convert sang number
                    _this.loadCurrentSong()
                    _this.render();
                    audio.play()
                }           
            }
            else if(e.target.closest('.option')){
                const main = $('.option-item')
                if(main){
                    const optionDiv = document.createElement('div')
                }
            }

        }

    },
    loadCurrentSong: function(){
 

        heading.textContent = this.currentSong.name;
        cdThumd.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    loadConfigs: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    }
    ,
    //scroll den bai hat dang phat
    scrollToActiveSong: function(){
        
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center'
            })
        }, 300);
        
    }
    ,
        nextSong: function(){
        this.currentIndex++
         if(this.currentIndex >= this.songs.length){
             this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
    this.currentIndex--
     if(this.currentIndex <0){
         this.currentIndex = this.songs.length - 1;//trả về p tử cuối mảng
        }
    this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex= Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    
    start: function(){
        //load config
        this.loadConfigs()
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        //xử lý các sự kiện
        this.handleEvent()
        //tải thôn tin bài hát đầu tiên và UI khi chạy ứng dụng
        this.loadCurrentSong()
        //render ra danh sach bài hát
        this.render()
        //load config btn
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
      const toast = document.createElement("div");
  
      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toast);
      }, duration + 1000);
  
      // Remove toast when clicked
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")) {
          main.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      };
  
      const icons = {
        success: "fas fa-check-circle",
        info: "fas fa-info-circle",
        warning: "fas fa-exclamation-circle",
        error: "fas fa-exclamation-circle"
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);
  
      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
  
      toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
      main.appendChild(toast);
    }
  }


  function showRanDomToast() {
    toast({
      title: "Bật chế độ Random",
      message: "Bài hát sẽ được phát ngẫu nhiên",
      type: "success",
      duration: 5000
    });
  }
  function showRepeatToast() {
    toast({
      title: "Bật chế độ Repeat",
      message: "Bài hát sẽ được lặp lại",
      type: "success",
      duration: 5000
    });
  }
  function hidenRepeatToast() {
    toast({
      title: "Tắt chế độ Repeat",
      message: "Đã tắt",
      type: "warn",
      duration: 5000
    });
  }
  function hidenRandomToast() {
    toast({
      title: "Tắt chế độ Random",
      message: "Đã tắt",
      type: "warn",
      duration: 5000
    });
  }

    app.start()