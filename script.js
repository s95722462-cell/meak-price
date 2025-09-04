document.addEventListener('DOMContentLoaded', () => {
    const modelNameInput = document.getElementById('model-name');
    const priceAfterChangeSpan = document.getElementById('price-after-change');
    const discountRateInput = document.getElementById('discount-rate');
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

    discountRateInput.addEventListener('input', calculate);

    function calculate() {
        if (!currentProduct) return;

        const price = parseInt(currentProduct['변경후 가격'].replace(/,/g, ''));
        const discountRate = parseFloat(discountRateInput.value);
        console.log('Calculating with:', { price, discountRate });

        if (!isNaN(discountRate) && discountRate > 0) {
            const supplyPrice = Math.round((price * discountRate) / 1000) * 1000;
            supplyPriceSpan.textContent = supplyPrice.toLocaleString();

            const discountAmount = price - supplyPrice;
            discountAmountSpan.textContent = discountAmount.toLocaleString();

            const margin = ((price - supplyPrice) / price) * 100;
            marginSpan.textContent = margin.toFixed(2) + ' %';
        } else {
            supplyPriceSpan.textContent = '';
            marginSpan.textContent = '';
        }
    }
});
