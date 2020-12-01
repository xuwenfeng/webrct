var gvUrl = document.getElementById('gv-url'),
    gvBtn = document.getElementById('gv-btn');

gvBtn.onclick = function(event){
    var _url = gvUrl.value;
    var i = 0;
    var _time = setInterval(function(){
        if(i < 10){
            var id = "i" + parseInt(Math.random() * 100000000000);
            _url = _url + "&random=" + Math.random();
            _url = _url + "&id=" + id;
            loadImg(_url + Math.random(),id);
        }
        else{
            clearInterval(_time);
        }
        i++;
    },500)
}

function loadImg(_url,_id){
    var img = document.createElement('img');
    var div = document.createElement('div');
    var strong = document.createElement('strong');
    var p = document.createElement('p');
    var ilw = document.getElementById('img-list-wrap');
    var li = document.createElement('li');
    var btn = document.createElement('input');
    img.src = _url;
    div.setAttribute('class','vl-result');
    strong.textContent = '结果';
    btn.type = "button";
    btn.value = "破解";
    btn.onclick = function(event){
        //获取验证结果
        $.ajax({
            url:"http://www.xxxx.com.cn?id=" + _id,
            type:"GET",
            dataType:"json",
            suceess:function(result){
                div.style.display = 'block';
                p.textContent = result.msg;
            }
        });
    };
    li.appendChild(img);
    li.appendChild(div);
    div.appendChild(strong);
    div.appendChild(p);
    li.appendChild(div);
    li.appendChild(btn);
    ilw.appendChild(li);
}