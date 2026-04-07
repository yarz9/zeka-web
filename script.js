/* ============================================================
   ZEKA_VEZ — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---------- Mobile Navigation ----------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    let overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        overlay.classList.toggle('show', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMenu = () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---------- Scroll Reveal Animations ----------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to animatable elements
    const animatableSelectors = [
        '.service-card',
        '.why-card',
        '.gallery-item',
        '.step-card',
        '.testimonial-card',
        '.trust-badge',
        '.contact-info-card',
        '.contact-social'
    ];

    animatableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.08}s`;
            revealObserver.observe(el);
        });
    });

    // Also animate section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-in');
        revealObserver.observe(el);
    });

    // ---------- Active Nav Link Highlight ----------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links li a:not(.nav-cta)');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(item => {
                    item.style.color = '';
                    item.style.background = '';
                    if (item.getAttribute('href') === `#${id}`) {
                        item.style.color = 'var(--color-black)';
                        item.style.background = 'var(--color-gray-100)';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ---------- Contact Form ----------
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic client-side validation
            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const subject = contactForm.querySelector('#subject');
            const message = contactForm.querySelector('#message');
            let valid = true;

            [name, email, subject, message].forEach(field => {
                field.style.borderColor = '';
                if (!field.value.trim()) {
                    field.style.borderColor = '#EF4444';
                    valid = false;
                }
            });

            // Email format check
            if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = '#EF4444';
                valid = false;
            }

            if (!valid) return;

            // Simulate submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Slanje...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formSuccess.classList.add('show');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.reset();

                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1200);
        });

        // Clear error border on focus
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('focus', () => {
                field.style.borderColor = '';
            });
        });
    }

    // ---------- Counter Animation for Hero Stats ----------
    const animateCounter = (el, target) => {
        const duration = 2000;
        const start = performance.now();
        const isPercent = el.textContent.includes('%');
        const suffix = isPercent ? '%' : '+';

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const num = parseInt(text.replace(/[^0-9]/g, ''));
                if (!isNaN(num)) {
                    animateCounter(entry.target, num);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));

    // ============================================================
    // PRICE CALCULATOR CHATBOT
    // ============================================================
    const calcFab = document.getElementById('calcFab');
    const calcPanel = document.getElementById('calcPanel');
    const calcClose = document.getElementById('calcClose');
    const calcBody = document.getElementById('calcBody');
    const calcInput = document.getElementById('calcStitches');
    const calcBtn = document.getElementById('calcBtn');

    if (calcFab && calcPanel) {
        const openCalc = () => {
            calcPanel.classList.add('open');
            calcFab.classList.add('hidden');
            setTimeout(() => calcInput.focus(), 350);
        };

        const closeCalc = () => {
            calcPanel.classList.remove('open');
            calcFab.classList.remove('hidden');
        };

        calcFab.addEventListener('click', openCalc);
        calcClose.addEventListener('click', closeCalc);

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && calcPanel.classList.contains('open')) {
                closeCalc();
            }
        });

        // Add a message to the chat
        const addMessage = (html, isUser = false) => {
            const msg = document.createElement('div');
            msg.className = `calc-msg ${isUser ? 'calc-msg-user' : 'calc-msg-bot'}`;

            const avatarSvg = isUser
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/></svg>';

            msg.innerHTML = `
                <div class="calc-avatar">${avatarSvg}</div>
                <div class="calc-bubble">${html}</div>
            `;

            calcBody.appendChild(msg);
            calcBody.scrollTop = calcBody.scrollHeight;
        };

        // Format number for display
        const fmt = (n) => {
            return n.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
        };

        // Calculate price
        const calculate = () => {
            const raw = calcInput.value.trim().replace(/\s/g, '').replace(/,/g, '.');
            calcInput.classList.remove('error');

            if (!raw) {
                calcInput.classList.add('error');
                calcInput.focus();
                return;
            }

            const stitches = parseFloat(raw);

            if (isNaN(stitches) || stitches <= 0) {
                addMessage(`<strong>${calcInput.value}</strong>`, true);
                addMessage('Molim vas unesite validan pozitivan broj. Na primer: <strong>5000</strong>, <strong>12000</strong> ili <strong>850</strong>.');
                calcInput.value = '';
                calcInput.classList.add('error');
                calcInput.focus();
                return;
            }

            if (stitches > 100000000) {
                addMessage(`<strong>${calcInput.value}</strong>`, true);
                addMessage('Taj broj je prevelik. Molim vas unesite realan broj uboda za vaš dizajn.');
                calcInput.value = '';
                calcInput.focus();
                return;
            }

            // Show user message
            addMessage(`Broj uboda: <strong>${Math.round(stitches).toLocaleString('sr-RS')}</strong>`, true);

            // Calculate
            const basePrice = (stitches / 1000) * 0.15;
            const finalPrice = basePrice * 1.30;
            const surcharge = finalPrice - basePrice;

            // Build result HTML
            const resultHtml = `
                Evo vaše okvirne cene za <strong>${Math.round(stitches).toLocaleString('sr-RS')}</strong> uboda:
                <div class="calc-result-card">
                    <div class="calc-result-price">
                        €${fmt(finalPrice)}<small>okvirna cena</small>
                    </div>
                    <div class="calc-result-breakdown">
                        <strong>Kalkulacija:</strong><br>
                        Osnovna cena: <code>${Math.round(stitches).toLocaleString('sr-RS')} ÷ 1000 × 0,15 = €${fmt(basePrice)}</code><br>
                        Dodatak 30%: <code>€${fmt(basePrice)} × 0,30 = €${fmt(surcharge)}</code><br>
                        <strong>Ukupno: <code>€${fmt(finalPrice)}</code></strong>
                    </div>
                    <div class="calc-disclaimer">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                        Ovo je <strong>okvirna cena</strong> i ne predstavlja konačnu ponudu. Finalna cena zavisi od složenosti dizajna, veličine, količine, materijala i posebnih zahteva. Za tačnu ponudu, <a href="#contact" style="color:var(--color-yellow-dark);text-decoration:underline;">kontaktirajte nas</a>.
                    </div>
                </div>
            `;

            // Small delay for natural feel
            setTimeout(() => {
                addMessage(resultHtml);
            }, 400);

            calcInput.value = '';
        };

        calcBtn.addEventListener('click', calculate);

        calcInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculate();
            }
        });

        // Clear error on focus
        calcInput.addEventListener('focus', () => {
            calcInput.classList.remove('error');
        });
    }

    // ============================================================
    // AI EMBROIDERY ESTIMATOR
    // ============================================================
    const estDropZone    = document.getElementById('estDropZone');
    const estFileInput   = document.getElementById('estFileInput');
    const estUploadEmpty = document.getElementById('estUploadEmpty');
    const estUploadPrev  = document.getElementById('estUploadPreview');
    const estPreviewImg  = document.getElementById('estPreviewImg');
    const estRemoveImg   = document.getElementById('estRemoveImg');
    const estWidth       = document.getElementById('estWidth');
    const estHeight      = document.getElementById('estHeight');
    const estUnit        = document.getElementById('estUnit');
    const estSubmit      = document.getElementById('estSubmit');
    const estResultPanel = document.getElementById('estResultPanel');
    const estResultEmpty = document.getElementById('estResultEmpty');
    const estResultLoad  = document.getElementById('estResultLoading');
    const estResultCont  = document.getElementById('estResultContent');
    const estCanvas      = document.getElementById('estCanvas');

    if (estDropZone && estCanvas) {

        let uploadedImage = null; // will hold the Image object

        // == File Handling ==
        const handleFile = (file) => {
            if (!file || !file.type.startsWith('image/')) return;
            if (file.size > 10 * 1024 * 1024) {
                alert('Slika je prevelika. Maksimalna veličina je 10MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImage = img;
                    estPreviewImg.src = e.target.result;
                    estUploadEmpty.hidden = true;
                    estUploadPrev.hidden = false;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };

        estDropZone.addEventListener('click', (e) => {
            if (e.target.closest('.est-remove-img')) return;
            estFileInput.click();
        });

        estFileInput.addEventListener('change', () => {
            if (estFileInput.files.length) handleFile(estFileInput.files[0]);
        });

        estDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            estDropZone.classList.add('dragover');
        });

        estDropZone.addEventListener('dragleave', () => {
            estDropZone.classList.remove('dragover');
        });

        estDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            estDropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        });

        estRemoveImg.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadedImage = null;
            estPreviewImg.src = '';
            estUploadEmpty.hidden = false;
            estUploadPrev.hidden = true;
            estFileInput.value = '';
        });

        // == Image Analysis Engine ==
        const analyzeImage = (img) => {
            const maxDim = 300; // scale down for performance
            let w = img.naturalWidth;
            let h = img.naturalHeight;
            const scale = Math.min(maxDim / w, maxDim / h, 1);
            w = Math.round(w * scale);
            h = Math.round(h * scale);

            const ctx = estCanvas.getContext('2d', { willReadFrequently: true });
            estCanvas.width = w;
            estCanvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);

            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;
            const totalPixels = w * h;

            // 1. Unique colors (quantized to reduce noise)
            const colorSet = new Set();
            let filledPixels = 0;
            let edgePixels = 0;
            let brightPixels = 0;
            let darkPixels = 0;
            let rSum = 0, gSum = 0, bSum = 0;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                // Skip near-transparent pixels (background)
                if (a < 30) continue;

                filledPixels++;
                rSum += r; gSum += g; bSum += b;

                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                if (lum < 50) darkPixels++;
                if (lum > 200) brightPixels++;

                // Quantize to 32-step palette
                const qr = (r >> 3) << 3;
                const qg = (g >> 3) << 3;
                const qb = (b >> 3) << 3;
                colorSet.add(`${qr},${qg},${qb}`);
            }

            const fillRatio = filledPixels / totalPixels;
            const uniqueColors = colorSet.size;

            // 2. Edge detection (simple Sobel) on grayscale
            const gray = new Float32Array(totalPixels);
            for (let i = 0; i < totalPixels; i++) {
                const idx = i * 4;
                const a = data[idx + 3];
                if (a < 30) { gray[i] = 255; continue; }
                gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            }

            let edgeSum = 0;
            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const idx = y * w + x;
                    const gx = -gray[idx - w - 1] + gray[idx - w + 1]
                              - 2 * gray[idx - 1]  + 2 * gray[idx + 1]
                              - gray[idx + w - 1]   + gray[idx + w + 1];
                    const gy = -gray[idx - w - 1] - 2 * gray[idx - w] - gray[idx - w + 1]
                              + gray[idx + w - 1] + 2 * gray[idx + w] + gray[idx + w + 1];
                    const magnitude = Math.sqrt(gx * gx + gy * gy);
                    if (magnitude > 30) edgePixels++;
                    edgeSum += magnitude;
                }
            }

            const innerPixels = (w - 2) * (h - 2);
            const edgeRatio = edgePixels / (innerPixels || 1);
            const avgEdge = edgeSum / (innerPixels || 1);

            // 3. Detail density — local variance in 8x8 blocks
            let highVarianceBlocks = 0;
            let totalBlocks = 0;
            const blockSize = 8;
            for (let by = 0; by < h - blockSize; by += blockSize) {
                for (let bx = 0; bx < w - blockSize; bx += blockSize) {
                    let sum = 0, sumSq = 0, count = 0;
                    for (let dy = 0; dy < blockSize; dy++) {
                        for (let dx = 0; dx < blockSize; dx++) {
                            const px = gray[(by + dy) * w + (bx + dx)];
                            sum += px;
                            sumSq += px * px;
                            count++;
                        }
                    }
                    const mean = sum / count;
                    const variance = (sumSq / count) - (mean * mean);
                    totalBlocks++;
                    if (variance > 400) highVarianceBlocks++;
                }
            }
            const detailRatio = highVarianceBlocks / (totalBlocks || 1);

            // 4. Text detection heuristic — high edge density in horizontal bands
            let textLikeBands = 0;
            const bandHeight = Math.max(4, Math.floor(h / 20));
            for (let by = 0; by < h - bandHeight; by += bandHeight) {
                let bandEdges = 0;
                let bandFilled = 0;
                for (let y = by; y < by + bandHeight; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const idx = y * w + x;
                        const a = data[idx * 4 + 3];
                        if (a >= 30) bandFilled++;
                        const gx = Math.abs(gray[idx - 1] - gray[idx + 1]);
                        if (gx > 25) bandEdges++;
                    }
                }
                const bandPixels = bandHeight * (w - 2);
                if (bandEdges / bandPixels > 0.15 && bandFilled / bandPixels > 0.2 &&
                    bandFilled / bandPixels < 0.8) {
                    textLikeBands++;
                }
            }
            const hasText = textLikeBands >= 2;
            const hasSignificantText = textLikeBands >= 4;

            // == Complexity Classification ==
            let complexityScore = 0;

            // Fill ratio: heavily filled = more stitches
            if (fillRatio > 0.7) complexityScore += 3;
            else if (fillRatio > 0.4) complexityScore += 2;
            else if (fillRatio > 0.15) complexityScore += 1;

            // Color count
            if (uniqueColors > 150) complexityScore += 3;
            else if (uniqueColors > 60) complexityScore += 2;
            else if (uniqueColors > 20) complexityScore += 1;

            // Edge density
            if (edgeRatio > 0.25) complexityScore += 3;
            else if (edgeRatio > 0.12) complexityScore += 2;
            else if (edgeRatio > 0.05) complexityScore += 1;

            // Detail density
            if (detailRatio > 0.5) complexityScore += 3;
            else if (detailRatio > 0.25) complexityScore += 2;
            else if (detailRatio > 0.1) complexityScore += 1;

            // Text presence
            if (hasSignificantText) complexityScore += 2;
            else if (hasText) complexityScore += 1;

            // Classify
            let complexity, densityMin, densityMax, label, labelSr;
            if (complexityScore <= 4) {
                complexity = 'simple';
                densityMin = 1800;
                densityMax = 2200;
                label = 'Simple';
                labelSr = 'Jednostavan';
            } else if (complexityScore <= 9) {
                complexity = 'medium';
                densityMin = 2200;
                densityMax = 2800;
                label = 'Medium';
                labelSr = 'Srednji';
            } else {
                complexity = 'complex';
                densityMin = 2800;
                densityMax = 3500;
                label = 'Complex';
                labelSr = 'Složen';
            }

            // Fine-tune density within range based on sub-scores
            const rangePos = Math.min(complexityScore / 15, 1);
            const density = densityMin + (densityMax - densityMin) * rangePos;

            // Build analysis reasons
            const reasons = [];

            if (fillRatio > 0.7) reasons.push('Visok stepen popunjenosti dizajna — veća gustina uboda');
            else if (fillRatio > 0.4) reasons.push('Umeren stepen popunjenosti dizajna');
            else if (fillRatio > 0.15) reasons.push('Delimično popunjen dizajn sa otvorenim prostorima');
            else reasons.push('Pretežno otvoren dizajn sa malo popunjenih površina');

            if (uniqueColors > 150) reasons.push(`Veliki broj boja u dizajnu (${uniqueColors}+ tonova)`);
            else if (uniqueColors > 60) reasons.push(`Umeren broj boja (${uniqueColors} tonova)`);
            else reasons.push(`Mali broj boja (${uniqueColors} tonova) — jednostavniji vez`);

            if (edgeRatio > 0.15) reasons.push('Mnogo finih detalja i ivica — povećava složenost');
            else if (edgeRatio > 0.06) reasons.push('Umeren nivo detalja i kontura');
            else reasons.push('Jednostavne konture sa malo detalja');

            if (hasSignificantText) reasons.push('Detektovani elementi teksta — zahtevaju precizne ubode');
            else if (hasText) reasons.push('Moguć tekst u dizajnu — blago povećava složenost');

            if (detailRatio > 0.4) reasons.push('Visoka gustina internih detalja i tekstura');

            return {
                complexity,
                label,
                labelSr,
                density: Math.round(density),
                densityMin,
                densityMax,
                fillRatio,
                uniqueColors,
                edgeRatio,
                detailRatio,
                hasText,
                hasSignificantText,
                complexityScore,
                reasons
            };
        };

        // == Calculate Price ==
        const calcPrice = (stitches) => {
            return (stitches / 1000 * 0.15) * 1.30;
        };

        const fmtNum = (n) => n.toLocaleString('sr-RS');
        const fmtPrice = (n) => n.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // == Show States ==
        const showState = (state) => {
            estResultEmpty.hidden = state !== 'empty';
            estResultLoad.hidden  = state !== 'loading';
            estResultCont.hidden  = state !== 'result';
        };

        // == Run Estimation ==
        const runEstimation = () => {
            // Validate
            if (!uploadedImage) {
                estDropZone.style.borderColor = '#EF4444';
                setTimeout(() => estDropZone.style.borderColor = '', 2000);
                return;
            }

            const wVal = parseFloat(estWidth.value);
            const hVal = parseFloat(estHeight.value);
            estWidth.classList.remove('error');
            estHeight.classList.remove('error');

            if (!wVal || wVal <= 0) { estWidth.classList.add('error'); estWidth.focus(); return; }
            if (!hVal || hVal <= 0) { estHeight.classList.add('error'); estHeight.focus(); return; }

            const unit = estUnit.value;
            const wInch = unit === 'cm' ? wVal / 2.54 : wVal;
            const hInch = unit === 'cm' ? hVal / 2.54 : hVal;
            const area = wInch * hInch;

            // Show loading
            showState('loading');

            // Simulate analysis delay for UX
            setTimeout(() => {
                const analysis = analyzeImage(uploadedImage);

                // Calculate stitch estimates
                const midStitches = Math.round(area * analysis.density);
                const lowStitches = Math.round(area * analysis.densityMin);
                const highStitches = Math.round(area * analysis.densityMax);

                // Apply adjustments
                let adjustmentFactor = 1.0;
                const adjustNotes = [];

                if (analysis.hasSignificantText) {
                    adjustmentFactor += 0.06;
                    adjustNotes.push('Korekcija za tekst (+6%)');
                } else if (analysis.hasText) {
                    adjustmentFactor += 0.03;
                    adjustNotes.push('Korekcija za tekst (+3%)');
                }

                if (analysis.fillRatio < 0.12) {
                    adjustmentFactor -= 0.08;
                    adjustNotes.push('Korekcija za nizak stepen popunjenosti (-8%)');
                }

                if (analysis.detailRatio > 0.5) {
                    adjustmentFactor += 0.05;
                    adjustNotes.push('Korekcija za visoku gustinu detalja (+5%)');
                }

                const finalStitches = Math.round(midStitches * adjustmentFactor);
                const finalLow = Math.round(lowStitches * adjustmentFactor);
                const finalHigh = Math.round(highStitches * adjustmentFactor);

                const price = calcPrice(finalStitches);
                const priceLow = calcPrice(finalLow);
                const priceHigh = calcPrice(finalHigh);

                // Populate result
                document.getElementById('estResultThumb').src = estPreviewImg.src;
                const badge = document.getElementById('estComplexityBadge');
                badge.textContent = analysis.labelSr;
                badge.className = `est-complexity-badge ${analysis.complexity}`;

                document.getElementById('estResultDims').textContent =
                    `${wVal} × ${hVal} ${unit} — ${wInch.toFixed(1)} × ${hInch.toFixed(1)} in — ${area.toFixed(1)} sq in`;

                document.getElementById('estStitchCount').textContent = `~${fmtNum(finalStitches)} uboda`;
                document.getElementById('estStitchRange').textContent =
                    `Raspon: ${fmtNum(finalLow)} – ${fmtNum(finalHigh)} uboda`;

                document.getElementById('estPriceValue').textContent = `€${fmtPrice(price)}`;
                document.getElementById('estPriceRange').textContent =
                    `Raspon: €${fmtPrice(priceLow)} – €${fmtPrice(priceHigh)}`;

                // Analysis list
                const list = document.getElementById('estAnalysisList');
                list.innerHTML = '';
                const allReasons = [...analysis.reasons, ...adjustNotes];
                allReasons.forEach(reason => {
                    const li = document.createElement('li');
                    li.textContent = reason;
                    list.appendChild(li);
                });

                showState('result');
            }, 1500);
        };

        estSubmit.addEventListener('click', runEstimation);

        // Clear error on input focus
        [estWidth, estHeight].forEach(el => {
            el.addEventListener('focus', () => el.classList.remove('error'));
        });
    }

});
