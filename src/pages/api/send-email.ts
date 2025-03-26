import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to_email, subject, content } = req.body;

  if (!to_email || !subject || !content) {
    return res
      .status(400)
      .json({ error: "Missing email, subject, or content" });
  }

  // Create a transporter using your email service (e.g., Gmail, SMTP)
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail, SendGrid, etc.)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: subject,
    text: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
