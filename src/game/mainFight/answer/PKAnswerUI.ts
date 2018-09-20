class PKAnswerUI extends game.BaseWindow {

    private static _instance:PKAnswerUI;

    public static getInstance():PKAnswerUI {
        if (!this._instance)
            this._instance = new PKAnswerUI();
        return this._instance;
    }

    private titleText: eui.Label;
    private list1: eui.List;
    private list2: eui.List;
    private btn0: eui.Button;
    private btn: eui.Button;
    private videoBtn: eui.Group;



    private questionList
    private answerList

    public constructor() {
        super();
        this.skinName = "PKAnswerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list1.itemRenderer = PKAnswerItem
        this.list2.itemRenderer = PKAnswerItem
        this.addBtnEvent(this.btn,this.onClick)
        this.addBtnEvent(this.btn0,this.onAuto)
        this.addBtnEvent(this.videoBtn,this.onVideo)
    }

    private onClick(){
        PKAnswerManager.getInstance().pk(()=>{
            this.hide()
        });
    }
    private onAuto(){
        var self = this;
        var history = SharedObjectManager.getInstance().getMyValue('answer_video') || {}
        PKBeforeUI.getInstance().show({
            stopAdd:true,
            title:'调整出战顺序',
            noTab:true,
            stopTest:true,
            isActive:true,
            cardBase:{force:1000,type:0},
            otherList:this.questionList,
            history:history.history,
            list:history.answerList || this.answerList,
            fun:function(data,hero){
                PKAnswerManager.getInstance().pk(()=>{
                    self.hide()
                },data);
                history.answerList = data;
                SharedObjectManager.getInstance().setMyValue('answer_video',history)
            }
        })
    }
    private onVideo(){
        var history = SharedObjectManager.getInstance().getMyValue('answer_video') || {}
        PKHistoryUI.getInstance().show(history.history);
    }

    public onShow(){
        var PAM = PKAnswerManager.getInstance();
        var oo = PAM.getActiveInfo()
        this.titleText.text = '迷题'+ (oo.index + 1)

        var data = PAM.questionData[oo.index+1]
        this.list1.dataProvider = this.changeData(data.answer,true)
        this.list2.dataProvider = this.changeData(data.question)

        this.answerList = data.answer;
        this.questionList = data.question;

        this.addPanelOpenEvent(GameEvent.client.active_end,this.hide)

        var history = SharedObjectManager.getInstance().getMyValue('answer_video') || {}
        if(history.time && history.time < PKActiveManager.getInstance().getCurrentActive().start)
        {
            SharedObjectManager.getInstance().setMyValue('answer_video',{})
        }
        this.videoBtn.visible = history.history && history.history.length > 0
    }

    private changeData(str,hideIndex?){
        var arr = str.split(',')
        for(var i=0;i<arr.length;i++)
        {
            arr[i] = {
                id:arr[i],
                index:hideIndex?'':i+1
            }
        }
        return new eui.ArrayCollection(arr);
    }
}