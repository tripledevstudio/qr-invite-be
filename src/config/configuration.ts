export default () => ({
  port: process.env.PORT || 3000,
  database: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
  },
});
