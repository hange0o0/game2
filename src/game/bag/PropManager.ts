class PropManager {
    private static _instance:PropManager;
    public static getInstance():PropManager {
        if (!this._instance)
            this._instance = new PropManager();
        return this._instance;
    }

    public props

    public init(data){
       this.props = data || {};
    }

    public getNum(id){
       return this.props[id] || 0
    }

    public getListByType(type){
        var arr = [];
        for(var s in this.props)
        {
            var vo = PropVO.getObject(s);
            if(this.props[s] && vo.type == type)
            {
                arr.push(vo);
            }
        }
        return arr;
    }
}