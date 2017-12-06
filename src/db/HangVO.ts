class HangVO {
    public static dataKey = 'hang_base';
    public static key = 'id';
    public static getObject(id: number): PropVO{
        return CM.table[this.dataKey][id];
    }
    public static maxLevel = 300;//最大关卡数

    public id
    public force //arr
    public list
    public award
    public constructor(data?: any) {
        if(data)
            this.fill(data);
    }

    public fill(data){
        this.id = data.id;
        this.list = data.list;
        this.force = data.force;
        this.award = data.award;
    }
}