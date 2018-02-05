class PropVO {
    public static dataKey = 'prop_base';
    public static key = 'id';
    public static getObject(id: any): PropVO{
        return CM.table[this.dataKey][id];
    }
    //public static maxLevel = 300;//最大关卡数


    public id
    public propdes //arr
    public propname
    public type
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.propdes = data.des;
        this.propname = data.name;
        this.type = data.type;
    }

    public getThumb(){
        return 'prop_thumb_' + this.id + '_jpg';
    }


}