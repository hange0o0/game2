class PKConfig {
    public static ROTA_LEFT = 1
    public static ROTA_RIGHT = -1


    public static stepCD = 50; //步长
    public static gameTime = 5*60; //游戏时间,超出算平
    public static maxMonsterSpace = 20//10; //同时存活怪的占位
    public static floorWidth = 1000; //战场宽度
    public static appearPos = 100//出现的位置
    public static diamondPos = 200//出现的位置
    //public static maxMP = 20; //MP上限
    public static mpInit = 15; //初始的MP值
    public static beforeCD = 3*1000; //上阵前的等待
    public static maxHandCard = 6; //手牌上限
    public static maxPosCard = 4; //上阵牌上限
    public static typeAdd = 10; //类型加成百分比


    public static VIDEO_MONSTER_DOUBLE = 1;//爆击
    public static VIDEO_MONSTER_DIE = 2
    public static VIDEO_MONSTER_WIN = 3
    public static VIDEO_MONSTER_ADD = 4
    public static VIDEO_MONSTER_ATK = 5
    public static VIDEO_MONSTER_MOVE = 6
    public static VIDEO_MONSTER_BEATK = 7
    public static VIDEO_MONSTER_MISS = 8 //闪避
    public static VIDEO_TEAM_DEF = 9 //队伍防御
    public static VIDEO_TEAM_DEF2 = 11 //队伍防御
    public static VIDEO_POS_ADD = 10
}