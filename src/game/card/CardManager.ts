class CardManager {
    private static _instance:CardManager;
    public static getInstance():CardManager {
        if (!this._instance)
            this._instance = new CardManager();
        return this._instance;
    }

    public skillList = {}
    public monsterList = {}

    public init(msg){
        var data = MonsterVO.data;
        for(var s in data)
        {
            if(data[s].level <= UM.level)
                  this.monsterList[s] = true;
        }

        var data = SkillVO.data;
        for(var s in data)
        {
            if(data[s].level <= UM.level)
                this.skillList[s] = true;
        }

        for(var s in msg.monster)
            this.monsterList[msg.monster[s]] = true;

        for(var s in msg.skill)
            this.skillList[msg.skill[s]] = true;
    }

    public getMyMonsterList(type){
        var arr = [];
        for(var s in this.monsterList)
        {
            var vo =  MonsterVO.getObject[s];
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getMySkillList(type){
        var arr = [];
        for(var s in this.skillList)
        {
            var vo =  SkillVO.getObject[s];
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getUpMonsterList(){
        var data = MonsterVO.data;
        for(var s in data)
        {
            //if(data[s].level <= UM.level+1)
            //    this.monsterList.push(parseInt(s));
        }
    }

    public getUpSkillList(){
        var data = SkillVO.data;
        for(var s in data)
        {
            //if(data[s].level <= UM.level+1)
            //    this.skillList.push(parseInt(s));
        }
    }


}