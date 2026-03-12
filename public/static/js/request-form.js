(function () {
    var overlay = document.getElementById('request-modal-overlay');
    var form = document.getElementById('request-form');
    var statusEl = document.getElementById('request-form-status');
    var btnOpen = document.getElementById('btn-open-request');
    var btnClose = document.getElementById('request-modal-close');

    function openModal() {
        if (overlay) {
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            var first = form && form.querySelector('input, textarea, button');
            if (first) first.focus();
        }
    }
    function closeModal() {
        if (overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }
    function setStatus(msg, isError) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className = isError ? 'error' : 'success';
    }

    function openModalClick(e) { e.preventDefault(); openModal(); }
    if (btnOpen) btnOpen.addEventListener('click', openModal);
    var linkOpen = document.getElementById('link-open-request');
    if (linkOpen) linkOpen.addEventListener('click', openModalClick);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) closeModal();
    });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = (form.querySelector('[name="name"]') || {}).value;
            var phone = (form.querySelector('[name="phone"]') || {}).value;
            var message = (form.querySelector('[name="message"]') || {}).value;
            if (!name || !phone) {
                setStatus('Укажите имя и телефон.', true);
                return;
            }
            var submitBtn = document.getElementById('request-submit');
            if (submitBtn) submitBtn.disabled = true;
            setStatus('Отправка…', false);

            var fd = new FormData();
            fd.append('name', name);
            fd.append('phone', phone);
            fd.append('message', message || '');
            fd.append('_subject', 'Заявка с сайта ЭКОТЭК АС');
            fd.append('_captcha', 'false');

            fetch('https://formsubmit.co/ECO-TEC-JSC@yandex.ru', {
                method: 'POST',
                body: fd
            })
                .then(function (r) {
                    if (!r.ok) throw new Error(r.statusText || 'Ошибка');
                    return r.json().catch(function () { return {}; });
                })
                .then(function () {
                    setStatus('Заявка отправлена. Мы перезвоним в ближайшее время.', false);
                    form.reset();
                    setTimeout(closeModal, 2000);
                })
                .catch(function () {
                    setStatus('Не удалось отправить. Позвоните нам: +7 (926) 615-00-77', true);
                })
                .finally(function () {
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }
})();
