var UUID = require('node-uuid');
var roomEntity = require('../entity/room');
var dal = require('../dal/index');
class room{
    constructor(){
        this.initRoomList();
    }

    initRoomList(){
        this.roomList = [];
    }
    
    addRoom(rn){
        let re = new roomEntity();
        let uuid = UUID.v4();
        re.id = uuid;
        re.name = rn
        this.roomList.push(re);

        var mdata = [];
        mdata.push({
            'uuid':uuid,
            'name':rn,
            'createTime':Date.now()
        });
        // dal.inserData(mdata,'room');

        return uuid;
    }

    getRoomList(){
        return this.roomList;
    }

    getRoomByName(roomName){
        let sign = false;
        if(this.roomList.length > 0){
            for(let i=0;i<this.roomList.length;i++){
                if(this.roomList[i].name == roomName){
                    sign = this.roomList[i].id;
                    break;
                }
            }
        }
        return sign;
    }

    getRoomIdByRoomName(name){
        let id = '';
        for(let i=0;i<this.roomList.length;i++){
            if(this.roomList[i].name == name){
                id = this.roomList[i].id;
                break;
            }
        }
        return id;
    }
}

module.exports = room;