class PKManager {
    private static instance:PKManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKManager();
        return this.instance;
    }

    public startPlay(){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            team1:{id:1,hp:5},
            team2:{id:2,hp:5},
            players:[
                {id:1,openid:'npc',team:2,card:[],autolist:'4,4,2,1|2|1,1,2',base:{     //,1,2,1,2,1|2|1,1,2
                    1:MonsterVO.getObject(1),
                    2:MonsterVO.getObject(2),
                    3:MonsterVO.getObject(3),
                    4:MonsterVO.getObject(4),
                }},
                {id:2,openid:UM.openid,team:1,card:[1,102,101,1,1,2,2,2,1,1,1],base:{
                    1:MonsterVO.getObject(1),
                    2:MonsterVO.getObject(2),//{atk:10,hp:100,speed:5}
                    103:SkillVO.getObject(103), //{value:20}
                    102:SkillVO.getObject(102) //{value:20}
                }}
            ]
        };
        PD.init(data);
        PKingUI.getInstance().show();
    }
}