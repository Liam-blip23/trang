// ------------------------------
// CẤU HÌNH FIREBASE (CỦA BẠN)
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
// js/admin.js

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

// Các phần tử DOM
const ordersBody = document.getElementById('ordersBody');
const ordersTable = document.getElementById('ordersTable');
const loading = document.getElementById('loading');

// Hàm render đơn hàng
function renderOrder(doc) {
  const data = doc.data();
  const row = document.createElement('tr');

  const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : '---';
  row.innerHTML = `
    <td data-label="Thời gian">${date}</td>
    <td data-label="Họ và tên">${data.name}</td>
    <td data-label="SĐT">${data.phone}</td>
    <td data-label="Địa chỉ">${data.address}</td>
    <td data-label="Món đã chọn">${data.items.join(', ')}</td>
  `;
  ordersBody.appendChild(row);
}

// Lấy đơn hàng theo thời gian, real-time
db.collection('orders').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
  ordersBody.innerHTML = ''; // xóa bảng cũ
  snapshot.forEach(doc => renderOrder(doc));

  loading.style.display = 'none';
  ordersTable.style.display = 'table';
}, err => {
  loading.innerText = "Lỗi tải đơn hàng: " + err;
});

// Khởi tạo Firebase (bắt buộc dùng compat)
firebase.initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = firebase.firestore();


// =======================================
//    GỬI ĐƠN HÀNG (index.html)
// =======================================
function submitOrder() {
    const drink = document.getElementById("drink")?.value || "";
    const name = document.getElementById("name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const address = document.getElementById("address")?.value.trim() || "";
    const msgBox = document.getElementById("msg");

    // Kiểm tra thiếu dữ liệu
    if (!drink || !name || !phone || !address) {
        msgBox.innerText = "⚠️ Vui lòng điền đầy đủ thông tin!";
        msgBox.style.color = "red";
        return;
    }

    db.collection("orders").add({
        drink: drink,
        name: name,
        phone: phone,
        address: address,
        time: firebase.firestore.Timestamp.now()
    })
    .then(() => {
        msgBox.innerText = "✅ Gửi đơn hàng thành công!";
        msgBox.style.color = "green";

        // Xoá nội dung sau khi gửi
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("address").value = "";
    })
    .catch(error => {
        msgBox.innerText = "❌ Lỗi: " + error.message;
        msgBox.style.color = "red";
    });
}


// =======================================
//    HIỂN THỊ ĐƠN HÀNG (admin.html)
// =======================================
function loadOrders() {
    const ordersDiv = document.getElementById("orders");
    if (!ordersDiv) return; // Nếu không phải admin.html → thoát

    db.collection("orders")
        .orderBy("time", "desc")
        .onSnapshot(snapshot => {
            ordersDiv.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();
                const item = document.createElement("div");
                item.className = "order-item";

                const time = data.time?.toDate
                    ? data.time.toDate().toLocaleString("vi-VN")
                    : "Không có thời gian";

                item.innerHTML = `
                    <p><strong>🍹 Đồ uống:</strong> ${data.drink}</p>
                    <p><strong>👤 Họ tên:</strong> ${data.name}</p>
                    <p><strong>📞 SĐT:</strong> ${data.phone}</p>
                    <p><strong>🏠 Địa chỉ:</strong> ${data.address}</p>
                    <p><strong>⏱ Thời gian:</strong> ${time}</p>
                    <hr>
                `;
                ordersDiv.appendChild(item);
            });
        });
}

// Tự chạy nếu là admin.html
loadOrders();
