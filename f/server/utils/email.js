import nodemailer from "nodemailer"

// Create a test account for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount()
  return {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  }
}

export const sendEmail = async (to, subject, text) => {
  try {
    // Use environment variables for production or create test account for development
    const transportConfig = process.env.EMAIL_HOST
      ? {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE === "true",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : await createTestAccount()

    const transporter = nodemailer.createTransport(transportConfig)

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Food Delivery" <noreply@fooddelivery.com>',
      to,
      subject,
      text,
    })

    console.log("Email sent:", info.messageId)

    // Log URL for ethereal emails in development
    if (!process.env.EMAIL_HOST) {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
    }

    return true
  } catch (error) {
    console.error("Email sending error:", error)
    return false
  }
}

