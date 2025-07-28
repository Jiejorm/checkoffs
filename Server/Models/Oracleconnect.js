const oracledb = require("oracledb");
const dotenv = require("dotenv");
dotenv.config();

// async function OcConnect() {}rs
let OraclePool = null;

const OcConnect = async () => {
	if (OraclePool === null);
		OraclePool = await oracledb.createPool({
			user: process.env.ORACLE_USER , 
			password: process.env.ORACLE_PASSWORD,
			connectString: process.env.ORACLE_CONNECT_STRING,
		});
	return OraclePool;
};

module.exports = OcConnect;
