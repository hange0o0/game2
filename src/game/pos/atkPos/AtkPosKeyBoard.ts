class AtkPosKeyBoard extends game.BaseContainer {

    public constructor() {
        super();

        this.skinName = "AtkPosKeyBoardSkin";
    }
    private deleteBtn: eui.Label;
    private upBtn: eui.Label;
    private downBtn: eui.Label;
    private leftBtn: eui.Label;
    private rightBtn: eui.Label;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.upBtn,this.onUp)
        this.addBtnEvent(this.downBtn,this.onDown)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)
    }

    private onDelete(e){
        e.stopImmediatePropagation();
        this.dispatchEventWith('key_change',false,'delete')
    }
    private onUp(e){
        e.stopImmediatePropagation();
        this.dispatchEventWith('key_change',false,'up')
    }
    private onDown(e){
        e.stopImmediatePropagation();
        this.dispatchEventWith('key_change',false,'down')
    }
    private onLeft(e){
        e.stopImmediatePropagation();
        this.dispatchEventWith('key_change',false,'left')
    }
    private onRight(e){
        e.stopImmediatePropagation();
        this.dispatchEventWith('key_change',false,'right')
    }

    private onStage(){
        this.hide()
    }




    public hide(){
        this.removeBtnEvent(this,this.onStage)
        this.visible = false
    }

    public show(){
        this.visible = true
        egret.callLater(function(){
            this.addBtnEvent(this,this.onStage)
        },this)
    }


}