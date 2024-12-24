const { DataTypes } = require("sequelize")
const sequelize = require("../sequelize")

const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['Open', 'Pending', 'Completed', "Closed"],
            validate: {
            isIn: [['Open', 'Pending', 'Completed', "Closed"]]
        }
        }
    }
)

module.exports = Task