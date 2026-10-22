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
    const whatsappNumber = '201098277229';
    const message = encodeURIComponent(`مرحباً، تم تقديم طلب جديد برقم: ${orderId}`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    return `
        <div style="text-align: center; padding: 2rem;">
            <div style="width: 80px; height: 80px; background: #10B981; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">✓</div>
            <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem;">تم استلام طلبك بنجاح</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 1.125rem;">رقم الطلب: <span style="font-weight: 600; color: var(--text);">${orderId}</span></p>
            <p style="color: var(--text-muted); line-height: 1.7;">هنتواصل معاك على WhatsApp في أقرب وقت للتأكيد وإتمام الطلب.</p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem;">
                <button onclick="window.open('${whatsappUrl}', '_blank')" class="btn-primary btn-lg" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    المتابعة عبر واتساب
                </button>
                <button class="btn-secondary btn-lg" onclick="window.location.reload()" style="background: var(--line); color: var(--text);">تمام</button>
            </div>
        </div>
    `;
}
