// K2rty CMS Client & Dynamic Content Binder
// Fetches live CMS texts, links, & settings from the NestJS Backend API
// Allows full, letter-by-letter dynamic control from the Admin Dashboard

export const DEFAULT_CMS = {
    brandName: "K2rty",
    tagline: "عالمك في لمسة واحدة",
    announcement: {
        enabled: true,
        text: "🚀 عرض خاص: شحن سريع واختيار مجاني لألوان الكوستر!",
        link: "product.html?id=sticker"
    },
    hero: {
        eyebrow: "YOUR WORLD IN ONE TAP",
        title: "عالمك كله\nفي لمسة واحدة.",
        subtitle: "كوستر K2rty الذكي يجمع NFC وQR في تصميم واحد. ثبّته، اربطه بروابطك، وشارك بياناتك أو صفحتك أو تقييم محلك في ثانية — بدون تطبيق.",
        ctaPrimaryText: "اطلب الكوستر",
        ctaPrimaryLink: "product.html?id=sticker",
        ctaSecondaryText: "شاهد كيف يعمل",
        ctaSecondaryLink: "#how",
        badgePrice: "450 جنيه",
        badgePriceSub: "شامل اختيار اللون",
        badgeTech: "Scan · Connect · Support",
        badgeTechSub: "NFC وQR معًا",
        heroImage: "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525351/k2rty/k2rty_sticker_white.png"
    },
    video: {
        enabled: true,
        title: "شاهد كيف يعمل K2rty",
        subtitle: "كوستر ذكي يجمع NFC وQR في تصميم واحد. لمسة واحدة وصلت.",
        videoUrl: "https://res.cloudinary.com/dls8ootj3/video/upload/v1792525404/k2rty/k2rty_demo_video.mp4",
        caption: "قرّب الهاتف — صفحتك تفتح فوراً بدون تطبيق"
    },
    featuresTitle: "لماذا K2rty؟",
    featuresSubtitle: "كوستر واحد يجمع كل ما تحتاجه في تصميم أنيق.",
    features: [
        {
            id: "1",
            icon: "zap",
            title: "NFC فوري",
            description: "قرّب الهاتف وصفحتك تفتح فوراً. بدون تطبيق، بدون تعقيد، تجربة سلسة من أول لمسة."
        },
        {
            id: "2",
            icon: "qr",
            title: "QR احتياطي",
            description: "لو NFC مش متاح، أي كاميرا تقدر تمسح الكود. دائماً عندك خيار ثاني للوصول."
        },
        {
            id: "3",
            icon: "shield",
            title: "بدون تطبيق",
            description: "العميل مش محتاج ينزّل أي حاجة. التجربة تبدأ فوراً من أي هاتف تقريباً."
        },
        {
            id: "4",
            icon: "sparkles",
            title: "تصميم أنيق",
            description: "ثلاث ألوان تناسب أي هوية. أبيض نظيف، أسود فخم، أو زيتي دافئ."
        }
    ],
    useCasesTitle: "لشغلك. لمحلك. لنفسك.",
    useCasesSubtitle: "قطعة واحدة تعمل في أكتر من سياق.",
    useCases: [
        {
            id: "1",
            title: "للمحترفين",
            description: "بديل أنظف من الكارت الورقي. شارك رقمك، لينكدإن، وأعمالك بلمسة."
        },
        {
            id: "2",
            title: "للمحلات",
            description: "خلّي العميل يفتح المنيو، يطلب، أو يسيب تقييم بدون ما يسأل."
        },
        {
            id: "3",
            title: "للدعم السريع",
            description: "وصّل الناس لواتساب أو صفحة المساعدة فورًا. Scan · Connect · Support."
        }
    ],
    ctaBandTitle: "جاهز تخلي أول انطباع أذكى؟",
    ctaBandSubtitle: "كوستر واحد. ثلاث ألوان. وتقنية تشتغل من أول لمسة.",
    ctaBandButtonText: "اطلب K2rty",
    ctaBandButtonLink: "product.html?id=sticker",
    aboutEyebrow: "BETTER TOGETHER",
    aboutTitle: "نحوّل اللمسة إلى علاقة.",
    aboutSubtitle: "K2rty مش مجرد كوستر. هي أبسط طريقة تخلي شغلك أو محلك أو تواصلك أوضح، أسرع، وأذكى.",
    aboutStoryTitle: "تقنية بسيطة. أثر واضح.",
    aboutStoryLead: "بنستخدم NFC وQR معًا عشان التجربة تشتغل مع أي هاتف تقريبًا. من غير تطبيق، ومن غير شرح طويل.",
    aboutStoryBullets: [
        "NFC بيفتح صفحتك من أول تقريب",
        "QR جاهز لو العميل فضّل الكاميرا",
        "تصميم واحد يناسب الهوية الشخصية والتجارية"
    ],
    aboutImage: "https://res.cloudinary.com/dls8ootj3/image/upload/v1792525358/k2rty/k2rty_sticker_sage.jpg",
    howEyebrow: "SCAN · CONNECT · SUPPORT",
    howTitle: "استخدامه أوضح من الشرح.",
    howSubtitle: "NFC لو الهاتف قريب. QR لو الكاميرا أسهل. الاتنين على نفس الكوستر.",
    howNfcTitle: "NFC",
    howNfcSteps: [
        { num: "01", title: "افتح الشاشة", description: "تأكد إن NFC شغال. على آيفون عادةً يكون جاهز." },
        { num: "02", title: "قرّب الهاتف", description: "حط الجزء العلوي من الموبايل على الكوستر." },
        { num: "03", title: "افتح الإشعار", description: "هيفتح الرابط اللي اخترته فورًا." }
    ],
    howQrTitle: "QR",
    howQrSteps: [
        { num: "01", title: "افتح الكاميرا", description: "الكاميرا الأساسية كافية. مفيش تطبيق إضافي." },
        { num: "02", title: "امسح الكود", description: "وجّه الكاميرا لمربع Scan QR على الكوستر." },
        { num: "03", title: "ادخل", description: "اضغط على الرابط اللي هيظهر." }
    ],
    howCtaText: "اطلب الكوستر",
    contact: {
        whatsappNumber: "201098277229",
        phone: "+201098277229",
        email: "contact@k2rty.com",
        address: "القاهرة، مصر"
    },
    checkoutFields: [
        {
            id: "name",
            label: "الاسم الكامل",
            placeholder: "الاسم ثلاثي",
            type: "text",
            required: true,
            minLength: 3,
            pattern: "^[\\u0600-\\u06FFa-zA-Z\\s]{3,50}$",
            errorMessage: "يرجى إدخال اسم ثلاثي صحيح لا يقل عن 3 أحرف وبدون رموز خاصة.",
            order: 1
        },
        {
            id: "phone",
            label: "رقم الهاتف (واتساب)",
            placeholder: "01xxxxxxxxx",
            type: "tel",
            required: true,
            minLength: 11,
            pattern: "^01[0125][0-9]{8}$",
            errorMessage: "يرجى إدخال رقم هاتف واتساب مصري صحيح مكون من 11 رقماً ويبدأ بـ 01.",
            order: 2
        },
        {
            id: "city",
            label: "المدينة / المحافظة",
            placeholder: "مثال: القاهرة، الجيزة، الإسكندرية...",
            type: "text",
            required: true,
            minLength: 2,
            pattern: "^[\\u0600-\\u06FFa-zA-Z\\s]{2,40}$",
            errorMessage: "يرجى تحديد المدينة أو المحافظة التابع لها التوصيل.",
            order: 3
        },
        {
            id: "address",
            label: "العنوان بالتفصيل",
            placeholder: "الشارع، رقم العمارة، رقم الشقة أو علامة مميزة",
            type: "text",
            required: true,
            minLength: 6,
            pattern: "",
            errorMessage: "يرجى كتابة عنوان التوصيل بالتفصيل لتسهيل وصول مندوب الشحن.",
            order: 4
        },
        {
            id: "notes",
            label: "ملاحظات إضافية (اختياري)",
            placeholder: "أي مواعيد مفضلة للتسليم أو تفاصيل خاصة...",
            type: "textarea",
            required: false,
            minLength: 0,
            pattern: "",
            errorMessage: "",
            order: 5
        }
    ],
    paymentMethods: [
        {
            id: "cod",
            label: "الدفع عند الاستلام",
            description: "ادفع نقداً عند استلام طلبك ومراجعته مع مندوب الشحن",
            walletNumber: "",
            requireReceipt: false,
            enabled: true
        },
        {
            id: "instapay",
            label: "إنستا باي (InstaPay)",
            description: "تحويل فوري عبر تطبيق إنستا باي",
            walletNumber: "201098277229",
            requireReceipt: true,
            enabled: true
        },
        {
            id: "vodafone_cash",
            label: "فودافون كاش (Vodafone Cash)",
            description: "تحويل عبر محفظة فودافون كاش",
            walletNumber: "201098277229",
            requireReceipt: true,
            enabled: true
        }
    ],
    footerLogo: "K2rty",
    footerTagline: "Your world in one tap.",
    footerCopyright: "© 2026 K2rty. جميع الحقوق محفوظة."
};

