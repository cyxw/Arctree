addLayer("mem", {
    name: "Memory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            autohold: false,
            autoholdtimer: new Decimal(0),
        }
    },
    color: "#c939db",
    requires: new Decimal(15), // Can be a function that takes requirement increases into account
    resource: "Memories", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.45, // Prestige currency exponent
    softcap() {
        let sc = new Decimal("1e10");
        if (inChallenge('kou', 12)) return sc;
        //if (hasChallenge('kou',12)) sc = sc.times(100).times(tmp.kou.effect.max(1));
        if (hasChallenge('kou', 12)) sc = sc.times(challengeEffect('kou', 12));
        if (hasUpgrade('dark', 21)) sc = sc.times(upgradeEffect('dark', 21));
        if (hasUpgrade('dark', 32)) sc = sc.times(upgradeEffect('dark', 32));
        if (hasUpgrade('mem', 34) && hasAchievement('a', 23)) sc = sc.times(upgradeEffect('mem', 34));
        if (hasMilestone('dark', 2)) sc = sc.times(tmp.dark.effect);
        if (hasAchievement('a', 25)) sc = sc.times(player.points.plus(1).log10().plus(1));
        if (hasUpgrade('lethe', 22)) sc = sc.times(player.light.points.div(20).max(1));
        if (hasAchievement('a', 44)) sc = sc.times(Math.sqrt(player.mem.resetTime + 1));
        if (challengeCompletions('saya', 22) && !layers['saya'].deactivated()) sc = sc.times(challengeEffect('saya', 22));
        if (hasMilestone('ins', 1)) sc = sc.times(layers.ins.insEffect().Che())
        if (hasMilestone('ins', 3)) sc = sc.times(layers.ins.insEffect().Isr().Pos())
        if (hasMilestone('ins', 7)) sc = sc.times(layers.ins.insEffect().Nzl())
        if(player.tempest.grid[103].activated) sc = sc.times(gridEffect('tempest',103));
        if(player.fracture.unlocked) sc = sc.times(Decimal.pow(1e100,layers['fracture'].grid.return_Equiped_Equipment_Num(10)));

        return sc;
    },
    softcapPower() {
        let scp = 0.25;
        if (hasUpgrade('light', 21)) scp = 0.33;
        if (hasUpgrade('light', 32)) scp = 0.40;
        if (hasMilestone('light', 2)) scp = scp + 0.02;
        if (hasUpgrade('lethe', 33)) scp = scp + 0.08;
        return scp;
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('mem', 12)) mult = mult.times(upgradeEffect('mem', 12))
        if (hasUpgrade('mem', 24)) mult = mult.times(upgradeEffect('mem', 24))
        if (hasUpgrade('mem', 33)) mult = mult.pow(upgradeEffect('mem', 33))
        if (hasUpgrade('mem', 34) && !hasAchievement('a', 22)) mult = mult.times(!hasUpgrade('light', 11) ? 0.85 : upgradeEffect('light', 11))
        if (player.dark.unlocked) mult = mult.times(tmp.dark.effect);
        if (hasUpgrade('light', 12)) mult = mult.times(upgradeEffect('light', 12)/*tmp["light"].effect.div(2).max(1)*/);
        //if (hasUpgrade('lethe', 44)&&player.mem.points.lte( upgradeEffect('lethe',44) )) mult = mult.times(player.dark.points.div(20).max(1));
        if (hasUpgrade('lethe', 44)) mult = mult.times(upgradeEffect('lethe', 44));
        if (hasUpgrade('lethe', 32) || hasUpgrade('lethe', 43)) mult = mult.times(tmp.lethe.effect);
        if (hasUpgrade('lethe', 23)) mult = mult.times(upgradeEffect('lethe', 23));
        if (hasUpgrade('lethe', 34)) mult = mult.times(upgradeEffect('lethe', 34));
        if (hasMilestone('lab', 2)) mult = mult.times(player.lab.power.div(10).max(1));
        if (hasUpgrade('storylayer', 12)) mult = mult.times(upgradeEffect('storylayer', 12));
        if (hasMilestone('ins', 4)) mult = mult.times(layers.ins.insEffect().Jpn());
        if (hasMilestone('ins', 4)) mult = mult.times(layers.ins.insEffect().Chn().Pos())
        if (hasAchievement('a', 113)) mult = mult.times(buyableEffect('lab', 13).eff2())
        if (player.lethe.buyables[21].unlocked) mult = mult.times(buyableEffect('lethe', 21));


        if (inChallenge("kou", 11)) mult = mult.pow(0.75);
        if (inChallenge('rei', 11)) mult = mult.pow(0.5);
        if (player.world.restrictChallenge && !hasUpgrade('storylayer', 14)) mult = mult.pow(0.9);
        if (player.saya.CurrentPairChallenge != null) mult = mult.pow(tmp.saya.grid.ChallengeDebuff.mem);
        if (player.tempest.activeChallenge!=null) mult = mult.pow(tmp.tempest.nerf_in_challenges.toMem());  

        if (inChallenge('saya', 22) || tmp['saya'].grid.ChallengeDepth[4]>-1) mult = mult.tetrate(layers.saya.challenges[22].debuff())

        return mult
    },
    directMult() {
        let eff = new Decimal(1);
        if (hasAchievement('a', 15)) eff = eff.times(1.5);
        if (player.lethe.unlocked) eff = eff.times(tmp.lethe.effect);
        if (inChallenge('kou', 12) || hasUpgrade('lab', 91)) eff = eff.times(10);
        return eff;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('mem', 13)) exp = exp.times(upgradeEffect('mem', 13));
        if (hasUpgrade('lab', 74)) exp = exp.plus(buyableEffect('lab', 13).eff1());
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 3,
    hotkeys: [
        { key: "m", description: "M: Reset for Memories", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true },
    passiveGeneration() {
        let pg = 0;
        if (hasMilestone('light', 3)) pg = pg + 0.05;
        if (hasMilestone('dark', 3)) pg = pg + 0.05;
        if (hasUpgrade('lethe', 33)) pg = pg + 0.2;
        return pg;
    },

    tabFormat:
        ["main-display",
            "prestige-button",
            "resource-display",
            ["display-text",
                function () { if (hasChallenge('kou', 12)) return "Currently, Memory softcap is:" + format(tmp["mem"].softcap) },
                {}],
            "blank",
            "upgrades",
            ["row", [["clickable", 11], ["clickable", 12]]],
        ],

    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("mem", keep);
            if (hasMilestone('light', 1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11, 12, 13, 14, 21, 22, 23, 24]);
            if (hasMilestone('dark', 1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31, 32]);
            if (hasAchievement('a', 32) && !(player['awaken'].current == 'light' || player['awaken'].current == 'dark')) player[this.layer].upgrades.push(33);
            if ((hasUpgrade('dark', 23)) || (hasMilestone('lethe', 4))) player[this.layer].upgrades.push(34);
            if (hasAchievement('a', 21)) player[this.layer].upgrades.push(41);
            if (hasAchievement('a', 55)) player[this.layer].upgrades.push(42);
            if (hasAchievement("a", 13) && (resettingLayer != 'mem')) player[this.layer].points = new Decimal(5);
            if (hasAchievement("a", 51) && (resettingLayer != 'mem')) player[this.layer].points = new Decimal(100);
        }
    },

    update(diff) {
        if (!player.mem.autohold) player.mem.autoholdtimer = new Decimal(0);
        if (player.mem.autohold) player.mem.autoholdtimer = player.mem.autoholdtimer.plus(diff);
        if (player.mem.autoholdtimer.gte(1) && canReset(this.layer)) { doReset(this.layer); player.mem.autoholdtimer = new Decimal(0); };
        if (isNaN(player[this.layer].points.toNumber())) player[this.layer].points = new Decimal(0);
    },

    upgrades: {
        11: {
            title: "Thought Collection",
            description: "Speed up collecting your Fragments.",
            cost() { return new Decimal(1).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            effect() {
                let eff = new Decimal(1.5);
                if (hasUpgrade('mem', 21)) eff = eff.pow(upgradeEffect('mem', 21));
                return eff;
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 11)) + "x"
            },
        },
        12: {
            title: "Memory Extraction",
            description: "Memory gain is boosted by Memories.",
            cost() { return new Decimal(3).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 11) || hasMilestone('light', 1) },
            effect() {
                let eff = player[this.layer].points.plus(1).pow(0.25);
                if (hasUpgrade('mem', 32)) eff = eff.pow(1.25);
                return eff;
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 12)) + "x"
            },
        },
        13: {
            title: "Algorithm Managing",
            description: "Lower further Memory's Fragment requirement",
            cost() { return new Decimal(10).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 12) || hasMilestone('light', 1) },
            effect() {
                let eff = new Decimal(1.25);
                if (hasUpgrade('mem', 23)) eff = eff.pow(upgradeEffect('mem', 23));
                return eff;
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 13)) + "x"
            },
        },
        14: {
            title: "Fragment Duplication",
            description: "Fragment generation is boosted by Fragments",
            cost() { return new Decimal(20).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 13) || hasMilestone('light', 1) },
            effect() {
                return player.points.plus(1).log10().pow(0.75).plus(1).max(1);
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 14)) + "x"
            },
        },
        21: {
            title: "Thought Combination",
            description: "Thought Collection is much faster",
            cost() { return new Decimal(30).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 14) || hasMilestone('light', 1) },
            effect() {
                let eff = new Decimal(2);
                if (hasUpgrade('mem', 31)) eff = eff.pow(upgradeEffect('mem', 31));
                return eff
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 21)) + "x"
            },
        },
        22: {
            title: "Fragment Prediction",
            description: "Fragment generation is boosted by Memories",
            cost() { return new Decimal(50).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 21) || hasMilestone('light', 1) },
            effect() {
                return player[this.layer].points.plus(1).pow(0.5)
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 22)) + "x"
            },
        },
        23: {
            title: "Time Boosting",
            description: "Algorithm Managing is effected by Fragments.",
            cost() { return new Decimal(100).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 22) || hasMilestone('light', 1) },
            effect() {
                return player.points.plus(1).times(1.5).log10().log10(2).pow(0.01).plus(1).max(1);
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 23)) + "x"
            },
        },
        24: {
            title: "Directly Drown",
            description: "Memory gain is boosted by Fragments.",
            cost() { return new Decimal(1000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 23) || hasMilestone('light', 1) },
            effect() {
                return player.points.plus(1).pow(0.05).plus(1).log10().plus(2).log10(5).plus(1).max(1);
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 24)) + "x"
            },
        },
        31: {
            title: "Thought Growth",
            description: "Thought Combination is boosted by Memories",
            cost() { return new Decimal(20000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 24) || hasMilestone('dark', 1) },
            effect() {
                return player[this.layer].points.plus(1).log10().pow(0.5).log10(2).max(1);
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 31)) + "x"
            },
        },
        32: {
            title: "Memory Inflation",
            description: "Memory Extraction is much faster.",
            cost() { return new Decimal(50000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 31) || hasMilestone('dark', 1) },
        },
        33: {
            title: "Directly Transfer",
            description() {
                return "Memories" + ((hasUpgrade('light', 23) && (player['awaken'].current == 'light' || player['awaken'].awakened.includes('light'))) ? " and Fragments" : "") + " gain is massively boosted, but " + ((hasMilestone('kou', 2) || (player['awaken'].current == 'light' || player['awaken'].awakened.includes('light'))) ? "" : "with Fragments gain massively decreased and ") + "Fragments&Memories set to 1."
            },
            cost() { return new Decimal(1000000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return hasUpgrade("mem", 32) },
            effect() {//Mem, not Frag
                let eff = new Decimal(1.5);
                if (hasUpgrade("light", 33)) eff = eff.plus(upgradeEffect('light', 33))
                return eff;
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: " + format(upgradeEffect('mem', 33)) + "x"
            },
            onPurchase() { player.points = new Decimal(1); player[this.layer].points = new Decimal(1); },
        },
        34: {
            title: "Conclusion",
            description() {
                if (hasAchievement('a', 23)) return "Push Memory softcap starts later, but Fragment & Memory are set to 1.";
                if (hasAchievement('a', 22)) return "Useless and Fragment & Memory set to 1.";
                return "Unlock two new layers, but Memory gain decreased and Fragment & Memory are set to 1.";
            },
            cost() { return new Decimal(10000000).times(tmp["kou"].costMult42).pow(tmp["kou"].costExp42) },
            unlocked() { return (hasUpgrade("mem", 33) || hasUpgrade("dark", 23)) },
            onPurchase() { player.points = new Decimal(1); player[this.layer].points = new Decimal(1); },
            effect() {//not decimal
                if (!hasAchievement('a', 23)) return 1;
                if ((player['awaken'].current == 'light' || player['awaken'].awakened.includes('light')) && hasUpgrade('light', 11)) return (50 + Math.sqrt(player.mem.resetTime) > 100) ? 100 : 50 + Math.sqrt(player.mem.resetTime);
                else return (50 - Math.sqrt(player.mem.resetTime) < 5) ? 5 : 50 - Math.sqrt(player.mem.resetTime);
            },
            effectDisplay() {
                if (hasUpgrade('lab', 174)) return "<br>Currently: Memory softcap starts " + format(upgradeEffect('mem', 34)) + "x later"
            },
        },
        41: {
            title: "Build Up The Core.",
            fullDisplay() {
                if (hasAchievement('a', 21)) return "<b>Eternal Core</b></br>A core built of masses of Memories, with a few Lightness and bits of Darkness. It contains nearly endless energy.";
                return "<b>Build Up The Core.</b></br>Unlock two new layers, but sacrifice all your progresses.</br></br>Cost: 1e23 Memories</br>65 Light Tachyons</br>65 Dark Matters"
            },
            description: "Unlock two new layers, but sacrifice all your progresses.",
            canAfford() { return player[this.layer].points.gte(1e23) && player.dark.points.gte(65) && player.light.points.gte(65) },
            pay() {
                player[this.layer].points = player[this.layer].points.sub(1e23);
                player.dark.points = player.dark.points.sub(65);
                player.light.points = player.light.points.sub(65);
            },
            unlocked() { return ((hasUpgrade("dark", 34) && hasUpgrade("light", 34)) || hasAchievement('a', 21))&&!inChallenge('kou',92) },
            style() { return { 'height': '200px', 'width': '200px' } },
            onPurchase() { doReset('kou', true); showTab('none'); player[this.layer].upgrades = [41]; },
        },
        42: {
            title: "Set Up The Lab.",
            fullDisplay() {
                if (hasAchievement('a', 55)) return "<b>The Lab</b></br>The Lab has been set up. Now go for more professional researches."
                return "<b>Set Up The Lab.</b></br>With the experiences and the resources you have, you are now going to set up a lab to research all these things.</br></br>Cost: 1e135 Fragments</br>75 Red Dolls</br>1e107 Forgotten Drops"
            },
            canAfford() { return player.points.gte(1e135) && player.kou.points.gte(75) && player.lethe.points.gte(1e107) },
            pay() {
                player.points = player.points.sub(1e135);
                player.kou.points = player.kou.points.sub(75);
                player.lethe.points = player.lethe.points.sub(1e107);
            },
            unlocked() { return ((hasChallenge('kou', 51)) || hasAchievement('a', 55))&&!inChallenge('kou',92) },
            style() { return { 'height': '200px', 'width': '200px' } },
            onPurchase() { showTab('none'); player.lab.unlocked = true; player.lab.points = new Decimal(1); },
        },
    },
    clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "",
            display: "Remove all Memory upgrades",
            unlocked() { return player.light.unlocked || player.dark.unlocked },
            canClick() { return player.mem.upgrades.length > 0 && !inChallenge('kou', 42) },
            onClick() {
                if (!confirm("This button is designed for where you think you are stucked, are you sure to remove all Memory upgrades?(Milestones will still active)")) return;
                player.mem.upgrades = [];
                if (hasMilestone('light', 1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11, 12, 13, 14, 21, 22, 23, 24]);
                if (hasMilestone('dark', 1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31, 32]);
                if (hasAchievement('a', 32) && player['awaken'].current == null) player[this.layer].upgrades.push(33);
                if ((hasUpgrade('dark', 23)) || (hasMilestone('lethe', 4))) player[this.layer].upgrades.push(34);
                if (hasAchievement('a', 21)) player[this.layer].upgrades.push(41);
                if (hasAchievement('a', 55)) player[this.layer].upgrades.push(42);
            },
            style: { width: "100px", height: "50px" },
        },
        12: {
            title: "Auto hold M",
            display() {
                return (player.mem.autohold ? "On" : "Off")
            },
            unlocked() { return true },
            canClick() { return true },
            onClick() { player.mem.autohold = !player.mem.autohold },
            style: { "background-color"() { return player.mem.autohold ? "#c939db" : "#666666" } },
        },
    },
})

addLayer("light", {
    name: "Light", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0,
            auto: false,
            pseudoDone: [],
            demile: [],
            deupg: [],
        }
    },
    unlockOrder() { return (hasAchievement('a', 14) ? 0 : player[this.layer].unlockOrder); },
    color: "#ededed",
    requires() { return new Decimal(2e8).times((player.light.unlockOrder && !player.light.unlocked) ? 100 : 1) }, // Can be a function that takes requirement increases into account
    resource: "Light Tachyons", // Name of prestige currency
    baseResource: "Memories", // Name of resource prestige is based on
    baseAmount() { return player.mem.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["mem"],
    exponent() {
        let ex = new Decimal(1.25);
        if (hasUpgrade('light', 22)) ex = ex.plus(upgradeEffect('light', 22));
        if (hasUpgrade('light', 34)) ex = ex.plus(-0.05);
        return ex;
    }, // Prestige currency exponent
    base: 1.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasUpgrade("light", 13)) mult = mult.div(upgradeEffect('light', 13)/*tmp.light.effect.pow(0.15)*/);
        if (hasUpgrade("light", 14)) mult = mult.div(upgradeEffect('light', 14));
        if (hasUpgrade("dark", 24)) mult = mult.div(upgradeEffect('dark', 24)/*tmp.dark.effect*/);
        if (hasUpgrade('dark', 34)) mult = mult.div(upgradeEffect('dark', 34));
        if (hasUpgrade('lethe', 32)) mult = mult.div(upgradeEffect('lethe', 32));
        if (hasUpgrade('lethe', 23)) mult = mult.div(upgradeEffect('lethe', 23));
        if (inChallenge("kou", 21)) mult = mult.times(player.dark.points.plus(1).pow(5).max(1));
        if (inChallenge("kou", 31)) mult = mult.div(player.dark.points.sub(player[this.layer].points).max(1));
        //if (hasChallenge("kou",31)) mult = mult.div(player.dark.points.sub(player[this.layer].points).div(2).max(1));
        if (hasChallenge("kou", 31)) {
            if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) mult = mult.div(player.dark.points.sub(player[this.layer].points).times(2).max(1));
            else mult = mult.div(player.dark.points.sub(player[this.layer].points).div(2).max(1));
        }
        if (hasUpgrade('lethe', 11)) mult = mult.div(upgradeEffect('lethe', 11));
        if (hasUpgrade('lethe', 41)) mult = mult.div(upgradeEffect('lethe', 41));
        if (hasMilestone('lab', 3)) mult = mult.div(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab', 83)) mult = mult.div(buyableEffect('lab', 21));
        if (hasUpgrade('storylayer', 21)) mult = mult.div(upgradeEffect('storylayer', 21));
        if (hasUpgrade('storylayer', 22)) mult = mult.div(player.rei.points.div(2).max(1));
        if (inChallenge('saya', 42) || tmp['saya'].grid.ChallengeDepth[8]>-1) mult = mult.times(tmp["dark"].effect.log(layers.saya.challenges[42].debuff()));
        if (hasMilestone('ins', 1)) mult = mult.div(layers.ins.insEffect().Fra().Pos());
        if (hasMilestone('ins', 2)) mult = mult.div(layers.ins.insEffect().Rus().Pos());
        if (inChallenge('kou', 62) || hasChallenge('kou', 62)) mult = mult.div(challengeEffect('kou', 62));

        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1);
        return exp
    },

    update(diff) {
        if (player['awaken'].current == 'light' && player.light.auto == true) player.light.auto = false;
        else if ((player['awaken'].current != 'light' && player['awaken'].current != 'dark') && hasUpgrade('lab', 164)) player.light.auto = true;
    },

    directMult() {
        let dm = new Decimal(1);
        if (player.kou.unlocked) dm = dm.times(tmp.kou.effect);
        if (inChallenge("kou", 11)) dm = dm.times(1.5);
        if (inChallenge('kou', 12) || hasUpgrade('lab', 91)) dm = dm.times(10);
        if (hasAchievement('a', 43)) dm = dm.times(player.dark.points.div(player.light.points.max(1)).max(1).min(5));
        if (inChallenge("kou", 31) && player.dark.points.lt(player[this.layer].points)) dm = dm.times(0.1);
        if (inChallenge('kou', 42)) dm = dm.times(2);
        if (inChallenge('saya', 42) || tmp['saya'].grid.ChallengeDepth[8]>-1) dm = dm.div(tmp["dark"].effect.log(layers.saya.challenges[42].debuff()));
        if (hasUpgrade('light', 41)) dm = dm.times(upgradeEffect('light', 41));
        return dm;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow: 3,
    hotkeys: [
        { key: "l", description: "L: Reset for Light Tachyons", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return hasUpgrade('mem', 34) || hasMilestone("light", 0) },
    autoPrestige() {
        if (layers['light'].deactivated()) return false;
        return (hasAchievement('a', 34) && player.light.auto)
    },
    increaseUnlockOrder: ["dark"],

    //AW通用相关
    deactivated() {
        let bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].deupg.length == 0) player[this.layer].deupg = player[this.layer].upgrades;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].deupg.length != 0) { player[this.layer].upgrades = player[this.layer].deupg; player[this.layer].deupg = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    milestones: {
        0: {
            requirementDescription: "1 Light Tachyon",
            done() { return player.light.best.gte(1) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription() {
                let str = "This Layer is no longer hidden";
                if (player.awaken.current != this.layer) str = str + ' & Light Upgrades return their cost by Achievements.';
                else str = str + "."
                return str;
            },
        },
        1: {
            requirementDescription: "5 Light Tachyons",
            done() { return player.light.best.gte(5) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription: "Keep all your row1&row2 Memory upgrades when L or D reset.",
        },
        2: {
            requirementDescription: "15 Light Tachyons",
            done() { return player.light.best.gte(15) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription: "Make Memories gain After softcap's exponent +0.02.",
        },
        3: {
            requirementDescription: "30 Light Tachyons",
            done() { return player.light.best.gte(30) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription: "Gain 5% of Memories gain every second.",
        },
    },

    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },

    doReset(resettingLayer) {
        let keep = [];
        if (hasAchievement('a', 34)) keep.push("auto");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset('light', keep);
            if (hasMilestone('kou', 0)) { player[this.layer].upgrades.push(22); player[this.layer].milestones = player[this.layer].milestones.concat([0, 1]) };
            if (hasMilestone('kou', 1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11, 12, 13, 14]);
            if (hasMilestone('kou', 3)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31, 32, 33, 34]);
            if (hasMilestone('kou', 4)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21, 23, 24]);
            if (hasMilestone('kou', 5)) player[this.layer].milestones = player[this.layer].milestones.concat([2, 3]);
            if (hasMilestone('kou', 2) && (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou'))) player[this.layer].upgrades = player[this.layer].upgrades.concat([41, 42, 43, 44]);
        }
        if (player.tab == 'light' && (!hasUpgrade('dark', 23) && !hasMilestone('light', 0))) showTab('none');
    },
    canBuyMax() { return hasUpgrade('light', 22) },
    resetsNothing() { return hasMilestone('kou', 6) },

    effectBase() {
        let base = new Decimal(1.5);
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) base = new Decimal(2);
        return base;
    },
    effect() {
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff = Decimal.times(tmp.light.effectBase, player.light.points.plus(1));
        if (hasUpgrade('light', 21)) eff = eff.times(upgradeEffect('light', 21));
        if (hasUpgrade('light', 31)) eff = eff.times(player[this.layer].points.sqrt());
        if (hasAchievement('a', 33)) eff = eff.times(Decimal.log10(player[this.layer].resetTime + 1).plus(1));
        if (hasChallenge("kou", 11)) eff = eff.times(challengeEffect('kou', 11));
        if (inChallenge('kou', 22)) eff = eff.times(Math.random());
        if (hasUpgrade('lethe', 13)) eff = eff.times(upgradeEffect('lethe', 13)/*tmp.kou.effect.pow(1.5)*/);
        if (hasUpgrade('lethe', 31)) eff = eff.times(upgradeEffect('lethe', 31));
        if (hasUpgrade('lethe', 14)) eff = eff.times(upgradeEffect('lethe', 14));
        if (challengeCompletions('saya', 11) && !layers['saya'].deactivated()) eff = eff.times(challengeEffect('saya', 11));
        if (hasUpgrade('lab', 164)) eff = eff.times(buyableEffect('lab', 21).div(10).max(1));
        if (hasUpgrade('light', 44)) eff = eff.times(upgradeEffect('light', 44));
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) eff = eff.times(tmp["rei"].challenges[11].effectAWtoLD);

        //pow
        if (inChallenge('kou', 32)) eff = eff.pow(Math.random());
        if (inChallenge('saya', 11) || tmp['saya'].grid.ChallengeDepth[1]>-1) eff = eff.pow(layers.saya.challenges[11].debuff());
        if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toLEff())

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

        if (eff.lt(1)) return new Decimal(1);
        return eff;
    },
    effectDescription() {
        return "which are boosting Fragments generation by " + format(tmp.light.effect) + "x"
    },

    upgrades: {
        11: { /*title: "Optimistic Thoughts",
        description() {
            let str=""
            if(player['awaken'].current!=this.layer&&!player['awaken'].awakened.includes(this.layer)) str=str+"Conclusion decreases Memories gain less."
            else str=str+"Conclusion now increase its effect instead of decrease. End at 100x."
            return str;
        },*/
            fullDisplay() {
                let str = "<b>Optimistic Thoughts</b><br>"
                if (player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) str = str + "Conclusion decreases Memories gain less."
                else str = str + "Conclusion now increase its effect instead of decrease. End at 100x."
                str = str + "<br><br>Cost: " + this.cost() + " Light Tachyons"
                return str;
            },
            unlocked() { return player.light.unlocked },
            effect() {
                return (hasUpgrade('light', 21)) ? new Decimal(0.95) : new Decimal(0.9);
            },
            onPurchase() {
                if (hasMilestone('light', 0) && !hasAchievement('a', 22)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
                if (hasAchievement('a', 22) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost);
            },
            cost() { return new Decimal(1).times(tmp["kou"].costMult42l) },
        },
        12: { /*title: "Wandering For Beauty",
        description: "Light Tachyons also effects Memories gain at a reduced rate.",*/
            fullDisplay() {
                let str = "<b>Wandering For Beauty</b><br>Light Tachyons also effects Memories gain at a reduced rate."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('light', 12)) + "x"
                str = str + "<br><br>Cost: " + this.cost() + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 11) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = 1;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = tmp["light"].effect.times(0.75).max(1)
                else eff = tmp["light"].effect.div(2).max(1)
                return eff;
            },
            cost() { return new Decimal(3).times(tmp["kou"].costMult42l) },
        },
        13: { /*title: "Experiencing Happiness",
        description: "Light Tachyons also effects its own gain at a reduced rate.",*/
            fullDisplay() {
                let str = "<b>Experiencing Happiness</b><br>Light Tachyons also effects its own gain at a reduced rate."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('light', 13)) + "x"
                str = str + "<br><br>Cost: " + this.cost() + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 12) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = 1;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = tmp.light.effect.pow(0.2)
                else eff = tmp.light.effect.pow(0.15)
                return eff;
            },
            cost() { return new Decimal(5).times(tmp["kou"].costMult42l) },
        },
        14: { /*title: "After That Butterfly",
        description: "Light Tachyons itself boosts its own gain.",*/
            fullDisplay() {
                let str = "<b>After That Butterfly</b><br>Light Tachyons itself boosts its own gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('light', 14)) + "x"
                str = str + "<br><br>Cost: " + this.cost() + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 13) },
            effect() {
                let eff = 1;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player[this.layer].points.plus(1).log10().plus(1);
                else eff = player[this.layer].points.plus(1).log10().plus(1).pow(0.5);
                return eff;
            },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            cost() { return new Decimal(8).times(tmp["kou"].costMult42l) },
        },
        21: { /*title: "Seeking Delight.",
        description: "Conclusion decreases Memories gain more less, and gain ^0.33 instead of ^0.25 Memories after softcap.",*/
            fullDisplay() {
                let str = "<b>Seeking Delight.</b><br>"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "Light Milestones themselves enhance Light Tachyons' effect.<br>Currently: " + format(upgradeEffect('light', 21)) + "x"
                else str = str + "Conclusion decreases Memories gain more less, and gain ^0.33 instead of ^0.25 Memories after softcap."
                str = str + "<br><br>Cost: " + this.cost() + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 14) },
            effect() {
                let eff = 1;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player[this.layer].milestones.length;
                return eff;
            },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            cost() { return new Decimal(10).times(tmp["kou"].costMult42l) },
        },
        22: { /*title: "More Brightness",
        description: "You can buy max Light Tachyons And lower Memories requirement for further Light Tachyons",*/
            fullDisplay() {
                let str = "<b>More Brightness</b><br>You can buy max Light Tachyons And lower Memories requirement for further Light Tachyons"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: ^" + format(upgradeEffect('light', 22))
                str = str + "<br><br>Cost: " + this.cost() + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 21) || hasMilestone('kou', 0) },
            effect() { return -0.15 },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            cost() { return new Decimal(15).times(tmp["kou"].costMult42l) },
        },
        23: { /*title: "Fragment Sympathy",
        description: "Directly Transfer decreases Fragments gain less.",*/
            fullDisplay() {
                let str = "<b>Fragment Sympathy</b><br>"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "Directly Transfer now increases Fragments gain."
                else str = str + "Directly Transfer decreases Fragments gain less."
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 22) },
            onPurchase() {
                if (hasMilestone('light', 0) && !hasAchievement('a', 32)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
                if (hasAchievement('a', 32) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost);
            },
            cost() {
                let price = 20;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 12500;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        24: { /*title: "Sadness Overjoy",
        description: "Light Tachyons also effects Dark Matters gain.",*/
            fullDisplay() {
                let str = "<b>Sadness Overjoy</b><br>Light Tachyons also effects Dark Matters gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('light', 24)) + "x"
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 23) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() { return layers['light'].effect() },
            //cost() {return new Decimal(28).times(tmp["kou"].costMult42l)},
            cost() {
                let price = 28;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 12500;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        31: { //title: "Hardware BUS",
            //description: "Light Tachyons effect formula now much better.",
            fullDisplay() {
                let str = "<b>Hardware BUS</b><br>Light Tachyons effect formula now much better."
                //if(player['awaken'].current==this.layer||player['awaken'].awakened.includes(this.layer)) str=str+"<br>Currently: x"+format(upgradeEffect('light',24))
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 24) || hasMilestone('kou', 3) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            //cost() {return new Decimal(35).times(tmp["kou"].costMult42l)},
            cost() {
                let price = 35;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 12500;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        32: { //title: "Moments of Lifes",
            //description: "Gain ^0.40 instead of ^0.33 Memories after softcap.",
            fullDisplay() {
                let str = "<b>Moments of Lifes</b><br>"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "Gain ^0.40 base power of Memories after softcap."
                else str = str + "Gain ^0.40 instead of ^0.33 Memories after softcap."
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 31) || hasMilestone('kou', 3) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            //cost() {return new Decimal(40).times(tmp["kou"].costMult42l)},
            cost() {
                let price = 40;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 12650;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        33: { //title: "Prepare To Travel",
            //description: "Light Tachyons itself now makes Directly Transfer boosts more Memories gain.",
            fullDisplay() {
                let str = "<b>Prepare To Travel</b><br>Light Tachyons itself now makes Directly Transfer boosts more Memories "
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "and Fragments gain."
                else str = str + "gain."
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 32) || hasMilestone('kou', 3) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = player[this.layer].points.div(500);
                if (eff.lte(0.1)) return new Decimal(0.1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) { if (eff.gt(0.5)) return new Decimal(0.5); }
                else if (eff.gt(0.3)) return new Decimal(0.3);
                return eff;
            },
            //cost() {return new Decimal(44).times(tmp["kou"].costMult42l)},
            cost() {
                let price = 44;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 15850;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        34: { //title: "The Light",
            //description: "Lower Memories requirement for further Light Tachyons, and Light Tachyons itself now boosts Dark Matters gain.",
            fullDisplay() {
                let str = "<b>The Light</b><br>Lower Memories requirement for further Light Tachyons, and Light Tachyons itself now boosts Dark Matters gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('light', 34)) + "x"
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Light Tachyons"
                return str;
            },
            unlocked() { return hasUpgrade("light", 33) || hasMilestone('kou', 3) },
            onPurchase() {
                if (hasMilestone('light', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = player[this.layer].points.div(3);
                if (eff.lt(1.25)) return new Decimal(1.25);
                return eff;
            },
            //cost() {return new Decimal(48).times(tmp["kou"].costMult42l)},
            cost() {
                let price = 48;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 19500;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        41: { /*title: "Inner Light",*/
            /*description: "The number of unlocked Light side layers boosts Light Tachyons' direct gain.",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: 1.5e13 Light Tachyons",*/
            pseudoCan() {
                let bol = player.light.points.gte(1e14)
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 41) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: 1e14 Light Tachyons") : ("<b>Inner Light</b><br>The number of unlocked Light side layers boosts Light Tachyons' direct gain.<br>Currently: " + format(upgradeEffect("light", 41)) + "x<br><br>Cost: " + format(this.cost()) + " Light Tachyons");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {//每加一个层都回来看一遍
                let eff = 1;
                if (!layers['kou'].deactivated() && player.kou.unlocked == true) eff += 1;
                if (!layers['rei'].deactivated() && player.rei.unlocked == true) eff += 1;
                if (!layers['etoluna'].deactivated() && player.etoluna.unlocked == true) eff += 1;
                if (!layers['fracture'].deactivated() && player.fracture.unlocked == true) eff += 1;
                return eff;
            },
            cost() { return new Decimal(2.5e14).times(tmp["kou"].costMult42l) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 41) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },
        42: { /*title: "Joyfull Fireworks",*/
            /*description: "Light Tachyons' effect now affect Red Dolls' effect.",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: 1.5e13 Light Tachyons",*/
            pseudoCan() {
                let bol = player.kou.points.gte(17400) && inChallenge('kou', 51);
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 42) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: 17,400 Red Dolls in Red Comet challenge") : ("<b>Joyfull Fireworks</b><br>Light Tachyons' effect now affect Red Dolls' effect.<br>Currently: " + format(upgradeEffect("light", 42)) + "x<br><br>Cost: " + format(this.cost()) + " Light Tachyons");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {
                if (layers['kou'].deactivated()) return new Decimal(1);
                let eff = layers['light'].effect().plus(1).log10().div(2).max(1);
                return eff;
            },
            cost() { return new Decimal(9e12).times(tmp["kou"].costMult42l) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 42) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },

        43: { /*title: "Amnesia and Recall",*/
            /*description: "Light Tachyons' effect now affect Glowing Roses' passive generation.",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: 5e415 Fragments in Zero Sky",*/
            pseudoCan() {
                let bol = player.points.gte("5e415") && inChallenge('rei', 11);
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 43) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: 5e415 Fragments in Zero Sky") : ("<b>Amnesia and Recall</b><br>Light Tachyons' effect now affect Glowing Roses' passive generation.<br>Currently: " + format(upgradeEffect("light", 43)) + "x<br><br>Cost: " + format(this.cost()) + " Light Tachyons");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {
                if (layers['rei'].deactivated()) return new Decimal(1);
                let eff = layers['light'].effect().max(1);
                return eff;
            },
            cost() { return new Decimal(9e12).times(tmp["kou"].costMult42l) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 43) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },

        44: { /*title: "Star Festival",*/
            /*description: "Gemini Bounds' effect now affect Light Tachyons' effect.",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: 5e24 Gemini Bounds",*/
            pseudoCan() {
                let bol = player.etoluna.points.gte("5e24");
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 43) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: 5e24 Gemini Bounds") : ("<b>Star Festival</b><br>Gemini Bounds' effect now affect Light Tachyons' effect.<br>Currently: " + format(upgradeEffect("light", 44)) + "x<br><br>Cost: " + format(this.cost()) + " Light Tachyons");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {
                if (layers['etoluna'].deactivated()) return new Decimal(1);
                let eff = layers['etoluna'].effect().max(1);
                return eff;
            },
            cost() { return new Decimal(3.5e13).times(tmp["kou"].costMult42l) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('light', 42) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },

    }
})

addLayer("dark", {
    name: "Dark", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0,
            auto: false,
            demile: [],
            deupg: [],
            pseudoDone: [],
        }
    },
    unlockOrder() { return (hasAchievement('a', 14) ? 0 : player[this.layer].unlockOrder); },
    color: "#383838",
    requires() { return new Decimal(9999).times((player.dark.unlockOrder && !player.dark.unlocked) ? 5 : 1) }, // Can be a function that takes requirement increases into account
    resource: "Dark Matters", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["mem"],
    exponent() {
        let ex = new Decimal(1.25);
        if (hasUpgrade('dark', 22)) ex = ex.plus(-0.15);
        if (hasUpgrade('dark', 34)) ex = ex.plus(-0.05);
        return ex;
    },  // Prestige currency exponent
    base: 1.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("dark", 13)) mult = mult.div(upgradeEffect('dark', 13));
        if (hasUpgrade("dark", 14)) mult = mult.div(upgradeEffect('dark', 14));
        if (hasUpgrade("light", 24)) mult = mult.div(tmp.light.effect);
        if (hasUpgrade("dark", 33)) mult = mult.div(upgradeEffect('dark', 33));
        if (hasUpgrade('light', 34)) mult = mult.div(upgradeEffect('light', 34));
        if (hasUpgrade('lethe', 43)) mult = mult.div(upgradeEffect('lethe', 43));
        if (hasUpgrade('lethe', 34)) mult = mult.div(upgradeEffect('lethe', 34));
        if (inChallenge("kou", 21)) mult = mult.times(player.light.points.plus(1).pow(5).max(1));
        if (inChallenge("kou", 31)) mult = mult.div(player.light.points.sub(player[this.layer].points).max(1));
        if (hasChallenge("kou", 31)) {
            if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) mult = mult.div(player.light.points.sub(player[this.layer].points).times(2).max(1));
            else mult = mult.div(player.light.points.sub(player[this.layer].points).div(2).max(1));
        }
        if (hasMilestone('lab', 4)) mult = mult.div(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab', 84)) mult = mult.div(buyableEffect('lab', 22));
        if (hasUpgrade('storylayer', 21)) mult = mult.div(upgradeEffect('storylayer', 21));
        if (hasUpgrade('storylayer', 22)) mult = mult.div(player.yugamu.points.div(2).max(1));
        if (challengeCompletions('saya', 42) && !layers['saya'].deactivated()) mult = mult.div(challengeEffect('saya', 42));
        if (hasMilestone('ins', 1)) mult = mult.div(layers.ins.insEffect().Deu().Pos());
        if (hasMilestone('ins', 2)) mult = mult.div(layers.ins.insEffect().Rus().Pos());
        if (inChallenge('kou', 62) || hasChallenge('kou', 62)) mult = mult.div(challengeEffect('kou', 62));
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1);
        return exp;
    },

    directMult() {
        let dm = new Decimal(1);
        if (player.kou.unlocked) dm = dm.times(tmp.kou.effect);
        if (inChallenge("kou", 11)) dm = dm.times(1.5);
        if (inChallenge('kou', 12) || hasUpgrade('lab', 91)) dm = dm.times(10);
        if (hasAchievement('a', 43)) dm = dm.times(player.light.points.div(player.dark.points.max(1)).max(1).min(5));
        if (inChallenge("kou", 31) && player.light.points.lt(player[this.layer].points)) dm = dm.times(0.1);
        if (inChallenge('kou', 42)) dm = dm.times(2);
        if (hasUpgrade('dark', 41)) dm = dm.times(upgradeEffect('dark', 41));
        return dm;
    },

    update(diff) {
        if (player['awaken'].current == 'dark' && player.light.auto == true) player.dark.auto = false;
        else if ((player['awaken'].current != 'light' && player['awaken'].current != 'dark') && hasUpgrade('lab', 164)) player.dark.auto = true;
    },

    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow: 3,
    hotkeys: [
        { key: "d", description: "D: Reset for Dark Matters", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return hasUpgrade('mem', 34) || hasMilestone('dark', 0) },
    autoPrestige() {
        if (layers['dark'].deactivated()) return false;
        return (hasAchievement('a', 34) && player.dark.auto)
    },
    increaseUnlockOrder: ["light"],

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].deupg.length == 0) player[this.layer].deupg = player[this.layer].upgrades;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].deupg.length != 0) { player[this.layer].upgrades = player[this.layer].deupg; player[this.layer].deupg = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    milestones: {
        0: {
            requirementDescription: "1 Dark Matter",
            done() { return player.dark.best.gte(1) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription() {
                let str = "This Layer is no longer hidden";
                if (player.awaken.current != this.layer) str = str + ' & Dark Upgrades return their cost by Achievements.';
                else str = str + "."
                return str;
            },
        },
        1: {
            requirementDescription: "5 Dark Matters",
            done() { return player.dark.best.gte(5) && hasAchievement('a', 21) },

            unlocked() { return hasAchievement('a', 21) },
            effectDescription: "Keep your first two Memory upgrades on row 3 when L or D reset.",
        },
        2: {
            requirementDescription: "15 Dark Matters",
            done() { return player.dark.best.gte(15) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription: "Dark Matters' affection now also makes Memory softcap starts later.",
        },
        3: {
            requirementDescription: "30 Dark Matters",
            done() { return player.dark.best.gte(30) && hasAchievement('a', 21) },
            unlocked() { return hasAchievement('a', 21) },
            effectDescription: "Gain 5% of Memories gain every second.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },

    doReset(resettingLayer) {
        let keep = [];
        if (hasAchievement('a', 34)) keep.push("auto");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset('dark', keep);
            if (hasMilestone('lethe', 0)) { player[this.layer].upgrades.push(22); player[this.layer].milestones = player[this.layer].milestones.concat([0, 1]) };
            if (hasMilestone('lethe', 1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11, 12, 13, 14]);
            if (hasMilestone('lethe', 3)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31, 32, 33, 34]);
            if (hasMilestone('lethe', 4)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21, 23, 24]);
            if (hasMilestone('lethe', 5)) player[this.layer].milestones = player[this.layer].milestones.concat([2, 3]);
            if (hasMilestone('lethe', 2) && (player['awaken'].current == 'lethe' || player['awaken'].awakened.includes('lethe'))) player[this.layer].upgrades = player[this.layer].upgrades.concat([41, 42, 43, 44]);
        };
        if (player.tab == 'dark' && (!hasUpgrade('dark', 23) && !hasMilestone('dark', 0))) showTab('none');
    },
    canBuyMax() { return hasUpgrade('dark', 22) },
    resetsNothing() { return hasMilestone('lethe', 6) },

    effectBase() {
        let base = new Decimal(1.5);
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) base = new Decimal(5);
        return base;
    },
    effect() {
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff = Decimal.pow(player[this.layer].points.plus(1).log10().plus(1), tmp.dark.effectBase);
        if (hasUpgrade('dark', 31)) eff = Decimal.pow(player[this.layer].points.plus(1).times(2).sqrt().plus(1), tmp.dark.effectBase);
        if (hasAchievement('a', 33)) eff = eff.times(Decimal.log10(player[this.layer].resetTime + 1).plus(1));
        //if (hasChallenge("kou", 11)) eff=eff.times(player.points.plus(1).log10().plus(1).sqrt());
        if (hasChallenge("kou", 11)) eff = eff.times(challengeEffect('kou', 11));
        if (inChallenge('kou', 22)) eff = eff.times(Math.random());
        if (hasUpgrade('lethe', 35)) eff = eff.times(upgradeEffect('lethe',35)/*tmp.kou.effect.pow(1.5)*/);
        if (hasUpgrade('lethe', 53)) eff = eff.times(upgradeEffect('lethe', 53));
        if (hasUpgrade('lethe', 52)) eff = eff.times(upgradeEffect('lethe', 52));
        if (hasUpgrade('lethe', 25)) eff = eff.times(upgradeEffect('lethe', 25));
        if (hasUpgrade('lethe', 55)) eff = eff.times(upgradeEffect('lethe', 55));
        if (challengeCompletions('saya', 12) && !layers['saya'].deactivated()) eff = eff.times(challengeEffect('saya', 12));
        if (hasUpgrade('lab', 164)) eff = eff.times(buyableEffect('lab', 22).div(10).max(1));
        if (hasUpgrade('light', 42)) eff = eff.times(upgradeEffect('light', 42));
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) eff = eff.times(tmp["rei"].challenges[11].effectAWtoLD);

        //pow
        if (inChallenge('kou', 32)) eff = eff.pow(Math.random());
        if (inChallenge('saya', 12) || tmp['saya'].grid.ChallengeDepth[2]>-1) eff = eff.pow(layers.saya.challenges[12].debuff());
        if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toDEff());

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

        if (eff.lt(1)) return new Decimal(1);
        return eff;
    },
    effectDescription() {
        return "which are boosting Memories gain by " + format(tmp.dark.effect) + "x"
    },
    upgrades: {
        11: { //title: "Overclock",
            //description: "Your Fragments generation is doubled when under 9999",
            fullDisplay() {
                let str = "<b>Overclock</b><br>"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "Your Fragments generation is tripled when the generate speed per second is below your current Fragments."
                else str += "Your Fragments generation is doubled when under 9999."
                str = str + "<br><br>Cost: " + this.cost() + " Dark Matters"
                return str;
            },
            unlocked() { return player.dark.unlocked },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            cost() { return new Decimal(1).times(tmp["kou"].costMult42d) },
            effect() {
                let eff = new Decimal(9999);
                if (hasUpgrade('dark', 21)) eff = new Decimal(19998);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = getPointGen();
                return eff;
            },
        },
        12: { //title: "Seeking For Other Sides",
            //description: "Dark Matters also effects Fragments generation at a reduced rate.",  
            fullDisplay() {
                let str = "<b>Seeking For Other Sides</b><br>Dark Matters also effects Fragments generation at a reduced rate."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 12)) + "x"
                str = str + "<br><br>Cost: " + this.cost() + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 11) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = new Decimal(tmp.dark.effect.pow(0.5));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = new Decimal(tmp.dark.effect.pow(0.75));
                return eff;
            },
            cost() { return new Decimal(3).times(tmp["kou"].costMult42d) },
        },
        13: { //title: "Crack Everything",
            //description: "Dark Matters also effects its own gain at a reduced rate.",
            fullDisplay() {
                let str = "<b>Crack Everything</b><br>Dark Matters also effects its own gain at a reduced rate."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 13)) + "x"
                str = str + "<br><br>Cost: " + this.cost() + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 12) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = new Decimal(tmp.dark.effect.pow(0.5));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = new Decimal(tmp.dark.effect.pow(0.6));
                return eff;
            },
            cost() { return new Decimal(5).times(tmp["kou"].costMult42d) },
        },
        14: { //title: "Wrath In Calm",
            //description: "Dark Matters itself boosts its own gain.",
            fullDisplay() {
                let str = "<b>Wrath In Calm</b><br>Dark Matters itself boosts its own gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 14)) + "x"
                str = str + "<br><br>Cost: " + this.cost() + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 13) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = player[this.layer].points.plus(1).log10().plus(1).pow(0.5);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player[this.layer].points.plus(1).log10().plus(1);
                return eff;
            },
            cost() { return new Decimal(8).times(tmp["kou"].costMult42d) },
        },
        21: { //title: "Power Override",
            //description: "Overclock ends at 19,998 and Memories softcap starts 50x later.",
            fullDisplay() {
                let str = "<b>Power Override</b><br>"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "Memories softcap starts log10(Memories+1)x later. Mininum is 50x<br>Currently: " + format(upgradeEffect('dark', 21)) + "x"
                else str += "Overclock ends at 19,998 and Memories softcap starts 50x later."
                str = str + "<br><br>Cost: " + this.cost() + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 14) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = new Decimal(50);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player['mem'].points.plus(1).log10().max(50);
                return eff;
            },
            cost() { return new Decimal(10).times(tmp["kou"].costMult42d) },
        },
        22: { //title: "More Darkness",
            //description: "You can buy max Dark Matters And lower Fragments requirement for further Dark Matters",
            fullDisplay() {
                let str = "<b>More Darkness</b><br>You can buy max Dark Matters And lower Fragments requirement for further Dark Matters"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: ^" + format(upgradeEffect('dark', 22))
                str = str + "<br><br>Cost: " + this.cost() + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 21) || hasMilestone('lethe', 0) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            cost() { return new Decimal(15).times(tmp["kou"].costMult42d) },
            effect() {
                let eff = new Decimal(-0.15);
                //if(player['awaken'].current==this.layer||player['awaken'].awakened.includes(this.layer)) eff=player['mem'].points.plus(1).log10().max(50);
                return eff;
            },
        },
        23: { //title: "Force Operation",
            //description: "Keep Conclusion upgrade when L or D reset.",
            fullDisplay() {
                let str = "<b>Force Operation</b><br>Keep Conclusion upgrade when L or D reset."
                //if(player['awaken'].current==this.layer||player['awaken'].awakened.includes(this.layer)) str=str+"<br>Currently: ^"+format(upgradeEffect('dark',22))
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 22) && ((hasUpgrade("light", 21) || hasMilestone('lethe', 2)) || (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !hasAchievement('a', 22)) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
                if (hasAchievement('a', 22) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost); player.mem.upgrades.push(34)
            },
            //cost() {return new Decimal(20).times(tmp["kou"].costMult42d)},
            cost() {
                let price = 20;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 10000;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        24: { //title: "Calm in Warth",
            //description: "Dark Matters also effects Light Tachyons gain.",
            fullDisplay() {
                let str = "<b>Calm in Warth</b><br>Dark Matters also effects Light Tachyons gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 24)) + "x"
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 23) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                return tmp.dark.effect;
            },
            //cost() {return new Decimal(28).times(tmp["kou"].costMult42d)},
            cost() {
                let price = 28;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 10500;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        31: { //title: "Memory Organizing",
            //description: "Dark Matters effect formula now much better.",
            fullDisplay() {
                let str = "<b>Memory Organizing</b><br>Dark Matters effect formula now much better."
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 24) || hasMilestone('lethe', 3) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            //cost() {return new Decimal(35).times(tmp["kou"].costMult42d)},
            cost() {
                let price = 35;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 10500;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        32: { //title: "Moments of Anger",
            //description: "Dark Matters itself makes Memories softcap starts later.",
            fullDisplay() {
                let str = "<b>Moments of Anger</b><br>Dark Matters itself makes Memories softcap starts later."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 32)) + "x"
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 31) || hasMilestone('lethe', 3) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = player[this.layer].points.div(2);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player[this.layer].points;
                if (eff.lt(1.5)) return new Decimal(1.5);
                return eff;
            },
            //cost() {return new Decimal(40).times(tmp["kou"].costMult42d)},
            cost() {
                let price = 40;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 11000;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        33: { //title: "Prepare To Bleed",
            //description: "Achievements now boost Dark Matters gain.",
            fullDisplay() {
                let str = "<b>Prepare To Bleed</b><br>Achievements now boost Dark Matters gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 33)) + "x"
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 32) || hasMilestone('lethe', 3) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = player.a.achievements.length;
                if (eff <= 1) return 1;
                return eff;
            },
            //cost() {return new Decimal(44).times(tmp["kou"].costMult42d)},
            cost() {
                let price = 40;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 11250;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        34: { //title: "The Dark",
            //description: "Lower Fragments requirement for further Dark Matters, and Dark Matters itself now boosts Light Tachyons gain.",
            fullDisplay() {
                let str = "<b>The Dark</b><br>Lower Fragments requirement for further Dark Matters, and Dark Matters itself now boosts Light Tachyons gain."
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = str + "<br>Currently: " + format(upgradeEffect('dark', 34)) + "x"
                str = str + "<br><br>Cost: " + ((player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) ? format(this.cost()) : this.cost()) + " Dark Matters"
                return str;
            },
            unlocked() { return hasUpgrade("dark", 33) || hasMilestone('lethe', 3) },
            onPurchase() {
                if (hasMilestone('dark', 0) && !player['awaken'].current == this.layer) player[this.layer].points = player[this.layer].points.plus(tmp[this.layer].upgrades[this.id].cost.times(new Decimal(0.5 + (player.a.achievements.length - 6) / 10).min(1)).floor());
            },
            effect() {
                let eff = player[this.layer].points.div(3);
                if (eff.lt(1.25)) return new Decimal(1.25);
                return eff;
            },
            //cost() {return new Decimal(48).times(tmp["kou"].costMult42d)},
            cost() {
                let price = 48;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 13000;
                return new Decimal(price).times(tmp["kou"].costMult42l)
            },
        },
        41: { /*title: "Inner Darkness",*/
            /*description: "The number of unlocked Light side layers boosts Light Tachyons' direct gain.",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: 1.5e13 Dark Matters",*/
            pseudoCan() {
                let bol = player.dark.points.gte(1e14)
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 41) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: 1e14 Dark Matters") : ("<b>Inner Darkness</b><br>The number of unlocked Dark side layers boosts Dark Matters' direct gain.<br>Currently: " + format(upgradeEffect("dark", 41)) + "x<br><br>Cost: " + format(this.cost()) + " Dark Matters");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {//每加一个层都回来看一遍
                let eff = 1;
                if (!layers['lethe'].deactivated() && player.kou.unlocked == true) eff += 1;
                if (!layers['yugamu'].deactivated() && player.rei.unlocked == true) eff += 1;
                if (!layers['saya'].deactivated() && player.etoluna.unlocked == true) eff += 1;
                if (!layers['tempest'].deactivated() && player.tempest.unlocked == true) eff += 1;
                return eff;
            },
            cost() { return new Decimal(2.5e14).times(tmp["kou"].costMult42d) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 41) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },
        42: { /*title: "Styx Memory",*/
            /*description: "Dark Matters' effect now affect Frogotten Drops' effect.",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: Can get 1e1750 Forgotten Drops if Forgotten reset with exactly 5 beacons",*/
            pseudoCan() {
                let bol = getResetGain('lethe').gte("1e1750") && player.lethe.upgrades.length == 5
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 42) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: Can get 1e1750 Forgotten Drops if Forgotten reset with exactly 5 beacons") : ("<b>Styx Memory</b><br>Dark Matters' effect now affect Frogotten Drops' effect.<br>Currently: " + format(upgradeEffect("dark", 42)) + "x<br><br>Cost: " + format(this.cost()) + " Dark Matters");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {
                if (layers['lethe'].deactivated()) return new Decimal(1);
                let eff = layers['dark'].effect().plus(1).log10().times(2).max(1);
                return eff;
            },
            cost() { return new Decimal(9e12).times(tmp["kou"].costMult42d) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 42) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },
        43: { /*title: "Fake Exit",*/
            /*description: "Dark Matters' effect gives extra move times in maze",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: 6e24 moved time in maze",*/
            pseudoCan() {
                let bol = player.yugamu.timesmoved.gte(6e24);
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 43) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: 6e24 moved time in maze") : ("<b>Fake Exit</b><br>Dark Matters' effect gives extra move times in maze.<br>Currently: " + format(upgradeEffect("dark", 43)) + "x<br><br>Cost: " + format(this.cost()) + " Dark Matters");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {
                let eff = layers['dark'].effect().plus(1).log10().max(1);
                if (layers['yugamu'].deactivated()) eff = new Decimal(1);
                return eff;
            },
            cost() { return new Decimal(9e12).times(tmp["kou"].costMult42d) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 43) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },
        44: { /*title: "Personality Fusion",*/
            /*description: "Dark Matters' effect now affect Everflashing Knives' effect",*/
            pseudoUnl() { return player.awaken.awakened.includes(this.layer) },
            /*pseudoReq: "Req: Can gain 1e2295 Memories if Memory reset in Rationalism challenge",*/
            pseudoCan() {
                let bol = getResetGain('mem').gte("1e2245") && (inChallenge('saya', 22)||tmp['saya'].grid.ChallengeDepth[4]>-1);
                if (bol && !player[this.layer].pseudoDone.includes(this.id)) player[this.layer].pseudoDone.push(this.id)
                return bol || player[this.layer].pseudoDone.includes(this.id)
            },
            fullDisplay() {
                return (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 44) && !layers[this.layer].upgrades[this.id].pseudoCan()) ? ("Req: Can gain 1e2245 Memories if Memory reset in Rationalism challenge") : ("<b>Personality Fusion</b><br>Dark Matters' effect now affect Everflashing Knives' effect.<br>Currently: " + format(upgradeEffect("dark", 44)) + "x<br><br>Cost: " + format(this.cost()) + " Dark Matters");
            },
            unlocked() { return player.awaken.awakened.includes(this.layer) },
            canAfford() { return layers[this.layer].upgrades[this.id].pseudoCan() && player[this.layer].points.gte(this.cost()) },
            onPurchase() { },
            //pay(){player[this.layer].points = player[this.layer].points.sub(new Decimal(3e13));},
            effect() {
                if (layers['saya'].deactivated()) return new Decimal(1);
                let eff = layers['dark'].effect().plus(1).log10().div(20).max(1);
                return eff;
            },
            cost() { return new Decimal(3.5e13).times(tmp["kou"].costMult42d) },

            style() {
                if (layers[this.layer].upgrades[this.id].pseudoUnl() && !hasUpgrade('dark', 44) && !layers[this.layer].upgrades[this.id].pseudoCan()) return { 'background-color': '#000000', 'border': '2px dashed white', 'color': 'white', 'cursor': 'not-allowed' };
            },
        },
    }
})

