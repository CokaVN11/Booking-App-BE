import nodemailer from "nodemailer";

export class EmailService {
  private static instance: EmailService | null = null;
  private transporter: nodemailer.Transporter | null = null;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }

    return EmailService.instance;
  }

  sendOTP = async (email: string, otp: string) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for verification",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    };

    try {
      await this.transporter!.sendMail(mailOptions);
    } catch (error) {
      const _error = error as Error;
      throw new Error(`Error sending OTP: ${_error.message}`);
    }
  };

}
