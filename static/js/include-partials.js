(function() {
    var base = '';
    var match = location.pathname.match(/^(\/EcoTekTest)(?=\/|$)/);
    if (match) base = match[1];
    window.ecotekSiteBase = base;
    window.ecotekUrl = function(path) {
        if (!path) return base + '/';
        if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
        if (path.charAt(0) !== '/') path = '/' + path;
        if (base && (path === base || path.indexOf(base + '/') === 0)) return path;
        return base + path;
    };

    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');
    function setYear() {
        var y = document.getElementById('current-year');
        if (y) y.textContent = new Date().getFullYear();
    }
    function rewritePartialLinks(root) {
        if (!base || !root) return;
        root.querySelectorAll('a[href], img[src]').forEach(function(el) {
            var attr = el.hasAttribute('href') ? 'href' : 'src';
            el.setAttribute(attr, window.ecotekUrl(el.getAttribute(attr)));
        });
    }
    if (headerEl && headerEl.querySelector('header')) {
        rewritePartialLinks(headerEl);
    } else if (headerEl) {
        fetch(window.ecotekUrl('/EcoTekTest/static/partials/header.html')).then(function(r) { return r.text(); }).then(function(html) {
            headerEl.innerHTML = html;
        }).catch(function() {});
    }
    if (footerEl && footerEl.querySelector('footer')) {
        rewritePartialLinks(footerEl);
        setYear();
    } else if (footerEl) {
        fetch(window.ecotekUrl('/EcoTekTest/static/partials/footer.html')).then(function(r) { return r.text(); }).then(function(html) {
            footerEl.innerHTML = html;
            setYear();
        }).catch(function() { setYear(); });
    } else {
        setYear();
    }
})();
