function formatCurrency(num) {
    return num.toLocaleString('vi-VN') + '¥';
}

function saveCart(cart) {
    localStorage.setItem('globalCart', JSON.stringify(cart));
}

function deleteItem(index) {
    let cart = JSON.parse(localStorage.getItem('globalCart')) || [];
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
}

function loadCart() {
    const cartBody = document.getElementById('cart-body');
    const totalItems = document.getElementById('total-items');
    const totalPrice = document.getElementById('total-price');
    const monthlyPrice = document.getElementById('monthly-price');

    const cart = JSON.parse(localStorage.getItem('globalCart')) || [];

    if (cart.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Giỏ hàng trống.</td></tr>';
        totalItems.textContent = 'Tổng số lượng: 0';
        totalPrice.textContent = 'Tổng cộng: 0¥';
        monthlyPrice.textContent = 'Trả góp mỗi tháng (12 tháng): 0¥/tháng';
        return;
    }

    let totalQty = 0;
    let total = 0;
    let monthlyTotal = 0;
    cartBody.innerHTML = '';

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        const monthly = item.monthly * item.quantity;
        totalQty += item.quantity;
        total += subtotal;
        monthlyTotal += monthly;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(subtotal)}</td>
          <td>${formatCurrency(monthly)}</td>
          <td><button class="delete-btn" data-index="${index}">Xóa</button></td>
        `;
        cartBody.appendChild(row);
    });

    totalItems.textContent = 'Tổng số lượng: ' + totalQty;
    totalPrice.textContent = 'Tổng cộng: ' + formatCurrency(total);
    monthlyPrice.textContent = 'Trả góp mỗi tháng (1 tháng): ' + formatCurrency(monthlyTotal) + '/tháng';

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteItem(btn.getAttribute('data-index')));
    });
}

document.getElementById('clear-cart').addEventListener('click', () => {
    localStorage.removeItem('globalCart');
    loadCart();
    alert('Giỏ hàng đã được xóa');
});
// document.getElementById('purcharse').addEventListener('click', () => {
//   localStorage.removeItem('globalCart');
//   loadCart();
//   alert('Đã thanh toán giỏ hàng!');
// });



document.getElementById('purcharse').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('globalCart')) || [];
    const popup = document.getElementById('bill-popup');
    const billContent = document.getElementById('bill-content');

    if (cart.length === 0) {
        alert('Giỏ hàng trống...');
        return;
    }

    let total = 0;
    let monthly = 0;
    let html = `
        <table class="bill-table" >
          <tr class="bill-table-row">
            <th style="text-align:left;">Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
          </tr>
      `;

    cart.forEach(item => {
        const sub = item.price * item.quantity;
        const month = item.monthly * item.quantity;
        total += sub;
        monthly += month;
        html += `
          <tr>
            <td>${item.name}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${formatCurrency(item.price)}</td>
            <td style="text-align:right;">${formatCurrency(sub)}</td>
          </tr>`;
    });

    html += `
        </table>
        <hr class="line">
        <p><strong>Tổng cộng:</strong> ${formatCurrency(total)}</p>
        <p><strong>Trả góp mỗi tháng (12 tháng):</strong> ${formatCurrency(monthly)}/tháng</p>
        <p style="text-align:center;margin-top:20px;">Cảm ơn bạn đã mua hàng tại <b>Tsukuyomi</b>!</p>
      `;

    billContent.innerHTML = html;
    popup.style.display = 'flex';
    localStorage.removeItem('globalCart');
    loadCart();
});

document.getElementById('close-bill').addEventListener('click', () => {
    document.getElementById('bill-popup').style.display = 'none';
});


window.addEventListener('DOMContentLoaded', loadCart);
