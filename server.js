const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS chi tiết - GIẢI QUYẾT LỖI CORS
app.use(cors({
    origin: '*',  // Cho phép tất cả domain gọi đến
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// Middleware xử lý preflight request (OPTIONS)
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lưu trữ dữ liệu tạm thời
let rsvpList = [];
let wishList = [];

// API Xác nhận tham dự (RSVP)
app.post('/api/rsvp', (req, res) => {
    const { guest_name, phone_number, is_attending, companion_count } = req.body;
    
    console.log('📝 Received RSVP:', req.body);
    
    // Validation
    if (!guest_name || guest_name.trim() === '') {
        return res.status(400).json({ error: 'Vui lòng nhập họ và tên' });
    }
    
    if (!phone_number || !/^[0-9]{9,11}$/.test(phone_number)) {
        return res.status(400).json({ error: 'Vui lòng nhập số điện thoại hợp lệ (9-11 số)' });
    }
    
    const newRSVP = {
        id: Date.now(),
        guest_name: guest_name.trim(),
        phone_number: phone_number.trim(),
        is_attending: is_attending === true || is_attending === 'true',
        companion_count: parseInt(companion_count) || 0,
        created_at: new Date().toLocaleString('vi-VN')
    };
    
    rsvpList.push(newRSVP);
    console.log(`✅ RSVP saved. Total: ${rsvpList.length}`);
    
    res.json({ 
        success: true, 
        message: 'Cảm ơn bạn! Xác nhận đã được ghi nhận 💕',
        data: newRSVP
    });
});

// API Lời chúc (Wishes)
app.post('/api/wishes', (req, res) => {
    const { guest_name, wishes_message } = req.body;
    
    console.log('💝 Received Wish:', req.body);
    
    if (!guest_name || guest_name.trim() === '') {
        return res.status(400).json({ error: 'Vui lòng nhập họ và tên' });
    }
    
    if (!wishes_message || wishes_message.trim() === '') {
        return res.status(400).json({ error: 'Vui lòng nhập lời chúc' });
    }
    
    const newWish = {
        id: Date.now(),
        guest_name: guest_name.trim(),
        wishes_message: wishes_message.trim(),
        created_at: new Date().toLocaleString('vi-VN')
    };
    
    wishList.push(newWish);
    console.log(`✅ Wish saved. Total: ${wishList.length}`);
    
    res.json({ 
        success: true, 
        message: 'Cảm ơn lời chúc của bạn! 💕',
        data: newWish
    });
});

// API Lấy danh sách RSVP
app.get('/api/rsvp', (req, res) => {
    res.json({ success: true, data: rsvpList });
});

// API Lấy danh sách lời chúc
app.get('/api/wishes', (req, res) => {
    res.json({ success: true, data: wishList });
});

// API Lấy tất cả dữ liệu (kiểm tra)
app.get('/api/all-data', (req, res) => {
    res.json({ 
        success: true, 
        rsvp: rsvpList, 
        wishes: wishList,
        total_rsvp: rsvpList.length,
        total_wishes: wishList.length
    });
});

// Health check cho Render
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Backend đang chạy tại cổng ${PORT}`);
    console.log(`📍 CORS enabled for all origins`);
});