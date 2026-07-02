import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const hasMailConfig = env.mail.host && env.mail.user && env.mail.pass;

const transporter = hasMailConfig
    ? nodemailer.createTransport({
        host: env.mail.host,
        port: env.mail.port,
        secure: env.mail.secure,
        auth: {
            user: env.mail.user,
            pass: env.mail.pass
        }
    })
    : null;

export const sendMail = async ({ to, subject, text }) => {
    if (!transporter) {
        return { skipped: true };
    }

    return transporter.sendMail({
        from: env.mail.from,
        to,
        subject,
        text
    });
};
