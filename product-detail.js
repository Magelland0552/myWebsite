document.addEventListener('DOMContentLoaded', async function () {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    // Fetch product details
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const product = await response.json();

        // Display product details
        document.getElementById('product-detail').innerHTML = `
            <div class="col-md-6">
                <img src="${product.image_url || 'https://via.placeholder.com/500'}" 
                     alt="${product.name}" 
                     class="img-fluid product-detail-img rounded">
            </div>
            <div class="col-md-6">
                <h2>${product.name}</h2>
                <p class="text-muted">${product.category === 'shoe' ? 'Shoes' : 'Phones'}</p>
                <h3 class="my-4">$${product.price.toFixed(2)}</h3>
                
                <div class="mb-4">
                    <h5>Description</h5>
                    <p>${product.description || 'No description available.'}</p>
                </div>
                
                <div class="d-flex align-items-center mb-4">
                    <div class="me-3">
                        <label for="quantity" class="form-label">Quantity:</label>
                        <input type="number" id="quantity" class="form-control" value="1" min="1" style="width: 80px;">
                    </div>
                    <button class="btn btn-primary btn-lg add-to-cart-btn"
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image_url || 'https://via.placeholder.com/300'}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Add event listener to Add to Cart button
        document.querySelector('.add-to-cart-btn').addEventListener('click', function () {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(
                this.dataset.id,
                this.dataset.name,
                parseFloat(this.dataset.price),
                this.dataset.image,
                quantity
            );
        });

    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('product-detail').innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-circle fa-3x mb-3 text-danger"></i>
                <h4>Product Not Found</h4>
                <p>We couldn't find the product you're looking for.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
    }
});