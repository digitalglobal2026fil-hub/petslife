#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import qrcode, os, math

W, H = 874, 1240
ORANGE      = (255, 107, 53)
ORANGE_DARK = (210, 68, 10)
ORANGE_LIGHT= (255, 240, 228)
WHITE       = (255, 255, 255)
DARK        = (25,  25,  25)
GRAY        = (110, 110, 110)

PLAY_URL = "https://play.google.com/store/apps/details?id=com.petslife.app"
OUT = "/home/user/petslife/flyer/petslife_flyer_a5.png"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

def font(size, bold=False):
    for p in [
        f"/usr/share/fonts/truetype/liberation/LiberationSans{'-Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
    ]:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def rr(d, xy, r, fill, outline=None, ow=0):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=ow)

def make_qr():
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H,
                      box_size=7, border=2)
    q.add_data(PLAY_URL); q.make(fit=True)
    return q.make_image(fill_color=DARK, back_color=WHITE).resize((165,165), Image.LANCZOS)

# ── icon drawing helpers ──
def icon_cross(d, cx, cy, s, c):          # medical cross
    t = max(4, s//5)
    d.rectangle([cx-t,cy-s//2,cx+t,cy+s//2], fill=c)
    d.rectangle([cx-s//2,cy-t,cx+s//2,cy+t], fill=c)

def icon_chat(d, cx, cy, s, c):           # speech bubble
    d.rounded_rectangle([cx-s//2,cy-s//2,cx+s//2,cy+s//3], radius=6, fill=c)
    d.polygon([(cx-8,cy+s//3),(cx+8,cy+s//3),(cx-12,cy+s//2+6)], fill=c)

def icon_doc(d, cx, cy, s, c):            # document
    d.rounded_rectangle([cx-s//2+2,cy-s//2,cx+s//2-2,cy+s//2], radius=4, fill=c)
    d.rectangle([cx-s//2+10,cy-s//4,cx+s//2-10,cy-s//4+3], fill=WHITE)
    d.rectangle([cx-s//2+10,cy-s//8,cx+s//2-10,cy-s//8+3], fill=WHITE)
    d.rectangle([cx-s//2+10,cy,cx+s//2-10,cy+3], fill=WHITE)

def icon_cart(d, cx, cy, s, c):           # shopping bag
    d.rounded_rectangle([cx-s//2+2,cy-s//4,cx+s//2-2,cy+s//2], radius=5, fill=c)
    d.arc([cx-s//4,cy-s//2,cx+s//4,cy-s//4+4], start=180, end=0, fill=WHITE, width=3)

def icon_people(d, cx, cy, s, c):         # two heads
    r = s//6
    d.ellipse([cx-r*2-r,cy-s//2,cx-r*2+r,cy-s//2+r*2], fill=c)
    d.ellipse([cx+r*2-r,cy-s//2+4,cx+r*2+r,cy-s//2+4+r*2], fill=c)
    d.chord([cx-r*3,cy-r,cx+r,cy+s//3], start=0, end=180, fill=c)
    d.chord([cx,cy-r+4,cx+r*4,cy+s//3+4], start=0, end=180, fill=c)

icons = [icon_cross, icon_chat, icon_doc, icon_cart, icon_people]

features = [
    ("Clinicas & Petshops perto de ti",    "Encontra e avalia negocios na tua zona"),
    ("Consultas veterinarias online",       "Fala com vets em tempo real"),
    ("Caderneta digital do teu pet",        "Vacinas, consultas e historico medico"),
    ("Marketplace de produtos & servicos",  "Compra e vende na comunidade"),
    ("Comunidade ativa",                    "Partilha momentos com outros donos"),
]

# ──────────────── CANVAS ────────────────
img = Image.new("RGB", (W, H), WHITE)
d   = ImageDraw.Draw(img)

# ── HEADER ──
HDR = 310
d.rectangle([0,0,W,HDR], fill=ORANGE)

# subtle diagonal stripe
for i in range(-10, 20):
    x = i * 60
    d.line([(x,0),(x+HDR,HDR)], fill=(230,85,25), width=2)

# paw prints decoration (simple circles)
def paw(cx,cy,r,col):
    d.ellipse([cx-r,cy-r,cx+r,cy+r], fill=col)
    for dx,dy in [(-r,-r*1.4),(r,-r*1.4),(-r*1.5,-r*0.3),(r*1.5,-r*0.3)]:
        dr = int(r*0.55)
        d.ellipse([cx+dx-dr,cy+dy-dr,cx+dx+dr,cy+dy+dr], fill=col)

paw(760, 50, 22, (220,78,18))
paw(820,200, 14, (220,78,18))
paw( 40,240, 12, (220,78,18))

# logo paw (white)
paw(58, 65, 26, WHITE)

# App name
d.text((106, 30), "PetsLife", font=font(72, bold=True), fill=WHITE)
d.text((106,112), "Tudo o que o teu animal precisa,", font=font(21), fill=(255,230,205))
d.text((106,138), "numa so app.", font=font(21), fill=(255,230,205))

# Slogan
d.text((W//2, 198), "Cuida. Conecta. Celebra.", font=font(30, bold=True), fill=WHITE, anchor="mm")
d.text((W//2, 238), "A comunidade dos donos de animais em Portugal.",
       font=font(18), fill=(255,230,205), anchor="mm")
d.text((W//2, 263), "Gratis. Sem complicacoes.", font=font(17), fill=(255,210,180), anchor="mm")

# ── FEATURES ──
fy0   = HDR + 28
ROW_H = 82
PAD_X = 44

for i, ((title, desc), draw_icon) in enumerate(zip(features, icons)):
    fy = fy0 + i * ROW_H
    bg = ORANGE_LIGHT if i % 2 == 0 else WHITE
    rr(d, [PAD_X-8, fy-8, W-PAD_X+8, fy+ROW_H-14], r=14, fill=bg,
       outline=(255,195,158), ow=1)
    # icon circle
    ic_cx, ic_cy = PAD_X+24, fy+22
    rr(d, [PAD_X, fy, PAD_X+48, fy+48], r=12, fill=ORANGE)
    draw_icon(d, ic_cx, ic_cy, 28, WHITE)
    # text
    d.text((PAD_X+62, fy+2),  title, font=font(19, bold=True), fill=DARK)
    d.text((PAD_X+62, fy+27), desc,  font=font(15),            fill=GRAY)

# ── DIVIDER ──
DY = fy0 + len(features)*ROW_H + 12
d.rectangle([40, DY, W-40, DY+2], fill=(255,195,158))

# ── QR + CTA ──
BY = DY + 22
qr = make_qr()
QX = W - 165 - 44
QY = BY + 8
# QR frame
rr(d, [QX-14, QY-14, QX+165+14, QY+165+14], r=14, fill=WHITE,
   outline=ORANGE, ow=3)
img.paste(qr, (QX, QY))

# label under QR
d.text((QX+82, QY+175), "Aponta a camera", font=font(13), fill=GRAY, anchor="mm")
d.text((QX+82, QY+192), "para descarregar", font=font(13), fill=GRAY, anchor="mm")

# CTA left
d.text((PAD_X,       BY),    "Descarrega gratis!", font=font(26, bold=True), fill=ORANGE_DARK)
d.text((PAD_X,       BY+38), "Disponivel no",      font=font(20),           fill=DARK)
d.text((PAD_X,       BY+62), "Google Play",         font=font(20, bold=True),fill=DARK)
rr(d, [PAD_X, BY+96, PAD_X+182, BY+132], r=9, fill=DARK)
d.text((PAD_X+91, BY+114), "Google Play", font=font(17, bold=True), fill=WHITE, anchor="mm")

# stars
STAR_Y = BY + 142
for s in range(5):
    sx = PAD_X + s*22
    # draw 5-pointed star
    pts = []
    for k in range(10):
        ang = math.radians(-90 + k*36)
        r2  = 9 if k % 2 == 0 else 4
        pts.append((sx+10 + r2*math.cos(ang), STAR_Y+9 + r2*math.sin(ang)))
    d.polygon(pts, fill=ORANGE)
d.text((PAD_X+115, STAR_Y+9), "4.8 / 5", font=font(15), fill=GRAY, anchor="lm")

# ── FOOTER ──
FY = H - 54
d.rectangle([0, FY, W, H], fill=ORANGE)
d.text((W//2, FY+27),
       "www.petslife.pt   |   Google Play   |   Em breve no iOS",
       font=font(14), fill=WHITE, anchor="mm")

img.save(OUT, "PNG", dpi=(150,150))
print("OK:", OUT)
