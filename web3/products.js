document.addEventListener('DOMContentLoaded', async function () {
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const sort = urlParams.get('sort');

    // Set category title
    if (category) {
        document.getElementById('category-title').textContent =
            category === 'shoe' ? 'Shoes' : 'Phones';
    }

    // Fetch products
    const products = await fetchProducts();
    let filteredProducts = [...products];

    // Filter by category if specified
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Sort products
    if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Display products
    const productsGrid = document.getElementById('products-grid');

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-3x mb-3 text-muted"></i>
                <h4>No products found</h4>
                <p>We couldn't find any products matching your criteria</p>
                <a href="products.html" class="btn btn-primary">View All Products</a>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image_url || 'https://via.placeholder.com/300'}" 
                     class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <div class="mt-auto">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary me-2">
                            View Details
                        </a>
                        <button class="btn btn-primary add-to-cart-btn" 
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image_url || 'https://via.placeholder.com/300'}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            addToCart(
                this.dataset.id,
                this.dataset.name,
                parseFloat(this.dataset.price),
                this.dataset.image
            );
        });
    });

    // Filter dropdown functionality
    document.querySelectorAll('[data-sort]').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sort = this.dataset.sort;
            window.location.href = `products.html?category=${category || ''}&sort=${sort}`;
        });
    });
});