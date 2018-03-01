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
            title:'进攻阵容',
            list:[
                '每个玩家最多可配置5个进攻阵容',
                '在每次出战前，玩家可挑选其中一个进行使用，也可跟据需要对其进行实时调整',
                '对战中，玩家手牌数量固定为'+PKConfig.maxHandCard+'张，当手牌数量不足时，会随机从[选中阵容]中抽取卡牌进行补充。当[选中阵容]的卡牌被抽光时，将不会有新的卡牌加入手牌',
                '阵容中所有卡牌以6个为一组按顺序进行分组，只有在前一组卡牌被抽光后，才会从下一组进行抽取，以此类推。由此，玩家能一定程度上对卡牌的出现顺序进行控制。',
            ]
        }
        this.helpObj['defPos'] = {
            title:'防守阵容',
            list:[
                '每个玩家最多可拥有5个防守阵容',
                '玩家可设置防守阵容是否被使用，当设置为停用时，系统将不会使用其进行防守',
                '当玩家被攻击时，系统会自动从防守阵容中随机抽取一个已启用的阵容进行迎战',
                '当防守阵容被动出战时，系统会按配置的顺序使用阵容中卡牌，使用时机取决于当时[能量]是否足够。一但[能量]满足，则会被马上使用',
                '玩家最少保有一个使用中的防守阵容',
                '防守阵容中的队伍防御力增加[10%]',
            ]
        }

        this.helpObj['pos'] = {
            title:'阵容配置',
            list:[
                '改变位置：玩家可拖动卡牌进行位置调整',
                '移除卡牌：点击卡牌可使其从该阵容中移除',
                '增加卡牌：当阵容未达上限时，点击列表中最后一个[+]的位置，可打开[选择卡牌]列表，增加的卡牌会自动放入队列的最后端',
                '查看卡牌：长按卡牌可弹出卡牌详情',
                '阵容中的卡牌上限取决于玩家的['+TecVO.getObject(4).name+']科技等级，等级越高，阵容可容纳的卡牌越多',
                '玩家可使用[测试]攻能对当前卡组进行测试，测试对手由玩家从自己的进攻/防守阵容中选取',
            ]
        }

        this.helpObj['posChoose'] = {
            title:'选择卡牌',
            list:[
                '玩家可从已解锁的卡牌中选择任意卡牌加到阵容中',
                '每张卡牌最多可使用3次',
                '卡牌分为[单位]和[法术]两种，玩家可通过TAB进行切换',
            ]
        }
        this.helpObj['pk'] = {
            title:'对战说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }
        this.helpObj['slave'] = {
            title:'奴隶系统',
            list:[
                '玩家可击败其它玩家使其成为你的奴隶，也可被其它玩家击败成为其奴隶',
                '点击列表中的[+]，可打开系统推荐列表，玩家可挑战列表中的玩家进行收服，也可抢夺其奴隶，甚至其奴隶的奴隶',
                '收服奴隶成功后，该奴隶获得2小时的保护时间，不能反抗或被抢夺',
                '当玩家被其它玩家收服后，可进行反抗，反抗成功则可解除奴隶关系，并获得5分钟的保护时间',
                '玩家只能有一个主人，但可以有多名奴隶，升级['+TecVO.getObject(3).name+']科技等级，可提升奴隶数量上限',
                '玩家也可自主选择释放自己的奴隶，腾出奴隶空位',
                '玩家可使用钻石增加自己/奴隶的保护时间，保护时间内的玩家，不可被攻击/反抗',
                '成为主人后，可跟据奴隶的生产效率，获得其20%的[生产金币]收益，最多只能积累8小时，收取间隔为1小时',
                '成为奴隶后，金币生产效率下降20%',
            ]
        }

        this.helpObj['view'] = {
            title:'关注列表',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['hang'] = {
            title:'战役系统',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['card'] = {
            title:'卡牌系统',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }


        this.helpObj['tec'] = {
            title:'科技研究',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }



        this.helpObj['shop'] = {
            title:'商城说明',
            list:[
                '究极研究院的老怪物们醉心于卡兵的终极力量，试图开发出每个卡兵[以弱胜强]的能力'
            ]
        }

        this.helpObj['mail'] = {
            title:'邮箱说明',
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