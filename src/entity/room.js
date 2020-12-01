
class room{
    constructor(){
        this._name = "";
        this._id = "";
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
}

module.exports = room;