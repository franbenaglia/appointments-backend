require('dotenv').config();
module.exports = {
    URL: process.env.URL || 'http://localhost:',
    PORT: process.env.PORT || 3000,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '153102432694-kq5o458dd8m89g4jf2cchstni661qtun.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'y_03SsTJNKG-TftN6gTtPyC5',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '510966d0ad1478f0861a',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || 'f1fc5569da13806b0d1100db3d8a541fbb227f35',
    SECRET: process.env.SECRET || "secret",
    FRONT_END_SERVER: process.env.FRONT_END_SERVER || 'http://localhost:8100',
    EMAIL: process.env.EMAIL || 'francisco.arcebenaglia@gmail.com',
    PASSWORD: process.env.PASSWORD || 'yimo sghw fwwi ylln'
}