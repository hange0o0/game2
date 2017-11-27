class PKInfoBtn extends game.BaseItem {

    private type: eui.Image;
    private selfIcon: eui.Image;
    private info: eui.Label;
    public constructor() {
        super();

        this.skinName = "PKInfoBtnSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this, this.onClick)

    }

    private onClick(){
        PKMonsterInfoUI.getInstance().show(this.data)
    }

    public dataChanged(){
        var PD = PKData.getInstance()
        var player:PKPlayerData = this.data;
         this.type.source = 'icon_type'+player.type+'_png'
        this.selfIcon.visible = player == PD.myPlayer;
        this.info.text = 'x' + PD.getMonsterSpaceByPlayer(player.id);
    }
}