addLayer("kou", {
    name: "Red", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0,
            demile: [],
            decha: [],
            passed71: false,
        }
    },
    color: "#ffa0be",
    requires() { return new Decimal(1e30).times((player.kou.unlockOrder && !player.kou.unlocked) ? 15 : 1) }, // Can be a function that takes requirement increases into account
    resource: "Red Dolls", // Name of prestige currency
    baseResource: "Memories", // Name of resource prestige is based on
    baseAmount() { return player.mem.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["light"],
    base: 2,
    exponent() {
        let ex = new Decimal(1.5);
        return ex;
    },  // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);//不要忘了这里是static层
        if (hasMilestone('lethe', 5)) mult = mult.div(tmp.lethe.effect);
        if (hasAchievement('a', 35)) mult = mult.div(tmp.light.effect);
        if (hasUpgrade('lethe', 24)) mult = mult.div(upgradeEffect('lethe', 24)/*player.points.plus(1).log10().max(1).div(100).plus(1)*/);
        if (hasUpgrade('lethe', 23)) mult = mult.div(upgradeEffect('lethe', 23));
        if (hasMilestone('lab', 5)) mult = mult.div(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab', 93)) mult = mult.div(buyableEffect('lab', 31));
        if (hasMilestone('rei', 4)) mult = mult.div(tmp["rei"].challenges[11].effecttoRF);
        if (hasMilestone('ins', 1)) mult = mult.div(layers.ins.insEffect().Fra().Pos());
        if (inChallenge('kou', 62) || hasChallenge('kou', 62)) mult = mult.div(challengeEffect('kou', 62));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1);
        return exp;
    },
    directMult() {
        let dm = new Decimal(1);
        if (player.saya.unlocked && !inChallenge('kou', 61)) dm = dm.times(tmp.saya.effect);
        return dm;
    },

    effectBase: 1.5,

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].decha.length == 0) player[this.layer].decha = player[this.layer].challenges;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].decha.length != 0) { player[this.layer].challenges = player[this.layer].decha; player[this.layer].decha = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    update(diff) {
        if (!layers.kou.tabFormat["Happiness Challenges"].unlocked() && player.subtabs.kou.mainTabs == "Happiness Challenges") player.subtabs.kou.mainTabs = "Milestones";
        if (!layers.kou.tabFormat["Celebration Ends"].unlocked() && player.subtabs.kou.mainTabs == "Celebration Ends") player.subtabs.kou.mainTabs = "Milestones";
        if (player['awaken'].current == 'kou' && player.kou.auto == true) player.kou.auto = false;
        else if ((player['awaken'].current != 'kou' && player['awaken'].current != 'lethe') && hasUpgrade('lab', 164)) player.kou.auto = true;
    },

    effect() {
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff = new Decimal(player[this.layer].points.times(0.1).plus(1));
        if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) eff = new Decimal(player[this.layer].points.times(0.5).plus(1));
        if (inChallenge('kou', 22)) eff = eff.times(1 + Math.random() * 0.5);
        if (hasUpgrade('lethe', 15)) eff = eff.times(upgradeEffect('lethe', 15));
        if (hasUpgrade('lethe', 12)) eff = eff.times(upgradeEffect('lethe', 12));
        if (hasUpgrade('lethe', 45)) eff = eff.times(upgradeEffect('lethe', 45));
        if (challengeCompletions('saya', 31) && !layers['saya'].deactivated()) eff = eff.times(challengeEffect('saya', 31));
        if (hasUpgrade('lab', 164)) eff = eff.times(buyableEffect('lab', 31).div(10).max(1));
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) eff = eff.times(tmp["rei"].challenges[11].effectAWtoRF);

        //pow
        if (inChallenge('kou', 32)) eff = eff.pow(1 + Math.random() * 0.1);
        //if (hasChallenge('kou',32)) eff=eff.pow(1+((!hasMilestone('rei',2))?(Math.random()*0.05):0.05));
        if (hasChallenge('kou', 32)) eff = eff.pow(challengeEffect('kou', 32));
        if (inChallenge('saya', 31) || tmp['saya'].grid.ChallengeDepth[5]>-1) eff = eff.pow(layers.saya.challenges[31].debuff())
        if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toREff());

        //↓这个永远放在最后
        if (hasChallenge('kou', 22)) {
            if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) eff = eff.times(challengeEffect('kou', 22)/*(!hasMilestone('rei',2))?(Math.random()+1):2*/);
            else eff = eff.plus((!hasMilestone('rei', 2)) ? (Math.random() * 0.5) : 0.5);
        }

        //↑来自AW层的嘲讽
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);
        return eff;
    },
    effectDescription() {
        return "which are directly boosting Light Tachyons and Dark Matters gain by " + format(tmp.kou.effect) + "x"
    },
    canBuyMax() { return hasUpgrade('lab', 61) },
    autoPrestige() {
        if (layers['kou'].deactivated()) return false;
        return (hasUpgrade('lab', 71) && player.kou.auto)
    },
    resetsNothing() { return hasUpgrade('lab', 81) },

    row: 2, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
    hotkeys: [
        { key: "r", description: "R: Reset for Red dolls", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return hasAchievement('a', 21) },
    increaseUnlockOrder: ["lethe"],

    doReset(resettingLayer) {
        let keep = [];
        keep.push('passed71');
        if (hasUpgrade('lab', 71)) keep.push("auto");
        //if (hasMilestone('rei', 1)) keep.push("challenges");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("kou", keep);
            if (resettingLayer=='ins' && player.kou.passed71) player.kou.challenges[71] = 1;
            if (hasMilestone('rei', 0)) player.kou.milestones = player.kou.milestones.concat([0, 1, 2, 3, 4, 5, 6]);
            if (hasMilestone('rei', 1)) {
                player.kou.milestones.push(7);
                player.kou.challenges[11] = 1;
                player.kou.challenges[12] = 1;
                player.kou.challenges[21] = 1;
                player.kou.challenges[22] = 1;
                player.kou.challenges[31] = 1;
                player.kou.challenges[32] = 1;
                player.kou.challenges[41] = 1;
                player.kou.challenges[42] = 1;
                player.kou.challenges[51] = 1;
            }
            if (hasMilestone('fracture', 0)){
                player.kou.challenges[61] = 1;
                player.kou.challenges[62] = 1;
                player.kou.challenges[71] = 1;
                player.kou.challenges[72] = 1;
                player.kou.challenges[81] = 1;
                player.kou.challenges[82] = 1;
                player.kou.challenges[91] = 1;
                player.kou.challenges[92] = 1;
            };
            if (hasAchievement('a', 63)) player.kou.challenges[51] = 1;
        }
    },

    milestones: {
        0: {
            requirementDescription: "1 Red Doll",
            done() { return player.kou.best.gte(1) },
            unlocked() { return player.kou.unlocked },
            effectDescription: "Keep first two Milestones and More Brightness upgrades of Light Tachyon layer when R or F reset.",
        },
        1: {
            requirementDescription: "2 Red Dolls",
            done() { return player.kou.best.gte(2) },
            unlocked() { return player.kou.unlocked },
            effectDescription: "Keep first row upgrades of Light Tachyon layer when R or F reset.",
        },
        2: {
            requirementDescription: "3 Red Dolls",
            done() { return player.kou.best.gte(3) },
            unlocked() { return player.kou.unlocked },
            //effectDescription: "Directly Transfer no longer decreases your Fragments generation.",
            effectDescription() {
                let str = "Directly Transfer no longer decreases your Fragments generation.";
                if (player['awaken'].awakened.includes('light')) str += " (Currently useless.)";
                if (player['awaken'].awakened.includes('kou') || player['awaken'].current == 'kou') str = "Keep forth row upgrades of Light Tachyon layer when R or F reset.";
                return str;
            },
        },
        3: {
            requirementDescription: "10 Red Dolls",
            done() { return player.kou.best.gte(10) },
            unlocked() { return player.kou.unlocked },
            effectDescription: "Keep third row upgrades of Light Tachyon layer when R or F reset.",
        },
        4: {
            requirementDescription: "12 Red Dolls",
            done() { return player.kou.best.gte(12) },
            unlocked() { return player.kou.unlocked },
            effectDescription: "Keep second row upgrades of Light Tachyon layer when R or F reset.",
        },
        5: {
            requirementDescription: "13 Red Dolls",
            done() { return player.kou.best.gte(13) },
            unlocked() { return player.kou.unlocked },
            effectDescription: "Keep last two Milestones of Light Tachyon layer when R or F reset, and Red Dolls effect also boosts Forgotten Drops gain.",
        },
        6: {
            requirementDescription: "15 Red Dolls",
            done() { return player.kou.best.gte(15) },
            unlocked() { return player.kou.unlocked },
            effectDescription: "Light Tachyon layer resets nothing.",
        },
        7: {
            requirementDescription: "20 Red Dolls",
            done() { return player.kou.best.gte(20) },
            unlocked() { return hasMilestone('kou', 6) },
            effectDescription: "Unlock Happiness Challenges.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
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
        "Happiness Challenges": {
            unlocked() { return hasMilestone('kou', 7) && (player.saya.activeChallenge == null) && (player.saya.CurrentPairChallenge == null) },
            buttonStyle() { return { 'background-color': '#bd003c' } },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.mem.points) + ' Memories.' },
                    {}],
                "blank",/*"challenges"*/
                ["row", [["challenge", "11"], ["challenge", "12"]]],
                ["row", [["challenge", "21"], ["challenge", "22"]]],
                ["row", [["challenge", "31"], ["challenge", "32"]]],
                ["row", [["challenge", "41"], ["challenge", "42"]]],
                ["row", [["challenge", "51"]]],
            ]
        },
        "Celebration Ends": {
            unlocked() { return player['awaken'].awakened.includes('kou') && (player.saya.activeChallenge == null) && (player.saya.CurrentPairChallenge == null) },
            buttonStyle() { return { 'background-color': '#96002e' } },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.mem.points) + ' Memories.' },
                    {}],
                "blank",/*"challenges"*/
                ["row", [["challenge", "61"], ["challenge", "62"]]],
                ["row", [["challenge", "71"], ["challenge", "72"]]],
                ["row", [["challenge", "81"], ["challenge", "82"]]],
                ["row", [["challenge", "91"], ["challenge", "92"]]],
            ]
        },
    },
    upgrades: {
    },

    //42
    costMult42() {
        let mult = new Decimal(1);
        if (inChallenge("kou", 42)) mult = mult.times(Decimal.pow(10, Decimal.pow(player.mem.upgrades.length, 2)))
        return mult;
    },
    costExp42() {
        let exp = new Decimal(1);
        if (inChallenge("kou", 42)) exp = exp.times(Math.pow(player.mem.upgrades.length, 2) * 4 + 1)
        return exp;
    },
    costMult42l() {
        let mult = new Decimal(1);
        if (inChallenge("kou", 42)) mult = mult.times(player.light.upgrades.length * 3 + 1)
        return mult;
    },
    costMult42d() {
        let mult = new Decimal(1);
        if (inChallenge("kou", 42)) mult = mult.times(player.dark.upgrades.length * 3 + 1)
        return mult;
    },


    challenges: {
        cols: 2,
        11: {
            name: "Broken Toyhouse",
            completionLimit: 1,
            //challengeDescription: "Light Tachyons & Dark Matters gain x1.5, but with Fragments & Memories gain ^0.75.",
            unlocked() { return hasMilestone('kou', 7) },
            goal() {
                let gol = new Decimal(1e23);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal('1e545');
                return gol;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            rewardEffect() {
                let eff = player.points.plus(1).log10().plus(1).sqrt();
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) eff = player.points.plus(1).log10().plus(1);
                return eff;
            },
            fullDisplay() {
                let show = "Light Tachyons & Dark Matters gain x1.5, but with Fragments & Memories gain ^0.75.<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: Fragments will improve Light Tachyon & Dark Matter's effect."
                if (maxedChallenge('kou', this.id) && (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou'))) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            //currencyDisplayName: "Fragments",
            //currencyInternalName: "points",
            //rewardDescription: "Fragments will improve Light Tachyon & Dark Matter's effect.",
        },
        12: {
            name: "Cracking Softcap",
            completionLimit: 1,
            //challengeDescription: "Nothing can make your Memory softcap starts later, but Directgains in L,D and M which are not affected by softcap now x10.",
            unlocked() { return hasChallenge('kou', 11) },
            goal() {
                let gol = new Decimal(1e63);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal('5e1067');
                return gol;
            },
            onEnter() {
                player.mem.points = new Decimal('0');
            },
            onExit() {
                if (tmp["kou"].resetsNothing) { player.light.points = new Decimal(0); player.dark.points = new Decimal(0) };
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            rewardEffect() {
                let eff = new Decimal(100);
                eff = eff.times(layers['kou'].effect().max(1));
                return eff;
            },
            fullDisplay() {
                let show = "Nothing can make your Memory softcap starts later, but Directgains in L,D and M which are not affected by softcap now x10.<br>Goal: " + format(this.goal()) + " Memories<Br>Reward: Memory softcap starts x100 later and Red Dolls effect now also makes it starts later."
                if (maxedChallenge('kou', this.id) && (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou'))) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            currencyDisplayName: "Memories",
            currencyInternalName: "points",
            currencyLayer: "mem",
            //rewardDescription: "Memory softcap starts x100 later and Red Dolls effect now also makes it starts later.",
        },
        21: {
            name: "Naughty Bugs",
            completionLimit: 1,
            //challengeDescription: "Fragments gain^1.05, but L&D increases each other's requirement.",
            unlocked() { return hasChallenge('kou', 12) },
            goal() {
                let gol = new Decimal(5e54);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal('1e1140');
                return gol;
            },
            onEnter(){
                if (hasChallenge(this.layer,this.id))
                {
                    alert('You have already completed this challenge!')
                    player[this.layer].activeChallenge = null;
                    return;
                }
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            fullDisplay() {
                let show = "Fragments gain^1.05, but L&D increases each other's requirement.<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: Fragments gain^1.025."
                return show;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            //rewardDescription: "Fragments gain^1.025",
        },
        22: {
            name: "Random Effect",
            completionLimit: 1,
            //challengeDescription: "L&D's effects are randomized by ticks (x0~x1), but R&F's effects are also randomized by ticks (x1~x1.5)",
            unlocked() { return hasChallenge('kou', 21) },
            goal() {
                let gol = new Decimal(5e53);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal('1e1095');
                return gol;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            fullDisplay() {
                let show = "L&D's effects are randomized by ticks (x0~x1), but R&F's effects are also randomized by ticks (x1~x1.5).<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: ";
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) show += "Red Dolls effect times a random num(x1~x2).This num will not participate in other boosting calculations.";
                else show += "Red Dolls effect adds a random num(0~0.5).This num will not participate in other boosting calculations."
                if (maxedChallenge('kou', this.id) && hasMilestone('rei', 2) && (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou'))) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(Math.random() + 1);
                if (hasMilestone('rei', 2)) eff = new Decimal(2);
                return eff;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            //rewardDescription: "Red Dolls effect adds a random num(0~0.5).This num will not participate in other boosting calculations.",
        },
        31: {
            name: "The Balance of Conflict",
            completionLimit: 1,
            //challengeDescription: "When L or D is fallen behind by others, its own gain will be massively boosted, but another's gain x0.1.",
            unlocked() { return hasChallenge('kou', 22) },
            canComplete() {
                let gol = new Decimal(2200);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal(5e10);
                return player.light.points.plus(player.dark.points).gte(gol)
            },
            onEnter() {
                player.light.points = new Decimal('0');
                player.dark.points = new Decimal('0');
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            fullDisplay() {
                let show = "When L or D is fallen behind by others, its own gain will be massively boosted, but another's gain x0.1.<br>Goal: Have a total of " + ((player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) ? '5.0e10' : '2200') + " Light Tachyons&Dark Matters.<Br>Reward: When L or D is fall behind by others, its own gain will be boosted."
                if (maxedChallenge('kou', this.id) && (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou'))) show += "<br>Currently: Boost Light Tachyons gain by " + format(player.dark.points.sub(player.light.points).times(2).max(1)) + "x<br>Boost Dark Matters gain by " + format(player.light.points.sub(player.dark.points).times(2).max(1)) + "x";
                return show;
            },
            goalDescription: "Have a total of 2200 Light Tachyons&Dark Matters.",
            //rewardDescription: "When L or D is fall behind by others, its own gain will be boosted.",
        },
        32: {
            name: "Random^ Effect",
            completionLimit: 1,
            //challengeDescription: "L&D's effects are randomized by ticks (^0~^1), but R&F's effects are also randomized by ticks (^1~^1.1)",
            unlocked() { return hasChallenge('kou', 31) },
            //goal() { return new Decimal(2e53) },
            goal() {
                let gol = new Decimal(2e53);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal('1e1080');
                return gol;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            fullDisplay() {
                let show = "L&D's effects are randomized by ticks (^0~^1), but R&F's effects are also randomized by ticks (^1~^1.1).<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: R&F's effects are powered by a random num(1~1.05)."
                if (maxedChallenge('kou', this.id) && hasMilestone('rei', 2) && (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou'))) show += "<br>Currently: ^" + format(this.rewardEffect());
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(1 + Math.random() * 0.05);
                if (hasMilestone('rei', 2)) eff = new Decimal(1.05);
                return eff;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            //rewardDescription: "R&D's effects are powered by a random num(1~1.05).",
        },
        41: {
            name: "Uprising Tower",
            completionLimit: 1,
            //challengeDescription: "Forgotten Drops effect is boosted by Guiding Scythes Effect, but F layer will be hidden with all Guiding Beacons removed.",
            unlocked() { return hasChallenge('kou', 32) },
            goal() {
                let gol = new Decimal(2e48);
                if (player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou')) gol = new Decimal('1e1100');
                return gol;
            },
            onEnter() {
                player.lethe.upgrades = [];
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            fullDisplay() {
                let show = "Forgotten Drops effect is boosted by Guiding Scythes Effect, but F layer will be hidden with all Guiding Beacons removed.<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: Guiding Scythes Effect formula is better and it will effect Forgotten Drops gain."
                return show;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            //rewardDescription: "Guiding Scythes Effect formula is better and it will effect Forgotten Drops gain.",
        },
        42: {
            name: "The Desert of clay",
            completionLimit: 1,
            challengeDescription: "Force L,D,M reset regardless of your milestones, and their upgrade costs rise over upgrades you bought.But you gain x2 Light Tachyons&Dark Matters",
            unlocked() { return (hasChallenge('kou', 41) && tmp.lethe.nodeSlots == 17) || hasChallenge('kou', 42) },
            //goal() { return new Decimal(1e308) },
            onEnter() {
                doReset('light', true);
                doReset('dark', true);
                doReset('mem', true);
                player.mem.upgrades = [];
                if (hasAchievement('a', 21)) player.mem.upgrades.push(41);
                if (hasAchievement('a', 55)) player.mem.upgrades.push(42);
                player.dark.upgrades = [];
                player.light.upgrades = [];
            },
            canComplete() { return player.points.gte(5e20) && (player.light.upgrades.length + player.dark.upgrades.length >= 24) },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            //goalDescription: "5e20 Fragments with all L&D's upgrades purchased.",
            goalDescription() {
                let desc = "5e20 Fragments with all L&D's upgrades purchased.";
                if (player['awaken'].awakened.includes('light') || player['awaken'].awakened.includes('dark')) desc = "5e20 Fragments with more than 24 L&D's upgrades purchased.";
                return desc;
            },
            rewardDescription: "You can have more than 17 Guiding Beacons.",
        },
        51: {
            name: "Red Comet",
            completionLimit: 1,
            challengeDescription: "Enduring all Happiness Challenges above.",
            unlocked() { return hasChallenge('kou', 42) },
            countsAs: [11, 12, 21, 22, 31, 32, 41, 42],
            onEnter() {
                doReset('light', true);
                doReset('dark', true);
                doReset('mem', true);
                player.mem.upgrades = [];
                if (hasAchievement('a', 21)) player.mem.upgrades.push(41);
                if (hasAchievement('a', 55)) player.mem.upgrades.push(42);
                player.dark.upgrades = [];
                player.light.upgrades = [];
                player.lethe.upgrades = [];
            },
            goal() { return new Decimal(1e27) },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription: "You have no idea why you complete this challenge.",
        },

        //二阶段
        61: {
            name: "Sword Edge",
            completionLimit: 1,
            unlocked() { return player['awaken'].current == 'kou' || player['awaken'].awakened.includes('kou') },
            goal() {
                let gol = new Decimal("1e2500");
                return gol;
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.kou.points = new Decimal('0');
            },
            fullDisplay() {
                let show = "Everflashing Knives now boost Gemini Bounds' direct gain instead of R&F's.<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: Everflashing Knives now boost both Gemini bounds direct gain and G's effect."
                if (maxedChallenge('kou', this.id)) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(layers['saya'].effect());
                return eff;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
        },
        62: {
            name: "Step Down",
            completionLimit: 1,
            unlocked() { return hasChallenge('kou', 61) },
            goal() {
                let gol = new Decimal("1e1145");
                return gol;
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.kou.points = new Decimal('0');
            },
            fullDisplay() {
                let show = "The amount of World Steps now boosts K/G/R/F's gain, but itself is the generation speed of Fragments.<br>Goal: " + format(this.goal()) + " Memories<Br>Reward: The amount of World Steps now boosts K/G/R/F's gain."
                if (maxedChallenge('kou', this.id)) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(player.world.points);
                return eff;
            },
            currencyDisplayName: "Memories",
            currencyInternalName: "points",
            currencyLayer: "mem",
        },
        71: {
            name: "Happy Reality",
            completionLimit: 1,
            unlocked() { return hasChallenge('kou', 62)||hasChallenge('kou',71) },
            goal() {
                let gol = new Decimal("4e2444");
                return gol;
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
            },
            onComplete(){
                player.kou.passed71 = true;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.kou.points = new Decimal('0');
                player['ins'].resetTime = 0;
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
                //player.ins.upgrades = [];
                player.ins.points = player.ins.total.sub(player.ins.upgTotalCost);
            },
            fullDisplay() {
                let show = "The maxnum of Site level sets to 12, but all Sites' effects are taken logarithmically.<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: The maxnum of Site level sets to 12.<br>(Reset Institution Sites when exit)"
                return show;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
        },
        72: {
            name: "Crazy Lab",
            completionLimit: 1,
            unlocked() { return hasChallenge('kou', 71)&&hasChallenge('kou',62)  },
            goal() {
                let gol = new Decimal("1e205");
                return gol;
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);

                player.lab.points = new Decimal(1);
                player.lab.power = new Decimal(1);

                player.points = new Decimal(0);
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.kou.points = new Decimal('0');
            },
            fullDisplay() {
                let show = "Research Points' gain is boosted by 100x, but you lose 10% Research Power instead of 1% per second.<br>Goal: " + format(this.goal()) + " Research Power<Br>Reward: Research Points' gain is boosted by the number of Happiness Challenges and Celebration Ends challenges you have passed."
                if (maxedChallenge('kou', this.id)) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(0);
                if (hasChallenge('kou', 11)) eff = eff.plus(1);
                if (hasChallenge('kou', 12)) eff = eff.plus(1);
                if (hasChallenge('kou', 21)) eff = eff.plus(1);
                if (hasChallenge('kou', 22)) eff = eff.plus(1);
                if (hasChallenge('kou', 31)) eff = eff.plus(1);
                if (hasChallenge('kou', 32)) eff = eff.plus(1);
                if (hasChallenge('kou', 41)) eff = eff.plus(1);
                if (hasChallenge('kou', 42)) eff = eff.plus(1);
                if (hasChallenge('kou', 51)) eff = eff.plus(1);
                if (hasChallenge('kou', 61)) eff = eff.plus(1);
                if (hasChallenge('kou', 62)) eff = eff.plus(1);
                if (hasChallenge('kou', 71)) eff = eff.plus(1);
                if (hasChallenge('kou', 72)) eff = eff.plus(1);
                if (hasChallenge('kou', 81)) eff = eff.plus(1);
                if (hasChallenge('kou', 82)) eff = eff.plus(1);
                if (hasChallenge('kou', 91)) eff = eff.plus(1);
                if (hasChallenge('kou', 92)) eff = eff.plus(1);
                eff = eff.times(100);
                return eff;
            },
            currencyDisplayName: "Research Power",
            currencyInternalName: "power",
            currencyLayer: "lab",
        },
        81: {
            name: "Gods Concern",
            completionLimit: 1,
            unlocked() { return hasChallenge('kou', 72) },
            /*goal() {
                let gol = new Decimal("1e3000");
                return gol; 
            },*/
            canComplete() {
                let gol = new Decimal(player.etoluna.starPoint.plus(player.etoluna.moonPoint))
                return gol.gte("5e36")
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);

                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.etoluna.allotted = 0.5;

                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.etoluna.allotted = 0.5;
                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.kou.points = new Decimal('0');
            },
            fullDisplay() {
                let show = "The max speed of Star Points&Moon Points generation x10, but the speed at balance bars is zero and negative when below balance. <b>Spiritual Bounds</b> upgrade not working.<br>Goal: 5e36 Star Points&Moon Points in total.<Br>Reward: The max speed of Star Points&Moon Points generation x10."
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(layers['saya'].effect());
                return eff;
            },
        },
        82: {
            name: "Hyper Forgotten",
            completionLimit: 1,
            unlocked() { return (hasChallenge('kou', 81)&&tmp.lethe.HyperBeaconLength>=16)||inChallenge('kou',82) },
            goal() {
                let gol = new Decimal("1e1875");
                return gol; 
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.lethe.buyables[21] = new Decimal(0);

                player.lethe.upgrades = [];
                let ChallengeRandomUpgs=[];
                let UnRandomable=['72','73','74','82','83','84','92','93','94'];
                let current="";
                while(ChallengeRandomUpgs.length<3){
                    current=(Math.floor(Math.random()*5+1)).toString()+(Math.floor(Math.random()*5+1)).toString()
                    if(!ChallengeRandomUpgs.includes(current)) ChallengeRandomUpgs=ChallengeRandomUpgs.concat(current);
                }
                
                while(ChallengeRandomUpgs.length<6){
                    current=(Math.floor(Math.random()*5+6)).toString()+(Math.floor(Math.random()*5+1)).toString()
                    if((!ChallengeRandomUpgs.includes(current))&&(!UnRandomable.includes(current))) ChallengeRandomUpgs=ChallengeRandomUpgs.concat(current);
                }
                player.lethe.upgrades = ChallengeRandomUpgs;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.etoluna.allotted = 0.5;
                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.kou.points = new Decimal('0');

                player.lethe.upgrades = ['11','12','13','14','15','21','22','23','24','25','31','32','33','34','35','41','42','43','44','45','51','52','53','54','55','61','62','63','64','65','71','75','81','85','91','95','101','102','103','104','105'];
                player.lethe.buyables[11] = new Decimal(25);
                player.lethe.buyables[21] = new Decimal(16);
            },
            fullDisplay() {
                let show = "You have 3 random Beacons and 3 random outer Hyper Beacons. Removing and buying them is not allowed.<br>Goal: " + format(this.goal()) + " Fragments<Br>Reward: You can have more than 16 Hyper Guilding Beacons."
                return show;
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
        },
        91: {
            name: "Flowers Scattered",
            completionLimit: 1,
            countsAs: [61, 62, 71, 72, 81, 82],
            unlocked() { return (hasChallenge('kou', 82)&&tmp.lethe.HyperBeaconLength>=16)||inChallenge('kou',91) },
            goal() {
                let gol = new Decimal("1e737");
                return gol; 
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.lethe.buyables[21] = new Decimal(0);
                
                //Rc14
                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.etoluna.allotted = 0.5;

                //Rc15
                player.lethe.upgrades = [];
                let ChallengeRandomUpgs=[];
                let UnRandomable=['72','73','74','82','83','84','92','93','94'];
                let current="";
                while(ChallengeRandomUpgs.length<3){
                    current=(Math.floor(Math.random()*5+1)).toString()+(Math.floor(Math.random()*5+1)).toString()
                    if(!ChallengeRandomUpgs.includes(current)) ChallengeRandomUpgs=ChallengeRandomUpgs.concat(current);
                }
                
                while(ChallengeRandomUpgs.length<6){
                    current=(Math.floor(Math.random()*5+6)).toString()+(Math.floor(Math.random()*5+1)).toString()
                    if((!ChallengeRandomUpgs.includes(current))&&(!UnRandomable.includes(current))) ChallengeRandomUpgs=ChallengeRandomUpgs.concat(current);
                }
                player.lethe.upgrades = ChallengeRandomUpgs;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.etoluna.allotted = 0.5;
                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.kou.points = new Decimal('0');

                //Rc13
                player.lab.points = new Decimal(1);
                player.lab.power = new Decimal(1);

                //Rc15
                player.lethe.upgrades = ['11','12','13','14','15','21','22','23','24','25','31','32','33','34','35','41','42','43','44','45','51','52','53','54','55','61','62','63','64','65','71','75','81','85','91','95','101','102','103','104','105'];
                player.lethe.buyables[11] = new Decimal(25);
                player.lethe.buyables[21] = new Decimal(16);
            },
            fullDisplay() {
                let show = "Enduring all Celebration Ends challenges above.<br>Goal: " + format(this.goal()) + " Memories<Br>Reward: G&K's effects are boosted by the number of Happiness Challenges and Celebration Ends challenges you have passed."
                if (maxedChallenge('kou', this.id)) show += "<br>Currently: " + format(this.rewardEffect()) + "x";
                return show;
            },
            rewardEffect() {
                let eff = new Decimal(0);
                if (hasChallenge('kou', 11)) eff = eff.plus(1);
                if (hasChallenge('kou', 12)) eff = eff.plus(1);
                if (hasChallenge('kou', 21)) eff = eff.plus(1);
                if (hasChallenge('kou', 22)) eff = eff.plus(1);
                if (hasChallenge('kou', 31)) eff = eff.plus(1);
                if (hasChallenge('kou', 32)) eff = eff.plus(1);
                if (hasChallenge('kou', 41)) eff = eff.plus(1);
                if (hasChallenge('kou', 42)) eff = eff.plus(1);
                if (hasChallenge('kou', 51)) eff = eff.plus(1);
                if (hasChallenge('kou', 61)) eff = eff.plus(1);
                if (hasChallenge('kou', 62)) eff = eff.plus(1);
                if (hasChallenge('kou', 71)) eff = eff.plus(1);
                if (hasChallenge('kou', 72)) eff = eff.plus(1);
                if (hasChallenge('kou', 81)) eff = eff.plus(1);
                if (hasChallenge('kou', 82)) eff = eff.plus(1);
                if (hasChallenge('kou', 91)) eff = eff.plus(1);
                if (hasChallenge('kou', 92)) eff = eff.plus(1);
                eff = eff.div(4);
                return eff;
            },
            currencyDisplayName: "Memories",
            currencyInternalName: "points",
            currencyLayer: "mem",
        },
        92: {
            name: "Celebration Ends",
            completionLimit: 1,
            countsAs: [11,12,22,31,32,41,42,61, 62, 71, 72, 81],
            unlocked() { return (hasChallenge('kou', 91)&&tmp.lethe.HyperBeaconLength>=16)||inChallenge('kou',92) },
            goal() {
                let gol = new Decimal("5e375");
                return gol; 
            },
            onEnter() {
                player.saya.points = new Decimal(0);
                player.etoluna.points = new Decimal(0);
                player.kou.points = new Decimal(0);
                player.lethe.points = new Decimal(0);
                player.light.points = new Decimal(0);
                player.dark.points = new Decimal(0);
                player.rei.points = new Decimal(0);
                player.yugamu.points = new Decimal(0);
                player.mem.points = new Decimal(0);
                player.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.lethe.buyables[21] = new Decimal(0);

                player.light.upgrades = [];
                player.dark.upgrades = [];
                player.mem.upgrades = [];
                
                //Rc14
                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.etoluna.allotted = 0.5;

                //Rc15
                player.lethe.upgrades = [];
                let ChallengeRandomUpgs=[];
                let UnRandomable=['72','73','74','82','83','84','92','93','94'];
                let current="";
                while(ChallengeRandomUpgs.length<3){
                    current=(Math.floor(Math.random()*5+1)).toString()+(Math.floor(Math.random()*5+1)).toString()
                    if(!ChallengeRandomUpgs.includes(current)) ChallengeRandomUpgs=ChallengeRandomUpgs.concat(current);
                }
                
                while(ChallengeRandomUpgs.length<6){
                    current=(Math.floor(Math.random()*5+6)).toString()+(Math.floor(Math.random()*5+1)).toString()
                    if((!ChallengeRandomUpgs.includes(current))&&(!UnRandomable.includes(current))) ChallengeRandomUpgs=ChallengeRandomUpgs.concat(current);
                }
                player.lethe.upgrades = ChallengeRandomUpgs;
            },
            onExit() {
                player.points = new Decimal(0);
                doReset("lethe", true);
                if (tmp.tempest.layerShown) layerDataReset('yugamu',['auto','milestones']);
                player.lethe.points = new Decimal(0);
                player.lethe.buyables[11] = new Decimal(0);
                player.saya.points = new Decimal('0');
                player.etoluna.points = new Decimal('0');
                player.etoluna.allotted = 0.5;
                player.etoluna.starPoint = new Decimal(0);
                player.etoluna.moonPoint = new Decimal(0);
                player.kou.points = new Decimal('0');

                //Rc13
                player.lab.points = new Decimal(1);
                player.lab.power = new Decimal(1);

                //Rc15
                player.lethe.upgrades = ['11','12','13','14','15','21','22','23','24','25','31','32','33','34','35','41','42','43','44','45','51','52','53','54','55','61','62','63','64','65','71','75','81','85','91','95','101','102','103','104','105'];
                player.lethe.buyables[11] = new Decimal(25);
                player.lethe.buyables[21] = new Decimal(16);
            },
            fullDisplay() {
                let show = "Enduring all Happiness Challenges and Celebration Ends challenges above<br>(Except the 3rd, the 15th and the 16th).<br>Goal: " + format(this.goal()) + " Memories<Br>Reward: Hyper Scythes now boost G&K's gain and its base effect becomes better."
                return show;
            },
            currencyDisplayName: "Memories",
            currencyInternalName: "points",
            currencyLayer: "mem",
        },
    },
})

addLayer("lethe", {
    name: "Forgotten", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0,
            nodeSlots: 0,//Yes, this can be reseted
            HypernodeSlots: 0,//Yes, this can be reseted (convinced)
            demile: [],
            deupg: [],
        }
    },
    color: "#fee85d",
    requires() { return new Decimal(2e20).times((player.lethe.unlockOrder && !player.lethe.unlocked) ? 5e4 : 1) }, // Can be a function that takes requirement increases into account
    resource: "Forgotten Drops", // Name of prestige currency
    baseResource: "Fragments", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["dark"],
    exponent() {
        let ex = new Decimal(0.6);
        return ex;
    },  // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasMilestone('kou', 5)) mult = mult.times(tmp.kou.effect);
        if (hasAchievement('a', 35)) mult = mult.times(tmp.dark.effect);
        //if (hasUpgrade('lethe',42)) mult = mult.times(player.mem.points.plus(1).log10().max(1));
        if (hasUpgrade('lethe', 42)) mult = mult.times(upgradeEffect('lethe', 42));
        if (hasChallenge('kou', 41)) mult = mult.times(tmp.lethe.buyables[11].effect);
        if (hasMilestone('lab', 6)) mult = mult.times(player.lab.power.div(10).max(1));
        if (hasUpgrade('lab', 94)) mult = mult.times(buyableEffect('lab', 32));
        if (hasMilestone('rei', 4)) mult = mult.times(tmp["rei"].challenges[11].effecttoRF);
        if (hasMilestone('ins', 1)) mult = mult.times(layers.ins.insEffect().Deu().Pos());
        if (inChallenge('kou', 62) || hasChallenge('kou', 62)) mult = mult.times(challengeEffect('kou', 62));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1);
        return exp;
    },
    directMult() {
        let dm = new Decimal(1);
        if (player.saya.unlocked && !inChallenge('kou', 61)) dm = dm.times(tmp.saya.effect);
        return dm;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
    increaseUnlockOrder: ["kou"],

    passiveGeneration() {
        if (layers['lethe'].deactivated() || player['awaken'].current == this.layer) return 0;
        let pg = 0;
        if (hasUpgrade('lab', 62)) pg = pg + 0.1;
        return pg;
    },

    update(diff) {
        if (layers.lethe.buyables[11].autoed() && player.lethe.points.gt(layers['lethe'].buyables[11].cost().fo)) layers.lethe.buyables[11].buy();
        if (layers.lethe.buyables[21].autoed() && player.lethe.points.gt(layers['lethe'].buyables[21].cost().fo)) layers.lethe.buyables[21].buy();
        if (isNaN(player.lethe.points.toNumber()) || player.lethe.points.lte(0)) player.lethe.points = new Decimal(0);
    },

    doReset(resettingLayer) {
        let tempupgrades = player[this.layer].upgrades;
        let keep = [];
        if (layers[resettingLayer].row > this.row) {
            layerDataReset("lethe", keep);
            if (hasMilestone('yugamu', 0)) player.lethe.milestones = player.lethe.milestones.concat([0, 1, 2, 3, 4, 5, 6]);
            if (hasMilestone('yugamu', 1)) player.lethe.milestones.push(7);
            //keep upgrades
            if (hasUpgrade('lab', 72)) {
                let auto = [11, 15, 51, 55];
                if (hasUpgrade('lab', 82)) auto = auto.concat([13, 31, 35, 53]);
                if (hasUpgrade('lab', 92)) auto = auto.concat([12, 14, 21, 25, 41, 45, 52, 54]);
                if (hasMilestone('yugamu', 2)) auto = auto.concat([22, 23, 24, 32, 33, 34, 42, 43, 44]);
                for (var i = 0; i < auto.length; i++) {
                    if (!hasUpgrade('lethe', auto[i])) player.lethe.upgrades.push(auto[i]);
                }
            };
            if (hasMilestone('tempest',0))
            {
                let auto = [61,62,63,64,65,71,72,73,74,75,81,82,83,84,85,91,92,93,94,95,101,102,103,104,105]
                for (index in auto)
                if (!hasUpgrade('lethe', auto[index])) player.lethe.upgrades.push(auto[index]);
            }
            if (inChallenge('saya', 32) || tmp['saya'].grid.ChallengeDepth[6]>-1) player[this.layer].upgrades = tempupgrades;
        }
    },

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].deupg.length == 0) player[this.layer].deupg = player[this.layer].upgrades;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].deupg.length != 0) { player[this.layer].upgrades = player[this.layer].deupg; player[this.layer].deupg = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    BeaconLength() {
        let len = 0;
        if (hasUpgrade('lethe', 11)) len = len + 1;
        if (hasUpgrade('lethe', 12)) len = len + 1;
        if (hasUpgrade('lethe', 13)) len = len + 1;
        if (hasUpgrade('lethe', 14)) len = len + 1;
        if (hasUpgrade('lethe', 15)) len = len + 1;
        if (hasUpgrade('lethe', 21)) len = len + 1;
        if (hasUpgrade('lethe', 22)) len = len + 1;
        if (hasUpgrade('lethe', 23)) len = len + 1;
        if (hasUpgrade('lethe', 24)) len = len + 1;
        if (hasUpgrade('lethe', 25)) len = len + 1;
        if (hasUpgrade('lethe', 31)) len = len + 1;
        if (hasUpgrade('lethe', 32)) len = len + 1;
        if (hasUpgrade('lethe', 33)) len = len + 1;
        if (hasUpgrade('lethe', 34)) len = len + 1;
        if (hasUpgrade('lethe', 35)) len = len + 1;
        if (hasUpgrade('lethe', 41)) len = len + 1;
        if (hasUpgrade('lethe', 42)) len = len + 1;
        if (hasUpgrade('lethe', 43)) len = len + 1;
        if (hasUpgrade('lethe', 44)) len = len + 1;
        if (hasUpgrade('lethe', 45)) len = len + 1;
        if (hasUpgrade('lethe', 51)) len = len + 1;
        if (hasUpgrade('lethe', 52)) len = len + 1;
        if (hasUpgrade('lethe', 53)) len = len + 1;
        if (hasUpgrade('lethe', 54)) len = len + 1;
        if (hasUpgrade('lethe', 55)) len = len + 1;

        return len;
    },

    HyperBeaconLength() {
        let len = 0;
        if (hasUpgrade('lethe', 61)) len = len + 1;
        if (hasUpgrade('lethe', 62)) len = len + 1;
        if (hasUpgrade('lethe', 63)) len = len + 1;
        if (hasUpgrade('lethe', 64)) len = len + 1;
        if (hasUpgrade('lethe', 65)) len = len + 1;
        if (hasUpgrade('lethe', 71)) len = len + 1;
        if (hasUpgrade('lethe', 72)) len = len + 1;
        if (hasUpgrade('lethe', 73)) len = len + 1;
        if (hasUpgrade('lethe', 74)) len = len + 1;
        if (hasUpgrade('lethe', 75)) len = len + 1;
        if (hasUpgrade('lethe', 81)) len = len + 1;
        if (hasUpgrade('lethe', 82)) len = len + 1;
        if (hasUpgrade('lethe', 83)) len = len + 1;
        if (hasUpgrade('lethe', 84)) len = len + 1;
        if (hasUpgrade('lethe', 85)) len = len + 1;
        if (hasUpgrade('lethe', 91)) len = len + 1;
        if (hasUpgrade('lethe', 92)) len = len + 1;
        if (hasUpgrade('lethe', 93)) len = len + 1;
        if (hasUpgrade('lethe', 94)) len = len + 1;
        if (hasUpgrade('lethe', 95)) len = len + 1;
        if (hasUpgrade('lethe', 101)) len = len + 1;
        if (hasUpgrade('lethe', 102)) len = len + 1;
        if (hasUpgrade('lethe', 103)) len = len + 1;
        if (hasUpgrade('lethe', 104)) len = len + 1;
        if (hasUpgrade('lethe', 105)) len = len + 1;

        return len;
    },

    milestones: {
        0: {
            requirementDescription: "1 Forgotten Drop",
            done() { return player.lethe.best.gte(1) },
            unlocked() { return player.lethe.unlocked },
            effectDescription: "Keep first two Milestones and More Darkness upgrades of Dark Matter layer when R or F reset.",
        },
        1: {
            requirementDescription: "10 Forgotten Drops",
            done() { return player.lethe.best.gte(10) },
            unlocked() { return player.lethe.unlocked },
            effectDescription: "Keep first row upgrades of Dark Matter layer when R or F reset.",
        },
        2: {
            requirementDescription: "35 Forgotten Drops",
            done() { return player.lethe.best.gte(35) },
            unlocked() { return player.lethe.unlocked },
            //effectDescription: "Force Operation no longer needs Seeking Delight to unlock.",
            effectDescription() {
                let str = "Force Operation no longer needs Seeking Delight to unlock.";
                if (player['awaken'].awakened.includes('dark')) str += " (Currently useless.)"
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) str = "Keep forth row upgrades of Dark Matter layer when R or F reset."
                return str;
            },
        },
        3: {
            requirementDescription: "5,000 Forgotten Drops",
            done() { return player.lethe.best.gte(5000) },
            unlocked() { return player.lethe.unlocked },
            effectDescription: "Keep third row upgrades of Dark Matter layer when R or F reset.",
        },
        4: {
            requirementDescription: "1,000,000 Forgotten Drops",
            done() { return player.lethe.best.gte(1000000) },
            unlocked() { return player.lethe.unlocked },
            effectDescription: "Keep second row upgrades of Dark Matter layer when R or F reset.",
        },
        5: {
            requirementDescription: "20,000,000 Forgotten Drops",
            done() { return player.lethe.best.gte(20000000) },
            unlocked() { return player.lethe.unlocked },
            effectDescription: "Keep last two Milestones of Dark Matter layer when R or F reset, and Forgotten Drops effect also boosts Red Dolls gain.",
        },
        6: {
            requirementDescription: "50,000,000 Forgotten Drops",
            done() { return player.lethe.best.gte(50000000) },
            unlocked() { return player.lethe.unlocked },
            effectDescription: "Dark Matter layer resets nothing.",
        },
        7: {
            requirementDescription: "1e11 Forgotten Drops",
            done() { return player.lethe.best.gte(1e11) },
            unlocked() { return hasMilestone('lethe', 6) },
            effectDescription: "Unlock Scythes.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },


    buyables: {
        rows: 1,
        cols: 2,
        11: {
            title: "Guiding Scythes",
            cost(x = player[this.layer].buyables[this.id]) {
                return {
                    fo: new Decimal(1e11).times(Decimal.pow(1000, x)),
                };
            },
            effect() {
                let effbase = 2;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) effbase = 2.5;
                if (hasChallenge('kou', 41)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) effbase = 5;
                    else effbase = 4;
                }
                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);
                return Decimal.pow(effbase, new Decimal(player[this.layer].buyables[this.id]))
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let amt = player[this.layer].buyables[this.id];
                let display = formatWhole(player.lethe.points) + " / " + formatWhole(cost.fo) + " Forgotten Drops" + "<br><br>Level: " + formatWhole(amt) + "<br><br>Reward: Fragments generation" + ((hasChallenge('kou', 41)) ? "&Forgotten Drops gain" : "") + " is boosted by " + formatWhole(data.effect) + "x<br>And you can have " + formatWhole(tmp.lethe.nodeSlots) + " Beacons at most.";
                return display;
            },
            unlocked() { return hasMilestone('lethe', 7) },
            canAfford() {
                if (!tmp[this.layer].buyables[this.id].unlocked) return false;
                let cost = layers[this.layer].buyables[this.id].cost();
                return player[this.layer].unlocked && player.lethe.points.gt(cost.fo) && !this.autoed();
            },
            buy() {
                let cost = layers[this.layer].buyables[this.id].cost();
                player.lethe.points = player.lethe.points.sub(cost.fo);
                player.lethe.buyables[this.id] = player.lethe.buyables[this.id].plus(1);
            },
            style: { 'height': '200px', 'width': '200px' },
            autoed() { return hasMilestone('yugamu', 1) },
        },

        21: {
            title: "Hyper Guilding Scythes",
            cost(x = player[this.layer].buyables[this.id]) {
                return {
                    fo: new Decimal("1e2450").times(Decimal.pow(1e50, x)),
                };
            },
            effect() {
                let effbase = 10;
                if (hasChallenge('kou', 92)) effbase = 15;
                let tempesteff = (player.tempest.grid[202].activated)?gridEffect('tempest',202):new Decimal(0)
                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);
                return Decimal.pow(effbase, new Decimal(player[this.layer].buyables[this.id]).plus(tempesteff))
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let amt = player[this.layer].buyables[this.id];
                let display = formatWhole(player.lethe.points) + " / " + formatWhole(cost.fo) + " Forgotten Drops" + "<br><br>Level: " + formatWhole(amt) +((player.tempest.grid[202].activated)?(" + "+formatWhole(gridEffect('tempest',202))):"") + "<br><br>Reward: Memories"+(hasChallenge('kou',92)?", G&K's":"")+" generation is boosted by " + formatWhole(data.effect) + "x<br>And you can have " + formatWhole(tmp.lethe.HypernodeSlots) + " Hyper Beacons at most.";
                return display;
            },
            unlocked() { return player['awaken'].awakened.includes('lethe') },
            canAfford() {
                if (!tmp[this.layer].buyables[this.id].unlocked) return false;
                let cost = layers[this.layer].buyables[this.id].cost();
                return player[this.layer].unlocked && player.lethe.points.gt(cost.fo) && !this.autoed();
            },
            buy() {
                let cost = layers[this.layer].buyables[this.id].cost();
                player.lethe.points = player.lethe.points.sub(cost.fo);
                player.lethe.buyables[this.id] = player.lethe.buyables[this.id].plus(1);
            },
            style: { 'height': '200px', 'width': '200px' },
            autoed() { return hasMilestone('tempest',1)},
        },
    },
    clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "Remove all Guiding Beacons",
            display: "",
            unlocked() { return player.lethe.unlocked && !inChallenge('kou',82) },
            canClick() { return player.lethe.unlocked && layers['lethe'].BeaconLength() > 0 },
            onClick() {
                let del = ["11", "12", "13", "14", "15", "21", "22", "23", "24", "25", "31", "32", "33", "34", "35", "41", "42", "43", "44", "45", "51", "52", "53", "54", "55"];
                if (!confirm("Are you sure you want to remove all Beacons? This will force an Forgotten reset!")) return;
                //player.lethe.upgrades = [];
                let kep = player.lethe.upgrades.filter((x) => !del.some((item) => x == item));
                doReset("lethe", true);
                player.lethe.upgrades = kep;
            },
            style: { width: "150px", height: "50px" },
        },

        21: {
            title: "Remove all Hyper Guilding Beacons",
            display: "",
            unlocked() { return player.lethe.unlocked && !inChallenge('kou',82) },
            canClick() { return player.lethe.unlocked && layers['lethe'].HyperBeaconLength() > 0 },
            onClick() {
                let del = ["61", "62", "63", "64", "65", "71", "72", "73", "74", "75", "81", "82", "83", "84", "85", "91", "92", "93", "94", "95", "101", "102", "103", "104", "105"];
                if (!confirm("Are you sure you want to remove all Hyper Beacons? This will force an Forgotten reset!")) return;
                //player.lethe.upgrades = [];
                let kep = player.lethe.upgrades.filter((x) => !del.some((item) => x == item));
                doReset("lethe", true);
                player.lethe.upgrades = kep;
            },
            style: { width: "150px", height: "50px" },
        },
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
        "Scythes": {
            unlocked() { return hasMilestone('lethe', 7) },
            buttonStyle() { return { 'background-color': '#d2ba46', color: "black" } },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["buyable", 11],
                "blank",
                ["clickable", 11],
                "blank",
                ["display-text", function () { return "Beacons: " + formatWhole(layers['lethe'].BeaconLength()) + " / " + formatWhole(tmp.lethe.nodeSlots) }], "blank",
                /*"upgrades",*/
                ["row", [["upgrade", "11"], ["upgrade", "12"], ["upgrade", "13"], ["upgrade", "14"], ["upgrade", "15"],]],
                ["row", [["upgrade", "21"], ["upgrade", "22"], ["upgrade", "23"], ["upgrade", "24"], ["upgrade", "25"],]],
                ["row", [["upgrade", "31"], ["upgrade", "32"], ["upgrade", "33"], ["upgrade", "34"], ["upgrade", "35"],]],
                ["row", [["upgrade", "41"], ["upgrade", "42"], ["upgrade", "43"], ["upgrade", "44"], ["upgrade", "45"],]],
                ["row", [["upgrade", "51"], ["upgrade", "52"], ["upgrade", "53"], ["upgrade", "54"], ["upgrade", "55"],]],
            ]
        },

        "Hyper Scythes": {
            unlocked() { return player['awaken'].awakened.includes('lethe') },
            buttonStyle() { return { 'background-color': '#b49d2c', color: "black" } },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["buyable", 21],
                "blank",
                ["clickable", 21],
                "blank",
                ["display-text", function () { return "Hyper Beacons: " + formatWhole(layers['lethe'].HyperBeaconLength()) + " / " + formatWhole(tmp.lethe.HypernodeSlots) + "<br>When you can't buy the next Hyper Beacon you want, you could do a Gemini Reset." }], "blank",
                /*"upgrades",*/
                ["row", [["upgrade", "61"], ["upgrade", "62"], ["upgrade", "63"], ["upgrade", "64"], ["upgrade", "65"],]],
                ["row", [["upgrade", "71"], ["upgrade", "72"], ["upgrade", "73"], ["upgrade", "74"], ["upgrade", "75"],]],
                ["row", [["upgrade", "81"], ["upgrade", "82"], ["upgrade", "83"], ["upgrade", "84"], ["upgrade", "85"],]],
                ["row", [["upgrade", "91"], ["upgrade", "92"], ["upgrade", "93"], ["upgrade", "94"], ["upgrade", "95"],]],
                ["row", [["upgrade", "101"], ["upgrade", "102"], ["upgrade", "103"], ["upgrade", "104"], ["upgrade", "105"],]],
            ]
        },
    },

    hotkeys: [
        { key: "f", description: "F: Reset for Forgotten Drops", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return hasAchievement('a', 21) && !inChallenge('kou', 41) },

    effectBase() {
        let base = new Decimal(1.5);
        return base;
    },
    effect() {
        if (player[this.layer].points.lte(0)) return new Decimal(1);
        let eff = player[this.layer].points.plus(1).pow(2).log10().plus(1);
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = new Decimal(player[this.layer].points.plus(1).pow(3.25).log10().plus(1));
        if (inChallenge('kou', 22)) eff = eff.times(1 + Math.random() * 0.5);
        if (hasUpgrade('lethe', 51)) eff = eff.times(upgradeEffect('lethe', 51));
        if (inChallenge('kou', 41)) eff = eff.times(buyableEffect('lethe', 11));
        if (hasAchievement('kou', 45)) eff = eff.times(player[this.layer].buyables[11].div(2).max(1));
        if (hasUpgrade('lethe', 54)) eff = eff.times(upgradeEffect('lethe', 54));
        if (hasUpgrade('lethe', 21)) eff = eff.times(upgradeEffect('lethe', 21));
        if (hasUpgrade('lab', 164)) eff = eff.times(buyableEffect('lab', 32).div(10).max(1));
        if (hasUpgrade('dark', 42)) eff = eff.times(upgradeEffect('dark', 42));
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) eff = eff.times(tmp["rei"].challenges[11].effectAWtoRF);

        //pow
        if (inChallenge('kou', 32)) eff = eff.pow(1 + Math.random() * 0.1);
        //if (hasChallenge('kou',32)) eff=eff.pow(1+((!hasMilestone('rei',2))?(Math.random()*0.05):0.05));
        if (hasChallenge('kou', 32)) eff = eff.pow(challengeEffect('kou', 32));
        if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toFEff());

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

        return eff;
    },
    effectDescription() {
        return "which are directly boosting Fragments generation and Memories gain by " + format(tmp.lethe.effect) + "x"
    },

    nodeSlots() {
        if (inChallenge('kou',82)) return 3;
        let node = player.lethe.buyables[11].floor().min(hasChallenge('kou', 42) ? 25 : 17);
        if (inChallenge('saya', 32) || tmp['saya'].grid.ChallengeDepth[6]>-1) node = node.min(layers.saya.challenges[32].debuff());
        return node.toNumber()
    },
    HypernodeSlots() {
        if (inChallenge('kou',82)) return 3;
        let node = player.lethe.buyables[21].floor().min(hasChallenge('kou', 82) ? 25 : 16);
        if (inChallenge('saya', 32) || tmp['saya'].grid.ChallengeDepth[6]>-1) node = node.min(layers.saya.challenges[32].debuff());
        return node.toNumber()
    },

    upgrades: {
        rows: 5,
        cols: 10,
        11: {
            title() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22)) ? "L" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 1500;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 50000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.light.points = player.light.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22))?("<b>White Beacon</b><br>Light Tachyons gain is boosted by Achievements.<br><br>Cost: "+(inChallenge('kou',12)?"15,000 Light Tachyons":"1,500 Light Tachyons")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>White Beacon</b><br>Light Tachyons gain is boosted by Achievements."
                if (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 11)) + "x<br><br>Cost: " + (inChallenge('kou', 21) ? "500,000" : "50,000") + " Light Tachyons";
                    else show += "<br><br>Cost: " + (inChallenge('kou', 21) ? "15,000" : "1,500") + " Light Tachyons";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 1500;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 50000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22));
                let price = player.light.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = player.a.achievements.length / 2;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.a.achievements.length;
                if (eff < 1) return 1;
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        12: {
            title() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23)) ? "LLR" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 5500;
                if (inChallenge('kou', 12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23))?("<b>Delightful-Red Synergy</b><br>Light Tachyons itself boosts Red Dolls effect.<br><br>Cost: "+(inChallenge('kou',12)?"55,000 Light Tachyons":"5,500 Light Tachyons")+"<br>Req: 12.50x Red Dolls effect"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Delightful-Red Synergy</b><br>Light Tachyons itself boosts Red Dolls effect."
                if (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 12)) + "x";
                    show += "<br><br>Cost: " + (inChallenge('kou', 21) ? "55,000" : "5,500") + " Light Tachyons<br>Req: 12.50x Red Dolls effect";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 5500;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23));
                let price = player.light.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && tmp['kou'].effect.gte(12.5);
            },
            effect() {
                let eff = player.light.points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.light.points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        13: {
            title() { return (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24)) ? "LR" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 3250;
                if (inChallenge('kou', 12)) price = price * 10;
                player.light.points = player.light.points.sub(price);
                player.kou.points = player.kou.points.sub(40);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24))?("<b>The Tower of Light</b><br>Red Dolls effects Light Tachyons effect at an increased rate.<br><br>Cost: 40 Red Dolls<br>"+(inChallenge('kou',12)?"32,500 Light Tachyons":"3,250 Light Tachyons")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>The Tower of Light</b><br>Red Dolls effects Light Tachyons effect at an increased rate."
                if (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 13)) + "x";
                    show += "<br><br>Cost: 40 Red Dolls " + (inChallenge('kou', 21) ? "32,500" : "3,250") + " Light Tachyons";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 3250;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24));
                let price = player.light.points.gte(pricenum) && player.kou.points.gte(40);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(40).times(achievementEffect('a', 42))).floor();
            },
            effect() {
                let eff = layers['kou'].effect().pow(1.5);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        14: {
            title() { return (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25)) ? "LRR" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25)) ? "Currently Nothing here." : "" },
            pay() {
                player.kou.points = player.kou.points.sub(50);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25))?("<b>Joyful-White Synergy</b><br>Red Dolls itself boosts Light Tachyons effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 50 Red Dolls<br>Req: 2.5e11x Light Tachyons effect")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Joyful-White Synergy</b><br>Red Dolls itself boosts Light Tachyons effect."
                if (inChallenge('kou', 12)) {
                    show += "<br><br><b>Unpurchaseable.</b>"
                    return show;
                }
                if (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 14)) + "x";
                    show += "<br><br>Cost: 50 Red Dolls<br>Req: 2.5e11x Light Tachyons effect";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25));
                let price = player.kou.points.gte(50);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && !inChallenge('kou', 12) && tmp['light'].effect.gte(2.5e11);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(50).times(achievementEffect('a', 42))).floor();
            },
            effect() {
                let eff = player.kou.points.div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.kou.points.times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        15: {
            title() { return (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 24)) ? "R" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 24)) ? "Currently Nothing here." : "" },
            pay() {
                player.kou.points = player.kou.points.sub(35);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',25)||hasUpgrade('lethe',24))?"<b>Red Beacon</b><br>Red Dolls effect increases based on its own reset time.<br><br>Cost: 35 Red Dolls":"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Red Beacon</b><br>Red Dolls effect increases based on its own reset time."
                if (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 24)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 51)) + "x";
                    show += "<br><br>Cost: 35 Red Dolls";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 24));
                let price = player.kou.points.gte(35);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = Decimal.log10(player.kou.resetTime + 1).plus(1).sqrt();
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.log10(player.kou.resetTime + 1).plus(1).pow(0.75);
                return eff;
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(35).times(achievementEffect('a', 42))).floor();
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        21: {
            title() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32)) ? "FLL" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 5500;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 54000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.light.points = player.light.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',11)||hasUpgrade('lethe',12)||hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32))?("<b>Delightful-Yellow Synergy</b><br>Light Tachyons itself boosts Forgotten Drops effect.<br><br>Cost: "+(inChallenge('kou',12)?"55,000 Light Tachyons":"5,500 Light Tachyons")+"<br>Req: 330x Forgotten Drops effect"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Delightful-Yellow Synergy</b><br>Light Tachyons itself boosts Forgotten Drops effect."
                if (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 21)) + "x<br><br>Cost: " + (inChallenge('kou', 21) ? "540,000" : "54,000") + " Light Tachyons<br>Req: 5,000,000x Forgotten Drops effect";
                    else show += "<br><br>Cost: " + (inChallenge('kou', 21) ? "55,000" : "5,500") + " Light Tachyons<br>Req: 330x Forgotten Drops effect";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 5500;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 54000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32));
                let price = player.light.points.gte(pricenum);
                let req = layers['lethe'].effect().gte(330);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    req = layers['lethe'].effect().gte(5000000);
                }
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && req;
            },
            effect() {
                let eff = player.light.points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.light.points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        22: {
            title() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33)) ? "LM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 700;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 46500;
                if (inChallenge('kou', 21)) price = price * 10;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) player.mem.points = player.mem.points.sub("1e1225");
                else player.mem.points = player.mem.points.sub(2e65);
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.light.points = player.light.points.sub(price);
            },
            fullDisplay() {
                let show = "<b>Delightful Memories</b><br>Light Tachyons itself makes Memory softcap starts later."
                if (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 22)) + "x<br><br>Cost: 1e1225 Memories<br>" + (inChallenge('kou', 21) ? "465000" : "46500") + " Light Tachyons";
                    else show += "<br><br>Cost: 2e65 Memories<br>" + (inChallenge('kou', 21) ? "7000" : "700") + " Light Tachyons";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 700;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 46500;
                if (inChallenge('kou', 21)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 11) || hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33));
                let price = player.light.points.gte(pricenum) && player.mem.points.gte(2e65);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.light.points.gte(pricenum) && player.mem.points.gte("1e1225");
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = player.light.points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = eff = player.light.points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        23: {
            title() { return (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34)) ? "LRM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 720;
                if (inChallenge('kou', 12)) price = price * 10;
                player.kou.points = player.kou.points.sub(30);
                player.mem.points = player.mem.points.sub(5e65);
                player.light.points = player.light.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',12)||hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34))?("<b>Monument of Light</b><br>Red dolls itself boosts L,M&its own gain.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"7,200 Light Tachyons":"720 Light Tachyons")+"<br>30 Red Dolls"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Monument of Light</b><br>Red dolls itself boosts L,M&its own gain."
                if (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 23)) + "x";
                    show += "<br><br>Cost: 5e65 Memories<br>" + (inChallenge('kou', 21) ? "7,200" : "720") + " Light Tachyons<br>30 Red Dolls";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 720;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 12) || hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34));
                let price = player.kou.points.gte(30) && player.mem.points.gte(5e65) && player.light.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(30).times(achievementEffect('a', 42))).floor();
            },
            effect() {
                let eff = player.kou.points.div(1.5).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.kou.points.max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        24: {
            title() { return (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35)) ? "RM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35)) ? "Currently Nothing here." : "" },
            pay() {
                player.kou.points = player.kou.points.sub(25);
                player.mem.points = player.mem.points.sub(2e65);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',13)||hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"<b>Joyful Memories</b><br>Memories boosts Red Dolls gain.<br><br>Cost: 2e65 Memories<br>25 Red Dolls":"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Joyful Memories</b><br>Memories boosts Red Dolls gain."
                if (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 24)) + "x";
                    show += "<br><br>Cost: 2e65 Memories<br>25 Red Dolls";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 13) || hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35));
                let price = player.kou.points.gte(25) && player.mem.points.gte(2e65);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(25).times(achievementEffect('a', 42))).floor();
            },
            effect() {
                let eff = player.points.plus(1).log10().max(1).div(100).plus(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.points.plus(1).log10().max(1).plus(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        25: {
            title() { return (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35)) ? "DRR" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35)) ? "Currently Nothing here." : "" },
            pay() {
                player.kou.points = player.kou.points.sub(50);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',14)||hasUpgrade('lethe',15)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35))?"<b>Joyful-Black Synergy</b><br>Red Dolls itself boosts Dark Matters effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 50 Red Dolls<br>Req: 400,000,000x Dark Matters effect"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Joyful-Black Synergy</b><br>Red Dolls itself boosts Dark Matters effect."
                if (inChallenge('kou', 12)) {
                    show += "<br><br><b>Unpurchaseable.</b>"
                    return show;
                }
                if (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 25)) + "x";
                    show += "<br><br>Cost: 50 Red Dolls<br>Req: 400,000,000x Dark Matters effect";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 14) || hasUpgrade('lethe', 15) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35));
                let price = player.kou.points.gte(50);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && !inChallenge('kou', 12) && tmp['dark'].effect.gte(400000000);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(50).times(achievementEffect('a', 42))).floor();
            },
            effect() {
                let eff = player.kou.points.div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.kou.points.times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        31: {
            title() { return (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42)) ? "FL" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 3250;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 51000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    player.lethe.points = player.lethe.points.sub("1e730");
                }
                else {
                    player.light.points = player.light.points.sub(price);
                    player.lethe.points = player.lethe.points.sub(1e40);
                }
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42))?("<b>The Flashing Rift</b><br>Forgotten Drops effects Light Tachyons effect.<br><br>Cost: 1e40 Forgotten Drops<br>"+(inChallenge('kou',12)?"32,500 Light Tachyons":"3,250 Light Tachyons")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>The Flashing Rift</b><br>Forgotten Drops effects Light Tachyons effect."
                if (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 53)) + "x<br><br>Cost: 1e730 Forgotten Drops<br>" + (inChallenge('kou', 21) ? "510,000" : "51,000") + " Light Tachyons";
                    else show += "<br><br>Cost: 1e40 Forgotten Drops<br>" + (inChallenge('kou', 21) ? "32,500" : "3,250") + " Light Tachyons";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 3250;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 51000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42));
                let price = player.light.points.gte(pricenum) && player.lethe.points.gte(1e40);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.light.points.gte(pricenum) && player.lethe.points.gte("1e730");
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = layers['lethe'].effect();
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        32: {
            title() { return (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43)) ? "FLM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 720;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 48000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    player.lethe.points = player.lethe.points.sub("1e710");
                    player.mem.points = player.mem.points.sub("1e1250");
                }
                else {
                    player.lethe.points = player.lethe.points.sub(5e20);
                    player.mem.points = player.mem.points.sub(5e65);
                }
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.light.points = player.light.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',21)||hasUpgrade('lethe',22)||hasUpgrade('lethe',23)||hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43))?("<b>Remote Light Memories</b><br>Forgotten Drops effects Light Tachyons&Memories gain.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"7,200 Light Tachyons":"720 Light Tachyons")+"<br>5e20 Forgotten Drops"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Remote Light Memories</b><br>Forgotten Drops effects Light Tachyons&Memories gain."
                if (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 32)) + "x<br>Cost: 1e1250 Memories<br>" + (inChallenge('kou', 21) ? "480,000" : "48,000") + " Light Tachyons<br>1e710 Forgotten Drops";
                    else show += "<br><br>Cost: 5e65 Memories<br>" + (inChallenge('kou', 21) ? "7,200" : "720") + " Light Tachyons<br>5e20 Forgotten Drops";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 720;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 48000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 21) || hasUpgrade('lethe', 22) || hasUpgrade('lethe', 23) || hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43));
                let price = player.lethe.points.gte(5e20) && player.mem.points.gte(5e65) && player.light.points.gte(pricenum);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.lethe.points.gte("1e710") && player.mem.points.gte("1e1250") && player.light.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = layers['lethe'].effect();
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        33: { //Where we begin
            title() { return "Memorize" },
            description() { return "Currently Nothing here." },
            pay() {
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) player.mem.points = player.mem.points.sub("9e753");
                else player.mem.points = player.mem.points.sub(5e43);
            },
            fullDisplay() {
                let show = "<b>Memorize</b><br>Make Memories gain After softcap's exponent +0.08.<br><br>Cost: ";
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "9e753 Memories"
                else show += "5e43 Memories"
                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let a = player.mem.points.gte(5e43);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) a = player.mem.points.gte("9e753");
                return a && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots)
            },

            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        34: {
            title() { return (hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45)) ? "DRM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 620;
                if (inChallenge('kou', 12)) price = price * 10;
                player.kou.points = player.kou.points.sub(30);
                player.mem.points = player.mem.points.sub(5e65);
                player.dark.points = player.dark.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',23)||hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?("<b>Monument of Dark</b><br>When you have less D than L, Red doll effects M&D gain with an increased rate.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"6,200 Dark Matters":"620 Dark Matters")+"<br>30 Red Dolls"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Monument of Dark</b><br>When you have less D than L, Red doll effects M&D gain with an increased rate.";
                if (hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 34)) + "x";
                    show += "<br><br>Cost: 5e65 Memories<br>" + (inChallenge('kou', 21) ? "6,200" : "620") + " Dark Matters<br>30 Red Dolls"
                }
                else return "<b>Unrevealed</b>";
                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 620;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 23) || hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45));
                let price = player.kou.points.gte(30) && player.mem.points.gte(5e65) && player.dark.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(30).times(achievementEffect('a', 42))).floor();
            },
            effect() {
                if (player.light.points.lte(player.dark.points)) return new Decimal(1);
                return layers['kou'].effect().pow(2.5);
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        35: {
            title() { return (hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45)) ? "DR" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 2950;
                if (inChallenge('kou', 12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
                player.kou.points = player.kou.points.sub(40);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',24)||hasUpgrade('lethe',25)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45))?("<b>The Tower of Darkness</b><br>Red Dolls effects Dark Matters effect at an increased rate.<br><br>Cost: 40 Red Dolls<br>"+(inChallenge('kou',12)?"29,500 Dark Matters":"2,950 Dark Matters")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>The Tower of Darkness</b><br>Red Dolls effects Dark Matters effect at an increased rate.";
                if (hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 35)) + "x";
                    show += "<br><br>Cost: 30 Red Dolls<br>" + (inChallenge('kou', 21) ? "29,500" : "2,950") + " Dark Matters"
                }
                else return "<b>Unrevealed</b>";
                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 2950;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 24) || hasUpgrade('lethe', 25) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45));
                let price = player.dark.points.gte(pricenum) && player.kou.points.gte(40);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            onPurchase() {
                if (hasAchievement('a', 42)) player.kou.points = player.kou.points.plus(new Decimal(40).times(achievementEffect('a', 42))).floor();
            },
            effect(){
                return layers['kou'].effect().pow(1.5);
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        41: {
            title() { return (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52)) ? "FFL" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52)) ? "Currently Nothing here." : "" },
            pay() {
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) player[this.layer].points = player[this.layer].points.sub("1e780");
                else player[this.layer].points = player[this.layer].points.sub(1e65);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',31)||hasUpgrade('lethe',32)||hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52))?("<b>Forgotten-White Synergy</b><br>Forgotten Drops itself boosts Light Tachyons effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 1e65 Forgotten Drops<br>Req: 2.5e11x Light Tachyons effect")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Forgotten-White Synergy</b><br>Forgotten Drops itself boosts Light Tachyons effect."
                if (inChallenge('kou', 12)) {
                    show += "<br><br><b>Unpurchaseable.</b>"
                    return show;
                }
                if (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 41)) + "x<br><br>Cost: 1e780 Forgotten Drops<br>Req: 1e19x Light Tachyons effect";
                    else show += "<br><br>Cost: 1e65 Forgotten Drops<br>2.5e11x Light Tachyons effect"
                }
                else return "<b>Unrevealed</b>"
                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52));
                let price = player[this.layer].points.gte(1e65);
                let req = layers['light'].effect().gte(2.5e11);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    price = player[this.layer].points.gte("1e780");
                    req = layers['light'].effect().gte(1e19);
                }
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && !inChallenge('kou', 12) && req;
            },
            effect() {
                let eff = player[this.layer].points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player[this.layer].points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        42: {
            title() { return (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53)) ? "FM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53)) ? "Currently Nothing here." : "" },
            pay() {
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    player.lethe.points = player.lethe.points.sub("1e700");
                    player.mem.points = player.mem.points.sub("1e1225");
                }
                else {
                    player.lethe.points = player.lethe.points.sub(1e20);
                    player.mem.points = player.mem.points.sub(2e65);
                }
            },
            fullDisplay() {
                let show = "<b>Forgotten Memories</b><br>Memories boosts Forgotten Drops gain."
                if (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 42)) + "x<br><br>Cost: 1e1225 Memories<br>1e700 Forgotten Drops";
                    else show += "<br><br>Cost: 2e65 Memories<br>1e20 Forgotten Drops"
                }
                else return "<b>Unrevealed</b>"
                return show;
            },
            effect() {
                let eff = player.mem.points.plus(1).log10().max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = eff.times(player.mem.points.plus(1).log10().max(1).log10().max(1));
                return eff;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 31) || hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53));
                let price = player.lethe.points.gte(1e20) && player.mem.points.gte(2e65);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.lethe.points.gte("1e700") && player.mem.points.gte("1e1225");
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        43: {
            title() { return (hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54)) ? "FDM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 620;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 57500;
                if (inChallenge('kou', 12)) price = price * 10;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    player.lethe.points = player.lethe.points.sub("1e710");
                    player.mem.points = player.mem.points.sub("1e1250");
                }
                else {
                    player.lethe.points = player.lethe.points.sub(5e20);
                    player.mem.points = player.mem.points.sub(5e65);
                }
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.dark.points = player.dark.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',32)||hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?("<b>Remote Dark Memories</b><br>Forgotten Drops effects Dark Matters&Memories gain.<br><br>Cost: 5e65 Memories<br>"+(inChallenge('kou',12)?"6,200 Dark Matters":"620 Dark Matters")+"<br>5e20 Forgotten Drops"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Remote Dark Memories</b><br>Forgotten Drops effects Dark Matters&Memories gain."
                if (hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 43)) + "x<br><br>Cost: 1e1250 Memories<br>" + (inChallenge('kou', 21) ? "575,000" : "57,500") + " Dark Matters<br>1e710 Forgotten Drops";
                    else show += "<br><br>Cost: 5e65 Memories<br>" + (inChallenge('kou', 21) ? "6,200" : "620") + " Dark Matters<br>5e20 Forgotten Drops";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 620;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 57500;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 32) || hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54));
                let price = player.lethe.points.gte(5e20) && player.mem.points.gte(5e65) && player.dark.points.gte(pricenum);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.lethe.points.gte("1e710") && player.mem.points.gte("1e1250") && player.dark.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = layers['lethe'].effect();
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        44: {
            title() { return (hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) ? "DM" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 600;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 56000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    player.mem.points = player.mem.points.sub("1e1225");
                }
                else {
                    player.dark.points = player.dark.points.sub(price);
                    player.mem.points = player.mem.points.sub(2e65);
                }
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',33)||hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?("<b>Dark Memories</b><br>Memories gain is boosted when under e(DM/10).<br><br>Cost: 2e65 Memories<br>"+(inChallenge('kou',12)?"6,000 Dark Matters":"600 Dark Matters")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Dark Memories</b><br>Memories gain is boosted when under e(DM/10)."
                if (hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 44)) + "x<br><br>Cost: 1e1225 Memories<br>" + (inChallenge('kou', 21) ? "560,000" : "56,000") + " Dark Matters";
                    else show += "<br><br>Cost: 2e65 Memories<br>" + (inChallenge('kou', 21) ? "6,000" : "600") + " Dark Matters";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 600;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 56000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 33) || hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55));
                let price = player.dark.points.gte(pricenum) && player.mem.points.gte(2e65);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.dark.points.gte(pricenum) && player.mem.points.gte("1e1225");
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                /*let eff = player.dark.points.div(10);
                eff = Decimal.pow(10,eff);
                return eff;*/
                let eff = player.dark.points.div(20).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.dark.points.max(1);;
                let lmt = player.dark.points.div(10);
                lmt = Decimal.pow(10, lmt);
                if (player.mem.points.gte(lmt)) eff = new Decimal(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        45: {
            title() { return (hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) ? "DDR"/*Convinced*/ : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 5000;
                if (inChallenge('kou', 12)) price = price * 10;
                player.dark.points = player.dark.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',34)||hasUpgrade('lethe',35)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?("<b>Dark-Red Synergy</b><br>Dark Matters itself boosts Red Dolls effect.<br><br>Cost: "+(inChallenge('kou',12)?"5,0000 Dark Matters":"5,000 Dark Matters")+"<br>Req: 12.50x Red Dolls effect"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Dark-Red Synergy</b><br>Dark Matters itself boosts Red Dolls effect."
                if (hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 54)) + "x";
                    show += "<br><br>Cost: " + (inChallenge('kou', 21) ? "50,000" : "5,000") + " Dark Matters<br>Req: 12.50x Red Dolls effect";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 5000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 34) || hasUpgrade('lethe', 35) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55));
                let price = player.dark.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && tmp["kou"].effect.gte(12.5);
            },
            effect() {
                let eff = player.dark.points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.dark.points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        51: {
            title() { return (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 42)) ? "F" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 42)) ? "Currently Nothing here." : "" },
            pay() {
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) player[this.layer].points = player[this.layer].points.sub("1e720");
                else player[this.layer].points = player[this.layer].points.sub(1e30);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',41)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',42))?"<b>Yellow Beacon</b><br>Forgotten Drops effect increases based on its own reset time.<br><br>Cost: 1e30 Forgotten Drops":"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Yellow Beacon</b><br>Forgotten Drops effect increases based on its own reset time."
                if (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 42)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 51)) + "x<br><br>Cost: 1e720 Forgotten Drops";
                    else show += "<br><br>Cost: 1e30 Forgotten Drops";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 42));
                let price = player[this.layer].points.gte(1e30);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player[this.layer].points.gte("1e720");
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = Decimal.log10(player[this.layer].resetTime + 1).plus(1).sqrt();
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.log10(player[this.layer].resetTime + 1).plus(1).pow(0.75);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        52: {
            title() { return (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53)) ? "FFD" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53)) ? "Currently Nothing here." : "" },
            pay() {
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) player[this.layer].points = player[this.layer].points.sub("1e780");
                else player[this.layer].points = player[this.layer].points.sub(1e65);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',41)||hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',51)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53))?("<b>Forgotten-Black Synergy</b><br>Forgotten Drops itself boosts Dark Matters effect.<br><br>"+(inChallenge('kou',12)?"<b>Unpurchaseable</b>":"Cost: 1e65 Forgotten Drops<br>Req: 400,000,000x Dark Matters Effect")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Forgotten-Black Synergy</b><br>Forgotten Drops itself boosts Dark Matters effect."
                if (inChallenge('kou', 12)) {
                    show += "<br><br><b>Unpurchaseable.</b>"
                    return show;
                }
                if (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 52)) + "x<br><br>Cost: 1e780 Forgotten Drops<br>Req: 5e25x Dark Matters effect";
                    else show += "<br><br>Cost: 1e65 Forgotten Drops<br>400,000,000x Light Tachyons effect"
                }
                else return "<b>Unrevealed</b>"
                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let around = (hasUpgrade('lethe', 41) || hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 51) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53));
                let price = player[this.layer].points.gte(1e65);
                let req = layers['dark'].effect().gte(400000000);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    price = player[this.layer].points.gte("1e780");
                    req = layers['dark'].effect().gte(5e25);
                }
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && !inChallenge('kou', 12) && req;
            },
            effect() {
                let eff = player[this.layer].points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player[this.layer].points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        53: {
            title() { return (hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54)) ? "FD" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 2950;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 62000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    player.lethe.points = player.lethe.points.sub("1e730");
                }
                else {
                    player.dark.points = player.dark.points.sub(price);
                    player.lethe.points = player.lethe.points.sub(1e40);
                }
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',42)||hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',52)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54))?("<b>The Deep Rift</b><br>Forgotten Drops effects Dark Matters effect.<br><br>Cost: 1e40 Forgotten Drops<br>"+(inChallenge('kou',12)?"29,500 Dark Matters":"2,950 Dark Matters")):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>The Deep Rift</b><br>Forgotten Drops effects Dark Matters effect."
                if (hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 53)) + "x<br><br>Cost: 1e730 Forgotten Drops<br>" + (inChallenge('kou', 21) ? "620,000" : "62,000") + " Dark Matters";
                    else show += "<br><br>Cost: 1e40 Forgotten Drops<br>" + (inChallenge('kou', 21) ? "29,500" : "2,950") + " Dark Matters";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 2950;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 62000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 42) || hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 52) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54));
                let price = player.dark.points.gte(pricenum) && player.lethe.points.gte(1e40);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = player.dark.points.gte(pricenum) && player.lethe.points.gte("1e730");
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            effect() {
                let eff = layers['lethe'].effect();
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        54: {
            title() { return (hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) ? "FDD" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 5000;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 65000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.dark.points = player.dark.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',43)||hasUpgrade('lethe',44)||hasUpgrade('lethe',45)||hasUpgrade('lethe',53)||hasUpgrade('lethe',54)||hasUpgrade('lethe',55))?("<b>Dark-Yellow Synergy</b><br>Dark Matters itself boosts Forgotten Drops effect.<br><br>Cost: "+(inChallenge('kou',12)?"5,0000 Dark Matters":"5,000 Dark Matters")+"<br>Req: 330x Forgotten Drops effect"):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Dark-Yellow Synergy</b><br>Dark Matters itself boosts Forgotten Drops effect."
                if (hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 54)) + "x<br><br>Cost: " + (inChallenge('kou', 21) ? "650,000" : "65,000") + " Dark Matters<br>Req: 5,000,000x Forgotten Drops effect";
                    else show += "<br><br>Cost: " + (inChallenge('kou', 21) ? "50,000" : "5,000") + " Dark Matters<br>Req: 330x Forgotten Drops effect";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 5000;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 65000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 43) || hasUpgrade('lethe', 44) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 53) || hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55));
                let price = player.dark.points.gte(pricenum);
                let req = layers['lethe'].effect().gte(330);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) {
                    req = layers['lethe'].effect().gte(5000000);
                }
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots) && req;
            },
            effect() {
                let eff = player.dark.points.plus(1).log10().div(2).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.dark.points.plus(1).log10().times(2).max(1);
                return eff;
            },
            unlocked() { return true },
            style: { height: '130px', width: '130px' },
        },
        55: {
            title() { return (hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 44)) ? "D" : "Unrevealed" },
            description() { return (hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 44)) ? "Currently Nothing here." : "" },
            pay() {
                let price = 1300;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) price = 60000;
                if (inChallenge('kou', 12)) price = price * 10;
                if (!(player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer))) player.dark.points = player.dark.points.sub(price);
            },
            /*fullDisplay(){
                return (hasUpgrade('lethe',54)||hasUpgrade('lethe',55)||hasUpgrade('lethe',45)||hasUpgrade('lethe',44))?('<b>Black Beacon</b><br>Dark Matters effect is boosted by Achievements.<br><br>Cost: '+(inChallenge('kou',12)?'13,000 Dark Matters':'1,300 Dark Matters')):"<b>Unrevealed</b>";
            },*/
            fullDisplay() {
                let show = "<b>Black Beacon</b><br>Dark Matters effect is boosted by Achievements."
                if (hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 44)) {
                    if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) show += "<br>Currently: " + format(upgradeEffect('lethe', 55)) + "x<br><br>Cost: " + (inChallenge('kou', 21) ? "600,000" : "60,000") + " Dark Matters";
                    else show += "<br><br>Cost: " + (inChallenge('kou', 21) ? "13,000" : "1,300") + " Dark Matters";
                }
                else return "<b>Unrevealed</b>"

                return show;
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let pricenum = 1300;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) pricenum = 60000;
                if (inChallenge('kou', 12)) pricenum = pricenum * 10;
                let around = (hasUpgrade('lethe', 54) || hasUpgrade('lethe', 55) || hasUpgrade('lethe', 45) || hasUpgrade('lethe', 44));
                let price = player.dark.points.gte(pricenum);
                return around && price && (layers['lethe'].BeaconLength() < tmp.lethe.nodeSlots);
            },
            unlocked() { return true },
            effect() {
                let eff = player.a.achievements.length / 4;
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = player.a.achievements.length;
                if (eff < 1) return 1;
                return eff;
            },
            style: { height: '130px', width: '130px' },
        },

        //二阶段
        61: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return true;
            },
            pay() {
                player.saya.points = player.saya.points.sub(this.pricefunction().sayaprice())
            },
            fullDisplay() {
                let show = "<b>Green Beacon</b><br>Everflashing Knives effect is boosted by Achievements.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().sayaprice()) + " Everflashing Knives"
                return show;
            },
            pricefunction() {
                return {
                    sayaprice() {
                        return 385;
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.saya.points.gte(this.pricefunction().sayaprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.a.achievements.length / 20;
                return eff;
            }
        },
        62: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 61) || hasUpgrade('lethe', 62) || hasUpgrade('lethe', 63) || hasUpgrade('lethe', 72));
            },
            pay() {
                player.rei.points = player.rei.points.sub(this.pricefunction().reiprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Ethereal-Green Synergy</b><br>Luminous Churches itself boosts Everflashing Knives effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br>Cost: " + formatWhole(this.pricefunction().reiprice()) + " Luminous Churches"
                show += "<br>Req: " + formatWhole(this.pricefunction().sayaeffreq()) + "x Everflashing Knives effect"
                return show;
            },
            pricefunction() {
                return {
                    reiprice() {
                        return 4925;
                    },
                    sayaeffreq() {
                        return new Decimal(570);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.rei.points.gte(this.pricefunction().reiprice());
                let req = layers['saya'].effect().gte(this.pricefunction().sayaeffreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.rei.points.max(1).log10().div(2).max(1);
                return eff;
            }
        },
        63: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 62) || hasUpgrade('lethe', 63) || hasUpgrade('lethe', 64) || hasUpgrade('lethe', 73));
            },
            pay() {
                player.rei.points = player.rei.points.sub(this.pricefunction().reiprice())
                player.saya.points = player.saya.points.sub(this.pricefunction().sayaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Church of Weapon</b><br>Everflashing Knives effect Glowing Roses effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().reiprice()) + " Luminous Churches"
                show += "<br>" + formatWhole(this.pricefunction().sayaprice()) + " Everflashing Knives"
                return show;
            },
            pricefunction() {
                return {
                    reiprice() {
                        return 4950;
                    },
                    sayaprice() {
                        return 400;
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.rei.points.gte(this.pricefunction().reiprice()) && player.saya.points.gte(this.pricefunction().sayaprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['saya'].effect().max(1);
                return eff;
            }
        },
        64: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 63) || hasUpgrade('lethe', 64) || hasUpgrade('lethe', 65) || hasUpgrade('lethe', 74));
            },
            pay() {
                player.saya.points = player.saya.points.sub(this.pricefunction().sayaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Confident-Void Synergy</b><br>Everflashing Knives itself boosts Glowing Roses effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().sayaprice()) + " Everflashing Knives"
                show += "<br>Req: " + formatWhole(this.pricefunction().rosesreq()) + " Glowing Roses"
                return show;
            },
            pricefunction() {
                return {
                    sayaprice() {
                        return 395;
                    },
                    rosesreq() {
                        return new Decimal("1e244");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.saya.points.gte(this.pricefunction().sayaprice());
                let req = player.rei.roses.gte(this.pricefunction().rosesreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.saya.points.max(1).log10().times(10).max(1);
                return eff;
            }
        },
        65: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return true;
            },
            pay() {
                player.rei.points = player.rei.points.sub(this.pricefunction().reiprice())
            },
            fullDisplay() {
                let show = "<b>Void Beacon</b><br>Glowing Roses effect increases based on LC's reset time.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().reiprice()) + " Lumious Churches"
                return show;
            },
            pricefunction() {
                return {
                    reiprice() {
                        return 4900;
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.rei.points.gte(this.pricefunction().reiprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = Decimal.log10(player['rei'].resetTime + 1).plus(1).pow(0.75);
                return eff;
            }
        },
        71: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 61) || hasUpgrade('lethe', 71) || hasUpgrade('lethe', 72) || hasUpgrade('lethe', 81));
            },
            pay() {
                player.yugamu.points = player.yugamu.points.sub(this.pricefunction().yugamuprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Ruptured-Green Synergy</b><br>Flourish Labyrinths itself boosts Everflashing Knives effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br>Cost: " + formatWhole(this.pricefunction().yugamuprice()) + " Flourish Labyrinths"
                show += "<br>Req: " + formatWhole(this.pricefunction().sayaeffreq()) + "x Everflashing Knives effect"
                return show;
            },
            pricefunction() {
                return {
                    yugamuprice() {
                        return 5275;
                    },
                    sayaeffreq() {
                        return new Decimal(570);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.yugamu.points.gte(this.pricefunction().yugamuprice());
                let req = layers['saya'].effect().gte(this.pricefunction().sayaeffreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.yugamu.points.max(1).log10().div(2).max(1);
                return eff;
            }
        },
        72: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe',62)||hasUpgrade('lethe',71)||hasUpgrade('lethe',72)||hasUpgrade('lethe',73)||hasUpgrade('lethe',82));
            },
            pay() {
                player.saya.points = player.saya.points.sub(this.pricefunction().sayaprice())
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Hurtful Steps</b><br>Fixed World Steps effect boosts Everflashing Knives gain by a reduced rate.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().sayaprice()) + " Everflashing Knives"
                show += "<br>" + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                return show;
            },
            pricefunction() {
                return {
                    sayaprice() {
                        return 500;
                    },
                    worldprice(){
                        return new Decimal('1.5e90')
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.saya.points.gte(this.pricefunction().sayaprice())&&player.world.points.gte(this.pricefunction().worldprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['world'].fixedReward().pow(0.15).max(1);
                return eff;
            }
        },
        73: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 63) || hasUpgrade('lethe', 72) || hasUpgrade('lethe', 73) || hasUpgrade('lethe', 74) || hasUpgrade('lethe',83));
            },
            pay() {
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Personality Blessedness Tower</b><br>World Step Height is divded by e((K-log10(Roses))^0.4)";
                show += "<br>Currently: ÷" + format(this.effect());
                show += "<br>Cost: " + formatWhole(this.pricefunction().worldprice()) + " World Steps";
                show += " 　Req: " + formatWhole(this.pricefunction().sayaeffreq()) + "x Everflashing Knives effect";
                show += "<br>" + formatWhole(this.pricefunction().rosesreq()) + " Glowing Roses";
                return show;
            },
            pricefunction() {
                return {
                    worldprice() {
                        return new Decimal(1e111);
                    },
                    sayaeffreq(){
                        return new Decimal(17500);
                    },
                    rosesreq(){
                        return new Decimal("1e435");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.world.points.gte(this.pricefunction().worldprice());
                let req=player.rei.roses.gte(this.pricefunction().rosesreq())&&layers['saya'].effect().gte(this.pricefunction().sayaeffreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = Decimal.pow(10,player.saya.points.sub(player.rei.roses.max(1).log10()).pow(0.4))
                return eff;
            }
        },
        74: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe',64)||hasUpgrade('lethe',73)||hasUpgrade('lethe',74)||hasUpgrade('lethe',75)||hasUpgrade('lethe',84));
            },
            pay() {
                player.rei.points = player.rei.points.sub(this.pricefunction().reiprice())
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Empty Steps</b><br>Luminous Churches themselves boost World Step gain speed.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().reiprice()) + " Luminous Churches"
                show += "<br>" + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                return show;
            },
            pricefunction() {
                return {
                    reiprice() {
                        return 10000;
                    },
                    worldprice() {
                        return new Decimal("1.5e90");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.rei.points.gte(this.pricefunction().reiprice())&&player.world.points.gte(this.pricefunction().worldprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.rei.points.pow(2.025)/*times(2.5e3)*/.times(player.rei.points.max(1).log(10)).max(1);
                return eff;
            }
        },
        75: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 65) || hasUpgrade('lethe', 74) || hasUpgrade('lethe', 75) || hasUpgrade('lethe', 85));
            },
            pay() {
                player.etoluna.points = player.etoluna.points.sub(this.pricefunction().etolunaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Starry-Void Synergy</b><br>Gemini Bounds itself boosts Glowing Roses effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().etolunaprice()) + " Gemini Bounds"
                show += "<br>Req: " + formatWhole(this.pricefunction().rosesreq()) + " Glowing Roses"
                return show;
            },
            pricefunction() {
                return {
                    etolunaprice() {
                        return new Decimal("5e27");
                    },
                    rosesreq() {
                        return new Decimal("1e244");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.etoluna.points.gte(this.pricefunction().etolunaprice());
                let req = player.rei.roses.gte(this.pricefunction().rosesreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.etoluna.points.max(1).log10().max(1);
                return eff;
            }
        },
        81: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 71) || hasUpgrade('lethe', 81) || hasUpgrade('lethe', 82) || hasUpgrade('lethe', 91));
            },
            pay() {
                player.yugamu.points = player.yugamu.points.sub(this.pricefunction().yugamuprice())
                player.saya.points = player.saya.points.sub(this.pricefunction().sayaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Aggressive Labyrinth</b><br>Everflashing Knives effect Maze effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().yugamuprice()) + " Flourish Labyrinths"
                show += "<br>" + formatWhole(this.pricefunction().sayaprice()) + " Everflashing Knives"
                return show;
            },
            pricefunction() {
                return {
                    yugamuprice() {
                        return 5350;
                    },
                    sayaprice() {
                        return 400;
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.yugamu.points.gte(this.pricefunction().yugamuprice()) && player.saya.points.gte(this.pricefunction().sayaprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['saya'].effect().max(1);
                return eff;
            }
        },
        82: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 72) || hasUpgrade('lethe', 81) || hasUpgrade('lethe', 82) || hasUpgrade('lethe', 83)|| hasUpgrade('lethe', 92));
            },
            pay() {
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Personality Disaster Tower</b><br>World Step Height softcap starts later by e(K÷12-log10(Moved)÷2).";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br>Cost: " + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                show += " 　Req: " + formatWhole(this.pricefunction().sayaeffreq()) + "x Knives effect";
                show += "<br>" + formatWhole(this.pricefunction().movereq()) + " Moved Times";
                return show;
            },
            pricefunction() {
                return {
                    worldprice() {
                        return new Decimal(1e111);
                    },
                    movereq() {
                        return new Decimal(1e58);
                    },
                    sayaeffreq(){
                        return new Decimal(17500);
                    },
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.world.points.gte(this.pricefunction().worldprice());
                let req = layers['saya'].effect().gte(this.pricefunction().sayaeffreq())&&layers['yugamu'].movetimes().gte(this.pricefunction().movereq())
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = Decimal.pow(10,player.saya.points.div(12).sub(player['yugamu'].timesmoved.max(1).log10().div(2)).max(1).sub(1));
                return eff;
            }
        },
        83: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 73) || hasUpgrade('lethe', 82) || hasUpgrade('lethe', 83) || hasUpgrade('lethe', 84)|| hasUpgrade('lethe', 93));
            },
            pay() {
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Endless Stairs</b><br>Normal, Fixed and Restricted World Steps now push Worlds Step Height softcap starts later.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                return show;
            },
            pricefunction() {
                return {
                    worldprice() {
                        return new Decimal('1e129');
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.world.points.gte(this.pricefunction().worldprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.world.points.times(player.world.fixednum).times(player.world.restrictionnum).pow(0.1).max(1)
                return eff;
            }
        },
        84: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe',74)||hasUpgrade('lethe',83)||hasUpgrade('lethe',84)||hasUpgrade('lethe',85)||hasUpgrade('lethe',94))
            },
            pay() {
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Comet Blessedness Tower</b><br>The World Step Height is devided by (Roses^0.2÷G)^0.5÷50";
                show += "<br>Currently: ÷" + format(this.effect());
                show += "<br>Cost: " + formatWhole(this.pricefunction().worldprice()) + " World Steps";
                show += " 　Req: " + formatWhole(this.pricefunction().etoreq()) + " Star Points";
                show += "<br>" + formatWhole(this.pricefunction().rosesreq()) + " Glowing Roses";
                return show;
            },
            pricefunction() {
                return {
                    worldprice() {
                        return new Decimal(1e111);
                    },
                    etoreq(){
                        return new Decimal(1e84);
                    },
                    rosesreq(){
                        return new Decimal("1e435");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.world.points.gte(this.pricefunction().worldprice());
                let req=player.rei.roses.gte(this.pricefunction().rosesreq())&&player.etoluna.starPoint.gte(this.pricefunction().etoreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.rei.roses.pow(0.2).div(player.etoluna.points.max(1)).pow(0.5).div(50).max(1);
                return eff;
            }
        },
        85: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 75) || hasUpgrade('lethe', 84) || hasUpgrade('lethe', 85) || hasUpgrade('lethe', 95));
            },
            pay() {
                player.rei.points = player.rei.points.sub(this.pricefunction().reiprice())
                player.etoluna.points = player.etoluna.points.sub(this.pricefunction().etolunaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Church of Star</b><br>Gemini Bounds effect Glowing Roses effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().reiprice()) + " Luminous Churches"
                show += "<br>" + formatWhole(this.pricefunction().etolunaprice()) + " Gemini Bounds"
                return show;
            },
            pricefunction() {
                return {
                    reiprice() {
                        return 4950;
                    },
                    etolunaprice() {
                        return new Decimal(5e27);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.rei.points.gte(this.pricefunction().reiprice()) && player.etoluna.points.gte(this.pricefunction().etolunaprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['etoluna'].effect().max(1).log10().max(1).times(layers['etoluna'].effect().max(1).log10().max(1));
                return eff;
            }
        },
        91: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 81) || hasUpgrade('lethe', 91) || hasUpgrade('lethe', 92) || hasUpgrade('lethe', 101));
            },
            pay() {
                player.saya.points = player.saya.points.sub(this.pricefunction().sayaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Confident-Broken Synergy</b><br>Everflashing Knives itself boosts Maze effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().sayaprice()) + " Everflashing Knives"
                show += "<br>Req: " + formatWhole(this.pricefunction().mazereq()) + " Moved times in Maze"
                return show;
            },
            pricefunction() {
                return {
                    sayaprice() {
                        return 395;
                    },
                    mazereq() {
                        return new Decimal("1.3e30");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.saya.points.gte(this.pricefunction().sayaprice());
                let req = layers['yugamu'].movetimes().gte(this.pricefunction().mazereq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.saya.points.max(1).log10().times(10).max(1);
                return eff;
            }
        },
        92: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe',82)||hasUpgrade('lethe',91)||hasUpgrade('lethe',92)||hasUpgrade('lethe',93)||hasUpgrade('lethe',102))
            },
            pay() {
                player.yugamu.points = player.yugamu.points.sub(this.pricefunction().yugamuprice())
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Confusing Steps</b><br>Times moved in Maze boosts World Step gain speed by a reduced rate.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().yugamuprice()) + " Flourish Labyrinths"
                show += "<br>" + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                return show;
            },
            pricefunction() {
                return {
                    yugamuprice() {
                        return 10500;
                    },
                    worldprice(){
                        return new Decimal("1.5e90");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.yugamu.points.gte(this.pricefunction().yugamuprice())&&player.world.points.gte(this.pricefunction().worldprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['yugamu'].movetimes().pow(0.15).max(1)
                return eff;
            }
        },
        93: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe',83)||hasUpgrade('lethe',92)||hasUpgrade('lethe',93)||hasUpgrade('lethe',94)||hasUpgrade('lethe',103));
            },
            pay() {
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Comet Disaster Tower</b><br>World Step Height softcap starts later by e(log10(G)-log10(Moved)).";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br>Cost: " + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                show += " 　Req: " + formatWhole(this.pricefunction().lunareq()) + " Moon Points";
                show += "<br>" + formatWhole(this.pricefunction().movereq()) + " Moved Times";
                return show;
            },
            pricefunction() {
                return {
                    worldprice() {
                        return new Decimal(1e111);
                    },
                    movereq() {
                        return new Decimal(1e58);
                    },
                    lunareq(){
                        return new Decimal(1e84);
                    },
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.world.points.gte(this.pricefunction().worldprice());
                let req=layers['yugamu'].movetimes().gte(this.pricefunction().movereq())&&player.etoluna.moonPoint.gte(this.pricefunction().lunareq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = Decimal.pow(10,player.etoluna.points.max(1).log10().sub(player['yugamu'].timesmoved.max(1).log10()).max(1).sub(1));
                return eff;
            }
        },
        94: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe',84)||hasUpgrade('lethe',93)||hasUpgrade('lethe',94)||hasUpgrade('lethe',95)||hasUpgrade('lethe',104))
            },
            pay() {
                player.etoluna.points = player.etoluna.points.sub(this.pricefunction().etolunaprice())
                player.world.points = player.world.points.sub(this.pricefunction().worldprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Shiny Steps</b><br>Restricted World Steps effect boosts Gemini Bounds gain by a reduced rate.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().etolunaprice()) + " Gemini Bounds"
                show += "<br>" + formatWhole(this.pricefunction().worldprice()) + " World Steps"
                return show;
            },
            pricefunction() {
                return {
                    etolunaprice() {
                        return new Decimal(1e51);
                    },
                    worldprice(){
                        return new Decimal(1.5e90);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.etoluna.points.gte(this.pricefunction().etolunaprice())&&player.world.points.gte(this.pricefunction().worldprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['world'].restrictReward().pow(0.355).max(1);
                return eff;
            }
        },
        95: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 85) || hasUpgrade('lethe', 94) || hasUpgrade('lethe', 95) || hasUpgrade('lethe', 105));
            },
            pay() {
                player.rei.points = player.rei.points.sub(this.pricefunction().reiprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Ethereal-Blurple Synergy</b><br>Luminous Churches itself boosts Gemini Bounds effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br>Cost: " + formatWhole(this.pricefunction().reiprice()) + " Luminous Churches"
                show += "<br>Req: " + formatWhole(this.pricefunction().etolunaeffreq()) + "x Gemini Bounds effect"
                return show;
            },
            pricefunction() {
                return {
                    reiprice() {
                        return 4925;
                    },
                    etolunaeffreq() {
                        return new Decimal(2e29);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.rei.points.gte(this.pricefunction().reiprice());
                let req = layers['etoluna'].effect().gte(this.pricefunction().etolunaeffreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.rei.points.max(1).log10().times(25).max(1);
                return eff;
            }
        },
        101: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return true;
            },
            pay() {
                player.yugamu.points = player.yugamu.points.sub(this.pricefunction().yugamuprice())
            },
            fullDisplay() {
                let show = "<b>Broken Beacon</b><br>Maze effects increase based on FL's reset time.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().yugamuprice()) + " Flourish Labyrinths"
                return show;
            },
            pricefunction() {
                return {
                    yugamuprice() {
                        return 5250;
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.yugamu.points.gte(this.pricefunction().yugamuprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = Decimal.log10(player['yugamu'].resetTime + 1).plus(1).pow(0.75);
                return eff;
            }
        },
        102: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 92) || hasUpgrade('lethe', 101) || hasUpgrade('lethe', 102) || hasUpgrade('lethe', 103));
            },
            pay() {
                player.etoluna.points = player.etoluna.points.sub(this.pricefunction().etolunaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Starry-Broken Synergy</b><br>Gemini Bounds itself boosts Maze effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().etolunaprice()) + " Gemini Bounds"
                show += "<br>Req: " + formatWhole(this.pricefunction().mazereq()) + " Moved times in Maze"
                return show;
            },
            pricefunction() {
                return {
                    etolunaprice() {
                        return new Decimal("2.5e27");
                    },
                    mazereq() {
                        return new Decimal("1.3e30");
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.etoluna.points.gte(this.pricefunction().etolunaprice());
                let req = layers['yugamu'].movetimes().gte(this.pricefunction().mazereq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.etoluna.points.max(1).log10().max(1);
                return eff;
            }
        },
        103: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 93) || hasUpgrade('lethe', 102) || hasUpgrade('lethe', 103) || hasUpgrade('lethe', 104));
            },
            pay() {
                player.yugamu.points = player.yugamu.points.sub(this.pricefunction().yugamuprice())
                player.etoluna.points = player.saya.points.sub(this.pricefunction().etolunaprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>The Farthermost Labyrinth</b><br>Gemini Bounds effect Maze effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().yugamuprice()) + " Flourish Labyrinths"
                show += "<br>" + formatWhole(this.pricefunction().etolunaprice()) + " Gemini Bounds"
                return show;
            },
            pricefunction() {
                return {
                    yugamuprice() {
                        return 5350;
                    },
                    etolunaprice() {
                        return new Decimal(5e27);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.yugamu.points.gte(this.pricefunction().yugamuprice()) && player.etoluna.points.gte(this.pricefunction().etolunaprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = layers['etoluna'].effect().max(1).log10().max(1).times(layers['etoluna'].effect().max(1).log10().max(1));
                return eff;
            }
        },
        104: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return (hasUpgrade('lethe', 94) || hasUpgrade('lethe', 103) || hasUpgrade('lethe', 104) || hasUpgrade('lethe', 105));
            },
            pay() {
                player.yugamu.points = player.yugamu.points.sub(this.pricefunction().yugamuprice())
            },
            fullDisplay() {
                if (!this.roundbol()) return "<b>Unrevealed</b>"
                let show = "<b>Ruptured-Blurple Synergy</b><br>Flourish Labyrinths itself boosts Gemini Bounds effect.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br>Cost: " + formatWhole(this.pricefunction().yugamuprice()) + " Flourish Labyrinths"
                show += "<br>Req: " + formatWhole(this.pricefunction().etolunaeffreq()) + "x Gemini Bounds effect"
                return show;
            },
            pricefunction() {
                return {
                    yugamuprice() {
                        return 5275;
                    },
                    etolunaeffreq() {
                        return new Decimal(2e29);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.yugamu.points.gte(this.pricefunction().yugamuprice());
                let req = layers['etoluna'].effect().gte(this.pricefunction().etolunaeffreq());
                return price && req && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.yugamu.points.max(1).log10().times(25).max(1);
                return eff;
            }
        },
        105: {
            style: { height: '130px', width: '130px' },
            unlocked() {
                return true;
            },
            roundbol() {
                return true;
            },
            pay() {
                player.etoluna.points = player.etoluna.points.sub(this.pricefunction().etolunaprice())
            },
            fullDisplay() {
                let show = "<b>Blurple Beacon</b><br>Gemini Bounds effect is boosted by Achievements.";
                show += "<br>Currently: " + format(this.effect()) + "x";
                show += "<br><br>Cost: " + formatWhole(this.pricefunction().etolunaprice()) + " Gemini Bounds"
                return show;
            },
            pricefunction() {
                return {
                    etolunaprice() {
                        return new Decimal(1e27);
                    }
                }
            },
            canAfford() {
                if (inChallenge('kou',82)) return false;
                let price = player.etoluna.points.gte(this.pricefunction().etolunaprice());
                return price && this.roundbol() && (layers['lethe'].HyperBeaconLength() < tmp.lethe.HypernodeSlots)
            },
            effect() {
                let eff = player.a.achievements.length;
                return eff;
            }
        },
    }
})



