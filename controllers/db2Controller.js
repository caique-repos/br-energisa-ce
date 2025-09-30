const ibmdb = require("ibm_db");
const connectDb2 = require("../config/db2");

const getNegotiation = async (req, res) => {
  let { id } = req.body;
  console.log(id);

  let conn;
  try {
    conn = await connectDb2();

    let data = await conn.query("SELECT * FROM NEGOCIACAO WHERE id = ?", [id]);

    console.log(data[0]);
    let negotiationData = {
      ID: data[0].ID,
      VALOR: data[0].VALOR,
      CONDICAO_PRECO: data[0].CONDICAO_PRECO,
      DATA_ENTREGA: data[0].DATA_ENTREGA,
      DATA_PAGAMENTO: data[0].DATA_PAGAMENTO,
      COMENTARIO_FORNECEDOR: data[0].COMENTARIO_FORNECEDOR,
      COMENTARIO_COLABORADOR: data[0].COMENTARIO_COLABORADOR,
      NUMERO_RODADA: data[0].NUMERO_RODADA,
      CNPJ: data[0].CNPJ,
      PRAZO_PAGAMENTO: data[0].PRAZO_PAGAMENTO,
    };
    res.status(200).send(negotiationData);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).send("Erro na consulta");
  } finally {
    if (conn) {
      await conn.close();
      console.log("Connection closed.");
    }
  }
};

const updateNegotiationCollaborator = async (req, res) => {
  let roundNumber;
  let { id, field, newValue, comment } = req.body;
  let conn;

  try {
    conn = await connectDb2();
    const sql = `UPDATE NEGOCIACAO SET ${field} = ? WHERE id = ?`;
    await conn.query(sql, [newValue, id]);
    const queryComment = `UPDATE NEGOCIACAO SET COMENTARIO_COLABORADOR = ? WHERE id = ?`;
    await conn.query(queryComment, [comment, id]);
    let currentData = await conn.query(
      "SELECT * FROM NEGOCIACAO WHERE id = ?",
      [id]
    );
    roundNumber = parseInt(currentData[0].NUMERO_RODADA) + 1;
    let roundQuery = `UPDATE NEGOCIACAO SET NUMERO_RODADA = ? WHERE id = ?`;
    await conn.query(roundQuery, [roundNumber, id]);
    let updatedData = await conn.query(
      "SELECT * FROM NEGOCIACAO WHERE id = ?",
      [id]
    );
    res.status(200).send(updatedData[0]);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).send("Erro na consulta");
  } finally {
    if (conn) {
      await conn.close();
      console.log("Connection closed.");
    }
  }
};

// const updateNegotiationSupplier = async (req, res) => {

//     let roundNumber
//     let { id, field, newValue, comment } = req.body;
//     console.log(id);
//     let conn;

//     try {
//         conn = await connectDb2();
//         const sql = `UPDATE NEGOCIACAO SET ${field} = ? WHERE id = ?`;
//         await conn.query(sql, [newValue, id]);
//         const queryComment = `UPDATE NEGOCIACAO SET COMENTARIO_FORNECEDOR = ? WHERE id = ?`
//         await conn.query(queryComment, [comment, id]);
//         let currentData = await conn.query(
//         "SELECT * FROM NEGOCIACAO WHERE id = ?",
//         [id]
//         );
//         roundNumber=parseInt(currentData[0].NUMERO_RODADA) + 1
//         let roundQuery = `UPDATE NEGOCIACAO SET NUMERO_RODADA = ? WHERE id = ?`
//         await conn.query(roundQuery, [roundNumber, id]);
//         let updatedData = await conn.query(
//         "SELECT * FROM NEGOCIACAO WHERE id = ?",
//         [id]
//         );
//         res.status(200).send(updatedData[0]);

//     } catch (err) {
//         console.error("Query error:", err);
//         res.status(500).send("Erro na consulta");
//     } finally {
//         if (conn) {
//             await conn.close();
//             console.log("Connection closed.");
//     }
//   }
// };

