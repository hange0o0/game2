/**
 *
 * @author 
 *
 */
class GuideManager {
    private static _instance: GuideManager;
    public currentStepId: Number;
    public isGuiding:boolean=false;

    public temp;


    public guideKey;
    public guideStep = 0;

    public guideRandom = 0;
    public guidePK = 0;


    private guideArr = [];
    public constructor() {
        this.init();
    }

    public static getInstance(): GuideManager {
        if(!this._instance)
            this._instance = new GuideManager();
        return this._instance;
    }

    public enableScrollV(scroller){
        scroller.scrollPolicyV = this.isGuiding? eui.ScrollPolicy.OFF:eui.ScrollPolicy.AUTO
    }

    public showGuide(){
        if(!this.isGuiding)
            return;
        this.guideKey = ''
        MyTool.stopClick(300);
        egret.callLater(this.guideFun,this);
    }

    public reInit(){
        this.guideRandom = 0;
        this.guidePK = 0;
        this.guideArr[0].text = '['+UM.nick+']您好，欢迎来到召唤争霸！'
    }

    private init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){
                self.showGuide()
            },
            text:'',
        })

        this.addGuideObj({
            mc:function(){return MainFightUI.getInstance().mapBtn.openBtn},
            text:'来不及多解释了，赶快开战吧！',
        })

        this.addGuideObj({
            toBottom:100,
            mc:function(){return BasePosUI.getInstance().pkBtn},
            text:'出战卡牌我都给你配好了，赶快开始吧！',
        })

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkTop},
            text:'这是对方出牌的记录区，顺序记录了敌人所有出过的卡牌。',
            guideKey:'pkTop',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().scroller},
            text:'这是战场，对战双方会在这里短兵相接，你来我往，争取胜机。',
            guideKey:'scroller',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkCtrlCon.overMC},
            text:'这是出战区，放在出战区的卡牌会按其效果在战场上起到相应作用。',
            guideKey:'overMC',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkCtrlCon.cardGroup},
            text:'这是手牌区,里面是玩家可选择出战的卡牌。',
            guideKey:'cardGroup',
            fun:function(){
                self.showGuide()
            }
        })


        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkCtrlCon.costGroup},
            text:'这是手牌能量,上阵卡牌需耗费不同的能量。',
            guideKey:'cost',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkCtrlCon.cardObj[1]},
            text:'请选择一张需要上阵的卡牌。',
            guideKey:'card',
        })

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkCtrlCon.overMC},
            text:'点击出战区，可把所选卡牌上阵。玩家也可以通过拖放动作实现此操作',
            guideKey:'addCard',
        })

        this.addGuideObj({
            text:'当战斗卡牌被放入[出战区]时，都会有3秒的准备时间，准备时间过后，卡牌才会生效。',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            text:'由此可见，对战时的预判能力是非常重要的。现在你可以继续放入你的手牌。',
            fun:function(){
                PKingUI.getInstance().showCountDown()
                GuideUI.getInstance().hide();
            }
        })

        //this.addGuideObj({
        //    mc:function(){return PKVideoCon.getInstance().getItemByID(1).monsterMV.getRect()},
        //    text:'这是防御石,所有攻击其的单位，都会为已方队伍赚取防御积分，增加队伍的防御属性',
        //    guideKey:'diamondMonster',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})

        this.addGuideObj({
            mc:function(){return PKingUI.getInstance().pkTop.hpGroupIcon},
            text:'这是队伍生命,当敌方单位冲破敌方出生点后会造成伤害，当生命值为降为0时就会失败。',
            guideKey:'hp',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            text:'好了,现在就开始你的表演吧',
            guideKey:'pk',
            fun:function(){
                PKingUI.getInstance().setStop(false);
                GuideUI.getInstance().hide();
            }
        })

        this.addGuideObj({
            text:'基于召唤的对战玩法介绍，到这里就结束了。',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            text:'但游戏内还有其它好玩功能，需要玩家您慢慢探索。如有需要，可点击界面内的帮助按钮查看相关说明。',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            text:'我觉得以您的智慧，应该也不再需要我的手把手教学了吧？',
            fun:function(){
                self.showGuide()
            }
        })

        this.addGuideObj({
            text:'那我就此别过，以后有机会一起驰骋疆场吧！',
            fun:function(){
                self.endGuide()
            }
        })
    }

    private endGuide(){
        this.isGuiding = false;
        GuideUI.getInstance().hide();
    }

    private addGuideObj(obj){
        this.guideArr.push(obj);
    }

    private guideFun(ui){
        var self = this;
        var data = this.guideArr[this.guideStep];
        var guideData:any = {};
        guideData.mc = data.mc;
        //if(guideData.mc && typeof guideData.mc == 'string')
        //    guideData.mc = eval(guideData.mc);
        if(guideData.mc && typeof guideData.mc == 'function')
            guideData.mc = guideData.mc();
        guideData.fun = data.fun;
        guideData.text = data.text;
        guideData.toBottom = data.toBottom;
        guideData.hideHand = data.hideHand || false;

        this.guideKey = data.guideKey

        var testUI = data.ui
        if(testUI && typeof testUI == 'string')
            testUI = eval(testUI);

        if(testUI && ui != testUI)
            return;
        this.guideStep ++;
        GuideUI.getInstance().show(guideData)
    }

    private getMainRect(){
        var h = GameManager.stage.stageHeight - 140 -260//Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = 140//(GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }

    private getMainGameRect(){
        return new egret.Rectangle(0,80,640,390);
    }

    private getMainGameRect2(){
        return new egret.Rectangle(0,80+390,640,GameManager.stage.stageHeight-80-100-390);
    }

}