addLayer("rei", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            roses: new Decimal(0),
            unlockOrder: 0,
            auto: false,
            demile: [],
        }
    },
    name: "Luminous", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LC",
    color: "#ffe6f6",
    nodeStyle() {
        return {
            background: (player.rei.unlocked || canReset("rei")) ? ("radial-gradient(circle, #ededed 0%, #ffc1de 100%)") : "#bf8f8f",
        }
    },
    resource: "Luminous Churches",
    row: 3,
    displayRow: 4,
    hotkeys: [
        { key: "L", description: "Shift+L: Reset for Luminous Churches", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    position: 0,
    branches: ["light"],

    baseResource: "Light Tachyons",
    baseAmount() { return player.light.points },

    requires: new Decimal(100000),

    type: "static",
    exponent() {
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) return 1.4;
        return 1.5
    },
    roundUpCost: true,

    autoPrestige() {
        if (layers['rei'].deactivated()) return false;
        return (hasMilestone('etoluna', 3) && player.rei.auto)
    },
    canBuyMax() { return hasMilestone('etoluna', 4)||player['awaken'].current == 'yugamu'||player['awaken'].current == 'rei'||player['awaken'].current == 'etoluna'||player['awaken'].current == 'saya'},
    resetsNothing() { return hasMilestone('etoluna', 5) },

    update(diff) {
        if (inChallenge('rei', 11)) {
            player.points = player.points.sub(player.points.div(10).times(diff)).max(1e-10);
            player.mem.points = player.mem.points.sub(player.mem.points.div(10).times(diff)).max(1e-10);
            player.light.points = player.light.points.sub(player.light.points.div(10).times(diff)).max(1e-10);
            player.dark.points = player.dark.points.sub(player.dark.points.div(10).times(diff)).max(1e-10);
            player.kou.points = player.kou.points.sub(player.kou.points.div(10).times(diff)).max(1e-10);
            player.lethe.points = player.lethe.points.sub(player.lethe.points.div(10).times(diff)).max(1e-10);
        }
        if (inChallenge('rei', 11) || hasMilestone('etoluna', 2)) player.rei.roses = player.rei.roses.plus(layers["rei"].challenges[11].amt().times(diff));
    },

    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone('etoluna', 1) || hasMilestone('saya', 1)) keep.push("milestones");
        if (hasMilestone('etoluna', 3) || (resettingLayer == 'awaken' && player['awaken'].current == null)) keep.push("auto");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset('rei', keep);
            let keepmilestone = [];
            if (hasMilestone('saya', 0)) { keepmilestone = keepmilestone.concat([0]); player[this.layer].total = player[this.layer].total.plus(3) }
            if (hasMilestone('etoluna', 0)) keepmilestone = keepmilestone.concat([0, 1, 2, 3])
            for (var i = 0; i < keepmilestone.length; i++) {
                if (!hasMilestone('rei', keepmilestone[i])) player.rei.milestones.push(keepmilestone[i]);
            }
        }
    },

    gainMult() {
        let mult = new Decimal(1);
        if (hasMilestone('yugamu', 3)) mult = mult.div(buyableEffect('yugamu', 11));
        if (hasUpgrade('world', 23)) mult = mult.div(upgradeEffect('world', 23));
        if (hasUpgrade('world', 31)) mult = mult.div(layers.world.fixedReward());
        if (hasUpgrade('lab', 143)) mult = mult.div(upgradeEffect('lab', 143));
        if (hasUpgrade('storylayer', 32)) mult = mult.div(upgradeEffect('storylayer', 32));
        if (hasUpgrade('lab', 163)) mult = mult.div(buyableEffect('lab', 23));
        if (hasMilestone('ins', 1)) mult = mult.div(layers.ins.insEffect().Fra().Pos());
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) mult = mult.div(tmp["rei"].challenges[11].effectAWtoLCFL); 
        if (player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu')) mult = mult.div(tmp['yugamu'].AWeffect.SWeffect); 
        if(player.fracture.unlocked) {
            if (layers['fracture'].grid.return_Equiped_Equipment_Num(20)>=1) mult=mult.div(player.fracture.ElementEssence).div(layers['fracture'].grid.return_Equiped_Equipment_Num(20)).div(10);
        };
        return mult;
    },
    gainExp() {
        return new Decimal(1)
    },
    directMult() {
        let dm = new Decimal(1);
        if (hasMilestone('ins', 3)) dm = dm.times(layers.ins.insEffect().Egy().Pos());
        return dm;
    },

    layerShown() { return hasAchievement('lab', 21) && hasChallenge('kou', 51) || player[this.layer].unlocked },

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    milestones: {
        0: {
            requirementDescription: "1 total Luminous Church",
            done() { return player.rei.total.gte(1) },
            unlocked() { return player.rei.unlocked },
            effectDescription: "Keep all except last milestones of Red Doll Layer when LC or FL reset.",
        },
        1: {
            requirementDescription: "2 total Luminous Churches",
            done() { return player.rei.total.gte(2) },
            unlocked() { return player.rei.unlocked },
            effectDescription: "Keep last milestones of Red Doll Layer when LC or FL reset, and keep all Happiness Challenges finished.",
        },
        2: {
            requirementDescription: "5 total Luminous Churches",
            done() { return player.rei.total.gte(5) },
            unlocked() { return player.rei.unlocked },
            effectDescription: "Luminous Churches boosts Research Points gain & All random num set to their maxnum.",
        },
        3: {
            requirementDescription: "10 total Luminous Churches",
            done() { return player.rei.total.gte(10) },
            unlocked() { return player.rei.unlocked },
            effectDescription: "Unlock Zero Sky.",
        },
        4: {
            requirementDescription: "5 best Luminous Churches",
            done() { return player.rei.best.gte(5) && hasMilestone('rei', 3) },
            unlocked() { return hasMilestone('rei', 3) },
            effectDescription: "Glowing Roses also boosts Red Dolls and Forgotten Drops gain.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },

    challenges: {
        11: {
            name: "Zero sky",
            unlocked() { return hasMilestone('rei', 3) && !(player.world.currentStepType >= 99 && player.world.restrictChallenge && !hasUpgrade('storylayer', 14)) },
            canComplete() { return false },
            gainMult() {
                let mult = new Decimal(1);
                if (hasMilestone('yugamu', 3)) mult = mult.times(buyableEffect('yugamu', 21));
                if (hasUpgrade('lab', 113)) mult = mult.times(upgradeEffect('lab', 113));
                if (hasUpgrade('world', 33)) mult = mult.times(upgradeEffect('world', 33));
                if (hasUpgrade('lab', 141)) mult = mult.times(upgradeEffect('lab', 141));
                if (hasMilestone('etoluna', 2) && !inChallenge('rei', 11)) mult = mult.times(player.rei.roses.plus(1).log(20).div(50).max(0.01).min(0.5));
                if (hasMilestone('ins', 1)) mult = mult.times(layers.ins.insEffect().Fra().Pos());
                if (hasAchievement('a', 102)) mult = mult.times(layers['saya'].effect());
                if (hasUpgrade('lab', 181)) mult = mult.times(buyableEffect('lab', 23))
                if (player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer)) mult = mult.times(tmp["rei"].challenges[11].effectAWtoRose);
                
                if (player.tempest.activeChallenge!=null) mult = mult.pow(tmp.tempest.nerf_in_challenges.toRoseGain());
                return mult;
            },
            amt() {//gain per sec
                let gain = player.points.plus(1).log10().div(50).max(0).sqrt();
                gain = gain.times(this.gainMult().max(1));
                gain = gain.times(challengeEffect('saya', 41).max(1));
                if (hasUpgrade('light', 43)) gain = gain.times(upgradeEffect('light', 43));
                gain = gain.times(Decimal.pow(2,layers['fracture'].grid.return_Equiped_Equipment_Num(1)+layers['fracture'].grid.return_Equiped_Equipment_Num(4)));
                gain = gain.times(Decimal.pow(10,layers['fracture'].grid.return_Equiped_Equipment_Num(12)));
                return gain;
            },
            onEnter() {
                if (!hasAchievement('a', 75)) player.rei.roses = new Decimal(0);
                else player.rei.roses = player.rei.roses.div(2);
                doReset("mem", true);
                doReset("light", true);
                doReset("dark", true);
                doReset("kou", true);
                doReset("lethe", true);
            },
            onExit() {
                if (inChallenge('saya', 41) || tmp.saya.grid.ChallengeDepth[7]!=-1) { player.rei.roses = new Decimal(0); player.saya.bestroses41 = new Decimal(0); }
            },
            fullDisplay() {
                let show = "Fragment generation & Memory gain ^0.5, and losing 10% of your Fragments, Memories, Light Tachyons, Dark Matters, Red Dolls, Forgotten Drops per second.<br>" + "<br><h3>Glowing Roses</h3>: " + format(player.rei.roses) + " (" + ((inChallenge('rei', 11) || hasMilestone('etoluna', 2)) ? formatWhole(tmp["rei"].challenges[11].amt) : 0) + "/s)" + (hasAchievement('a', 65) ? ("<br>Which are boosting The Speed of World steps gain by " + format(achievementEffect('a', 65)) + "x") : "");
                if (hasMilestone('rei', 4)) show = show + "<br>Red Doll & Forgotten Drop gain by " + format(tmp["rei"].challenges[11].effecttoRF) + "x";
                if (hasUpgrade('storylayer', 12)) show += "<br>Fragment generation & Memory gain by " + format(tmp["rei"].challenges[11].effecttoFragMem) + "x";
                if (hasUpgrade('storylayer', 21)) show += "<br>Light Tachyon & Dark Matter gain by " + format(tmp["rei"].challenges[11].effecttoLD) + "x";
                if (player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer)){
                    show += "<br>Light Tachyon & Dark Matter Effect by " + format(tmp["rei"].challenges[11].effectAWtoLD) + "x"
                    show += "<br>Red Doll & Forgotten Drop Effect by " + format(tmp["rei"].challenges[11].effectAWtoRF) + "x"
                    show += "<br>Gemini Bound & Everflashing Knife gain by " + format(tmp["rei"].challenges[11].effectAWtoGK) + "x"
                    show += "<br>Luminous Church & Flourish Labyrinth gain by " + format(tmp["rei"].challenges[11].effectAWtoLCFL) + "x"
                    show += "<br>Glowing Rose gain by " + format(tmp["rei"].challenges[11].effectAWtoRose) + "x"
                }
                return show;
            },
            effecttoRF() {
                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer) || player[this.layer].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.plus(1).log10().times(2).max(1).times(hasAchievement('a', 93) ? tmp.etoluna.starPointeffect : 1).times(challengeEffect('saya', 41));
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff.max(1);
            },
            effecttoFragMem() {
                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer) || player[this.layer].roses.lte(0)) return new Decimal(1);
                if (!hasUpgrade('storylayer', 12)) return new Decimal(1);
                let eff = upgradeEffect('storylayer', 12);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff.max(1);
            },
            effecttoLD() {
                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer) || player[this.layer].roses.lte(0)) return new Decimal(1);
                if (!hasUpgrade('storylayer', 21)) return new Decimal(1);
                let eff = upgradeEffect('storylayer', 21);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff.max(1);
            },
            effectAWtoLD(){
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);//别的层AW时的反应
                if (!(player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer))) return new Decimal (1);//只有AW了才有效
                if (player[this.layer].roses.lte(0)) return new Decimal(1);
                let eff = Decimal.pow(10,player.rei.roses.max(1).log10().div(100).max(0));
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff.max(1).log(5).max(1);
            },
            effectAWtoRF(){
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);//别的层AW时的反应
                if (!(player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer))) return new Decimal (1);//只有AW了才有效
                if (player[this.layer].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.max(1).log(20);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return softcap(eff.max(1).log(8).max(1),new Decimal(1000),1/3);
            },
            effectAWtoGK(){
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);//别的层AW时的反应
                if (!(player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer))) return new Decimal (1);//只有AW了才有效
                if (player[this.layer].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.max(1).log10().sqrt().times(1.5);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff.max(1).log(5).max(1);
            },
            effectAWtoLCFL(){
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);//别的层AW时的反应
                if (!(player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer))) return new Decimal (1);//只有AW了才有效
                if (player[this.layer].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.max(1).log10().pow(1/1.5).div(10);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff.max(1);
            },
            effectAWtoRose(){
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);//别的层AW时的反应
                if (!(player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer))) return new Decimal (1);//只有AW了才有效
                if (player[this.layer].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.max(1).log(20).div(2.5);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return softcap(eff.max(1),new Decimal(1e10),0.25);
            },
            style() {
                return { 'background-color': "#ffe6f6", color: "#383838", 'border-radius': "25px", height: "400px", width: "400px" }
            }
        }
    },
})

