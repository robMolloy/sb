
    dev = true;
    devVerbose = false;
    debug = false;
    
        win_loggedIn = false;
    win_projectLabel = `Self Billing`;
    win_projectName = `sb`;
    win_user = {usr_id:'4',usr_first_name:'rob',usr_last_name:'molloy',usr_email:'robmolloy@hotmail.co.uk'};
    win_pages = ['projects','customers','contacts','records','prj_cus_links','rec_items'];
    win_time_units = ['day','week','month','year'];
    
    win_info = {
        projects:{
            keys:{primary:'prj_id',temp_id:'prj_temp_id',user:'prj_usr_id'},
            blank:{prj_id:'',prj_usr_id:'',prj_default_qty:'',prj_default_unit:'',prj_default_work:'',prj_rate_per_default_unit:'',prj_default_repeat_every_qty:'',prj_default_repeat_every_unit:'',prj_acronym:'',prj_address_1:'',prj_address_2:'',prj_city:'',prj_postcode:'',prj_primary_cus_id:''},
            labels:{prj_id:'Id',prj_temp_id:'Temp Id',prj_usr_id:'User Id',prj_default_qty:'Quantity',prj_default_work:'Work',prj_default_unit:'Unit',prj_rate_per_default_unit:'Rate Per Unit',prj_default_repeat_every_qty:'',prj_default_repeat_every_unit:'Length Of Time',prj_acronym:'Reference',prj_address_1:'Address 1',prj_address_2:'Address 2',prj_city:'City',prj_postcode:'Postcode',prj_primary_cus_id:'Primary Customer Id'}
        },
        customers:{
            keys:{primary:'cus_id',temp:'cus_temp_id',user:'cus_usr_id'},
            blank:{cus_id:'',cus_usr_id:'',cus_first_name:'',cus_last_name:'',cus_primary_con_id:''},
            labels:{cus_id:'Id',cus_temp_id:'Temp Id',cus_usr_id:'User Id',cus_first_name:'First Name',cus_last_name:'Last Name',cus_primary_con_id:'Primary Contact Id'}
        },
        prj_cus_links:{
            keys:{primary:'prj_cus_link_id',temp:'prj_cus_link_temp_id',user:'prj_cus_link_usr_id'},
            blank:{prj_cus_link_id:'',prj_cus_link_usr_id:'',prj_cus_link_prj_id:'',prj_cus_link_cus_id:''},
            labels:{prj_cus_link_id:'cus_link_id',prj_cus_link_temp_id:'Temp Id',prj_cus_link_usr_id:'prj_cus_link_usr_id',prj_cus_link_prj_id:'prj_cus_link_prj_id',prj_cus_link_cus_id:'prj_cus_link_cus_id'}
        },
        contacts:{
            keys:{primary:'con_id',temp:'con_temp_id',user:'con_usr_id'},
            blank:{con_id:'',con_usr_id:'',con_cus_id:'',con_type:'',con_method:'',con_description:'',con_address:''},
            labels:{con_id:'Id',con_temp_id:'Temp Id',con_usr_id:'User Id',con_cus_id:'Customer Id',con_type:'type',con_method:'method',con_description:'Description',con_address:'Address'}
        },
        records:{
            keys:{primary:'rec_id',temp:'rec_temp_id',user:'rec_usr_id'},
            blank:{rec_id:'',rec_usr_id:'',rec_prj_id:'',rec_description:'',rec_timestamp_planned_start:'',rec_timestamp_planned_finish:'',rec_timestamp_completed:'',rec_timestamp_paid:'',rec_total:''},
            labels:{rec_id:'Id',rec_temp_id:'Temp Id',rec_usr_id:'User Id',rec_prj_id:'Project Id',rec_description:'Description',rec_timestamp_planned_start:'Planned Start',rec_timestamp_planned_finish:'Planned Finish',rec_timestamp_completed:'Time Completed',rec_timestamp_paid:'Time Paid',rec_total:'Total'}
        },
        rec_items:{
            keys:{primary:'rci_id',temp:'rci_temp_id',user:'rci_usr_id'},
            blank:{rci_id:'',rec_usr_id:'',rci_rec_id:'',rci_work:'',rci_unit:'',rci_qty:'',rci_cost_per_unit:'',rci_cost:''},
            labels:{rci_id:'Id',rci_temp_id:'Id',rec_usr_id:'User Id',rci_rec_id:'Record Id',rci_work:'Type Of Work',rci_unit:'Unit',rci_qty:'Quantity',rci_cost_per_unit:'Cost per Unit',rci_cost:'Cost'}
        }
    };
    
    
    
    win_db_projects = {
        1:{prj_id:1,prj_temp_id:'',prj_usr_id:4,prj_default_qty:2,prj_default_unit:'hr',prj_default_work:'General Maintenance',prj_rate_per_default_unit:20,prj_default_repeat_every_qty:2,prj_default_repeat_every_unit:'week',prj_acronym:'29CPA',prj_address_1:'29 Chiltern Park Avenue',prj_address_2:'',prj_city:'Berkhamsted',prj_postcode:'HP41EU',prj_primary_cus_id:5},
        2:{prj_id:2,prj_temp_id:'',prj_usr_id:4,prj_default_qty:2,prj_default_unit:'hr',prj_default_work:'General Maintenance',prj_rate_per_default_unit:18,prj_default_repeat_every_qty:2,prj_default_repeat_every_unit:'week',prj_acronym:'8CH',prj_address_1:'8 Castle Hill',prj_address_2:'notmyhouse',prj_city:'Hemel',prj_postcode:'HP41HE',prj_primary_cus_id:4},
        3:{prj_id:3,prj_temp_id:'',prj_usr_id:4,prj_default_qty:2,prj_default_unit:'hr',prj_default_work:'General Maintenance',prj_rate_per_default_unit:16,prj_default_repeat_every_qty:2,prj_default_repeat_every_unit:'week',prj_acronym:'3PTC',prj_address_1:'3 Pear Tree Close',prj_address_2:'',prj_city:'York',prj_postcode:'YO413PJ',prj_rate_per_unit:'',prj_primary_cus_id:1}
    };
    win_db_customers = {
        1:{cus_id:1,cus_temp_id:'',cus_usr_id:4,cus_first_name:'Netty',cus_last_name:'Poole',cus_primary_con_id:3},
        2:{cus_id:2,cus_temp_id:'',cus_usr_id:4,cus_first_name:'Steve',cus_last_name:'Poole',cus_primary_con_id:2},
        3:{cus_id:3,cus_temp_id:'',cus_usr_id:4,cus_first_name:'Alex',cus_last_name:'Simms',cus_primary_con_id:0},
        4:{cus_id:4,cus_temp_id:'',cus_usr_id:4,cus_first_name:'Jason',cus_last_name:'Simms',cus_primary_con_id:0},
        5:{cus_id:5,cus_temp_id:'',cus_usr_id:4,cus_first_name:'Rob',cus_last_name:'Molloy',cus_primary_con_id:5}
    };
    win_db_prj_cus_links = {
        1:{prj_cus_link_id:1,prj_cus_link_temp_id:'',prj_cus_link_usr_id:4,prj_cus_link_prj_id:2,prj_cus_link_cus_id:3},
        2:{prj_cus_link_id:2,prj_cus_link_temp_id:'',prj_cus_link_usr_id:4,prj_cus_link_prj_id:2,prj_cus_link_cus_id:4},
        3:{prj_cus_link_id:3,prj_cus_link_temp_id:'',prj_cus_link_usr_id:4,prj_cus_link_prj_id:3,prj_cus_link_cus_id:1},
        4:{prj_cus_link_id:4,prj_cus_link_temp_id:'',prj_cus_link_usr_id:4,prj_cus_link_prj_id:3,prj_cus_link_cus_id:2},
        5:{prj_cus_link_id:5,prj_cus_link_temp_id:'',prj_cus_link_usr_id:4,prj_cus_link_prj_id:1,prj_cus_link_cus_id:5}
    };
    win_db_contacts = {
        1:{con_id:1,con_temp_id:'',con_usr_id:4,con_cus_id:2,con_type:'mobile',con_method:'whatsapp',con_description:'Mobile',con_address:'+447590912293'},
        2:{con_id:2,con_temp_id:'',con_usr_id:4,con_cus_id:2,con_type:'email',con_method:'email',con_description:'Email',con_address:'steve@poole.com'},
        3:{con_id:3,con_temp_id:'',con_usr_id:4,con_cus_id:1,con_type:'mobile',con_method:'sms',con_description:'Mobile',con_address:'+447777122777'},
        4:{con_id:4,con_temp_id:'',con_usr_id:4,con_cus_id:1,con_type:'email',con_method:'email',con_description:'Email',con_address:'netty@poole.com'},
        5:{con_id:5,con_temp_id:'',con_usr_id:4,con_cus_id:5,con_type:'mobile',con_method:'sms',con_description:'Email',con_address:'+447934647667'}
    };
    win_db_records = {
        1:{rec_id:1,rec_temp_id:'',rec_usr_id:4,rec_prj_id:1,rec_description:'hi',rec_timestamp_planned_start:1583111310000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:1584321310000,rec_timestamp_paid:0,rec_total:157},
        2:{rec_id:2,rec_temp_id:'',rec_usr_id:4,rec_prj_id:2,rec_description:'bye',rec_timestamp_planned_start:1583311410000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:1584321310000,rec_timestamp_paid:0,rec_total:0},
        3:{rec_id:3,rec_temp_id:'',rec_usr_id:4,rec_prj_id:3,rec_description:'a',rec_timestamp_planned_start:1583511510000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:0,rec_timestamp_paid:0,rec_total:0},
        4:{rec_id:4,rec_temp_id:'',rec_usr_id:4,rec_prj_id:3,rec_description:'b',rec_timestamp_planned_start:1583711610000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:0,rec_timestamp_paid:0,rec_total:0},
        5:{rec_id:5,rec_temp_id:'',rec_usr_id:4,rec_prj_id:2,rec_description:'c',rec_timestamp_planned_start:1583911710000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:0,rec_timestamp_paid:0,rec_total:0},
        6:{rec_id:6,rec_temp_id:'',rec_usr_id:4,rec_prj_id:1,rec_description:'d',rec_timestamp_planned_start:1584111810000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:0,rec_timestamp_paid:0,rec_total:0},
        7:{rec_id:7,rec_temp_id:'',rec_usr_id:4,rec_prj_id:2,rec_description:'e',rec_timestamp_planned_start:1584311910000,rec_timestamp_planned_finish:1584311310000,rec_timestamp_completed:0,rec_timestamp_paid:0,rec_total:0}
    };
    win_db_rec_items = {
        1:{rci_id:1,rci_temp_id:'',rec_usr_id:4,rci_rec_id:1,rci_work:'Mowing',rci_unit:'hr',rci_qty:2,rci_cost_per_unit:20.50,rci_cost:41.00},
        2:{rci_id:2,rci_temp_id:'',rec_usr_id:4,rci_rec_id:1,rci_work:'Hedge Cutting',rci_unit:'hr',rci_qty:2,rci_cost_per_unit:20,rci_cost:40},
        4:{rci_id:4,rci_temp_id:'',rec_usr_id:4,rci_rec_id:1,rci_work:'Power Washing',rci_unit:'tile',rci_qty:38,rci_cost_per_unit:2,rci_cost:76}
    };
    
    
    
    
    
    
    refreshWinVars();
    
