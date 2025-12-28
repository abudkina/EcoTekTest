# Настройка IndexNow для ускорения индексации

## Что такое IndexNow?

IndexNow - это открытый протокол, который позволяет мгновенно уведомлять поисковые системы (Яндекс, Bing и др.) об изменениях на вашем сайте. Это ускоряет индексацию новых и обновленных страниц.

## Текущая настройка

- **Ключ IndexNow**: `ecotek-as-2024-indexnow-key-abc123xyz789`
- **Файл ключа**: `ecotek-as-2024-indexnow-key-abc123xyz789.txt`
- **URL файла ключа**: `https://ecotek-as.ru/ecotek-as-2024-indexnow-key-abc123xyz789.txt`

## Как использовать

### Вариант 1: Онлайн-сервис IndexNow.org

1. Перейдите на https://www.indexnow.org/
2. Введите URL вашего сайта: `https://ecotek-as.ru/`
3. Введите ключ: `ecotek-as-2024-indexnow-key-abc123xyz789`
4. Укажите URL страниц для уведомления
5. Нажмите "Submit"

### Вариант 2: Через скрипт (Node.js)

```bash
node indexnow-submit.js
```

### Вариант 3: Через скрипт (Windows Batch)

```bash
indexnow-submit.bat
```

### Вариант 4: Через curl (вручную)

```bash
curl -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "ecotek-as.ru",
    "key": "ecotek-as-2024-indexnow-key-abc123xyz789",
    "keyLocation": "https://ecotek-as.ru/ecotek-as-2024-indexnow-key-abc123xyz789.txt",
    "urlList": ["https://ecotek-as.ru/"]
  }'
```

### Вариант 5: Через Яндекс Вебмастер

1. Войдите в Яндекс Вебмастер
2. Перейдите в раздел "Индексирование" → "Переобход страниц"
3. Укажите URL страницы и нажмите "Добавить"

## Когда использовать IndexNow?

Используйте IndexNow после:
- ✅ Обновления контента на странице
- ✅ Добавления новых страниц
- ✅ Изменения важной информации (цены, описания товаров)
- ✅ Обновления структурированных данных

## Важно!

1. **Файл ключа должен быть доступен** по адресу: `https://ecotek-as.ru/ecotek-as-2024-indexnow-key-abc123xyz789.txt`
2. **Не злоупотребляйте** - отправляйте уведомления только при реальных изменениях
3. **Проверьте доступность** файла ключа перед использованием

## Проверка доступности ключа

Откройте в браузере:
```
https://ecotek-as.ru/ecotek-as-2024-indexnow-key-abc123xyz789.txt
```

Должен отображаться текст ключа.

## Дополнительная информация

- Документация IndexNow: https://www.indexnow.org/
- Документация Яндекс: https://yandex.ru/support/webmaster/indexnow/indexnow.html
