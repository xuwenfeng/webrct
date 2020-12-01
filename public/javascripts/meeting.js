var userName = window.sessionStorage.getItem('userName');
var roomName = window.sessionStorage.getItem('roomName');
var token = window.sessionStorage.getItem('token');
var _webrtc = new webrtc();
var _mainVideo = ''

function addMessage(opt){
    var chatMessage = $("#chatMessage");
    var li = $('<li/>');
    var div = $('<div/>')
    var span = $('<span/>');
    var p = $('<p/>');
    li.append(div);
    li.append(span)
    li.append(p);
    div.addClass('face');
    div.html('<span class="icon iconfont">&#xe647;</span>');
    p.html(opt.content);
    if(opt.memberName == undefined){
        span.html('我 '+ opt.time);
        li.addClass('me');
    }
    else{
        span.html(opt.memberName + ' ' + opt.time);
    }
    chatMessage.append(li);
    toButtom();
}

function toButtom(){
    var boxHeight = $('.chatMain').height();
    var msgBoxHeight = $('#chatMessage').height();
    var hv = msgBoxHeight - boxHeight;
    if(hv > 0){
        $('.chatMain').scrollTop(hv);
    }
}

var initPage = async function(){
    document.getElementById('mwnName').textContent = roomName + " - " + userName;
    _mainVideo = document.createElement('video');
    _mainVideo.setAttribute('autoplay','true');
    _mainVideo.setAttribute('playsinline','true');
    _mainVideo.setAttribute('muted',true);
    _mainVideo.setAttribute('controls',true);
    await _webrtc.getUserMedia(_webrtc.mediaOpts,_mainVideo);
    document.getElementById('mainVideo').appendChild(_mainVideo);
}

var addEvent = function(){
    window.onbeforeunload = window.onclose = function(event) { 
        event.preventDefault();
        socket.send(JSON.stringify({
            "type": "close"
        }));
        socket.close();
        //return confirm("确定离开此页面吗？"); 
    }

    $("#chatBox").on('click','.sendMsg',function(event){
        var _msg = $('#ttaBox').val();
        if(!isEmpty(trim(_msg))){
            socket.send(JSON.stringify({
                type:'sendMsg',
                data:{
                    content:_msg,
                }
            }));

            var d = new Date();
            var _hours = d.getHours();
            var _minutes = d.getMinutes();
            var _seconds = d.getSeconds();
            if(_hours < 10) _hours = '0' + _hours;
            if(_minutes < 10) _minutes = '0' + _minutes;
            if(_seconds < 10) _seconds = '0' + _seconds;
            var _time = _hours + ":" + _minutes + ":" + _seconds; 
            addMessage({
                content:_msg,
                time:_time
            });
            $('#ttaBox').val('');
        }
    })

    $("#controlBox").on('click','a',function(){
        var dataId = $(this).attr('data-id');
        var sign = $(this).hasClass('close')?'open':'close';
        switch(dataId){
            case 'screenshotBtn':
            break;
            case 'playBtn':
                var rtcPeerConns = _webrtc.rtcPeerConns;
                for(var i=0;i<rtcPeerConns.length;i++){
                    var rtcPeerConn = rtcPeerConns[i];
                    var videoRender = rtcPeerConn.videoRender;
                    if(sign == 'close') {
                        videoRender.track.enabled = false;
                        //rtcPeerConn.rtcPeerCon.removeTrack(videoRender);
                        _mainVideo.pause();
                    }
                    else {
                        videoRender.track.enabled = true;
                        //rtcPeerConn.rtcPeerCon.addTrack(_webrtc.stream.getVideoTracks()[0],_webrtc.stream);
                    }
                }
                if(sign == 'close') _mainVideo.pause()
                else _mainVideo.play();
            break;
            case 'switchBtn':
                //关闭对方通道
                for(var i=0;i<_webrtc.rtcPeerConns.length;i++){
                    _webrtc.rtcPeerConns[i].rtcPeerCon.close();
                }
                //删除视频
                document.getElementById('vedioList').innerHTML = '';
                //命令对方关闭通道
                socket.send(JSON.stringify({ 
                    type: "close"
                }));
                _mainVideo.pause();
                
                setTimeout(function(){
                    window.sessionStorage.setItem('userName','');
                    window.sessionStorage.setItem('roomName','');
                    window.sessionStorage.setItem('token','');
                    window.location.href = '/';
                },100);
            break;
            case 'soundBtn':
                var rtcPeerConns = _webrtc.rtcPeerConns;
                for(var i=0;i<rtcPeerConns.length;i++){
                    var rtcPeerConn = rtcPeerConns[i];
                    var audioRender = rtcPeerConn.audioRender;
                    if(sign == 'close') {
                        audioRender.track.enabled = false;
                    }
                    else {
                        audioRender.track.enabled = true;
                    }
                }
            break;
        }
        if(sign == 'close') $(this).addClass('close');
        else $(this).removeClass('close');
    });
}

