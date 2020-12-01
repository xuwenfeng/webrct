class member{
    constructor(){
       this._id = '';
       this._name = '';
       this._roomId = '';
    }

    set name(name){
        this._name = name
    };

    get name(){
        return this._name;
    }

    set id(id){
        this._id = id
    };

    get id(){
        return this._id;
    }

    set roomId(roomId){
        this._roomId = roomId
    };

    get roomId(){
        return this._roomId;
    }
}

module.exports = member;