addLayer("yugamu", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0,
            canclickingclickables: [],
            movetimes: new Decimal(0),
            DirectioncanChoose: 1,
            actionpoint: 1,
            timesmoved: new Decimal(0),
            auto: false,
            demile: [],
        }
    },
    name: "Flourish", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FL",
    color: "#716f5e",
    nodeStyle() {
        return {
            background: (player.yugamu.unlocked || canReset("yugamu")) ? ("radial-gradient(circle, #383838 0%,#383838 50%, #5f5911 100%)") : "#bf8f8f",
        }
    },
    resource: "Flourish Labyrinths",
    row: 3,
    displayRow: 4,
    hotkeys: [
        { key: "F", description: "Shift+F: Reset for Flourish Labyrinths", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    position: 4,
    branches: ["dark"],

    baseResource: "Dark Matters",
    baseAmount() { return player.dark.points },

    requires: new Decimal(90000),

    type: "static",
    exponent() {
        if (player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu')) return 1.4;
        return 1.5
    },
    roundUpCost: true,

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
        "Maze": {
            unlocked() { return hasMilestone('yugamu', 3) },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function () { return "You can move " + formatWhole(tmp.yugamu.movetimes) + " times at total." }],
                ["display-text", function () { return "You have moved " + formatWhole(player.yugamu.timesmoved) + " times." }],
                "blank",
                ["row", [["buyable", 11]]],
                ["blank", ["8px", "8px"]],
                ["row", [["buyable", 21], ["blank", ["8px", "8px"]], ["clickable", 11], ["blank", ["8px", "8px"]], ["buyable", 22]]],
                ["blank", ["8px", "8px"]],
                ["row", [["buyable", 31]]],
                "blank",
                //effect display
                ["column", [["display-text", function () { return "You have moved <h3>North</h3> " + formatWhole(player.yugamu.buyables[11]) + " times" }], "blank", ["display-text", function () { return "Which boosts your Luminous Churches & Flourish Labyrinths gain by " + format(buyableEffect('yugamu', 11)) + "x" }]], { width: "100%" }],
                "blank",
                "blank",
                ["row", [
                    ["column", [["display-text", function () { return "You have moved <h3>West</h3> " + formatWhole(player.yugamu.buyables[21]) + " times" }], "blank", ["display-text", function () { return "Which boosts your Glowing Roses gain by " + format(buyableEffect('yugamu', 21)) + "x" }]], { width: "50%" }],
                    ["column", [["display-text", function () { return "You have moved <h3>East</h3> " + formatWhole(player.yugamu.buyables[22]) + " times" }], "blank", ["display-text", function () { return "Which boosts other directions' effect by " + format(buyableEffect('yugamu', 22)) + "x" }]], { width: "50%" }],
                ]],
                "blank",
                "blank",
                ["column", [["display-text", function () { return "You have moved <h3>South</h3> " + formatWhole(player.yugamu.buyables[31]) + " times" }], "blank", ["display-text", function () { return "Which boosts The Speed of World Steps gain by " + format(buyableEffect('yugamu', 31)) + "x" }]], { width: "100%" }],
            ]
        },
        "Direction Synergy":{
            unlocked() { return player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu') },
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text","Direction Synergies are based on the time of two Neighboring directions you move."],
                "blank",
                ["row",[
                    ["column",[
                        ["display-text",()=>{return "<h2>NorthWest Synergy</h2><br>Boost Star Point & Moon Point Effect by "+ format(tmp['yugamu'].AWeffect.NWeffect)+"x"}],
                        "blank",
                        ["display-text",()=>{return "<h2>SouthWest Synergy</h2><br>Boost Luminous Church Gain by "+ format(tmp['yugamu'].AWeffect.SWeffect)+"x"}],
                    ],{'width':'50%'}],
                    ["column",[
                        ["display-text",()=>{return "<h2>NorthEast Synergy</h2><br>Boost Everflashing Knife Effect by "+ format(tmp['yugamu'].AWeffect.NEeffect)+"x"}],
                        "blank",
                        ["display-text",()=>{return "<h2>SouthEast Synergy</h2><br>Boost Flourish Labyrinth Gain by "+ format(tmp['yugamu'].AWeffect.SEeffect)+"x"}],
                    ],{'width':'50%'}],
                ]]
            ],
            buttonStyle:{'backgroundColor':'#716f5e40'}
        },
    },

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    gainMult() {
        let mult = new Decimal(1);
        if (hasMilestone('yugamu', 3)) mult = mult.div(buyableEffect('yugamu', 11));
        if (hasUpgrade('world', 24)) mult = mult.div(upgradeEffect('world', 24));
        if (hasUpgrade('world', 31)) mult = mult.div(layers.world.fixedReward());
        if (hasUpgrade('lab', 144)) mult = mult.div(upgradeEffect('lab', 144));
        if (hasUpgrade('storylayer', 32)) mult = mult.div(upgradeEffect('storylayer', 32));
        if (hasUpgrade('lab', 163)) mult = mult.div(buyableEffect('lab', 33));
        if (hasMilestone('ins', 1)) mult = mult.div(layers.ins.insEffect().Deu().Pos());
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) mult = mult.div(tmp["rei"].challenges[11].effectAWtoLCFL);
        if (player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu')) mult = mult.div(tmp['yugamu'].AWeffect.SEeffect); 
        if (player.fracture.unlocked){
            if (layers['fracture'].grid.return_Equiped_Equipment_Num(21)>=1) mult=mult.div(player['tempest'].milestonePoints.total).div(layers['fracture'].grid.return_Equiped_Equipment_Num(21)).div(25);
        };
        return mult;
    },
    gainExp() {
        return new Decimal(1)
    },
    directMult() {
        let dm = new Decimal(1);
        if (hasMilestone('ins', 3)) dm = dm.times(layers.ins.insEffect().Egy().Pos());
        return dm;
    },
    layerShown() { return hasAchievement('lab', 21) && hasChallenge('kou', 51) || player[this.layer].unlocked },
    autoPrestige() {
        if (layers['yugamu'].deactivated()) return false;
        return (hasMilestone('saya', 3) && player.yugamu.auto)
    },
    canBuyMax() { return hasMilestone('saya', 4)||player['awaken'].current == 'yugamu'||player['awaken'].current == 'rei'||player['awaken'].current == 'rei'||player['awaken'].current == 'etoluna'||player['awaken'].current == 'saya'},
    resetsNothing() { return hasMilestone('saya', 5) },

    milestones: {
        0: {
            requirementDescription: "1 total Flourish Labyrinth",
            done() { return player.yugamu.total.gte(1) },
            unlocked() { return player.yugamu.unlocked },
            effectDescription: "Keep all except last milestones of Forgotten Drop Layer when LC or FL reset.",
        },
        1: {
            requirementDescription: "2 total Flourish Labyrinths",
            done() { return player.yugamu.total.gte(2) },
            unlocked() { return player.yugamu.unlocked },
            effectDescription: "Keep last milestones of Forgotten Drop Layer when LC or FL reset, and now Guiding Scythes are auto bought.",
        },
        2: {
            requirementDescription: "5 total Flourish Labyrinths",
            done() { return player.yugamu.total.gte(5) },
            unlocked() { return player.yugamu.unlocked },
            effectDescription: "Flourish Labyrinth boosts Research Points gain & Keep central 9 Guiding Beacons when reset.",
        },
        3: {
            requirementDescription: "10 total Flourish Labyrinths",
            done() { return player.yugamu.total.gte(10) },
            unlocked() { return player.yugamu.unlocked },
            onComplete() {
                player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(layers.yugamu.DirectioncanChoose());
            },
            effectDescription: "Unlock Maze.",
        },
        4: {
            requirementDescription: "5 best Flourish Labyrinths",
            done() { return player.yugamu.best.gte(5) && hasMilestone('yugamu', 3) },
            unlocked() { return hasMilestone('yugamu', 3) },
            effectDescription: "Your movetime limit now calculated based on total Flourish Labyrinths you gain instead of best Flourish Labyrinths you have.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },

    shouldNotify() {
        let buyableid = [11, 21, 22, 31];
        if (hasUpgrade("storylayer", 15)) return false;
        for (var i = 0; i < buyableid.length; i++) {
            if (tmp.yugamu.buyables[buyableid[i]].canAfford) {
                return true;
            };
        }
    },

    update(diff) {
        if (player.yugamu.actionpoint <= 0) {
            player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(layers.yugamu.DirectioncanChoose());
            player.yugamu.timesmoved = player.yugamu.timesmoved.plus(1);
            player.yugamu.actionpoint = layers.yugamu.actionpoint();
        };


        let buyableid = [11, 21, 22, 31];

        if (layers.yugamu.movetimes().gt(tmp.yugamu.timesmoved) && hasUpgrade('lab', 171)) {
            let buyableid = [11, 21, 22, 31];
            for (var i = 0; i < buyableid.length; i++)player.yugamu.buyables[buyableid[i]] = layers.yugamu.movetimes();
            player.yugamu.timesmoved = layers.yugamu.movetimes();
        };

        for (var i = 0; i < buyableid.length; i++) {
            if (tmp.yugamu.buyables[buyableid[i]].autoed && player.yugamu.canclickingclickables.includes(buyableid[i].toString())&&tmp.yugamu.movetimes.gt(player.yugamu.timesmoved)) {
                layers.yugamu.buyables[buyableid[i]].buy();
            };
        }

    },

    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone('etoluna', 1) || hasMilestone('saya', 1)) keep.push("milestones");
        if (hasMilestone('saya', 3) || (resettingLayer == 'awaken' && player['awaken'].current == null)) keep.push("auto");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset('yugamu', keep);
            let keepmilestone = [];
            if (hasMilestone('etoluna', 0)) { keepmilestone = keepmilestone.concat([0]); player[this.layer].total = player[this.layer].total.plus(3) }
            if (hasMilestone('saya', 0)) keepmilestone = keepmilestone.concat([0, 1, 2, 3])
            for (var i = 0; i < keepmilestone.length; i++) {
                if (!hasMilestone('yugamu', keepmilestone[i])) player.yugamu.milestones.push(keepmilestone[i]);
                if (keepmilestone[i] = 3) player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(layers.yugamu.DirectioncanChoose());
            }
        }
    },

    //AW!
    AWeffect(){
        if (!(player['awaken'].current == this.layer||player['awaken'].awakened.includes(this.layer))) return {NWeffect:new Decimal(1),NEeffect:new Decimal(1),SWeffect:new Decimal(1),SEeffect:new Decimal(1)}
        let NWtime = player.yugamu.buyables[11].times(player.yugamu.buyables[21]).max(1).log(10).floor().max(1);
        let NEtime = player.yugamu.buyables[11].times(player.yugamu.buyables[22]).max(1).log(10).floor().max(1);
        let SWtime = player.yugamu.buyables[31].times(player.yugamu.buyables[21]).max(1).log(10).floor().max(1);
        let SEtime = player.yugamu.buyables[31].times(player.yugamu.buyables[22]).max(1).log(10).floor().max(1);

        let NWeff = Decimal.pow(10,NWtime.div(50))//G的效果

        let NEeff = NEtime.div(50);//K的效果

        let SWeff = SWtime.times(20);//LC获得

        let SEeff = SEtime.times(20);//FL获得

        if(player.fracture.unlocked) {
            NEeff = NEeff.times(Decimal.pow(1.25,layers['fracture'].grid.return_Equiped_Equipment_Num(16)));
            SEeff = SEeff.times(Decimal.pow(5,layers['fracture'].grid.return_Equiped_Equipment_Num(17)));
            SWeff = SWeff.times(Decimal.pow(5,layers['fracture'].grid.return_Equiped_Equipment_Num(18)));
            NWeff = NWeff.times(Decimal.pow(20,layers['fracture'].grid.return_Equiped_Equipment_Num(19)));
        };

        return {
            NWeffect:NWeff,
            NEeffect:NEeff,
            SWeffect:SWeff,
            SEeffect:SEeff,
        }

    },

    //maze releated
    canclickingclickables(n) {//use layers
        let buyableid = ['11', '21', '22', '31'];//TMT原来的clickable返回的不是数组，得单独保存其编号。
        let shouldcanclick = [];

        for (var i = 1; i <= n; i++) {
            randindex = Math.floor(Math.random() * (buyableid.length));//0~数组长-1
            shouldcanclick.push(buyableid[randindex]);
            buyableid.splice(randindex, 1);
        };

        return shouldcanclick
    },

    DirectioncanChoose() {
        let num = 1;
        if (hasAchievement('a', 73)) num = 2;
        if (hasAchievement('a', 82)) num = 3;
        if (hasAchievement('a', 91)) num = 4;
        return num;
    },

    movetimes() {//use tmp
        let mt = player[this.layer].best.times(2);
        if (hasMilestone('yugamu', 4)) mt = player[this.layer].total.times(2);
        if (hasUpgrade('world', 22)) mt = mt.plus(upgradeEffect('world', 22));
        if (hasAchievement('a', 71)) mt = mt.plus(5);
        if (hasUpgrade('lab', 114)) mt = mt.plus(upgradeEffect('lab', 114));
        if (hasUpgrade('lab', 142)) mt = mt.plus(upgradeEffect('lab', 142));
        if (hasMilestone('saya', 2)) mt = mt.plus(10);
        if (hasUpgrade('lab', 182)) mt = mt.plus(upgradeEffect('lab', 182));

        if (hasAchievement('a', 94)) mt = mt.times(2);
        if (hasUpgrade('dark', 43)) mt = mt.times(upgradeEffect('dark', 43));
        if(player.tempest.grid[102].activated) mt = mt.times(gridEffect('tempest',102));

        mt = softcap(mt,new Decimal(3e100),new Decimal(0.25));
        mt = mt.round();

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(0);

        return mt;
    },

    actionpoint() {//use tmp && !use Decimal && use layers when call
        let ap = 1;
        if (hasUpgrade('storylayer', 15)) ap = 4;
        return ap;
    },

    buyables: {
        rows: 3,
        cols: 2,
        11: {
            title: "",
            display: "↑",
            unlocked() { return hasMilestone('yugamu', 3) },
            canAfford() {
                if (this.autoed())return false;
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) return true;
                }
                return false;
            },
            buy() {
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) { player.yugamu.canclickingclickables.splice(i, 1); };
                };
            },
            effect() {
                let eff = player.yugamu.buyables[this.id].div(2).plus(1);
                if (hasUpgrade('lab', 131)) eff = player.yugamu.buyables[this.id].div(1.5).plus(1);
                eff = eff.times(buyableEffect('yugamu', 22));
                if (hasMilestone('ins', 1)) eff = eff.times(layers.ins.insEffect().Deu().Pos());
                if (hasUpgrade('lethe', 81)) eff = eff.times(upgradeEffect('lethe', 81));
                if (hasUpgrade('lethe', 91)) eff = eff.times(upgradeEffect('lethe', 91));
                if (hasUpgrade('lethe', 101)) eff = eff.times(upgradeEffect('lethe', 101));
                if (hasUpgrade('lethe', 102)) eff = eff.times(upgradeEffect('lethe', 102));
                if (hasUpgrade('lethe', 103)) eff = eff.times(upgradeEffect('lethe', 103));

                if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toMazeEff());

                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

                return eff;
            },
            autoed() { return hasUpgrade('storylayer', 15) },
            style: { width: "100px", height: "100px" },
        },
        21: {
            title: "",
            display: "←",
            unlocked() { return hasMilestone('yugamu', 3) },
            canAfford() {
                if (this.autoed())return false;
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) return true;
                }
                return false;
            },
            buy() {
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) { player.yugamu.canclickingclickables.splice(i, 1); };
                };
            },
            effect() {
                let eff = player.yugamu.buyables[this.id].div(20).plus(1);
                if (hasUpgrade('lab', 133)) eff = player.yugamu.buyables[this.id].div(10).plus(1);
                eff = eff.times(buyableEffect('yugamu', 22));
                if (hasMilestone('ins', 1)) eff = eff.times(layers.ins.insEffect().Deu().Pos());
                if (hasUpgrade('lethe', 81)) eff = eff.times(upgradeEffect('lethe', 81));
                if (hasUpgrade('lethe', 91)) eff = eff.times(upgradeEffect('lethe', 91));
                if (hasUpgrade('lethe', 101)) eff = eff.times(upgradeEffect('lethe', 101));
                if (hasUpgrade('lethe', 102)) eff = eff.times(upgradeEffect('lethe', 102));
                if (hasUpgrade('lethe', 103)) eff = eff.times(upgradeEffect('lethe', 103));

                if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toMazeEff());

                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

                return eff;
            },
            autoed() { return hasUpgrade('storylayer', 15) },
            style: { width: "100px", height: "100px" },
        },
        22: {
            title: "",
            display: "→",
            unlocked() { return hasMilestone('yugamu', 3) },
            canAfford() {
                if (this.autoed())return false;
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) return true;
                }
                return false;
            },
            buy() {
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) { player.yugamu.canclickingclickables.splice(i, 1); };
                };
            },
            effect() {
                let eff = player.yugamu.buyables[this.id].div(50).plus(1);
                if (hasUpgrade('lab', 132)) eff = player.yugamu.buyables[this.id].div(25).plus(1);
                if (hasMilestone('ins', 1)) eff = eff.times(layers.ins.insEffect().Deu().Pos());
                if (hasUpgrade('lethe', 81)) eff = eff.times(upgradeEffect('lethe', 81));
                if (hasUpgrade('lethe', 91)) eff = eff.times(upgradeEffect('lethe', 91));
                if (hasUpgrade('lethe', 101)) eff = eff.times(upgradeEffect('lethe', 101));
                if (hasUpgrade('lethe', 102)) eff = eff.times(upgradeEffect('lethe', 102));
                if (hasUpgrade('lethe', 103)) eff = eff.times(upgradeEffect('lethe', 103));

                if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toMazeEff());

                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

                return eff;
            },
            autoed() { return hasUpgrade('storylayer', 15) },
            style: { width: "100px", height: "100px" },
        },
        31: {
            title: "",
            display: "↓",
            unlocked() { return hasMilestone('yugamu', 3) },
            canAfford() {
                if (this.autoed())return false;
                if (tmp.yugamu.movetimes.lte(player.yugamu.timesmoved)) return false;
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) return true;
                }
                return false;
            },
            buy() {
                player.yugamu.actionpoint = player.yugamu.actionpoint - 1;
                player.yugamu.buyables[this.id] = player.yugamu.buyables[this.id].plus(1);
                for (var i = 0; i < player.yugamu.canclickingclickables.length; i++) {
                    if (this.id == player.yugamu.canclickingclickables[i]) { player.yugamu.canclickingclickables.splice(i, 1); };
                };
            },
            effect() {
                let eff = player.yugamu.buyables[this.id].div(5).plus(1);
                if (hasUpgrade('lab', 134)) eff = player.yugamu.buyables[this.id].div(4).plus(1);
                eff = eff.times(buyableEffect('yugamu', 22));
                if (hasMilestone('ins', 1)) eff = eff.times(layers.ins.insEffect().Deu().Pos());
                if (hasUpgrade('lethe', 81)) eff = eff.times(upgradeEffect('lethe', 81));
                if (hasUpgrade('lethe', 91)) eff = eff.times(upgradeEffect('lethe', 91));
                if (hasUpgrade('lethe', 101)) eff = eff.times(upgradeEffect('lethe', 101));
                if (hasUpgrade('lethe', 102)) eff = eff.times(upgradeEffect('lethe', 102));
                if (hasUpgrade('lethe', 103)) eff = eff.times(upgradeEffect('lethe', 103));

                if (player.tempest.activeChallenge!=null) eff = eff.pow(tmp.tempest.nerf_in_challenges.toMazeEff());

                //AW
                if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

                return eff;
            },
            autoed() { return hasUpgrade('storylayer', 15) },
            style: { width: "100px", height: "100px" },
        },
    },
    clickables: {
        11: {
            title: "Mental Breakdown",
            display: "",
            unlocked() { return hasMilestone('yugamu', 3) },
            canClick() { return player.yugamu.timesmoved.gt(0) },
            onClick() {
                if (!confirm("It's okay to be mad when you get lost in the Maze……But are you sure there is no other way out?")) return;
                player.yugamu.timesmoved = new Decimal(0);
                player.yugamu.actionpoint = layers.yugamu.actionpoint();
                player.yugamu.buyables[11] = new Decimal(0);
                player.yugamu.buyables[21] = new Decimal(0);
                player.yugamu.buyables[22] = new Decimal(0);
                player.yugamu.buyables[31] = new Decimal(0);
                player.yugamu.canclickingclickables = layers.yugamu.canclickingclickables(layers.yugamu.DirectioncanChoose());
            },
            style: { width: "150px", height: "150px" },
        },
    },
})

