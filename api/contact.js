import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message, newsletter } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS   
      }
    });

    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.MAIL_USER}>`,
      to: "sahobordavid@gmail.com", // your email
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Newsletter?:</strong> ${newsletter ? "Yes" : "No"}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ message: "Email sending failed", error });
  }
}
