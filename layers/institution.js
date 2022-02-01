addLayer("ins", {
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        //best: new Decimal(0),
        total: new Decimal(0),
        inslevel:{
            Eng: new Decimal(0),
            Fra: new Decimal(0),
            Deu: new Decimal(0),
            Che: new Decimal(0),
            Pol: new Decimal(0),
            Nor: new Decimal(0),
            Rus: new Decimal(0),
            Egy: new Decimal(0),
            Sau: new Decimal(0),
            Isr: new Decimal(0),
        },
        select:null,
    }},

    color: "#45b5d3",
    symbol: "I",
    name: "Institution",
    resource: "Institution Funds",
    row: 5,
    displayRow:4,
    branches: ["lab"],

    baseResource: "Research Power",
    baseAmount() { return player.lab.power },

    requires: new Decimal(1e35),

    type: "custom",
    exponent: 0.25,
    base:2,

    getResetGain(){
        let getmax = player.ins.total;
        while(player.lab.power.gte(Decimal.pow(this.requires,(Decimal.pow(getmax.plus(1),this.exponent))).times(layers.ins.gainMult()))){
            getmax = getmax.plus(1);
        };
        return getmax.sub(player[this.layer].total).floor();
    },

    getNextAt(canMax=true){
        return Decimal.pow(this.requires,(Decimal.pow(player[this.layer].total.plus(this.getResetGain()).plus(1),this.exponent))).times(layers.ins.gainMult())
    },
    canReset(){
        return player.lab.power.gte(Decimal.pow(this.requires,(Decimal.pow(player[this.layer].total.plus(1),this.exponent))).times(layers.ins.gainMult()))
    },
    prestigeButtonText(){
        let des = "";
        if (canReset('ins')) des += "Reset for +"+formatWhole(this.getResetGain())+" Institution Funds<br>"
        des += "Next At: "+format(player.lab.power)+"/"+format(getNextAt(this.layer))+" Research Power";
        return des;
    },
    prestigeNotify(){
        if (!canReset('ins')) return false;
        else return true;
    },

    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones",]
        },
        "Institutuons": {
            unlocked(){return(hasMilestone('ins',0)) },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["clickable",11],
                ["row",[//Eng
                    ["display-text",function(){return "England"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",21],
                    ["blank",["10px","10px"]],
                    ["clickable",22],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Eng)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Eng())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",23],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #00bdf9;'>Passive</h3>"},{}],
                        ["display-text",function(){return "lab-boosting"},{}],
                    ]],
                ]],
                ["row",[//Fra
                    ["display-text",function(){return "France"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",31],
                    ["blank",["10px","10px"]],
                    ["clickable",32],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Fra)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Fra())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",33],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #ededed;'>Romanic</h3>"},{}],
                        ["display-text",function(){return "Light-boosting"},{}],
                    ]],
                ]],
                ["row",[//Deu
                    ["display-text",function(){return "Germany"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",41],
                    ["blank",["10px","10px"]],
                    ["clickable",42],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Deu)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Deu())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",43],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #383838;'>Rigorous</h3>"},{}],
                        ["display-text",function(){return "Dark-boosting"},{}],
                    ]],
                ]],
                ["row",[//Che
                    ["display-text",function(){return "Switzerland"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",51],
                    ["blank",["10px","10px"]],
                    ["clickable",52],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Che)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Che())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",53],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(255,26,26);'>Coordinate</h3>"},{}],
                        ["display-text",function(){return "Nerf-decreasing"},{}],
                    ]],
                ]],
                ["row",[//Pol
                    ["display-text",function(){return "Poland"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",61],
                    ["blank",["10px","10px"]],
                    ["clickable",62],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Pol)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Pol())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",63],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(255,128,128);'>Traffic</h3>"},{}],
                        ["display-text",function(){return "Neighbor-boosting"},{}],
                    ]],
                ]],
                ["row",[//Nor
                    ["display-text",function(){return "Norway"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",71],
                    ["blank",["10px","10px"]],
                    ["clickable",72],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Nor)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Nor())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",73],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(239,43,45);'>Chilly</h3>"},{}],
                        ["display-text",function(){return "Price decreasing"},{}],
                    ]],
                ]],
                ["row",[//Rus
                    ["display-text",function(){return "Russia"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",81],
                    ["blank",["10px","10px"]],
                    ["clickable",82],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Rus)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Rus())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",83],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(0,56,165);'>Authority</h3>"},{}],
                        ["display-text",function(){return "row2-boosting"},{}],
                    ]],
                ]],
                ["row",[//Egy
                    ["display-text",function(){return "Egypt"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",91],
                    ["blank",["10px","10px"]],
                    ["clickable",92],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Egy)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Egy())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",93],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #fcf788;'>Historical</h3>"},{}],
                        ["display-text",function(){return "Architecture-boositng"},{}],
                    ]],
                ]],
                ["row",[//Sau
                    ["display-text",function(){return "Saudi Arabia"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",101],
                    ["blank",["10px","10px"]],
                    ["clickable",102],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Sau)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Sau())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",103],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(1,108,54);'>Resources</h3>"},{}],
                        ["display-text",function(){return "boost-by-currencies"},{}],
                    ]],
                ]],
                ["row",[//Isr
                    ["display-text",function(){return "Isreal"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",111],
                    ["blank",["10px","10px"]],
                    ["clickable",112],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Isr)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Isr())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",113],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(16,62,140);'>Religious</h3>"},{}],
                        ["display-text",function(){return "boost-by-milestones"},{}],
                    ]],
                ]],
                ]
        },
        "Effects":{
            unlocked(){return(hasMilestone('ins',0)) },
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text",function(){
                    switch(player.ins.select){
                        case null:return "You haven't choose an institution yet!"
                        case 'Eng':return "You are choosing England Institution site."
                        case 'Fra':return "You are choosing France Institution site."
                        case 'Deu':return "You are choosing Germany Institution site."
                        case 'Che':return "You are choosing Switzerland Institution site."
                        case 'Pol':return "You are choosing Poland Institution site."
                        case 'Nor':return "You are choosing Norway Institution site."
                        case 'Rus':return "You are choosing Russia Institution site."
                        case 'Egy':return "You are choosing Russia Institution site."
                        case 'Sau':return "You are choosing Saudi Arabia Institution site."
                        case 'Isr':return "You are choosing Isreal Institution site."
                        default:return "Error/Not coded yet."
                    }
                },{}],
                "blank",
                ["infobox","give"],
                ["infobox","receive"],
            ]
        }
    },

    hotkeys: [
        {key: "i", description: "I: Reset for Institution Funds", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    doReset(resettinglayer){
        //nothing
    },

    insCost(){//costing Funds
    return {
        Eng(){return player.ins.inslevel.Eng.plus(1)},
        Fra(){return player.ins.inslevel.Fra.plus(1)},
        Deu(){return player.ins.inslevel.Deu.plus(1)},
        Che(){return player.ins.inslevel.Che.plus(1)},
        Pol(){return player.ins.inslevel.Pol.plus(1)},
        Nor(){return player.ins.inslevel.Nor.plus(1)},
        Rus(){return player.ins.inslevel.Rus.plus(1)},
        Egy(){return player.ins.inslevel.Egy.plus(1)},
        Sau(){return player.ins.inslevel.Sau.plus(1)},
        Isr(){return player.ins.inslevel.Isr.plus(1)},
    }
    },

    insEffect(){//Institution effects
        return {
            Eng(){return Decimal.pow(player.ins.inslevel.Eng.plus(3),player.ins.inslevel.Eng)},
            Fra(){return {
                Pos(){
                    if (player.ins.inslevel.Fra.lte(0)) return new Decimal(1);
                    let eff = Decimal.pow(200,player.ins.inslevel.Fra).times(layers.ins.insEffect().Deu().Neg());
                    return eff.max(1);
                },
                Neg(){
                    if (player.ins.inslevel.Fra.lte(0)) return new Decimal(1);
                    let eff = new Decimal(1).sub(player.ins.inslevel.Fra.plus(2).ln().log(5).times(layers.ins.insEffect().Che()));
                    return eff.max(0);
                }
            }},
            Deu(){return {
                Pos(){
                    if (player.ins.inslevel.Deu.lte(0)) return new Decimal(1);
                    let eff = Decimal.pow(200,player.ins.inslevel.Deu);
                    //pos
                    eff=eff.pow(layers.ins.insEffect().Pol())

                    //nerf
                    eff = eff.times(layers.ins.insEffect().Fra().Neg())

                    return eff.max(1);
                },
                Neg(){
                    if (player.ins.inslevel.Deu.lte(0)) return new Decimal(1);
                    let eff = new Decimal(1).sub(player.ins.inslevel.Deu.plus(2).ln().log(5).times(layers.ins.insEffect().Che()));
                    return eff.max(0);
                }
            }},
            Che(){
                if (player.ins.inslevel.Che.lte(0)) return new Decimal(1);
                return new Decimal(1).sub(player.ins.inslevel.Che.plus(1).sqrt().log(20)).max(0)
            },
            Pol(){
                let eff = new Decimal(1).plus(player.ins.inslevel.Pol.times(0.05));
                //pos

                //nerf
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.max(1);
            },
            Nor(){
                let eff = new Decimal(1).plus(player.ins.points.times(0.1)).pow(player.ins.inslevel.Nor);
                //pos
                eff = eff.pow(layers.ins.insEffect().Pol())
                //nerf
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.max(1);
            },
            Rus(){
                return {
                    Pos(){
                        let effbase = player.ins.inslevel.Eng.plus(player.ins.inslevel.Fra).plus(player.ins.inslevel.Deu).plus(player.ins.inslevel.Che).plus(player.ins.inslevel.Pol).plus(player.ins.inslevel.Nor).plus(player.ins.inslevel.Rus)
                        effbase = effbase.plus(player.ins.inslevel.Egy).plus(player.ins.inslevel.Sau).plus(player.ins.inslevel.Isr)
                        let eff = Decimal.pow(player.ins.inslevel.Rus.plus(1),effbase);
                        //pos
                        eff = eff.pow(layers.ins.insEffect().Pol())
                        //nerf
        
                        return eff.max(1);},
                    Neg(){
                        let neg = player.ins.inslevel.Rus.plus(1).pow(1/6).ln();
                        neg = neg.times(layers.ins.insEffect().Che());
                        return new Decimal(1).sub(neg).max(0);
                    },
                }
            },
            Egy(){
                return{
                    Pos(){
                        let eff = player.ins.inslevel.Egy.times(0.05).plus(1);
                    //pos

                    //nerf
                    eff = eff.times(layers.ins.insEffect().Isr().Neg())

                    return eff.max(1);
                    },
                    Neg(){
                        if (player.ins.inslevel.Egy.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.25);
                        neg = neg.times(layers.ins.insEffect().Che());
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Sau(){//每加一个层都要回来看一遍
                return{
                    Pos(){
                        let effbase = new Decimal(0);
                    effbase = effbase.plus(player.points.max(1).log(10));
                    effbase = effbase.plus(player.mem.points.max(1).log(10));
                    effbase = effbase.plus(player.light.points.max(1).log(10));
                    effbase = effbase.plus(player.dark.points.max(1).log(10));
                    effbase = effbase.plus(player.kou.points.max(1).log(10));
                    effbase = effbase.plus(player.lethe.points.max(1).log(10));
                    effbase = effbase.plus(player.lab.points.max(1).log(10));
                    effbase = effbase.plus(player.rei.points.max(1).log(10));
                    effbase = effbase.plus(player.yugamu.points.max(1).log(10));
                    effbase = effbase.plus(player.world.points.max(1).log(10));
                    effbase = effbase.plus(player.storylayer.points.max(1).log(10));
                    effbase = effbase.plus(player.etoluna.points.max(1).log(10));
                    effbase = effbase.plus(player.saya.points.max(1).log(10));
                    effbase = effbase.plus(player.ins.points.max(1).log(10));

                    let eff=effbase.times(player.ins.inslevel.Sau);
                        //pos

                    //nerf
                    eff = eff.times(layers.ins.insEffect().Isr().Neg())

                    return eff.max(1);
                    },
                    Neg(){
                        if (player.ins.inslevel.Sau.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.25);
                        neg = neg.times(layers.ins.insEffect().Che());
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Isr(){//每加一个层都要回来看一遍
                return {
                    Pos(){
                        let effbase = new Decimal(0);
                        effbase = effbase.plus(player.mem.milestones.length);
                        effbase = effbase.plus(player.light.milestones.length);
                        effbase = effbase.plus(player.dark.milestones.length);
                        effbase = effbase.plus(player.kou.milestones.length);
                        effbase = effbase.plus(player.lethe.milestones.length);
                        effbase = effbase.plus(player.lab.milestones.length);
                        effbase = effbase.plus(player.rei.milestones.length);
                        effbase = effbase.plus(player.yugamu.milestones.length);
                        effbase = effbase.plus(player.world.milestones.length);
                        effbase = effbase.plus(player.storylayer.milestones.length);
                        effbase = effbase.plus(player.etoluna.milestones.length);
                        effbase = effbase.plus(player.saya.milestones.length);
                        effbase = effbase.plus(player.ins.milestones.length);

                        let eff=effbase.times(player.ins.inslevel.Isr);
                        //pos

                        //nerf
                        eff = eff.times(layers.ins.insEffect().Egy().Neg())
                        eff = eff.times(layers.ins.insEffect().Sau().Neg())
                        
                        return eff.max(1);
                    },
                    Neg(){
                        if (player.ins.inslevel.Isr.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.5);
                        neg = neg.times(layers.ins.insEffect().Che());
                        return new Decimal(1).sub(neg);
                    },
                }
            },
        }
    },

    gainMult() {//gain div
        let gm = new Decimal(1);
        gm = gm.div(layers.ins.insEffect().Nor());
        if (hasAchievement('a',112)) gm = gm.div(achievementEffect('a',112));
        if (hasAchievement('lab',33)) gm = gm.div(achievementEffect('lab',33));
        return gm;
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('storylayer',35) },

    upgrades: {
    },
    milestones:{
        0: {
            requirementDescription: "1 Institution Fund",
            done() { return player.ins.total.gte(1)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "Keep G&K Milestones and Unlock England institution site.",
        },
        1: {
            requirementDescription: "2 Institution Funds",
            done() { return player.ins.total.gte(2)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "Keep G's upgrades & K's Memory adjustments and Unlock Western Europe institution sites.",
        },
        2: {
            requirementDescription: "3 Institution Funds",
            done() { return player.ins.total.gte(3)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "Gain 10% of G's gain every second & You can buy max K and Unlock Eastern Europe institution sites.",
        },
        3: {
            requirementDescription: "4 Institution Funds",
            done() { return player.ins.total.gte(4)},
            unlocked(){return player.ins.unlocked},
            effectDescription() {
                let des = "Unused Institution Funds boosts Frag and Unlock Mid-East institution sites."
                if (hasMilestone('ins',3)) des += ("<br>Currently: "+format(tmp['ins'].milestones[3].effect)+"x")
                return des;
            },
            effect(){//tmp
                return Decimal.pow(3,player.ins.points);
            },
        },
    },
    clickables: {
        //rows: 1,
        //cols: 2,
        11: {
            title: "",
            display: "Respec",
            unlocked() { return player.ins.unlocked },
            canClick() { return true },
            onClick() { //每加一个ins就要在这里加
                if (!confirm("Are you Sure to respec your Institutions?")) return;
                player[this.layer].resetTime=0;
                player.ins.select = null;
                //---------
                player.ins.inslevel.Eng = new Decimal(0);
                player.ins.inslevel.Fra = new Decimal(0);
                player.ins.inslevel.Deu = new Decimal(0);
                player.ins.inslevel.Che = new Decimal(0);
                player.ins.inslevel.Pol = new Decimal(0);
                player.ins.inslevel.Nor = new Decimal(0);
                player.ins.inslevel.Rus = new Decimal(0);
                player.ins.inslevel.Egy = new Decimal(0);
                player.ins.inslevel.Sau = new Decimal(0);
                player.ins.inslevel.Isr = new Decimal(0);
                //---------
                //player.ins.best = player.ins.total;
                player.ins.points = player.ins.total;
            },
            style: {"height": "50px", "width": "100px","min-height":"50px",},
        },
        21: {
            title: "",
            display: "Select",//Eng
            unlocked() { return player.ins.unlocked },
            canClick() { return true },
            onClick() { 
                player[this.layer].select = 'Eng';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){if (player.ins.select=='Eng')return "rgb(119,191,95)";else return "#666666"}},
        },
        22: {
            title: "",
            display: "-",//Eng
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Eng.gt(0) },
            onClick() { 
                player.ins.inslevel.Eng = player.ins.inslevel.Eng.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Eng());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        23: {
            title: "",
            display: "+",//Eng
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Eng()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Eng());
                player.ins.inslevel.Eng = player.ins.inslevel.Eng.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        31: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Fra
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',1) },
            onClick() { 
                player[this.layer].select = 'Fra';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',1))?((player.ins.select=='Fra')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        32: {
            title: "",
            display: "-",//Fra
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Fra.gt(0)&&hasMilestone('ins',1) },
            onClick() { 
                player.ins.inslevel.Fra = player.ins.inslevel.Fra.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Fra());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        33: {
            title: "",
            display: "+",//Fra
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Fra())&&hasMilestone('ins',1) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Fra());
                player.ins.inslevel.Fra = player.ins.inslevel.Fra.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        41: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Deu
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',1) },
            onClick() { 
                player[this.layer].select = 'Deu';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',1))?((player.ins.select=='Deu')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        42: {
            title: "",
            display: "-",//Deu
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Deu.gt(0)&&hasMilestone('ins',1) },
            onClick() { 
                player.ins.inslevel.Deu = player.ins.inslevel.Deu.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Deu());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        43: {
            title: "",
            display: "+",//Deu
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Deu())&&hasMilestone('ins',1) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Deu());
                player.ins.inslevel.Deu = player.ins.inslevel.Deu.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        51: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Che
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',1) },
            onClick() { 
                player[this.layer].select = 'Che';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',1))?((player.ins.select=='Che')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        52: {
            title: "",
            display: "-",//Che
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Che.gt(0)&&hasMilestone('ins',1) },
            onClick() { 
                player.ins.inslevel.Che = player.ins.inslevel.Che.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Che());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        53: {
            title: "",
            display: "+",//Che
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Che())&&hasMilestone('ins',1) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Che());
                player.ins.inslevel.Che = player.ins.inslevel.Che.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        61: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Pol
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',2) },
            onClick() { 
                player[this.layer].select = 'Pol';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',2))?((player.ins.select=='Pol')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        62: {
            title: "",
            display: "-",//Pol
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Pol.gt(0)&&hasMilestone('ins',2) },
            onClick() { 
                player.ins.inslevel.Pol = player.ins.inslevel.Pol.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Pol());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        63: {
            title: "",
            display: "+",//Pol
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Pol())&&hasMilestone('ins',2) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Pol());
                player.ins.inslevel.Pol = player.ins.inslevel.Pol.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        71: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Nor
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',2) },
            onClick() { 
                player[this.layer].select = 'Nor';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',2))?((player.ins.select=='Nor')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        72: {
            title: "",
            display: "-",//Nor
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Nor.gt(0)&&hasMilestone('ins',2) },
            onClick() { 
                player.ins.inslevel.Nor = player.ins.inslevel.Nor.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Nor());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        73: {
            title: "",
            display: "+",//Nor
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Nor())&&hasMilestone('ins',2) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Nor());
                player.ins.inslevel.Nor = player.ins.inslevel.Nor.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        81: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Rus
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',2) },
            onClick() { 
                player[this.layer].select = 'Rus';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',2))?((player.ins.select=='Rus')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        82: {
            title: "",
            display: "-",//Rus
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Rus.gt(0)&&hasMilestone('ins',2) },
            onClick() { 
                player.ins.inslevel.Rus = player.ins.inslevel.Rus.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Rus());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        83: {
            title: "",
            display: "+",//Rus
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Rus())&&hasMilestone('ins',2) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Rus());
                player.ins.inslevel.Rus = player.ins.inslevel.Rus.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        91: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Egy
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',3) },
            onClick() { 
                player[this.layer].select = 'Egy';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',3))?((player.ins.select=='Egy')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        92: {
            title: "",
            display: "-",//Egy
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Egy.gt(0)&&hasMilestone('ins',3) },
            onClick() { 
                player.ins.inslevel.Egy = player.ins.inslevel.Egy.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Egy());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        93: {
            title: "",
            display: "+",//Egy
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Egy())&&hasMilestone('ins',3) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Egy());
                player.ins.inslevel.Egy = player.ins.inslevel.Egy.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        101: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Sau
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',3) },
            onClick() { 
                player[this.layer].select = 'Sau';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',3))?((player.ins.select=='Sau')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        102: {
            title: "",
            display: "-",//Sau
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Sau.gt(0)&&hasMilestone('ins',3) },
            onClick() { 
                player.ins.inslevel.Sau = player.ins.inslevel.Sau.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Sau());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        103: {
            title: "",
            display: "+",//Sau
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Sau())&&hasMilestone('ins',3) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Sau());
                player.ins.inslevel.Sau = player.ins.inslevel.Sau.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        111: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Isr
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',3) },
            onClick() { 
                player[this.layer].select = 'Isr';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',3))?((player.ins.select=='Isr')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        112: {
            title: "",
            display: "-",//Isr
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Isr.gt(0)&&hasMilestone('ins',3) },
            onClick() { 
                player.ins.inslevel.Isr = player.ins.inslevel.Isr.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Isr());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        113: {
            title: "",
            display: "+",//Isr
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Isr())&&hasMilestone('ins',3) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Isr());
                player.ins.inslevel.Isr = player.ins.inslevel.Isr.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
    },
    infoboxes: {
        give:{
            title:"Giving effects",
            body(){//用case就不用海量if了
                switch(player.ins.select){
                    case null:return "You haven't choose an institution yet!"
                    case 'Eng':{return "Boosts Research Point gain, Research Power gain, and pushes Research Point softcap starts later by <h3 style='color: #00bdf9;'>x"+format(layers.ins.insEffect().Eng())+"</h3>"}
                    case 'Fra':{return "Boosts Light Tachyon gain, Red Doll gain, Luminous Church gain and Glowing Rose gain by <h3 style='color: #ededed;'>x"+format(layers.ins.insEffect().Fra().Pos())+"</h3>"}
                    case 'Deu':{return "Boosts Dark Matters gain, Forgotten Drops gain, Flourish Labyrinths gain and Maze Effects by <h3 style='color: #383838;'>x"+format(layers.ins.insEffect().Deu().Pos())+"</h3>"}
                    case 'Che':{return "Decreases nerfs by sites by <h3 style='color: rgb(255,26,26);'>x"+format(layers.ins.insEffect().Che())+"</h3>"}
                    case 'Pol':{return "Boost neighbor sites(Norway, Russia, German) by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"}
                    case 'Nor':{return "Boost Institusion Fund gain by <h3 style='color: rgb(239,43,45);'>x"+format(layers.ins.insEffect().Nor())+"</h3>, based on your unused Institution Funds."}
                    case 'Rus':{return "Boost Light Tachyon & Dark Matter gain by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Pos())+"</h3>, based on total levels of all sites."}
                    case 'Egy':{return "Boost Luminous Church&Flourish Labyrinth direct gain by <h3 style='color: #fcf788;'>x"+format(layers.ins.insEffect().Egy().Pos())+"</h3>"}
                    case 'Sau':{return "Boost Fragment generation by <h3 style='color: rgb(1,108,54);'>x"+format(layers.ins.insEffect().Sau().Pos())+"</h3>, based on all your layer currencies."}
                    case 'Isr':{return "Push memory softcap starts later by <h3 style='color: rgb(16,62,140);'>x"+format(layers.ins.insEffect().Isr().Pos())+"</h3>, based on Milestones you have."}
                    default:return "Error/Not coded yet."
                }
            },
            unlocked(){return player.ins.unlocked},
        },
        receive:{
            title:"Receiving effects",
            body(){
                switch(player.ins.select){
                    case null:return "You haven't choose an institution yet!"
                    case 'Eng':return "This site won't receive any effect from other sites."
                    case 'Fra':{
                        let des=("Effect nerfed by Germany site by <h3 style='color: #383838;'>x"+format(layers.ins.insEffect().Deu().Neg())+"</h3>")
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    case 'Deu':{
                        let des = ("Effect nerfed by France site by <h3 style='color: #ededed;'>x"+format(layers.ins.insEffect().Fra().Neg())+"</h3>")
                        if (hasMilestone('ins',2)) des += "<br>Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    case 'Che':return "Placeholder"
                    case 'Pol':{
                        let des = "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Neg())+"</h3>"
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    case 'Nor':{
                        let des = "Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"
                        des += "<br>Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Neg())+"</h3>"
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    case 'Rus':{
                        let des = "Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"
                        return des;
                    }
                    case 'Egy':{
                        let des = "Effect nerfed by Isreal site by <h3 style='color: rgb(16,62,140);'>x"+format(layers.ins.insEffect().Isr().Neg())+"</h3>"
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    case 'Sau':{
                        let des = "Effect nerfed by Isreal site by <h3 style='color: rgb(16,62,140);'>x"+format(layers.ins.insEffect().Isr().Neg())+"</h3>"
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    case 'Isr':{
                        let des = "Effect nerfed by Egypt site by <h3 style='color: #fcf788;'>x"+format(layers.ins.insEffect().Egy().Neg())+"</h3>"
                        des += "<br>Effect nerfed by Saudi Arabia site by <h3 style='color: rgb(1,108,54);'>x"+format(layers.ins.insEffect().Sau().Neg())+"</h3>"
                        des += ("<br>(Nerf decreased by Switzerland site by x"+format(layers.ins.insEffect().Che())+")")
                        return des;
                    }
                    default:return "Error/Not coded yet."
                }
            },
            unlocked(){return player.ins.unlocked},
        },
    },
})