
class GameEvent {
    public static client = {
        energy_change:'energy_change',
        coin_change:'coin_change',
        diamond_change:'diamond_change',
        force_change:'force_change',
        hourcoin_change:'hourcoin_change',
        mail_change:'mail_change',
        pos_change:'pos_change',
        tec_change:'tec_change',
        prop_change:'prop_change',
        hang_change:'hang_change',
        card_change:'card_change',
        head_change:'head_change',

        fight_change:'fight_change',


        pk_begin:'pk_begin',
        pk_end:'pk_end',
        info_change:'info_change',
        slave_change:'slave_change',
        view_change:'view_change',



        //task_change:'task_change',
        //card_change:'card_change',
        //pk_end:'pk_end',

        red_change:'red_change',
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


    public static rank = {
        get_rank:'rank.get_rank'
    }

    public static card = {
        card_buy:'card.card_buy',
        card_draw:'card.card_draw',
        card_like:'card.card_like',
        card_like_set:'card.card_like_set',
        card_open:'card.card_open'
    }

    public static mail = {
        get_mail:'mail.get_mail',
        get_mail_award:'mail.get_mail_award'
    }

    public static pay = {
        add_diamond:'pay.add_diamond',
        buy_shop:'pay.buy_shop',
        get_shop:'pay.get_shop'
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
        hang_video_list:'hang.hang_video_list',
        hang_video:'hang.hang_video',
        hang_gift:'hang.hang_gift',
        pk_hang_result:'hang.pk_hang_result'
    }

    public static pk = {
        save_record:'pk.save_record',
        get_record:'pk.get_record',
    }

    public static fight = {
        buy_shop:'fight.buy_shop',
        fight_award:'fight.fight_award',
        get_fight:'fight.get_fight',
        init_fight:'fight.init_fight',
        pk_fight:'fight.pk_fight',
        pk_fight_result:'fight.pk_fight_result',
        pk_fail:'fight.pk_fail',
        fight_cancel:'fight.fight_cancel',
        change_pos:'fight.change_pos',
    }

    public static tec = {
        tec_up:'tec.tec_up'
    }

    public static user = {
        user_info:'user.user_info',
        change_head:'user.change_head'
    }

    public static slave = {
        slave_add_view:'slave.slave_add_view',
        slave_delete_view:'slave.slave_delete_view',
        slave_view_list:'slave.slave_view_list',

        slave_award:'slave.slave_award',
        slave_delete:'slave.slave_delete',
        slave_list:'slave.slave_list',
        slave_miss:'slave.slave_miss',
        slave_reset_open:'slave.slave_reset_open',
        slave_addprotect:'slave.slave_addprotect',
        slave_pk_begin:'slave.slave_pk_begin',
        slave_pk_result:'slave.slave_pk_result'
    }

    public static debug = {
        pk_test:'debug.pk_test'
    }











}