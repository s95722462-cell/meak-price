document.addEventListener('DOMContentLoaded', () => {
    const modelNameInput = document.getElementById('model-name');
    const priceAfterChangeSpan = document.getElementById('price-after-change');
    const specialDealerDiscountRateInput = document.getElementById('special-dealer-discount-rate');
    const userDiscountRateInput = document.getElementById('user-discount-rate');
    const supplyPriceSpan = document.getElementById('supply-price');
    const marginSpan = document.getElementById('margin');
    const discountAmountSpan = document.getElementById('discount-amount');

    let products = [];
    let currentProduct = null;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded:', data);
            products = data;
        });

    modelNameInput.addEventListener('input', () => {
        const modelName = modelNameInput.value;
        console.log('Searching for:', modelName);
        currentProduct = products.find(p => p['형명'].toLowerCase() === modelName.toLowerCase());
        console.log('Found product:', currentProduct);

        if (currentProduct) {
            const price = parseInt(currentProduct['변경후 가격'].replace(/,/g, ''));
            priceAfterChangeSpan.textContent = price.toLocaleString();
            calculate();
        } else {
            priceAfterChangeSpan.textContent = '';
            supplyPriceSpan.textContent = '';
            marginSpan.textContent = '';
        }
    });

    specialDealerDiscountRateInput.addEventListener('input', calculate);
    userDiscountRateInput.addEventListener('input', calculate);

    function calculate() {
        if (!currentProduct) return;

        const price = parseInt(currentProduct['변경후 가격'].replace(/,/g, ''));
        const specialDealerDiscountRate = parseFloat(specialDealerDiscountRateInput.value);
        const userDiscountRate = parseFloat(userDiscountRateInput.value);
        console.log('Calculating with:', { price, specialDealerDiscountRate, userDiscountRate });

        if (!isNaN(specialDealerDiscountRate) && specialDealerDiscountRate > 0 && !isNaN(userDiscountRate) && userDiscountRate > 0) {
            const supplyPrice = Math.round((price * userDiscountRate) / 1000) * 1000;
            supplyPriceSpan.textContent = supplyPrice.toLocaleString();

            const specialDealerPrice = Math.round((price * specialDealerDiscountRate) / 1000) * 1000;

            const discountAmount = price - supplyPrice;
            discountAmountSpan.textContent = discountAmount.toLocaleString();

            const margin = ((supplyPrice - specialDealerPrice) / supplyPrice) * 100;
            marginSpan.textContent = margin.toFixed(2) + ' %';
        } else {
            supplyPriceSpan.textContent = '';
            marginSpan.textContent = '';
        }
    }
});
