(function () {
    const script = document.currentScript;
    const queryString = script.src.split('?')[1];
    const urlParams = new URLSearchParams(queryString);

    const basePrice = parseFloat(urlParams.get('basePrice')) || 1249;
    const baseMonthly = Math.round(basePrice / 12);

    function checkElements() {
        const minusBtn = document.getElementById('minus-btn');
        const plusBtn = document.getElementById('plus-btn');
        const quantityInput = document.getElementById('quantity');
        const totalPrice = document.getElementById('total-price');
        const monthlyPrice = document.getElementById('monthly-price');

        if (minusBtn && plusBtn && quantityInput && totalPrice && monthlyPrice) {
            initializeScript(minusBtn, plusBtn, quantityInput, totalPrice, monthlyPrice);
        } else {
            setTimeout(checkElements, 100);
        }
    }

    function initializeScript(minusBtn, plusBtn, quantityInput, totalPrice, monthlyPrice) {
        function updatePrice() {
            const qty = parseInt(quantityInput.value);
            const total = basePrice * qty;
            const monthly = baseMonthly * qty;
            totalPrice.textContent = total.toLocaleString('vi-VN') + ' ¥';
            monthlyPrice.textContent = monthly.toLocaleString('vi-VN') + ' ¥/tháng';
        }


        updatePrice();

        plusBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updatePrice();
        });

        minusBtn.addEventListener('click', () => {
            const newValue = Math.max(1, parseInt(quantityInput.value) - 1);
            quantityInput.value = newValue;
            updatePrice();
        });

        quantityInput.addEventListener('input', updatePrice);

        const buyBtn = document.querySelector('.cta');
        buyBtn.addEventListener('click', () => {
            const qty = parseInt(quantityInput.value);
            const productName = document.querySelector('h1').textContent.replace('Mua ', '');
            const price = basePrice;
            const monthly = baseMonthly;

            let cart = JSON.parse(localStorage.getItem('globalCart')) || [];

            const existing = cart.find(item => item.name === productName);
            if (existing) {
                existing.quantity += qty;
            } else {
                cart.push({ name: productName, price, monthly, quantity: qty });
            }

            localStorage.setItem('globalCart', JSON.stringify(cart));
            alert("Đã thêm " + qty + " sản phẩm vào giỏ hàng!");
        });
    }

    checkElements();
})();
