import jwt from 'jsonwebtoken';
require('dotenv').config();

let verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization (Bearer <token>)
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            errCode: -1,
            message: "Bạn cần đăng nhập để thực hiện hành động này!"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
        req.user = decoded; // Gán thông tin đã giải mã vào request
        next();
    });
};

export default verifyToken;
