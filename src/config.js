export default {
  app: {
    port: process.env.PORT || 3000,
  },
  line: {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  },
  firebase: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSendId: process.env.MESSAGING_SEND_ID,
    apiId: process.env.API_ID,
    measurementId: process.env.MEASUREMENT_ID,
  },
}
