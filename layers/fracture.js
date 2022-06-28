addLayer("fracture", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    symbol: "GE",
    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "prestige points",            // The name of this layer's main prestige resource.
    row: 4,                                 // The row this layer is on (0 is the first row).
    displayRow: 5,

    baseResource: "Light Tachyons",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.light.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    roundUpCost: true,

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat:{
        "Equipments":{
            content:[
                ["display-text","Currently nothing here"],
                ["display-text","Currently there meant to be a grid here but I dont know what to code help"],
                "grid",
            ],
        }

    },

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    grid: {
        rows: 2, // If these are dynamic make sure to have a max value as well!
        cols: 2,
        maxRows: 5,
        maxCols: 5,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 
            player[this.layer].grid[id]++
        },
        getDisplay(data, id) {
            return "data" 
        },
    
        //etc
    },
})