addLayer("world", {
    name: "World", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            unlockOrder: 0,
            WorldstepHeight: new Decimal(10),//Do not use player.world.WorldstepHeight
            Worldtimer: new Decimal(0),
            StepgrowthSpeed: new Decimal(1),//per second
            fixednum: new Decimal(0),
            restrictionnum: new Decimal(0),
            currentStepType: 0,//not Decimal
            Worldrandomnum: 0,//not Decimal
            restrictChallenge: false,
        }
    },
    resource: "World Steps",
    color: "#ddeee3",
    nodeStyle() {
        return {
            background: (player.world.unlocked || canReset("world")) ? ("linear-gradient(#ededed, #383838)") : "#bf8f8f",
            //"background-size":"120px 120px",
            height: "96px",
            width: "96px",
            "border": "0px",
            "outline": "rgb(100,100,100) solid 4px",
        }
    },
    type: "none", // 怹也不通过重置获得点数,但是怹应该会被重置
    branches: ["mem"],

    row: 3, // Row the layer is in on the tree (0 is the first row)
    displayRow: 2,
    position: 2,
    layerShown() { return hasAchievement('a', 64) },
    unlocked() { return hasUpgrade('lab', 101) },

    shouldNotify() {
        return (player.world.currentStepType >= 99 && !player.world.restrictChallenge);
    },

    doReset(resettingLayer) {
        let keep = [];
        let temppoints = player[this.layer].points;
        if (hasAchievement('a', 95)) { keep.push("fixednum"); keep.push("restrictionnum"); }
        if (hasAchievement('a', 94)) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset('world', keep);
            if (hasMilestone('saya', 6)) player[this.layer].points = temppoints.div(2);
        }
    },

    bars: {
        WorldProgressBar: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress() { return player.world.Worldtimer.div(tmp["world"].WorldstepHeight) },
            barcolor() {
                if (player.world.currentStepType < 75) return '#ddeee3';
                else if (player.world.currentStepType < 87) return '#bc24cb';
                else if (player.world.currentStepType < 99) return '#eec109';
                else return '#e8272a';
            },
            fillStyle() { return { 'background-color': layers.world.bars.WorldProgressBar.barcolor() } },
        },
    },

    WorldstepHeight() {
        let base = new Decimal(10);
        let step = base.times(player.world.points.plus(1));
        if (hasAchievement('a', 93)) step = step.div(tmp.etoluna.moonPointeffect);
        if (hasUpgrade('a', 163)) step = step.div(buyableEffect('lab', 43));
        if (hasUpgrade('lethe', 73)) step = step.div(upgradeEffect('lethe', 73));
        if (hasUpgrade('lethe', 84)) step = step.div(upgradeEffect('lethe', 84));
        if (step.gte(layers.world.WorldstepHeightsc())) step = Decimal.pow(step.sub(layers.world.WorldstepHeightsc()), layers.world.WorldstepHeightscexp()).plus(layers.world.WorldstepHeightsc());
        if (step.lt(10)) step = new Decimal(10);
        return step;
    },

    WorldstepHeightsc() {
        let sc = new Decimal(100000);
        if (hasUpgrade('etoluna', 12)) sc = sc.times(tmp.etoluna.moonPointeffect);
        if (hasMilestone('ins', 6)) sc = sc.times(layers.ins.insEffect().Zaf());
        if (hasUpgrade('lethe', 82)) sc = sc.times(upgradeEffect('lethe',82));
        if (hasUpgrade('lethe', 83)) sc = sc.times(upgradeEffect('lethe',83));
        if (hasUpgrade('lethe', 93)) sc = sc.times(upgradeEffect('lethe',93));
        return sc;
    },

    WorldstepHeightscexp() {
        let exp = new Decimal(3);
        if (hasUpgrade('storylayer', 31)) exp = new Decimal(2);
        if (hasUpgrade('lab', 162)) exp = exp.sub(upgradeEffect('lab', 162));
        return exp.max(1.5);
    },

    StepgrowthSpeed() {
        let speed = new Decimal(1);
        if (player.world.currentStepType >= 99 && player.world.restrictChallenge) {
            if (!hasUpgrade('storylayer', 11)) return (player.points.plus(1).log10().div(2));
            else speed = player.points.plus(1).log10().div(1500);
        };
        if (hasUpgrade('world', 12)) speed = speed.times(2);
        if (hasUpgrade('world', 13)) speed = speed.times(upgradeEffect('world', 13));
        if (hasUpgrade('world', 14)) speed = speed.times(upgradeEffect('world', 14));
        if (hasAchievement('a', 65)) speed = speed.times(achievementEffect('a', 65));
        if (hasMilestone('yugamu', 3)) speed = speed.times(buyableEffect('yugamu', 31));
        if (hasAchievement('a', 72)) speed = speed.times(1.5);
        if (hasAchievement('a', 74)) speed = speed.times(achievementEffect('a', 74));
        if (hasUpgrade('lab', 123)) speed = speed.times(upgradeEffect('lab', 123));
        if (hasUpgrade('lab', 124)) speed = speed.times(upgradeEffect('lab', 124));
        if (hasMilestone('saya', 7)) speed = speed.times(tmp.saya.effect);
        if (hasUpgrade('etoluna', 11)) speed = speed.times(upgradeEffect('etoluna', 11));
        if (hasUpgrade('lethe', 74)) speed = speed.times(upgradeEffect('lethe', 74));
        if (hasUpgrade('lethe', 92)) speed = speed.times(upgradeEffect('lethe', 92));
        if (player.world.currentStepType < 87 && player.world.currentStepType >= 75) {
            if (hasUpgrade('storylayer', 13)) speed = speed.times(2);
            else speed = speed.times(1 + player.world.Worldrandomnum);
        };
        if (player.world.currentStepType < 99 && player.world.currentStepType >= 87) {
            if (hasUpgrade('storylayer', 13)) speed = speed.times(0.75);
            else speed = speed.times(Math.min(1 - player.world.Worldrandomnum * 0.99, 0.75));
        }
        if (hasUpgrade('world', 34) && speed.lt(upgradeEffect('world', 34))) speed = upgradeEffect('world', 34);
        if (player.world.currentStepType >= 99 && !player.world.restrictChallenge) speed = new Decimal(0);
        return speed;
    },

    fixedReward() {
        let softcap = layers[this.layer].fixedsoftcap();
        let softcappower = layers[this.layer].fixedsoftcapexp();
        let reward = player.world.fixednum.div(2).plus(1);
        if (reward.gte(softcap)) reward = softcap.plus(Decimal.pow(reward.sub(softcap), softcappower));
        return reward;
    },

    fixedsoftcap() {
        let softcap = new Decimal(500);
        if (hasUpgrade('etoluna', 13)) softcap = softcap.times(upgradeEffect('etoluna', 13));
        if (player['tempest'].grid[203].activated) softcap = softcap.times(gridEffect('tempest',203))
        return softcap;
    },
    fixedsoftcapexp() {
        let softcappower = 0.25;
        if (hasUpgrade('etoluna', 22)) softcappower *= tmp["etoluna"].moonPointeffect.toNumber();
        if (softcappower > 0.75) softcappower = 0.75;
        return softcappower;
    },

    restrictReward() {
        let softcap = layers[this.layer].restrictsoftcap();
        let hardcap = layers[this.layer].restricthardcap();
        let softcappower = layers[this.layer].restrictsoftcapexp();
        let reward = Decimal.pow(1.5, player.world.restrictionnum);
        if (reward.gte(softcap)) reward = softcap.plus(Decimal.pow(reward.sub(softcap), softcappower));
        if (!hasUpgrade('storylayer', 43)) { return reward.min(hardcap); }
        else {
            if (reward.gte(hardcap)) reward = reward.sub(hardcap).max(1).log(10).max(1).log(10).max(0).times(hardcap).plus(hardcap);
            return reward;
        }
    },

    restrictsoftcap() {
        let softcap = new Decimal(20);
        if (hasAchievement('a', 83)) softcap = new Decimal(25);
        return softcap;
    },

    restrictsoftcapexp() {
        let softcappower = 0.25;
        return softcappower;
    },

    restricthardcap() {
        let hardcap = new Decimal(150)
        if (hasUpgrade('etoluna', 14)) hardcap = hardcap.times(tmp["etoluna"].moonPointeffect);
        if (hasUpgrade('etoluna', 21)) hardcap = hardcap.times(upgradeEffect('etoluna', 21));
        if (hasUpgrade('lab', 193)) hardcap = hardcap.times(upgradeEffect('lab', 193));
        return hardcap;
    },

    update(diff) {//重头戏
        if (!player.world.unlocked) player.world.Worldtimer = new Decimal(0);
        player.world.Worldtimer = player.world.Worldtimer.plus(tmp["world"].StepgrowthSpeed.times(diff));
        if (player.world.Worldtimer.gte(tmp["world"].WorldstepHeight)) {

            if (player.world.currentStepType < 99 && player.world.currentStepType >= 87) player.world.fixednum = player.world.fixednum.plus(Decimal.times(1, upgradeEffect('storylayer', 24)).times(hasMilestone('etoluna', 6) ? (player.world.Worldtimer.div(tmp["world"].WorldstepHeight).max(1).min(player[this.layer].points)) : 1));
            if (player.world.currentStepType >= 99) { player.world.restrictionnum = player.world.restrictionnum.plus(Decimal.times(1, upgradeEffect('storylayer', 24)).times(hasMilestone('etoluna', 6) ? (player.world.Worldtimer.div(tmp["world"].WorldstepHeight).max(1).min(player[this.layer].points)) : 1)); player.world.restrictChallenge = false; };
            player[this.layer].points = player[this.layer].points.plus(Decimal.times(1, upgradeEffect('storylayer', 24)).times(hasMilestone('etoluna', 6) ? (player.world.Worldtimer.div(tmp["world"].WorldstepHeight).max(1).min(player[this.layer].points.max(1))) : 1));
            player.world.Worldtimer = new Decimal(0);
            if (hasUpgrade('world', 31)) player.world.currentStepType = Math.floor(Math.random() * (100));//0~99
            player.world.Worldrandomnum = Math.random();
        };
        if (hasUpgrade('storylayer', 14) && player.world.currentStepType >= 99 && !player.world.restrictChallenge) player.world.restrictChallenge = !player.world.restrictChallenge;

        if (player[this.layer].points.gte(player[this.layer].best)) player[this.layer].best = player[this.layer].points;
    },

    tabFormat: {
        Upgrades: {
            content: [
                "blank",
                "main-display",
                "blank",
                "resource-display",
                "blank",
                ["bar", "WorldProgressBar"],
                ["display-text", function () { return formatWhole(player.world.Worldtimer) + " / " + formatWhole(tmp["world"].WorldstepHeight) + " Step Height" }, {}],
                ["display-text", function () { if (tmp["world"].WorldstepHeight.gte(layers.world.WorldstepHeightsc())) return "You have reached World Step Height softcap and exceeding height ^" + format(layers.world.WorldstepHeightscexp()) }, {}],
                ["display-text",
                    function () {
                        if (player.world.currentStepType < 75) return "";
                        if (player.world.currentStepType < 87 && player.world.currentStepType >= 75) return ("You are going through random World Step. Current speed: " + format(((hasUpgrade('storylayer', 13)) ? 2 : (1 + player.world.Worldrandomnum))*((player.tempest.grid[203].activated)?gridEffect('tempest',203).toNumber():1)) + "x");
                        if (player.world.currentStepType < 99 && player.world.currentStepType >= 87) return ("You are going through fixed World Step. Current speed: " + format((hasUpgrade('storylayer', 13)) ? 0.75 : (Math.min(1 - player.world.Worldrandomnum * 0.99, 0.75))) + "x")
                        if (player.world.currentStepType >= 99) {
                            if (!player.world.restrictChallenge) return "You need to Enduring a small Challenge to go through restricted World Step."
                            else return ("You are going through restricted World Step.<br>" + ((hasUpgrade('storylayer', 14)) ? "" : "Your Fragments generation & Memories gain ^0.9 & ") + "The Speed of World Steps gain is " + ((hasUpgrade('storylayer', 11)) ? "based on" : "determined by") + " your Fragments.")
                        };
                    }
                    , {}],
                "blank",
                "upgrades",
                "clickables",
            ]
        },
        Atlas: {
            unlocked() { return hasUpgrade("world", 31) || hasAchievement('a', 95) },
            content: [
                "blank",
                "main-display",
                "blank",
                "resource-display",
                "blank",
                ["bar", "WorldProgressBar"],
                ["display-text", function () { return formatWhole(player.world.Worldtimer) + " / " + formatWhole(tmp["world"].WorldstepHeight) + " Step Height" }, {}],
                "blank",
                ["row", [
                    ["column", [
                        ["display-text", function () { return "You have gone through <h3 style='color: #eec109;'>" + formatWhole(player.world.fixednum) + "</h3> fixed World Steps." }, {}],
                        "blank",
                        ["display-text", function () { return "Which boosts Luminous Churches&Flourish Labyrinths gain by <h3 style='color: #eec109;'>" + format(layers.world.fixedReward()) + "</h3>x" }, {}],
                        "blank",
                    ], { width: "50%" }],
                    ["column", [
                        ["display-text", function () { return "You have gone through <h3 style='color: #e8272a;'>" + formatWhole(player.world.restrictionnum) + "</h3> restricted World Steps." }, {}],
                        "blank",
                        ["display-text", function () { return "Which boosts Research Points gain by <h3 style='color: #e8272a;'>" + format(layers.world.restrictReward()) + "</h3>x" }, {}],
                        "blank",
                    ], { width: "50%" }],]
                    , {}],
            ],
        },
    },

    upgrades: {
        11: {
            title: "Researching World",
            description: "World Steps boosts Research Power gain",
            unlocked() { return player.world.unlocked },
            cost() { return new Decimal(5) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                let eff = player.world.points.div(10).plus(1);
                return eff;
            }
        },
        12: {
            title: "Draft Map",
            description: "the speed of World Steps gain x2",
            unlocked() { return hasUpgrade('world', 11) },
            cost() { return new Decimal(5) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
        },
        13: {
            title: "Visiting Churches",
            description: "Luminous Churches boosts the speed of World Steps gain.",
            fullDisplay: "<b>Visiting Churches</b><br>Luminous Churches boosts the speed of World Steps gain.<br>Cost: 10 World Steps<br>3 Luminous Churches",
            unlocked() { return hasUpgrade('world', 12) },
            canAfford() {
                return player[this.layer].points.gte(10) && player.rei.points.gte(3);
            },
            pay() {
                player[this.layer].points = player[this.layer].points.sub(10);
                player.rei.points = player.rei.points.sub(3)
            },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                let eff = player.rei.points.div(10).plus(1);
                return eff;
            }
        },
        14: {
            title: "Exploring Labyrinths",
            description: "Flourish Labyrinths boosts the speed of World Steps gain.",
            fullDisplay: "<b>Exploring Labyrinths</b><br>Flourish Labyrinths boosts the speed of World Steps gain.<br>Cost: 10 World Steps<br>3 Flourish Labyrinths",
            unlocked() { return hasUpgrade('world', 12) },
            canAfford() {
                return player[this.layer].points.gte(10) && player.yugamu.points.gte(3);
            },
            pay() {
                player[this.layer].points = player[this.layer].points.sub(10);
                player.yugamu.points = player.yugamu.points.sub(3)
            },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                let eff = player.yugamu.points.div(10).plus(1);
                return eff;
            }
        },
        21: {
            title: "Preliminary Report",
            description: "Unlock World Research in the lab.",
            unlocked() { return hasUpgrade('world', 13) && hasUpgrade('world', 14) },
            cost() { return new Decimal(20) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
        },
        22: {
            title: "Upland",
            description: "World Steps gives you extra move in the Maze.",
            unlocked() { return hasUpgrade('world', 21) },
            cost() { return new Decimal(30) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                let eff = player[this.layer].points.div(5).sqrt();
                if (hasUpgrade('world', 32)) eff = player[this.layer].best.div(5).sqrt();
                return eff;
            },
        },
        23: {
            title: "Sight From Godess",
            description: "World Steps boosts Luminous Churches gain.",
            unlocked() { return hasUpgrade('world', 22) },
            cost() { return new Decimal(40) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                return player[this.layer].points.div(10).max(1);
            },
        },
        24: {
            title: "Sight inside Chaoz",
            description: "World Steps boosts Flourish Labyrinths gain.",
            unlocked() { return hasUpgrade('world', 22) },
            cost() { return new Decimal(40) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                return player[this.layer].points.div(10).max(1);
            },
        },
        31: {
            title: "Restriction with Possibilities",
            description: "Unlock more types of World Steps.",
            unlocked() { return hasUpgrade('world', 23) && hasUpgrade('world', 24) },
            cost() { return new Decimal(50) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
        },
        32: {
            title: "Everest",
            description: "Upland now gives extra move in maze based on your best World Steps you have.",
            unlocked() { return hasUpgrade('world', 31) },
            cost() { return new Decimal(75) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
        },
        33: {
            title: "Babel Tower",
            description: "World Steps boost Glowing Roses gain.",
            unlocked() { return hasUpgrade('world', 32) },
            cost() { return new Decimal(100) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                return player[this.layer].points.sqrt().div(50).plus(1);
            },
        },
        34: {
            title: "Backtracking Method",
            description: "The minium Speed of World Steps gain now determined by times moved in Maze, regardless of magnification.",
            unlocked() { return hasUpgrade('world', 32) },
            cost() { return new Decimal(100) },
            onPurchase() {
                player.world.Worldtimer = new Decimal(0);
            },
            effect() {
                return player.yugamu.timesmoved.sqrt().times(2).max(1);
            },
        },
    },
    clickables: {
        //rows: 1,
        //cols: 1,
        11: {
            title: "Enduring Restriction Challenge",
            display() {
                if (hasUpgrade('storylayer', 14)) return "Automated";
                return ((player.world.currentStepType >= 99 && !inChallenge('rei', 11)) ? (player.world.restrictChallenge ? "In" : "Out") : ((inChallenge('rei', 11)) ? "Locked due to Zero Sky" : "Locked"))
            },
            unlocked() { return hasUpgrade('world', 31) },
            canClick() { return (player.world.currentStepType >= 99 && !inChallenge('rei', 11) && !hasUpgrade('storylayer', 14)) },
            onClick() {
                if (player.world.restrictChallenge) player.world.Worldtimer = new Decimal(0);
                if (!player.world.restrictChallenge) {
                    player.points = new Decimal(0);
                    doReset('mem', true);
                    doReset('light', true);
                    doReset('dark', true);
                };
                player.world.restrictChallenge = !player.world.restrictChallenge;
            },
            style: { "background-color"() { return player.world.restrictChallenge ? "#e8272a" : "#666666" } },
        },
        12: {
            title: "Fall Down",
            display: "Lose 20% of your World Steps.",
            unlocked() { return player.world.points.gte(10) },
            canClick() { return player.world.points.gte(10) },
            onClick() {
                if (!confirm("This button is designed to go through restriction World Step quickly, but it can cost much! Are you sure?")) return;
                player.world.points = player.world.points.times(0.8).floor();
            },
        },
    },

})


