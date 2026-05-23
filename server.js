const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Lưu trữ dữ liệu tạm thời
let rsvpList = [];
let wishList = [];

// API Xác nhận tham dự
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
        is_attending,
        companion_count,
        created_at: new Date()
    };
    
    rsvpList.push(newRSVP);
    res.json({ success: true, message: 'Đã ghi nhận xác nhận!' });
});

// API Lời chúc
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
        created_at: new Date()
    };
    
    wishList.push(newWish);
    res.json({ success: true, message: 'Đã ghi nhận lời chúc!' });
});

// API Xem dữ liệu (để kiểm tra)
app.get('/api/data', (req, res) => {
    res.json({ rsvp: rsvpList, wishes: wishList });
});

app.listen(PORT, () => {
    console.log(`Backend đang chạy tại cổng ${PORT}`);
});