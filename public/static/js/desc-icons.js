(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EcotekDescIcons = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    var ICON_RULES = [
        [/^\s*цен/i, 'fa-tag'],
        [/^\s*применен/i, 'fa-industry'],
        [/^\s*чистот/i, 'fa-filter'],
        [/^\s*консистенц/i, 'fa-droplet'],
        [/^\s*вспышк/i, 'fa-fire'],
        [/^\s*мороз/i, 'fa-snowflake'],
        [/^\s*теплоотдач/i, 'fa-temperature-high'],
        [/^\s*состав/i, 'fa-flask'],
        [/^\s*выгод/i, 'fa-wallet'],
        [/класс\s*б/i, 'fa-biohazard'],
        [/класс\s*в/i, 'fa-virus'],
        [/класс\s*г/i, 'fa-pills'],
        [/вывоз|доставк|транспорт/i, 'fa-truck'],
        [/документ|паспорт качества|акт |отчет/i, 'fa-file-alt'],
        [/сертификат/i, 'fa-certificate'],
        [/лиценз/i, 'fa-stamp'],
        [/прием на возмезд|оплат|наличн|безнал/i, 'fa-ruble-sign'],
        [/самовывоз|отгрузк|площадк/i, 'fa-warehouse'],
        [/санитарн/i, 'fa-notes-medical'],
        [/восстановительн/i, 'fa-seedling'],
        [/лабораторн/i, 'fa-microscope'],
        [/химическ(?:ий)? анализ|анализ всех/i, 'fa-vial'],
        [/результат(?:ы)? испытан/i, 'fa-clipboard-list'],
        [/оптовые поставк|от 1 тонн/i, 'fa-boxes'],
        [/экономичн|дешевле|стоимост/i, 'fa-wallet'],
        [/универсальн/i, 'fa-check-double'],
        [/вспышк/i, 'fa-fire'],
        [/вязк|консистенц|плотност/i, 'fa-droplet'],
        [/мороз|застыван/i, 'fa-snowflake'],
        [/теплоотдач/i, 'fa-temperature-high'],
        [/сер[ыау](?:\s|,|\.|$)/i, 'fa-leaf'],
        [/аналог дизель/i, 'fa-gas-pump'],
        [/частн(?:ых)? дом|коттедж/i, 'fa-home'],
        [/промышленн(?:ых)? объект/i, 'fa-industry'],
        [/теплогенератор/i, 'fa-cogs'],
        [/асфальт/i, 'fa-road'],
        [/сушильн/i, 'fa-wind'],
        [/гараж|подсобн/i, 'fa-warehouse'],
        [/складск/i, 'fa-warehouse'],
        [/эколог/i, 'fa-leaf'],
        [/быстр(?:ое)? реагирован/i, 'fa-bolt'],
        [/норм и требован|соблюдение всех норм/i, 'fa-clipboard-check'],
        [/обезвреж|переработ|утилиз/i, 'fa-recycle'],
        [/очистк/i, 'fa-broom'],
        [/защит(?:у|а|ы) от коррози|износ/i, 'fa-shield-alt'],
        [/петел|замок|замков/i, 'fa-lock'],
        [/демонтаж|резьбов/i, 'fa-wrench'],
        [/ржавчин|окалин|коррози/i, 'fa-droplet'],
        [/гряз[ьи]|влаг|скрип/i, 'fa-spray-can'],
        [/электрическ|контакт/i, 'fa-bolt'],
        [/превосход|независим(?:ых)? испытан/i, 'fa-trophy'],
        [/шин[ыа](?:\s|,|$)/i, 'fa-circle'],
        [/автомобил(?:ях|ей|ьн)/i, 'fa-car'],
        [/уплотнител|прокладк/i, 'fa-ring'],
        [/резинотехническ/i, 'fa-cogs'],
        [/резин/i, 'fa-circle'],
        [/спецодежд|индивидуальной защиты/i, 'fa-shirt'],
        [/гидравлич/i, 'fa-tint'],
        [/топливн(?:ые|ый) фильтр/i, 'fa-gas-pump'],
        [/маслян(?:ые|ый) фильтр/i, 'fa-filter'],
        [/компрессор/i, 'fa-compress'],
        [/трансформатор/i, 'fa-bolt'],
        [/индустриальн|станк/i, 'fa-industry'],
        [/генератор|двигател/i, 'fa-cogs'],
        [/лак(?:и|ов)|краск|эмал/i, 'fa-paint-brush'],
        [/кле[ея]|смол|герметик|мастик/i, 'fa-fill-drip'],
        [/растворител/i, 'fa-flask'],
        [/красител|краски для волос/i, 'fa-palette'],
        [/тар[ауы]|ветошь|кист/i, 'fa-box-open'],
        [/металл|абразив|шлифов/i, 'fa-cog'],
        [/гальван|электролит/i, 'fa-flask'],
        [/промывн/i, 'fa-shower'],
        [/ливнев/i, 'fa-cloud-showers-heavy'],
        [/аварийн|разлив/i, 'fa-exclamation-triangle'],
        [/очистных/i, 'fa-water'],
        [/осадк/i, 'fa-layer-group'],
        [/грунт|песок|песчан/i, 'fa-mountain'],
        [/ремонт(?:а)? и обслуживан|ремонт(?:а)? оборудован/i, 'fa-tools'],
        [/опасн(?:ыми|ых) веществ/i, 'fa-biohazard'],
        [/некондицион|истекш(?:им|им)? срок/i, 'fa-hourglass-end'],
        [/нефтесодержащ|промаслен/i, 'fa-oil-can'],
        [/^\s*жидк/i, 'fa-tint'],
        [/^\s*вод/i, 'fa-tint'],
        [/фильтр/i, 'fa-filter'],
        [/отработанн/i, 'fa-recycle'],
        [/загрязненн/i, 'fa-droplet'],
        [/остатк/i, 'fa-industry'],
        [/жидк/i, 'fa-tint'],
        [/вод[аыу](?:\s|,|$)/i, 'fa-tint'],
        [/котл|горелк/i, 'fa-industry'],
        [/нефте|масл|шлам|сож/i, 'fa-oil-can'],
        [/дизел/i, 'fa-gas-pump'],
        [/химическ/i, 'fa-flask'],
        [/безопасн/i, 'fa-shield-alt'],
        [/производств/i, 'fa-industry']
    ];

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function stripTags(html) {
        return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function iconForItem(text) {
        var t = String(text || '');
        for (var i = 0; i < ICON_RULES.length; i++) {
            if (ICON_RULES[i][0].test(t)) return ICON_RULES[i][1];
        }
        return 'fa-check';
    }

    function iconHtml(name) {
        return '<span class="desc-icon" aria-hidden="true"><i class="fas ' + name + '"></i></span>';
    }

    function stripLeadingDecorators(html) {
        var s = String(html || '');
        s = s.replace(/^\s*<strong[^>]*>\s*[✓✔]\s*<\/strong>\s*/i, '');
        s = s.replace(/^\s*<span[^>]*>\s*[^<]{1,4}\s*<\/span>\s*/i, '');
        s = s.replace(/^\s*[✓✔]\s*/, '');
        s = s.replace(/(<strong[^>]*>)\s*(?:(?:[\u00A9-\u00AE]|[\u2000-\u3300]|[\uD83C-\uDBFF][\uDC00-\uDFFF])\uFE0F?)+\s*/g, '$1');
        s = s.replace(/^\s*(?:(?:[\u00A9-\u00AE]|[\u2000-\u3300]|[\uD83C-\uDBFF][\uDC00-\uDFFF])\uFE0F?)+\s*/g, '');
        return s;
    }

    function wrapLi(attrs, inner) {
        if (/desc-icon/.test(inner)) return '<li' + attrs + '>' + inner + '</li>';
        var cleaned = stripLeadingDecorators(inner);
        var icon = iconForItem(stripTags(cleaned));
        return '<li' + attrs + '>' + iconHtml(icon) + '<span class="desc-icon-text">' + cleaned + '</span></li>';
    }

    function addListClass(attrs) {
        if (/desc-icon-list/.test(attrs)) return attrs;
        if (/class='/.test(attrs)) return attrs.replace(/class='/, "class='desc-icon-list ");
        if (/class="/.test(attrs)) return attrs.replace(/class="/, 'class="desc-icon-list ');
        return ' class="desc-icon-list"' + attrs;
    }

    function enrichHtml(html) {
        var out = String(html || '');
        out = out.replace(/<ul([^>]*)>/gi, function (m, attrs) {
            return '<ul' + addListClass(attrs) + '>';
        });
        out = out.replace(/<li([^>]*)>([\s\S]*?)<\/li>/gi, function (m, attrs, inner) {
            return wrapLi(attrs, inner);
        });
        out = out.replace(/<div style='background: #fff; padding: 12px; border-left: 4px solid #3498db; border-radius: 4px;'>([\s\S]*?)<\/div>/g, function (m, inner) {
            if (/desc-icon/.test(inner)) return m;
            var cleaned = stripLeadingDecorators(inner);
            return '<div class="desc-area-card">' + iconHtml(iconForItem(stripTags(cleaned))) + '<span class="desc-icon-text">' + cleaned + '</span></div>';
        });
        return out;
    }

    function formatPlain(text) {
        var lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
        var out = [];
        var bullets = [];

        function flush() {
            if (!bullets.length) return;
            out.push('<ul class="desc-icon-list">');
            for (var i = 0; i < bullets.length; i++) {
                var item = bullets[i];
                out.push('<li>' + iconHtml(iconForItem(item)) + '<span class="desc-icon-text">' + escapeHtml(item) + '</span></li>');
            }
            out.push('</ul>');
            bullets = [];
        }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) {
                flush();
                continue;
            }
            if (/^[•·\-]\s*/.test(line) || line.charAt(0) === '•') {
                bullets.push(line.replace(/^[•·\-]\s*/, ''));
                continue;
            }
            flush();
            if (/^Важно:/i.test(line)) {
                out.push('<p class="desc-note">' + iconHtml('fa-exclamation-circle') + '<span class="desc-icon-text">' + escapeHtml(line) + '</span></p>');
            } else if (/:$/.test(line) && line.length < 90) {
                out.push('<p class="desc-subhead">' + escapeHtml(line) + '</p>');
            } else {
                out.push('<p>' + escapeHtml(line) + '</p>');
            }
        }
        flush();
        return out.join('\n');
    }

    function formatDescription(raw) {
        if (!raw) return '';
        if (String(raw).indexOf('<') >= 0) return enrichHtml(raw);
        return formatPlain(raw);
    }

    return {
        iconForItem: iconForItem,
        formatDescription: formatDescription,
        enrichHtml: enrichHtml
    };
});
