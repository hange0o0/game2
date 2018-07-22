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

        this.helpObj['pos'] = {
            title:'阵容配置',
            list:[
                '[改变位置：]玩家可拖动卡牌进行位置调整',
                '[移除卡牌：]点击卡牌可使其从该阵容中移除',
                '[增加卡牌：]当阵容未达上限时，点击列表中最后一个[+]的位置，可打开[选择卡牌]列表，增加的卡牌会自动放入队列的未端',
                '[查看卡牌：]长按卡牌可弹出卡牌详情',
                '阵容中的卡牌上限取决于玩家的['+TecVO.getObject(4).name+']科技等级，等级越高，阵容中可容纳的卡牌数量越多',
                '玩家可使用[测试]功能对当前卡组进行测试，测试的另一方从自己的进攻/防守阵容中选取',
            ]
        }

        this.helpObj['atkPos'] = {
            title:'进攻阵容',
            list:[
                '每个玩家最多可配置[5个]进攻阵容',
                '在每次出战前，玩家可挑选其中一个进行使用，也可跟据需要对其进行实时调整',
                '在对战中，玩家手牌数量固定为['+PKConfig.maxHandCard+']张，当手牌数量不足时，会随机从[阵容牌库]中抽取卡牌进行补充。当[阵容牌库]的卡牌被抽光时，将不会有新的卡牌加入手牌',
                '阵容中所有卡牌以[6个]为一组[按顺序]进行分组，只有在前一组卡牌全被放入手牌后，才会从下一组进行抽取，以此类推。',
                '玩家可通过调整阵容，一定程度上控制卡牌到手顺序',
            ].concat(this.helpObj['pos'].list)
        }
        this.helpObj['defPos'] = {
            title:'防守阵容',
            list:[
                '每个玩家最多可拥有[5个]防守阵容',
                '玩家可设置防守阵容是否被使用，当设置为[停用]时，系统将[不会]使用其进行防守',
                '当玩家被攻击时，系统会自动从[有效的]防守阵容中随机抽取一个进行迎战',
                '当防守阵容被动出战时，系统会按照玩家配置的顺序使用阵容中卡牌，使用时机取决于当时[能量]是否足够。一但[能量]满足，则会马上被使用',
                '玩家必须最少保有一个开启中的防守阵容',
                '防守阵容中无法使用[法术]卡',
                '防守阵容中的队伍出战时，防御力得到[10%]的加成',
            ].concat(this.helpObj['pos'].list)
        }



        this.helpObj['posChoose'] = {
            title:'选择卡牌',
            list:[
                '玩家可从已解锁卡牌的选择任意卡牌加到阵容中',
                '每张卡牌最多可使用3次',
                '[法术]卡牌可通过兑换或购买获得，仅玩家当集满数量为[' + CardManager.getInstance().maxSkill + ']的卡牌后，即可[永久保有]该卡牌',
                '如果[法术]卡牌没有集满指定数量，玩家也可以将其放入手牌，但战斗时会[产生损耗]',
                '出战后如果战斗取得[胜利]，会返还未使用过的[法术]卡牌；但如果战斗[失败]，则会[移除]本轮出战的[所有]法术卡牌',
            ]
        }

        this.helpObj['slave'] = {
            title:'奴隶系统',
            list:[
                '玩家可击败其它玩家使其成为你的奴隶，也可被其它玩家击败成为其奴隶',
                '点击奴隶列表中的[+]，可打开系统推荐列表，玩家可挑战列表中的玩家进行收服',
                '收服奴隶后，该奴隶获得[2小时]的镇压时间，其不能反抗或被抢夺',
                '当玩家被其它玩家收服后，可在镇压时间结束后进行反抗，反抗成功则可解除奴隶关系，并获得[5分钟]的保护时间',
                '玩家只能有一个主人，但可以有多个奴隶，升级['+TecVO.getObject(3).name+']科技等级，可提升奴隶数量上限',
                '玩家也可自主选择释放自己的奴隶，腾出奴隶空位',
                '玩家可使用钻石增加自己/奴隶的保护/镇压时间，在该段时间内的玩家，不可被攻击/反抗',
                '成为主人后，可跟据奴隶的金币生产效率，获得其[20%]的金币产出收益，但最多只能积累[10小时]，并且收取间隔为[1小时]',
                '成为奴隶后，每小时要进贡一次金币，数量为每小时金币产出的[20%]',
                '奴隶在战役中可获得自身与主人[战力差]的[5%]的战力加成',
            ]
        }


        this.helpObj['hang'] = {
            title:'战役系统',
            list:[
                '玩家可从战役中[获取收益]，收益的数量/物品类型会随着通过战役的推进而获得提高',
                '战役中主要掉落内容为：金币、资源及各种道具，升级对应的资源科技可使获取资源的效率获得[更大]提升',
                '战役累积奖励上限为[10小时]，超过时间则会停止累积',
                '通过战役后会有冷却时间，冷却时间结束后才能继续挑战下一关',
                '由于战役难度逐渐提高，升级[战力科技]提升玩家战力有助于玩家更快通关'
            ]
        }

        this.helpObj['card'] = {
            title:'卡牌系统',
            list:[
                '卡牌分为[单位]和[法术]两种',
                '上阵[单位]卡牌后，系统会按卡牌属性派出对应士兵冲向敌人，如果能[冲破]对方出生点，则会对敌方的队伍生命造成伤害',
                '上阵[法术]卡牌后，系统会释放一次对应法术，法术效果由卡牌属性决定',
                '需要注意的是，只有通过手牌上阵的单位才能对敌方队伍生命造成伤害，通过技能[召唤]出现的单位是具有持续时间且不能伤害敌方队伍生命的',
                '[单位]卡牌类型分为：'+PKConfig.TYPENAME[1] + '、'+PKConfig.TYPENAME[2] + '、'+PKConfig.TYPENAME[3] +'，单位间克制关系为：' + PKConfig.TYPENAME[1] + '->'+PKConfig.TYPENAME[2] + '->'+PKConfig.TYPENAME[3]+ '->'+PKConfig.TYPENAME[1] ,
                '[法术]卡牌分为：'+PKConfig.SKILLTYPENAME[1] + '、'+PKConfig.SKILLTYPENAME[2] + '、'+PKConfig.SKILLTYPENAME[3]+ '、'+PKConfig.SKILLTYPENAME[4]+ '、'+PKConfig.SKILLTYPENAME[5],
                '所有卡牌都需要[能量]才能上阵，不同卡牌需要的能量值会不一样',
                '随着科技等级的提升，会出现更多未解锁的[单位]卡牌，投入指定的数量的金币即可解锁该卡牌',
                '[法术]卡牌可通过购买或兑换获得，当集满数量为[' + CardManager.getInstance().maxSkill + ']的卡牌后，玩家可[永久保有]该卡牌',
                '如果[法术]卡牌没有集满指定数量，玩家也可以将其放入手牌，但战斗会[产生损耗]',
                '出战后如果战斗取得[胜利]，就会返还未使用过的[法术]卡牌；但如果战斗[失败]，则会[移除]本轮出战的[所有法术]卡牌',
                //'玩家可对自己所拥有的卡牌进行投票（加强/削弱），最终投票结果会作为该卡牌的强度调整的依据。每个玩家每天最多可对[10张]卡牌进行投票',
                '[费用：]上阵该卡牌需要的能量',
                '[传送次数：][单位]卡牌在战斗中的出兵次数，达到数量后卡牌失效并移出',
                '[传送间隔：][单位]卡牌的出兵间隔',
                '[持续时间：][法术]卡牌的技能持续时间',
                '[施法间隔：][法术]卡牌触发多次时的触发时间间隔',
                '[血量：]出战士兵的属性，当血量降为为0时，该单位[死亡]',
                '[防御：]出战士兵的属性，能减少每次敌方士兵对其攻击造成的伤害',
                '[移动速度：]出战士兵的属性，数值越大，移动越快',
                '[伤害：]出战士兵的属性，冲破对方出生点后对敌方[队伍生命]造成的伤害值，如果对方[队伍生命]生命降为[0]，则取得战斗胜利',
                '[攻击力：]出战士兵的属性，数值越大，对敌方士兵的伤害越大',
                '[攻击间隔：]出战士兵的属性，每次攻击的出手间隔时间',
                '[攻击距离：]出战士兵的属性，攻击发出时与敌人的最大距离',
                '[生物体积：]出战士兵的属性，当战场中已方的生物体积之和大于等于' + PKConfig.maxMonsterSpace + '时，上阵卡牌暂停出兵',
                '[技能间隔：]出战士兵的属性，士兵所拥有技能的触发时间间隔',
            ]
        }

        this.helpObj['pk'] = {
            title:'对战说明',
            list:[
                '战斗界面由上往下分别为[对方出牌记录区]，[战场]，我的[出战区]，我的[手牌区]',
                '战斗的过程一般为：从[手牌]选择合适的卡牌->将其拖入[出战区]-> [出战区]的卡牌生效后出现在[战场]-> [战场]中的单位冲过敌方出生点后造成伤害->当其中一方的生命被消耗为0时，游戏结束',
                //'注意，当进入战斗时，战场中部会出现[防御石]，所有攻击其的单位会为已方队伍获取1点防御积分，每满5点积分增加1点队伍防御。[防御石]被攻击满50次后消失，由此刻起双方短兵相接',
                '当战斗卡牌被放入[出战区]时，都有[3秒]的准备时间，准备时间过后，卡牌才会生效。',
                '当玩家的能量[大于等于18点且空场]时，系统会自动为玩家上阵一张[【'+SkillVO.getObject(501).name+'】]。其效果为：' + SkillVO.getObject(501).des,
                '当玩家空场并且无任何手牌时，系统会[自动]为玩家上阵一张[【'+SkillVO.getObject(502).name+'】]。其效果为：' + SkillVO.getObject(502).des,
                '玩家的队伍生命由'+TecVO.getObject(1).name+'决定，升级科技会获得提升'
            ]
        }

        this.helpObj['force'] = {
            title:'战力说明',
            list:[
                '[战力]是玩家唯一要养成的卡牌属性，升级战力可提升[所有]卡牌的属性值',
                '每1点战力提升可加强单位[1%]的[攻击力]和[生命上限]',
                '如果[单位的技能]具有伤害或回血属性时，也会受到战力加成影响',
                '同理，[法术卡牌]的伤害或回血属性，也会受到战力的加成',
                '总的来说，加强战力会让所有卡牌能力得到同步提升',
            ]
        }

        this.helpObj['tec'] = {
            title:'科技研究',
            list:[
                '玩家可通过科技研究提升自己的战力和资源生产效率',
                '科技研究需要耗费资源，不同的科技需求的资源种类各不相同，需求数量也会随着科技等级而提高',
                '进度条颜色中，[红色]表示离满足需求还[差]的比例，[绿色]表示升级资源占玩家当前所拥有资源的[百分比]',
                '[通用科技：]科技升级与其它非战力、资源类的科技',
                '[战力科技：]升级可提高玩家的总战力，直接影响所有士兵的属性',
                '[金币科技：]玩家每小时会自动获得金币，这里的科技等级越高获得金币也越多。',
                '[资源科技：]研究资源科技可增加玩家在战役中获得对应资源的数量',
            ]
        }

        this.helpObj['fight'] = {
            title:'远征说明',
            list:[
                '玩家进入远征前，需先从自己的卡库中选取一套卡组作为远征的基础卡组，其中携带的法术卡牌会在[进入时]算作已出战[消耗]',
                '进入远征后,每次战斗[都会消耗]玩家[战斗中]所使用的卡牌，无论是法术还是单位',
                '如果玩家战斗胜利，即可进入下一轮战斗，并可从[9张补充卡牌]中选择其中[5张]加入到你的远征卡组',
                '玩家每次战斗胜利可获得[秘石]及技能奖励，通过的轮次越多，获得的奖劢越丰厚',
                '玩家可使用秘石在远征商店中兑换各种资源和技能，商店中的道具类别会在每天0点刷新',
                '每次远征战斗，敌人只会有[三种]卡牌，但可多次出战（可超过3张）',
                '每天玩家可免费进行一次远征，超出次数可使用[100钻石]进行重置',
            ]
        }




        this.helpObj['temp'] = {
            list:[
                '玩家的体力上限是'+UM.maxEnergy+',每['+30+'分钟]回复1点体力'
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

        for(var i=0;i<this.helpObj['card'].list.length;i++)
        {
            var str = this.helpObj['card'].list[i];
            if(str.indexOf('解锁') == -1 && str.indexOf('投票') == -1)
            {
                this.helpObj['pk'].list.push(str)
            }
        }
    }




    public getInfoText(){
        var text = ArrayUtil.randomOne(this.infoList);
        return text.replace(/\[/g,'<font color="#E0A44A">').replace(/\]/g,'<\/font>')
    }

    public showHelp(key,fun?){
        HelpUI.getInstance().show(this.helpObj[key],fun);
    }



}