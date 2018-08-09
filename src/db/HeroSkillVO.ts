class HeroSkillVO {
    public static dataKey = 'hero_skill_base';
    public static key = 'id';
    public static getObject(id): HeroSkillVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }


    public des: string;
    public cd: number;
    public name: string;
    public sv1: number;
    public sv2: number;
    public sv3: number;
    public sv4: number;
    public level: number;
    public heroid: number;
    public id: string;

    public heroLevel = 0;

    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.des = data.des
        this.cd = data.cd * 1000
        this.name = data.name
        this.id = data.id
        this.sv1 = data.sv1
        this.sv2 = data.sv2
        this.sv3 = data.sv3
        this.sv4 = data.sv4

        var temp = this.id.split('_');
        this.heroid = parseInt(temp[0])
        this.level = parseInt(temp[1])
    }

    //public getImage(gay?){
    //    if(gay)
    //        return Config.localResRoot + 'card_gay/card_'+this.id+'.jpg';
    //    return Config.localResRoot + 'card/card_'+this.id+'.jpg';
    //}



    public preLoad(){
         MBase.getData(this.id).preload();
    }

    public getDes(forceRate,fillColor?){
        return this.des.replace('#1',this.fillColor(this.sv1,fillColor)).
            replace('#2',this.fillColor(this.sv2,fillColor)).
            replace('#3',this.fillColor(this.sv3,fillColor)).
            replace('$1',this.changeValue(this.sv1,forceRate,fillColor)).
            replace('$2',this.changeValue(this.sv2,forceRate,fillColor) + '').
            replace('$3',this.changeValue(this.sv3,forceRate,fillColor)).
            replace('#CD',MyTool.toFixed(this.cd/1000,1) + '')   //CD初始时乘了1000
    }

    private fillColor(str,fillColor){
        if(fillColor)
            return MyTool.createHtml(str,0xFFD67F)
        return str
    }

    private changeValue(v,forceRate,fillColor){
        if(!v)
            return;
        return this.fillColor(Math.ceil(v*forceRate),fillColor);
    }

    public getAdd(force){
        var typeAdd = 0;
        var add = (1+force/100)*(1+typeAdd/100);
        return Math.floor(add);
    }

    public getSkillValue(index,force=0){
        var sv = this['sv' + index];
        if(!force)
            return sv
        return Math.floor(sv * (1+force/100));
    }
}