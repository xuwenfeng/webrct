var userName = window.sessionStorage.getItem('userName');

var addEvent = function(){
    var nextBtn = document.querySelector('#nextBtn');
    var nameIpt = document.querySelector('#userName');

    nextBtn.onclick = function(event){
        var  _value = trim(nameIpt.value);
        if(!isEmpty(_value)){
            window.sessionStorage.setItem('userName',_value);  
            window.sessionStorage.setItem('token',uuid(14));
            window.location.href = '/room';
        }
        else{
            rtcDialog.showMsg({
                title:'提示',
                content:'请输入姓名'
            })
        }
    }
}

if(userName == null || userName == ''){
    document.onreadystatechange = function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            addEvent();
        }
    }
}
else{
    window.location.href = '/room';
}