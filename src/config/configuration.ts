export default () => ({
    nodeEnv: process.env.NODE_ENV || 'develop',
    jwtSecret: 'secret',
    app: {
        port: process.env.APP_PORT || 3000,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    database: {
        type: process.env.DATABASE_TYPE || 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME
    }
})