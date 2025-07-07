document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMessage.style.display = 'block';
            subtotalElement.textContent = '$0.00';
            totalElement.textContent = '$0.00';
            checkoutBtn.classList.add('disabled');
            return;
        }

        emptyCartMessage.style.display = 'none';
        checkoutBtn.classList.remove('disabled');

        let subtotal = 0;

        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            return `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.image || 'https://via.placeholder.com/80'}" 
                             alt="${item.name}" 
                             class="cart-item-img me-3">
                        <div>
                            <h6 class="mb-1">${item.name}</h6>
                            <p class="mb-1">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <div class="input-group me-3" style="width: 120px;">
                            <button class="btn btn-outline-secondary update-quantity" 
                                    type="button" 
                                    data-id="${item.id}"
                                    data-action="decrease">−</button>
                            <input type="text" class="form-control text-center quantity-input" 
                                   value="${item.quantity}" 
                                   data-id="${item.id}">
                            <button class="btn btn-outline-secondary update-quantity" 
                                    type="button" 
                                    data-id="${item.id}"
                                    data-action="increase">+</button>
                        </div>
                        <h6 class="mb-0">$${itemTotal.toFixed(2)}</h6>
                        <button class="btn btn-link text-danger remove-item ms-3" 
                                data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${subtotal.toFixed(2)}`;

        // Add event listeners
        document.querySelectorAll('.update-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.dataset.id;
                const action = this.dataset.action;
                const item = cart.find(i => i.id === productId);

                if (action === 'increase') {
                    item.quantity++;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity--;
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                cart = cart.filter(item => item.id !== this.dataset.id);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            });
        });
    }

    renderCart();
});