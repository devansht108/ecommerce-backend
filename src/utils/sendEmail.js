import nodemailer from "nodemailer";

// Email bhejne ka function
export const sendEmail = async ({ to, subject, html }) => {
  // Nodemailer ka transporter create kar rahe hain (Gmail use karte hue)
  const transporter = nodemailer.createTransport({
    service: "gmail", // Gmail SMTP service
    auth: {
      user: process.env.EMAIL,      // Gmail ka email (env me store)
      pass: process.env.EMAIL_PASS, // Gmail ka app password
    },
  });

  // Actual email bhejna
  await transporter.sendMail({
    from: process.env.EMAIL, // Kis email se bhejna hai
    to,                      // Kisko bhejna hai
    subject,                 // Email ka subject
    html,                    // Email ka HTML content
  });
};
