document.addEventListener('DOMContentLoaded', function () {
    const loginSection = document.getElementById('login-section');
    const dashboardContent = document.getElementById('dashboard-content');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if admin is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        loginSection.style.display = 'none';
        dashboardContent.style.display = 'block';
        loadAdminData();
    }

    // Login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple hardcoded credentials for MVP
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            loginSection.style.display = 'none';
            dashboardContent.style.display = 'block';
            loadAdminData();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('adminLoggedIn');
        window.location.reload();
    });

    // Load admin data (products and orders)
    async function loadAdminData() {
        try {
            // Load products
            const productsResponse = await fetch('http://localhost:3000/api/products');
            const products = await productsResponse.json();

            const productsTable = document.getElementById('products-table');
            productsTable.innerHTML = products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td><img src="${product.image_url || 'https://via.placeholder.com/50'}" 
                              alt="${product.name}" 
                              style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.featured ? '<i class="fas fa-check text-success"></i>' : ''}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-product" 
                                data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-product" 
                                data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            // Add event listeners to product actions
            document.querySelectorAll('.edit-product').forEach(btn => {
                btn.addEventListener('click', function () {
                    const productId = this.dataset.id;
                    editProduct(productId);
                });
            });

            document.querySelectorAll('.delete-product').forEach(btn => {
                btn.addEventListener('click', function () {
                    const productId = this.dataset.id;
                    if (confirm('Are you sure you want to delete this product?')) {
                        deleteProduct(productId);
                    }
                });
            });

            // Load orders
            const ordersResponse = await fetch('http://localhost:3000/api/orders');
            const orders = await ordersResponse.json();

            const ordersTable = document.getElementById('orders-table');
            ordersTable.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer.firstName} ${order.customer.lastName}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td>
                        <span class="badge ${getStatusBadgeClass(order.status)}">
                            ${order.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-order" 
                                data-id="${order.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    function getStatusBadgeClass(status) {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-success';
            case 'pending': return 'bg-warning text-dark';
            case 'cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Add product form
    document.getElementById('add-product-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const newProduct = {
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            image_url: document.getElementById('product-image').value || null,
            featured: document.getElementById('product-featured').checked
        };

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) throw new Error('Failed to add product');

            // Close modal and refresh data
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            loadAdminData();

            // Reset form
            this.reset();

        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    });

    // Edit product
    async function editProduct(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`);
            const product = await response.json();

            // Fill edit form
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('edit-product-name').value = product.name;
            document.getElementById('edit-product-category').value = product.category;
            document.getElementById('edit-product-price').value = product.price;
            document.getElementById('edit-product-description').value = product.description || '';
            document.getElementById('edit-product-image').value = product.image_url || '';
            document.getElementById('edit-product-featured').checked = product.featured || false;

            // Show modal
            const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editModal.show();

        } catch (error) {
            console.error('Error loading product for edit:', error);
            alert('Failed to load product details. Please try again.');
        }
    }

    // Save edited product
    document.getElementById('edit-product-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const productId = document.getElementById('edit-product-id').value;
        const updatedProduct = {
            name: document.getElementById('edit-product-name').value,
            category: document.getElementById('edit-product-category').value,
            price: parseFloat(document.getElementById('edit-product-price').value),
            description: document.getElementById('edit-product-description').value,
            image_url: document.getElementById('edit-product-image').value || null,
            featured: document.getElementById('edit-product-featured').checked
        };

        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) throw new Error('Failed to update product');

            // Close modal and refresh data
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            loadAdminData();

        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    });

    // Delete product
    async function deleteProduct(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            loadAdminData();

        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        }
    }
});