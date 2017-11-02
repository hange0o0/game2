class PKConfig {
    public static ROTA_LEFT = 1
    public static ROTA_RIGHT = -1


    public static stepCD = 50; //步长
    public static gameTime = 5*60; //游戏时间,超出算平
    public static maxMonster = 10//10; //同时存活怪的数量
    public static floorWidth = 640//1000; //战场宽度
    public static maxMP = 20; //MP上限
    public static mpInit = 12; //初始的MP值
    public static beforeCD = 0//3*1000; //上阵前的等待
    public static maxHandCard = 6; //手牌上限
    public static maxPosCard = 5; //上阵牌上限


    //public static VIDEO_MONSTER_ATK_ACTION = 1
    public static VIDEO_MONSTER_DIE = 2
    public static VIDEO_MONSTER_WIN = 3
    public static VIDEO_MONSTER_ADD = 4
    public static VIDEO_MONSTER_ATK = 5
    public static VIDEO_MONSTER_MOVE = 6
    public static VIDEO_MONSTER_BEATK = 7
}