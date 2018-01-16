
class GameEvent {
    public static client = {
        energy_change:'energy_change',
        coin_change:'coin_change',
        diamond_change:'diamond_change',
        force_change:'force_change',
        mail_change:'mail_change',
        pos_change:'pos_change',


        pk_begin:'pk_begin',
        pk_end:'pk_end',



        //task_change:'task_change',
        //card_change:'card_change',
        //pk_end:'pk_end',

        pass_day:'pass_day',
        timer:'timer'
    };

    public static sys = {

        login:'login',
        quick_register:'quick_register',
        register:'register',

        login_server:'sys.login_server',
        register_server:'sys.register_server',

        client_error:'sys.client_error'
    }


    public static pos = {
        add_pos:'pos.add_pos',
        change_pos:'pos.change_pos',
        change_close:'pos.change_close',
        delete_pos:'pos.delete_pos'
    }

    public static hang = {
        award_hang:'hang.award_hang',
        pk_hang:'hang.pk_hang',
        pk_test:'hang.pk_test',
        pk_hang_result:'hang.pk_hang_result'
    }

    public static tec = {
        tec_up:'tec.tec_up'
    }

    public static user = {
        user_info:'user.user_info'
    }

    public static slave = {
        slave_award:'slave.slave_award',
        slave_delete:'slave.slave_delete',
        slave_list:'slave.slave_list',
        slave_miss:'slave.slave_miss',
        slave_pk_begin:'slave.slave_pk_begin',
        slave_pk_result:'slave.slave_pk_result'
    }

    public static debug = {
        pk_test:'debug.pk_test'
    }











}