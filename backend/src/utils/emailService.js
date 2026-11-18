
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"CartWise" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "CartWise - Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #101D32;">CartWise Password Reset</h2>
                <p>Your password reset OTP is:</p>
                <h1 style="color: #FF8500; letter-spacing: 8px;">
                    ${otp}
                </h1>
                <p>This OTP expires in <strong>5 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thanks,<br/>CartWise Team</p>
            </div>
        `,
    });
};

module.exports = { sendOtpEmail };
