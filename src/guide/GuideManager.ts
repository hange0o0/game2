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

    public showGuide(key?){
        if(!this.isGuiding)
            return;
        this.guideKey = ''
        MyTool.stopClick(300);
        egret.callLater(this.guideFun,this);
    }

    public reInit(){
        this.guideRandom = 0;
        this.guidePK = 0;
        this.guideArr[0].text = '亲爱的['+UM.nick+']，欢迎来到卡士世界！'
    }

    private init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){
                self.showGuide()
            },
            text:'亲爱的['+UM.nick+']，欢迎来到卡士世界！',
        })

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'你想成为世界上最强大的卡士吗？卡卡现在将带领你踏上这成为[至强王者]之路！',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'但在这之前，我们必需得弄清一个问题：[什么是卡士?]',
        //})
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'在卡卡看来，所谓的卡士，可以比作是卡兵中的[司令]。',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'他利用手中有限的卡兵进行[排兵布阵]，制定出战顺序后，就让队伍按照他的计划作战，最终为他取得胜利',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'他[不需要参与]到具体的战斗，但却影响了整个的战斗流程，最考验其[运筹帷幄]的能力了',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'不是每个人都有能力做好这件事情，到底你适不适合这样的工作，卡卡要对你进行一下[考查]',
        //})


        this.addGuideObj({
            mc:"MainPageUI.getInstance()['mainGame']['startBtn']",
            text:'[卡士公会]是卡士世界最权威的认证机构，让我们先在这里作个职业认证吧！',
        })

        this.addGuideObj({
            ui:"MainGameUI.getInstance()",
            mc:"this.getMainGameRect()",
            text:'在上方区域呈现的是我们[对手的卡兵]，了解对方的兵阵能方便我们制定合适的战术',
            fun:function(){
                //self.showGuide(MainGameUI.getInstance())
            }
        })


        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"MainPageUI.getInstance().videoBtn",
        //    text:'哎呀，刚才太兴奋忘了看战报数据了！但不用担心，我们还可以在[PK记录]找到刚才的对战记录的。',
        //    hideHand:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //    }
        //})



        //this.addGuideObj({
        //    ui:"CollectUI.getInstance()",
        //    mc:"CollectUI.getInstance()['topUI']['closeBtn']",
        //    text:'我们可是要回到世界首页哦',
        //})

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'参与[究极研究院]的活动，会获得[永久的战力]奖励。',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 2;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    },
        //})

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    mc:"this.getMainRect()",
        //    hideHand:true,
        //    toBottom:true,
        //    text:'因为经常参与他们的活动，会获得[永久的战力]奖励。所以卡卡建议你[每天]都来冲刺一下自己的极限！',
        //})
        //
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 2;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    },
        //    mc:"this.getMainRect()",
        //    hideHand:true,
        //    toBottom:true,
        //    text:'如果实在打不过，也可以与[其它卡士]交流一下，因为你们的题目是[一样的]！',
        //})

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'你的士兵们会不停地清剿[野外势力]，为你赢取功勋！',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 3;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    }
        //})

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 3;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    },
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    hideHand:true,
        //    toBottom:true,
        //    text:'但这种体力活并[不需要]你来[亲自出手]，交给你的卡兵吧，只要他们足够[强大]，清剿起来速度还是会[很快]的',
        //})

        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'在[天梯竞技场]中，系统会为你匹配实力相当[真实玩家]作为对手！你的选择是战力碾压还是智慧征服？卡卡是比较喜欢碾压带来的快感的..',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //        MainPageUI.getInstance()['currentPage'] = 4;
        //        MainPageUI.getInstance().scrollToCurrentPage();
        //        MainPageUI.getInstance().renewPage();
        //    }
        //})
        //
        //this.addGuideObj({
        //    ui:"MainPageUI.getInstance()",
        //    mc:"this.getMainRect()",
        //    text:'[虚空修正场]要挑选出最有天赋的卡士，在里面的PK将[不会受到]卡士真实战力的影响，只要有能力，卡士一样能打败卡皇！',
        //    hideHand:true,
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide(MainPageUI.getInstance())
        //    }
        //})

        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'哦，对了，还有一个重要的事情得提醒你一下：[不要]专注于升级某几个卡兵，[全面发展]才是卡士世界的主题！',
        //})
        //this.addGuideObj({
        //    fun:function(){
        //        self.showGuide()
        //    },
        //    text:'这可是很多新手卡士都会犯的错误哦，卡卡希望你能[避开]。',
        //})
        this.addGuideObj({
            fun:function(){
                self.showGuide()
            },
            text:'卡士世界的介绍到这里就暂告一段落了，当然还有很多未知的[区域]和[技巧]需要玩家你来好好探索',
        })

        this.addGuideObj({
            text:'卡卡希望你能在这里找到属于你的快乐，我会想念你的，88~',
            fun:function(){
                self.isGuiding = false;
                GuideUI.getInstance().hide();
                //MainPageUI.getInstance()['currentPage'] = 0;
                //MainPageUI.getInstance()['mainTask'].visible = true;
                //MainPageUI.getInstance()['helpGroup'].visible = true;
                ////MainPageUI.getInstance().scrollToCurrentPage();
                ////MainPageUI.getInstance().renewPage();
                //GuideUI.getInstance().showHand(MainPageUI.getInstance()['mainTask'])
                //MyCardTaskUI.getInstance().testShow();
            }
        })

    }

    private addGuideObj(obj){
        this.guideArr.push(obj);
    }

    private guideFun(ui){
        var self = this;
        var data = this.guideArr[this.guideStep];
        var guideData:any = {};
        guideData.mc = data.mc;
        if(guideData.mc && typeof guideData.mc == 'string')
            guideData.mc = eval(guideData.mc);
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