var webrtcSocket = function(){
    if ("WebSocket" in window)
    {
        // 打开一个 web socket
        var host = window.location.host;
        var port = window.location.port;
        var wss = 'wss://' + host;
        if(port != "") wss = wss + ":" + port;
        
        socket = new window.WebSocket(wss);//ws://192.168.179.129:3000
        socket.binaryType = 'arraybuffer';


        socket.onopen = function()
        {

            socket.send(jsonToString({
                type: 'memberList',
                data:{
                    roomName:roomName
                }
            }));

            //向后台发送会议房间号
            socket.send(jsonToString({
                type: 'addRoom',
                roomName: roomName,
                userName: userName,
                token: token
            }));
        };

        socket.onmessage = function (evt) 
        { 
            //console.log('浏览器接收的数据为：' + evt.data);
            var recMsg = JSON.parse(evt.data);
            switch(recMsg.type){
                //已加入人员
                //添加与其对应的peerconnection
                case 'memberList':
                  for(var i=0;i<recMsg.data.length;i++){
                    var rtcPeerConn = _webrtc.createRtcPeerConn(recMsg.data[i].id);
                    _webrtc.addRtcPeerConn({
                        id:recMsg.data[i].id,
                        name:recMsg.data[i].name,
                        rtcPeerCon: rtcPeerConn
                    }); 
                  }
                  //有新的会议人员加入，重建rtcpeerconnection，与其进行交互
                  console.log('rtcPeerConns数组：：：');
                  console.log(_webrtc.rtcPeerConns);
                break;
                //新加入人员
                case 'addmember':
                  if(recMsg.data === false){
                    rtcDialog.showMsg({
                        title: '提示',
                        content: '您已有加入会议'
                    });
                  }
                  else{
                      //有新的会议人员加入，重建rtcpeerconnection，与其进行交互
                      var _rtcPeerConn = _webrtc.createRtcPeerConn(recMsg.data._id);
                      var _id = recMsg.data._id;
                      var _name = recMsg.data._name;
                      var _opt = {
                        id:_id,
                        name:_name,
                        rtcPeerCon: _rtcPeerConn
                      };
                      //添加通道
                      _webrtc.addRtcPeerConn(_opt); 
                      //对其发送offer
                      _webrtc.peerConOffer(_opt);
                      console.log('rtcPeerConns数组：：：');
                      console.log(_webrtc.rtcPeerConns);
                  }
                break;

                case 'offer':
                   var memberId = recMsg.data.toMemberId;
                   var offer = recMsg.data.sdp;
                   //对其发起answer
                   var rtcPeerConn = _webrtc.getPeerConById(memberId);
                   if(rtcPeerConn != undefined){
                        rtcPeerConn.setRemoteDescription(new RTCSessionDescription(offer), function() {
                            rtcPeerConn.createAnswer((answer) => {
                                rtcPeerConn.setLocalDescription(new RTCSessionDescription(answer),function(){
                                    socket.send(JSON.stringify({ 
                                        type: "answer",
                                        data: {
                                            sdp: answer,
                                            toMemberId: memberId
                                        }
                                    }));
                                }, (error) => {
                                    //console.log('error1::' + error.toString())
                                });
                            }, (error) => {
                                //console.log('error1::' + error.toString())
                            });
                        },(error) => {
                            //console.log('error::' + error.toString());
                        });
                   }
                break;
                case 'answer':
                    var memberId = recMsg.data.toMemberId;
                    var answer = recMsg.data.sdp;
                    var rtcPeerConn = _webrtc.getPeerConById(memberId);
                    if(rtcPeerConn != undefined){
                       rtcPeerConn.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                break;
                case 'ice_candidate':
                    //获取于对方匹配的peerconn
                    var memberId = recMsg.data.toMemberId;
                    console.log(memberId);
                    var rtcPeerConn = _webrtc.getPeerConById(memberId);
                    if(rtcPeerConn != undefined){
                        rtcPeerConn.addIceCandidate(new RTCIceCandidate(recMsg.data.candidate));
                    }
                break;
                case 'deleteMember':
                    var id = recMsg.data.id;
                    for(var i=0;i<_webrtc.rtcPeerConns.length;i++){
                        if(_webrtc.rtcPeerConns[i].id == id){
                            _webrtc.rtcPeerConns.splice(i,1);
                            //获取对象
                            var target = '';
                            var list = document.getElementById('vedioList').children;
                            for(var i=0;i<list.length;i++){
                                if(list[i].getAttribute('data-id') == id){
                                    target = list[i];
                                }
                            }
                            try{
                                document.getElementById('vedioList').removeChild(target);
                            }
                            catch(error){
                                console.log('error:' + error.toString());
                                console.log('deleteMembre::' + recMsg.data.id);
                            }
                          break;
                        }
                    }
                break;
                case 'hasSameMember':
                    rtcDialog.showMsg({
                        title: '提示',
                        content: '已有相同名字成员加入会议',
                        callback: function(){
                            window.sessionStorage.setItem('userName','');
                            window.sessionStorage.setItem('roomName','');
                            window.sessionStorage.setItem('token','');
                            window.location.href = '/';
                        }
                    });
                break;
                case 'getMsg':
                    var _msg = recMsg.data.content;
                    var _memberName = recMsg.data.name;
                    var _time = recMsg.data.time;
                    addMessage({
                        content: _msg,
                        memberName: _memberName,
                        time:_time
                    });
                break;
                case 'addServerStream':
                    var stream = recMsg.data.stream;
                    debugger
                    // var video = document.createElement('video');
                    // var item = document.createElement('div');
                    // var span = document.createElement('span');
                    // video.setAttribute('autoplay',true);
                    // video.setAttribute('playsinline',true);
                    // video.setAttribute('muted',true);
                    // try{
                    //     video.src = window.URL.createObjectURL(stream);
                    // }
                    // catch(err){
                    //     video.srcObject = stream;
                    // }
                    // document.body.append(video)
                break;
                case 'videoClose':
                    debugger
                break;
                case 'videoOpen':
                debugger
                break;

            }
        };
        
        socket.onclose = function()
        { 
            // 关闭 websocket
            console.log("连接已关闭..."); 
        };
    }
    else
    {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
}

if(userName == null){
    window.location.href = '/';
}
else if(roomName == null){
    window.location.href = '/room';
}
else{
    document.onreadystatechange = function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            _webrtc.isSupporDrive();
            if(_webrtc.isSupporRTCPeerConnection()){
                rtcDialog.showLoading(0);
                initPage();
                setTimeout(() => {
                    webrtcSocket();
                    addEvent();
                    rtcDialog.hideLoading();

                    // setTimeout(() => {
                    //     socket.send({
                    //         type: 'addStream',
                    //         data:{
                    //         stream:_webrtc.stream
                    //         }
                    //     });
                    // },2000);
                },2000);
            }
        }
    }
}
