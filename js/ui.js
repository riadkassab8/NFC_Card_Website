// UI Helper Functions

// Show toast notification
export function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
}

// Show modal
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth scroll to section
export function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 72; // navbar height
        const top = section.offsetTop - offset;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    }
}

// Create product visual SVG/HTML
export function createProductVisual(product) {
    return `
        <div class="product-image-container">
            <img src="${product.defaultImage}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-image-overlay"></div>
        </div>
    `;
}

// Format price
export function formatPrice(price) {
    return price;
}

// Create feature list HTML
export function createFeatureList(features) {
    return features.map(feature => `
        <li>${feature}</li>
    `).join('');
}

// Animate element on scroll
export function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.step-item, .why-item, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Toggle FAQ item
export function toggleFaqItem(item) {
    const isActive = item.classList.contains('active');
    
    // Close all items
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// Create order summary HTML
export function createOrderSummary(items, customer) {
    const itemsHtml = items.map(item => {
        const unitPrice = item.price || 0;
        const totalPrice = unitPrice * item.quantity;
        
        return `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
            <div style="flex: 1;">
                <div style="font-weight: 600;">${item.productName}</div>
                <div style="color: var(--text-muted); font-size: 0.875rem;">الكمية: ${item.quantity}</div>
                ${Object.keys(item.options).length > 0 ? `
                    <div style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">
                        ${Object.entries(item.options).map(([key, value]) => {
                            // Find the option label
                            return `<div>${key}: ${value}</div>`;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
            <div style="text-align: left;">
                <div style="font-weight: 600;">${totalPrice} جنيه</div>
                <div style="color: var(--text-muted); font-size: 0.875rem;">${unitPrice} × ${item.quantity}</div>
            </div>
        </div>
    `}).join('');
    
    // Calculate total
    const grandTotal = items.reduce((sum, item) => {
        return sum + ((item.price || 0) * item.quantity);
    }, 0);
    
    return `
        <div style="background: var(--accent-soft); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
            <h3 style="font-weight: 700; margin-bottom: 1rem; font-size: 1.25rem;">ملخص الطلب</h3>
            ${itemsHtml}
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid var(--border);">
                <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; color: var(--accent);">
                    <span>الإجمالي:</span>
                    <span>${grandTotal} جنيه</span>
                </div>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">معلومات التواصل:</div>
                <div style="color: var(--text-muted); font-size: 0.9375rem;">
                    <div>الاسم: ${customer.name}</div>
                    <div>الهاتف: ${customer.phone}</div>
                    <div>المدينة: ${customer.city}</div>
                </div>
            </div>
        </div>
    `;
}

// Loading state
export function setLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'جاري الإرسال...';
        button.disabled = true;
        button.style.opacity = '0.6';
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
        button.style.opacity = '1';
    }
}

// Create success message
export function createSuccessMessage(orderId) {
    return `
        <div style="text-align: center; padding: 2rem;">
            <div style="width: 80px; height: 80px; background: #10B981; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">✓</div>
            <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem;">تم استلام طلبك بنجاح</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 1.125rem;">رقم الطلب: <span style="font-weight: 600; color: var(--text);">${orderId}</span></p>
            <p style="color: var(--text-muted); line-height: 1.7;">هنتواصل معاك على WhatsApp في أقرب وقت للتأكيد وإتمام الطلب.</p>
            <button class="btn-primary btn-lg" onclick="window.location.reload()" style="margin-top: 2rem;">تمام</button>
        </div>
    `;
}
