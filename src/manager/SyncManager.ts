class SyncManager{
    private static _instance:SyncManager;
    public static getInstance():SyncManager {
        if (!this._instance)
            this._instance = new SyncManager();
        return this._instance;
    }

    public snyc(data){
        var ss;
        for(var s  in  data)
        {
            var value = data[s];
            switch(s)
            {
                case 'sync_energy':
                    UM.energy = value;
                    EM.dispatch(GameEvent.client.energy_change);
                    break;
                case 'sync_coin':
                    UM.coin = value;
                    EM.dispatch(GameEvent.client.coin_change);
                    break;
                case 'sync_diamond':
                    UM.diamond = value;
                    EM.dispatch(GameEvent.client.diamond_change);
                    break;
                case 'sync_prop':
                    for(ss in value)
                    {
                        //UM.prop[ss] = value[ss] || {num:0};
                    }
                    EM.dispatch(GameEvent.client.prop_change);
                    break;
                case 'sync_tec_force':
                    UM.tec_force = value;
                    EM.dispatch(GameEvent.client.force_change);
                    break;

            }
        }
    }
}
