const {Sequelize} = require("sequelize")

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database/taskManagerDatabase.db" // Locul stocarii datelor
})

sequelize.sync({force: true}).then(() => {
    console.log("Models have been synchronized");
});

module.exports = sequelize