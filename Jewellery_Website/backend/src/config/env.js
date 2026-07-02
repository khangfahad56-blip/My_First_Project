import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET'];

required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 3000),
    appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    csrfSecret: process.env.CSRF_SECRET || process.env.JWT_SECRET,
    uploadDir: process.env.UPLOAD_DIR || 'backend/uploads',
    maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 5),
    mail: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.MAIL_FROM || 'Fahad Jeweller <no-reply@example.com>'
    }
};
