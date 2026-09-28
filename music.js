(() => {
  'use strict';
  const tracks = [
    {src:'https://ssl.nexon.com/s2/Game/Maplestory/maple2013/mp3/Aquarium.mp3', source:'https://maplestory.nexon.com/Media/Music'},
    {src:'https://ssl.nexon.com/s2/Game/Maplestory/maple2013/mp3/FantasticThinking.mp3', source:'https://maplestory.nexon.com/Media/Music'},
    {src:'https://orangemushroom.net/wp-content/uploads/2025/06/sound.bgm61.img_.port-city-of-balora_new.mp3', source:'https://orangemushroom.net/2025/06/09/kmst-ver-1-2-188-new-job-len-assemble-improvements/'},
    {src:'https://patchwiki.biligame.com/images/maplestory/9/96/t523p7p0l5q04bwmofiywaeof8hr689.mp3', source:'https://wiki.biligame.com/maplestory/%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90/Bgm34'}
  ];
  const $=id=>document.getElementById(id);
  const audio=$('music-audio'),play=$('music-play'),seek=$('music-seek'),volume=$('music-volume'),status=$('music-status'),picker=$('music-track');
  let index=0,repeating=false,pending=false,generation=0;
  function message(text=''){status.textContent=text;status.hidden=!text;}
  function reflect(){const active=!audio.paused&&!audio.ended;play.title=active?'일시정지':'재생';play.setAttribute('aria-label',active?'일시정지':'재생');play.dataset.playing=String(active);}
  async function start(){
    const current=++generation;pending=true;message();
    try{await audio.play();if(current===generation)pending=false;}
    catch(error){if(current!==generation)return;pending=false;reflect();if(error.name==='NotAllowedError')message('▶ 버튼을 누르면 음악이 시작돼요.');else if(error.name!=='AbortError')message('음원을 불러오지 못했어요. 다시 재생해 주세요.');}
  }
  function select(next,autoplay=true){
    generation++;pending=false;audio.pause();index=(next+tracks.length)%tracks.length;picker.value=String(index);
    $('music-source').href=tracks[index].source;audio.src=tracks[index].src;audio.load();seek.value=0;seek.disabled=true;$('elapsed').textContent='0:00';reflect();message();if(autoplay)start();
  }
  function update(){const duration=audio.duration,time=audio.currentTime;seek.disabled=!(Number.isFinite(duration)&&duration>0);seek.value=seek.disabled?0:time/duration*100;$('elapsed').textContent=`${Math.floor(time/60)||0}:${String(Math.floor(time%60)||0).padStart(2,'0')}`;}
  play.addEventListener('click',()=>{if(!audio.paused||pending){generation++;pending=false;audio.pause();reflect();message();}else start();});
  $('music-prev').addEventListener('click',()=>select(index-1));$('music-next').addEventListener('click',()=>select(index+1));picker.addEventListener('change',()=>select(Number(picker.value)));
  $('music-repeat').addEventListener('click',()=>{repeating=!repeating;const button=$('music-repeat');button.setAttribute('aria-pressed',String(repeating));button.setAttribute('aria-label',repeating?'한 곡 반복 끄기':'한 곡 반복 켜기');button.title=repeating?'현재 곡이 끝나면 같은 곡을 다시 재생합니다':'곡이 끝나면 다음 곡을 재생합니다';});
  volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;});
  seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(seek.value)*audio.duration/100;});
  audio.addEventListener('playing',()=>{pending=false;reflect();message();});audio.addEventListener('pause',reflect);
  audio.addEventListener('ended',()=>{if(repeating){audio.currentTime=0;start();}else select(index+1);});
  audio.addEventListener('error',()=>{pending=false;reflect();message('음원을 불러오지 못했어요. 다시 재생하거나 ⓘ에서 확인해 주세요.');});
  audio.addEventListener('timeupdate',update);audio.addEventListener('loadedmetadata',update);
  audio.volume=.4;select(0,true);
})();
