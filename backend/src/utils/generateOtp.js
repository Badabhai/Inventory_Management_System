import crypto from "crypto" 

const generateOtp = () => {
    let OTP = crypto.randomInt(100000, 999999);
    return OTP;
}

export { generateOtp }