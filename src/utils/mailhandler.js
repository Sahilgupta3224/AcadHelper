import nodemailer from "nodemailer";

console.log(process.env.Email);
console.log(process.env.PASSCODE);

function sendEmail(receiverMail,token) {
    return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "gupsahil2005@gmail.com", 
                    pass: "panc ckqx wixp nlaa"
                },
            });
            const verificationUrl = `http://localhost:3000/api/verify?token=${token}`;
        const mailConfigs = {
            from: process.env.Email,
            to: receiverMail,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        };

        transporter.sendMail(mailConfigs, function (error, info) {
            if (error) {
                console.error("Error sending email:", error);
                return reject({ message: "An error has occurred" });
            }
            return resolve({ message: "Email sent successfully", info });
        });
    });
}

export default sendEmail;