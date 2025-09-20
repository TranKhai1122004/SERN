// controllers/pingController.js

let handlePing = (req, res) => {
    return res.status(200).json({
        message: "pong",
        time: new Date().toISOString()
    });
};

module.exports = {
    handlePing
};
