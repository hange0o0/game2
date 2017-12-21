class TopUI extends game.BaseContainer {
    public constructor() {
        super();
    }

    //private closeBtn: eui.Button;
    private titleText: eui.Label;
    private helpBtn: eui.Image;



    public childrenCreated() {
        this.addBtnEvent(this.helpBtn,this.onHelp);
        this.helpBtn.visible = false;
    }

    public onHelp(){

    }

    public setTitle(name:string):void{
        this.titleText.text = name;
    }
    //private backBtnClick(event:egret.TouchEvent):void {
    //    this.dispatchEventWith("hide");
    //}
}