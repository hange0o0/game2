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
            this.addMonster();
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
        }
    }

    //上怪,
    public addMonster(){
        var PD = PKData.getInstance();
        for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
        {
            var player = PD.playerObj[i];
            if(!player)
                continue
            var arr = player.getAddMonster(PD.actionTime)
            if(arr.length > 0)
            {
                var needNum = PKConfig.maxMonster - PD.getMonsterByPlayer(player.id).length;
                while(needNum > 0 && arr.length > 0)
                {
                    var data = arr.shift();
                    PD.addMonster(data.getMonster(PD.actionTime));
                    data.setHaveAdd(PD.actionTime);
                    needNum --;
                }
            }
        }
    }

    //技能效果作用
    public actionSkill(){
        var PD = PKData.getInstance();
        for(var i=1;i<=PD.playerNum;i++) //暂时4个玩家
        {
            var player = PD.playerObj[i];
            if(!player)
                continue
            var arr = player.getAddSkill(PD.actionTime)
            if(arr.length > 0)
            {

            }
        }
    }

    //怪出手
    public monsterAction(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i];
            var skillTargets = mvo.canSkill(PD.actionTime);
            if(skillTargets.length > 0)   //用技能
            {
                PKMonsterAction.getInstance().skill(target,skillTargets,PD.actionTime)
            }
            else
            {
                var target = mvo.getAtkTarget(PD.monsterList,PD.actionTime)      //普攻
                if(target)
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
        }
    }

    //一轮操作结束,移队死，过线的，结算
    public actionFinish(){
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i];
            if(mvo.die)
            {
                PD.monsterList.splice(i,1);
                PD.addVideo({
                    type:PKConfig.VIDEO_MONSTER_DIE,
                    user:mvo,
                })
                i--;
            }
            else if(mvo.x < 0 || mvo.x > PKConfig.floorWidth) //冲过终点
            {
                mvo.die = true;
                PD.monsterList.splice(i,1);
                i--;
                PD.getPlayer(mvo.owner).teamData.enemy.hp -= mvo.getVO().atk2;

                PD.addVideo({
                    type:PKConfig.VIDEO_MONSTER_WIN,
                    user:mvo,
                })
            }
        }
    }


}