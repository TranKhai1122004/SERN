require('dotenv').config();
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Hàm gửi email đơn giản (không file đính kèm)
let sendSimpleEmail = async (dataSend) => {
    const msg = {
        to: dataSend.reciverEmail,
        from: {
            email: "trankhai112204@gmail.com", 
            name: "BookingCare"
        },
        subject: dataSend.language === 'vi'
            ? "Thông tin đặt lịch khám bệnh"
            : "Appointment Booking Information",
        html: getBodyHtmlEmail(dataSend),
    };

    await sgMail.send(msg);
};

// Hàm build HTML (giữ nguyên code cũ)
let getBodyHtmlEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Xin chào ${dataSend.patientName},</h2>
                <p>Bạn nhận được email này vì đã đăng ký lịch khám bệnh tại BookingCare.</p>
                <p><b>Thời gian:</b> ${dataSend.time}</p>
                <p><b>Bác sĩ:</b> ${dataSend.doctorName}</p>
                <a href="${dataSend.redirectLink}" target="_blank"
                   style="padding: 10px 20px; background: #0066cc; color: white; text-decoration: none;">
                   Xác nhận lịch khám
                </a>
            </div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Dear ${dataSend.patientName},</h2>
                <p>You are receiving this email because you booked an appointment on BookingCare.</p>
                <p><b>Time:</b> ${dataSend.time}</p>
                <p><b>Doctor:</b> ${dataSend.doctorName}</p>
                <a href="${dataSend.redirectLink}" target="_blank"
                   style="padding: 10px 20px; background: #0066cc; color: white; text-decoration: none;">
                   Confirm Appointment
                </a>
            </div>
        `;
    }
    return result;
};

// Hàm gửi email có file đính kèm (ví dụ đơn thuốc)
let sendAttachment = async (dataSend) => {
    let matches = dataSend.imgBase64.match(/^data:(.+);base64,/);
    let mimeType = matches ? matches[1] : "application/octet-stream";
    let ext = mimeType.split("/")[1];

    const msg = {
        to: dataSend.email,
        from: {
            email: "trankhai112204@gmail.com",
            name: "BookingCare"
        },
        subject: dataSend.language === 'vi'
            ? "Kết quả khám bệnh"
            : "Medical examination report",
        html: getBodyHtmlEmailRemedy(dataSend),
        attachments: [
            {
                content: dataSend.imgBase64.split("base64,")[1],
                filename: `remedy-${dataSend.patientName}.${ext}`,
                type: mimeType,
                disposition: "attachment"
            }
        ]
    };

    await sgMail.send(msg);
};

// Hàm build HTML cho email Remedy
let getBodyHtmlEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Xin chào ${dataSend.patientName}!</h2>
                <p>Bạn đã hoàn tất buổi khám. Kết quả & đơn thuốc được đính kèm.</p>
                <p>Trân trọng,<br/>BookingCare</p>
            </div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
            <div style="font-family: Arial, sans-serif;">
                <h2>Dear ${dataSend.patientName}!</h2>
                <p>Your appointment has been completed. Results & prescription are attached.</p>
                <p>Sincerely,<br/>BookingCare</p>
            </div>
        `;
    }
    return result;
};

module.exports = {
    sendSimpleEmail,
    sendAttachment
};
