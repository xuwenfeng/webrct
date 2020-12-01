var socket = null;
var userName = [
    '阿里巴巴马云',
    '腾讯马化腾',
    '小米雷军',
    '万达王健林',
    '格力董明珠',
    '美的何享健',
    '海尔何瑞敏',
    'TCL李东升',
    '顺丰王卫',
    '百度李彦宏',
    'SOHO潘石屹'
];

var iceServer = {
    "iceServers": [{
        "urls" : ["stun:stun.l.google.com:19302"]
    }, {
        "urls" : ["turn:numb.viagenie.ca"],
        "username" : "webrtc@live.com",
        "credential" : "muazkh"
    }]
};

var canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
var ctx = canvas.getContext('2d');
document.getElementsByClassName('canvas-box')[0].appendChild(canvas);

var mediaOpts = {
    audio: true,
    video: true,
    video: { width: 200, height: 200 }
    // video: { facingMode: "environment"}, // 或者 "user"
}
var rtcPeerConn = new RTCPeerConnection({});


//初始化用户名字
var currentName = userName[parseInt(Math.random() * 10)];
var currentRoome = '';
var currentId = '';
var tagetId = '';

var isCaller = window.location.href.split('#')[1];
//初始化方法
(function(){
    var memberName = document.getElementsByClassName('memberName')[0].getElementsByTagName('h1')[0];
    memberName.textContent = currentName;

    if(isCaller == 'true'){
        document.getElementsByClassName('joinBtn')[0].style.display = 'block';
        addEventListenerForStart();
    }
})();

