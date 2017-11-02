class MonsterVO {
    public static dataKey = 'monster';
    public static key = 'id';
    public static getObject(id: number): MonsterVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public width: number;
    public height: number;
    public atk: number;
    public type: number;
    public headoff: number;
    public atkcd: number;
    public cost: number;
    public def: number;
    public cd: number;
    public num: number;
    public atkrage: number;
    public tag: string;
    public mcnum: number;
    public mcheight: number;
    public name: string;
    public num2: number;
    public des: string;
    public speed: number;
    public hp: number;
    public skillcd: number;
    public id: number;
    public mcwidth: number;
    public atk2: number;
    public mv_atk: number;


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.width = data.width
        this.height = data.height
        this.atk = data.atk
        this.type = data.type
        this.headoff = data.headoff
        this.atkcd = data.atkcd * 1000
        this.cost = data.cost
        this.def = data.def
        this.cd = data.cd * 1000
        this.num = data.num
        this.num2 = data.num2
        this.atkrage = data.atkrage
        this.tag = data.tag
        this.mcnum = data.mcnum
        this.mcheight = data.mcheight
        this.name = data.name
        this.des = data.des
        this.speed = data.speed
        this.hp = data.hp
        this.id = data.id
        this.mcwidth = data.mcwidth
        this.atk2 = data.atk2
        this.skillcd = data.skillcd * 1000
        this.mv_atk = data.mv_atk * 1000
    }

    public get thumb(){
        return 'prop_thumb_' + this.id + '_jpg';
    }

    public preLoad(){
         MBase.getData(this.id).preload();
    }


}