var userName = window.sessionStorage.getItem('userName');

var initPage = function(){
    document.getElementById('mwnName').textContent = userName;
}

var addEvent = function(){
    var nextBtn = document.querySelector('#nextBtn');
    var nameIpt = document.querySelector('#roomName');

    nextBtn.onclick = function(event){
        var  _value = trim(nameIpt.value);
        if(!isEmpty(_value)){
            window.sessionStorage.setItem('roomName',_value);  
            window.location.href = '/meet';
        }
        else{
            rtcDialog.showMsg({
                title:'提示',
                content:'请输入会议房间'
            })
        }
    }
}

if(userName != null){
    document.onreadystatechange = function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            initPage();
            addEvent();
        }
    }
}
else{
    window.location.href = '/';
}