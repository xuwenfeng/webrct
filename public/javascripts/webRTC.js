var webrtc = function(){
   this.rtcPeerConns = [];
}

//配置ice服务器
var iceServer = {
  "iceServers": [{
      "urls" : ["stun:stun.l.google.com:19302"]
  }, {
      "urls" : ["turn:numb.viagenie.ca"],
      "username" : "webrtc@live.com",
      "credential" : "muazkh"
  }]
};

//getUserMedia参数
webrtc.prototype.mediaOpts = {
  audio: true,
  video: true,
  video: { width: 640, height: 480 }
}

webrtc.prototype.isSupporMedia = function(){
  if(navigator.getUserMedia == undefined && navigator.mediaDevices == undefined) return true;
  else return true;
}

webrtc.prototype.isSupporDrive = function(){
   if(!this.isSupporMedia){
    rtcDialog.showMsg({
      title: '提示',
      content: '该设备不支持获取系统摄像头和麦克风',
      callback: function(){
          window.sessionStorage.setItem('userName','');
          window.sessionStorage.setItem('roomName','');
          window.sessionStorage.setItem('token','');
          window.location.href = '/';
      }
    });
  }
}

webrtc.prototype.isSupporRTCPeerConnection = function(){
  if(RTCPeerConnection == undefined){
    rtcDialog.showMsg({
      title: '提示',
      content: '该设备不支持RTCPeerConnection',
      callback: function(){
          window.sessionStorage.setItem('userName','');
          window.sessionStorage.setItem('roomName','');
          window.sessionStorage.setItem('token','');
          window.location.href = '/';
      }
    });
    return false;
   }
   else return true;
}

webrtc.prototype.getUserMedia = function(mediaOpts,video){
  var _this = this;
  var _promise = new Promise(function(resolve,reject){
    if(_this.isSupporMedia()){
      navigator.mediaDevices.getUserMedia(mediaOpts).then(function(stream){
        try{
          video.src = window.URL.createObjectURL(stream);
        }
        catch(err){
          video.srcObject = stream;
        }
        _this.stream = stream;
        resolve();
      }).catch(function(error){
        rtcDialog.showMsg('getUserMedia error: ' + error.toString());
      });
    }
    else{
      video.src = '/video/chrome.mp4';
      try{
         _this.stream = video.captureStream();
      }
      catch(error){
        _this.stream = null;
        alert('video对象不支持captureStream');
      }
      resolve();
    }
  });
  return _promise;
}

webrtc.prototype.icestatechange = function(event){
  debugger
}

webrtc.prototype.addRtcPeerConn = async function(opt){
  try{
    this.stream.getTracks().forEach(track => {
      if(track.kind == 'video'){
        opt.videoRender = opt.rtcPeerCon.addTrack(track, this.stream);
      }
      else if(track.kind == 'audio'){
        opt.audioRender = opt.rtcPeerCon.addTrack(track, this.stream);
      }
    });
  }
  catch(err){
    console.log(err.toString());
  }
  //opt.rtcPeerCon.addStream(_this.videoStream);
  //opt.status = 'unconnection';
  this.rtcPeerConns.push(opt);
}

webrtc.prototype.getPeerConById = function(id){
  var peercon = undefined;
  for(var i=0;i<this.rtcPeerConns.length;i++){
    if(this.rtcPeerConns[i].id == id){
      peercon = this.rtcPeerConns[i].rtcPeerCon;
    }
  }
  return peercon;
}

webrtc.prototype.createRtcPeerConn = function(uuid){
  var rtcPeerConn = new RTCPeerConnection(iceServer);
  rtcPeerConn.uuid = uuid;
  console.log('addmemberlist:' + rtcPeerConn.uuid);
  rtcPeerConn.addEventListener('icecandidate',function(event){
      _webrtc.icecandidate(event,rtcPeerConn);
  });
  rtcPeerConn.addEventListener('track',function(event){
      _webrtc.track(event,rtcPeerConn);
  });
  rtcPeerConn.addEventListener('icestatechange',_webrtc.icestatechange);
  //rtcPeerConn.addEventListener('addstream',_webrtc.addstream);
  return rtcPeerConn;
}

