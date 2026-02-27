(function () {
    function initNavbar() {
        const toggle = document.getElementById('menu-toggle');
        const inner = document.getElementById('navbar-inner');
        const nav = document.getElementById('main-nav');

        if (nav) {
            const currentUrl = window.location.href;
            const links = nav.querySelectorAll('a');
            links.forEach(link => {
                if (link.href === currentUrl) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        if (toggle && inner && !toggle.hasAttribute('data-init')) {
            toggle.setAttribute('data-init', 'true');
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                inner.classList.toggle('nav-open');
                toggle.setAttribute('aria-expanded', inner.classList.contains('nav-open'));
            });

            document.addEventListener('click', (e) => {
                if (inner.classList.contains('nav-open') && !inner.contains(e.target)) {
                    inner.classList.remove('nav-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    const observer = new MutationObserver(() => {
        if (document.getElementById('navbar')) {
            initNavbar();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})(); 