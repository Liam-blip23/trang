// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyCp6TNKfveeufiXmIdA77NRJE1XX8mML3c",
  authDomain: "order-system-6c566.firebaseapp.com",
  projectId: "order-system-6c566",
  storageBucket: "order-system-6c566.firebasestorage.app",
  messagingSenderId: "894961018592",
  appId: "1:894961018592:web:801304cc03327e33415285",
  measurementId: "G-114M4WWBE7"
};

// === INIT FIREBASE V8 ===
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// === SUBMIT ORDER ===
async function submitOrder() {
    let drink = document.getElementById("drink").value;
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let msg = document.getElementById("msg");

    if (!name || !phone || !address) {
        msg.innerHTML = "⚠️ Vui lòng nhập đầy đủ thông tin!";
        msg.style.color = "red";
        return;
    }

    await db.collection("orders").add({
        drink,
        name,
        phone,
        address,
        time: new Date().toLocaleString("vi-VN")
    });

    msg.innerHTML = "✅ Đã gửi đơn hàng!";
    msg.style.color = "green";

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
}


// === ADMIN PAGE ===
if (document.getElementById("orders")) {
    db.collection("orders")
      .orderBy("time", "desc")
      .onSnapshot(snapshot => {

        let html = "";
        snapshot.forEach(doc => {
            let d = doc.data();
            html += `
                <div class="order-item">
                    <b>Đồ uống:</b> ${d.drink}<br>
                    <b>Tên:</b> ${d.name}<br>
                    <b>SĐT:</b> ${d.phone}<br>
                    <b>Địa chỉ:</b> ${d.address}<br>
                    <b>Thời gian:</b> ${d.time}
                </div>
            `;
        });

        document.getElementById("orders").innerHTML = html;
      });
}