//发起offer
webrtc.prototype.peerConOffer = function(opt){
    if(opt.rtcPeerCon != undefined){
      opt.rtcPeerCon.createOffer(function(offer) {
        // var video = document.createElement('video');
        // getUserMedia1(video,desc.sdp);
        // document.body.appendChild(video)  
        opt.rtcPeerCon.setLocalDescription(new RTCSessionDescription(offer),function(){
          socket.send(jsonToString({ 
              type: "offer",
              data: {
                toMemberId: opt.id,
                toMemberName: opt.name,
                sdp: offer
              }
          }));
        },function(error){
            console.log(error.toString())
        });
      },function(error){
          console.log('error::' + error.toString())
      });
    }
} 


webrtc.prototype.icecandidate = function(event,rtcPeerConn){
  try {
    var toMemberId = '';
    for(var i=0;i<_webrtc.rtcPeerConns.length;i++){
      if(rtcPeerConn.uuid == _webrtc.rtcPeerConns[i].rtcPeerCon.uuid){
         toMemberId = _webrtc.rtcPeerConns[i].id;
         break;
       }
    }
    if (event.candidate !== null) {
        socket.send(JSON.stringify({
            type: "ice_candidate",
            data: {
                candidate: event.candidate,
                toMemberId: toMemberId
            }
        }));
    }  
  } catch (e) {
      
  }
}

webrtc.prototype.track = function(event,rtcPeerConn){
  if(event.track.kind == 'video'){
    var video = document.createElement('video');
    var item = document.createElement('div');
    var span = document.createElement('span');
    video.setAttribute('autoplay',true);
    video.setAttribute('playsinline',true);
    video.setAttribute('muted',true);
    video.setAttribute('controls',true);
    // video.setAttribute('poster','/images/stop.png');
    try{
        video.src = window.URL.createObjectURL(event.streams[0]);
    }
    catch(err){
        video.srcObject = event.streams[0];
    }
    //video.src = '/video/chrome.mp4';
    window.steams = event.streams[0];
    console.log('track:' + rtcPeerConn.uuid);
    for(var i=0;i<_webrtc.rtcPeerConns.length;i++){
        if(rtcPeerConn.uuid == _webrtc.rtcPeerConns[i].rtcPeerCon.uuid){
          span.textContent = _webrtc.rtcPeerConns[i].name;
          item.setAttribute('data-id',_webrtc.rtcPeerConns[i].id);
          break;
        }
    }
    item.setAttribute('class','vedio-item');
    item.appendChild(video);
    item.appendChild(span);
    document.getElementById('vedioList').appendChild(item);
  }
}

webrtc.prototype.addstream = function(event){
  console.log(event)
  var video = document.createElement('video');
  var item = document.createElement('div');
  var span = document.createElement('span');
  video.setAttribute('autoplay',true);
  video.setAttribute('playsinline',true);
  video.setAttribute('muted',true);
  try{
      video.src = window.URL.createObjectURL(event.stream);
  }
  catch(err){
      video.srcObject = event.stream;
  }
  for(var i=0;i<_webrtc.rtcPeerConns.length;i++){
      if(event.currentTarget.currentLocalDescription.sdp == _webrtc.rtcPeerConns[i].rtcPeerCon.currentLocalDescription.sdp){
        span.textContent = _webrtc.rtcPeerConns[i].name;
        item.setAttribute('data-id',_webrtc.rtcPeerConns[i].id);
        break;
      }
  }
  item.setAttribute('class','vedio-item');
  item.appendChild(video);
  item.appendChild(span);
  document.getElementById('vedioList').appendChild(item);
}
 
