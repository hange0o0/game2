class PKMonsterItem extends game.BaseItem {
    private barGroup: eui.Group;
    private bar: eui.Rect;


    private monsterMV:MonsterMV
    public constructor() {
        super();
        this.skinName = "PKMonsterItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.monsterMV = new MonsterMV();
        this.addChild(this.monsterMV)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
    }


    public dataChanged(){
        var mD = this.data
        this.monsterMV.load(mD.id)
        this.monsterMV.play();
        this.barGroup.y = 300 - 120;
    }

    public renewHp(){

    }
}