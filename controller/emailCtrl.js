const nodemailer = require('nodemailer')

const  SendMail =  async(to, html,next)=>   {
   
try {
    
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user: "yenatcreation@gmail.com",
            pass: "isom kbtl mjhz zpcw"
        }
    })

    const mail = {
        from: "yenatcreation@gmail.com",
        to: to,
        subject: "Reset your password with this Link",
        html: html
    }

  await transporter.sendMail(mail)

} catch (error) {
    next(error)
    
}

}

module.exports = { SendMail}