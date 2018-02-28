class SyncDataManager{
    private static _instance:SyncDataManager;
    public static getInstance():SyncDataManager {
        if (!this._instance)
            this._instance = new SyncDataManager();
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
                case 'sync_opendata':
                    UM.openData = value;
                    UM.onOpenDataChange()
                    break;
                case 'sync_prop':
                    for(ss in value)
                    {
                        PropManager.getInstance().props[ss] = value[ss] || 0;
                    }
                    EM.dispatch(GameEvent.client.prop_change);
                    break;
                case 'sync_tec_force':
                    UM.tec_force = value;
                    EM.dispatch(GameEvent.client.force_change);
                    break;
                case 'sync_hourcoin':
                    UM.hourcoin = value;
                    EM.dispatch(GameEvent.client.hourcoin_change);
                    break;

                case 'sync_tec':
                    for(ss in value)
                    {
                        TecManager.getInstance().tecData[ss] = value[ss];
                    }
                    UM.level = TecManager.getInstance().getLevel(1);
                    EM.dispatch(GameEvent.client.tec_change);
                    break;

            }
        }
    }
}
