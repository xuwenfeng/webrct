var dal = require('../dal/index');
class member{
    constructor(){
        this.initMemberList();
    }

    initMemberList(){
        this.memberList = [];
        
    }
    
    addMember(member){
        this.memberList.push(member);
        var mdata = [];
        mdata.push({
            'uuid':member.id,
            'name':member.name,
            'roomId':member.roomId,
            'token':member.token,
            'createTime':Date.now()
        });
        // dal.inserData(mdata,'member');
    }

    getMemberListByRoomId(roomid){
        let memberlisttemp = [];
        if(roomid != undefined){
            this.memberList.forEach((item,index) => {
                if(item.roomId == roomid){
                    memberlisttemp.push({
                        name:item.name,
                        id:item.id,
                        roomId:item.roomId
                    });
                }
            });
        }
        return memberlisttemp;
    }

    hasMember(member){
        let has = false;
        if(this.memberList.length > 0){
            this.memberList.forEach((item) => {
                if(item == member){
                    has = true;
                    return false;
                }
            })
        }
        return has;
    }

    hasMemberByName(name){
        let has = false;
        if(this.memberList.length > 0){
            this.memberList.forEach((item) => {
                if(item.name == name){
                    has = item.id;
                }
            })
        }
        return has;
    }

    removeMember(id){
        let num = 0;
        this.memberList.forEach((item,index) => {
            if(item.id == id){
                num++;
                this.memberList.splice(index,1);
                // dal.removeData({uuid:id},'member');

                return false;
            }
        });
        return num
    }

    getMemberNameById(id){
        let name = ''
        this.memberList.forEach((item,index) => {
            
            if(item.id == id){
                name = item.name;
                return false;
            }
        });
        return name;
    }
}

module.exports = member;