if ("WebSocket" in window)
{
    // 打开一个 web socket
    socket = new window.WebSocket('wss://127.0.0.1:3030');//ws://192.168.179.129:3000

    
    socket.onopen = function()
    {
        
    };

    socket.onmessage = function (evt) 
    { 
        console.log('浏览器接收的数据为：' + evt.data);
        var received_msg = JSON.parse(evt.data);
        
        switch(received_msg.type){
            case 'setId':
                currentId = received_msg.data.id;
            break;
            case 'roomlist':
                //显示会议室
                var roomlist = document.getElementsByClassName('room-list')[0].getElementsByTagName('ul')[0];
                for(var i in received_msg.data){
                    var li = document.createElement('li');
                    li.textContent = received_msg.data[i]._name;
                    li.setAttribute('room-id',received_msg.data[i]._id);
                    roomlist.appendChild(li);
                }
                addEventListenerForRoomLi();
            break;
            case 'addmember':
                var li = document.createElement('li');
                li.setAttribute('class','member-item');
                li.setAttribute('id',received_msg.data._id);
                var html = `<div class="mi-top">
                        <span class="mi-name">${received_msg.data._name}</span>
                    </div>
                    <div class="mi-main"></div>
                    <div class="mi-bottom">
                        <a href="javascript:;" class="quitBtn">退出</a>
                    </div>`;
                li.innerHTML = html;
                document.getElementsByClassName('member-list')[0].getElementsByTagName('ul')[0].appendChild(li);
            break;
            case 'memberlist':
                for(var i in received_msg.data){
                    var li = document.createElement('li');
                    li.setAttribute('class','member-item');
                    li.setAttribute('id',received_msg.data[i]._id);
                    var html = `<div class="mi-top">
                                    <span class="mi-name">${received_msg.data[i]._name}</span>
                                </div>
                                <div class="mi-main"></div>
                                <div class="mi-bottom">
                                    <a href="javascript:;" class="quitBtn">退出</a>
                                </div>`;
                    li.innerHTML = html;
                    if(received_msg.data[i]._currentMemeber){
                        var video = document.createElement('video');
                        li.getElementsByClassName('mi-main')[0].appendChild(video);
                        li.setAttribute('class','member-item action-item');
                        getUserMedia(video);
                    }
                    document.getElementsByClassName('member-list')[0].getElementsByTagName('ul')[0].appendChild(li);
                }
            break;
            case 'start':
                //发起链接
                rtcPeerConn.createOffer(function(offer) {
                    // var video = document.createElement('video');
                    // getUserMedia1(video,desc.sdp);
                    // document.body.appendChild(video)  
                    rtcPeerConn.setLocalDescription(new RTCSessionDescription(offer),function(){
                        socket.send(JSON.stringify({ 
                            "type": "offer",
                            "data": {
                                "sdp": offer
                            }
                        }));
                    },function(error){
                        console.log(error.toString())
                    });
                },function(error){
                    console.log('error::' + error.toString())
                });
            break;
            case 'offer':
                //收到offer
                //显示
                var offer = received_msg.data.sdp;
                //提前放置
                tagetId = received_msg.data.memberId;
                //连接的offer通常来自于负责匹配的服务器所发送的数据。执行者应调用此方法设置远程描述，然后生成发送到对端计算机的answer。
                //协商两个对等体之间的连接的过程涉及RTCSessionDescription来回交换对象
                rtcPeerConn.setRemoteDescription(new RTCSessionDescription(offer), function() {
                    rtcPeerConn.createAnswer((answer) => {
                        rtcPeerConn.setLocalDescription(new RTCSessionDescription(answer),function(){
                            socket.send(JSON.stringify({ 
                                "type": "answer",
                                "data": {
                                    "sdp": answer
                                }
                            }));
                        }, (error) => {
                            console.log('error1::' + error.toString())
                        });
                    }, (error) => {
                        console.log('error1::' + error.toString())
                    });
                },(error) => {
                    console.log('error::' + error.toString());
                });
                
            break;
            case 'answer':
                var answer = received_msg.data.sdp;
                tagetId = received_msg.data.memberId;
                rtcPeerConn.setRemoteDescription(new RTCSessionDescription(answer));
            break;
            case 'ice_candidate':
                rtcPeerConn.addIceCandidate(new RTCIceCandidate(received_msg.data.candidate));
            break;
            case 'deleteMember':
                var currentId = received_msg.data.id;
                var item = document.getElementById(currentId);
                if(item){
                    document.getElementsByClassName('member-list')[0].getElementsByTagName('ul')[0].removeChild(item);
                }
            break;
            case 'getMsg':
               var content = received_msg.data.content;
               var icmain = document.getElementsByClassName('ic-main')[0];
               var recode = document.createElement('div');
               var name = document.createElement('div');
               name.textContent = received_msg.data.name;
               name.style.color = '#f00';
               name.style.marginBottom = '0px';
               icmain.appendChild(name);
               recode.textContent = content;
               icmain.appendChild(recode)
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
    console.log("您的浏览器不支持 WebSocket!");
}

rtcPeerConn.addEventListener('icecandidate', e => onIceCandidate(e));


//发送给对方answer后便可以等待接受对方的数据流了：
rtcPeerConn.addEventListener('addstream',(event) => {
    var video = document.createElement('video');
    video.setAttribute('id','video2');
    try{
        video.src = window.URL.createObjectURL(event.stream);
    }
    catch(err){
        video.srcObject = event.stream;
    }
    video.play();

    //你到底是那个answer
    document.getElementById(tagetId).getElementsByClassName('mi-main')[0].appendChild(video);

})


//添加监听事件
function addEventListenerForRoomLi(){
    var li = document.getElementsByClassName('room-list')[0].getElementsByTagName('li');
    for(var i in li){
        if(!(typeof li[i] == 'object' && li[i] instanceof HTMLLIElement)) return false;
        li[i].addEventListener('click',function(){
            //获取房间id;
            var rid = this.getAttribute('room-id');
            if(currentRoome == "") currentRoome = rid;
            else if(currentRoome == rid) return false;
            socket.send(JSON.stringify({
                type:'join',
                roomId:rid,
                name:currentName,
                id:currentId
            }))
        },false);
    }
}

//开始会议
function addEventListenerForStart(){
    var startBtn = document.getElementsByClassName('joinBtn')[0];
    startBtn.addEventListener('click',function(){
        //添加到指令服务器，开始会议
        socket.send(JSON.stringify({
            type:'start'
        }));
    },false);
}

//显示
function getUserMedia(video){
    navigator.mediaDevices.getUserMedia(mediaOpts).then(function(stream){
        try{
            video.src = window.URL.createObjectURL(stream);
        }
        catch(err){
            video.srcObject = stream;
        }
        //stream.getTracks().forEach(track => rtcPeerConn.addTrack(track, stream));
        rtcPeerConn.addStream(stream);
        showToCanvas(video);
        video.play();
    }).catch(function(error){
        //处理媒体流创建失败错误
        console.log('getUserMedia error: ' + error);
    });
}

async function onIceCandidate(event) {
    try {
       if (event.candidate !== null) {
           console.log(event.candidate);
             socket.send(JSON.stringify({
                "type": "ice_candidate",
                "data": {
                    "candidate": event.candidate
                }
            }));
        }  
    } catch (e) {
      
    }
}

window.onbeforeunload = window.onclose = function(event) { 
    event.preventDefault();
    socket.send(JSON.stringify({
        "type": "close"
    }));
    socket.close();
    //return confirm("确定离开此页面吗？"); 
}


//发送聊天记录
document.getElementsByClassName('sendMsg')[0].addEventListener('click',function(){
    var inputbox = document.getElementById('inputbox');
    var value = inputbox.value.replace(/\s/g,'');
    if(value){
        socket.send(JSON.stringify({
            type:'sendMsg',
            data:{
                content:value
            }
        }));
        var icmain = document.getElementsByClassName('ic-main')[0];
        var name = document.createElement('div');
        var recode = document.createElement('div');
        name.textContent = currentName;
        recode.textContent = value;
        name.style.textAlign = recode.style.textAlign = 'right';
        name.style.color = '#f00';
        name.style.marginBottom = '0px';
        icmain.appendChild(name);
        icmain.appendChild(recode);
        inputbox.value = "";
    }
    
});

const showToCanvas = function(video){
    var i = 0;
    setInterval(function(){
        ctx.drawImage(video,0,0,200,200);
        var img = document.createElement("img");
        img.width = 100;
        img.height = 100;
        img.src = canvas.toDataURL("image/png");
        i++;
        if(i == 200){
            document.getElementsByClassName('img-box')[0].appendChild(img);
            i = 0;
        }
    },17);
}
