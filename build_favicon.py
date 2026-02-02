"""Генерация favicon.ico из PNG (чёрный фон → прозрачный). Требует: pip install Pillow"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Установите Pillow: pip install Pillow")
    sys.exit(1)

SRC = Path(__file__).parent / "static/images/Screenshot_1-Photoroom.png"
OUT = Path(__file__).parent / "favicon.ico"
BLACK_THRESHOLD = 45

def main():
    img = Image.open(SRC).convert("RGBA")
    w, h = img.size
    data = img.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        if r <= BLACK_THRESHOLD and g <= BLACK_THRESHOLD and b <= BLACK_THRESHOLD:
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    img16 = img.resize((16, 16), Image.LANCZOS)
    img32 = img.resize((32, 32), Image.LANCZOS)
    img32.save(OUT, format="ICO", sizes=[(16, 16), (32, 32)], append_images=[img16])
    print("favicon.ico создан")

if __name__ == "__main__":
    main()
