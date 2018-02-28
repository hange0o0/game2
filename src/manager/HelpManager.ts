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

        this.helpObj['atkPos'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }
        this.helpObj['defPos'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['pos'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['posChoose'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }
        this.helpObj['pk'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }
        this.helpObj['slave'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['view'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['hang'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['card'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }


        this.helpObj['tec'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }



        this.helpObj['shop'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['mail'] = {
            title:'究极研究院说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
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

    public showHelp(key){
        HelpUI.getInstance().show(this.helpObj[key]);
    }



}