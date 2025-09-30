const ibmdb = require("ibm_db");

process.env.DB2CODEPAGE = "1208";

const connectDb2 = async () => {
  console.log("Conectando");

  const connStr = `DATABASE=bludb;HOSTNAME=${process.env.DB2_HOSTNAME};;UID=${process.env.DB2_UID};PWD=${process.env.DB2_PWD};PORT=${process.env.DB2_PORT};PROTOCOL=TCPIP;SECURITY=SSL;CCSID=1208`;

  try {
    const conn = await ibmdb.open(connStr);
    console.log("Conectou");
    return conn;
  } catch (err) {
    console.error("Connection error:", err);
    throw err;
  }
};

module.exports = connectDb2;
