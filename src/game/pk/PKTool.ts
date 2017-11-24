class PKTool {

    //对自动队列进行解析
    public static decodeAutoList(arr) {
        var returnArr = [];
        var mpCost = 0;
        var index = 1;
        for(var i=0;i<arr.length;i++)
        {
            var group = arr[i].split('|')
            var mp = this.getGroupMp(group);//上阵MP

            var t = PKTool.getMPTime(mpCost + mp)//可以同时上阵的时间点
            for(var j=0;j<group.length;j++)
            {
                var id = group[j];
                returnArr.push({
                    mid:id,
                    time:t,
                    id:index
                })
                index ++;
            }
            mpCost += mp;
        }
        return returnArr;
    }

    public static getGroupMp(group){
        var mp = 0;
        for(var j=0;j<group.length;j++)
        {
            var id = group[j];
            var vo = MonsterVO.getObject(id);
            mp += vo.cost;
        }
        return mp;
    }

    //到这个MP量的时间
    public static getMPTime(mp){
        //30+40+60*3 = 250
        var step0 = PKConfig.mpInit;//初始值
        var step1 = 30;//第一分钟产量
        var step2 = 40;//第二分钟产量
        var step3 = 60;//之后每分钟的产量

        if(mp <= step0)
            return 0
        mp -= step0;

        if(mp <= step1)
            return mp/step1 * 60*1000

        mp -= step1;
        if(mp <= step2 )
            return mp/step2 * 60*1000 + 60*1000;

        mp -= step2;
        return mp/step3 * 60*1000 + 60*1000*2;

    }
}