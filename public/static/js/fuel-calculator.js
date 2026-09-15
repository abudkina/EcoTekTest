(function () {
    var FUELS = {
        dark: { priceL: 30, priceKg: 34.5, density: 0.87, lead: 'Укажите объём в литрах или массу в кг — рассчитаем сумму. Цена: 30 ₽/л, ≈ 34,5 ₽/кг.' },
        light: { priceL: 45, priceKg: 56, density: 0.804, lead: 'Укажите объём в литрах или массу в кг — рассчитаем сумму. Цена: 45 ₽/л, ≈ 56 ₽/кг.' }
    };
    var input = document.getElementById('fuel-calc-value');
    if (!input) return;

    var label = document.querySelector('.fuel-calc-label');
    var unitSpan = document.querySelector('.fuel-calc-unit');
    var otherEl = document.getElementById('fuel-calc-other');
    var otherUnitEl = document.getElementById('fuel-calc-other-unit');
    var sumEl = document.getElementById('fuel-calc-sum');
    var leadEl = document.getElementById('fuel-calc-lead');
    var unitTabs = document.querySelectorAll('.fuel-calc-unit-tab');
    var typeTabs = document.querySelectorAll('.fuel-calc-type');
    var root = document.getElementById('fuel-calculator') || document.body;
    var preset = root.getAttribute('data-fuel') || 'dark';

    typeTabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-fuel') === preset;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    function currentFuel() {
        var active = document.querySelector('.fuel-calc-type.active');
        return FUELS[active ? active.getAttribute('data-fuel') : 'dark'];
    }

    function formatNum(x) {
        if (x >= 1000) return Math.round(x).toLocaleString('ru-RU');
        if (x >= 1) return Math.round(x * 100) / 100;
        return Math.round(x * 1000) / 1000;
    }

    function update() {
        var fuel = currentFuel();
        var litersTab = document.querySelector('.fuel-calc-unit-tab[data-unit="liters"]');
        var isLiters = litersTab && litersTab.classList.contains('active');
        var raw = parseFloat(input.value) || 0;
        var liters, kg, sum;
        if (isLiters) {
            liters = raw;
            kg = liters * fuel.density;
            sum = liters * fuel.priceL;
        } else {
            kg = raw;
            liters = kg / fuel.density;
            sum = kg * fuel.priceKg;
        }
        if (otherEl) otherEl.textContent = formatNum(isLiters ? kg : liters);
        if (otherUnitEl) otherUnitEl.textContent = isLiters ? 'кг' : 'л';
        if (sumEl) sumEl.textContent = Math.round(sum).toLocaleString('ru-RU') + ' ₽';
        if (leadEl) leadEl.textContent = fuel.lead;
    }

    typeTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            typeTabs.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            update();
        });
    });

    unitTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var fuel = currentFuel();
            var unit = tab.getAttribute('data-unit');
            var raw = parseFloat(input.value) || 0;
            var valToSet = unit === 'liters' ? raw / fuel.density : raw * fuel.density;
            unitTabs.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            if (unit === 'liters') {
                if (label) label.textContent = 'Объём, л';
                if (unitSpan) unitSpan.textContent = 'л';
                if (otherUnitEl) otherUnitEl.textContent = 'кг';
            } else {
                if (label) label.textContent = 'Масса, кг';
                if (unitSpan) unitSpan.textContent = 'кг';
                if (otherUnitEl) otherUnitEl.textContent = 'л';
            }
            input.value = raw ? formatNum(valToSet) : '';
            input.placeholder = '0';
            update();
        });
    });

    input.addEventListener('input', update);
    input.addEventListener('change', update);
    update();
})();
