class PKCode {
    private static instance:PKCode;

    public static getInstance() {
        if (!this.instance) this.instance = new PKCode();
        return this.instance;
    }








    //每一步执行
    public onStep(){
        var PD = PKData.getInstance();
        var cd = PD.getPassTime() - PD.actionTime
        while(cd > PKConfig.stepCD)
        {
            PD.actionTime += PKConfig.stepCD;
            cd -= PKConfig.stepCD;
            this.autoAction();
            this.actionPosCard();
            //this.addMonster();
            //this.actionSkill();
            this.monsterAction();
            this.monsterMove();
            PKMonsterAction.getInstance().actionAtk(PD.actionTime);//攻击落实




            this.actionFinish();


            if(PD.isGameOver)
                return true
        }
        return false;
    }
    ///////////////*********************************************************

    //自动出战上怪
    public autoAction(){
        var PD = PKData.getInstance();
        for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
        {
            var player = PD.playerObj[i];
            if (!player)
                continue
            player.autoAction(PD.actionTime);
            player.testAddPosCard(PD.actionTime);
        }
    }

    public actionPosCard(){
        var PD = PKData.getInstance();
        for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
        {
            var player = PD.playerObj[i];
            if(!player)
                continue
            var arr = player.getEnablePos(PD.actionTime)
            while(arr.length > 0)
            {
                PD.resetMonsterData();//重置技能数据，方便技能统计
                var needSpace = PKConfig.maxMonsterSpace - PD.getMonsterSpaceByPlayer(player.id);
                var data = arr.shift();
                if(data.mid < 100) //上怪
                {
                    if(needSpace > 0)
                    {
                        needSpace -= data.getVO().space;
                        PD.addMonster(data.getMonster(PD.actionTime));
                        data.setHaveAdd(PD.actionTime);
                    }
                }
                else if(SBase.getData(data.mid).useAble(data))//技能
                {
                    data.actionSkill();
                    data.setHaveAdd(PD.actionTime);
                }

            }
        }
    }

    ////上怪,
    //public addMonster(){
    //    var PD = PKData.getInstance();
    //    for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
    //    {
    //        var player = PD.playerObj[i];
    //        if(!player)
    //            continue
    //        var arr = player.getAddMonster(PD.actionTime)
    //        if(arr.length > 0)
    //        {
    //            var needSpace = PKConfig.maxMonsterSpace - PD.getMonsterSpaceByPlayer(player.id);
    //            while(needSpace > 0 && arr.length > 0)
    //            {
    //                var data = arr.shift();
    //                //if(data.getVO().space > needSpace)
    //                //{
    //                //     break;
    //                //}
    //                needSpace -= data.getVO().space;
    //                PD.addMonster(data.getMonster(PD.actionTime));
    //                data.setHaveAdd(PD.actionTime);
    //            }
    //        }
    //    }
    //}
    //
    ////技能效果作用
    //public actionSkill(){
    //    var PD = PKData.getInstance();
    //    //PD.resetMonsterData();//重置技能数据，方便技能统计
    //    for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
    //    {
    //        var player = PD.playerObj[i];
    //        if(!player)
    //            continue
    //        var arr = player.getAddSkill(PD.actionTime)
    //
    //        if(arr.length > 0)
    //        {
    //            for(var i=0;i<arr.length;i++)
    //            {
    //                var data = arr[i];
    //                data.actionSkill();
    //                data.setHaveAdd(PD.actionTime);
    //            }
    //        }
    //    }
    //}

    //怪出手
    public monsterAction(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            PD.resetMonsterData();//重置技能数据，方便技能统计
            var mvo:PKMonsterData = PD.monsterList[i];
            var skillTargets = mvo.canSkill(PD.actionTime);

            if(skillTargets && skillTargets.length > 0)   //用技能
            {
                PKMonsterAction.getInstance().skill(mvo,PD.actionTime)
            }
            else
            {
                var target = mvo.getAtkTarget()
                if(target)//普攻
                {
                    PKMonsterAction.getInstance().atk(mvo,PD.actionTime);
                }
            }
        }
    }

    //怪移动
    public monsterMove(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i];
            if(mvo.canMove(PD.actionTime))
            {
                mvo.move();
            }
            else if(mvo.stopTime < PD.actionTime)
                mvo.stand();
        }
    }

    //一轮操作结束,移队死，过线的，结算,清除BUFF
    public actionFinish(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i];
            if(mvo.die || (mvo.dieTime && mvo.dieTime <= PD.actionTime)) //死的
            {
                mvo.die = true;
                PD.monsterList.splice(i,1);
                PD.addVideo({
                    type:PKConfig.VIDEO_MONSTER_DIE,
                    user:mvo,
                })
                i--;
                mvo.onDie();
                PD.monsterChange = true;
            }
            else if(mvo.x < PKConfig.appearPos || mvo.x > PKConfig.floorWidth + PKConfig.appearPos) //冲过终点
            {
                mvo.die = true;
                PD.monsterList.splice(i,1);
                i--;
                mvo.onDie();
                PD.monsterChange = true;
                if(mvo.dieTime) //召唤物不算分
                {
                    PD.addVideo({
                        type:PKConfig.VIDEO_MONSTER_DIE,
                        user:mvo,
                    })
                    continue;
                }
                PD.getPlayer(mvo.owner).teamData.enemy.hp -= mvo.getVO().atk2;
                if(PD.getPlayer(mvo.owner).teamData.enemy.hp <= 0)
                {
                    console.log(PD.getPlayer(mvo.owner).teamData.enemy)
                    PD.isGameOver = true;
                }

                PD.addVideo({
                    type:PKConfig.VIDEO_MONSTER_WIN,
                    user:mvo,
                })
            }
            else { //其它
                if(mvo.hpChange && PD.actionTime - mvo.lastHpChange >= 500) //改变血量值
                {
                    mvo.addHp(mvo.hpChange)
                    mvo.lastHpChange = PD.actionTime;
                }
                mvo.cleanBuff(PD.actionTime) //清除BUFF
                if(mvo.stateChange)
                {
                    mvo.stateChange = false;
                    PD.addVideo({
                        type:PKConfig.VIDEO_MONSTER_STATE_CHANGE,
                        user:mvo,
                    })
                }
            }
        }
        PKData.getInstance().team1.onStateTimer();
        PKData.getInstance().team2.onStateTimer();
    }


}