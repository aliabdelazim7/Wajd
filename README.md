# وجد للتسويق — Wajd Marketing Agency

موقع بورتفوليو احترافي لوكالة وجد للتسويق الرقمي، مبني بتصميم فاخر داكن (أسود وذهبي) مع دعم كامل للغة العربية RTL.

---

## المحتوى

- **الموقع الأمامي** — React + Vite + Tailwind CSS + Framer Motion
- **خادم API** — Express 5 + PostgreSQL + Drizzle ORM
- **لوحة تحكم** — لإدارة الطلبات والبورتفوليو

---

## متطلبات التشغيل

| الأداة | الإصدار |
|--------|---------|
| Node.js | 20+ |
| pnpm | 9+ |
| PostgreSQL | 14+ |

---

## الإعداد السريع

### 1. تثبيت pnpm

```bash
npm install -g pnpm
```

### 2. تثبيت المكتبات

```bash
pnpm install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
# عدّل القيم في ملف .env
```

### 4. إنشاء قاعدة البيانات

```bash
pnpm --filter @workspace/db run push
```

### 5. تشغيل بيئة التطوير

```bash
# تشغيل API server (في نافذة terminal)
cd artifacts/api-server
PORT=8080 pnpm run dev

# تشغيل الموقع الأمامي (في نافذة terminal أخرى)
cd artifacts/wajd-agency
PORT=3000 BASE_PATH=/ pnpm run dev
```

الموقع يعمل على: `http://localhost:3000`
الـ API يعمل على: `http://localhost:8080`

---

## البناء للإنتاج

```bash
# بناء الموقع الأمامي
cd artifacts/wajd-agency
PORT=3000 BASE_PATH=/ pnpm run build
# الملفات في: artifacts/wajd-agency/dist/public/

# بناء API server
cd artifacts/api-server
pnpm run build
# الملفات في: artifacts/api-server/dist/
```

---

## النشر على Hostinger

### الموقع الأمامي (Static Hosting)

1. ابنِ المشروع: `PORT=3000 BASE_PATH=/ pnpm --filter @workspace/wajd-agency run build`
2. ارفع محتوى مجلد `artifacts/wajd-agency/dist/public/` على Hostinger
3. فعّل SPA Redirect: أضف قاعدة إعادة توجيه تحول كل المسارات لـ `index.html`

### خادم API (VPS / Node.js Hosting)

1. انسخ مجلد `artifacts/api-server/` على الخادم
2. شغّل:

```bash
pnpm install --prod
pnpm run build
node dist/index.mjs
```

3. استخدم PM2 للاستمرارية:

```bash
pm2 start dist/index.mjs --name wajd-api
pm2 save
pm2 startup
```

### متغيرات البيئة على الخادم

```env
DATABASE_URL=postgresql://user:password@host:5432/wajd_db
PORT=8080
NODE_ENV=production
SESSION_SECRET=your_secret_here
```

---

## هيكل المشروع

```
wajd-agency/
├── artifacts/
│   ├── wajd-agency/          # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/   # Hero, Portfolio, Services, Footer...
│   │   │   ├── pages/        # Home, Admin
│   │   │   └── main.tsx
│   │   └── index.html
│   └── api-server/           # Express API
│       ├── src/
│       │   ├── routes/       # leads, portfolio, upload, health
│       │   └── app.ts
│       └── uploads/          # صور البورتفوليو المرفوعة
├── lib/
│   ├── db/                   # Drizzle ORM schema + migrations
│   └── api-client-react/     # React Query hooks
└── pnpm-workspace.yaml
```

---

## API Endpoints

| Method | Path | الوصف |
|--------|------|-------|
| GET | /api/leads | قائمة الطلبات |
| POST | /api/leads/submit | إرسال طلب جديد |
| PATCH | /api/leads/:id/status | تحديث حالة الطلب |
| GET | /api/portfolio | قائمة البورتفوليو |
| POST | /api/portfolio | إضافة كارت بورتفوليو |
| DELETE | /api/portfolio/:id | حذف كارت |
| POST | /api/upload/image | رفع صورة |
| GET | /api/uploads/:filename | عرض صورة |

---

## لوحة التحكم

الرابط: `/admin`

- **نظرة عامة** — إحصائيات سريعة
- **الطلبات** — إدارة طلبات العملاء مع تغيير الحالة
- **البورتفوليو** — إضافة وحذف كروت البورتفوليو مع رفع الصور

---

## التواصل

- Instagram/TikTok/Twitter/Snapchat: [@wajdagency](https://instagram.com/wajdagency)
- Email: wajd.marketing@gmail.com
- Facebook: [Wajd Agency](https://facebook.com/profile.php?id=61562980695038)