addLayer("saya", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            Timer41: new Decimal(0),
            bestroses41: new Decimal(0),
            unlockOrder: 0,
            auto: false,
            demile: [],
            decha: [],
            CurrentPairChallenge:null,
            FallbackPair:false,
        }
    },

    name: "Knife",
    symbol: "K",
    color: "#16a951",
    resource: "Everflashing Knives",
    row: 4,
    displayRow: 1,
    position: 5,
    hotkeys: [
        { key: "k", description: "K: Reset for Everflashing Knives", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    branches: ["lethe"],

    baseResource: "Forgotten Drops",
    baseAmount() { return player.lethe.points },

    requires() {
        let cost = new Decimal(1e220);
        if (inChallenge('kou', 21)) cost = cost.pow(1.05);
        return cost
    },

    type: "static",
    exponent: 1.5,
    base: 2,

    gainMult() {//static层
        let mult=new Decimal(1);
        if (player.lethe.buyables[21].unlocked) mult = mult.div(buyableEffect('lethe', 21));
        if(hasUpgrade('lethe',72)) mult=mult.div(upgradeEffect('lethe',72));
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) mult = mult.div(tmp["rei"].challenges[11].effectAWtoGK);                    
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    canBuyMax() { return hasMilestone('ins', 2) },

    layerShown() { return hasUpgrade('storylayer', 23) },

    effect() {
        let eff = new Decimal(1);
        eff = eff.plus(player[this.layer].points.div(10));
        if (player['awaken'].awakened.includes(this.layer)||player['awaken'].current == this.layer ) eff = eff.times(1.25);
        if (hasUpgrade('dark', 44)) eff = eff.times(upgradeEffect('dark', 44))
        if (hasUpgrade('lethe', 61)) eff = eff.times(upgradeEffect('lethe', 61))
        if (hasUpgrade('lethe', 62)) eff = eff.times(upgradeEffect('lethe',62))
        if (hasUpgrade('lethe', 71)) eff = eff.times(upgradeEffect('lethe',71))
        if (hasChallenge('kou', 91)) eff = eff.times(challengeEffect('kou',91))
        if (player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu')) eff = eff.times(tmp['yugamu'].AWeffect.NEeffect); 
        if (player['awaken'].awakened.includes(this.layer)) eff = eff.times(tmp.saya.grid.ChallengeEffect.toKeff);

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

        return eff;
    },
    effectDescription() {
        let show = "which are directly boosting ";
        if (inChallenge('kou', 61)) show += "Gemini Bounds gain by ";
        else show += "Red Dolls and Forgotten Drops gain by ";
        show += format(layers['saya'].effect()) + "x";
        return show;
    },

    shouldNotify(){
        if (player[this.layer].CurrentPairChallenge !=null)
            if (player.points.gte(tmp.saya.grid.ChallengeTarget.frag)||player.mem.points.gte(tmp.saya.grid.ChallengeTarget.mem))
                return true;
    },

    update(diff) {
        if (inChallenge('saya', 41) || tmp.saya.grid.ChallengeDepth[7]!=-1) {
            if (player.rei.roses.gt(player.saya.bestroses41) && !inChallenge('rei', 11)) player.saya.bestroses41 = player.rei.roses;
            player.saya.Timer41 = player.saya.Timer41.plus(diff);
            if (player.saya.Timer41.gte(layers.saya.challenges[41].debuff())) {
                doReset("saya", true);

                player.saya.Timer41 = new Decimal(0);
            }
        }
        else player.saya.Timer41 = new Decimal(0);

        if (inChallenge('saya', 42) || tmp.saya.grid.ChallengeDepth[8]!=-1) {
            if (!player.light.auto) player.light.auto = true;
            if (!player.dark.auto) player.dark.auto = true;
        }
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone('ins', 0)) keep.push('milestones');
        if (hasMilestone('ins', 1)) keep.push('challenges');
        if (hasMilestone('ins', 4)) keep.push('auto');
        if (hasMilestone('tempest', 2)) keep.push('grid');
        if (layers[resettingLayer].row > this.row) layerDataReset('saya', keep);
    },
    autoPrestige() {
        if (layers["saya"].deactivated()) return false;
        return hasMilestone('ins', 4) && player.saya.auto
    },
    resetsNothing() { return hasMilestone('ins', 5) },

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].decha.length == 0) player[this.layer].decha = player[this.layer].challenges;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].decha.length != 0) { player[this.layer].challenges = player[this.layer].decha; player[this.layer].decha = [] };
            for (id in player[this.layer].challenges)
                if (player[this.layer].challenges[id]==null) player[this.layer].challenges[id] = 0;
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
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
        "Memories Adjustment": {
            unlocked() { return player.saya.unlocked&&player.saya.CurrentPairChallenge==null },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "resource-display",
                "blank", "challenges"]
        },
        "Merge Attachment":{
            unlocked() { return player['awaken'].awakened.includes('saya') },
            buttonStyle() { return { 'background-color': '#0a4d25' } },
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text",function () {
                    let desc = ""
                    if (player.saya.CurrentPairChallenge == null){
                        desc = "Choose a Merge Attachment below."
                        desc += "<br>The number 'ab' means you will endure Memory Adjustment Challenge a 4 times, and b the times you completed this Merge Attachment."
                        desc += "<br>Right now, you have completed <h3>"+formatWhole(tmp.saya.grid.Sum_All_times)+"</h3> Merge Attachment in total."
                        desc += "<br>Which..."
                        desc += ("<br><br>Boosts Everflashing Knives' Effect by x"+format(tmp.saya.grid.ChallengeEffect.toKeff));
                        desc += ("<br>Boosts GE & FO gain by x"+format(tmp.saya.grid.ChallengeEffect.toGEFO));
                        desc += ("<br>Boosts All (Except <b>Searching For Essence</b>) Memory Adjustments' Effect by x"+format(tmp.saya.grid.ChallengeEffect.toKcha));
                    }
                    else{
                        let rowNum = Math.floor(player.saya.CurrentPairChallenge/100)
                        let colNum = player.saya.CurrentPairChallenge % 100;
                        desc = "Now you are Enduring Merge Attachment <h2>" + rowNum + colNum + "</h2>x"+player.saya.grid[player.saya.CurrentPairChallenge]
                        desc += "<br>Which means...<br>"
                        for (index in tmp.saya.grid.ChallengeDepth)
                            if (tmp.saya.grid.ChallengeDepth[index]>-1)
                            switch(index){
                                case '1':desc+=("<br>Light Tachyons effect ^" + format(layers['saya'].challenges[11].debuff())); break;
                                case '2':desc+=("<br>Dark Matters effect ^" + format(layers['saya'].challenges[12].debuff())); break;
                                case '3':desc+=("<br>Fragment generation ^^" + format(layers['saya'].challenges[21].debuff())); break;
                                case '4':desc+=("<br>Memory gain ^^" + format(layers['saya'].challenges[22].debuff())); break;
                                case '5':desc+=("<br>Red Dolls effect ^" + format(layers['saya'].challenges[31].debuff())); break;
                                case '6':desc+=("<br>Remove all your Guilding Beacons, and you can have " + formatWhole(layers['saya'].challenges[32].debuff()) + " Guilding Beacons at most."); break;
                                case '7':desc+=("<br>Force a row5 reset every " + format(layers['saya'].challenges[41].debuff()) + " seconds"); break;
                                case '8':desc+=("<br>Dark Matter effect reduces Light Tachyons gain&direct gain by log" + format(layers['saya'].challenges[42].debuff()) + " and force open L&D's autobuyer."); break;
                                default:desc+="<br>I don't know what's this."
                            }
                        desc +=("<br><br>...Also:<br>^"+format(tmp.saya.grid.ChallengeDebuff.frag)+" on Fragment generation<br>^"+format(tmp.saya.grid.ChallengeDebuff.mem)+" on Memory gain<br>Due to <h3>"+formatWhole(tmp.saya.grid.Sum_All_times)+"</h3> Merge Attachment you completed in total.");
                        desc +=("<br>You need to reach "+format(tmp.saya.grid.ChallengeTarget.frag)+" Fragments or "+format(tmp.saya.grid.ChallengeTarget.mem)+" Memories to complete this Merge Attachment.")

                    }
                    return desc;
                },{}],
                "blank",
                "grid",
                ["clickable",11],
            ]
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 Everflashing Knife",
            done() { return player.saya.best.gte(1) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "Keep All but last milestones of FL layer & 1st milestone of LC layer.<br>And you are considered have made a total of 3 Luminous Churches.",
        },
        1: {
            requirementDescription: "2 Everflashing Knives",
            done() { return player.saya.best.gte(2) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "Keep the rest of LC & FL milestones.",
        },
        2: {
            requirementDescription: "3 Everflashing Knives",
            done() { return player.saya.best.gte(3) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "Give 10 more base move times in Maze.",
        },
        3: {
            requirementDescription: "5 Everflashing Knives",
            done() { return player.saya.best.gte(5) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "Unlock Flourish Labyrinths Autobuyer.",
        },
        4: {
            requirementDescription: "10 Everflashing Knives",
            done() { return player.saya.best.gte(10) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "You can buy max Flourish Labyrinths.",
        },
        5: {
            requirementDescription: "15 Everflashing Knives",
            done() { return player.saya.best.gte(15) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "Flourish Labyrinth layer resets nothing.",
        },
        6: {
            requirementDescription: "25 Everflashing Knives",
            done() { return player.saya.best.gte(25) },
            unlocked() { return player.saya.unlocked },
            effectDescription: "Keep half of your World Steps when reset.",
        },
        7: {
            requirementDescription: "30 Everflashing Knives",
            done() { return player.saya.best.gte(30) },
            unlocked() { return hasMilestone('saya', 6) },
            effectDescription: "Everflashing Knives also effects the Speed of World Step gain.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },

    challenges: {
        cols: 2,
        11: {
            name: "Enlighting Memories",
            completionLimit: 5,
            challengeDescription() {
                let des = "Light Tachyons effect ^" + format(layers[this.layer].challenges[this.id].debuff());
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[1]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[1],0):challengeCompletions(this.layer, this.id)
                return 0.5 - (ChallengeDepth * 0.05);
            },
            rewardEffect() {
                let eff = Decimal.pow(2, challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(4, challengeCompletions(this.layer, this.id)).times(tmp.saya.grid.ChallengeEffect.toKcha);
                return eff
            },
            unlocked() { return player.saya.unlocked || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal("1e4150").times(Decimal.pow(1e50, challengeCompletions(this.layer, this.id)))
                return new Decimal(1e195).times(Decimal.pow(1e5, challengeCompletions(this.layer, this.id))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription() { return "Light Tachyons effect x" + format(challengeEffect(this.layer, this.id)) },
        },
        12: {
            name: "Insane Moment",
            completionLimit: 5,
            challengeDescription() {
                let des = "Dark Matters effect ^" + format(layers[this.layer].challenges[this.id].debuff());
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[2]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[2],0):challengeCompletions(this.layer, this.id)
                return 0.5 - (ChallengeDepth * 0.05);
            },
            rewardEffect() {
                let eff = Decimal.pow(3, challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(5, challengeCompletions(this.layer, this.id)).times(tmp.saya.grid.ChallengeEffect.toKcha);
                return eff
            },
            unlocked() { return player[this.layer].best.gte(2) || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal("1e4050").times(Decimal.pow(1e50, challengeCompletions(this.layer, this.id)))
                return new Decimal(1e195).times(Decimal.pow(1e5, challengeCompletions(this.layer, this.id))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription() { return "Dark Matters effect x" + format(challengeEffect(this.layer, this.id)) },
        },
        21: {
            name: "Searching For Essence",
            completionLimit: 5,
            challengeDescription() {
                let des = "Fragment generation ^^" + format(layers[this.layer].challenges[this.id].debuff());
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[3]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[3],0):challengeCompletions(this.layer, this.id)
                return 0.9 - (ChallengeDepth * 0.05);
            },
            rewardEffect() {
                let eff = new Decimal(1).plus(0.01 * challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = new Decimal(1).plus(0.02 * challengeCompletions(this.layer, this.id));
                return eff
            },
            unlocked() { return player[this.layer].best.gte(5) || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal("1e3750").times(Decimal.pow(1e10, challengeCompletions(this.layer, this.id)))
                return new Decimal(1e220).times(Decimal.pow(1e10, challengeCompletions(this.layer, this.id))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            currencyDisplayName: "Fragments",
            currencyInternalName: "points",
            rewardDescription() { return "Fragment generation ^" + format(challengeEffect(this.layer, this.id)) },
        },
        22: {
            name: "Rationalism",
            completionLimit: 5,
            challengeDescription() {
                let des = "Memory gain ^^" + format(layers[this.layer].challenges[this.id].debuff());
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[4]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[4],0):challengeCompletions(this.layer, this.id)
                return 0.9 - (ChallengeDepth * 0.05);
            },
            rewardEffect() {
                let eff = Decimal.pow(10, challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(15, challengeCompletions(this.layer, this.id)).times(tmp.saya.grid.ChallengeEffect.toKcha);
                return eff
            },
            unlocked() { return player[this.layer].best.gte(10) || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal("1e4600").times(Decimal.pow(1e10, challengeCompletions(this.layer, this.id))) 
                return new Decimal(1e300).times(Decimal.pow(1e10, challengeCompletions(this.layer, this.id))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            currencyDisplayName: "Memories",
            currencyInternalName: "points",
            currencyLayer: "mem",
            rewardDescription() { return "Memory softcap starts x" + format(challengeEffect(this.layer, this.id)) + " later" },
        },
        31: {
            name: "Endless Festival",
            completionLimit: 5,
            challengeDescription() {
                let des = "Red Dolls effect ^" + format(layers[this.layer].challenges[this.id].debuff());
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[5]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[5],0):challengeCompletions(this.layer, this.id)
                return 0.5 - (ChallengeDepth * 0.05);
            },
            rewardEffect() {
                let eff = Decimal.pow(1.25, challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(1.4, challengeCompletions(this.layer, this.id)).times(tmp.saya.grid.ChallengeEffect.toKcha)
                return eff;
            },
            unlocked() { return player[this.layer].best.gte(15) || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal(6900000).plus(Decimal.times(100000,challengeCompletions(this.layer, this.id)))
                return new Decimal(350).plus(Decimal.times(50, challengeCompletions(this.layer, this.id) + (Math.max(challengeCompletions(this.layer, this.id) - 1) * 0.25))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            currencyDisplayName: "Red Rolls",
            currencyInternalName: "points",
            currencyLayer: "kou",
            rewardDescription() { return "Red Dolls effect x" + format(challengeEffect(this.layer, this.id)) },
        },
        32: {
            name: "Overhandling Rift",
            completionLimit: 5,
            challengeDescription() {
                let des = "Remove all your Guilding Beacons, and you can have " + formatWhole(layers[this.layer].challenges[this.id].debuff()) + " Guilding Beacons at most.";
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[6]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[6],0):challengeCompletions(this.layer, this.id)
                return 22 - (ChallengeDepth * 3);
            },
            rewardEffect() {
                let eff = Decimal.pow(1.1, challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(1.25, challengeCompletions(this.layer, this.id)).times(tmp.saya.grid.ChallengeEffect.toKcha);
                return eff
            },
            onEnter() {
                if (player['awaken'].current == this.layer){
                    //if (!confirm("Think carefully before you enter this challenge! Are you sure you are going to take this challenge?")){player[this.layer].activeChallenge=null;return;}
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                };
                player.lethe.upgrades = [];
            },
            unlocked() { return player[this.layer].best.gte(25) || hasMilestone('ins', 1) },
            goal() {
                if (player['awaken'].current == this.layer) return new Decimal("1e4700").times(Decimal.pow(1e100, challengeCompletions(this.layer, this.id)))
                return new Decimal(1e240).times(Decimal.pow(1e5, challengeCompletions(this.layer, this.id))) 
            },
            currencyDisplayName: "Forgotten Drops",
            currencyInternalName: "points",
            currencyLayer: "lethe",
            rewardDescription() { return "Forgotten Drops effect x" + format(challengeEffect(this.layer, this.id)) },
        },
        41: {
            name: "Otherside of Godess",
            completionLimit: 5,
            challengeDescription() {
                let des = "Force a row5 reset every " + format(layers[this.layer].challenges[this.id].debuff()) + " seconds";
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[7]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[7],0):challengeCompletions(this.layer, this.id)
                let debuff = 10 - (ChallengeDepth * 2)
                return Math.max(debuff, 0.5);
            },
            rewardEffect() {
                let eff = Decimal.pow(2, challengeCompletions(this.layer, this.id));
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(3, challengeCompletions(this.layer, this.id)).times(tmp.saya.grid.ChallengeEffect.toKcha);
                return eff;
            },
            onExit() {
                player.saya.bestroses41 = new Decimal(0);
            },
            unlocked() { return player[this.layer].best.gte(35) && hasUpgrade('storylayer', 31) || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal("1e470").times(Decimal.pow(100, challengeCompletions(this.layer, this.id))) 
                return new Decimal(500).times(Decimal.pow(2.5, challengeCompletions(this.layer, this.id))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    if (!confirm("Think carefully before you enter this challenge! Are you sure you are going to take this challenge?")){player[this.layer].activeChallenge=null;return;}
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            canComplete() {
                let goal = this.goal();
                return player.saya.bestroses41.gte(goal) && !inChallenge('rei', 11);
            },
            goalDescription() { return format(this.goal()) + " Glowing Roses without entering Zero Sky." },
            rewardDescription() { return "Glowing Roses gain&effect x" + format(challengeEffect(this.layer, this.id)) },
        },
        42: {
            name: "Endless Chase",
            completionLimit: 5,
            challengeDescription() {
                let des = "Dark Matter effect reduces Light Tachyons gain&direct gain by log" + format(layers[this.layer].challenges[this.id].debuff()) + " and force open L&D's autobuyer.";
                des += "<br>Completion times: " + challengeCompletions(this.layer, this.id) + "/" + this.completionLimit
                return des
            },
            debuff() {//layers
                let ChallengeDepth = tmp['saya'].grid.ChallengeDepth[8]>-1?Math.max(tmp[this.layer].grid.ChallengeDepth[8],0):challengeCompletions(this.layer, this.id)
                return 10 - (ChallengeDepth * 2);
            },
            rewardEffect() {
                let LaheadD = player.light.points.div(player.dark.points.max(1));
                let eff = Decimal.pow(challengeCompletions(this.layer, this.id) + 1, LaheadD).max(1);
                if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) eff = Decimal.pow(challengeCompletions(this.layer, this.id) + 1, LaheadD.times(1.5)).max(1).times(tmp.saya.grid.ChallengeEffect.toKcha);
                return eff;
            },
            unlocked() { return player[this.layer].best.gte(40) && hasUpgrade('storylayer', 31) || hasMilestone('ins', 1) },
            goal() { 
                if (player['awaken'].current == this.layer) return new Decimal(3e21).plus(Decimal.times(1e21, challengeCompletions(this.layer, this.id))) 
                return new Decimal(15000000).plus(Decimal.times(1000000, challengeCompletions(this.layer, this.id))) 
            },
            onEnter(){
                if (player['awaken'].current == this.layer){
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                }
            },
            currencyDisplayName: "Light Tachyons",
            currencyInternalName: "points",
            currencyLayer: "light",
            rewardDescription() { return "Dark Matters gain x" + format(challengeEffect(this.layer, this.id)) + ", which are based on how much Light Tachyons are ahead of Dark Matters." },
        },

    },

    grid:{
        rows:8,
        cols:8,
        getStartData(id) {
            return 0//complete time
        },
        getUnlocked(id) {
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;

            return true
        },
        Sum_All_times(){
            let t = 0;
            for (index in player[this.layer].grid)
                t += player[this.layer].grid[index]
            return t;
        },
        ChallengeDepth(){
            if (player[this.layer].CurrentPairChallenge == null) return Array(8+1).fill(-1);
            let ChallengePrime = Math.floor(player[this.layer].CurrentPairChallenge/100)//从1开始
            let ChallengeSub = player[this.layer].CurrentPairChallenge % 100;
            let DepthArray = Array(8+1).fill(-1);
            DepthArray[ChallengePrime] = 4;
            DepthArray[ChallengeSub] = player[this.layer].grid[player[this.layer].CurrentPairChallenge];
            return DepthArray;
        },
        ChallengeTarget(){
            let basetarget = {frag:new Decimal("1e5500"),mem:new Decimal("1e7000")};
            if (player[this.layer].CurrentPairChallenge == null) return basetarget;
            basetarget.frag = basetarget.frag.times(Decimal.pow(1e100,this.Sum_All_times()))
            basetarget.mem = basetarget.mem.times(Decimal.pow(1e100,this.Sum_All_times()))
            //TODO:下面添加某些不同挑战参与时的修正值
            if (this.ChallengeDepth()[3]>-1) {basetarget.frag = basetarget.frag.div("1e2000").div(Decimal.pow(1e50,this.Sum_All_times()));basetarget.mem = basetarget.mem.div("1e500");}
            if (this.ChallengeDepth()[4]>-1) {basetarget.mem = basetarget.mem.div("1e2500").div(Decimal.pow(1e50,this.Sum_All_times()));basetarget.frag = basetarget.frag.div("1e500");}

            if (hasAchievement('a',135)) basetarget.frag = basetarget.frag.pow(achievementEffect('a',135));
            if (player['tempest'].grid[301].activated) basetarget.mem = basetarget.mem.pow(gridEffect('tempest',301));
            if (hasUpgrade('storylayer',53)){
                basetarget.frag = basetarget.frag.div(upgradeEffect('storylayer',53).EffectToMA);
                basetarget.mem = basetarget.mem.div(upgradeEffect('storylayer',53).EffectToMA);
            }

            return basetarget;
        },
        ChallengeDebuff(){
            let basedebuff = {frag:new Decimal(1),mem:new Decimal(1)};
            if (player[this.layer].CurrentPairChallenge == null) return basedebuff;
            basedebuff.frag = basedebuff.frag.sub(0.5*Math.sqrt(this.Sum_All_times()/280))
            basedebuff.mem = basedebuff.mem.sub(0.3*Math.sqrt(this.Sum_All_times()/280))

            //修正值
            if (hasMilestone('tempest',2)){
                basedebuff.frag = basedebuff.frag.pow(0.95);
                basedebuff.mem = basedebuff.mem.pow(0.95);
            }
            return basedebuff
        },
        ChallengeEffect(){
            let baseeff = {toKeff:new Decimal(1),toGEFO:new Decimal(1),toKcha:new Decimal(1)};
            if (!player['awaken'].awakened.includes(this.layer)) return baseeff;
            baseeff.toKeff = Decimal.pow(this.Sum_All_times(),0.5).max(1);
            baseeff.toGEFO = new Decimal(this.Sum_All_times()*1.2+1)
            baseeff.toKcha = Decimal.pow(1.1,this.Sum_All_times());
            return baseeff;
        },
        getCanClick(data, id) {
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;
            if (rowNum == colNum) return false
            return true
        },
        onClick(data, id) {
            if (player[this.layer].FallbackPair) {
                if (data>0)
                    {
                        if (!confirm('You are going to fallback this challenge\'s Completed times by 1, are you sure?')) return;
                        player[this.layer].grid[id]--
                    }

            }
            else {
                if (player[this.layer].CurrentPairChallenge != id) {
                    player[this.layer].activeChallenge = null;
                    doReset(this.layer);//走个过场哈哈哈哈哈
                    player[this.layer].CurrentPairChallenge = id;
                    player.points = new Decimal(0);
                    player.mem.points = new Decimal(0);
                    player.light.points = new Decimal(0);
                    player.dark.points = new Decimal(0);
                    player.kou.points = new Decimal(0);
                    player.lethe.points = new Decimal(0);
                    player.rei.points = new Decimal(0);
                    player.rei.roses = new Decimal(0);
                    player.yugamu.points = new Decimal(0);
                    if (this.ChallengeDepth()[6] >= 0) player.lethe.upgrades = [];
                }
                else {
                    if (player.points.gte(this.ChallengeTarget().frag) || player.mem.points.gte(this.ChallengeTarget().mem))
                        if (player[this.layer].grid[id] < 5)
                            player[this.layer].grid[id]++;
                    doReset(this.layer);
                    player[this.layer].CurrentPairChallenge = null;
                }
            }
        },
        getDisplay(data, id){
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;
            if (rowNum==colNum) return "\\"
            let ChallengeDisplay = String(rowNum)+String(colNum);
            return ("<h1>"+ChallengeDisplay+"</h1><br>"+data)
        },
        getStyle(data,id){
            let rowNum = Math.floor(id/100)//从1开始
            let colNum = id % 100;
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: layers[this.layer].color,
                borderColor: layers[this.layer].color,
                backgroundColor: `${layers[this.layer].color}40`,
                borderWidth: '2px',
                height: '75px',
	            width: '75px',
            };
            let colorArray = RGBStringToArray(HexToRGBString(layers[this.layer].color));
            let baseArray = RGBStringToArray(HexToRGBString("#555555"));
            for (index in colorArray)
                colorArray[index] = Math.round((colorArray[index]-baseArray[index])*(data/5)+baseArray[index])
            let finalcolorHex = RGBToHexString(RGBArrayToString(colorArray));
            jss.color = finalcolorHex;
            jss.borderColor = finalcolorHex;
            jss.backgroundColor = `${finalcolorHex}40`;

            if (id == player[this.layer].CurrentPairChallenge) {
                jss.color = 'red';
                if (player.points.gte(this.ChallengeTarget().frag)||player.mem.points.gte(this.ChallengeTarget().mem))
                    {jss.borderColor = '#FFFF00'
                    jss.backgroundColor = '#FFFF0040'}
            };
            if (rowNum == colNum){
                jss.color = 'red';
                jss.borderColor = 'red';
                jss.backgroundColor = '#FF000040';
            }
            return jss;
        },
    },

    clickables:{
        11: {
            title: "Fallback Progress Mode",
            display() {return player[this.layer].FallbackPair?"ON":"OFF"},
            unlocked() { return player.saya.unlocked },
            canClick() { return !player[this.layer].CurrentPairChallenge},
            onClick() { 
                player[this.layer].FallbackPair = !player[this.layer].FallbackPair
            },
        },},
})

addLayer("etoluna", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            starPoint: new Decimal(0),
            moonPoint: new Decimal(0),
            starbump: 0,
            moonbump: 0,
            allotted: 0.5,
            unlockOrder: 0,
            demile: [],
            deupg: [],
        }
    },

    name: "Gemini",
    symbol: "G",
    color: "#d7a9f4",
    resource: "Gemini Bounds",
    row: 4,
    displayRow: 1,
    position: 1,
    hotkeys: [
        { key: "g", description: "G: Reset for Gemini Bounds", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    branches: ["kou"],

    baseResource: "World Steps",
    baseAmount() { return player.world.points },

    requires: new Decimal(6000),


    type: "normal",
    exponent: 0.5,

    gainMult() {
        let mult=new Decimal(1);
        if (player.lethe.buyables[21].unlocked) mult = mult.times(buyableEffect('lethe', 21));
        if(hasUpgrade('lethe',94)) mult=mult.times(upgradeEffect('lethe',94));
        if (player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei')) mult = mult.times(tmp["rei"].challenges[11].effectAWtoGK); 
        return mult;
    },
    gainExp() {
        return new Decimal(1)
    },
    directMult() {
        let dm = new Decimal(1);
        if (inChallenge('kou', 61) || hasChallenge('kou', 61)) dm = dm.times(layers['saya'].effect());
        return dm;
    },

    effect() {
        let eff = player[this.layer].points.div(2).plus(1);
        if (hasAchievement('a', 103)) eff = player[this.layer].points.div(1.5).plus(1);
        if (hasChallenge('kou', 61)) eff = eff.times(layers['saya'].effect())
        if (hasUpgrade('lethe',95)) eff =eff.times(upgradeEffect('lethe',95));
        if (hasUpgrade('lethe',104)) eff =eff.times(upgradeEffect('lethe',104));
        if (hasUpgrade('lethe',105)) eff =eff.times(upgradeEffect('lethe',105));
        if (hasChallenge('kou', 91)) eff = eff.times(challengeEffect('kou',91));

        if (player.awaken.awakened.includes(this.layer)||player['awaken'].current==this.layer) eff = eff.pow(tmp[this.layer].BumpEffect)
        return eff;
    },
    effectDescription() {
        return "which are giving you the base speed of gaining Star Points/Moon Points of " + format(layers['etoluna'].effect()) + "/s"
    },

    layerShown() { return hasUpgrade('storylayer', 23) },
    passiveGeneration() {
        if (layers['etoluna'].deactivated()) return 0;
        let pg = 0;
        if (hasMilestone('ins', 2)) pg += 0.1;
        return pg;
    },

    //AW通用相关
    deactivated() {
        let bol = false;
        bol = (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer))
        if (bol) {
            if (player[this.layer].demile.length == 0) player[this.layer].demile = player[this.layer].milestones;
            if (player[this.layer].deupg.length == 0) player[this.layer].deupg = player[this.layer].upgrades;
        }
        else {
            if (player[this.layer].demile.length != 0) { player[this.layer].milestones = player[this.layer].demile; player[this.layer].demile = [] };
            if (player[this.layer].deupg.length != 0) { player[this.layer].upgrades = player[this.layer].deupg; player[this.layer].deupg = [] };
        }
        return bol;
    },
    marked() {
        if (player.awaken.awakened.includes(this.layer)) return true;
        else return false;
    },

    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone('ins', 0)) keep.push('milestones');
        if (hasMilestone('ins', 1)) keep.push('upgrades');
        if (hasMilestone('ins', 4)) { keep.push('starPoint'); keep.push('moonPoint'); }
        if (layers[resettingLayer].row > this.row) layerDataReset('etoluna', keep);
    },

    //Tower related
    gainstarPoints() {
        let gain = layers['etoluna'].effect().times(Decimal.pow(10, (player.etoluna.allotted * 2 - 1)));
        if (player.etoluna.allotted <= 0) {
            gain = layers['etoluna'].effect().times(0.1);
        }//break_eternity.js issue, can be solved by updating
        if (inChallenge('kou', 81)) {
            if (player.etoluna.allotted < (0.5)) gain = layers['etoluna'].effect().times(Decimal.pow(10, (1 - (player.etoluna.allotted) * 4))).times(20).times(player.etoluna.allotted - 0.5);
            if (player.etoluna.allotted == (0.5)) gain = new Decimal(0);
            if (player.etoluna.allotted > (0.5)) gain = layers['etoluna'].effect().times(Decimal.pow(10, ((player.etoluna.allotted - 0.5) * 4 - 1))).times(20).times(player.etoluna.allotted - 0.5);
        }
        if (hasMilestone('ins', 6) && !inChallenge('kou', 81)) gain = layers['etoluna'].effect().times(Decimal.pow(10, 1));
        if (hasUpgrade('storylayer', 25) && !inChallenge('kou', 81)) gain = gain.times(player.etoluna.moonPoint.div(player.etoluna.starPoint.max(1)).max(1));
        if (hasChallenge('kou', 81)) gain = gain.times(10);

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(0);

        return gain;
    },

    starPointeffect() {//tmp
        let eff = player.etoluna.starPoint.plus(1).log(7.5).max(1);
        if (player.ins.inslevel.Arg.gt(0)) eff = player.etoluna.starPoint.plus(player.etoluna.moonPoint.pow(layers.ins.insEffect().Arg())).plus(1).log(7.5).max(1);
        if (hasUpgrade('etoluna', 23)) eff = eff.pow(1.25);
        if (player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu')) eff = eff.times(tmp['yugamu'].AWeffect.NWeffect);

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

        return eff;
    },

    gainmoonPoints() {
        let gain = layers['etoluna'].effect().times(Decimal.pow(10, ((1 - player.etoluna.allotted) * 2 - 1)));
        if ((1 - player.etoluna.allotted) <= 0) {
            gain = layers['etoluna'].effect().times(0.1);
            if (inChallenge('kou', 81)) gain = gain.times(2).times(0.5 - player.etoluna.allotted);
        }//break_eternity.js issue, can be solved by updating
        if (inChallenge('kou', 81)) {
            if (player.etoluna.allotted < (0.5)) gain = layers['etoluna'].effect().times(Decimal.pow(10, (1 - player.etoluna.allotted * 4))).times(20).times(0.5 - player.etoluna.allotted);
            if (player.etoluna.allotted == (0.5)) gain = new Decimal(0);
            if (player.etoluna.allotted > (0.5)) gain = layers['etoluna'].effect().times(Decimal.pow(10, ((player.etoluna.allotted - 0.5) * 4 - 1))).times(20).times(0.5 - player.etoluna.allotted);
        }
        if (hasMilestone('ins', 6) && !inChallenge('kou', 81)) gain = layers['etoluna'].effect().times(Decimal.pow(10, 1));
        if (hasUpgrade('storylayer', 25) && !inChallenge('kou', 81)) gain = gain.times(player.etoluna.starPoint.div(player.etoluna.moonPoint.max(1)).max(1));
        if (hasChallenge('kou', 81)) gain = gain.times(10);

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(0);

        return gain;
    },

    moonPointeffect() {//tmp
        let eff = player.etoluna.moonPoint.plus(1).log(5).max(0).div(50).plus(1);
        if (hasUpgrade('etoluna', 24)) eff = player.etoluna.moonPoint.pow(1 / 3).times(1.5).div(50).max(0).plus(1);
        if (player.ins.inslevel.Arg.gt(0)) eff = player.etoluna.moonPoint.plus(player.etoluna.starPoint.pow(layers.ins.insEffect().Arg())).pow(1 / 3).times(1.5).div(50).max(0).plus(1);
        if (player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu')) eff = eff.times(tmp['yugamu'].AWeffect.NWeffect);

        //AW
        if (player['awaken'].selectionActive && player['awaken'].current != null && player['awaken'].current != this.layer && !player['awaken'].awakened.includes(this.layer)) return new Decimal(1);

        return eff;
    },

    //bump releated
    BumpDecrease(){//tmp
        let stardecrease = Math.max(player.etoluna.starbump/10,0.05);
        let moondecrease = Math.max(player.etoluna.moonbump/10,0.05);
        //TODO: 修正值
        if (player['tempest'].grid[302].activated){
            stardecrease = stardecrease*gridEffect('tempest',302)
            moondecrease = moondecrease*gridEffect('tempest',302)
        }
        if (hasUpgrade('storylayer',53)){
            stardecrease = stardecrease*(upgradeEffect('storylayer',53).EffectToSD)
            moondecrease = moondecrease*(upgradeEffect('storylayer',53).EffectToSD)
        }
        return {star:stardecrease,moon:moondecrease}
    },

    BumpEffect(){
        let powerplus = (0.2-Math.abs(player.etoluna.starbump-player.etoluna.moonbump))*(player.etoluna.starbump+player.etoluna.moonbump)/2
        let eff = new Decimal(1).plus(powerplus);
        return eff.max(1);
    },

    update(diff) {
        if (player.etoluna.unlocked) {
            player.etoluna.moonPoint = player.etoluna.moonPoint.plus(tmp["etoluna"].gainmoonPoints.times(diff));
            player.etoluna.starPoint = player.etoluna.starPoint.plus(tmp["etoluna"].gainstarPoints.times(diff));
            if (player.etoluna.moonPoint.lt(0)) player.etoluna.moonPoint = new Decimal(0);
            if (player.etoluna.starPoint.lt(0)) player.etoluna.starPoint = new Decimal(0);
        }
        if (player['awaken'].awakened.includes(this.layer)|| player['awaken'].current == this.layer){
            player.etoluna.starbump -= tmp.etoluna.BumpDecrease.star*diff
            player.etoluna.moonbump -= tmp.etoluna.BumpDecrease.moon*diff
            player.etoluna.starbump = Math.max(player.etoluna.starbump,0)
            player.etoluna.moonbump = Math.max(player.etoluna.moonbump,0)
        }
        if (!(player['awaken'].awakened.includes(this.layer)|| player['awaken'].current == this.layer)&&player.subtabs.etoluna == 'Stellar Dome') player.subtabs.etoluna == 'Milestones'
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
        "Gemini Tower": {
            unlocked() { return player.etoluna.unlocked },
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["row", [
                    ["bar", "etoBar"],
                    ["column", [
                        ["blank", "400px"],
                        ["clickable", 22],
                        ["clickable", 12],
                    ]],
                    ["blank", ["50px", "50px"]],
                    ["clickable", 31],
                    ["blank", ["50px", "50px"]],
                    ["column", [
                        ["blank", "400px"],
                        ["clickable", 21],
                        ["clickable", 11],
                    ]],
                    ["bar", "lunaBar"],
                ]],
                "blank",
                ["row", [
                    ["column", [
                        ["display-text", function () { return "You have <h3 style='color: #bddfff;'>" + formatWhole(player.etoluna.starPoint) + "</h3> Star Points." }, {}],
                        "blank",
                        ["display-text", function () { return hasAchievement('a', 93) ? ("Which boosts All Glowing Roses effect by <h3>" + format(tmp.etoluna.starPointeffect) + "</h3>x") : "" }, {}],
                        "blank",
                    ]],
                    ["blank", ["50px", "50px"]],
                    ["column", [
                        ["display-text", function () { return "You have <h3 style='color: #d7a9f4;'>" + formatWhole(player.etoluna.moonPoint) + "</h3> Moon Points." }, {}],
                        "blank",
                        ["display-text", function () { return hasAchievement('a', 93) ? ("Which ÷<h3>" + format(tmp.etoluna.moonPointeffect) + "</h3> World Step Height.") : "" }, {}],
                        "blank",
                    ]],]
                    , {}],
                "blank",
                ["row", [["upgrade", "11"], ["upgrade", "13"], ["blank", ["50px", "50px"]], ["upgrade", "14"], ["upgrade", "12"]]],
                ["row", [["upgrade", "21"], ["upgrade", "23"], ["blank", ["50px", "50px"]], ["upgrade", "24"], ["upgrade", "22"]]],
            ]
        },
        "Stellar Dome":{
            unlocked() { return player['awaken'].awakened.includes('etoluna')|| player['awaken'].current == 'etoluna'},
            buttonStyle() { return { 'background-color': '#43354d' } },
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function () { return "Two different power synergize each other, and boosts ^"+format(tmp['etoluna'].BumpEffect)+" to Star & Moon Points gain." }, {}],
                ["bar", "etoPump"],
                "blank",
                ["row",[
                    ["clickable", 41],
                    "blank",
                    ["clickable", 42],
                ]],
                "blank",
                ["bar", "lunaPump"],
        ]
    },
    },

    milestones: {
        0: {
            requirementDescription: "1 Gemini Bound",
            done() { return player.etoluna.best.gte(1) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "Keep All but last milestones of LC layer & 1st milestone of FL layer.<br>And you are considered have made a total of 3 Flourish Labyrinths.",
        },
        1: {
            requirementDescription: "2 Gemini Bounds",
            done() { return player.etoluna.best.gte(2) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "Keep the rest of LC & FL milestones.",
        },
        2: {
            requirementDescription: "3 Gemini Bounds",
            done() { return player.etoluna.best.gte(3) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "You can gain Glowing Roses outside Zero Sky at a much reduced rate.",
        },
        3: {
            requirementDescription: "5 Gemini Bounds",
            done() { return player.etoluna.best.gte(5) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "Unlock Luminous Churches Autobuyer.",
        },
        4: {
            requirementDescription: "10 Gemini Bounds",
            done() { return player.etoluna.best.gte(10) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "You can buy max Luminous Churches.",
        },
        5: {
            requirementDescription: "15 Gemini Bounds",
            done() { return player.etoluna.best.gte(15) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "Luminous Church layer resets nothing.",
        },
        6: {
            requirementDescription: "25 Gemini Bounds",
            done() { return player.etoluna.best.gte(25) },
            unlocked() { return player.etoluna.unlocked },
            effectDescription: "You still could gain World Steps as fast as tick goes, but overflowing World Height progress will transfer into more World Steps.",
        },
        7: {
            requirementDescription: "30 Gemini Bounds",
            done() { return player.etoluna.best.gte(30) },
            unlocked() { return hasMilestone('etoluna', 6) },
            effectDescription: "Unlock Gemini upgrades.",
        },
    },
    milestonePopups(){
        if (player['awaken'].current == this.layer || player['awaken'].awakened.includes(this.layer)) return false;
     return true;
 },

    bars: {
        etoBar: {
            direction: UP,
            width: 25,
            height: 500,
            progress() { return Math.min(player.etoluna.allotted, 0.99999) },
            barcolor() {
                return "#bddfff"
            },
            fillStyle() { return { 'background-color': "#bddfff" } },
        },
        lunaBar: {
            direction: UP,
            width: 25,
            height: 500,
            progress() { return Math.min(1 - layers.etoluna.bars.etoBar.progress(), 0.99999) },
            barcolor() {
                return "#d7a9f4"
            },
            fillStyle() { return { 'background-color': "#d7a9f4" } },
        },
        etoPump: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress() { return player.etoluna.starbump },
            barcolor() {
                return "#bddfff"
            },
            fillStyle() { return { 'background-color': "#bddfff" } },
        },
        lunaPump: {
            direction: LEFT,
            width: 500,
            height: 25,
            progress() { return player.etoluna.moonbump },
            barcolor() {
                return "#d7a9f4"
            },
            fillStyle() { return { 'background-color': "#d7a9f4" } },
        },
    },

    clickables: {
        rows: 3,
        cols: 2,
        11: {
            title: "L+",
            unlocked() { return player.etoluna.unlocked },
            canClick() { return player.etoluna.allotted > 0 },
            onClick() { player.etoluna.allotted = Math.max(player.etoluna.allotted - 0.05, 0) },
            style: { "height": "50px", "width": "50px", "min-height": "50px", "background-color": "#d7a9f4" },
        },
        12: {
            title: "E+",
            unlocked() { return player.etoluna.unlocked },
            canClick() { return player.etoluna.allotted < 1 },
            onClick() { player.etoluna.allotted = Math.min(player.etoluna.allotted + 0.05, 1) },
            style: { "height": "50px", "width": "50px", "min-height": "50px", "background-color": "#bddfff" },
        },
        21: {
            title: "Lm",
            unlocked() { return player.etoluna.unlocked },
            canClick() { return player.etoluna.allotted > 0 },
            onClick() { player.etoluna.allotted = 0; },
            style: { "height": "50px", "width": "50px", "min-height": "50px", "background-color": "#d7a9f4" },
        },
        22: {
            title: "Em",
            unlocked() { return player.etoluna.unlocked },
            canClick() { return player.etoluna.allotted < 1 },
            onClick() { player.etoluna.allotted = 1; },
            style: { "height": "50px", "width": "50px", "min-height": "50px", "background-color": "#bddfff" },
        },
        31: {
            title: "C",
            unlocked() { return player.etoluna.unlocked },
            canClick() { return player.etoluna.allotted != .5 },
            onClick() { player.etoluna.allotted = .5 },
            style: { "height": "50px", "width": "50px", "min-height": "50px", "background-color": "yellow" },
        },
        41:{
            title: "Enhance star power",
            unlocked(){return player['awaken'].awakened.includes(this.layer)|| player['awaken'].current == this.layer},
            canClick() { return player.etoluna.starbump<1 && player.etoluna.moonbump<1 },
            onClick() {
                player.etoluna.starbump = Math.min(player.etoluna.starbump+0.05,1)
                player.etoluna.moonbump = Math.min(player.etoluna.moonbump+0.01,1)
            },
            style:{"background-color": "#bddfff"},
        },
        42:{
            title: "Enhance moon power",
            unlocked(){return player['awaken'].awakened.includes(this.layer)|| player['awaken'].current == this.layer},//for now
            canClick() { return player.etoluna.moonbump<1 && player.etoluna.starbump<1},
            onClick() {
                player.etoluna.moonbump = Math.min(player.etoluna.moonbump+0.05,1)
                player.etoluna.starbump = Math.min(player.etoluna.starbump+0.01,1)
            },
            style:{"background-color": "#d7a9f4"},
        },
    },

    upgrades: {
        11: {
            title: "Among Stars",
            description: "The speed of World Steps gain is boosted by current progress of World Step gain.",
            fullDisplay: "<b>Among Stars</b><br>The speed of World Steps gain is boosted by current progress of World Step gain.<br>Cost: 25,000 Star Points",
            unlocked() { return hasMilestone('etoluna', 7) },
            canAfford() {
                return player[this.layer].starPoint.gte(25000);
            },
            pay() {
                player[this.layer].starPoint = player[this.layer].starPoint.sub(25000);
            },
            effect() {
                let eff = player.world.Worldtimer.plus(1).log(10).div(10).plus(1);
                return eff;
            },
            style: { "background-color"() { if (!hasUpgrade("etoluna", 11)) return canAffordUpgrade("etoluna", 11) ? "#bddfff" : "rgb(191,143,143)"; else return "rgb(119,191,95)" } },
        },
        12: {
            title: "Under The Moon",
            description: "Moon Points also boosts World Step Height softcap starts later.",
            fullDisplay: "<b>Under The Moon</b><br>Moon Points also boosts World Step Height softcap starts later.<br>Cost: 25,000 Moon Points",
            unlocked() { return hasMilestone('etoluna', 7) },
            canAfford() {
                return player[this.layer].moonPoint.gte(25000);
            },
            pay() {
                player[this.layer].moonPoint = player[this.layer].moonPoint.sub(25000);
            },
        },
        13: {
            title: "Sticky Steps",
            description: "Star Point effect also makes fixed World Step softcap starts later at a reduced rate.",
            fullDisplay: "<b>Sticky Steps</b><br>Star Point effect also makes fixed World Step softcap starts later at a reduced rate.<br>Cost: 50,000 Star Points",
            unlocked() { return hasUpgrade('etoluna', 11) },
            canAfford() {
                return player[this.layer].starPoint.gte(50000);
            },
            pay() {
                player[this.layer].starPoint = player[this.layer].starPoint.sub(50000);
            },
            effect() {
                let eff = tmp["etoluna"].starPointeffect.sqrt();
                return eff;
            },
            style: { "background-color"() { if (!hasUpgrade("etoluna", 13)) return canAffordUpgrade("etoluna", 13) ? "#bddfff" : "rgb(191,143,143)"; else return "rgb(119,191,95)" } },
        },
        14: {
            title: "Outside The Sky",
            description: "Moon Points also enlarges restricted World Step effect's hardcap.",
            fullDisplay: "<b>Outside The Sky</b><br>Moon Points also enlarges restricted World Step effect's hardcap.<br>Cost: 50,000 Moon Points",
            unlocked() { return hasUpgrade('etoluna', 12) },
            canAfford() {
                return player[this.layer].moonPoint.gte(50000);
            },
            pay() {
                player[this.layer].moonPoint = player[this.layer].moonPoint.sub(50000);
            },
        },
        21: {
            title: "Desire for Victory",
            description: "Star Point effect also enlarges restricted World Step effect's hardcap.",
            fullDisplay: "<b>Desire for Victory</b><br>Star Point effect also enlarges restricted World Step effect's hardcap.<br>Cost: 900,000 Star Points",
            unlocked() { return hasUpgrade('etoluna', 13) },
            canAfford() {
                return player[this.layer].starPoint.gte(900000);
            },
            pay() {
                player[this.layer].starPoint = player[this.layer].starPoint.sub(900000);
            },
            effect() {
                let eff = tmp["etoluna"].starPointeffect.sqrt().div(1.5).max(1);
                return eff;
            },
            style: { "background-color"() { if (!hasUpgrade("etoluna", 21)) return canAffordUpgrade("etoluna", 21) ? "#bddfff" : "rgb(191,143,143)"; else return "rgb(119,191,95)" } },
        },
        22: {
            title: "Mind Flow",
            description: "Moon Points also enlarges fixed World Step effect's exponent.",
            fullDisplay: "<b>Mind Flow</b><br>Moon Points also enlarges fixed World Step effect's softcap exponent.<br>Cost: 900,000 Moon Points",
            unlocked() { return hasUpgrade('etoluna', 14) },
            canAfford() {
                return player[this.layer].moonPoint.gte(900000);
            },
            pay() {
                player[this.layer].moonPoint = player[this.layer].moonPoint.sub(900000);
            },
        },
        23: {
            title: "Memory of rhythm",
            description: "Star Point effect formula becomes better.",
            fullDisplay: "<b>Memory of rhythm</b><br>Star Point effect formula becomes better.<br>Cost: 1,200,000 Star Points",
            unlocked() { return hasUpgrade('etoluna', 21) },
            canAfford() {
                return player[this.layer].starPoint.gte(1200000);
            },
            pay() {
                player[this.layer].starPoint = player[this.layer].starPoint.sub(1200000);
            },
            style: { "background-color"() { if (!hasUpgrade("etoluna", 23)) return canAffordUpgrade("etoluna", 23) ? "#bddfff" : "rgb(191,143,143)"; else return "rgb(119,191,95)" } },
        },
        24: {
            title: "Memory of roles",
            description: "Moon Points effect formula becomes better.",
            fullDisplay: "<b>Memory of roles</b><br>Moon Points effect formula becomes better.<br>Cost: 1,200,000 Moon Points",
            unlocked() { return hasUpgrade('etoluna', 22) },
            canAfford() {
                return player[this.layer].moonPoint.gte(1200000);
            },
            pay() {
                player[this.layer].moonPoint = player[this.layer].moonPoint.sub(1200000);
            },
        },
    },

})

addLayer("awaken", {
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0,
            awakened: [],
            unawable: ['mem', 'lab', 'world', 'storylayer', 'ins', 'awaken'],
            selectionActive: false,
            current: null,
            //test
            haveyoudidthis: false,
        }
    },

    name: "Awaken",
    symbol: "AW",
    position: 2,
    row: 5,
    displayRow: 0,
    branches: ["storylayer"],
    color: "#e3dbf7",
    resource: "Awaken Cores",
    baseResource: "Memories",
    baseAmount() { return player['mem'].points },
    requires: new Decimal("1e2000"),
    type: "static",
    exponent: 1,
    base() {//pow(10,当前点数*数值+2000) = 想要的目标
        if (player['awaken'].total.gte(8)) return new Decimal("1e2000");
        else switch (player['awaken'].total.toNumber()) {
            case (0): return new Decimal("1e300");
            case (1): return new Decimal("1e200");
            case (2): return new Decimal("1e625");
            case (3): return new Decimal("1e600");
            case (4): return new Decimal("1e1125");
            case (5): return new Decimal("1e1080");
            case (6): return Decimal.pow(10,6100/6);
            case (7): return Decimal.pow(10,6950/7);
        }
    },
    hotkeys: [
        { key: "A", description: "Shift+A: Reset for Awaken Core", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    nodeStyle() {
        return {
            background: (player.awaken.unlocked || canReset("awaken")) ? ("linear-gradient(to bottom right, #ced8f5, #e3dbf7, #ced8f5)") : "#bf8f8f",
            //"background-size":"120px 120px",
            height: "96px",
            width: "96px",
            "border": "0px",
            "outline": "rgb(200,184,239) solid 4px",
        }
    },
    canReset(){
        return player.mem.points.gte(getNextAt(this.layer,canMax=false))&&player.kou.activeChallenge==null;
    },

    doReset(resettingLayer) { },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1);
    },

    layerShown() { return hasUpgrade('storylayer', 45) },
    tabFormat: {
        "Awake": {
            content: ["main-display",
                "prestige-button",
                "resource-display", "blank",
                "clickables",
                ["display-text",
                    function () { if (player['awaken'].unlocked) return "<br>The Physic route and the Mechanism route will not be disabled during Awakening. They are not be able to be Awaken either.<br>Their effect may decrease due to those disabled layer, so speed is key!" },
                    {}],
            ],
        },
        "Awaken Effect": {
            content: ["blank", "blank", "blank", ["display-text", function () { return tmp.awaken.rewardDesc }]],
        },
    },

    rewardDesc() {
        let desc = "You have not awaken any layer.";
        if (player['awaken'].awakened.length != 0) desc = "";
        if (player.awaken.awakened.includes("light")) desc += "<h3 style='color: #ededed;'>Light layer</h3><br><br>Effect base: 1.5 --> 2<br>Show Light Upgrades' effect.<br><b>Optimistic Thoughts</b> upgrade effect redesign.<br><b>Wandering For Beauty</b> formula: ^0.5 --> ^0.75<br><b>Experiencing Happiness</b> formula: ^0.15 --> ^0.2<br><b>Wandering For Beauty</b> formula: ^0.5 --> ^0.75<br><b>After That Butterfly</b> formula: ^0.5 --> ^1<br><b>Seeking Delight.</b> upgrade effect redesign.<br><b>Fragment Sympathy</b> upgrade effect redesign.<br><b>Prepare To Travel</b> effect maxnum: 0.3 --> 0.5<br>Unlock four new upgrades.";
        if (player.awaken.awakened.includes("dark")) desc += "<br><br><h3 style='color: #383838;'>Dark layer</h3><br><br>Effect base: 1.5 --> 5<br>Show Dark Upgrades' effect.<br><b>Overclock</b> upgrade effect redesign.<br><b>Seeking For Other Sides</b> formula: ^0.5 --> ^0.75<br><b>Crack Everything</b> formula: ^0.5 --> ^0.6<br><b>Wrath In Calm</b> formula: ^0.5 --> ^1<br><b>Power Override</b> upgrade effect redesign.<br><b>Moments of Anger</b> formula: x0.5 --> x1<br>Unlock four new upgrades.";
        if (player.awaken.awakened.includes("kou")) desc += "<br><br><h3 style='color: #ffa0be;'>Red layer</h3><br><br>Effect: x0.1 --> x0.5<br>The 3rd milestone's effect changed.<br>Show Happiness Challenges' effect.<br><b>Broken Toyhouse</b> formula: ^0.5 --> ^1<br><b>The Balance of Conflict</b> formula: x0.5 --> x2<br>Unlock Celebration Ends challenges.";
        if (player.awaken.awakened.includes("lethe")) desc += "<br><br><h3 style='color: #fee85d;'>Forgotten layer</h3><br><br>Effect: ^2 --> ^3.25<br>The 3rd milestone's effect changed.<br>Show Guiding Beacons' effect.<br><b>Guiding Scythes</b> base effect before <b>Uprising Tower</b> challenge: 2 --> 2.5<br><b>Guiding Scythes</b> base effect after <b>Uprising Tower</b> challenge: 4 --> 5<br><b>White Beacon</b> formula: x0.5 --> x1<br><b>Delightful-Red Synergy</b> formula: x0.5 --> x2<br><b>Joyful-White Synergy</b> formula: x0.5 --> x2<br><b>Red Beacon</b> formula: ^0.5 --> ^0.75<br><b>Delightful-Yellow Synergy</b> formula: x0.5 --> x2<br><b>Delightful Memories</b> formula: x0.5 --> x2<br><b>Monument of Light</b> formula: ÷1.5 --> ÷1<br><b>Joyful Memories</b> formula: x0.01 --> x1<br><b>Joyful-Black Synergy</b> formula: x0.5 --> x2<br><b>Forgotten-White Synergy</b> formula: x0.5 --> x2<br><b>Forgotten Memories</b> now times the number of Memories after taking logarithm twice.<br><b>Dark Memories</b> formula: x0.05 --> x1<br><b>Dark-Red Synergy</b> formula: x0.5 --> x2<br><b>Yellow Beacon</b> formula: ^0.5 --> ^0.75<br><b>Forgotten-Black Synergy</b> formula: x0.5 --> x2<br><b>Black Beacon</b> formula: x0.25 --> x1<br>Unlock Hyper Scythes.";
        if (player.awaken.awakened.includes("rei")) desc += "<br><br><h3 style='color: #ffe6f6;'>Luminous layer</h3><br><br>Gain Exponent: 1.5 --> 1.4<br>Glowing Roses have more effects.<br>Unlock Genesis Layer."
        if (player.awaken.awakened.includes("yugamu")) desc += "<br><br><h3 style='color: #716f5e;'>Flourish layer</h3><br><br>Gain Exponent: 1.5 --> 1.4<br>Unlock Direction Synergy.<br>Unlock Forbearance Layer."
        if (player.awaken.awakened.includes("etoluna")) desc += "<br><br><h3 style='color: #bddfff;'>Gemini</h3><h3 style='color: #d7a9f4;'> layer</h3><br><br>Unlock Stellar Dome."
        if (player.awaken.awakened.includes("saya")) desc += "<br><br><h3 style='color: #16a951;'>Knife layer</h3><br><br>Effect x1.25<br>All Memory Adjustment Challenges' Effects are better.<br>Unlock Merge Attachment."
        return desc;
    },

    clickables: {
        rows: 1,
        cols: 1,
        cap: 8,//我也不知道要设多少
        11: {
            title: "Power Awake",
            display() {
                if (player.awaken.current !== null) return "Currently Awakening: " + tmp[player.awaken.current].name + " layer. Click to exit the run.";
                else return player.awaken.selectionActive ? "You are in a Power Awake. Click the node of the layer you wish to attempt to Awake. Click to exit this status." : ("Begin a Power Awake.<br><br>" + ((tmp.awaken.amtAwakened >= layers["awaken"].clickables.cap) ? "MAXED (Currently)" : ("Req: " + formatWhole(tmp[this.layer].clickables[this.id].req) + " Awaken Core.")));
            },
            unlocked() { return player.awaken.unlocked },
            req() { return [1, 2, 3, 4, 5, 6, 7, 8,(1e300)][tmp.awaken.amtAwakened || 0] },
            canClick() { return player.awaken.unlocked && (player.awaken.selectionActive ? true : (layers["awaken"].amtAwakened() < layers["awaken"].clickables.cap && player.awaken.points.gte(tmp[this.layer].clickables[this.id].req))) },
            onClick() {
                if (player.awaken.current !== null) {
                    if (!confirm("Are you sure you want to exit this Awake run?")) return;
                    player.awaken.selectionActive = false;
                    player.awaken.current = null;
                    doReset("awaken", true);
                } else player.awaken.selectionActive = !player.awaken.selectionActive;
            },
            /*style: {
                "height": "196px", "width": "196px", "background":"linear-gradient(to bottom right, #ced8f5, #e3dbf7, #ced8f5)","border" : "0px","outline":"rgb(200,184,239) solid 4px",
            },*/
            style() {
                if (!this.canClick() && layers["awaken"].amtAwakened() < layers["awaken"].clickables.cap) return { "height": "200px", "width": "200px", "background": "#bf8f8f", }
                return { "height": "196px", "width": "196px", "background": "linear-gradient(to bottom right, #ced8f5, #e3dbf7, #ced8f5)", "border": "0px", "outline": "rgb(200,184,239) solid 4px", }
            }
        },
    },

    amtAwakened() {
        let amt = player.awaken.awakened.length;
        if (player.awaken.current !== null) if (player.awaken.awakened.includes(player.awaken.current)) amt--;
        return amt;
    },
    awakened() {
        if (player.awaken.current !== null) return player.awaken.awakened.concat(player.awaken.current);
        return player.awaken.awakened;
    },
    canBeAwakened() {//返回一个数组，目前能点的层！
        if (!player.awaken.selectionActive) return [];

        //第一批
        if (player.awaken.awakened.length == 0) return ["light", "dark"];
        if (player.awaken.awakened.length == 1) {
            if (player.awaken.awakened.includes('light')) return ['dark'];
            else return ['light'];
        }

        //第二批
        if (player.awaken.awakened.length == 2) return ["lethe", "kou"];
        if (player.awaken.awakened.length == 3) {
            if (player.awaken.awakened.includes('lethe')) return ['kou'];
            else return ['lethe'];
        }

        //第三批
        if (player.awaken.awakened.length == 4) return ["rei", "yugamu"];
        if (player.awaken.awakened.length == 5) {
            if (player.awaken.awakened.includes('rei')) return ['yugamu'];
            else return ['rei'];
        }

        //第四批
        if (player.awaken.awakened.length == 6) return ["etoluna", "saya"];
        if (player.awaken.awakened.length == 7) {
            if (player.awaken.awakened.includes('etoluna')) return ['saya'];
            else return ['etoluna'];
        }

        return [];
    },
    startAwake(layer) {
        if (!confirm("Are you sure you want to start Awake " + tmp[layer].name + " layer? This will force a Awaken reset and put you in a run where only Awaken Layers, Unawakenable layers & this layer will be active!")) return;
        player.awaken.current = layer;
        doReset("awaken", true);//←调了一下这玩意的位置

        if (player[player.awaken.current].points.gt(0)) player[layer].points = new Decimal(0);
        if (player[player.awaken.current].upgrades) player[layer].upgrades = [];
        if (player[player.awaken.current].milestones) player[layer].milestones = [];
        if (player[player.awaken.current].challenges) for (let n in player[layer].challenges) player[layer].challenges[n] = null;
        //if (player.subtabs[layer].length!=0) player.subtabs[layer].mainTabs = "Milestones";//cyxw别告诉我你各个层的subtab不同
        /*if (layer=="light"||layer=="dark") {
            player["mem"].points = new Decimal(0);
            player["mem"].upgrades = [41,42];
            showTab('mem');
        };*/
        switch (layer) {
            case 'light':
            case 'dark': {
                player["mem"].points = new Decimal(0);
                player["mem"].upgrades = [41, 42];
                player.light.auto = false;
                player.dark.auto = false;
                showTab('mem');
                break;
            }
            case 'etoluna':
            case 'saya':{
                player.lethe.upgrades = [11,12,13,14,15,21,22,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55]
                let CeleEndsid = [61,62,71,72,81,82,91,92]
                for (id of CeleEndsid)
                player.kou.challenges[id] = 0;
                player.etoluna.moonPoint = new Decimal(0);
                player.etoluna.starPoint = new Decimal(0);
                break;
            }
            default: { player.subtabs[layer].mainTabs = "Milestones"; showTab(layer); break; }
        }
        /*if (layer=="hs") {
            resetBuyables("hs")
            player.hs.spentHS = new Decimal(0);
        }
        if (layer=="i") resetBuyables("i");*/


    },
    completeAwake(layer) {
        let data = tmp.awaken;
        if (player[layer].points.lt(data.awakenGoal[layer])) return;
        if (!player.awaken.awakened.includes(layer)) player.awaken.awakened.push(layer);
        player.awaken.selectionActive = false;
        player.awaken.current = null;
        if (player.light.auto == false) player.light.auto == true;
        if (player.dark.auto == false) player.dark.auto == true;
        doReset("awaken", true);
    },
    specialReqs: {
        //sb: ["t","e","s"],
    },
    awakenGoal: {
        light: new Decimal("28100"),
        dark: new Decimal("18300"),
        kou: new Decimal("275"),
        lethe: new Decimal("1e800"),
        rei : new Decimal("11250"),
        yugamu:new Decimal("18150"),
        saya:new Decimal("630"),
        etoluna: new Decimal("2e123")
    },
})


//GHOSTS

addNode("ghost0-2", {
    name: "ghost0-2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G0", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 1,
    color: "#000000",
    layerShown() { return "ghost"; }
})
addNode("ghost0-4", {
    name: "ghost0-4", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G0", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 1,
    color: "#000000",
    layerShown() { return "ghost"; }
})
addNode("ghost1", {
    name: "ghost1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 2,
    color: "#000000",
    layerShown() { return "ghost"; }
})
addNode("ghost2", {
    name: "ghost2", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G2", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 2,
    color: "#000000",
    layerShown() { return (tmp["world"].layerShown) ? false : "ghost"; }
})
addNode("ghost3", {
    name: "ghost3", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G3", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 2,
    color: "#000000",
    layerShown() { return "ghost"; }
})
addNode("ghost4", {
    name: "ghost4", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G4", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 4,
    color: "#000000",
    layerShown() { return "ghost"; }
})
addNode("ghost5", {
    name: "ghost5", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G5", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 4,
    color: "#000000",
    layerShown() { return "ghost"; }
})
addNode("ghostLC", {
    name: "ghostLC", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GLC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 4,
    color: "#000000",
    layerShown() { return (tmp["rei"].layerShown) ? false : "ghost"; }
})
addNode("ghostFL", {
    name: "ghostFL", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GFL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 4,
    color: "#000000",
    layerShown() { return (tmp["yugamu"].layerShown) ? false : "ghost"; }
})
addLayer("ghostF", {
    name: "ghostF", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 2,
    color: "#000000",
    layerShown() { return (tmp["lethe"].layerShown) ? false : "ghost"; }
})
addLayer("ghostL", {
    name: "ghostL", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GL", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 3,
    color: "#000000",
    layerShown() { return (tmp["light"].layerShown) ? false : "ghost"; }
})
addLayer("ghostD", {
    name: "ghostD", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "GD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    canclick() { return false },
    row: 3,
    color: "#000000",
    layerShown() { return (tmp["dark"].layerShown) ? false : "ghost"; }
})



addLayer("a", {
    startData() {
        return {
            unlocked: true,
        }
    },
    color: "yellow",
    row: "side",
    layerShown() { return true },
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "An Essence of the Broken World",
            done() { return player.mem.points.gte(100) },
            tooltip: "Gain 100 Memories.<br>Rewards:Fragments generation is a little faster.",
            image: "img/acv/mem crystal.jpg",
        },
        12: {
            name: "A Stack",
            done() { return player.points.gte(9999) },
            tooltip: "Gain 9999 Fragments.",
            image: "img/acv/12.png",
        },
        13: {
            name: "Two Stacks for Sure",
            done() { return player.points.gte(19998) && hasUpgrade("mem", 33) },
            tooltip: "Gain 19998 Fragments With Directly Transfer.Rewards:You start at 5 Memories when reset.",
            image: "img/acv/13.png",
        },
        14: {
            name: "Define Aspects",
            done() { return player.light.unlocked && player.dark.unlocked },
            tooltip: "Unlock Both Light And Dark Layers.<br>Rewards:They behave as they are unlocked first.",
            image:"img/acv/define aspects.jpg"
        },
        15: {
            name: "Does Anybody Say sth About Softcap?",
            done() { return tmp['mem'].softcap.gte(1e13) },
            tooltip: "Push Memory Softcap starts x1,000 later.<br>Rewards:Memories gain x1.5, regardless of softcap.",
        },
        21: {
            name: "Eternal Core",
            done() { return hasUpgrade('mem', 41) },
            tooltip: "Build up the Core.<br>Rewards:Unlock L&D milestones and you won't lose Eternal Core.",
        },
        22: {
            name: "Define Aspects™",
            done() { return hasMilestone('light', 0) && hasMilestone('dark', 0) },
            tooltip: "Reach L&D's 1st milestone.<br>Rewards:Conclusion no longer decreases Memories gain.Optimistic Thoughts&Force Operation will always give back their cost.",
            image:"img/acv/define aspects™.jpg"
        },
        23: {
            name: "Now You Are Useless",
            done() { return hasAchievement('a', 22) && hasUpgrade('mem', 34) },
            tooltip: "Buy Conclusion When it is useless.<br>Rewards:When you buy Conclusion, it makes your Memory softcap start later but effect decreases based on your Time since Memory Reset.",
        },
        24: {
            name: "Eternal Core^2",
            done() { return hasAchievement('a', 21) && (player.mem.points.gte(1e23) && player.light.points.gte(65) && player.dark.points.gte(65)) },
            tooltip: "Make you can afford Eternal Core again after you have it.",
        },
        25: {
            name: "Stacks^Stacks",
            done() { return player.points.gte(9.99e18) },
            tooltip: "Gain 9.99e18 Fragments.<br>Rewards:Fragments now make Memory softcap starts later.",
            image: "img/acv/25.png",
        },
        31: {
            name: "Other Angles",
            done() { return player.kou.unlocked && player.lethe.unlocked },
            tooltip: "Unlock Both Red And Forgotten Layers.<br>Rewards:They behave as they are unlocked first.",
        },
        32: {
            name: "Finally I Get Rid of You!",
            done() { return hasMilestone('kou', 2) && hasMilestone('lethe', 2) },
            tooltip: "Reach R&F's 3rd milestone.<br>Rewards:Keep Directly Transfer when L or D reset, and Fragment Sympathy will always give back its cost.",
            image: "img/acv/32.png",
        },
        33: {
            name: "Plenty of them",
            done() { return player.light.points.gte(200) && player.dark.points.gte(200) },
            tooltip: "Have more than 200 on both Light Tachyons&Dark Matters.<br>Rewards:Their effects increase based on their own reset time.",
        },
        34: {
            name: "Introducing: The AutoMate™",
            done() { return hasMilestone('kou', 4) && hasMilestone('lethe', 4) },
            tooltip: "Reach R&F's 5th milestone.<br>Rewards:Unlock L&D's Autobuyer.",
        },
        35: {
            name: "Plenty*1.5 of them",
            done() { return player.light.points.gte(300) && player.dark.points.gte(300) },
            tooltip: "Have more than 300 on both Light Tachyons&Dark Matters.<br>Rewards:L's effect boosts R's gain, D's effect boosts F's gain.",
        },
        41: {
            name: "Scepter of The Soul Guide",
            done() { return player.lethe.upgrades.length >= 1 },
            tooltip: "Buy your first Guiding Beacon.<br>Rewards: Always gain 20% of Memories gain every second.",
            image:"img/acv/Scepter of The Soul Guide.jpg"
        },
        42: {
            name: "Toyhouse",
            done() { return hasChallenge('kou', 11) },
            tooltip() {
                return "Finish Broken Toyhouse challenge.<br>Rewards:Guiding Beacons costing Red Dolls will give back Red Dolls cost by Achievement." + ((hasAchievement('a', 42)) ? ("<br>Currently:" + format(achievementEffect('a', 42)) + "x") : "")
            },
            effect() {
                let eff = new Decimal(0.5);
                eff = eff.plus((player.a.achievements.length - 17) / 10);
                if (eff.gt(1)) eff = new Decimal(1);
                return eff;
            },
            image:"img/acv/toyhouse.jpg"
        },
        43: {
            name: "Force Balance",
            done() { return (player.light.points.gte(900) && player.dark.points.gte(900) && player.light.points.sub(player.dark.points).abs().lte(5)) },
            tooltip: "Have more than 900 Light Tachyons&Dark Matters and difference between the two is not more than 5.<br>Rewards:When one of L or D is fall behind by another, its gain will be boosted.",
            image:"img/acv/Force balance.jpg"
        },
        44: {
            name: "I Can Idle (For) Now",
            done() { return hasUpgrade('lethe', 15) && hasUpgrade('lethe', 51) && hasAchievement('a', 33) },
            tooltip: "Make L,D,R,F's effects increases over their own reset time.<br>Rewards:Memory softcap starts later based on its own reset time.",
        },
        45: {
            name: "9 isn't a lie!",
            done() { return player.lethe.upgrades.length >= 9 },
            tooltip: "Have 9 Guiding Beacons.<br>Rewards:Guiding Scythes level boosts Forgotten Drops effect.",
        },
        51: {
            name: "e(An Essence) of the Broken World",
            done() { return player.mem.points.gte(1e100) },
            tooltip: "Gain 1e100 Memories.<br>Rewards:Starts at 100 Memories when reset.",
            image: "img/acv/e(mem).png",
        },
        52: {
            name: "Stacks e(Stacks)",
            done() { return player.points.gte(9.99e99) },
            tooltip: "Gain 9.99e99 Fragments.",
            image: "img/acv/52.png",
        },
        53: {
            name: "Beacons Beside Lethe",
            done() { return player.lethe.upgrades.length >= 25 },
            tooltip: "Have 25 Guiding Beacons.",
            image: "img/acv/beacons beside lethe.jpg",
        },
        54: {
            name: "Why Did I Watch This?",
            done() { return hasChallenge('kou', 51) },
            tooltip: "Finish Red Comet challenge.<br>Rewards:You become more curious about what you are witnessing.",
        },
        55: {
            name: "The Lab.",
            done() { return hasUpgrade('mem', 42) },
            tooltip: "Set up the Lab.<br>Rewards:Unlock Lab layer and gain 1 Research Point.",
        },
        61: {
            name: "\"A Professional lab in its……field.\"",
            done() { return hasMilestone('lab', 7) },
            tooltip: "Build up your reputation among scientists.",
        },
        62: {
            name: "A Working Lab",
            done() { return player.lab.points.gte(1000) },
            tooltip: "Gain 1000 Research Points.",
        },
        63: {
            name: "Head into Anonymous",
            done() { return player.rei.unlocked && player.yugamu.unlocked },
            tooltip: "Unlock both Anonymous Layers.<br>Rewards:Keep Red Comet Challenge Finished when reset.",
            onComplete() {
                if (!hasChallenge('kou', 51)) player.kou.challenges[51] = 1;
            },
        },
        64: {
            name: "Glance into The World",
            done() { return player.world.unlocked },
            tooltip: "Unlock World Layer.",
        },
        65: {
            name: "The True Presbyter of The World",
            done() { return player.rei.roses.gte(100) },
            tooltip: "Gain 100 Glowing Roses.<br>Rewards:Glowing Roses now boosts The Speed of World Steps gain.",
            effect() {
                if (player['rei'].roses.lte(0)) return new Decimal(1);
                let eff = player.rei.roses.plus(1).log10().plus(1);
                if (hasAchievement('a', 85)) eff = player.rei.roses.plus(1).log(7.5).plus(1);
                if (hasAchievement('a', 93)) eff = eff.times(tmp.etoluna.starPointeffect);
                if (hasUpgrade('lethe', 63)) eff = eff.times(upgradeEffect('lethe', 63));
                if (hasUpgrade('lethe', 64)) eff = eff.times(upgradeEffect('lethe', 64));
                if (hasUpgrade('lethe', 65)) eff = eff.times(upgradeEffect('lethe', 65));
                if (hasUpgrade('lethe', 75)) eff = eff.times(upgradeEffect('lethe', 75));
                if (hasUpgrade('lethe', 85)) eff = eff.times(upgradeEffect('lethe', 85));
                return eff;
            },
            image:"img/acv/The true Presbyter of the world.jpg"
        },
        71: {
            name: "Dire Straits",
            done() { return player.yugamu.timesmoved.gte(10) },
            tooltip: "Move more than 10 times in the Maze<br>Rewards:Gain more 5 moves in the Maze.",
        },
        72: {
            name: "Triangulation",
            done() { return hasMilestone('rei', 4) && hasMilestone('yugamu', 4) },
            tooltip: "Reach LC & FL's 5th milestone.<br>Rewards:The speed of World Steps gain x1.5.",
        },
        73: {
            name: "Nothing Can Stop Us",
            done() { return player.world.restrictionnum.gte(1) && player.world.fixednum.gte(1) },
            tooltip: "Gone through both difficult World Steps.<br>Rewards:You can choose among two directions in Maze.",
        },
        74: {
            name: "Doll House",
            done() { return player.kou.points.gte(100) },
            tooltip: "Have more than 100 Red Dolls.<br>Rewards:Red Dolls itself boosts The Speed of World Steps gain.",
            effect() {
                return player.kou.points.plus(1).log10().div(1.5).max(1);
            },
        },
        75: {
            name: "Anthemy",
            done() { return player.rei.roses.gte(1000) },
            tooltip: "Gain 1000 Glowing Roses.<br>Rewards:Entering Zero Sky halves your GR instead of resetting them.",
        },
        81: {
            name: "Currently, nothing here",
            done() { return player.storylayer.unlocked },
            tooltip: "Begin your stories.",
            image: "img/acv/81.png",
        },
        82: {
            name: "Lossy Move",
            done() { return player.yugamu.timesmoved.gte(100) },
            tooltip: "Move more than 100 times in the Maze<br>Rewards:You can choose among three directions in Maze.",
        },
        83: {
            name: "Restrictions™",
            done() { return layers.world.restrictReward().gte(30) },
            tooltip: "Let Restriction Steps' reward ≥30.00x<br>Rewards:Restriction Steps' reward's softcap starts at 25.00x",
        },
        84: {
            name: "There is No Limit!",
            done() { return player.mem.points.gte(Number.MAX_VALUE) },
            tooltip: "Gain 1.79e308 Memories.",
            image: "img/acv/84.png",
        },
        85: {
            name: "Thats Not Intended",
            done() { return hasUpgrade('storylayer', 14) && inChallenge('rei', 11) && player.world.restrictChallenge },
            tooltip: "Endure Zero Sky & Restriction Challenge at the same time.<br>Rewards:Glowing Roses boost The Speed of World Steps gain better.",
        },
        91: {
            name: "Higher And Higher",
            done() { return player.world.points.gte(1000) },
            tooltip: "Gain 1000 World Steps.<br>Rewards:You can choose among all four directions in Maze.",
            image: "img/acv/Higher And Higher.jpg",
        },
        92: {
            name: "Building Group",
            done() { return player.rei.points.gte(10) && player.yugamu.points.gte(10) },
            tooltip: "Gain both 10 Luminous Churches&Flourish Labyrinths.<br>Rewards:Stories you have gone through boost Fragments generation.",
            effect() {
                return player.storylayer.points.plus(1);
            }
        },
        93: {
            name: "\"Oh, No. Another BA.\"",
            done() { return player.etoluna.starPoint.gte(250) && player.etoluna.moonPoint.gte(250) },
            tooltip: "Gain both 250 Star Points&Moon Points.<br>Rewards:Unlock their buffs.",
            effect() {
                return player.storylayer.points.plus(1);
            },
            image: "img/acv/93.png",
            //style:{'background-position':'center'}
        },
        94: {
            name: "Being others",
            done() { return challengeCompletions('saya', 11) >= 1 },
            tooltip: "Complete Memory Adjustment Challenge once.<br>Rewards:Keep World upgrades when reset, and you gain moves in maze 2x.",
        },
        95: {
            name: "Suspicious Spots",
            done() { return player.saya.unlocked && player.etoluna.unlocked },
            tooltip: "Unlock both Gemini & Knives Layers.<br>Rewards:You keep your World Atlas when reset.",
            effect() {
                return player.storylayer.points.plus(1);
            }
        },
        101: {
            name: "sizeof(double)",
            done() { return player.points.gte(Number.MAX_VALUE) },
            tooltip: "Gain 1.79e308 Fragments.",
            image: "img/acv/101.png",
        },
        102: {
            name: "\"I told you it's useless\"",
            done() { return (inChallenge('saya', 41) || (player.saya.CurrentPairChallenge!=null && tmp.saya.grid.ChallengeDepth[7]!=-1)) && inChallenge('rei', 11) },
            tooltip: "Enter Zero Sky while in Otherside of Godess Challenge.<br>Rewards:Everflashing Knives also effect Glowing roses Gain.",
        },
        103: {
            name: "Hypersense",
            done() { return player.etoluna.points.gte(100) },
            tooltip: "Gain 100 Gemini Bounds.<br>Rewards:Gemini Bounds give more speed on Star/Moon Points gaining.",
        },
        104: {
            name: "\"Did I just see an NaN?\"",
            done() { return (challengeCompletions('saya', 42) >= 5) && (inChallenge('saya', 42)||(player.saya.CurrentPairChallenge!=null && tmp.saya.grid.ChallengeDepth[8]>=5)) && player.tab == 'light' },
            tooltip: "See an NaN which won't break the game.",
            image: "img/acv/NaN.png",
        },
        105: {
            name: "Liner ≥ Softcaps",
            done() { return hasUpgrade('lab', 194) },
            tooltip: "Unlock Softcap Book.",
        },
        111: {
            name: "Worldwide Paces",
            done() { return player.ins.unlocked },
            tooltip: "Unlock Institutions.",
        },
        112: {
            name: "Seriously?",
            done() { return player.yugamu.timesmoved.gte(50000) },
            tooltip: "Move more than 50,000 times in Maze.<br>Rewards:Times moved in Maze slightly decrease Institution Fund requirement",
            effect() {
                return player.yugamu.timesmoved.max(1).log10().times(0.05).plus(1);
            },
        },
        113: {
            name: "You Can't Rely on These Forever",
            done() { return player['lab'].buyables[12].gte(100) && player['lab'].buyables[13].gte(200) },
            tooltip: "Reach Fragment Transformer & Memory Transformer's Effect Hardcap.<br>Rewards:Their overflowing levels provide weaker effects",
        },
        114: {
            name: "One World, One Goal",
            done() { return player.ins.inslevel.Eng.gte(1) && player.ins.inslevel.Fra.gte(1) && player.ins.inslevel.Deu.gte(1) && player.ins.inslevel.Che.gte(1) && player.ins.inslevel.Pol.gte(1) && player.ins.inslevel.Nor.gte(1) && player.ins.inslevel.Rus.gte(1) && player.ins.inslevel.Egy.gte(1) && player.ins.inslevel.Sau.gte(1) && player.ins.inslevel.Isr.gte(1) && player.ins.inslevel.Jpn.gte(1) && player.ins.inslevel.Ind.gte(1) && player.ins.inslevel.Kaz.gte(1) && player.ins.inslevel.Chn.gte(1) && player.ins.inslevel.Can.gte(1) && player.ins.inslevel.Usa.gte(1) && player.ins.inslevel.Bra.gte(1) && player.ins.inslevel.Arg.gte(1) && player.ins.inslevel.Nga.gte(1) && player.ins.inslevel.Zaf.gte(1) && player.ins.inslevel.Aus.gte(1) && player.ins.inslevel.Nzl.gte(1) },
            tooltip: "Let all Institution sites work at least lv.1.",
        },
        115: {
            name: "Power Awake",
            done() { return player.awaken.points.gte(1) },
            tooltip: "Unlock Awake layer.<br>Rewards:Unlock a new column of achievement.",
        },
        121: {
            name: "Define Aspects®",
            done() { return player.awaken.awakened.includes('light')&&player.awaken.awakened.includes('dark') },
            tooltip: "Awake both Light and Dark layers.",
            image:"img/acv/define aspects®.jpg"
        },
        122: {
            name: "Sea of Happiness",
            done() { return player.kou.points.gte(1000000) },
            tooltip: "Have more than 1,000,000 Red Dolls.",
        },
        123: {
            name: "The Researcher(!)",
            done() { return player.lab.points.gte(1e100)&&player.ins.points.gte(10000) },
            tooltip: "Have more than 1e100 Research Points and 10,000 Institution Funds.",
        },
        124: {
            name: "Clusters of Stars",
            done() { return player.etoluna.points.gte(1e100) },
            tooltip: "Have more than 1e100 Gemini Bounds.",
            image:"img/acv/clusters of stars.jpg"
        },
        125: {
            name: "Strategist",
            done() { return player.points.gte("1e5000")&&layers['lethe'].HyperBeaconLength() <= 12 },
            tooltip: "Have more than 1e5000 Fragments when you have no more than 12 Hyper Beacons.",
        },
        131: {
            name: "Define Aspects Co. Ltd",
            done() { return player['awaken'].awakened.includes('rei')&&player['awaken'].awakened.includes('yugamu') },
            tooltip: "Awake both Luminous & Flourish layers.",
            image:"img/acv/define aspects coltd.jpg"
        },
        132: {
            name: "Worldwide Communication",
            done() { return hasUpgrade('storylayer',52) },
            tooltip: "Unlock Institution Upgrades.",
        },
        133: {
            name: "Alchemist",
            done() { return player.fracture.ElementEssence.gte(500) },
            tooltip: "Have more than 500 Element Essences.<br>Rewards: Element Essence itself now slightly boosts its cap.",
        },
        134: {
            name: "Hold it!",
            done() { return (player.etoluna.starbump>0.9 && player.etoluna.moonbump<0.1)||(player.etoluna.moonbump>0.9 && player.etoluna.starbump<0.1) },
            tooltip: "Push Star/Moon Power while ignoring another.",
        },
        135: {
            name: "\"Oh, No. Another Pair Challenge.\"",
            done() { return (tmp.saya.grid.Sum_All_times>=5) },
            tooltip: "Complete Merge Attachment 5 times.<br>Rewards: Fragment goal of Merge Attachment decreases by Merge Attachment you completed.",
            effect(){
                let eff = new Decimal(tmp.saya.grid.Sum_All_times/280)*0.2
                return new Decimal(1).sub(eff);
            },
            image: "img/acv/PC.jpg",
        },
        141: {
            name: "Super Expander",
            done() { return (layers['fracture'].grid.return_Equiped_Equipment_Num(11)==9) },
            tooltip: "Equip 9 Element Capacity++ in Equipment slot.",
        },
        142: {
            name: "e(An Essence^2) of the Broken World",
            done() { return player.mem.points.gte("1e10000") },
            tooltip: "Gain 1e10000 Memories.",
            image: "img/acv/e(mem^2).png",
        },
        16: {
            name: "The Flash of Creation",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('light') },
            tooltip: "Awake Light layer.",
            image: "img/acv/the flash of creation.jpg",
        },
        26: {
            name: "Hide Capacities",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('dark') },
            tooltip: "Awake Dark layer.",
            image: "img/acv/hide capacities.jpg",
        },
        36: {
            name: "Gorgeous Petard",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('kou') },
            tooltip: "Awake Red layer.",
            image: "img/acv/Gorgeous Petard.jpg",
        },
        46: {
            name: "Spiritfarer",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('lethe') },
            tooltip: "Awake Forgotten layer.",
            image: "img/acv/Spiritfarer.jpg",
        },
        56: {
            name: "Uitima",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('rei') },
            tooltip: "Awake Luminous layer.",
            image: "img/acv/Ultima.jpg",
        },
        66: {
            name: "Nightmare Before the Storm",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('yugamu') },
            tooltip: "Awake Flourish layer.",
            image: "img/acv/Nightmare before storm.jpg",
        },
        76: {
            name: "Meteor Shower",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('etoluna') },
            tooltip: "Awake Gemini layer.",
            image: "img/acv/Meteor Shower.png",
        },
        86: {
            name: "Merge Conflict of Mind",
            unlocked() { return hasAchievement('a', 115) },
            done() { return player['awaken'].awakened.includes('saya') },
            tooltip: "Awake Knife layer.",
            image: "img/acv/Merge Conflict of Mind.jpg",
        },
    },
    tabFormat: [
        "blank",
        ["display-text", function () { return "When boosts say sth about achievements, usually it relates to the amount of achievements you have." }],
        ["display-text", function () { return "Achievements: " + player.a.achievements.length + "/" + (Object.keys(tmp.a.achievements).length - 2) }],
        "blank", "blank",
        "achievements",
    ],
},
)

addLayer("ab", {
    startData() { return { unlocked: true } },
    color: "yellow",
    symbol: "AB",
    row: "side",
    layerShown() { return hasAchievement('a', 21) },
    tooltip: "Autobuyers",
    clickables: {
        //rows: 6,
        cols: 4,
        11: {
            title: "Light Tachyons",
            display() {
                if (hasUpgrade('lab', 164)) {
                    if (player['awaken'].current == 'light') return "Force off";
                    else if (player['awaken'].current != 'dark') return "Force on";
                }
                return hasAchievement('a', 34) ? (player.light.auto ? "On" : "Off") : "Locked"
            },
            unlocked() { return tmp["light"].layerShown && hasAchievement('a', 34) },
            canClick() { return (hasAchievement('a', 34) && !hasUpgrade('lab', 164)) || (player['awaken'].current == 'dark' && player['awaken'].awakened.includes('light')) },
            onClick() { player.light.auto = !player.light.auto },
            style: { "background-color"() { return player.light.auto ? "#ededed" : "#666666" } },
        },
        12: {
            title: "Dark Matters",
            display() {
                if (hasUpgrade('lab', 164)) {
                    if (player['awaken'].current == 'dark') return "Force off";
                    else if (player['awaken'].current != 'light') return "Force on";
                }
                return hasAchievement('a', 34) ? (player.dark.auto ? "On" : "Off") : "Locked"
            },
            unlocked() { return tmp["dark"].layerShown && hasAchievement('a', 34) },
            canClick() { return (hasAchievement('a', 34) && !hasUpgrade('lab', 164)) || (player['awaken'].current == 'light' && player['awaken'].awakened.includes('dark')) },
            onClick() { player.dark.auto = !player.dark.auto },
            style: { "background-color"() { return player.dark.auto ? "#383838" : "#666666" } },
        },
        13: {
            title: "Red Dolls",
            display() {
                if (hasUpgrade('lab', 164)) {
                    if (player['awaken'].current == 'kou') return "Force off";
                    else if (player['awaken'].current != 'lethe') return "Force on";
                }
                return (hasUpgrade('lab', 71)) ? (player.kou.auto ? "On" : "Off") : "Locked"
            },
            unlocked() { return tmp["kou"].layerShown && hasUpgrade('lab', 63) && hasUpgrade('lab', 64) },
            canClick() { return hasUpgrade('lab', 71) && !hasUpgrade('lab', 164) },
            onClick() { player.kou.auto = !player.kou.auto },
            style: { "background-color"() { return player.kou.auto ? "#ffa0be" : "#666666" } },
        },
        14: {
            title: "Research Generator & Tech Transformer",
            display() {
                return (hasUpgrade('lab', 122)) ? (player.lab.generatorauto ? "On" : "Off") : "Locked"
            },
            unlocked() { return hasUpgrade('world', 21) },
            canClick() { return hasUpgrade('lab', 122) },
            onClick() { player.lab.generatorauto = !player.lab.generatorauto },
            style: { "background-color"() { return player.lab.generatorauto ? "#00bdf9" : "#666666" } },
        },
        21: {
            title: "Luminous Churches",
            display() {
                return (hasMilestone('etoluna', 3)) ? (player.rei.auto ? "On" : "Off") : "Locked"
            },
            unlocked() { return tmp["rei"].layerShown && player.etoluna.unlocked },
            canClick() { return hasMilestone('etoluna', 3) },
            onClick() { player.rei.auto = !player.rei.auto },
            style: { "background-color"() { return player.rei.auto ? "#ffe6f6" : "#666666" } },
        },
        22: {
            title: "Flourish Labyrinths",
            display() {
                return (hasMilestone('saya', 3)) ? (player.yugamu.auto ? "On" : "Off") : "Locked"
            },
            unlocked() { return tmp["yugamu"].layerShown && player.saya.unlocked },
            canClick() { return hasMilestone('saya', 3) },
            onClick() { player.yugamu.auto = !player.yugamu.auto },
            style: { "background-color"() { return player.yugamu.auto ? "#716f5e" : "#666666" } },
        },
        23: {
            title: "Everflashing Knives",
            display() {
                return (hasMilestone('ins', 4)) ? (player.saya.auto ? "On" : "Off") : "Locked"
            },
            unlocked() { return tmp["saya"].layerShown && player.ins.unlocked },
            canClick() { return hasMilestone('ins', 4) },
            onClick() { player.saya.auto = !player.saya.auto },
            style: { "background-color"() { return player.saya.auto ? "#16a951" : "#666666" } },
        },
    },
})

addLayer("sc", {
    startData() { return { unlocked: true } },
    color: "blue",
    symbol: "SC",
    row: "side",
    layerShown() { return hasUpgrade('lab', 194) },
    tooltip: "Softcaps",


    tabFormat:
        [
            ["display-text",
                function () { return "<h3 style='color: #c939db;'>Memory</h3><br>Softcap:" + format(tmp["mem"].softcap) + "<br>Gaining exponent:" + format(tmp["mem"].softcapPower) },
                {}],
            "blank",
            ["display-text",
                function () { return "<h3 style='color: #00bdf9;'>Research Point</h3><br>Softcap:" + format(layers.lab.pointsoftcap()) },
                {}],
            function () { if (player.lab.buyables[12].gte(100)) return "blank" },
            ["display-text",
                function () { if (player.lab.buyables[12].gte(100)) return "<h3>Fragment</h3> <h3 style='color: #00bdf9;'>Transformer</h3><br>Effect hardcap ends at ^1.1" + ((hasAchievement('a', 113)) ? "<br>Exceeding levels give weaker effect instead" : "") },
                {}],
            function () { if (player.lab.buyables[13].gte(200)) return "blank" },
            ["display-text",
                function () { if (player.lab.buyables[13].gte(200)) return "<h3 style='color: #c939db;'>Memory</h3> <h3 style='color: #00bdf9;'>Transformer</h3><br>Effect hardcap ends at ^+0.2" + ((hasAchievement('a', 113)) ? "<br>Exceeding levels give weaker effect instead" : "") },
                {}],
            function () { if (player.lab.buyables[21].gte(40000) || buyableEffect('lab', 21).gt(1500)) return "blank" },
            ["display-text",
                function () {
                    let des = "";
                    if (player.lab.buyables[21].gte(40000) || buyableEffect('lab', 21).gt(1500)) des += "<h3 style='color: #ededed;'>Light</h3> <h3 style='color: #00bdf9;'>Transformer</h3>";
                    if (player.lab.buyables[21].gte(40000)) des += "<br>Cost ^1.5 after transformed 40,000 times"
                    if (buyableEffect('lab', 21).gt(1500)) des += "<br>Effect softcap:1,500x<br>Softcap exponent:0.25"
                    return des;
                },
                {}],
            function () { if (player.lab.buyables[22].gte(40000) || buyableEffect('lab', 22).gt(1500)) return "blank" },
            ["display-text",
                function () {
                    let des = "";
                    if (player.lab.buyables[22].gte(40000) || buyableEffect('lab', 21).gt(1500)) des += "<h3 style='color: #383838;'>Dark</h3> <h3 style='color: #00bdf9;'>Transformer</h3>";
                    if (player.lab.buyables[22].gte(40000)) des += "<br>Cost ^1.5 after transformed 40,000 times"
                    if (buyableEffect('lab', 22).gt(1500)) des += "<br>Effect softcap:1,500x<br>Softcap exponent:0.25"
                    return des;
                },
                {}],
            "blank",
            ["display-text",
                function () {
                    if (buyableEffect('lab',31).lte(2e6)) return "";
                    let des = "<h3 style='color: #ffa0be;'>Doll</h3> <h3 style='color: #00bdf9;'>Transformer</h3><br>"
                    des +="Effect Softcap: 2e6x<br>";
                    des +="Exponent: 1/3"
                    return des;
                },
                {}],
            "blank",
            ["display-text",
                function () { return "<h3 style='color: #ddeee3;'>World Step Height</h3><br>Softcap:" + format(layers.world.WorldstepHeightsc()) + "<br>Exceeding exponent:" + format(layers.world.WorldstepHeightscexp()) },
                {}],
            "blank",
            ["display-text",
                function () { return "<h3 style='color: #eec109;'>Fixed</h3> <h3 style='color: #ddeee3;'>World Step effect</h3><br>Softcap:" + format(layers.world.fixedsoftcap()) + "<br>Exponent:" + format(layers.world.fixedsoftcapexp()) },
                {}],
            "blank",
            ["display-text",
                function () {
                    let des = "<h3 style='color: #e8272a;'>Restricted</h3> <h3 style='color: #ddeee3;'>World Step effect</h3><br>Softcap:" + format(layers.world.restrictsoftcap()) + "<br>Exponent:" + format(layers.world.restrictsoftcapexp())
                    if (!hasUpgrade('storylayer', 43)) des += ("<br>Hardcap ends at:" + format(layers.world.restricthardcap()))
                    else des += ("<br>Secondary softcap:" + format(layers.world.restricthardcap()) + "<br>Exceeding effect log10-ed two times, then times Secondary softcap.")
                    return des;
                },
                {}],
            "blank",
            ["display-text",
                function () {
                    if (!(player['awaken'].current == 'rei'||player['awaken'].awakened.includes('rei'))) return "";
                    if (tmp["rei"].challenges[11].effectAWtoRF.lte(1000)) return "";
                    let des = "<h3 style='color: #ffe6f6;'>Glowing Roses effect</h3><br>"
                    des +="Effect to Red & Forgotten Layer Softcap: 1000x<br>";
                    des +="Exponent: 1/3"
                    return des;
                },
                {}],
            "blank",
            ["display-text",
                function () {
                    if (!(player['awaken'].current == 'yugamu'||player['awaken'].awakened.includes('yugamu'))) return "";
                    if (tmp["yugamu"].movetimes.lte(1e100)) return "";//没准可以改
                    let des = "<h3>Times You Can Move in </h3><h3 style='color: #716f5e;'>Maze</h3><br>"
                    des +="Softcap: 3e100 Times<br>";
                    des +="Exponent: 0.25"
                    return des;
                },
                {}],
            "blank",
            ["display-text",
                function () {
                    if (layers.ins.insEffect().Bra().lte(5e20)) return "";
                    let des = "<h3 style='color: #009641;'>Brazil</h3> <h3 style='color: #45b5d3;'>Institution Site</h3><h3> Effect</h3><br>"
                    des +="Effect Softcap: 5e20x<br>";
                    des +="Exponent: 0.75"
                    return des;
                },
                {}],
        ],
})