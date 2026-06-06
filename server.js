const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS - đơn giản nhất
app.use(cors());
app.use(express.json());

// Lưu trữ dữ liệu tạm thời
let rsvpList = [];
let wishList = [];

// API Xác nhận tham dự - POST
app.post('/api/rsvp', (req, res) => {
    const { guest_name, phone_number, is_attending, companion_count } = req.body;
    
    console.log('Received RSVP:', req.body);
    
    if (!guest_name || !phone_number) {
        return res.status(400).json({ error: 'Thiếu thông tin' });
    }
    
    const newRSVP = {
        id: Date.now(),
        guest_name,
        phone_number,
        is_attending: is_attending || false,
        companion_count: companion_count || 0,
        created_at: new Date().toLocaleString('vi-VN')
    };
    
    rsvpList.push(newRSVP);
    res.json({ success: true, message: 'Đã ghi nhận xác nhận!' });
});

// API Lời chúc - POST (gửi lời chúc mới)
app.post('/api/wishes', (req, res) => {
    const { guest_name, wishes_message } = req.body;
    
    console.log('Received Wish:', req.body);
    
    if (!guest_name || !wishes_message) {
        return res.status(400).json({ error: 'Thiếu thông tin' });
    }
    
    const newWish = {
        id: Date.now(),
        guest_name,
        wishes_message,
        created_at: new Date().toLocaleString('vi-VN')
    };
    
    wishList.push(newWish);
    res.json({ success: true, message: 'Đã ghi nhận lời chúc!' });
});

// API Lấy danh sách lời chúc - GET
app.get('/api/wishes', (req, res) => {
    const sortedWishes = [...wishList].reverse();
    res.json({ wishes: sortedWishes });
});

// API Xem toàn bộ dữ liệu (RSVP + Wishes) - GET
app.get('/api/data', (req, res) => {
    const sortedWishes = [...wishList].reverse();
    res.json({ rsvp: rsvpList, wishes: sortedWishes });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Backend dang chay tai cong ${PORT}`);
});