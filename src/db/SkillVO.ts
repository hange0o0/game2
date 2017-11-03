class SkillVO {
    public static dataKey = 'skill';
    public static key = 'id';
    public static getObject(id: number): SkillVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public des: string;
    public cd: number;
    public cost: number;
    public name: string;
    public num: number;
    public value: number;
    public id: number;
    public state: string;
    public type: string;


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.des = data.des
        this.cd = data.cd * 1000
        this.cost = data.cost
        this.name = data.name
        this.num = data.num
        this.id = data.id
        this.value = data.value
        this.state = data.state
    }

    public get thumb(){
        return 'prop_thumb_' + this.id + '_jpg';
    }

    public preLoad(){
         SBase.getData(this.id).preload();
    }


}