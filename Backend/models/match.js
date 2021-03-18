const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
const Round = require('../models/round');
const Referee = require('../models/referee');
const User = require('../models/user');
const Club = require('../models/club');

const Match = sequelize.define('Sudija', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tim_A_golova: DataTypes.STRING,
    tim_B_golova: DataTypes.STRING,
    datum_odrzavanja: DataTypes.DATE,
    odlozeno: DataTypes.BOOLEAN,
    zavrseno: DataTypes.BOOLEAN,
},{
    freezeTableName: true,
    timestamps: false,
});

Match.belongsTo(Round, {foreignKey : "kolo_id"});
Match.belongsTo(Referee, {foreignKey : "prvi_sudija_id"});
Match.belongsTo(Referee, {foreignKey : "drugi_sudija_id"});
Match.belongsTo(User, {foreignKey : "azurirao"});
Match.belongsTo(Club, {foreignKey : "tim_A_id"});
Match.belongsTo(Club, {foreignKey : "tim_B_id"});

module.exports = Match;