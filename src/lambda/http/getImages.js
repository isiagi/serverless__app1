const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;

module.exports.handler = async (event) => {
  console.log("Caller event", event);

  const groupId = event.pathParameters.groupId;

  const validGroupId = await groupExists(groupId);

  if (!validGroupId) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Group does not exist",
      }),
    };
  }

  const images = await getImagesPerGroup(groupId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items: images,
    }),
  };
};

async function groupExists(groupId) {
  const result = await docClient
    .get({
      TableName: groupsTable,
      Key: {
        id: groupId,
      },
    })
    .promise();

  console.log("Get group: ", result);

  return !!result.Item;
}

async function getImagesPerGroup(groupId) {
  const result = await docClient
    .query({
      TableName: imagesTable,
      KeyConditionExpression: "groupId = :groupId",
      ExpressionAttributeValues: {
        ":groupId": groupId,
      },
      ScanIndexForward: false,
    })
    .promise();

    return result.Items
}
