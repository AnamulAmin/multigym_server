import { sendEmailWithResend } from "../sendEmailWithResend.js"

export async function sendForgotPasswordMail(recepient, link) {
    
    const message = `<p>Click <a href="${link}">Here</a></p>`
    
    await sendEmailWithResend(recepient, 'Reset Forgotten Password', message)
}