const updateNegotiationSupplierArray = async (req, res) => {
  let conn;

  try {
    // let roundNumber;
    let { id, fields, newValues, comment } = req.body;
    console.log(req.body);
    conn = await connectDb2();
    console.log(fields);
    console.log(newValues);
    for (let i = 0; i < fields.length; i++) {
      const sql = `UPDATE NEGOCIACAO SET ${fields[i]} = ? WHERE id = ?`;
      console.log(sql);
      await conn.query(sql, [newValues[i], id]);
    }

    const queryComment = `UPDATE NEGOCIACAO SET COMENTARIO_FORNECEDOR = ? WHERE id = ?`;
    await conn.query(queryComment, [comment, id]);

    // let currentData = await conn.query(
    //   "SELECT * FROM NEGOCIACAO WHERE id = ?",
    //   [id]
    // );

    // roundNumber = parseInt(currentData[0].NUMERO_RODADA ?? 0) + 1;
    // const roundQuery = `UPDATE NEGOCIACAO SET NUMERO_RODADA = ? WHERE id = ?`;
    // await conn.query(roundQuery, [roundNumber, id]);

    let updatedData = await conn.query(
      "SELECT * FROM NEGOCIACAO WHERE id = ?",
      [id]
    );

    res.status(200).send(updatedData[0]);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).send("Erro na consulta");
  } finally {
    if (conn) {
      await conn.close();
      console.log("Connection closed.");
    }
  }
};

// const updateNegotiationSupplierArray = async (req, res) => {
//     let conn;

//     try {
//         // let roundNumber;
//         let { id, fields, newValues, comment } = req.body;
//         console.log(req.body)
//         conn = await connectDb2();
//         for (let i = 0; i < fields.length; i++) {
//             console.log(fields[i])
//             const sql = `UPDATE NEGOCIACAO SET ${fields[i]} = ? WHERE id = ?`;
//             console.log(sql)
//             await conn.query(sql, [newValues[i], id]);
//     }

//         const queryComment = `UPDATE NEGOCIACAO SET COMENTARIO_FORNECEDOR = ? WHERE id = ?`;
//         await conn.query(queryComment, [comment, id]);

//         // let currentData = await conn.query(
//         // "SELECT * FROM NEGOCIACAO WHERE id = ?",
//         // [id]
//         // );

//         // // roundNumber = parseInt(currentData[0].NUMERO_RODADA ?? 0) + 1;
//         // // const roundQuery = `UPDATE NEGOCIACAO SET NUMERO_RODADA = ? WHERE id = ?`;
//         // // await conn.query(roundQuery, [roundNumber, id]);

//         let updatedData = await conn.query(
//         "SELECT * FROM NEGOCIACAO WHERE id = ?",
//         [id]
//         );

//         res.status(200).send(updatedData[0]);
//     } catch (err) {
//         console.error("Query error:", err);
//         res.status(500).send("Erro na consulta");
//     } finally {
//         if (conn) {
//         await conn.close();
//         console.log("Connection closed.");
//     }
//   }
// };

const getNegotiations = async (id) => {
  console.log(id);

  let conn;
  try {
    conn = await connectDb2();

    let data = await conn.query("SELECT * FROM NEGOCIACAO WHERE id = ?", [id]);

    console.log(data[0]);
    return data[0];
  } catch (err) {
    console.error("Query error:", err);
    return "Erro na consulta";
  } finally {
    if (conn) {
      await conn.close();
      console.log("Connection closed.");
    }
  }
};

const getNegotiationArray = async (req, res) => {
  let { id } = req.body;
  console.log(id);
  let negotiationArray = [];
  let conn;
  try {
    conn = await connectDb2();
    for (let i = 0; i < id.length; i++) {
      let data = await conn.query("SELECT * FROM NEGOCIACAO WHERE id = ?", [
        id[i],
      ]);
      let negotiationData = {
        ID: data[0].ID,
        VALOR: data[0].VALOR,
        CONDICAO_PRECO: data[0].CONDICAO_PRECO,
        DATA_ENTREGA: data[0].DATA_ENTREGA,
        DATA_PAGAMENTO: data[0].DATA_PAGAMENTO,
        COMENTARIO_FORNECEDOR: data[0].COMENTARIO_FORNECEDOR,
        COMENTARIO_COLABORADOR: data[0].COMENTARIO_COLABORADOR,
        NUMERO_RODADA: data[0].NUMERO_RODADA,
        CNPJ: data[0].CNPJ,
        PRAZO_PAGAMENTO: data[0].PRAZO_PAGAMENTO,
      };
      negotiationArray.push(negotiationData);
    }
    console.log(negotiationArray);

    res.status(200).send(negotiationArray);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).send("Erro na consulta");
  } finally {
    if (conn) {
      await conn.close();
      console.log("Connection closed.");
    }
  }
};

module.exports = {
  getNegotiation,
  updateNegotiationCollaborator,
  updateNegotiationSupplierArray,
  getNegotiations,
  getNegotiationArray,
};
