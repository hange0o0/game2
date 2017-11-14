class AtkPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AtkPosItemSkin";
    }

    private des: eui.Label;
    private spaceText: eui.Label;
    private costText: eui.Label;
    private selectMC: eui.Rect;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        this.selectMC.visible = false;
    }

    public renewInsert(myIndex){
        var insert = AtkPosUI.getInstance().insertPos
        this.selectMC.visible = false;
        if(myIndex == 0 && insert == 0)
        {

        }
        else
        {

        }
    }

}