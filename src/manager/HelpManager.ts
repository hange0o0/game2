class HelpManager {
    private static _instance:HelpManager;

    public static getInstance():HelpManager {
        if (!this._instance)
            this._instance = new HelpManager();
        return this._instance;
    }

    private helpObj = {};
    private infoList = [];
    public constructor() {

        this.helpObj['day'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力',
                '研究院每天会推出[10个]关卡让玩家进行挑战，[难度]和[奖励]会逐渐[递增]',
                '在研究院中，每次挑战都需花费[1点]体力',
                '玩家在研究院的挑战中能获得[大量奖励]，[性价比]远高于其它PK玩法',
                '在[同一服务器]的所有玩家，研究院中推出的手牌和所遇到的关卡是[一样]的，跟同服的其它玩家交流通关心得会让你在通关的过程中少走弯路',
                '研究院中玩家在偶数关卡取得胜利，就会获得[1点]战力奖励',
                '研究院挑战中玩家使用的是[修正场规则]（玩家的手牌战力固定为1000，与玩家的实际战力[无关]）'
            ]
        }


        this.helpObj['temp'] = {
            list:[
                '卡兵升级的最优化选择是：[平衡发展]，只有在所有卡兵等级一致时，才优先选择自己擅长的',
                '玩家的体力上限是'+UM.maxEnergy+',每['+30+'分钟]回复1点体力。购买体力回复加速后，回复时间将缩短为[24分钟]'
            ]
        }

        for(var s in this.helpObj)
        {
            var oo = this.helpObj[s];
            for(var ss in oo.list)
            {
                var text = oo.list[ss];
                this.infoList.push(text);
            }
        }
    }




    public getInfoText(){
        var text = ArrayUtil.randomOne(this.infoList);
        return text.replace(/\[/g,'<font color="#E0A44A">').replace(/\]/g,'<\/font>')
    }

    //public mainHelp(){
    //    HelpUI.getInstance().show(this.helpObj['main']);
    //}


}