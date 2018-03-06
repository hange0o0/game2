class PKBeforeUI{

    private static _instance: PKBeforeUI;
    public static getInstance(): PKBeforeUI {
        if(!this._instance)
            this._instance = new PKBeforeUI();
        return this._instance;
    }


    public constructor() {
    }


    public show(dataIn?){
       BasePosUI.getInstance().show('atk',dataIn)
    }

    public hide(){
        if(PKManager.getInstance().pkType == PKManager.TYPE_TEST)
            PopUpManager.testVisible()
        else
            BasePosUI.getInstance().hide()
    }


}