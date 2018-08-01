class MainBottomBtn extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainBottomBtnSkin";
    }

    private text: eui.Label;
    private mc: eui.Image;
    private redMC: eui.Image;
    private lockMC: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        MainUI.getInstance().onBottomSelect(this.data.index)
    }
   public dataChanged(){
        this.text.text = this.data.text
        this.mc.source = this.data.source
       this.renewRed();
    }

    public renewRed(){
        this.redMC.visible = false;
        this.lockMC.visible = false;
        switch(this.data.type)
        {
            case 'slave':
                break;
            case 'main':
                break;
            case 'card':
                break;
            case 'hero':
                this.lockMC.visible = true
                break;
        }
    }

    public select(b,mv=true){
         egret.Tween.removeTweens(this)
         egret.Tween.removeTweens(this.text)
         egret.Tween.removeTweens(this.mc)
        if(mv)
        {
            var tw1 = egret.Tween.get(this)
            var tw2 = egret.Tween.get(this.text)
            var tw3 = egret.Tween.get(this.mc)
            var cd = 200
            if(b)
            {
                tw1.to({width:200},cd)
                tw2.to({alpha:1},cd)
                tw3.to({bottom:50},cd)
            }
            else
            {
                tw1.to({width:110},cd)
                tw2.to({alpha:0},cd)
                tw3.to({bottom:20},cd)
            }
        }
        else
        {
            if(b)
            {
                this.width = 200
                this.text.alpha = 1
                this.mc.bottom = 50
            }
            else
            {
                this.width = 110
                this.text.alpha = 0
                this.mc.bottom = 20
            }
        }

    }

}