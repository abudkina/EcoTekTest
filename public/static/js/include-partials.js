(function() {
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');
    function setYear() {
        var y = document.getElementById('current-year');
        if (y) y.textContent = new Date().getFullYear();
    }
    if (headerEl) {
        fetch('/static/partials/header.html').then(function(r) { return r.text(); }).then(function(html) {
            headerEl.innerHTML = html;
        }).catch(function() {});
    }
    if (footerEl) {
        fetch('/static/partials/footer.html').then(function(r) { return r.text(); }).then(function(html) {
            footerEl.innerHTML = html;
            setYear();
        }).catch(function() { setYear(); });
    } else {
        setYear();
    }
})();
