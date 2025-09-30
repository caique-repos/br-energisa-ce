const IBM = require("ibm-cos-sdk");

const { COS_ENDPOINT, COS_APIKEY_ID, COS_SERVICE_INSTANCE } = process.env;

var config = {
  endpoint: COS_ENDPOINT,
  apiKeyId: COS_APIKEY_ID,
  serviceInstanceId: COS_SERVICE_INSTANCE,
  signatureVersion: "iam",
};

const cos = new IBM.S3(config);

async function uploadToCos(
  bucketName,
  file,
  correctedFilename,
  email,
  originalFilename
) {
  console.log(` Uploading ${correctedFilename} to bucket: ${bucketName}`);
  const key = `${correctedFilename}`;
  await cos
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentDisposition: "inline",
      ContentType: "application/pdf",
      ...(email &&
        originalFilename && {
          Metadata: { email: email, filename: originalFilename },
        }),
    })
    .promise()
    .then((file) => {
      console.log("File uploaded!");
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
  return key;
}

async function getBuckets() {
  console.log("Retrieving list of buckets");
  await cos
    .listBuckets()
    .promise()
    .then((data) => {
      if (data.Buckets != null) {
        for (var i = 0; i < data.Buckets.length; i++) {
          console.log(`Bucket Name: ${data.Buckets[i].Name}`);
        }
      }
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

async function getBucketContents(bucketName) {
  console.log(`Retrieving bucket contents from: ${bucketName}`);

  try {
    const data = await cos.listObjects({ Bucket: bucketName }).promise();
    let sortedData = data.Contents.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );
    // console.log(sortedData);
    return sortedData;
  } catch (e) {
    console.error(`ERROR: ${e.code} - ${e.message}\n`);
    return null;
  }
}

async function getItem(bucketName, itemName) {
  console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
  console.log(config);

  try {
    const data = await cos
      .getObject({
        Bucket: bucketName,
        Key: itemName,
      })
      .promise();
    return data;
  } catch (err) {
    console.log(err);
  }
}

function deleteItem(bucketName, itemName) {
  console.log(`Deleting item: ${itemName}`);
  return cos
    .deleteObject({
      Bucket: bucketName,
      Key: itemName,
    })
    .promise()
    .then(() => {
      console.log(`Item: ${itemName} deleted!`);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

module.exports = {
  getBucketContents,
  getBuckets,
  uploadToCos,
  getItem,
  deleteItem,
};
