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
    private btn: eui.Button;



    public constructor() {
        super();
        this.skinName = "PKAnswerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list1.itemRenderer = PKAnswerItem
        this.list2.itemRenderer = PKAnswerItem
        this.addBtnEvent(this.btn,this.onClick)
    }

    private onClick(){
        PKAnswerManager.getInstance().pk(()=>{
            this.hide()
        });
    }

    public onShow(){
        var PAM = PKAnswerManager.getInstance();
        var oo = PAM.getActiveInfo()
        this.titleText.text = '迷题'+ (oo.index + 1)

        var data = PAM.questionData[oo.index+1]
        this.list1.dataProvider = this.changeData(data.answer,true)
        this.list2.dataProvider = this.changeData(data.question)

        this.addPanelOpenEvent(GameEvent.client.active_end,this.hide)
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