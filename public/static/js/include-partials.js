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
    if (headerEl) {
        fetch(window.ecotekUrl('/static/partials/header.html')).then(function(r) { return r.text(); }).then(function(html) {
            headerEl.innerHTML = html;
        }).catch(function() {});
    }
    if (footerEl) {
        fetch(window.ecotekUrl('/static/partials/footer.html')).then(function(r) { return r.text(); }).then(function(html) {
            footerEl.innerHTML = html;
            setYear();
        }).catch(function() { setYear(); });
    } else {
        setYear();
    }
})();
