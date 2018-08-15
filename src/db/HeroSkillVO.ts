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
    public skillcd: number;
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
        this.skillcd = data.skillcd * 1000
        this.name = data.name

        this.heroid = data.heroid
        this.level = data.level
        this.sv1 = data.sv1
        this.sv2 = data.sv2
        this.sv3 = data.sv3
        this.sv4 = data.sv4

        this.id = data.heroid +'_' + this.level
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
            replace('#CD',MyTool.toFixed(this.skillcd/1000,1) + '')   //CD初始时乘了1000
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

    public getSkillValue(index,user?){
        var PD = PKData.getInstance();
        var sv = this['sv' + index];
        if(DEBUG)
        {
            if(user && this.des.indexOf('$'+index) == -1)
                throw new Error(this.id + '_$' + index)
            else if(!user && this.des.indexOf('#'+index) == -1)
                throw new Error(this.id + '_#' + index)
        }
        if(!user)
            return sv
        var force = PD.getPlayer(user.owner).force
        return Math.floor(sv * (1+force/100));
    }
}