import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:'adityakumar24ab@gmail.com',
  
        pass:'kzhs nflu jvis xzqo'          // Use App password (not Gmail password)
      }
    });

    await transporter.sendMail({
      from: "yourEmail@gmail.com",
      to,
      subject,
      text
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
};
