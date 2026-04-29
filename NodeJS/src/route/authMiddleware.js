/**
 * Middleware kiểm tra quyền hạn (Authorization)
 * @param {Array} requiredRoles - Danh sách các roleId được phép truy cập (vd: ['R1', 'R2'])
 */
let checkUserRole = (requiredRoles) => {
    return (req, res, next) => {
        // Sau này, Authentication Middleware (JWT) sẽ giải mã token 
        // và gán thông tin người dùng vào req.user.
        let user = req.user;

        if (user && requiredRoles.includes(user.roleId)) {
            next(); // Quyền hợp lệ, cho phép đi tiếp vào Controller
        } else {
            return res.status(403).json({
                errCode: -1,
                message: "Bạn không có quyền thực hiện hành động này!"
            });
        }
    };
};

export default {
    checkUserRole: checkUserRole
};
