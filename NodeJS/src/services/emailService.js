require('dotenv').config();
import { reject } from 'lodash';
import nodemailer from 'nodemailer';



let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    })

    let info = await transporter.sendMail({
        from: '"BookingCare" <trankhai112204@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'vi' ? "Thông tin đặt lịch khám bệnh" : "Appointment Booking Information",
        html: getBodyHtmlEmail(dataSend)

    });
}

let getBodyHtmlEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0066cc;">Xin chào ${dataSend.patientName},</h2>
                <p>
                    Bạn nhận được email này vì đã đăng ký lịch khám bệnh trực tuyến tại 
                    <strong>BookingCare</strong>.
                </p>
        
                <h3 style="margin-top: 20px; color: #444;">Thông tin lịch khám của bạn:</h3>
                <ul style="list-style: none; padding: 0;">
                <li><b>Thời gian:</b> ${dataSend.time}</li>
                <li><b>Bác sĩ phụ trách:</b> ${dataSend.doctorName}</li>
                </ul>

                <p style="margin-top: 20px;">
                    Vui lòng xác nhận thông tin trên bằng cách nhấn vào đường dẫn bên dưới 
                    để hoàn tất thủ tục đặt lịch khám:
                </p>
        
                <p style="margin: 20px 0;">
                <a href="${dataSend.redirectLink}" target="_blank" 
                    style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: #fff; text-decoration: none; border-radius: 5px;">
                    Xác nhận lịch khám
                </a>
                </p>

                <p>Nếu bạn không thực hiện việc đặt lịch này, vui lòng bỏ qua email.</p>

                <p style="margin-top: 30px;">Trân trọng,</p>
                <p><b>BookingCare</b></p>

                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    Cảm ơn bạn đã lựa chọn BookingCare. Chúng tôi hân hạnh được phục vụ bạn.
                </p>
            </div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
           <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0066cc;">Dear ${dataSend.patientName},</h2>
                <p>
                You are receiving this email because you have registered for an online medical appointment at 
                <strong>BookingCare</strong>.
                </p>

            <h3 style="margin-top: 20px; color: #444;">Your appointment details:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><b>Time:</b> ${dataSend.time}</li>
                    <li><b>Doctor in charge:</b> ${dataSend.doctorName}</li>
                </ul>

                <p style="margin-top: 20px;">
                    Please confirm the above information by clicking the link below 
                    to complete your appointment booking:
                </p>

                <p style="margin: 20px 0;">
                    <a href="${dataSend.redirectLink}" target="_blank" 
                    style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: #fff; text-decoration: none; border-radius: 5px;">
                    Confirm Appointment
                </a>
                </p>

                <p>If you did not make this booking, please disregard this email.</p>

                <p style="margin-top: 30px;">Sincerely,</p>
                <p><b>BookingCare</b></p>

                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    Thank you for choosing BookingCare . We look forward to serving you.
                </p>
            </div>
        `
    }
    return result
}

let getBodyHtmlEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0066cc;">Xin chào ${dataSend.patientName}!</h2>
                <p>
                    Bạn nhận được email này từ <strong>BookingCare</strong> vì đã hoàn tất buổi khám bệnh.
                </p>

               

                <p style="margin-top: 20px;">
                    Kết quả và đơn thuốc của bạn được đính kèm trong email này. 
                </p>

                <p style="margin-top: 30px;">Trân trọng,</p>
                <p><b>BookingCare</b></p>

                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    Cảm ơn bạn đã tin tưởng và lựa chọn BookingCare. 
                </p>
            </div>
        `
    }

    if (dataSend.language === 'en') {
        result = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0066cc;">Dear ${dataSend.patientName}!</h2>
                <p>
                    You are receiving this email from <strong>BookingCare</strong> because your medical appointment has been completed.
                </p>


                <p style="margin-top: 20px;">
                    Your medical results and prescription are attached to this email. 
                </p>

                <p style="margin-top: 30px;">Sincerely,</p>
                <p><b>BookingCare</b></p>

                <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    Thank you for trusting BookingCare. 
                </p>
            </div>
        `
    }

    return result;
}

let sendAttachment = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            })
            let matches = dataSend.imgBase64.match(/^data:(.+);base64,/);
            let mimeType = matches ? matches[1] : "application/octet-stream";
            let ext = mimeType.split("/")[1];
            let info = await transporter.sendMail({
                from: '"BookingCare" <trankhai112204@gmail.com>',
                to: dataSend.email,
                subject: dataSend.language === 'vi' ? "Kết quả khám bệnh" : "Medical examination report",
                html: getBodyHtmlEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientName}.${ext}`,  // remedy-NguyenVanA.png/jpg/pdf
                        content: dataSend.imgBase64.split("base64,")[1],   
                        encoding: "base64",
                        contentType: mimeType

                    }
                ]

            });
            resolve();
        }
        catch (e) {
            reject(e);
        }

    })

}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}