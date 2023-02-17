const AWS = require("aws-sdk");
const uuid = require("uuid");

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

module.exports.handler = async (event) => {
  console.log("Processing event: ", event);
  const itemId = uuid.v4();

  let parsedBody;

  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    console.log("Error parsing event body: ", error);
  }

  const newItem = {
    id: itemId,
    ...parsedBody,
  };

  await docClient
    .put({
      TableName: groupsTable,
      Item: newItem,
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
