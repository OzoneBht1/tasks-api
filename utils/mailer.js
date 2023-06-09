import nodemailer from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid-transport";

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.NODEMAILER_API,
    },
  })
);

export const sendMail = (email, subject, html) => {
  transporter.sendMail({
    to: email,
    from: "ozonebhattarai@gmail.com",
    subject: subject,
    html: html,
  });
};
