function trim(str){
    return str.replace(/\s+/g,'');
}

function isEmpty(str){
    return str === '' ? true : false;
}

function uuid(len){
    if(len == undefined) len = 14;
    var _base = 'abcdefghijklnmopqrstABCDEFGHIJKLNMOPQRST1234567890';
    var _result = '';
    for(var i=0;i<len;i++){
        var _index = parseInt(Math.random() * 50);
        _result += _base.substr(_index,1);
    }
    return _result;
}

function jsonToString(json){
    return JSON.stringify(json);
}

function rtcDialogClass(){
    this.frame = [];
    this.showMsg = function(opt){
        var _uuid = uuid(10);
        var _index = -1;
        var frame = document.createElement('div');
        frame.setAttribute('class','dialog-frame');
        frame.setAttribute('uuid',_uuid);
        var btn = document.createElement('button');
        btn.textContent = '确 定';
        this.frame.push({
            frame : frame,
            uuid : _uuid
        });
        _index = this.frame.length;
        var _html = `<div class="dialog-box">
            <div class="db-title">
                ${opt.title}
            </div>
            <div class="db-content">
                ${opt.content}
            </div>
            <div class="db-ctr">
                
            </div>
        </div>`;
        frame.innerHTML = _html;
        frame.getElementsByClassName('db-ctr')[0].appendChild(btn);
        document.body.appendChild(frame);
        if(opt.callback){
            btn.onclick = opt.callback;
        }
        else{
            var _this = this;
            btn.onclick = function(event){
                document.body.removeChild(frame);
                _this.frame.splice(_index - 1,1);
            }
        }
    };
    this.showLoading = function(time){
        var _uuid = uuid(10);
        var _index = -1;
        var frame = document.createElement('div');
        frame.setAttribute('class','dialog-frame');
        frame.setAttribute('uuid',_uuid);
        this.frame.push({
            frame : frame,
            uuid : _uuid
        });
        _index = this.frame.length;
        if(time == undefined) time = 3000;
        var _html = `<div class="loading-box">
            <span class="icon iconfont">&#xe65d;</span>
        </div>`;
        frame.innerHTML = _html;
        document.body.appendChild(frame);
        if(time != 0){
            var _this = this;
            setTimeout(function(){
                document.body.removeChild(frame);
                _this.frame.splice(_index - 1,1);
            },time);
        }
    }
    this.hideLoading = function(){
        document.body.removeChild(this.frame[0].frame);
    }
}

var rtcDialog = new rtcDialogClass();