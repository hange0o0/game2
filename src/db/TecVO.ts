class TecVO {
    public static dataKey = 'tec_base';
    public static key = 'id';
    public static getObject(id: any): TecVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }
    //public static maxLevel = 300;//最大关卡数

    public coinlv: number;
    public prop2: string;
    public type: number;
    public des: string;
    public name: string;
    public prop1: string;
    public step: number;
    public level: number;
    public id: number;
    public prop3: string;


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.coinlv = data.coinlv
        this.prop2 = data.prop2
        this.type = data.type
        this.des = data.des
        this.name = data.name
        this.prop1 = data.prop1
        this.step = data.step
        this.level = data.level
        this.id = data.id
        this.prop3 = data.prop3
    }

    public getThumb(){
        return Config.localResRoot + 'tec/tec_'+this.id+'.jpg';
    }


}