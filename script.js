// Liuzhou travel map: hover linkage, click-to-scroll, copy, progress bar

document.addEventListener('DOMContentLoaded', () => {
    initMapInteractions();
    setupCopyLocations();
    createProgressBar();
});

/* ===== Map hover linkage & click-to-scroll ===== */
function initMapInteractions() {
    const scrollTargets = {
        hotel:      'scroll-hotel',
        foodstreet: 'scroll-day1',
        market:     'scroll-day3',
        wenmiao:    'scroll-day2',
        dengtai:    'scroll-day2',
        yaobu:      'scroll-day2',
        taiping:    'scroll-day1'
    };

    const nodes = document.querySelectorAll('.map-svg .node');
    const cards = document.querySelectorAll('.place-card');

    const cardsByKey = {};
    cards.forEach(c => { cardsByKey[c.dataset.id] = c; });
    const nodesByKey = {};
    nodes.forEach(n => { nodesByKey[n.dataset.key] = n; });

    // Hover: node ↔ card highlight
    nodes.forEach(node => {
        const key = node.dataset.key;
        node.addEventListener('mouseenter', () => {
            node.classList.add('highlight');
            if (cardsByKey[key]) cardsByKey[key].classList.add('highlight');
        });
        node.addEventListener('mouseleave', () => {
            node.classList.remove('highlight');
            if (cardsByKey[key]) cardsByKey[key].classList.remove('highlight');
        });
    });

    cards.forEach(card => {
        const key = card.dataset.id;
        card.addEventListener('mouseenter', () => {
            card.classList.add('highlight');
            if (nodesByKey[key]) nodesByKey[key].classList.add('highlight');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('highlight');
            if (nodesByKey[key]) nodesByKey[key].classList.remove('highlight');
        });
    });

    // Click: node → smooth scroll to corresponding timeline section
    nodes.forEach(node => {
        const key = node.dataset.key;
        const targetId = scrollTargets[key];
        if (!targetId) return;
        node.style.cursor = 'pointer';
        node.addEventListener('click', () => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

/* ===== Copy restaurant name ===== */
function setupCopyLocations() {
    document.querySelectorAll('.restaurant-name').forEach(el => {
        el.style.cursor = 'pointer';
        el.title = '点击复制餐厅名';
        el.addEventListener('click', e => {
            e.stopPropagation();
            const text = el.textContent.trim();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    const old = el.textContent;
                    el.textContent = '已复制 ✓';
                    setTimeout(() => el.textContent = old, 1200);
                }).catch(() => {});
            }
        });
    });
}

/* ===== Progress bar ===== */
function createProgressBar() {
    const bar = document.createElement('div');
    Object.assign(bar.style, {
        position: 'fixed', top: '0', left: '0', height: '4px',
        background: 'linear-gradient(90deg,var(--accent),var(--accent-2))',
        width: '0%', zIndex: '9999', transition: 'width 120ms linear'
    });
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    });
}
