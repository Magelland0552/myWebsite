document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
        document.getElementById('order-id').textContent = `#${orderId}`;

        // Set delivery date (3-5 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 3));
        document.getElementById('delivery-date').textContent =
            deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } else {
        // No order ID - redirect to home
        window.location.href = 'index.html';
    }
});