export const DEFAULT_LINKS = [
    {
        title: "الرئيسية",
        url: "index.html",
        location: "both",
        target: "_self",
        isActive: true,
        order: 1
    },
    {
        title: "عن K2rty",
        url: "about.html",
        location: "both",
        target: "_self",
        isActive: true,
        order: 2
    },
    {
        title: "كيف تعمل",
        url: "how-it-works.html",
        location: "both",
        target: "_self",
        isActive: true,
        order: 3
    },
    {
        title: "اطلب الآن",
        url: "product.html?id=sticker",
        location: "footer",
        target: "_self",
        isActive: true,
        order: 4
    }
];

const CACHE_KEY = "k2rty_cms_content_cache";
const LINKS_CACHE_KEY = "k2rty_links_cache";

export function getApiBaseUrl() {
    if (window.K2RTY_API_BASE) {
        return window.K2RTY_API_BASE.replace(/\/$/, "");
    }
    const local = localStorage.getItem("k2rty_api_base");
    if (local) return local.replace(/\/$/, "");

    // If local dev server or host
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:3000/api";
    }

    // Default API host
    return "https://smart-card-qr-api.koyeb.app/api";
}

export function getCachedCms() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {}
    return DEFAULT_CMS;
}

export function getCachedLinks() {
    try {
        const cached = localStorage.getItem(LINKS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {}
    return DEFAULT_LINKS;
}

export async function fetchLiveCms() {
    try {
        const url = `${getApiBaseUrl()}/website/content`;
        const res = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            return data;
        }
    } catch (err) {
        console.warn("Could not fetch CMS from API, using cached/default:", err.message);
    }
    return getCachedCms();
}

export async function fetchLiveLinks() {
    try {
        const url = `${getApiBaseUrl()}/website/links`;
        const res = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                localStorage.setItem(LINKS_CACHE_KEY, JSON.stringify(data));
                return data;
            }
        }
    } catch (err) {
        console.warn("Could not fetch links from API, using cached/default:", err.message);
    }
    return getCachedLinks();
}

