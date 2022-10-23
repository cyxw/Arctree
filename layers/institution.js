const insColors = ["#00bdf9", "#ededed", "#383838", "#ff1a1a", "#ff8080", "#ef2b2d", "#0038a5", "#fcf788", "#016c36", "#103e8c", "#fdb8e0", "#f08b2f", "#00b0c7", "#ee1c25", "#fe0000", "#3c3b6e", "#009641", "#74acdf", "#008651", "#ffb612", "#fb5bf1", "#6bfb60"]
const insName = ["Eng", "Fra", "Deu", "Che", "Pol", "Nor", "Rus", "Egy", "Sau", "Isr", "Jpn", "Ind", "Kaz", "Chn", "Can", "Usa", "Bra", "Arg", "Nga", "Zaf", "Aus", "Nzl"]

addLayer("ins", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            //best: new Decimal(0),
            total: new Decimal(0),
            inslevel: {
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
            select: null,
            upgTotalCost: new Decimal(0),
        }
    },

    color: "#45b5d3",
    symbol: "I",
    name: "Institution",
    resource: "Institution Funds",
    row: 5,
    displayRow: 5,
    position:3, 
    branches: ["lab"],

    baseResource: "Research Power",
    baseAmount() { return player.lab.power },

    requires: new Decimal(1e35),

    type: "custom",
    exponent: 0.25,
    base: 2,

    getResetGain() {
        let getmax = player.lab.power.div(layers.ins.gainMult()).log(this.requires).pow(1 / this.exponent);
        //if (hasMilestone('ins',7)) getmax = getmax.times(layers.ins.insEffect().Aus())
        return getmax.sub(player.ins.total).floor().max(0);
    },

    getNextAt(canMax = true) {
        return Decimal.pow(this.requires, (Decimal.pow(player.lab.power.div(layers.ins.gainMult()).log(this.requires).pow(1 / this.exponent).floor().max(0).max(player.ins.total).plus(1), this.exponent))).times(layers.ins.gainMult())
    },
    canReset() {
        return player.lab.power.gte(Decimal.pow(this.requires, (Decimal.pow(player[this.layer].total.plus(1), this.exponent))).times(layers.ins.gainMult()))
    },
    prestigeButtonText() {
        let des = "";
        if (canReset('ins')) des += "Reset for +" + formatWhole(this.getResetGain()) + " Institution Funds<br>"
        des += "Next At: " + format(player.lab.power) + "/" + format(getNextAt(this.layer)) + " Research Power";
        return des;
    },
    prestigeNotify() {
        if (!canReset('ins')) return false;
        else return true;
    },
    resetsNothing() { return hasMilestone('fracture',1) },

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
        "Institutions": {
            unlocked() { return (hasMilestone('ins', 0)) },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text", "All Institution sites are in effect once they have any level, however you need to select them to check their detailed effect in Effect tab."],
                "blank",
                ["clickable", 11],
                "blank",
                "grid",
            ],
        },
        "Effects": {
            unlocked() { return (hasMilestone('ins', 0)) },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text", function () {
                    switch (player.ins.select) {
                        case null: return "You haven't choose an institution yet!"
                        case 'Eng': return "You are choosing England Institution site."
                        case 'Fra': return "You are choosing France Institution site."
                        case 'Deu': return "You are choosing Germany Institution site."
                        case 'Che': return "You are choosing Switzerland Institution site."
                        case 'Pol': return "You are choosing Poland Institution site."
                        case 'Nor': return "You are choosing Norway Institution site."
                        case 'Rus': return "You are choosing Russia Institution site."
                        case 'Egy': return "You are choosing Egypt Institution site."
                        case 'Sau': return "You are choosing Saudi Arabia Institution site."
                        case 'Isr': return "You are choosing Isreal Institution site."
                        case 'Jpn': return "You are choosing Japan Institution site."
                        case 'Kaz': return "You are choosing Kazakhstan Institution site."
                        case 'Chn': return "You are choosing China Institution site."
                        case 'Can': return "You are choosing Canada Institution site."
                        case 'Usa': return "You are choosing USA Institution site."
                        case 'Bra': return "You are choosing Brazil Institution site."
                        case 'Arg': return "You are choosing Argentina Institution site."
                        case 'Nga': return "You are choosing Nigeria Institution site."
                        case 'Zaf': return "You are choosing South Africa Institution site."
                        case 'Aus': return "You are choosing Australia Institution site."
                        case 'Nzl': return "You are choosing New Zealand Institution site."
                        default: return "Error/Not coded yet."
                    }
                }, {}],
                "blank",
                ["infobox", "give"],
                ["infobox", "receive"],
            ]
        },
        "Upgrades":{
            unlocked() { return (hasUpgrade('storylayer', 52)) },
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text","When Respecing Upgrades, Site levels exceeding its max won't be respeced to its max."],
                ["clickable",12],
                "blank",
                ["upgrade",11],
                ["blank",["20px","20px"]],
                ["row",[
                    ["upgrade",21],
                    ["blank",["10px","20px"]],
                    ["upgrade",22],
                ]],
                ["blank",["20px","20px"]],
                ["row",[
                    ["upgrade",31],
                    ["upgrade",32],
                    ["blank",["10px","20px"]],
                    ["upgrade",33],
                    ["upgrade",34],
                ]],
                ["blank",["20px","20px"]],
                ["row",[
                    ["upgrade",41],
                    ["upgrade",42],
                    ["blank",["5px","10px"]],
                    ["upgrade",43],
                    ["blank",["10px","20px"]],
                    ["upgrade",44],
                    ["upgrade",45],
                    ["blank",["5px","10px"]],
                    ["upgrade",46],
                ]],
            ]
        }
    },

    hotkeys: [
        { key: "i", description: "I: Reset for Institution Funds", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],

    doReset(resettinglayer) {
        //Currently nothing
    },

    insCost() {//costing Funds
        return {
            Eng() { return player.ins.inslevel.Eng.plus(1); },
            Fra() { return player.ins.inslevel.Fra.plus(1) },
            Deu() { return player.ins.inslevel.Deu.plus(1) },
            Che() { return player.ins.inslevel.Che.plus(1) },
            Pol() { return player.ins.inslevel.Pol.plus(1) },
            Nor() { return player.ins.inslevel.Nor.plus(1) },
            Rus() { return player.ins.inslevel.Rus.plus(1) },
            Egy() { return player.ins.inslevel.Egy.plus(1) },
            Sau() { return player.ins.inslevel.Sau.plus(1) },
            Isr() { return player.ins.inslevel.Isr.plus(1) },
            Jpn() { return player.ins.inslevel.Jpn.plus(1) },
            Ind() { return player.ins.inslevel.Ind.plus(1) },
            Kaz() { return player.ins.inslevel.Kaz.plus(1) },
            Chn() { return player.ins.inslevel.Chn.plus(1) },
            Can() { return player.ins.inslevel.Can.plus(1) },
            Usa() { return player.ins.inslevel.Usa.plus(1) },
            Bra() { return player.ins.inslevel.Bra.plus(1) },
            Arg() { return player.ins.inslevel.Arg.plus(1) },
            Nga() { return player.ins.inslevel.Nga.plus(1) },
            Zaf() { return player.ins.inslevel.Zaf.plus(1) },
            Aus() { return player.ins.inslevel.Aus.plus(1) },
            Nzl() { return player.ins.inslevel.Nzl.plus(1) },
        }
    },

    levelHardcap() {//level hardcap
        return {
            Eng() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Fra() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Deu() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Che() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Pol() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Nor() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Rus() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',31)) lhcp = lhcp.plus(1);
                if (hasUpgrade('ins',33)) lhcp = lhcp.plus(2);
                return lhcp;
            },
            Egy() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Sau() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Isr() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Jpn() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Ind() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',31)) lhcp = lhcp.plus(1);
                return lhcp;
            },
            Kaz() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',31)) lhcp = lhcp.plus(1);
                return lhcp;
            },
            Chn() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                if (hasUpgrade('ins',31)) lhcp = lhcp.plus(1);
                return lhcp;
            },
            Can() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Usa() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Bra() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Arg() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Nga() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Zaf() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Aus() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
            Nzl() {
                let lhcp = new Decimal(10);
                if (inChallenge('kou', 71) || hasChallenge('kou', 71)) lhcp = new Decimal(12);
                return lhcp;
            },
        }
    },

    insEffect() {//Institution effects
        return {
            Eng() {
                if (player.ins.inslevel.Eng.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(4, player.ins.inslevel.Eng);
                if (hasUpgrade('ins',11)) eff = Decimal.pow(6, player.ins.inslevel.Eng);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                return eff;
            },
            Fra() {
                return {
                    Pos() {
                        if (player.ins.inslevel.Fra.lte(0)) return new Decimal(1);
                        let eff = Decimal.pow(200, player.ins.inslevel.Fra.max(1).log(1.5).plus(1));
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toLiner()).times(3)
                        else eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                        eff = eff.times(layers.ins.insEffect().Chn().Pos41());
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Deu().Neg())

                        //pow
                        if(hasUpgrade('ins',44)) eff = eff.pow(layers.ins.insEffect().Pol())
                        return eff.max(1);
                    },
                    Neg() {
                        if (player.ins.inslevel.Fra.lte(0)) return new Decimal(1);
                        let debuff = player.ins.inslevel.Fra.plus(2).ln().log(5);
                        if (hasUpgrade('ins',22))debuff = debuff.div(2);
                        let eff = new Decimal(1).sub(debuff);
                        return eff.max(0).min(1);
                    }
                }
            },
            Deu() {
                return {
                    Pos() {
                        if (player.ins.inslevel.Deu.lte(0)) return new Decimal(1);
                        let eff = Decimal.pow(100, player.ins.inslevel.Deu.max(1).log(1.5).plus(1));
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toLiner()).times(3)
                        else eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                        eff = eff.times(layers.ins.insEffect().Chn().Pos41());
                        eff = eff.pow(layers.ins.insEffect().Pol())

                        //nerf
                        eff = eff.times(layers.ins.insEffect().Fra().Neg())

                        return eff.max(1);
                    },
                    Neg() {
                        if (player.ins.inslevel.Deu.lte(0)) return new Decimal(1);
                        let debuff = player.ins.inslevel.Deu.plus(2).ln().log(5)
                        if (hasUpgrade('ins',22))debuff = debuff.div(2);
                        let eff = new Decimal(1).sub(debuff);
                        return eff.max(0).min(1);
                    }
                }
            },
            Che() {
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
                if (layers.ins.insEffect().Chn().Pos41().gt(1)) exponent = exponent.plus(1);
                if (layers.ins.insEffect().Sau().Pos42()>1) exponent = exponent.plus(1);
                let eff = Decimal.pow(2, exponent).times(player.ins.inslevel.Che);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toLiner()).times(3)
                else eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                eff = eff.times(layers.ins.insEffect().Chn().Pos41());
                
                //nerf
                if (eff.gte(500)) eff = eff.sub(500).pow(0.75).plus(500);

                //pow
                if(hasUpgrade('ins',44)) eff = eff.pow(layers.ins.insEffect().Pol())
                return eff.max(1);
            },
            Pol() {
                if (player.ins.inslevel.Pol.lte(0)) return new Decimal(1);
                let eff = new Decimal(1).plus(player.ins.inslevel.Pol.times(0.05));
                if (eff.gt(1.50)) eff = eff.sub(1.50).times(100).plus(1).ln().div(100).plus(1.50);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toPolExponentAfter45())
                else eff = eff.times(layers.ins.insEffect().Usa().toExponent());
                //nerf
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.max(1);
            },
            Nor() {
                if (player.ins.inslevel.Nor.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(2.5, player.ins.inslevel.Nor).times(player.ins.points).max(1);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toLiner()).times(3)
                else eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                eff = eff.times(layers.ins.insEffect().Chn().Pos41());
                eff = eff.pow(layers.ins.insEffect().Pol())
                //nerf
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.max(1);
            },
            Rus() {
                return {
                    Pos() {
                        if (player.ins.inslevel.Rus.lte(0)) return new Decimal(1);
                        let effbase = player.ins.inslevel.Eng.plus(player.ins.inslevel.Fra).plus(player.ins.inslevel.Deu).plus(player.ins.inslevel.Che).plus(player.ins.inslevel.Pol).plus(player.ins.inslevel.Nor).plus(player.ins.inslevel.Rus)
                        effbase = effbase.plus(player.ins.inslevel.Egy).plus(player.ins.inslevel.Sau).plus(player.ins.inslevel.Isr)
                        effbase = effbase.plus(player.ins.inslevel.Jpn).plus(player.ins.inslevel.Ind).plus(player.ins.inslevel.Kaz).plus(player.ins.inslevel.Chn)
                        effbase = effbase.plus(player.ins.inslevel.Can).plus(player.ins.inslevel.Usa).plus(player.ins.inslevel.Bra).plus(player.ins.inslevel.Arg)
                        effbase = effbase.plus(player.ins.inslevel.Nga).plus(player.ins.inslevel.Zaf)
                        let eff = Decimal.pow(player.ins.inslevel.Rus.plus(1), effbase).div(10);
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toLiner()).times(3)
                        else eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                        eff = eff.times(layers.ins.insEffect().Chn().Pos41());
                        eff = eff.pow(layers.ins.insEffect().Pol())
                        //nerf

                        return eff.max(1);
                    },
                    Neg() {
                        let neg = player.ins.inslevel.Rus.plus(1).pow(1 / 6).ln();
                        return new Decimal(1).sub(neg).max(0);
                    },
                    fixedNeg() {
                        if (player.ins.inslevel.Rus.lte(0)) return new Decimal(1);
                        let neg = new Decimal(0.75);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Egy() {
                return {
                    Pos() {
                        if (player.ins.inslevel.Egy.lte(0)) return new Decimal(1);
                        let eff = player.ins.inslevel.Egy.times(0.15).plus(1);
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Isr().Neg())

                        return eff.max(1);
                    },
                    Neg() {
                        if (player.ins.inslevel.Egy.lte(0)) return new Decimal(1);
                        let neg = new Decimal(0.25);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Sau() {//每加一个层都要回来看一遍
                return {
                    Pos() {
                        let effbase = new Decimal(0);
                        if (player.ins.inslevel.Sau.lte(0)) return new Decimal(1);
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
                        effbase = effbase.plus(player.awaken.points.max(1).log(10));
                        effbase = effbase.plus(player.fracture.points.max(1).log(10));
                        effbase = effbase.plus(player.tempest.points.max(1).log(10));

                        if (hasUpgrade('ins',21)){
                            effbase = effbase.plus(player.lab.power.max(1).log(10));
                            effbase = effbase.plus(player.rei.roses.max(1).log(10));
                            effbase = effbase.plus(player.etoluna.starPoint.max(1).log(10));
                            effbase = effbase.plus(player.etoluna.moonPoint.max(1).log(10));
                            effbase = effbase.plus(player.fracture.ElementEssence.max(1).log(10));
                            effbase = effbase.plus(player.tempest.milestonePoints.point.max(1).log(10));
                        };

                        let eff = new Decimal(effbase.times(player.ins.inslevel.Sau).div(50));
                        if (hasUpgrade('ins',42)) eff = new Decimal(effbase.times(Decimal.pow(effbase,0.05)).times(player.ins.inslevel.Sau));
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        if (hasUpgrade('ins',42)) eff = eff.times(new Decimal(5).times(player.ins.inslevel.Nga).max(1))
                        eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Isr().Neg())

                        return eff.max(1);
                    },
                    Neg() {
                        if (player.ins.inslevel.Sau.lte(0)) return new Decimal(1);
                        let neg = new Decimal(0.25);
                        return new Decimal(1).sub(neg);
                    },
                    Pos42(){
                        if (!hasUpgrade('ins',42)) return 1;
                        return new Decimal(5).times(player.ins.inslevel.Sau).max(1);
                    }
                }
            },
            Isr() {//每加一个层都要回来看一遍
                return {
                    Pos() {
                        if (player.ins.inslevel.Isr.lte(0)) return new Decimal(1);
                        let effbase = new Decimal(0);
                        effbase = effbase.plus(player.mem.milestones.length);
                        if (!layers['light'].deactivated()) effbase = effbase.plus(player.light.milestones.length);
                        if (!layers['dark'].deactivated()) effbase = effbase.plus(player.dark.milestones.length);
                        if (!layers['kou'].deactivated()) effbase = effbase.plus(player.kou.milestones.length);
                        if (!layers['lethe'].deactivated()) effbase = effbase.plus(player.lethe.milestones.length);
                        effbase = effbase.plus(player.lab.milestones.length);
                        if (!layers['rei'].deactivated()) effbase = effbase.plus(player.rei.milestones.length);
                        if (!layers['yugamu'].deactivated()) effbase = effbase.plus(player.yugamu.milestones.length);
                        effbase = effbase.plus(player.world.milestones.length);
                        effbase = effbase.plus(player.storylayer.milestones.length);
                        if (!layers['etoluna'].deactivated()) effbase = effbase.plus(player.etoluna.milestones.length);
                        if (!layers['saya'].deactivated()) effbase = effbase.plus(player.saya.milestones.length);
                        effbase = effbase.plus(player.ins.milestones.length);
                        effbase = effbase.plus(player.awaken.milestones.length);
                        if (!layers['fracture'].deactivated()) effbase = effbase.plus(player.fracture.milestones.length);
                        if (!layers['tempest'].deactivated()) effbase = effbase.plus(player.tempest.milestones.length);

                        let eff = effbase.pow(player.ins.inslevel.Isr.times(0.8));
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Egy().Neg())
                        eff = eff.times(layers.ins.insEffect().Sau().Neg())

                        return eff.max(1);
                    },
                    Neg() {
                        if (player.ins.inslevel.Isr.lte(0)) return new Decimal(1);
                        let neg = new Decimal(0.5);
                        return new Decimal(1).sub(neg);
                    },
                }
            },
            Jpn() {
                let eff = new Decimal(1e4).div(new Decimal(10).pow(Decimal.log(player.ins.resetTime + 1, 15).times(Decimal.pow(player.ins.resetTime + 1, 0.1))))
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                eff = eff.pow(layers.ins.insEffect().Chn().Neg())
                return eff.times(player.ins.inslevel.Jpn).max(1);
            },
            Ind() {
                if (player.ins.inslevel.Ind.lte(0)) return new Decimal(1);
                let exponent = new Decimal(0);
                if (player.ins.inslevel.Pol.gt(0) && player.ins.inslevel.Nor.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Pol.gt(0) && player.ins.inslevel.Deu.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Pol.gt(0) && player.ins.inslevel.Rus.gte(0)) exponent = exponent.plus(1.5);
                //USA系
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Fra.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Deu.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Che.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Pol.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Nor.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Rus.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Egy.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Sau.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Isr.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Jpn.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Ind.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Kaz.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Chn.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Can.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Bra.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Arg.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Nga.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Zaf.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Aus.gte(0)) exponent = exponent.plus(1.5);
                if (player.ins.inslevel.Usa.gt(0) && player.ins.inslevel.Nzl.gte(0)) exponent = exponent.plus(1.5);
                //USA系结束
                //Iu41
                if (hasUpgrade('ins',41)){
                    if (player.ins.inslevel.Chn.gt(0)){
                        if (player.ins.inslevel.Fra.gte(0)) exponent = exponent.plus(1.5);
                        if (player.ins.inslevel.Deu.gte(0)) exponent = exponent.plus(1.5);
                        if (player.ins.inslevel.Che.gte(0)) exponent = exponent.plus(1.5);
                        if (player.ins.inslevel.Nor.gte(0)) exponent = exponent.plus(1.5);
                        if (player.ins.inslevel.Rus.gte(0)) exponent = exponent.plus(1.5);
                    }
                }
                //Iu42
                if (hasUpgrade('ins',42))
                    if (player.ins.inslevel.Sau.gte(0)&&player.ins.inslevel.Nga.gte(0)) exponent = exponent.plus(1.5);
                //Iu44
                if (hasUpgrade('ins',44))
                    {
                        if (player.ins.inslevel.Pol.gt(0) && player.ins.inslevel.Fra.gte(0)) exponent = exponent.plus(1.5);
                        if (player.ins.inslevel.Pol.gt(0) && player.ins.inslevel.Che.gte(0)) exponent = exponent.plus(1.5);
                    }
                let eff = Decimal.pow(1.25, exponent).times(player.ins.inslevel.Ind);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                eff = eff.pow(layers.ins.insEffect().Chn().Neg())
                return eff.max(1);
            },
            Kaz() {
                let amp = new Decimal(250);
                let eff = amp.times(Math.sin(player.ins.resetTime) + 2);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                //nerf
                if (!hasUpgrade('ins',41)) eff = eff.pow(layers.ins.insEffect().Chn().Neg())
                eff = eff.times(layers.ins.insEffect().Rus().Neg());
                return eff.times(player.ins.inslevel.Kaz).max(1);

            },
            Chn() {
                return {
                    Pos() {
                        if (player.ins.inslevel.Chn.lte(0)) return new Decimal(1);
                        let eff = Decimal.pow(1e5, (player.ins.inslevel.Chn.times(0.5).plus(0.5)))
                        eff = eff.div(eff.log(5));
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                        //neg
                        eff = eff.times(layers.ins.insEffect().Rus().Neg());
                        return eff.max(1);
                    },
                    Neg() {
                        let neg = player.ins.inslevel.Chn.times(0.05);
                        return new Decimal(1).sub(neg).max(0.1);
                    },
                    fixedNeg() {
                        if (player.ins.inslevel.Chn.lte(0)) return new Decimal(1);
                        let neg = new Decimal(0.75);
                        return new Decimal(1).sub(neg);
                    },
                    Pos41(){
                        if (!hasUpgrade('ins',41)) return new Decimal(1);
                        let pos41=new Decimal(2).pow(player.ins.inslevel.Chn);
                        return pos41;
                    },
                }
            },
            Can() {
                if (player.ins.inslevel.Can.lte(0)) return new Decimal(1);
                let eff = new Decimal(3).pow(Decimal.log(player.ins.resetTime + 1, 5).times(Decimal.pow(player.ins.resetTime + 1, 0.1)));
                eff = eff.div(eff.plus(1).log(10))
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                if (hasUpgrade('ins',45)) eff = eff.times(layers.ins.insEffect().Usa().toLiner()).times(3)
                else eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                //nerf
                return eff.times(player.ins.inslevel.Can.div(2).plus(0.5)).max(1);
            },
            Usa() {
                return {
                    toLiner() {
                        if (player.ins.inslevel.Usa.lte(0)) return new Decimal(1);
                        let effbase = player.ins.inslevel.Usa.div(5).plus(1);
                        let eff = effbase.times(player.ins.inslevel.Usa.times(0.8))
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Chn().fixedNeg());
                        eff = eff.times(layers.ins.insEffect().Rus().fixedNeg());

                        return eff.max(1);
                    },
                    toExponent() {
                        if (player.ins.inslevel.Usa.lte(0)) return new Decimal(1);
                        let eff = player.ins.inslevel.Usa.div(100).plus(1);
                        if (eff.gt(1.25)) eff = eff.sub(1.25).times(100).sqrt().div(100).plus(1.25);
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Chn().fixedNeg());
                        eff = eff.times(layers.ins.insEffect().Rus().Neg());

                        return eff.max(1);
                    },
                    toPolExponentAfter45(){
                        if (player.ins.inslevel.Usa.lte(0)) return new Decimal(1);
                        let eff = player.ins.inslevel.Usa.div(100).plus(1);
                        if (eff.gt(1.25)) eff = eff.sub(1.25).times(100).sqrt().div(100).plus(1.25);
                        if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                        //pos
                        eff = eff.plus(0.01);
                        //nerf
                        eff = eff.times(layers.ins.insEffect().Chn().fixedNeg());
                        eff = eff.times(layers.ins.insEffect().Rus().Neg());

                        return eff.max(1);
                    }
                }
            },
            Bra() {
                if (player.ins.inslevel.Bra.lte(0)) return new Decimal(1);
                let eff = new Decimal(player.timePlayed).div(3600 * 5).floor().times(2).pow(player.ins.inslevel.Bra)
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                return softcap(eff,new Decimal(5e20),0.75).max(1);
            },
            Arg() {
                if (player.ins.inslevel.Arg.lte(0)) return new Decimal(0);
                let eff = player.ins.inslevel.Arg.times(0.02);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toExponent())
                return eff.min(1);
            },
            Nga() {
                if (player.ins.inslevel.Nga.lte(0)) return new Decimal(1);
                let effbase = new Decimal(0);
                effbase = effbase.plus(player.mem.upgrades.length);
                if (!layers['light'].deactivated()) effbase = effbase.plus(player.light.upgrades.length);
                if (!layers['dark'].deactivated()) effbase = effbase.plus(player.dark.upgrades.length);
                if (!layers['kou'].deactivated()) effbase = effbase.plus(player.kou.upgrades.length);
                if (!layers['lethe'].deactivated()) effbase = effbase.plus(player.lethe.upgrades.length);
                effbase = effbase.plus(player.lab.upgrades.length);
                if (!layers['rei'].deactivated()) effbase = effbase.plus(player.rei.upgrades.length);
                if (!layers['yugamu'].deactivated()) effbase = effbase.plus(player.yugamu.upgrades.length);
                effbase = effbase.plus(player.world.upgrades.length);
                effbase = effbase.plus(player.storylayer.upgrades.length);
                if (!layers['etoluna'].deactivated()) effbase = effbase.plus(player.etoluna.upgrades.length);
                if (!layers['saya'].deactivated()) effbase = effbase.plus(player.saya.upgrades.length);
                effbase = effbase.plus(player.ins.upgrades.length);
                effbase = effbase.plus(player.awaken.upgrades.length);

                let eff = effbase.pow(player.ins.inslevel.Nga.times(0.8));
                if (hasUpgrade('ins',42)) eff = effbase.pow(player.ins.inslevel.Nga);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner());
                if (hasUpgrade('ins',42)) eff = eff.times(layers.ins.insEffect().Sau().Pos42());
                return eff.max(1);
            },
            Zaf() {
                if (player.ins.inslevel.Zaf.lte(0)) return new Decimal(1);
                let effbase = new Decimal(0);
                effbase = new Decimal(challengeCompletions('kou', 11) + challengeCompletions('kou', 12) + challengeCompletions('kou', 21) + challengeCompletions('kou', 22) + challengeCompletions('kou', 31) + challengeCompletions('kou', 32) + challengeCompletions('kou', 41) + challengeCompletions('kou', 42) + challengeCompletions('kou', 51))
                effbase = effbase.plus(challengeCompletions('saya', 11) + challengeCompletions('saya', 12) + challengeCompletions('saya', 21) + challengeCompletions('saya', 22) + challengeCompletions('saya', 31) + challengeCompletions('saya', 32) + challengeCompletions('saya', 41) + challengeCompletions('saya', 42))
                effbase = effbase.plus(challengeCompletions('tempest', 11));

                let eff = effbase.pow(player.ins.inslevel.Zaf.times(0.5));
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                return eff.max(1);
            },
            Aus() {
                if (player.ins.inslevel.Aus.lte(0)) return new Decimal(1);
                let eff = player.ins.total.times(0.02).times(player.ins.inslevel.Aus.times(0.2).plus(1)).plus(1);
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.sub(1).times(layers.ins.insEffect().Usa().toLiner()).plus(1);
                return eff.max(1);
            },
            Nzl() {
                if (player.ins.inslevel.Nzl.lte(0)) return new Decimal(1);
                let effbase = new Decimal(0);
                if (player.mem.unlocked) effbase = effbase.plus(1);
                if (player.light.unlocked && !layers['light'].deactivated()) effbase = effbase.plus(1);
                if (player.dark.unlocked && !layers['dark'].deactivated()) effbase = effbase.plus(1);
                if (player.kou.unlocked && !layers['kou'].deactivated()) effbase = effbase.plus(1);
                if (player.lethe.unlocked && !layers['lethe'].deactivated()) effbase = effbase.plus(1);
                if (player.lab.unlocked) effbase = effbase.plus(1);
                if (player.rei.unlocked && !layers['rei'].deactivated()) effbase = effbase.plus(1);
                if (player.yugamu.unlocked && !layers['yugamu'].deactivated()) effbase = effbase.plus(1);
                if (player.world.unlocked) effbase = effbase.plus(1);
                if (player.storylayer.unlocked) effbase = effbase.plus(1);
                if (player.etoluna.unlocked && !layers['etoluna'].deactivated()) effbase = effbase.plus(1);
                if (player.saya.unlocked && !layers['saya'].deactivated()) effbase = effbase.plus(1);
                if (player.ins.unlocked) effbase = effbase.plus(1);
                if (player.awaken.unlocked) effbase = effbase.plus(1);
                if (player.fracture.unlocked && !layers['fracture'].deactivated()) effbase = effbase.plus(1);
                if (player.tempest.unlocked && !layers['tempest'].deactivated()) effbase = effbase.plus(1);
                let eff = Decimal.pow(effbase, player.ins.inslevel.Nzl.times(0.75))
                if (inChallenge('kou', 71)) eff = eff.log10().max(1);
                //pos
                eff = eff.times(layers.ins.insEffect().Usa().toLiner())
                return eff.max(1);
            },
        }
    },

    gainMult() {
        let gm = new Decimal(1);
        gm = gm.div(layers.ins.insEffect().Nor());
        if (hasAchievement('a', 112)) gm = gm.div(achievementEffect('a', 112));
        if (hasAchievement('lab', 33)) gm = gm.div(achievementEffect('lab', 33));
        if (hasMilestone('ins', 7)) gm = gm.div(layers.ins.insEffect().Aus())
        if (hasUpgrade('ins',34)) gm = gm.div(upgradeEffect('ins',34));
        if (player['tempest'].grid[302].activated) gm = gm.div(gridEffect('tempest',303))
        if (hasUpgrade('ins',46)) gm = gm.div(upgradeEffect('ins',46));
        return gm;
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('storylayer', 35) },

    upgrades: {
        11: {
            title: "Nature Paper",
            fullDisplay(){
                let disp = "<b>Nature Paper</b><br>England Site formula become better"
                disp += "<br>Cost: 65,000 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(65000)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(65000);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(65000)
            },
        },
        21: {
            title: "Petroleum Exploitation",
            fullDisplay(){
                let disp = "<b>Petroleum Exploitation</b>"
                disp += "<br>All Secondary Currency now count into Saudi Arabia Site Effect formula"
                disp += "<br>Cost: 6,400 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(6400)&&hasUpgrade('ins',11)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(6400);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(6400)
            },
            branches:[11],
        },
        22: {
            title: "Fra-Deu Core",
            fullDisplay(){
                let disp = "<b>Fra-Deu Core</b>"
                disp += "<br>Reduce nerf between France Site & Germany Site"
                disp += "<br>Cost: 8,000 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(8000)&&hasUpgrade('ins',11)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(8000);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(8000)
            },
            branches:[11],
        },
        31: {
            title: "SCO",
            fullDisplay(){
                let disp = "<b>SCO</b>"
                disp += "<br>Chn, Rus, Kaz, Ind Site max level +1"
                disp += "<br>Cost: 4,500 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(4500)&&hasUpgrade('ins',21)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(4500);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(4500)
            },
            branches:[21],
        },
        32: {
            title: "Database",
            fullDisplay(){
                let disp = "<b>Database</b>"
                disp += "<br>4th Institution Milestone now based on total Institution Funds you gained."
                disp += "<br>Cost: 8,500 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(8500)&&hasUpgrade('ins',21)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(8500);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(8500)
            },
            branches:[21],
        },
        33: {
            title: "Euratom",
            fullDisplay(){
                let disp = "<b>Euratom</b>"
                disp += "<br>Europe Sites' max level +2"
                disp += "<br>Cost: 8,500 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(8500)&&hasUpgrade('ins',22)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(8500);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(8500)
            },
            branches:[22],
        },
        34: {
            title: "Progress Stack",
            fullDisplay(){
                let disp = "<b>Progress Stack</b>"
                disp += "<br>Institution Funds you Cost in Upgrades boost Institution Fund gain"
                if (hasUpgrade(this.layer,this.id)) disp += "<br>Currently: " + format(upgradeEffect(this.layer,this.id)) +"x"
                disp += "<br>Cost: 4,500 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(4500)&&hasUpgrade('ins',22)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(4500);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(4500)
            },
            effect(){
                if (!hasUpgrade(this.layer,this.id)) return new Decimal(1);
                let eff = player[this.layer].upgTotalCost.sqrt().times(1.25);
                return eff.max(1);
            },
            branches:[22],
        },

        //sxy part
        41: {
            title: "The Silk Road",
            fullDisplay(){
                let disp = "<b>The Silk Road</b>"
                disp += "<br>Chn no longer nerf Kaz, and slightly boosts Europe sites<br>(Except Eng & Pol)"
                disp += "<br>Cost: 37,500 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(37500)&&hasUpgrade('ins',31)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(37500);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(37500)
            },
            effect(){
                return 1;
            },
            branches:[31],
        },
        42: {
            title: "OPEC",
            fullDisplay(){
                let disp = "<b>OPEC</b>"
                disp += "<br>Sau & Nga sites formulas become better, and they boost each other"
                disp += "<br>Cost: 35,000 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(35000)&&hasUpgrade('ins',31)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(35000);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(35000)
            },
            branches:[31],
        },
        43: {
            title: "Data Type Conversion",
            fullDisplay(){
                let disp = "<b>Data Type Conversion</b>"
                disp += "<br>Unused Institution Funds will add Element Essence Capacity"
                if (hasUpgrade(this.layer,this.id)) disp += "<br>Currently: +" + format(upgradeEffect(this.layer,this.id))
                disp += "<br>Cost: 30,000 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(30000)&&hasUpgrade('ins',32)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(30000);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(30000)
            },
            effect(){
                return player.ins.points.div(200);
            },
            branches:[32],
        },
        44: {
            title: "European Crossroads",
            fullDisplay(){
                let disp = "<b>European Crossroads</b>"
                disp += "<br>Poland site now affects Fra & Che sites"
                disp += "<br>Cost: 40,000 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(40000)&&hasUpgrade('ins',33)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(40000);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(40000)
            },
            branches:[33],
        },
        45: {
            title: "NATO",
            fullDisplay(){
                let disp = "<b>NATO</b>"
                disp += "<br>USA site now Boosts Europe sites & North America sites x3<br>(Poland site boost +0.01 instead)"
                disp += "<br>Cost: 35,000 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(35000)&&hasUpgrade('ins',33)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(35000);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(35000)
            },
            branches:[33],
        },
        46: {
            title: "Energy Modernization",
            fullDisplay(){
                let disp = "<b>Energy Modernization</b>"
                disp += "<br>Awaken Cores themselves now boosts Institution Funds gain"
                if (hasUpgrade(this.layer,this.id)) disp += "<br>Currently: " + format(upgradeEffect(this.layer,this.id)) +"x"
                disp += "<br>Cost: 32,500 Institution Funds"
                return disp;
            },
            canAfford(){return player[this.layer].points.gte(32500)&&hasUpgrade('ins',34)},
            unlocked(){return hasUpgrade('storylayer',52)},
            onPurchase(){
                player[this.layer].points = player[this.layer].points.sub(32500);
                player[this.layer].upgTotalCost = player[this.layer].upgTotalCost.plus(32500)
            },
            effect(){
                return new Decimal(5).pow(player.awaken.points).max(1);
            },
            branches:[34],
        },

    },
    milestones: {
        0: {
            requirementDescription: "1 Institution Fund",
            done() { return player.ins.total.gte(1) },
            unlocked() { return player.ins.unlocked },
            effectDescription: "Keep G&K Milestones and Unlock England institution site.",
        },
        1: {
            requirementDescription: "2 Institution Funds",
            done() { return player.ins.total.gte(2) },
            unlocked() { return player.ins.unlocked },
            effectDescription: "Keep G's upgrades & K's Memory adjustments and Unlock Western Europe institution sites.",
        },
        2: {
            requirementDescription: "3 Institution Funds",
            done() { return player.ins.total.gte(3) },
            unlocked() { return player.ins.unlocked },
            effectDescription: "Gain 10% of G's gain every second & You can buy max K and Unlock Eastern Europe institution sites.",
        },
        3: {
            requirementDescription: "4 Institution Funds",
            done() { return player.ins.total.gte(4) },
            unlocked() { return player.ins.unlocked },
            effectDescription() {
                let des = "Unused Institution Funds boosts Frag and Unlock Mid-East institution sites."
                if (hasMilestone('ins', 3)) des += ("<br>Currently: " + format(tmp['ins'].milestones[3].effect) + "x")
                return des;
            },
            effect() {//tmp
                if (player.ins.points.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(3, player.ins.points.max(0.5).ln().plus(0.75).max(1));
                if (hasUpgrade('ins',32)) eff = Decimal.pow(3, player.ins.total.max(0.5).ln().plus(0.75).max(1));
                if (hasUpgrade('storylayer', 41)) eff = eff.times(upgradeEffect('storylayer', 41));
                return eff;
            },
        },
        4: {
            requirementDescription: "5 Institution Funds",
            done() { return player.ins.total.gte(5) },
            unlocked() { return player.ins.unlocked },
            effectDescription: "Keep Star&Moon Points and Unlock K's Autobuyer & Asia institution sites.",
        },
        5: {
            requirementDescription: "6 Institution Funds",
            done() { return player.ins.total.gte(6) },
            unlocked() { return player.ins.unlocked },
            effectDescription: "K Resets nothing & Unlock America institution sites.",
        },
        6: {
            requirementDescription: "10 Institution Funds",
            done() { return player.ins.total.gte(10) },
            unlocked() { return player.ins.unlocked },
            effectDescription: "Star/Moon Point gain at their max speed & Unlock Africa institution sites.",
        },
        7: {
            requirementDescription: "100 Institution Funds",
            done() { return player.ins.total.gte(100) },
            unlocked() { return player.ins.unlocked },
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
                player[this.layer].resetTime = 0;
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
                player.ins.points = player.ins.total.sub(player[this.layer].upgTotalCost);
            },
            style: { "height": "50px", "width": "100px", "min-height": "50px", },
        },
        12:{
            title: "",
            display: "Respec Upgrade",
            unlocked() { return hasUpgrade('storylayer',52) },
            canClick() { return true },
            onClick(){
                if (!confirm('Are you sure to respec all Institution Upgrades?')) return;
                player[this.layer].points = player[this.layer].points.plus(player[this.layer].upgTotalCost);
                player[this.layer].upgrades = [];
                player[this.layer].upgTotalCost = new Decimal(0);
            },
            style: { "height": "50px", "width": "100px", "min-height": "50px", },
        }
    },
    infoboxes: {
        give: {
            title: "Giving effects",
            body() {//用case就不用海量if了
                switch (player.ins.select) {
                    case null: return "You haven't choose an institution yet!"
                    case 'Eng': { return "Boosts Research Point gain, Research Power gain, and pushes Research Point softcap starts later by <h3 style='color: #00bdf9;'>x" + format(layers.ins.insEffect().Eng()) + "</h3>" }
                    case 'Fra': { return "Boosts Light Tachyon gain, Red Doll gain, Luminous Church gain and Glowing Rose gain by <h3 style='color: #ededed;'>x" + format(layers.ins.insEffect().Fra().Pos()) + "</h3>" }
                    case 'Deu': { return "Boosts Dark Matters gain, Forgotten Drops gain, Flourish Labyrinths gain and Maze Effects by <h3 style='color: #383838;'>x" + format(layers.ins.insEffect().Deu().Pos()) + "</h3>" }
                    case 'Che': { return "Push Memory softcap starts later by <h3 style='color: rgb(255,26,26);'>x" + format(layers.ins.insEffect().Che()) + "</h3>, based on site nerfs activated." }
                    case 'Pol': { return "Boost neighbor sites(Norway, Russia, German) by <h3 style='color: rgb(255,128,128);'>^" + format(layers.ins.insEffect().Pol()) + "</h3>" }
                    case 'Nor': { return "Boost Institusion Fund gain by <h3 style='color: rgb(239,43,45);'>x" + format(layers.ins.insEffect().Nor()) + "</h3>, based on your unused Institution Funds." }
                    case 'Rus': { return "Boost Light Tachyon & Dark Matter gain by <h3 style='color: rgb(0,56,165);'>x" + format(layers.ins.insEffect().Rus().Pos()) + "</h3>, based on total levels of all sites." }
                    case 'Egy': { return "Boost Luminous Church&Flourish Labyrinth direct gain by <h3 style='color: #fcf788;'>x" + format(layers.ins.insEffect().Egy().Pos()) + "</h3>" }
                    case 'Sau': { return "Boost Fragment generation by <h3 style='color: rgb(1,108,54);'>x" + format(layers.ins.insEffect().Sau().Pos()) + "</h3>, based on all your layer currencies." }
                    case 'Isr': { return "Push Memory softcap starts later by <h3 style='color: rgb(16,62,140);'>x" + format(layers.ins.insEffect().Isr().Pos()) + "</h3>, based on Milestones you have." }
                    case 'Jpn': { return "Boost Memory gain by <h3 style='color: #fdb8e0;'>x" + format(layers.ins.insEffect().Jpn()) + "</h3>, decreases over Institution reset time & respec time." }
                    case 'Ind': { return "Boost Fragment generation by <h3 style='color: rgb(240,139,47);'>x" + format(layers.ins.insEffect().Ind()) + "</h3>, based on site buffs between sites activated." }
                    case 'Kaz': { return "Boost Fragment generation by <h3 style='color: rgb(0,176,199);'>x" + format(layers.ins.insEffect().Kaz()) + "</h3>, flows over Institution reset time & respec time." }
                    case 'Chn': { return "Boost Fragment generation & Memory gain by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().Pos()) + "</h3>" }
                    case 'Can': { return "Boost Fragment generation by <h3 style='color: rgb(254,0,0);'>x" + format(layers.ins.insEffect().Can()) + "</h3>, increases over Institution reset time & respec time." }
                    case 'Usa': { return "Boost all mult boost of sites by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3><br>And all exponent boost of sites by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toExponent()) + "</h3>" }
                    case 'Bra': { return "Boost Fragment generation by <h3 style='color: rgb(0,150,65);'>x" + format(layers.ins.insEffect().Bra()) + "</h3>, increases over total played time." }
                    case 'Arg': { return "Star Point & Moon Point's <h3 style='color: rgb(116,172,223);'>^" + format(layers.ins.insEffect().Arg()) + "</h3> contributes in another Point's effect calculation." }
                    case 'Nga': { return "Push Research Point softcap starts later by <h3 style='color: rgb(0,134,81);'>x" + format(layers.ins.insEffect().Nga()) + "</h3>, based on Upgrades you have." }
                    case 'Zaf': { return "Push World Step Height softcap starts later by <h3 style='color: rgb(255,182,18);'>x" + format(layers.ins.insEffect().Zaf()) + "</h3>, based on Challenges you completed." }
                    case 'Aus': { return "Boost Institution Funds gain by <h3 style='color: #fb5bf1;'>x" + format(layers.ins.insEffect().Aus()) + "</h3>, based on total Institution Funds gained." }
                    case 'Nzl': { return "Push Memory softcap starts later by <h3 style='color: #6bfb60;'>x" + format(layers.ins.insEffect().Nzl()) + "</h3>, based on layers unlocked." }
                    default: return "Error/Not coded yet."
                }
            },
            unlocked() { return player.ins.unlocked },
        },
        receive: {
            title: "Receiving effects",
            body() {
                switch (player.ins.select) {
                    case null: return "You haven't choose an institution yet!"
                    case 'Eng': return "This site won't receive any effect from other sites."
                    case 'Fra': {
                        let des = ("Effect nerfed by Germany site by <h3 style='color: #383838;'>x" + format(layers.ins.insEffect().Deu().Neg()) + "</h3>")
                        if (hasMilestone('ins', 5)) {
                            if (hasUpgrade('ins',45)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner().times(3)) + "</h3>")
                            else des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        }
                        if (hasUpgrade('ins',41)) des += (des = "<br>Boosted by China site by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().Pos41()) + "</h3>")

                        if (hasUpgrade('ins', 44)) des += "<br>Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^" + format(layers.ins.insEffect().Pol()) + "</h3>"
                        return des;
                    }
                    case 'Deu': {
                        let des = ("Effect nerfed by France site by <h3 style='color: #ededed;'>x" + format(layers.ins.insEffect().Fra().Neg()) + "</h3>")
                        if (hasMilestone('ins', 5)) {
                            if (hasUpgrade('ins',45)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner().times(3)) + "</h3>")
                            else des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        }
                        if (hasUpgrade('ins',41)) des += (des = "<br>Boosted by China site by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().Pos41()) + "</h3>")
                        if (hasMilestone('ins', 2)) des += "<br>Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^" + format(layers.ins.insEffect().Pol()) + "</h3>"
                        return des;
                    }
                    case 'Che': {
                        let des = "This site hasn't receive any effects yet."
                        if (hasMilestone('ins', 5)) {
                            if (hasUpgrade('ins',45)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner().times(3)) + "</h3>")
                            else des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        }
                        if (hasUpgrade('ins',41)) des += (des = "<br>Boosted by China site by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().Pos41()) + "</h3>")
                        
                        if (hasUpgrade('ins', 44)) des += "<br>Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^" + format(layers.ins.insEffect().Pol()) + "</h3>"
                        return des;
                    }
                    case 'Pol': {
                        let des = "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x" + format(layers.ins.insEffect().Rus().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) {
                            if (hasUpgrade('ins',45)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toPolExponentAfter45()) + "</h3>")
                            else des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toExponent()) + "</h3>")
                        }
                        return des;
                    }
                    case 'Nor': {
                        let des = ""//我调个序
                        des += "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x" + format(layers.ins.insEffect().Rus().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) {
                            if (hasUpgrade('ins',45)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner().times(3)) + "</h3>")
                            else des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        }
                        if (hasUpgrade('ins',41)) des += (des = "<br>Boosted by China site by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().Pos41()) + "</h3>")
                        des += "<br>Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^" + format(layers.ins.insEffect().Pol()) + "</h3>"
                        return des;
                    }
                    case 'Rus': {
                        let des = "Boosted by Poland site by <h3 style='color: rgb(255,128,128);'>^" + format(layers.ins.insEffect().Pol()) + "</h3>"
                        if (hasMilestone('ins', 5)) {
                            if (hasUpgrade('ins',45)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner().times(3)) + "</h3>")
                            else des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        }
                        if (hasUpgrade('ins',41)) des += (des = "<br>Boosted by China site by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().Pos41()) + "</h3>")
                        return des;
                    }
                    case 'Egy': {
                        let des = "Effect nerfed by Isreal site by <h3 style='color: rgb(16,62,140);'>x" + format(layers.ins.insEffect().Isr().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Sau': {
                        let des = "Effect nerfed by Isreal site by <h3 style='color: rgb(16,62,140);'>x" + format(layers.ins.insEffect().Isr().Neg()) + "</h3>"
                        if (hasUpgrade('ins', 42)) des += ("<br>Boosted by Nigeria site by <h3 style='color: #008651;'>x" + format(/*定位符*/new Decimal(5).times(player.ins.inslevel.Nga).max(1)) + "</h3>")
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Isr': {
                        let des = "Effect nerfed by Egypt site by <h3 style='color: #fcf788;'>x" + format(layers.ins.insEffect().Egy().Neg()) + "</h3>"
                        des += "<br>Nerfed by Saudi Arabia site by <h3 style='color: rgb(1,108,54);'>x" + format(layers.ins.insEffect().Sau().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Jpn': {
                        let des = "Effect nerfed by China site by <h3 style='color: rgb(238,28,37);'>^" + format(layers.ins.insEffect().Chn().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Ind': {
                        let des = "Effect nerfed by China site by <h3 style='color: rgb(238,28,37);'>^" + format(layers.ins.insEffect().Chn().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Kaz': {
                        let des = "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x" + format(layers.ins.insEffect().Rus().Neg()) + "</h3>"
                        if (!hasUpgrade('ins',41)) des += "<br>Nerfed by China site by <h3 style='color: rgb(238,28,37);'>^" + format(layers.ins.insEffect().Chn().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Chn': {
                        let des = "Effect nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x" + format(layers.ins.insEffect().Rus().Neg()) + "</h3>"
                        if (hasMilestone('ins', 5)) des += ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Can': {
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        if (hasUpgrade('ins',45)) des = ("<br>Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner().times(3)) + "</h3>")
                        return des;
                    }
                    case 'Usa': {
                        let des = "Effect nerfed by China site by <h3 style='color: rgb(238,28,37);'>x" + format(layers.ins.insEffect().Chn().fixedNeg()) + "</h3>"
                        des += "<br>Nerfed by Russia site by <h3 style='color: rgb(0,56,165);'>x" + format(layers.ins.insEffect().Rus().fixedNeg()) + "</h3>"
                        return des;
                    }
                    case 'Bra': {
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Arg': {
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toExponent()) + "</h3>")
                        return des;
                    }
                    case 'Nga': {
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        if (hasUpgrade('ins', 42)) des += ("<br>Boosted by Saudi Arabia site by <h3 style='color: #016c36;'>x" + format(layers.ins.insEffect().Sau().Pos42()) + "</h3>")
                        return des;
                    }
                    case 'Zaf': {
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Aus': {
                        let des = ("Effect (exceeds 1x) Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    case 'Nzl': {
                        let des = ("Effect Boosted by USA site by <h3 style='color: rgb(60,59,110);'>x" + format(layers.ins.insEffect().Usa().toLiner()) + "</h3>")
                        return des;
                    }
                    default: return "Error/Not coded yet."
                }
            },
            unlocked() { return player.ins.unlocked },
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
                            disp += "<br><h3>Traffic</h3><a style = 'color: #ffffff'>: Neighbor-boosting</a>"
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