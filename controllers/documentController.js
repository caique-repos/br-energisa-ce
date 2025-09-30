const axios = require("axios");
const { uploadToCos, deleteItem, getBucketContents } = require("../config/cos");
const { getNegotiations } = require("./db2Controller");

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
} = require("docx");
const fs = require("fs");

const parseSpecs = (text) => {
  if (typeof text !== "string") return [];
  return text
    .split("-")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

const createDoc = async (filename, negotiation) => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const title = `${filename} - ${day}/${month}/${year}`;

  try {
    const cleanData = (text) => {
      if (typeof text !== "string") return "";
      return text.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
    };

    const paragraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: cleanData(title),
            size: 44,
            font: "Arial",
            bold: true,
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Produto: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.PRODUTO),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Fábrica: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.FABRICA),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Modelo: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.MODELO),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Especificações Técnicas:",
            size: 32,
            font: "Arial",
            bold: true,
          }),
        ],
      }),

      ...parseSpecs(cleanData(negotiation.ESPECIFICACOES)).map(
        (item) =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: item,
                font: "Arial",
                size: 22,
              }),
            ],
          })
      ),

      new Paragraph({
        children: [
          new TextRun({
            text: `Quantidade: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.QUANTIDADE),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          before: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Nº Requisição: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.NUMERO_REQUISICAO),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Código Material: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.CODIGO_MATERIAL),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Descrição Curta: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.DESCRICAO_CURTA),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Classe do Material: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.CLASSE_MATERIAL),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Unidade de Medida: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.UNIDADE_MEDIDA),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Informações de Entrega: `,
            size: 32,
            font: "Arial",
            bold: true,
          }),
        ],
        spacing: {
          after: 100,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Local de Entrega: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.LOCAL_ENTREGA),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Filial de Faturamento: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.FILIAL_FATURAMENTO),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Dados do Fornecedor: `,
            size: 32,
            font: "Arial",
            bold: true,
          }),
        ],
        spacing: {
          after: 100,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Razão social: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.RAZAO_SOCIAL),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `CNPJ: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.CNPJ),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Status de cadastro: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.STATUS_CADASTRO),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Endereço: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.ENDERECO),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Contato Comercial: `,
            size: 32,
            font: "Arial",
            bold: true,
          }),
        ],
        spacing: {
          after: 100,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Nome: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.NOME_CONTATO_COMERCIAL),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Telefones: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.TELEFONE_CONTATO_COMERCIAL),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `E-mail: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.EMAIL_CONTATO_COMERCIAL),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Dados bancários: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.DADOS_BANCARIOS),
            size: 24,
            font: "Arial",
          }),
        ],
        spacing: {
          after: 300,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Contato de Faturamento: `,
            size: 32,
            font: "Arial",
            bold: true,
          }),
        ],
        spacing: {
          after: 100,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Nome: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.NOME_CONTATO_FATURAMENTO),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Telefones: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.TELEFONE_CONTATO_FATURAMENTO),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `E-mail: `,
            size: 24,
            font: "Arial",
            bold: true,
          }),
          new TextRun({
            text: cleanData(negotiation.EMAIL_CONTATO_FATURAMENTO),
            size: 24,
            font: "Arial",
          }),
        ],
      }),
    ];

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    console.log("Doc created successfully");
    return buffer;
  } catch (err) {
    console.error("Error creating document:", err);
    return null;
  }
};

const uploadDocument = async (req, res) => {
  let { negotiationId } = req.body;
  console.log(req.body);

  let newFileName = `Pedido de Compra - ${negotiationId}.docx`;

  console.log(`Pegando dados da negociaçao ${negotiationId}`);
  let negotiation = await getNegotiations(negotiationId);

  try {
    console.log(`Subindo pedido de compra ${newFileName}`);
    let doc = await createDoc(newFileName, negotiation);
    console.log(doc);
    await uploadToCos("pedidos-de-compra", doc, newFileName);
    res.send({ response: "Pedido de compra criado com sucesso!" }).status(200);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

module.exports = { uploadDocument };
