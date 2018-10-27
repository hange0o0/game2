class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public stop = 0;
    public winCardArr = [];
    public finishFun = function(){return false}


    public constructor() {
    }

    public testHangView = false //在挂机中测试所有单位动画
    public MML = 998;  //测试出战怪的等级
    public addSkill = false
    public addHeroLevel = 0
    public maxHeroLevel = 13 //已开放的最大英雄等级
    public cardLen = 20
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
             var card = this.winCardArr[i].list;
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
            if(hero.length > 5)
                hero.length = 5
        }

        return {
            list:newList.join(','),
            hero:hero.join(',')
        };
    }

    //DM.testCard({list:'1,2,3,4,5'},{list:'1,2,3,4,5'},true)
    public testCard(list1,list2,view=false,hp=10){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1.list,force:1000,type:0,hp:hp,hero:list1.hero},
                {id:2,gameid:'test2',team:2,autolist:list2.list,force:1000,type:0,hp:hp,hero:list2.hero}
            ]
        };
        var t = egret.getTimer();
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(data);

        if(view)
        {
           PKingUI.getInstance().show(true);
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

    public reset(cd = 30){
        var PD = PKData.getInstance()
        PD.init(PD.baseData);
        PD.isAuto = true
        PD.quick = true;
        PD.quickTime = cd*1000;
        PD.start();
        PKCode.getInstance().onStep()
        PD.isAuto = false
        PKingUI.getInstance().resetView();
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
            var vo = CM.getCardVO(s);
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

        if(this.finishFun())
            return;
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

    private testOne(list1,list2,hp=10){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now() + Math.floor(100000000*Math.random()),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1.list,force:1000,type:0,hp:hp,hero:list1.hero},
                {id:2,gameid:'test2',team:2,autolist:list2.list,force:1000,type:0,hp:hp,hero:list2.hero}
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


    public getHangCoin($level,$coinLevel=0){
        return Math.floor(3600/10*0.3*Math.pow($level,0.8)*(1+$coinLevel*0.002))
    }

    //达到这个战力需要最小的升级次数
    public getForceLevel(force){
        var obj = {};
        var currentForce = 0;
        var base = TecVO.data;
        var arr = [];
        var totalLv = 0;
        var totalCoin = 0;
        var maxLevel = 0;
        for(var s in base)
        {
            if(base[s].type==2)
                arr.push(base[s])
        }
        while(currentForce < force)
        {
            var cid = 0;
            var needCoin = 0;
            for(var s in arr)
            {
                var id = arr[s].id;
                var vo = arr[s];
                var lv = obj[id] || 0
                var coin = TecManager.getInstance().getCoinNeed((lv + vo.coinlv - 1)*(0.8+vo.step + vo.coinlv/200)) //需要的钱
                if(!cid || needCoin>coin)
                {
                    cid = id;
                    needCoin = coin
                }
            }
            obj[cid] = (obj[cid] || 0) + 1
            currentForce = 0;
            totalLv = 0;
            totalCoin = 0;

            for(var s in obj)
            {
                currentForce += TecManager.getInstance().getForceAdd(s,obj[s])
                totalLv += obj[s];
                totalCoin += TecManager.getInstance().getCoinAdd(parseInt(s)+100,obj[s])
            }
        }

        console.log('战力：' + currentForce,'等级：' + totalLv,'时产：' + totalCoin)  //,obj
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


    //////////////////////////////////////////////生成迷题
    private questionList;
    private questionRate = 0.005;
    private questionNum = 0;
    public createQuestion(rate){
        if(rate)
            this.questionRate = rate;
        this.stop = 0;
        this.addHeroLevel = 0;
        this.questionNum = 0;
        this.questionList = []
        this.createOneQuestion();

    }


    private createOneQuestion(){

        this.questionNum ++;
        this.MML = Math.floor(Math.random()*9 + 3);
        this.cardLen = 6//5 + Math.ceil(Math.random()*3);

        this.addSkill = false;
        var question = this.randomList();
        this.addSkill = true;
        var answerList = this.randomList();
        var list = answerList.list.split(',');
        var mNum = 0;
        var mpCost = 0;
        for(var i=0;i<list.length;i++)
        {
            var vo = CM.getCardVO(list[i]);
            if(vo.isMonster)
                mNum ++;
            mpCost += vo.cost
        }
        if(mNum < 2 || mNum > 4 || mpCost<30)
        {
            egret.callLater(this.createOneQuestion,this);
            return;
        }

        var list2 = question.list.split(',');
        var mpCost2 = 0;
        for(var i=0;i<list2.length;i++)
        {
            var vo = CM.getCardVO(list2[i]);
            mpCost2 += vo.cost
        }

        if(mpCost/mpCost2 < 0.8 || mpCost2/mpCost < 0.8)
        {
            egret.callLater(this.createOneQuestion,this);
            return;
        }



        var fail = false;
        var obj = {};
        //var len = this.cardLen*100*(this.cardLen-4);
        //obj[list.join(',')] = true;
        function setArr(a,w){
            if(a.length == 0)
            {
                obj[w.substr(1)] = true;
                return
            }
            for(var i=0;i<a.length;i++)
            {
                var newA = a.concat();
                newA.splice(i,1)
                setArr(newA,w +','+ a[i])
            }
        }
        setArr(list,'');
        var len = ObjectUtil.objLength(obj)
        var winNum = (this.questionList.length + 1)*3//Math.max(2,Math.floor(len*this.questionRate))
        var haveTest = {}; //会去除前面同时上阵的
        var haveTest2 = {}; //会记录初期上阵的


        var result = {win:[],total:len};
        var PD = PKData.getInstance()
        for(var s in obj)
        {
            //console.log(len)
            var find = false
            var temp = s.split(',');
            var cost = PKConfig.mpInit
            for(var i=0;i<temp.length;i++)
            {
                 var vo = CM.getCardVO(temp[i]);
                cost -= vo.cost;
                if(cost < 0)
                {
                    var key = temp.slice(i).join(',')
                    break;
                }
            }
            var key2 = temp.slice(0,2).join(',')//前两个一样的只算作一次赢
            if(haveTest[key])
            {
                continue;
            }


            var list1:any = {
                list:s
            }
            this.testOne(list1,question,3)
            if(PD.isWin())//再试一次，两次都赢才算，免的机率赢的出现
                this.testOne(list1,question,3)
            if(PD.isWin())//再试一次，3次都赢才算，免的机率赢的出现
                this.testOne(list1,question,3)


            haveTest[key] = true;
            if(PD.isWin())
            {
                if(haveTest2[key2])
                {
                    continue;
                }

                haveTest2[key2] = true;
                result.win.push(s);
                var useCardList = PD.getPlayer(1).useCardList;
                if(useCardList.length < this.cardLen || result.win.length> winNum || PD.actionTime > 2*60*1000)//战斗时间过长)
                {
                    fail = true
                    break;
                }
            }
        }

        if(!fail && result.win.length)//成功
        {
            var oo:any = {
                lv:this.MML,
                question:question.list,
                result:result.win,
                total:result.total,
                winNum:result.win.length,
                rate:result.win.length/result.total
            }
            this.questionList.push(oo)
            console.log('find:' + this.questionList.length + ' /' + this.questionNum + '\t\tLV'+this.MML + '\t\t'+result.win.length+ ' /' +result.total + '\t\t'+oo.rate)
        }
        else
            console.log('running');


        if(this.stop) //打出结果
        {
            ArrayUtil.sortByField(this.questionList,['rate'],[0])
            console.log('====生成数量：' + this.questionList.length)
            this.printQuestion(10)
        }
        else
        {
            if(this.questionList.length >= 12)
            {
                this.outPutQuestion();
                this.questionList.length = 0;
                this.questionNum = 0;
            }
            egret.callLater(this.createOneQuestion,this);
        }
    }

    public printQuestion(num){
        for(var i=0;i<num;i++)
        {
            var oo = this.questionList[i];
            if(!oo)
                break;

            console.log('等级：' + oo.lv + '\t\t比例：' + oo.rate + '\t\t胜场：' + oo.result.length + ' /' + oo.total)
            //oo.result.sort();
            //去除重复的（可能早期就赢了）

            //console.log('题目：'+oo.question + '\n'+oo.result.join('\n'))
        }
    }

    public outPutQuestion(){
        ArrayUtil.sortByField(this.questionList,['winNum','lv'],[1,0])
        var result = [];
        var result2 = [];
        for(var i=0;i<this.questionList.length;i++)
        {
            var oo = this.questionList[i];
            if(!oo)
                break;
            //$hang_base = array("1"=>array("id"=>1,"list"=>"3","type"=>1,"hp"=>1,"hero"=>""),
            var temp = oo.result[0].split(',');
            ArrayUtil.random(temp,3);
            result.push('"'+(i+1)+'"=>array("question"=>"'+oo.question+'","answer"=>"'+temp.join(',')+'")')
            result2.push('//' + (i+1) + '->等级：' + oo.lv + '\t\t比例：' + oo.rate + '\t\t胜场：' + oo.result.length + ' /' + oo.total+'\n//' + this.changeResult(oo.result)[0])
        }

        console.log('<?php\n$question = array('+result.join(',')+');\n'+result2.join('\n')+'\n?> ')
        console.log('================================');
        //for(var i=0;i<result2.length;i++)
        //    console.log(result2[i])
    }

    private changeResult(list){
        for(var i=0;i<list.length;i++)
        {
            var temp = list[i].split(',');
            for(var j=0;j<temp.length;j++)
            {
                temp[j] = CM.getCardVO(temp[j]).name;
            }
            list[i] = temp.join(',')
        }
        return list;
    }

    //=====================================================================
    //创建活动相关的
    public createActive(lv){
        this.createHangFlag = false
        this.MML = lv;
        this.cardLen = 15 + this.MML;
        this.winCardArr.length = 0
        this.addHeroLevel = 0
        if(this.MML >= 6)
            this.addHeroLevel = Math.min(5,Math.floor((this.MML-3)/3));
        this.finishFun = ()=>{
            if(this.winCardArr.length < 30)
                return false;
            for(var i=0;i<this.winCardArr.length;i++)
            {
                var oo = this.winCardArr[i];
                var hero = oo.hero.split(',');
                for(var j=0;j<hero.length;j++)
                {
                    hero[j] = hero[j].split('|')[0];
                }
                this.winCardArr[i] = '"'+oo.list + '|' + hero.join(',') + '"';
            }
            console.log('===================================LV.' + this.MML)
            console.log('<?php\n$pkActiveBase = array('+this.winCardArr.join(',')+');\n?> ')
            return true
        }
        this.testRound();
    }
}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;