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
            Jpn: new Decimal(0),
            Ind: new Decimal(0),
            Kaz: new Decimal(0),
            Chn: new Decimal(0),
            Can: new Decimal(0),
            Usa: new Decimal(0),
            Bra: new Decimal(0),
            Arg: new Decimal(0),
            Nga: new Decimal(0),
            Zaf: new Decimal(0),
            Aus: new Decimal(0),
            Nzl: new Decimal(0),
        },
        select:null,
    }},

    color: "#45b5d3",
    symbol: "I",
    name: "Institution",
    resource: "Institution Funds",
    row: 5,
    position:3,
    displayRow: 5,
    branches: ["lab"],

    baseResource: "Research Power",
    baseAmount() { return player.lab.power },

    requires: new Decimal(1e35),

    type: "custom",
    exponent: 0.25,
    base:2,

    getResetGain(){
        let getmax=player.lab.power.div(layers.ins.gainMult()).log(this.requires).pow(1/this.exponent);
        //if (hasMilestone('ins',7)) getmax = getmax.times(layers.ins.insEffect().Aus())
        return getmax.sub(player.ins.total).floor().max(0);
    },

    getNextAt(canMax=true){
        return Decimal.pow(this.requires,(Decimal.pow(player.lab.power.div(layers.ins.gainMult()).log(this.requires).pow(1/this.exponent).floor().max(0).max(player.ins.total).plus(1),this.exponent))).times(layers.ins.gainMult())
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
                        ["display-text",function(){return "Nerf-compensating"},{}],
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
                ["row",[//Jpn
                    ["display-text",function(){return "Japan"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",121],
                    ["blank",["10px","10px"]],
                    ["clickable",122],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Jpn)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Jpn())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",123],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #fdb8e0;'>Active</h3>"},{}],
                        ["display-text",function(){return "short-time boost"},{}],
                    ]],
                ]],
                ["row",[//Ind
                    ["display-text",function(){return "India"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",131],
                    ["blank",["10px","10px"]],
                    ["clickable",132],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Ind)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Ind())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",133],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(240,139,47);'>Out-Source</h3>"},{}],
                        ["display-text",function(){return "boost by boosts"},{}],
                    ]],
                ]],
                ["row",[//Kaz
                    ["display-text",function(){return "Kazakhstan"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",141],
                    ["blank",["10px","10px"]],
                    ["clickable",142],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Kaz)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Kaz())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",143],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(0,176,199);'>Inner</h3>"},{}],
                        ["display-text",function(){return "Sine-boosting"},{}],
                    ]],
                ]],
                ["row",[//Chn
                    ["display-text",function(){return "China"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",151],
                    ["blank",["10px","10px"]],
                    ["clickable",152],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Chn)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Chn())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",153],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(238,28,37);'>Central</h3>"},{}],
                        ["display-text",function(){return "massive-boosting"},{}],
                    ]],
                ]],
                ["row",[//Can
                    ["display-text",function(){return "Canada"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",161],
                    ["blank",["10px","10px"]],
                    ["clickable",162],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Can)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Can())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",163],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(254,0,0);'>Idle</h3>"},{}],
                        ["display-text",function(){return "long-time boost"},{}],
                    ]],
                ]],
                ["row",[//Usa
                    ["display-text",function(){return "USA"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",171],
                    ["blank",["10px","10px"]],
                    ["clickable",172],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Usa)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Usa())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",173],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(60,59,110);'>Global</h3>"},{}],
                        ["display-text",function(){return "Worldwide boosts"},{}],
                    ]],
                ]],
                ["row",[//Bra
                    ["display-text",function(){return "Brazil"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",181],
                    ["blank",["10px","10px"]],
                    ["clickable",182],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Bra)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Bra())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",183],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(0,150,65);'>Environmental</h3>"},{}],
                        ["display-text",function(){return "time-based boosts"},{}],
                    ]],
                ]],
                ["row",[//Arg
                    ["display-text",function(){return "Argentina"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",191],
                    ["blank",["10px","10px"]],
                    ["clickable",192],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Arg)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Arg())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",193],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(116,172,223);'>Astronomical</h3>"},{}],
                        ["display-text",function(){return "Gemini boosts"},{}],
                    ]],
                ]],
                ["row",[//Nga
                    ["display-text",function(){return "Nigeria"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",201],
                    ["blank",["10px","10px"]],
                    ["clickable",202],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Nga)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Nga())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",203],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(0,134,81);'>Development</h3>"},{}],
                        ["display-text",function(){return "boost-by-upgrades"},{}],
                    ]],
                ]],
                ["row",[//Zaf
                    ["display-text",function(){return "South Africa"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",211],
                    ["blank",["10px","10px"]],
                    ["clickable",212],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Zaf)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Zaf())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",213],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: rgb(255,182,18);'>Potential</h3>"},{}],
                        ["display-text",function(){return "boost-by-challenges"},{}],
                    ]],
                ]],
                ["row",[//Aus
                    ["display-text",function(){return "Australia"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",221],
                    ["blank",["10px","10px"]],
                    ["clickable",222],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Aus)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Aus())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",223],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #fb5bf1;'>Backup</h3>"},{}],
                        ["display-text",function(){return "boost fund gain"},{}],
                    ]],
                ]],
                ["row",[//Nzl
                    ["display-text",function(){return "New Zealand"},{'width':'20%'}],
                    ["blank",["10px","10px"]],
                    ["clickable",231],
                    ["blank",["10px","10px"]],
                    ["clickable",232],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "Level: <a style='color: #45b5d3;text-shadow:0px 0px 10px #45b5d3'>"+formatWhole(player.ins.inslevel.Nzl)+"</a>"},{}],
                        ["display-text",function(){return "Level up cost: "+formatWhole(layers.ins.insCost().Nzl())+" Institution Funds"},{}],
                    ]],
                    ["blank",["10px","10px"]],
                    ["clickable",233],
                    ["blank",["10px","10px"]],
                    ["column",[
                        ["display-text",function(){return "<h3 style='color: #6bfb60;'>Variety</h3>"},{}],
                        ["display-text",function(){return "boost-by-layers"},{}],
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
                        case 'Jpn':return "You are choosing Japan Institution site."
                        case 'Kaz':return "You are choosing Kazakhstan Institution site."
                        case 'Chn':return "You are choosing China Institution site."
                        case 'Can':return "You are choosing Canada Institution site."
                        case 'Usa':return "You are choosing USA Institution site."
                        case 'Bra':return "You are choosing Brazil Institution site."
                        case 'Arg':return "You are choosing Argentina Institution site."
                        case 'Nga':return "You are choosing Nigeria Institution site."
                        case 'Zaf':return "You are choosing South Africa Institution site."
                        case 'Aus':return "You are choosing Australia Institution site."
                        case 'Nzl':return "You are choosing New Zealand Institution site."
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
        Eng(){return player.ins.inslevel.Eng.plus(1);},
        Fra(){return player.ins.inslevel.Fra.plus(1)},
        Deu(){return player.ins.inslevel.Deu.plus(1)},
        Che(){return player.ins.inslevel.Che.plus(1)},
        Pol(){return player.ins.inslevel.Pol.plus(1)},
        Nor(){return player.ins.inslevel.Nor.plus(1)},
        Rus(){return player.ins.inslevel.Rus.plus(1)},
        Egy(){return player.ins.inslevel.Egy.plus(1)},
        Sau(){return player.ins.inslevel.Sau.plus(1)},
        Isr(){return player.ins.inslevel.Isr.plus(1)},
        Jpn(){return player.ins.inslevel.Jpn.plus(1)},
        Ind(){return player.ins.inslevel.Ind.plus(1)},
        Kaz(){return player.ins.inslevel.Kaz.plus(1)},
        Chn(){return player.ins.inslevel.Chn.plus(1)},
        Can(){return player.ins.inslevel.Can.plus(1)},
        Usa(){return player.ins.inslevel.Usa.plus(1)},
        Bra(){return player.ins.inslevel.Bra.plus(1)},
        Arg(){return player.ins.inslevel.Arg.plus(1)},
        Nga(){return player.ins.inslevel.Nga.plus(1)},
        Zaf(){return player.ins.inslevel.Zaf.plus(1)},
        Aus(){return player.ins.inslevel.Aus.plus(1)},
        Nzl(){return player.ins.inslevel.Nzl.plus(1)},
    }
    },

    levelHardcap(){//level hardcap
        return {
            Eng(){return new Decimal(10);},
            Fra(){return new Decimal(10);},
            Deu(){return new Decimal(10);},
            Che(){return new Decimal(10);},
            Pol(){return new Decimal(10);},
            Nor(){return new Decimal(10);},
            Rus(){return new Decimal(10);},
            Egy(){return new Decimal(10);},
            Sau(){return new Decimal(10);},
            Isr(){return new Decimal(10);},
            Jpn(){return new Decimal(10);},
            Ind(){return new Decimal(10);},
            Kaz(){return new Decimal(10);},
            Chn(){return new Decimal(10);},
            Can(){return new Decimal(10);},
            Usa(){return new Decimal(10);},
            Bra(){return new Decimal(10);},
            Arg(){return new Decimal(10);},
            Nga(){return new Decimal(10);},
            Zaf(){return new Decimal(10);},
            Aus(){return new Decimal(10);},
            Nzl(){return new Decimal(10);},
        }
        },

    insEffect(){//Institution effects
        return {
            Eng(){
                if (player.ins.inslevel.Eng.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(4,player.ins.inslevel.Eng)
                return eff;
            },
            Fra(){return {
                Pos(){
                    if (player.ins.inslevel.Fra.lte(0)) return new Decimal(1);
                    let eff = Decimal.pow(200,player.ins.inslevel.Fra.max(1).log(1.5).plus(1));
                    //pos
                    eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                    //nerf
                    eff=eff.times(layers.ins.insEffect().Deu().Neg())
                    return eff.max(1);
                },
                Neg(){
                    if (player.ins.inslevel.Fra.lte(0)) return new Decimal(1);
                    let eff = new Decimal(1).sub(player.ins.inslevel.Fra.plus(2).ln().log(5));
                    return eff.max(0);
                }
            }},
            Deu(){return {
                Pos(){
                    if (player.ins.inslevel.Deu.lte(0)) return new Decimal(1);
                    let eff = Decimal.pow(100,player.ins.inslevel.Deu.max(1).log(1.5).plus(1));
                    //pos
                    eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                    eff=eff.pow(layers.ins.insEffect().Pol())

                    //nerf
                    eff = eff.times(layers.ins.insEffect().Fra().Neg())

                    return eff.max(1);
                },
                Neg(){
                    if (player.ins.inslevel.Deu.lte(0)) return new Decimal(1);
                    let eff = new Decimal(1).sub(player.ins.inslevel.Deu.plus(2).ln().log(5));
                    return eff.max(0);
                }
            }},
            Che(){
                if (player.ins.inslevel.Che.lte(0)) return new Decimal(1);
                let exponent = new Decimal(0);
                if (layers.ins.insEffect().Fra().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Deu().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Rus().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Rus().fixedNeg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Egy().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Sau().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Isr().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Chn().Neg().lt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Chn().fixedNeg().lt(1)) exponent = exponent.plus(1);
                let eff = Decimal.pow(2,exponent).times(player.ins.inslevel.Che);
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner());
                if (eff.gte(500)) eff=eff.sub(500).pow(0.75).plus(500)
                //nerf
                return eff.max(1);
            },
            Pol(){
                if (player.ins.inslevel.Pol.lte(0)) return new Decimal(1);
                let eff = new Decimal(1).plus(player.ins.inslevel.Pol.times(0.05));
                if (eff.gt(1.50)) eff = eff.sub(1.50).times(100).plus(1).ln().div(100).plus(1.50);
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toExponent())
                //nerf
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.max(1);
            },
            Nor(){
                if (player.ins.inslevel.Nor.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(2.5,player.ins.inslevel.Nor).times(player.ins.points);
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                eff = eff.pow(layers.ins.insEffect().Pol())
                //nerf
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.max(1);
            },
            Rus(){
                return {
                    Pos(){
                        if (player.ins.inslevel.Rus.lte(0)) return new Decimal(1);
                        let effbase = player.ins.inslevel.Eng.plus(player.ins.inslevel.Fra).plus(player.ins.inslevel.Deu).plus(player.ins.inslevel.Che).plus(player.ins.inslevel.Pol).plus(player.ins.inslevel.Nor).plus(player.ins.inslevel.Rus)
                        effbase = effbase.plus(player.ins.inslevel.Egy).plus(player.ins.inslevel.Sau).plus(player.ins.inslevel.Isr)
                        effbase = effbase.plus(player.ins.inslevel.Jpn).plus(player.ins.inslevel.Ind).plus(player.ins.inslevel.Kaz).plus(player.ins.inslevel.Chn)
                        effbase = effbase.plus(player.ins.inslevel.Can).plus(player.ins.inslevel.Usa).plus(player.ins.inslevel.Bra).plus(player.ins.inslevel.Arg)
                        effbase = effbase.plus(player.ins.inslevel.Nga).plus(player.ins.inslevel.Zaf)
                        let eff = Decimal.pow(player.ins.inslevel.Rus.plus(1),effbase).div(10);
                        //pos
                        eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                        eff = eff.pow(layers.ins.insEffect().Pol())
                        //nerf
        
                        return eff.max(1);},
                    Neg(){
                        let neg = player.ins.inslevel.Rus.plus(1).pow(1/6).ln();
                        return new Decimal(1).sub(neg).max(0);
                    },
                    fixedNeg(){
                        if (player.ins.inslevel.Rus.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.75);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Egy() {
                return {
                    Pos() {
                        if (player.ins.inslevel.Egy.lte(0)) return new Decimal(1);
                        let eff = player.ins.inslevel.Egy.times(0.15).plus(1);
                    //pos
                    eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                    //nerf
                    eff = eff.times(layers.ins.insEffect().Isr().Neg())

                    return eff.max(1);
                    },
                    Neg(){
                        if (player.ins.inslevel.Egy.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.25);
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

                    let eff=effbase.times(player.ins.inslevel.Sau).div(50);
                    //pos
                    eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                    //nerf
                    eff = eff.times(layers.ins.insEffect().Isr().Neg())

                    return eff.max(1);
                    },
                    Neg(){
                        if (player.ins.inslevel.Sau.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.25);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Isr(){//每加一个层都要回来看一遍
                return {
                    Pos(){
                        if (player.ins.inslevel.Isr.lte(0)) return new Decimal(1);
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

                        let eff=effbase.pow(player.ins.inslevel.Isr.times(0.8));
                        //pos
                        eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Egy().Neg())
                        eff = eff.times(layers.ins.insEffect().Sau().Neg())
                        
                        return eff.max(1);
                    },
                    Neg(){
                        if (player.ins.inslevel.Isr.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.5);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Jpn(){
                let eff=new Decimal(1e4).div(new Decimal(10).pow(Decimal.log(player.ins.resetTime+1,15).times(Decimal.pow(player.ins.resetTime+1,0.1))))
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                eff = eff.pow(layers.ins.insEffect().Chn().Neg())
                return eff.times(player.ins.inslevel.Jpn).max(1);
            },
            Ind(){
                if (player.ins.inslevel.Ind.lte(0)) return new Decimal(1);
                let exponent = new Decimal(0);
                if (player.ins.inslevel.Pol.gt(0)&&player.ins.inslevel.Nor.gte(0)) exponent = exponent.plus(2);
                if (player.ins.inslevel.Pol.gt(0)&&player.ins.inslevel.Deu.gte(0)) exponent = exponent.plus(2);
                if (player.ins.inslevel.Pol.gt(0)&&player.ins.inslevel.Rus.gte(0)) exponent = exponent.plus(2);
                let eff = Decimal.pow(1.5,exponent);
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                eff = eff.pow(layers.ins.insEffect().Chn().Neg())
                return eff.max(1);
            },
            Kaz(){
                let amp=new Decimal(250);
                let eff=amp.times(Math.sin(player.ins.resetTime)+2);
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                eff = eff.pow(layers.ins.insEffect().Chn().Neg())
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.times(player.ins.inslevel.Kaz).max(1);

            },
            Chn(){
                return {
                    Pos(){
                        if (player.ins.inslevel.Chn.lte(0)) return new Decimal(1);
                        let eff=Decimal.pow(1e5,(player.ins.inslevel.Chn.times(0.5).plus(0.5)))
                        eff=eff.div(eff.log(5));
                        //pos
                        eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                        //neg
                        eff = eff.times(layers.ins.insEffect().Rus().Neg());
                        return eff.max(1);
                    },
                    Neg(){
                        let neg=player.ins.inslevel.Chn.times(0.05);
                        return new Decimal(1).sub(neg).max(0.1);
                    },
                    fixedNeg(){
                        if (player.ins.inslevel.Chn.lte(0)) return new Decimal(1);
                        let neg=new Decimal(0.75);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Can(){
                if (player.ins.inslevel.Can.lte(0)) return new Decimal(1);
                let eff=new Decimal(3).pow(Decimal.log(player.ins.resetTime+1,5).times(Decimal.pow(player.ins.resetTime+1,0.1)));
                eff=eff.div(eff.plus(1).log(10))
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                return eff.times(player.ins.inslevel.Can.div(2).plus(0.5)).max(1);
            },
            Usa(){
                return{
                    toLiner(){
                        if (player.ins.inslevel.Usa.lte(0)) return new Decimal(1);
                        let effbase=player.ins.inslevel.Usa.div(5).plus(1);
                        let eff=effbase.times(player.ins.inslevel.Usa.times(0.8))
                        //pos
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Chn().fixedNeg());
                        eff = eff.times(layers.ins.insEffect().Rus().fixedNeg());

                        return eff.max(1);
                    },
                    toExponent(){
                        if (player.ins.inslevel.Usa.lte(0)) return new Decimal(1);
                        let eff=player.ins.inslevel.Usa.div(100).plus(1);
                        if (eff.gt(1.25)) eff=eff.sub(1.25).times(100).sqrt().div(100).plus(1.25);
                        //pos
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Chn().fixedNeg());
                        eff = eff.times(layers.ins.insEffect().Rus().Neg());

                        return eff.max(1);
                    },
                }
            },
            Bra(){
                if (player.ins.inslevel.Bra.lte(0)) return new Decimal(1);
                let eff=new Decimal(player.timePlayed).div(3600*5).floor().times(2).pow(player.ins.inslevel.Bra)
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                return eff.max(1);
            },
            Arg(){
                if (player.ins.inslevel.Arg.lte(0)) return new Decimal(0);
                let eff=player.ins.inslevel.Arg.times(0.02);
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toExponent())
                return eff.min(1);
            },
            Nga(){
                if (player.ins.inslevel.Nga.lte(0)) return new Decimal(1);
                        let effbase = new Decimal(0);
                        effbase = effbase.plus(player.mem.upgrades.length);
                        effbase = effbase.plus(player.light.upgrades.length);
                        effbase = effbase.plus(player.dark.upgrades.length);
                        effbase = effbase.plus(player.kou.upgrades.length);
                        effbase = effbase.plus(player.lethe.upgrades.length);
                        effbase = effbase.plus(player.lab.upgrades.length);
                        effbase = effbase.plus(player.rei.upgrades.length);
                        effbase = effbase.plus(player.yugamu.upgrades.length);
                        effbase = effbase.plus(player.world.upgrades.length);
                        effbase = effbase.plus(player.storylayer.upgrades.length);
                        effbase = effbase.plus(player.etoluna.upgrades.length);
                        effbase = effbase.plus(player.saya.upgrades.length);
                        effbase = effbase.plus(player.ins.upgrades.length);

                        let eff=effbase.pow(player.ins.inslevel.Nga.times(0.8));
                        //pos
                        eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                return eff.max(1);
            },
            Zaf(){
                if (player.ins.inslevel.Zaf.lte(0)) return new Decimal(1);
                let effbase = new Decimal(0);
                effbase = new Decimal(challengeCompletions('kou',11)+challengeCompletions('kou',12)+challengeCompletions('kou',21)+challengeCompletions('kou',22)+challengeCompletions('kou',31)+challengeCompletions('kou',32)+challengeCompletions('kou',41)+challengeCompletions('kou',42)+challengeCompletions('kou',51))
                effbase = effbase.plus(challengeCompletions('saya',11)+challengeCompletions('saya',12)+challengeCompletions('saya',21)+challengeCompletions('saya',22)+challengeCompletions('saya',31)+challengeCompletions('saya',32)+challengeCompletions('saya',41)+challengeCompletions('saya',42))

                let eff=effbase.pow(player.ins.inslevel.Zaf.times(0.5));
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                return eff.max(1);
            },
            Aus(){
                if (player.ins.inslevel.Aus.lte(0)) return new Decimal(1);
                let eff = player.ins.total.times(0.02).times(player.ins.inslevel.Aus.times(0.2).plus(1)).plus(1);
                //pos
                eff=eff.sub(1).times(layers.ins.insEffect().Usa().toLiner()).plus(1);
                return eff.max(1);
            },
            Nzl(){
                if (player.ins.inslevel.Nzl.lte(0)) return new Decimal(1);
                let effbase = new Decimal(0);
                if (player.mem.unlocked) effbase = effbase.plus(1);
                if (player.light.unlocked) effbase = effbase.plus(1);
                if (player.dark.unlocked) effbase = effbase.plus(1);
                if (player.kou.unlocked) effbase = effbase.plus(1);
                if (player.lethe.unlocked) effbase = effbase.plus(1);
                if (player.lab.unlocked) effbase = effbase.plus(1);
                if (player.rei.unlocked) effbase = effbase.plus(1);
                if (player.yugamu.unlocked) effbase = effbase.plus(1);
                if (player.world.unlocked) effbase = effbase.plus(1);
                if (player.storylayer.unlocked) effbase = effbase.plus(1);
                if (player.etoluna.unlocked) effbase = effbase.plus(1);
                if (player.saya.unlocked) effbase = effbase.plus(1);
                if (player.ins.unlocked) effbase = effbase.plus(1);
                let eff = Decimal.pow(effbase,player.ins.inslevel.Nzl.times(0.75))
                //pos
                eff=eff.times(layers.ins.insEffect().Usa().toLiner())
                return eff.max(1);
            },
        }
    },

    gainMult() {
        let gm = new Decimal(1);
        gm = gm.div(layers.ins.insEffect().Nor());
        if (hasAchievement('a',112)) gm = gm.div(achievementEffect('a',112));
        if (hasAchievement('lab',33)) gm = gm.div(achievementEffect('lab',33));
        if (hasMilestone('ins',7)) gm = gm.div(layers.ins.insEffect().Aus())
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
                if (player.ins.points.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(3,player.ins.points.max(0.5).ln().plus(0.75).max(1))
                if (hasUpgrade('storylayer',41)) eff=eff.times(upgradeEffect('storylayer',41));
                return eff;
            },
        },
        4: {
            requirementDescription: "5 Institution Funds",
            done() { return player.ins.total.gte(5)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "Keep Star&Moon Points and Unlock K's Autobuyer & Asia institution sites.",
        },
        5: {
            requirementDescription: "6 Institution Funds",
            done() { return player.ins.total.gte(6)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "K Resets nothing & Unlock America institution sites.",
        },
        6: {
            requirementDescription: "10 Institution Funds",
            done() { return player.ins.total.gte(10)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "Star/Moon Point gain at their max speed & Unlock Africa institution sites.",
        },
        7: {
            requirementDescription: "100 Institution Funds",
            done() { return player.ins.total.gte(100)},
            unlocked(){return player.ins.unlocked},
            effectDescription: "Research Transformers' autobuyers can buy in a bulk & Unlock Oceania institution sites.",
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
                player.ins.inslevel.Jpn = new Decimal(0);
                player.ins.inslevel.Ind = new Decimal(0);
                player.ins.inslevel.Kaz = new Decimal(0);
                player.ins.inslevel.Chn = new Decimal(0);
                player.ins.inslevel.Can = new Decimal(0);
                player.ins.inslevel.Usa = new Decimal(0);
                player.ins.inslevel.Bra = new Decimal(0);
                player.ins.inslevel.Arg = new Decimal(0);
                player.ins.inslevel.Nga = new Decimal(0);
                player.ins.inslevel.Zaf = new Decimal(0);
                player.ins.inslevel.Aus = new Decimal(0);
                player.ins.inslevel.Nzl = new Decimal(0);
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
            display() {if (player.ins.inslevel.Eng.gte(layers.ins.levelHardcap().Eng())) return "Max";else return "+"},//Eng
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Eng())&&player.ins.inslevel.Eng.lt(layers.ins.levelHardcap().Eng()) },
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
            display() {if (player.ins.inslevel.Fra.gte(layers.ins.levelHardcap().Fra())) return "Max";else return "+"},//Fra
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Fra())&&hasMilestone('ins',1)&&player.ins.inslevel.Fra.lt(layers.ins.levelHardcap().Fra()) },
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
            display() {if (player.ins.inslevel.Deu.gte(layers.ins.levelHardcap().Deu())) return "Max";else return "+"},//Deu
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Deu())&&hasMilestone('ins',1)&&player.ins.inslevel.Deu.lt(layers.ins.levelHardcap().Deu()) },
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
            display() {if (player.ins.inslevel.Che.gte(layers.ins.levelHardcap().Che())) return "Max";else return "+"},//Che
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Che())&&hasMilestone('ins',1)&&player.ins.inslevel.Che.lt(layers.ins.levelHardcap().Che()) },
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
            display() {if (player.ins.inslevel.Pol.gte(layers.ins.levelHardcap().Pol())) return "Max";else return "+"},//Pol
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Pol())&&hasMilestone('ins',2)&&player.ins.inslevel.Pol.lt(layers.ins.levelHardcap().Pol()) },
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
            display() {if (player.ins.inslevel.Nor.gte(layers.ins.levelHardcap().Nor())) return "Max";else return "+"},//Nor
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Nor())&&hasMilestone('ins',2)&&player.ins.inslevel.Nor.lt(layers.ins.levelHardcap().Nor()) },
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
            display() {if (player.ins.inslevel.Rus.gte(layers.ins.levelHardcap().Rus())) return "Max";else return "+"},//Rus
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Rus())&&hasMilestone('ins',2)&&player.ins.inslevel.Rus.lt(layers.ins.levelHardcap().Rus()) },
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
            display() {if (player.ins.inslevel.Egy.gte(layers.ins.levelHardcap().Egy())) return "Max";else return "+"},//Egy
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Egy())&&hasMilestone('ins',3)&&player.ins.inslevel.Egy.lt(layers.ins.levelHardcap().Egy()) },
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
            display() {if (player.ins.inslevel.Sau.gte(layers.ins.levelHardcap().Sau())) return "Max";else return "+"},//Sau
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Sau())&&hasMilestone('ins',3)&&player.ins.inslevel.Sau.lt(layers.ins.levelHardcap().Sau()) },
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
            display() {if (player.ins.inslevel.Isr.gte(layers.ins.levelHardcap().Isr())) return "Max";else return "+"},//Isr
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Isr())&&hasMilestone('ins',3)&&player.ins.inslevel.Isr.lt(layers.ins.levelHardcap().Isr()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Isr());
                player.ins.inslevel.Isr = player.ins.inslevel.Isr.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        121: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Jpn
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',4) },
            onClick() { 
                player[this.layer].select = 'Jpn';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',4))?((player.ins.select=='Jpn')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        122: {
            title: "",
            display: "-",//Jpn
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Jpn.gt(0)&&hasMilestone('ins',4) },
            onClick() { 
                player.ins.inslevel.Jpn = player.ins.inslevel.Jpn.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Jpn());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        123: {
            title: "",
            display() {if (player.ins.inslevel.Jpn.gte(layers.ins.levelHardcap().Jpn())) return "Max";else return "+"},//Jpn
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Jpn())&&hasMilestone('ins',4)&&player.ins.inslevel.Jpn.lt(layers.ins.levelHardcap().Jpn()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Jpn());
                player.ins.inslevel.Jpn = player.ins.inslevel.Jpn.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        131: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Ind
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',4) },
            onClick() { 
                player[this.layer].select = 'Ind';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',4))?((player.ins.select=='Ind')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        132: {
            title: "",
            display: "-",//Ind
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Ind.gt(0)&&hasMilestone('ins',4) },
            onClick() { 
                player.ins.inslevel.Ind = player.ins.inslevel.Ind.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Ind());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        133: {
            title: "",
            display() {if (player.ins.inslevel.Ind.gte(layers.ins.levelHardcap().Ind())) return "Max";else return "+"},//Ind
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Ind())&&hasMilestone('ins',4)&&player.ins.inslevel.Ind.lt(layers.ins.levelHardcap().Ind()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Ind());
                player.ins.inslevel.Ind = player.ins.inslevel.Ind.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        141: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Kaz
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',4) },
            onClick() { 
                player[this.layer].select = 'Kaz';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',4))?((player.ins.select=='Kaz')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        142: {
            title: "",
            display: "-",//Kaz
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Kaz.gt(0)&&hasMilestone('ins',4) },
            onClick() { 
                player.ins.inslevel.Kaz = player.ins.inslevel.Kaz.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Kaz());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        143: {
            title: "",
            display() {if (player.ins.inslevel.Kaz.gte(layers.ins.levelHardcap().Kaz())) return "Max";else return "+"},//Kaz
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Kaz())&&hasMilestone('ins',4)&&player.ins.inslevel.Kaz.lt(layers.ins.levelHardcap().Kaz()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Kaz());
                player.ins.inslevel.Kaz = player.ins.inslevel.Kaz.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        151: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Chn
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',4) },
            onClick() { 
                player[this.layer].select = 'Chn';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',4))?((player.ins.select=='Chn')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        152: {
            title: "",
            display: "-",//Chn
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Chn.gt(0)&&hasMilestone('ins',4) },
            onClick() { 
                player.ins.inslevel.Chn = player.ins.inslevel.Chn.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Chn());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        153: {
            title: "",
            display() {if (player.ins.inslevel.Chn.gte(layers.ins.levelHardcap().Chn())) return "Max";else return "+"},//Chn
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Chn())&&hasMilestone('ins',4)&&player.ins.inslevel.Chn.lt(layers.ins.levelHardcap().Chn()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Chn());
                player.ins.inslevel.Chn = player.ins.inslevel.Chn.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        161: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Can
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',5) },
            onClick() { 
                player[this.layer].select = 'Can';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',5))?((player.ins.select=='Can')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        162: {
            title: "",
            display: "-",//Can
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Can.gt(0)&&hasMilestone('ins',5) },
            onClick() { 
                player.ins.inslevel.Can = player.ins.inslevel.Can.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Can());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        163: {
            title: "",
            display() {if (player.ins.inslevel.Can.gte(layers.ins.levelHardcap().Can())) return "Max";else return "+"},//Can
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Can())&&hasMilestone('ins',5)&&player.ins.inslevel.Can.lt(layers.ins.levelHardcap().Can()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Can());
                player.ins.inslevel.Can = player.ins.inslevel.Can.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        171: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Usa
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',5) },
            onClick() { 
                player[this.layer].select = 'Usa';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',5))?((player.ins.select=='Usa')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        172: {
            title: "",
            display: "-",//Usa
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Usa.gt(0)&&hasMilestone('ins',5) },
            onClick() { 
                player.ins.inslevel.Usa = player.ins.inslevel.Usa.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Usa());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        173: {
            title: "",
            display() {if (player.ins.inslevel.Usa.gte(layers.ins.levelHardcap().Usa())) return "Max";else return "+"},//Usa
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Usa())&&hasMilestone('ins',5)&&player.ins.inslevel.Usa.lt(layers.ins.levelHardcap().Usa()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Usa());
                player.ins.inslevel.Usa = player.ins.inslevel.Usa.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        181: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Bra
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',5) },
            onClick() { 
                player[this.layer].select = 'Bra';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',5))?((player.ins.select=='Bra')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        182: {
            title: "",
            display: "-",//Bra
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Bra.gt(0)&&hasMilestone('ins',5) },
            onClick() { 
                player.ins.inslevel.Bra = player.ins.inslevel.Bra.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Bra());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        183: {
            title: "",
            display() {if (player.ins.inslevel.Bra.gte(layers.ins.levelHardcap().Bra())) return "Max";else return "+"},//Bra
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Bra())&&hasMilestone('ins',5)&&player.ins.inslevel.Bra.lt(layers.ins.levelHardcap().Bra()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Bra());
                player.ins.inslevel.Bra = player.ins.inslevel.Bra.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        191: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Arg
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',5) },
            onClick() { 
                player[this.layer].select = 'Arg';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',5))?((player.ins.select=='Arg')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        192: {
            title: "",
            display: "-",//Arg
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Arg.gt(0)&&hasMilestone('ins',5) },
            onClick() { 
                player.ins.inslevel.Arg = player.ins.inslevel.Arg.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Arg());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        193: {
            title: "",
            display() {if (player.ins.inslevel.Arg.gte(layers.ins.levelHardcap().Arg())) return "Max";else return "+"},//Arg
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Arg())&&hasMilestone('ins',5)&&player.ins.inslevel.Arg.lt(layers.ins.levelHardcap().Arg()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Arg());
                player.ins.inslevel.Arg = player.ins.inslevel.Arg.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        201: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//   
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',6) },
            onClick() { 
                player[this.layer].select = 'Nga';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',6))?((player.ins.select=='Nga')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        202: {
            title: "",
            display: "-",//Nga
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Nga.gt(0)&&hasMilestone('ins',6) },
            onClick() { 
                player.ins.inslevel.Nga = player.ins.inslevel.Nga.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Nga());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        203: {
            title: "",
            display() {if (player.ins.inslevel.Nga.gte(layers.ins.levelHardcap().Nga())) return "Max";else return "+"},//Nga
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Nga())&&hasMilestone('ins',6)&&player.ins.inslevel.Nga.lt(layers.ins.levelHardcap().Nga()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Nga());
                player.ins.inslevel.Nga = player.ins.inslevel.Nga.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        211: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//   
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',6) },
            onClick() { 
                player[this.layer].select = 'Zaf';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',6))?((player.ins.select=='Zaf')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        212: {
            title: "",
            display: "-",//Zaf
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Zaf.gt(0)&&hasMilestone('ins',6) },
            onClick() { 
                player.ins.inslevel.Zaf = player.ins.inslevel.Zaf.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Zaf());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        213: {
            title: "",
            display() {if (player.ins.inslevel.Zaf.gte(layers.ins.levelHardcap().Zaf())) return "Max";else return "+"},//Zaf
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Zaf())&&hasMilestone('ins',6)&&player.ins.inslevel.Zaf.lt(layers.ins.levelHardcap().Zaf()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Zaf());
                player.ins.inslevel.Zaf = player.ins.inslevel.Zaf.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        221: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Aus
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',7) },
            onClick() { 
                player[this.layer].select = 'Aus';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',7))?((player.ins.select=='Aus')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        222: {
            title: "",
            display: "-",//Aus
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Aus.gt(0)&&hasMilestone('ins',7) },
            onClick() { 
                player.ins.inslevel.Aus = player.ins.inslevel.Aus.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Aus());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        223: {
            title: "",
            display() {if (player.ins.inslevel.Aus.gte(layers.ins.levelHardcap().Aus())) return "Max";else return "+"},//Aus
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Aus())&&hasMilestone('ins',7)&&player.ins.inslevel.Aus.lt(layers.ins.levelHardcap().Aus()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Aus());
                player.ins.inslevel.Aus = player.ins.inslevel.Aus.plus(1);
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        //-----
        231: {
            title: "",
            display() {return (this.canClick())?"Select":"Locked"},//Nzl
            unlocked() { return player.ins.unlocked },
            canClick() { return hasMilestone('ins',7) },
            onClick() { 
                player[this.layer].select = 'Nzl';
            },
            style: {"height": "50px", "width": "50px","min-height":"50px","background-color"(){return (hasMilestone('ins',7))?((player.ins.select=='Nzl')?"rgb(119,191,95)":"#666666"):"rgb(191,143,143)"}},
        },
        232: {
            title: "",
            display: "-",//Nzl
            unlocked() { return player.ins.unlocked },
            canClick() { return player.ins.inslevel.Nzl.gt(0)&&hasMilestone('ins',7) },
            onClick() { 
                player.ins.inslevel.Nzl = player.ins.inslevel.Nzl.sub(1);
                player[this.layer].points = player[this.layer].points.plus(layers.ins.insCost().Nzl());
            },
            style: {"height": "50px", "width": "50px","min-height":"50px",},
        },
        233: {
            title: "",
            display() {if (player.ins.inslevel.Nzl.gte(layers.ins.levelHardcap().Nzl())) return "Max";else return "+"},//Nzl
            unlocked() { return player.ins.unlocked },
            canClick() { return player[this.layer].points.gte(layers.ins.insCost().Nzl())&&hasMilestone('ins',7)&&player.ins.inslevel.Nzl.lt(layers.ins.levelHardcap().Nzl()) },
            onClick() { 
                player[this.layer].points = player[this.layer].points.sub(layers.ins.insCost().Nzl());
                player.ins.inslevel.Nzl = player.ins.inslevel.Nzl.plus(1);
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
                    case 'Che':{return "Push Memory softcap starts later by <h3 style='color: rgb(255,26,26);'>x"+format(layers.ins.insEffect().Che())+"</h3>, based on site nerfs activated."}
                    case 'Pol':{return "Boost neighbor sites(Norway, Russia, German) by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"}
                    case 'Nor':{return "Boost Institusion Fund gain by <h3 style='color: rgb(239,43,45);'>x"+format(layers.ins.insEffect().Nor())+"</h3>, based on your unused Institution Funds."}
                    case 'Rus':{return "Boost Light Tachyon & Dark Matter gain by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Pos())+"</h3>, based on total levels of all sites."}
                    case 'Egy':{return "Boost Luminous Church&Flourish Labyrinth direct gain by <h3 style='color: #fcf788;'>x"+format(layers.ins.insEffect().Egy().Pos())+"</h3>"}
                    case 'Sau':{return "Boost Fragment generation by <h3 style='color: rgb(1,108,54);'>x"+format(layers.ins.insEffect().Sau().Pos())+"</h3>, based on all your layer currencies."}
                    case 'Isr':{return "Push Memory softcap starts later by <h3 style='color: rgb(16,62,140);'>x"+format(layers.ins.insEffect().Isr().Pos())+"</h3>, based on Milestones you have."}
                    case 'Jpn':{return "Boost Memory gain by <h3 style='color: #fdb8e0;'>x"+format(layers.ins.insEffect().Jpn())+"</h3>, decreases over Institution reset time & respec time."}
                    case 'Ind':{return "Boost Fragment generation by <h3 style='color: rgb(240,139,47);'>x"+format(layers.ins.insEffect().Ind())+"</h3>, based on site buffs between sites activated."}
                    case 'Kaz':{return "Boost Fragment generation by <h3 style='color: rgb(0,176,199);'>x"+format(layers.ins.insEffect().Kaz())+"</h3>, flows over Institution reset time & respec time."}
                    case 'Chn':{return "Boost Fragment generation & Memory gain by <h3 style='color: rgb(238,28,37);'>x"+format(layers.ins.insEffect().Chn().Pos())+"</h3>"}
                    case 'Can':{return "Boost Fragment generation by <h3 style='color: rgb(254,0,0);'>x"+format(layers.ins.insEffect().Can())+"</h3>, increases over Institution reset time & respec time."}
                    case 'Usa':{return "Boost all mult boost of sites by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3><br>And all exponent boost of sites by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toExponent())+"</h3>"}
                    case 'Bra':{return "Boost Fragment generation by <h3 style='color: rgb(0,150,65);'>x"+format(layers.ins.insEffect().Bra())+"</h3>, increases over total played time."}
                    case 'Arg':{return "Star Point & Moon Point's <h3 style='color: rgb(116,172,223);'>^"+format(layers.ins.insEffect().Arg())+"</h3> contributes in another Point's effect calculation."}
                    case 'Nga':{return "Push Research Point softcap starts later by <h3 style='color: rgb(0,134,81);'>x"+format(layers.ins.insEffect().Nga())+"</h3>, based on Upgrades you have."}
                    case 'Zaf':{return "Push World Step Height softcap starts later by <h3 style='color: rgb(255,182,18);'>x"+format(layers.ins.insEffect().Zaf())+"</h3>, based on Challenges you completed."}
                    case 'Aus':{return "Institution Funds gain by <h3 style='color: #fb5bf1;'>x"+format(layers.ins.insEffect().Aus())+"</h3>, based on total Institution Funds gained."}
                    case 'Nzl':{return "Push Memory softcap starts later by <h3 style='color: #6bfb60;'>x"+format(layers.ins.insEffect().Nzl())+"</h3>, based on layers unlocked."}
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
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Deu':{
                        let des = ("Effect nerfed by France site by <h3 style='color: #ededed;'>x"+format(layers.ins.insEffect().Fra().Neg())+"</h3>")
                        if (hasMilestone('ins',2)) des += "<br>Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Che':{
                        let des = "This site hasn't receive any effects yet."
                        if (hasMilestone('ins',5))des=("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>");
                        return des;
                    }
                    case 'Pol':{
                        let des = "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toExponent())+"</h3>")
                        return des;
                    }
                    case 'Nor':{
                        let des = "Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"
                        des += "<br>Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Rus':{
                        let des = "Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^"+format(layers.ins.insEffect().Pol())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Egy':{
                        let des = "Effect nerfed by Isreal site by <h3 style='color: rgb(16,62,140);'>x"+format(layers.ins.insEffect().Isr().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Sau':{
                        let des = "Effect nerfed by Isreal site by <h3 style='color: rgb(16,62,140);'>x"+format(layers.ins.insEffect().Isr().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Isr':{
                        let des = "Effect nerfed by Egypt site by <h3 style='color: #fcf788;'>x"+format(layers.ins.insEffect().Egy().Neg())+"</h3>"
                        des += "<br>Nerfed by Saudi Arabia site by <h3 style='color: rgb(1,108,54);'>x"+format(layers.ins.insEffect().Sau().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Jpn':{
                        let des ="Effect nerfed by China site by <h3 style='color: rgb(238,28,37);'>^"+format(layers.ins.insEffect().Chn().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Ind':{
                        let des ="Effect nerfed by China site by <h3 style='color: rgb(238,28,37);'>^"+format(layers.ins.insEffect().Chn().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Kaz':{
                        let des = "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Neg())+"</h3>"
                        des +="<br>Nerfed by China site by <h3 style='color: rgb(238,28,37);'>^"+format(layers.ins.insEffect().Chn().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Chn':{
                        let des="Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().Neg())+"</h3>"
                        if (hasMilestone('ins',5))des+=("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Can':{
                        let des=("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Usa':{
                        let des = "Effect nerfed by China site by <h3 style='color: rgb(238,28,37);'>x"+format(layers.ins.insEffect().Chn().fixedNeg())+"</h3>"
                        des += "<br>Nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x"+format(layers.ins.insEffect().Rus().fixedNeg())+"</h3>"
                        return des;
                    }
                    case 'Bra':{
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Arg':{
                        let des=("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toExponent())+"</h3>")
                        return des;
                    }
                    case 'Nga':{
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Zaf':{
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Aus':{
                        let des = ("Effect (exceeds 1x) Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    case 'Nzl':{
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x"+format(layers.ins.insEffect().Usa().toLiner())+"</h3>")
                        return des;
                    }
                    default:return "Error/Not coded yet."
                }
            },
            unlocked(){return player.ins.unlocked},
        },
    },
    grid: {
        rows: 22, // == insColors.length == insName.length
        cols: 5, // Select 
        getStartData(id) {
            return null //都是clickable性质的东西，并且直接用id来调用常量数组，本身不需要再存数据
        },
        getUnlocked(id) {
            if (Math.floor(id / 100) <= 1) return true;
            else if (Math.floor(id / 100) <= 4) {
                if (hasMilestone('ins', 1)) return true; else return false;
            }
            else if (Math.floor(id / 100) <= 7){
                if (hasMilestone('ins', 2)) return true; else return false;
            }
            else if (Math.floor(id / 100) <= 10){
                if (hasMilestone('ins', 3)) return true; else return false;
            }
            else if (Math.floor(id / 100) <= 14){
                if (hasMilestone('ins', 4)) return true; else return false;
            }
            else if (Math.floor(id / 100) <= 18){
                if (hasMilestone('ins', 5)) return true; else return false;
            }
            else if (Math.floor(id / 100) <= 20){
                if (hasMilestone('ins', 6)) return true; else return false;
            }
            else if (Math.floor(id / 100) <= 22){
                if (hasMilestone('ins', 7)) return true; else return false;
            }
            else return false;
        },
        getCanClick(data, id) {
            switch (id % 100) {
                case 1: return true
                case 2: { if (player.ins.inslevel[insName[Math.floor(id / 100) - 1]].lte(0)) return false; else return true; }
                case 3: return false
                case 4: {
                    eval('tempcost = layers.ins.insCost().' + insName[Math.floor(id / 100) - 1] + '()')
                     if (this.getDisplay(data, id) == "Max" || player[this.layer].points.lt(tempcost)) return false; else return true; 
                    }
                case 5: return false
                default: return false
            }
        },
        onClick(data, id) {
            if (id % 100 == 1) {
                player.ins.select = insName[Math.floor(id / 100) - 1]
            }
            if (id % 100 == 2) {
                player.ins.inslevel[insName[Math.floor(id / 100) - 1]] = player.ins.inslevel[insName[Math.floor(id / 100) - 1]].sub(1);
                eval('tempcost = layers.ins.insCost().' + insName[Math.floor(id / 100) - 1] + '()')
                player[this.layer].points = player[this.layer].points.plus(tempcost);
            }

            if (id % 100 == 4) {
                eval('tempcost = layers.ins.insCost().' + insName[Math.floor(id / 100) - 1] + '()')
                player[this.layer].points = player[this.layer].points.sub(tempcost);
                player.ins.inslevel[insName[Math.floor(id / 100) - 1]] = player.ins.inslevel[insName[Math.floor(id / 100) - 1]].plus(1);
            }

        },
        getDisplay(data, id) {
            switch (id % 100) {
                case 1: return "Select"
                case 2: {if (player.ins.inslevel[insName[Math.floor(id / 100) - 1]].lte(0))return "Min";else return "-"}
                case 3: {
                    let disp = "<h3>Level</h3>: " + formatWhole(player.ins.inslevel[insName[Math.floor(id / 100) - 1]]);
                    eval('tempcost = layers.ins.insCost().' + insName[Math.floor(id / 100) - 1] + '()');
                    disp += "<br>Level up cost: " + formatWhole(tempcost) + " Institution Funds"
                    return disp;
                }
                case 4: {
                    eval('temphc= layers.ins.levelHardcap().' + insName[Math.floor(id / 100) - 1] + '()');
                    if (player.ins.inslevel[insName[Math.floor(id / 100) - 1]].gte(temphc)) return "Max"; else return "+";
                }
                case 5: {
                    switch (Math.floor(id / 100)) {
                        case 1: {
                            disp = "<h2>England</h2>";
                            disp += "<br><h3>Passive</h3><a style = 'color: #ffffff'>: lab-boosting</a>"
                            disp += "<br>Current Effect: Boost Research gain by " + format(layers.ins.insEffect().Eng()) + "x";
                            return disp;
                        }
                        case 2: {
                            disp = "<h2>France</h2>";
                            disp += "<br><h3>Romanic</h3><a style = 'color: #ffffff'>: Light-boosting</a>"
                            disp += "<br>Current Effect: Boost light-side gain by " + format(layers.ins.insEffect().Fra().Pos()) + "x";
                            return disp;
                        }
                        case 3: {
                            disp = "<a style = 'color: #666666'><h2>Germany</h2></a>";
                            disp += "<br><a style = 'color: #666666'><h3>Rigorous</h3></a><a style = 'color: #ffffff'>: Dark-boosting</a>"
                            disp += "<br><a style = 'color: #666666'>Current Effect: Boost dark-side gain by " + format(layers.ins.insEffect().Deu().Pos()) + "x</a>";
                            return disp;
                        }
                        case 4: {
                            disp = "<h2>Switzerland</h2>";
                            disp += "<br><h3>Coordinate</h3><a style = 'color: #ffffff'>: Nerf-compensating</a>"
                            disp += "<br>Current Effect: Memory softcap starts later by " + format(layers.ins.insEffect().Che()) + "x";
                            return disp;
                        }
                        case 5: {
                            disp = "<h2>Poland</h2>";
                            disp += "<br><h3>Traffic</h3>: Neighbor-boosting"
                            disp += "<br>Current Effect: Boost neighbor sites by ^" + format(layers.ins.insEffect().Pol());
                            return disp;
                        }
                        case 6: {
                            disp = "<h2>Norway</h2>";
                            disp += "<br><h3>Chilly</h3><a style = 'color: #ffffff'>: Price decreasing</a>"
                            disp += "<br>Current Effect: Boost Institusion Fund gain by " + format(layers.ins.insEffect().Nor()) + "x";
                            return disp;
                        }
                        case 7: {
                            disp = "<a style = 'color: #1048b5'><h2>Russia</h2></a>";
                            disp += "<br><a style = 'color: #1048b5'><h3>Authority</h3></a><a style = 'color: #ffffff'>: row2-boosting</a>"
                            disp += "<br><a style = 'color: #1048b5'>Current Effect: Boost L&D gain by " + format(layers.ins.insEffect().Rus().Pos()) + "x</a>";
                            return disp;
                        }
                        case 8: {
                            disp = "<h2>Egypt</h2>";
                            disp += "<br><h3>Historical</h3><a style = 'color: #ffffff'>: Architecture-boosting</a>"
                            disp += "<br>Current Effect: Boost LC&FL gain by " + format(layers.ins.insEffect().Egy().Pos()) + "x";
                            return disp;
                        }
                        case 9: {
                            disp = "<h2>Saudi Arabia</h2>";
                            disp += "<br><h3>Resources</h3><a style = 'color: #ffffff'>: boost-by-currencies</a>"
                            disp += "<br>Current Effect: Boost Fragment generation by " + format(layers.ins.insEffect().Sau().Pos()) + "x";
                            return disp;
                        }
                        case 10: {
                            disp = "<a style = 'color: #204e9c'><h2>Isreal</h2></a>";
                            disp += "<br><a style = 'color: #204e9c'><h3>Religious</h3></a><a style = 'color: #ffffff'>: boost-by-milestones</a>"
                            disp += "<br><a style = 'color: #204e9c'>Current Effect: Push Memory softcap starts later by " + format(layers.ins.insEffect().Isr().Pos()) + "x</a>";
                            return disp;
                        }
                        case 11: {
                            disp = "<h2>Japan</h2>";
                            disp += "<br><h3>Active</h3><a style = 'color: #ffffff'>: short-time boost</a>"
                            disp += "<br>Current Effect: Boost Memory gain by " + format(layers.ins.insEffect().Jpn()) + "x";
                            return disp;
                        }
                        case 12: {
                            disp = "<h2>India</h2>";
                            disp += "<br><h3>Out-Source</h3><a style = 'color: #ffffff'>: boost by boosts</a>"
                            disp += "<br>Current Effect: Boost Fragment generation by " + format(layers.ins.insEffect().Ind()) + "x";
                            return disp;
                        }
                        case 13: {
                            disp = "<h2>Kazakhstan</h2>";
                            disp += "<br><h3>Inner</h3><a style = 'color: #ffffff'>: Sine-boosting</a>"
                            disp += "<br>Current Effect: Boost Fragment generation by " + format(layers.ins.insEffect().Kaz()) + "x";
                            return disp;
                        }
                        case 14: {
                            disp = "<h2>China</h2>";
                            disp += "<br><h3>Central</h3><a style = 'color: #ffffff'>: massive-boosting</a>"
                            disp += "<br>Current Effect: Boost Fragment generation & Memory gain by " + format(layers.ins.insEffect().Chn().Pos()) + "x";
                            return disp;
                        }
                        case 15: {
                            disp = "<h2>Canada</h2>";
                            disp += "<br><h3>Idle</h3><a style = 'color: #ffffff'>: long-time boost</a>"
                            disp += "<br>Current Effect: Boost Fragment generation by " + format(layers.ins.insEffect().Can()) + "x";
                            return disp;
                        }
                        case 16: {
                            disp = "<a style = 'color: #4c4b7e'><h2>USA</h2></a>";
                            disp += "<br><a style = 'color: #4c4b7e'><h3>Global</h3></a><a style = 'color: #ffffff'>: worldwide boosts</a>"
                            disp += "<br><a style = 'color: #4c4b7e'>Current Effect: Boost all boost of sites by " + format(layers.ins.insEffect().Usa().toLiner()) + "x (Multi)/ "+ format(layers.ins.insEffect().Usa().toExponent()) +"x (Exponential)</a>";
                            return disp;
                        }
                        case 17: {
                            disp = "<h2>Brazil</h2>";
                            disp += "<br><h3>Environmental</h3><a style = 'color: #ffffff'>: time-based boosts</a>"
                            disp += "<br>Current Effect: Boost Fragment generation by " + format(layers.ins.insEffect().Bra()) + "x";
                            return disp;
                        }
                        case 18: {
                            disp = "<h2>Argentina</h2>";
                            disp += "<br><h3>Astronomical</h3><a style = 'color: #ffffff'>: Gemini boosts</a>"
                            disp += "<br>Current Effect: Star Point & Moon Point's ^" + format(layers.ins.insEffect().Arg()) + " contribute each other";
                            return disp;
                        }
                        case 19: {
                            disp = "<h2>Nigeria</h2>";
                            disp += "<br><h3>Development</h3><a style = 'color: #ffffff'>: boost-by-upgrades</a>"
                            disp += "<br>Current Effect: Push Research Point softcap by " + format(layers.ins.insEffect().Nga()) + "x";
                            return disp;
                        }
                        case 20: {
                            disp = "<h2>South Africa</h2>";
                            disp += "<br><h3>Potential</h3><a style = 'color: #ffffff'>: boost-by-challenges</a>"
                            disp += "<br>Current Effect: Push World Step Height sc by " + format(layers.ins.insEffect().Zaf()) + "x";
                            return disp;
                        }
                        case 21: {
                            disp = "<h2>Australia</h2>";
                            disp += "<br><h3>Backup</h3><a style = 'color: #ffffff'>: boost fund gain</a>"
                            disp += "<br>Current Effect: Boost Institution Funds gain by " + format(layers.ins.insEffect().Aus()) + "x";
                            return disp;
                        }
                        case 22: {
                            disp = "<h2>New Zealand</h2>";
                            disp += "<br><h3>Variety</h3><a style = 'color: #ffffff'>: boost-by-layers</a>"
                            disp += "<br>Current Effect: Push Memory softcap starts later by " + format(layers.ins.insEffect().Nzl()) + "x";
                            return disp;
                        }
                    }
                }
                default: return "Error"
            }
        },
        getStyle(data, id) {
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: "#45b5d3",
                borderColor: "#45b5d3",
                backgroundColor: "#45b5d340",
                borderWidth: '2px'
            };
            if (id % 100 == 3 || id % 100 == 5) {
                jss.width = '200px';
            };
            if (id % 100 == 1) {
                jss.width = '50px';
                jss.height = '50px';
                jss.borderRadius = 2;
                if (player.ins.select == insName[Math.floor(id / 100) - 1]) tempColor = "#77bf5f"
                else tempColor = "#666666"
                jss.color = tempColor;
                jss.borderColor = tempColor;
                jss.backgroundColor = `${tempColor}40`
            }
            if (id % 100 == 2 || id % 100 == 4) {
                if (!this.getCanClick(data, id)) {
                    tempColor = "#666666";
                    jss.color = tempColor;
                    jss.borderColor = tempColor;
                    jss.backgroundColor = `${tempColor}40`
                }

            }
            if (id % 100 == 5) {
                jss.color = insColors[Math.floor(id / 100) - 1];
                jss.borderColor = insColors[Math.floor(id / 100) - 1];
                jss.backgroundColor = `${insColors[Math.floor(id / 100) - 1]}40`
            }
            return jss;
        }
    }
})