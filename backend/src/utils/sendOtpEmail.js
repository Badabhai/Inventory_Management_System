import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

const sendOtpEmail = async( emailId, otpType, otp ) => {
    //otpType can be either "Account Verfication" or "Password Reset"
    try {
        //content
        const mailOptions = {
            from : `IMS <${process.env.EMAIL_USER}>`,
            to : emailId,
            subject : `OTP for ${otpType}`,
            text : `OTP for ${otpType} is ${otp}. It is valid for 5 minutes`,
            html: `<p>OTP for ${otpType} is ${otp}</b>. It is valid for 5 minutes.</p>`,
        }

        //send mail
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP Email Sent. ",info.messageId);
        
    } catch (error) {
        console.error("Error occured while sending Mail. ",error);
        
    }
}

export { sendOtpEmail }