class SkillVO {
    public static dataKey = 'skill_base';
    public static key = 'id';
    public static getObject(id): SkillVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public isMonster = false;

    public des: string;
    public cd: number;
    public cost: number;
    public name: string;
    public num: number;
    public value: number;
    public id: number;
    //public state: string;
    public level: number;
    public type: number;


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
        //this.state = data.state
        this.level = data.level
        this.type = data.type
    }

    public getImage(){
        return Config.localResRoot + 'card/monster_'+this.id+'.jpg';
    }
    public getBG(){
        return 'border_14_png';
    }
    public getTypeIcon(){
        return 'skill_type'+this.type+'_png';
    }

    public preLoad(){
         SBase.getData(this.id).preload();
    }


}