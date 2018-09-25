class PropVO {
    public static dataKey = 'prop_base';
    public static key = 'id';
    public static getObject(id: any): PropVO{
        return CM.table[this.dataKey][id];
    }
    //public static maxLevel = 300;//最大关卡数

    public static getObjectByTec(lv){
        var data = CM.table[this.dataKey];
         for(var s in data)
         {
             if(data[s].droplevel == lv)
                return data[s]
         }
        return null;
    }

    public id
    public propdes //arr
    public propname
    public type
    public hanglevel
    public droplevel
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.propdes = data.des;
        this.propname = data.name;
        this.type = data.type;
        this.hanglevel = data.hanglevel;
        this.droplevel = data.droplevel;
    }

    public getThumb(){
        return Config.localResRoot + 'prop/prop_'+this.id+'.png';
    }


}