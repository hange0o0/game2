class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public myData:any = {"vedio":-1}
    public stop = 0;
    public winCardArr = [];
    public testFinishFun;
    public constructor() {
        this.myData = SharedObjectManager.getInstance().getMyValue('share') || {"vedio":-1,};
    }

    public testHangView = false //在挂机中测试所有单位动画
    public MML = 998;  //测试出战怪的等级
    public addSkill = false
    public addHeroLevel = 0
    public maxHeroLevel = 13 //已开放的最大英雄等级
    public cardLen = 15
    public needTestTwo = false
    public createHangFlag = false;


    public printDetail = false;  //打印胜出怪物
    public winMonster = {}
    public winUseCard = []

    public testHero(lv){
        this.addHeroLevel = lv || 5;
        PKConfig.heroCD = 40*1000
        this.testNum = 0;
        this.stop = 0;
        this.winMonster = {};
        this.winUseCard = [];
        this.testHeroRound();
    }

    public testHeroRound(){
        this.testNum ++;
        var randomList = this.randomList();
        var heroList = [];
        for(var s in MonsterVO.data)
        {
            var mvo = MonsterVO.data[s]
            if(mvo.isHero() && mvo.getHeroLevel() <= this.maxHeroLevel)
            {
                heroList.push(mvo.id + '|' + this.addHeroLevel)
            }
        }
        var testList = []
        for(var i=0;i<heroList.length;i++)
        {
            var oo = ObjectUtil.clone(randomList)
            oo.hero = heroList[i];
            testList.push(oo)
            testList.push(ObjectUtil.clone(oo))
        }
        ArrayUtil.random(testList,3)
        this.testArr(testList,0,testList.length,egret.getTimer(),'hero')
    }




    public testHeroMonster(){
        this.addHeroLevel = 5
        this.needTestTwo = true
        this.test();
    }

    public createHang(level,cardLen){
        this.createHangFlag = true
        this.MML = level;
        this.cardLen = cardLen;
        this.winCardArr.length = 0
        this.addSkill = false;
        this.test();
    }

    public createHangHero(level,num){
        var hero = []
        for(var s in MonsterVO.data)
        {
            var mvo = MonsterVO.data[s]
            if(mvo.isHero() && mvo.getHeroLevel() <= level)
            {
                hero.push(mvo.id)
            }
        }

        for(var i=0;i<50;i++)
        {
            ArrayUtil.random(hero);
            console.log(hero.slice(0,num).join(','));
        }
    }

    public showHangResult(){
        for(var i=0;i<this.winCardArr.length;i++)
        {
             var card = this.winCardArr[i];
            var arr = card.split(',');
            var temp = [{t:1,num:0},{t:2,num:0},{t:3,num:0}]
            for(var s in arr)
            {
                var vo = MonsterVO.getObject(arr[s])
                temp[vo.type-1].num ++;
            }
            ArrayUtil.sortByField(temp,['num'],[1])
            console.log(temp[0].t + '\t\t' + card)
        }
    }



    public randomList(){
        var arr = []
        var level = this.MML;
        var len = this.cardLen;

        //var type = 3

        for(var s in MonsterVO.data)
        {
            var mvo = MonsterVO.data[s]
            //if(mvo.type == type)   /////
            //    continue;    ////
            if(mvo.level <= level)
            {
                arr.push(mvo.id)
                arr.push(mvo.id)
                arr.push(mvo.id)
            }
        }
        if(this.addSkill)
        {
            for(var s in SkillVO.data)
            {
                var svo = SkillVO.data[s]
                if(svo.level <= level)
                {
                    arr.push(svo.id)
                    arr.push(svo.id)
                    arr.push(svo.id)
                }
            }
        }

        var newList = [];
        for(var i=0;i<len;i++)
        {
            newList.push(ArrayUtil.randomOne(arr,true))
        }

        var hero = [];
        if(this.addHeroLevel)
        {
            for(var s in MonsterVO.data)
            {
                var mvo = MonsterVO.data[s]
                if(mvo.id > 100 && mvo.id < 130 && mvo.getHeroLevel() <= this.maxHeroLevel)
                {
                    hero.push(mvo.id + '|' + this.addHeroLevel)
                }
            }
            ArrayUtil.random(hero);
        }

        return {
            list:newList.join(','),
            hero:hero.join(',')
        };
    }

    public testCard(list1,list2,view=false,hp=10){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1.list,force:0,type:0,hp:hp,hero:list1.hero},
                {id:2,gameid:'test2',team:2,autolist:list2.list,force:0,type:0,hp:hp,hero:list2.hero}
            ]
        };
        var t = egret.getTimer();
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(data);
        if(view)
        {
           PKingUI.getInstance().show();
        }
        else
        {
            PD.quick = true;
            PD.start();
            //PD.addDiamondMonster();
            PKCode.getInstance().onStep()

            console.log('result:' + PD.getPKResult())
            console.log(egret.getTimer() - t)
            console.log('actionTime:' + DateUtil.getStringBySecond(Math.floor(PD.actionTime/1000)).substr(-5))
            console.log(PD.actionTime)
        }
    }


    private testNum = 0;
    public test(){
        this.testNum = 0;
        this.stop = 0;
        this.winMonster = {};
        this.winUseCard = [];
        setTimeout(()=>{
            this.testRound();
        },1);

    }

    private printResult(type){

        var arr = [];
        var heroArr = []
        for(var s in MonsterVO.data)
        {
            if(MonsterVO.data[s].level <= this.MML || this.winMonster[s])
            {
                if(MonsterVO.data[s].isHero())
                    heroArr.push({id:s,num:this.winMonster[s] || 0})
                else
                    arr.push({id:s,num:this.winMonster[s] || 0})
            }
        }
        if(this.addSkill)
        {
            for(var s in SkillVO.data)
            {
                if(SkillVO.data[s].level <= this.MML)
                    arr.push({id:s,num:this.winMonster[s] || 0})
            }
        }

        ArrayUtil.sortByField(heroArr,['num'],[1]);
        ArrayUtil.sortByField(arr,['num'],[1]);
        arr = heroArr.concat(arr);
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i].id;

            console.log((i + 1) + '\tid:' +id +  '\t\tnum:' +  arr[i].num + '\t\tcost:' +  CM.getCardVO(id).cost + '\t\tname:' +  CM.getCardVO(id).name + '\t\tlevel:' +  CM.getCardVO(id).level + '\t\ttype:' +  CM.getCardVO(id).type)
        }

        console.log('\n====================================使用量\n')
        var oo = {}
        for(var s in this.winUseCard)
        {
            var id = this.winUseCard[s];
            oo[id] = (oo[id] || 0) + 1
        }
        var arr = [];
        var heroArr = [];
        for(var s in oo)
        {
            var vo = MonsterVO.getObject(s);
            if(vo.isHero())
                heroArr.push({id:s,num:oo[s] || 0})
            else
                arr.push({id:s,num:oo[s] || 0})
        }
        ArrayUtil.sortByField(heroArr,['num'],[1]);
        ArrayUtil.sortByField(arr,['num'],[1]);
        arr = heroArr.concat(arr);
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i].id;
            console.log((i + 1) + '\tid:' +id +  '\t\tnum:' +  arr[i].num + '\t\tcost:' +  CM.getCardVO(id).cost + '\t\tname:' +  CM.getCardVO(id).name + '\t\tlevel:' +  CM.getCardVO(id).level + '\t\ttype:' +  CM.getCardVO(id).type)
        }

        if(this.createHangFlag)
        {
            console.log('====================================')
            this.showHangResult();
        }
    }

    //N选1;
    private testRound(){
        this.testNum ++;
        var arr = []
        var n = 1024;
        if(this.createHangFlag)
            n = 2048;
        for(var i=0;i<n;i++)
        {
             arr.push(this.randomList())
        }
        this.testArr(arr,0,n,egret.getTimer())
    }

    private testArr(arr,num,total,t,type?){
        if(arr.length >2)
        {
            arr = arr.concat(this.testOne(arr.shift(),arr.shift()))
            num ++;
            if(num< total+2)
            {
                if(num %50 == 0)
                {
                    egret.callLater(()=>{
                        console.log('runing')
                        this.testArr(arr,num,total,t,type)
                    },this)
                }
                else
                    this.testArr(arr,num,total,t,type)
                return
            }
        }
        arr = this.testOne(arr.shift(),arr.shift())
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].list.split(',');
            for(var j=0;j<temp.length;j++)
            {
                var id = temp[j];
                if(this.winMonster[id])
                    this.winMonster[id] ++;
                else
                    this.winMonster[id] = 1;
            }
            if(arr[i].hero)
            {
                var temp = arr[i].hero.split(',');
                for(var j=0;j<temp.length;j++)
                {
                    var id = temp[j].split('|')[0];
                    if(this.winMonster[id])
                        this.winMonster[id] ++;
                    else
                        this.winMonster[id] = 1;
                }
            }
            this.winCardArr.push(arr[i]);
        }

        console.log(this.testNum + ':' + (egret.getTimer()-t))
        if(this.stop)
        {
            this.printResult(type);
            return;
        }

        if(type == 'hero')
            egret.callLater(this.testHeroRound,this)
        else
            egret.callLater(this.testRound,this)
    }

    private testOne(list1,list2){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1.list,force:1000,type:0,hp:10,hero:list1.hero},
                {id:2,gameid:'test2',team:2,autolist:list2.list,force:1000,type:0,hp:10,hero:list2.hero}
            ]
        };
        var t = egret.getTimer();
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(data);
        PD.quick = true;
        PD.start();
        PKCode.getInstance().onStep()
        if(this.needTestTwo)
        {
            var temp = PD.actionTime;
            PD.init(data);
            PD.quick = true;
            PD.start();
            PKCode.getInstance().onStep()
            if(temp != PD.actionTime)
                throw new Error('11111')
        }

        var winlist;
        if(PD.isWin())
        {
            list1.useCard = PD.getPlayer(1).useCardList;
            this.winUseCard = this.winUseCard.concat( list1.useCard)
            return [list1];
        }
        else if(PD.isDraw())
        {
            list1.useCard = PD.getPlayer(1).useCardList;
            list2.useCard = PD.getPlayer(2).useCardList;
            this.winUseCard = this.winUseCard.concat( list1.useCard)
            this.winUseCard = this.winUseCard.concat( list2.useCard)
            return [list1,list2];
        }
        else
        {
            list2.useCard = PD.getPlayer(2).useCardList;
            this.winUseCard = this.winUseCard.concat( list2.useCard)
            return [list2];
        }
    }

    public getCardInfo() {
        CardDebugManger.getInstance().getCardInfo()
    }
    public cleanCardRecord(key) {
        CardDebugManger.getInstance().cleanCardRecord(key)
    }

    public getHangForce($hangIndex){
        var $force=1;
        for(var $i=1;$i<$hangIndex;$i++)
        {
            $force+=Math.floor($i/10+1);
        }
        return $force;
    }
    public getHangCoin($level,$coinLevel=0){
        return Math.floor(3600/10*0.3*Math.pow($level,0.8)*(1+$coinLevel*0.002))
    }

    public showTecInfo(id){
        var TCM = TecManager.getInstance();
        var vo = TecVO.getObject(id)
        console.log('==========='+id+'============')
        for(var lv=1;lv<100;lv++)
        {
            var cost =  TCM.getLevelUpCost(id,lv)
            if(vo.type == 2)
            {
                var before = TCM.getForceAdd(id,lv-1)
                var after = TCM.getForceAdd(id,lv)
            }
            else if(vo.type == 3)
            {
                var before = TCM.getCoinAdd(id,lv-1)
                var after = TCM.getCoinAdd(id,lv)
            }
            var oo = {};
            for(var s in cost)
            {
                var o =cost[s];
                if(o.id)
                    oo[o.id] = NumberUtil.formatStrNum(o.num);
                else
                    oo[o.type] = NumberUtil.formatStrNum(o.num);
            }

            console.log(lv + '\t' + before + '->' + after + '('+(after - before)+')\t\t' + JSON.stringify(oo) )
        }
    }

    //没考虑加能量的情况
    public testActionList(str){
        var noOKMP = []
        var arr = str.split(',')
        var list1 = PKTool.decodeActionList(arr);
        for(var i=0;i<arr.length;i++)
        {
            var group = arr[i].split('#')
            arr[i] = group[1];
        }
        var list2 = PKTool.decodeAutoList(arr);
        for(var i=0;i<list1.length;i++)
        {
            if(list1[i].time < list2[i].time)
            {
                noOKMP.push(JSON.stringify(list1[i]) +'--'+ JSON.stringify(list2[i]))
            }
        }
        return noOKMP

    }
}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;