module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Patient", {
    mrNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    centreCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    districtName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stateName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    countryName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    location: {
      type: DataTypes.STRING(400),
      allowNull: false
    }
  }, { timestamps: false });
};

