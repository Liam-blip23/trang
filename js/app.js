// admin.js
// ------------------------------
// CẤU HÌNH FIREBASE
// ------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCp6TNKfveeufiXmIdA77NRJE1XX8mML3c",
    authDomain: "order-system-6c566.firebaseapp.com",
    projectId: "order-system-6c566",
    storageBucket: "order-system-6c566.firebasestorage.app",
    messagingSenderId: "894961018592",
    appId: "1:894961018592:web:801304cc03327e33415285",
    measurementId: "G-114M4WWBE7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM
const ordersBody = document.getElementById('ordersTable') || document.getElementById('ordersBody');

// Render 1 đơn hàng
function renderOrder(doc) {
    const data = doc.data();
    const row = document.createElement('tr');

    const timestamp = data.timestamp || data.time;
    const date = timestamp ? (timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)).toLocaleString('vi-VN') : '---';

    // Chuẩn bị danh sách món
    let itemsHtml = '';
    if (data.items && data.items.length) {
        itemsHtml = data.items.map(i => `${i.name} (${i.size}) - ${i.price}k`).join('<br>');
    } else if (data.drink) {
        itemsHtml = data.drink;
    }

    row.innerHTML = `
        <td data-label="Thời gian">${date}</td>
        <td data-label="Họ và tên">${data.name}</td>
        <td data-label="SĐT">${data.phone}</td>
        <td data-label="Địa chỉ">${data.address}</td>
        <td data-label="Món đã chọn">${itemsHtml}</td>
        <td data-label="Tổng tiền">${data.total ? data.total+'k' : '---'}</td>
        <td data-label="Hành động">
            <button class="delete" onclick="deleteOrder('${doc.id}')">Xóa</button>
        </td>
    `;

    ordersBody.appendChild(row);
}

// Xóa đơn hàng
function deleteOrder(id) {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
        db.collection('orders').doc(id).delete()
          .then(() => alert("Đã xóa đơn hàng"))
          .catch(err => alert("Lỗi: " + err));
    }
}

// Load realtime
function loadOrders() {
    if (!ordersBody) return; // Không phải admin

    db.collection('orders').orderBy('timestamp','desc')
      .onSnapshot(snapshot => {
        ordersBody.innerHTML = '';
        snapshot.forEach(doc => renderOrder(doc));
    }, err => console.error("Lỗi load orders:", err));
}

// Chạy load orders tự động
loadOrders();
