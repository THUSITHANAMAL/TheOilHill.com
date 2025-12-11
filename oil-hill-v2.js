// ============================================================
// THE OIL HILL V2 - JAVASCRIPT
// Shopping cart, animations, form handling
// ============================================================

let cart = [];

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initNavigation();
    initAnimations();
    initBackToTop();
    initNotifyForms();
    loadCart();
    updateCartUI();
});

// ============ SCROLL PROGRESS ============
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ============ NAVIGATION ============
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// ============ ANIMATIONS ============
function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ============ SHOPPING CART ============
function addToCart(productId, productName, productPrice) {
    const price = parseFloat(productPrice);

    if (isNaN(price) || price === 0) {
        showNotification('Price not set', 'error');
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${productName} added to cart`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Item removed', 'info');
}

function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    if (totalItems > 0) {
        cartBadge.classList.add('active');
    } else {
        cartBadge.classList.remove('active');
    }

    // Update items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛍️</div>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }

    let itemsHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `;
    });

    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');

    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function saveCart() {
    localStorage.setItem('oilHillCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('oilHillCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ============ CHECKOUT ============
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    showNotification('Proceeding to checkout...', 'success');

    // Payment gateway will be integrated here
    console.log('Checkout initiated:', {
        items: cart,
        total: total,
        timestamp: new Date().toISOString()
    });

    setTimeout(() => {
        alert(`Checkout Summary:\n\nItems: ${cart.length} product(s)\nTotal: $${total.toFixed(2)}\n\nPayment integration coming soon!`);
    }, 500);
}

// ============ NOTIFY FORMS ============
function initNotifyForms() {
    const notifyBtns = document.querySelectorAll('.btn-notify');

    notifyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            const email = input.value;

            if (email && validateEmail(email)) {
                // Save to mailing list
                console.log('Email signup:', email);
                showNotification('Thank you! We\'ll notify you when available.', 'success');
                input.value = '';
            } else {
                showNotification('Please enter a valid email', 'error');
            }
        });
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ BACK TO TOP ============
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============ NOTIFICATIONS ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ⓘ'
    };

    const colors = {
        success: '#8B7355',
        error: '#d32f2f',
        info: '#D4AF37'
    };

    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-message">${message}</div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: -400px;
        background: white;
        color: #1a1a1a;
        padding: 20px 25px;
        border-left: 4px solid ${colors[type]};
        box-shadow: 0 8px 32px rgba(139, 115, 85, 0.2);
        border-radius: 8px;
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 350px;
        animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Add notification styles
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { right: -400px; opacity: 0; }
            to { right: 30px; opacity: 1; }
        }

        @keyframes slideOutRight {
            from { right: 30px; opacity: 1; }
            to { right: -400px; opacity: 0; }
        }

        .notification-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #F4EDE4;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
        }

        .notification-message {
            font-size: 0.95rem;
            line-height: 1.5;
            font-weight: 500;
        }

        .cart-item {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 15px;
            padding: 20px;
            border-bottom: 2px solid #D4C5B9;
            transition: all 0.3s ease;
        }

        .cart-item:hover {
            background: #F4EDE4;
        }

        .cart-item-name {
            font-size: 1rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .cart-item-price {
            font-family: 'Cinzel', serif;
            color: #D4AF37;
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .cart-qty-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .qty-btn {
            width: 30px;
            height: 30px;
            background: #F4EDE4;
            border: 2px solid #8B7355;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .qty-btn:hover {
            background: #D4AF37;
            border-color: #D4AF37;
            color: #1a1a1a;
        }

        .qty-display {
            font-weight: 600;
            color: #1a1a1a;
            min-width: 30px;
            text-align: center;
        }

        .cart-item-remove {
            background: none;
            border: none;
            font-size: 2rem;
            color: #6B5D4F;
            cursor: pointer;
            line-height: 1;
            transition: all 0.3s ease;
        }

        .cart-item-remove:hover {
            color: #d32f2f;
            transform: rotate(90deg);
        }
    `;
    document.head.appendChild(style);
}

// ============ EXPORT FUNCTIONS ============
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.toggleMobileMenu = toggleMobileMenu;

// ============ CONSOLE MESSAGE ============
console.log(`
%c
╔═══════════════════════════════════════════╗
║                                           ║
║        THE OIL HILL                       ║
║        Heaven's point of contact with you ║
║        In Honor of Myrtle L. Taylor       ║
║                                           ║
╚═══════════════════════════════════════════╝
`, 'color: #D4AF37; font-family: serif; font-size: 12px; font-weight: bold;');
