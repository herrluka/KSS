const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../database/connection");
const Round = require('../models/round');
const Referee = require('../models/referee');
const User = require('../models/user');
const Club = require('../models/club');

const Match = sequelize.define('Utakmica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tim_A_koseva: DataTypes.STRING,
    tim_B_koseva: DataTypes.STRING,
    datum_odrzavanja: DataTypes.DATE,
    odlozeno: DataTypes.BOOLEAN,
},{
    freezeTableName: true,
    timestamps: false,
});

Match.belongsTo(Round, {foreignKey : "kolo_id", as: 'kolo'});
Match.belongsTo(Referee, {foreignKey : "prvi_sudija_id", as: "prvi_sudija"});
Match.belongsTo(Referee, {foreignKey : "drugi_sudija_id", as: "drugi_sudija"});
Match.belongsTo(User, {foreignKey : "azurirao", as: "korisnik"});
Match.belongsTo(Club, {foreignKey : "tim_A_id", as: "klub_A"});
Match.belongsTo(Club, {foreignKey : "tim_B_id", as: "klub_B"});

module.exports = Match;