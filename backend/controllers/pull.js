const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".repogit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(commitsPath, { recursive: true });

    const data = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: "commits/"
    }).promise();

    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;

      // Skip folder placeholder
      if (key.endsWith("/")) continue;

      const params = {
        Bucket: S3_BUCKET,
        Key: key
      };

      const fileContent = await s3.getObject(params).promise();

      const fileName = path.basename(key);
      const filePath = path.join(commitsPath, fileName);

      await fs.writeFile(filePath, fileContent.Body);
    }

    console.log("Repository Pulled from S3 Successfully");
  } catch (err) {
    console.log("Unable to Pull Repository", err);
  }
}

module.exports = { pullRepo };
