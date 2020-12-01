var video = document.createElement('video');
var videoList = document.getElementById('video-list');
// 配置设置
var mediaOpts = {
    audio: false,
    video: true,
    video: { width: 200, height: 200 }
    // video: { facingMode: "environment"}, // 或者 "user"
}

// 成功回调
function successFunc(stream) {
    if ("srcObject" in video) {
        var videoTracks = stream.getVideoTracks();
        console.log('Using video device: ' + videoTracks[0].label);
        video.srcObject = stream
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream
    }
    videoList.appendChild(video);
    video.play();
}
function errorFunc(err) {
    alert(err.name);
}

// 正式启动摄像头
navigator.mediaDevices.getUserMedia(mediaOpts).then(successFunc).catch(errorFunc);