const ICONS_SVG = {
    zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
    qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="5" x2="12" y2="5"></line></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`
};

export function applyLinksToDom(links) {
    if (!Array.isArray(links) || links.length === 0) return;

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // 1. Header Navigation links
    const navLinksContainer = document.getElementById("navLinks");
    if (navLinksContainer) {
        const headerLinks = links.filter(l => l.isActive && (l.location === 'header' || l.location === 'both'));
        let linksHtml = headerLinks.map(link => {
            const isCurrent = currentPath === link.url || (currentPath === "" && link.url === "index.html");
            const targetAttr = link.target === "_blank" ? 'target="_blank" rel="noreferrer"' : '';
            return `<a href="${link.url}" class="nav-link ${isCurrent ? 'is-active' : ''}" ${targetAttr}>${link.title}</a>`;
        }).join("");

        // Keep mobile cart link
        linksHtml += `
            <a href="cart.html" class="nav-link cart-link-mobile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                السلة
            </a>
        `;
        navLinksContainer.innerHTML = linksHtml;
    }

    // 2. Footer links
    const footerLinksContainer = document.querySelector(".footer-links");
    if (footerLinksContainer) {
        const footerLinks = links.filter(l => l.isActive && (l.location === 'footer' || l.location === 'both'));
        footerLinksContainer.innerHTML = footerLinks.map(link => {
            const targetAttr = link.target === "_blank" ? 'target="_blank" rel="noreferrer"' : '';
            return `<a class="footer-link" href="${link.url}" ${targetAttr}>${link.title}</a>`;
        }).join("");
    }
}

export function applyCmsToDom(cms) {
    if (!cms) return;

    // 1. Brand name in nav & footer
    document.querySelectorAll(".nav-brand").forEach(el => {
        el.textContent = cms.brandName || "K2rty";
    });
    document.querySelectorAll(".footer-logo").forEach(el => {
        el.textContent = cms.footerLogo || cms.brandName || "K2rty";
    });
    document.querySelectorAll(".footer-inner > p").forEach(el => {
        el.textContent = cms.footerTagline || "Your world in one tap.";
    });
    document.querySelectorAll(".footer-bottom p").forEach(el => {
        el.textContent = cms.footerCopyright || "© 2026 K2rty. جميع الحقوق محفوظة.";
    });

    // 2. WhatsApp Float button
    const waFloat = document.querySelector(".whatsapp-float");
    if (waFloat && cms.contact?.whatsappNumber) {
        waFloat.href = `https://wa.me/${cms.contact.whatsappNumber}`;
    }

    // 3. Announcement Top Bar (inject if not existing)
    let annBar = document.getElementById("cmsAnnouncementBar");
    if (!annBar) {
        annBar = document.createElement("div");
        annBar.id = "cmsAnnouncementBar";
        annBar.className = "announcement-bar";
        document.body.prepend(annBar);
    }
    if (cms.announcement && cms.announcement.enabled && cms.announcement.text) {
        annBar.classList.add("is-visible");
        annBar.innerHTML = `
            <span>${cms.announcement.text}</span>
            ${cms.announcement.link ? `<a href="${cms.announcement.link}">اطلب الآن ←</a>` : ""}
        `;
    } else {
        annBar.classList.remove("is-visible");
    }

    // 4. Index.html Hero Section
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle && cms.hero?.title) {
        heroTitle.innerHTML = cms.hero.title.replace(/\n/g, "<br>");
    }
    const heroEyebrow = document.querySelector(".hero .eyebrow");
    if (heroEyebrow && cms.hero?.eyebrow) {
        heroEyebrow.textContent = cms.hero.eyebrow;
    }
    const heroCopy = document.querySelector(".hero-copy");
    if (heroCopy && cms.hero?.subtitle) {
        heroCopy.textContent = cms.hero.subtitle;
    }
    const heroPrimaryCta = document.querySelector(".hero-cta .btn-primary");
    if (heroPrimaryCta && cms.hero?.ctaPrimaryText) {
        heroPrimaryCta.textContent = cms.hero.ctaPrimaryText;
        if (cms.hero.ctaPrimaryLink) heroPrimaryCta.href = cms.hero.ctaPrimaryLink;
    }
    const heroSecCta = document.querySelector(".hero-cta .btn-secondary");
    if (heroSecCta && cms.hero?.ctaSecondaryText) {
        heroSecCta.textContent = cms.hero.ctaSecondaryText;
        if (cms.hero.ctaSecondaryLink) heroSecCta.href = cms.hero.ctaSecondaryLink;
    }
    const heroMeta = document.querySelector(".hero-meta");
    if (heroMeta && cms.hero) {
        const divs = heroMeta.querySelectorAll("div");
        if (divs[0] && cms.hero.badgePrice) {
            divs[0].innerHTML = `<strong>${cms.hero.badgePrice}</strong>${cms.hero.badgePriceSub || ""}`;
        }
        if (divs[1] && cms.hero.badgeTech) {
            divs[1].innerHTML = `<strong>${cms.hero.badgeTech}</strong>${cms.hero.badgeTechSub || ""}`;
        }
    }

    // 5. Video Section
    const videoSec = document.querySelector(".video-section");
    if (videoSec && cms.video) {
        if (cms.video.enabled === false) {
            videoSec.style.display = "none";
        } else {
            videoSec.style.display = "block";
            const vTitle = videoSec.querySelector(".video-title");
            if (vTitle && cms.video.title) vTitle.textContent = cms.video.title;
            const vSub = videoSec.querySelector(".video-subtitle");
            if (vSub && cms.video.subtitle) vSub.textContent = cms.video.subtitle;
            const vCaption = videoSec.querySelector(".video-caption");
            if (vCaption && cms.video.caption) vCaption.textContent = cms.video.caption;
            const vPlayer = videoSec.querySelector("video source");
            if (vPlayer && cms.video.videoUrl) {
                vPlayer.src = cms.video.videoUrl;
                vPlayer.parentElement?.load();
            }
        }
    }

    // 6. Why K2rty (Features Section)
    const whySec = document.querySelector(".why-section");
    if (whySec) {
        const wTitle = whySec.querySelector(".section-title");
        if (wTitle && cms.featuresTitle) wTitle.textContent = cms.featuresTitle;
        const wLead = whySec.querySelector(".section-lead");
        if (wLead && cms.featuresSubtitle) wLead.textContent = cms.featuresSubtitle;

        const grid = whySec.querySelector(".why-grid");
        if (grid && Array.isArray(cms.features) && cms.features.length > 0) {
            grid.innerHTML = cms.features.map(feat => {
                const iconSvg = ICONS_SVG[feat.icon] || ICONS_SVG.zap;
                return `
                    <div class="why-card">
                        <div class="why-icon">${iconSvg}</div>
                        <h3>${feat.title}</h3>
                        <p>${feat.description}</p>
                    </div>
                `;
            }).join("");
        }
    }

    // 7. Use cases section ("لشغلك. لمحلك. لنفسك.")
    const useSec = document.querySelector("section .uses")?.closest("section");
    if (useSec) {
        const uTitle = useSec.querySelector(".section-title");
        if (uTitle && cms.useCasesTitle) uTitle.textContent = cms.useCasesTitle;
        const uLead = useSec.querySelector(".section-lead");
        if (uLead && cms.useCasesSubtitle) uLead.textContent = cms.useCasesSubtitle;

        const uContainer = useSec.querySelector(".uses");
        if (uContainer && Array.isArray(cms.useCases) && cms.useCases.length > 0) {
            uContainer.innerHTML = cms.useCases.map(uc => `
                <article class="use-card">
                    <h3>${uc.title}</h3>
                    <p>${uc.description}</p>
                </article>
            `).join("");
        }
    }

    // 8. CTA Band
    const ctaBand = document.querySelector(".cta-band");
    if (ctaBand) {
        const cTitle = ctaBand.querySelector(".section-title");
        if (cTitle && cms.ctaBandTitle) cTitle.textContent = cms.ctaBandTitle;
        const cSub = ctaBand.querySelector("p");
        if (cSub && cms.ctaBandSubtitle) cSub.textContent = cms.ctaBandSubtitle;
        const cBtn = ctaBand.querySelector("a.btn-primary");
        if (cBtn && cms.ctaBandButtonText) {
            cBtn.textContent = cms.ctaBandButtonText;
            if (cms.ctaBandButtonLink) cBtn.href = cms.ctaBandButtonLink;
        }
    }

    // 9. About Page (about.html)
    const pageHero = document.querySelector(".page-hero");
    if (pageHero && window.location.pathname.includes("about")) {
        const eye = pageHero.querySelector(".eyebrow");
        if (eye && cms.aboutEyebrow) eye.textContent = cms.aboutEyebrow;
        const h1 = pageHero.querySelector("h1");
        if (h1 && cms.aboutTitle) h1.textContent = cms.aboutTitle;
        const p = pageHero.querySelector("p");
        if (p && cms.aboutSubtitle) p.textContent = cms.aboutSubtitle;

        const splitSec = document.querySelector(".split");
        if (splitSec) {
            const img = splitSec.querySelector("img");
            if (img && cms.aboutImage) img.src = cms.aboutImage;
            const stTitle = splitSec.querySelector(".section-title");
            if (stTitle && cms.aboutStoryTitle) stTitle.textContent = cms.aboutStoryTitle;
            const stLead = splitSec.querySelector(".section-lead");
            if (stLead && cms.aboutStoryLead) stLead.textContent = cms.aboutStoryLead;

            const checkList = splitSec.querySelector(".check-list");
            if (checkList && Array.isArray(cms.aboutStoryBullets)) {
                checkList.innerHTML = cms.aboutStoryBullets.map(b => `
                    <li><span class="dot">✓</span> ${b}</li>
                `).join("");
            }
        }
    }

    // 10. How It Works Page (how-it-works.html)
    if (pageHero && window.location.pathname.includes("how-it-works")) {
        const eye = pageHero.querySelector(".eyebrow");
        if (eye && cms.howEyebrow) eye.textContent = cms.howEyebrow;
        const h1 = pageHero.querySelector("h1");
        if (h1 && cms.howTitle) h1.textContent = cms.howTitle;
        const p = pageHero.querySelector("p");
        if (p && cms.howSubtitle) p.textContent = cms.howSubtitle;

        const stepContainers = document.querySelectorAll(".steps");
        if (stepContainers[0] && Array.isArray(cms.howNfcSteps)) {
            stepContainers[0].innerHTML = cms.howNfcSteps.map(step => `
                <article class="step" style="background:#fff;color:var(--ink);border-color:var(--line);">
                    <div class="step-num">${step.num}</div>
                    <h3>${step.title}</h3>
                    <p style="color:var(--muted);">${step.description}</p>
                </article>
            `).join("");
        }
        if (stepContainers[1] && Array.isArray(cms.howQrSteps)) {
            stepContainers[1].innerHTML = cms.howQrSteps.map(step => `
                <article class="step" style="background:#fff;color:var(--ink);border-color:var(--line);">
                    <div class="step-num">${step.num}</div>
                    <h3>${step.title}</h3>
                    <p style="color:var(--muted);">${step.description}</p>
                </article>
            `).join("");
        }
    }
}

// Auto-run CMS & Links on DOM ready
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Fast apply cached content & links
    applyCmsToDom(getCachedCms());
    applyLinksToDom(getCachedLinks());

    // 2. Fetch fresh from API and re-apply
    const [freshCms, freshLinks] = await Promise.all([
        fetchLiveCms(),
        fetchLiveLinks()
    ]);
    applyCmsToDom(freshCms);
    applyLinksToDom(freshLinks);
});
