class PKHeroInfoUI extends game.BaseContainer {

    private static _instance: PKHeroInfoUI;
    public static getInstance(): PKHeroInfoUI {
        if(!this._instance)
            this._instance = new PKHeroInfoUI();
        return this._instance;
    }

    private cardGroup: eui.Group;
    private bg: eui.Image;
    private pkInfoText: eui.Label;
    private barMC: eui.Rect;
    private rateText: eui.Label;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private teamIcon: eui.Image;
    private nameText: eui.Label;
    private infoList: eui.List;
    private skillList: eui.List;




    private inPK = false
    public dataIn
    public heroItem;

    private stageX
    private stageY
    public constructor() {
        super();
        this.skinName = "PKHeroInfoSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.infoList.itemRenderer = PKCardInfoItem
        this.skillList.itemRenderer = HeroInfoItem
        this.heroItem = new HeroMVItem()
        this.heroItem.x = 110
        this.heroItem.y = 200
        this.heroItem.scaleX = -1
        this.cardGroup.addChild(this.heroItem);
    }


    public show(v){
        this.inPK = true;
        GameManager.container.addChild(this);
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this,true);
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        this.stageX = GameManager.stageX
        this.stageY = GameManager.stageY
        var w = 560
        this.x = Math.min(Math.max(GameManager.stageX - w/2,0),640-w)
        this.renew(v);
        var y = 0;
        if(GameManager.stageY < GameManager.stage.stageHeight/2)
        {
            y = GameManager.stageY + 50
            if(v.target)
            {
                y = v.target.localToGlobal(0,0).y  + v.target.height + 50
            }
            this.y = Math.min(y,GameManager.stage.stageHeight - this.height)
        }
        else
        {
            y = GameManager.stageY - 50 - this.height
            if(v.target)
            {
                y = v.target.localToGlobal(0,0).y  - 50 -this.height
            }
            this.y = Math.max(y,0)
        }
    }

    private onMove(e){
        if(Math.abs(this.stageX - e.stageX) > 20 || Math.abs(this.stageY - e.stageY) > 20)
            this.hide();
    }

    public hide() {
        game.BaseUI.setStopEevent();
        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        MyTool.removeMC(this)
    }


    public renew(v){

        this.dataIn = v;
        this.bg.source = PKManager.getInstance().getBG(HangManager.getInstance().getHangBGID())
        var vo:MonsterVO = MonsterVO.getObject(this.dataIn.mid)
        this.heroItem.load(this.dataIn.mid)
        //this.img.data = vo.id;
        //this.bg.source = vo.getBG();
        this.nameText.text = vo.name;


        if(this.dataIn.rota)
        {
            this.teamIcon.source = this.dataIn.rota == PKConfig.ROTA_LEFT ? 'card_battle2_png' : 'card_battle_png'
            this.teamIcon.visible = true
        }
        else
        {
            this.teamIcon.visible = false
        }

        var lv = this.dataIn.level;
        for(var i=0;i<5;i++)
            this['s' + i].source = lv>i?'start1_png':'start2_png'
        if(this.inPK || this.dataIn.isView)
        {
            this.currentState = 'normal'
            this.pkInfoText.text = '品质：' + lv
        }
        else
        {
            this.currentState = 'info'
            //    <e:Rect width="180" height="12" ellipseWidth="12" fillColor="0x441A02" x="0" verticalCenter="0"/>
            //<e:Rect id="barMC" width="120" height="12" ellipseWidth="12" x="0" fillColor="0xD16404" verticalCenter="0"/>
            //<e:Label id="rateText" text="200/300" size="20" horizontalCenter="0.5" stroke="2" verticalCenter="0"/>

            if(lv == 5)
            {
                this.barMC.width = 180;
                this.rateText.text = 'MAX'
            }
            else
            {
                var num =  HeroManager.getInstance().getHero(vo.id);
                var v1 = HeroManager.getInstance().levelBase[lv]
                var v2 = HeroManager.getInstance().levelBase[lv + 1]
                var d1 = num - v1;
                var d2 = v2 - v1;
                this.barMC.width = 180*d1/d2;
                this.rateText.text = d1 + '/' + d2;
            }
        }


        var baseForceAdd = CM.getCardVO(this.dataIn.mid).getAdd(this.dataIn.force)
        var forceAdd = CM.getCardVO(this.dataIn.mid).getAdd(this.dataIn.force,this.dataIn.type)

        var atk = Math.floor(vo.atk * baseForceAdd);
        var hp = Math.floor(vo.hp * baseForceAdd);
        var def = vo.def;

        var ark2 = Math.floor(vo.atk * forceAdd);
        var hp2 = Math.floor(vo.hp * forceAdd);
        var def2 = def + (this.dataIn.teamDef || 0);
        var arr2:any = [
            {index:1,icon:'icon_love_png',iconScale:0.6,title:'血量',value:hp,valueAdd:hp2 - hp}
        ]
        arr2.push({index:2,icon:'icon_atk_png',iconScale:1,title:'攻击力',value:atk,valueAdd:ark2-atk})
        arr2.push({index:5,icon:'icon_atkcd_png',iconScale:1,title:'攻击间隔',value:MyTool.toFixed(vo.atkcd/1000,1)+'秒',valueAdd:0})
        arr2.push({index:6,icon:'icon_rage_png',iconScale:1,title:'攻击距离',value:vo.isNearAtk()?'近战':vo.atkrage,valueAdd:0})
        arr2.push({index:3,icon:'icon_def1_png',iconScale:0.4,title:'防御',value:def,valueAdd:def2 - def})
        arr2.push({index:4,icon:'icon_speed_png',iconScale:1,title:'移动速度',value:vo.speed,valueAdd:0})
        for(var i=0;i<arr2.length;i++)
        {
            arr2[i].index = i+1;
        }
        this.infoList.dataProvider = new eui.ArrayCollection(arr2)

        var list = vo.getHeroSkillArr();
        for(var i=0;i<list.length;i++)
        {
            list[i] = {
                vo:list[i],
                heroLevel:lv,
                forceAdd:forceAdd
            }
        }
        this.skillList.dataProvider = new eui.ArrayCollection(list)

    }
}