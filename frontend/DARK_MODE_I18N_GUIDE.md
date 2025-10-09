# 🌍🌙 Dark Mode & Internationalization Guide

## ✨ Tính năng mới

Frontend IELTS Listening Platform đã được tích hợp:

1. **🌙 Dark Mode** - Chế độ sáng/tối với Tailwind CSS
2. **🌍 Multi-language** - Hỗ trợ Tiếng Việt & English (có thể mở rộng)

---

## 🎯 Demo nhanh

### Dark Mode Toggle
1. Click vào icon **🌙/☀️** trên Header
2. Theme sẽ tự động chuyển và lưu vào localStorage
3. Reload trang vẫn giữ nguyên theme

### Language Switcher
1. Click vào **🇻🇳 VI** hoặc **🇬🇧 EN** trên Header
2. Toàn bộ text sẽ chuyển ngôn ngữ ngay lập tức
3. Ngôn ngữ được lưu vào localStorage

---

## 📁 Cấu trúc Files

```
frontend/src/
├── translations/
│   ├── vi.js              # 🇻🇳 Vietnamese translations
│   ├── en.js              # 🇬🇧 English translations
│   └── index.js           # Export & config
│
├── store/
│   ├── languageStore.js   # Zustand store cho ngôn ngữ
│   └── themeStore.js      # Zustand store cho theme
│
├── hooks/
│   └── useTranslation.js  # Hook sử dụng translations
│
└── components/ui/
    ├── LanguageSwitcher.jsx  # Dropdown chọn ngôn ngữ
    └── ThemeSwitcher.jsx     # Button toggle dark/light
```

---

## 🚀 Sử dụng Translations

### Bước 1: Import hook

```jsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### Bước 2: Sử dụng translation keys

```jsx
// Simple text
<h1>{t('home.hero.title')}</h1>

// Nested object
<p>{t('auth.login.subtitle')}</p>

// Array translations
const features = t('home.features.items');
{features.map((feature, i) => (
  <div key={i}>
    <h3>{feature.title}</h3>
    <p>{feature.description}</p>
  </div>
))}
```

### Bước 3: Thêm translations mới

**vi.js**
```javascript
export const vi = {
  myFeature: {
    title: 'Tiêu đề tiếng Việt',
    description: 'Mô tả chi tiết',
    button: 'Nhấn vào đây',
  },
};
```

**en.js**
```javascript
export const en = {
  myFeature: {
    title: 'English Title',
    description: 'Detailed description',
    button: 'Click here',
  },
};
```

---

## 🌙 Sử dụng Dark Mode

### Tailwind Classes

```jsx
// Background colors
<div className="bg-white dark:bg-gray-900">

// Text colors
<h1 className="text-gray-900 dark:text-white">
<p className="text-gray-600 dark:text-gray-400">

// Borders
<div className="border-gray-200 dark:border-gray-700">

// Shadows
<div className="shadow-md dark:shadow-gray-900/50">

// Always add transition
<div className="bg-white dark:bg-gray-900 transition-colors">
```

### Theme Store API

```jsx
import { useThemeStore } from '@/store/themeStore';

export default function MyComponent() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
    </div>
  );
}
```

---

## 🎨 Color Guidelines

### Light Mode
```css
bg-white           → Background primary
bg-gray-50         → Background secondary
text-gray-900      → Text primary
text-gray-600      → Text secondary
border-gray-200    → Borders
```

### Dark Mode
```css
dark:bg-gray-900   → Background primary
dark:bg-gray-800   → Background secondary
dark:text-white    → Text primary
dark:text-gray-400 → Text secondary
dark:border-gray-700 → Borders
```

### Brand Colors (Work in both modes)
```css
bg-primary         → #003A70
bg-accent          → #FFD700
text-success       → #10B981
text-error         → #EF4444
```

---

## ✅ Checklist Update Component

Khi update component sang i18n + dark mode:

```jsx
// ❌ Before
export default function MyComponent() {
  return (
    <div className="bg-white">
      <h1 className="text-gray-900">Tiêu đề</h1>
      <p className="text-gray-600">Mô tả</p>
      <button className="bg-primary text-white">
        Nhấn vào
      </button>
    </div>
  );
}

// ✅ After
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <h1 className="text-gray-900 dark:text-white">
        {t('mySection.title')}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {t('mySection.description')}
      </p>
      <button className="bg-primary dark:bg-primary-600 text-white transition-colors">
        {t('mySection.button')}
      </button>
    </div>
  );
}
```

### Checklist:
- [x] Add `'use client'` nếu dùng hooks
- [x] Import `useTranslation`
- [x] Replace text với `t('key')`
- [x] Thêm `dark:*` classes cho tất cả colors
- [x] Add `transition-colors` cho smooth changes
- [x] Test cả 2 ngôn ngữ
- [x] Test cả light & dark mode

---

## 📖 Translation Keys có sẵn

### Common
```
common.home
common.courses
common.login
common.register
common.logout
common.profile
common.search
common.submit
common.cancel
common.save
common.back
common.next
```

### Auth
```
auth.login.title
auth.login.email
auth.login.password
auth.login.submit
auth.register.title
auth.register.fullName
auth.register.submit
```

### Courses
```
courses.title
courses.subtitle
courses.search
courses.level.beginner
courses.level.intermediate
courses.level.advanced
```

### Profile
```
profile.tabs.myCourses
profile.tabs.results
profile.tabs.payments
profile.tabs.settings
```

Xem full list trong `src/translations/vi.js` và `en.js`

---

## 🔧 Advanced Usage

### Dynamic translations với parameters

Nếu cần truyền params vào translation:

```javascript
// In translation file
const vi = {
  welcome: 'Xin chào {name}!',
};

// In component
const name = 'John';
const message = t('welcome').replace('{name}', name);
// → "Xin chào John!"
```

### Conditional translations

```jsx
const { t, language } = useTranslation();

const getMessage = (status) => {
  return t(`payment.status.${status}`);
};

<Badge>{getMessage('completed')}</Badge>
```

---

## 🎨 Best Practices

### 1. Organize translations by feature

```javascript
// Good
{
  courses: {
    title: '...',
    filter: {
      level: '...',
      search: '...',
    },
  },
}

// Bad
{
  coursesTitle: '...',
  coursesFilterLevel: '...',
}
```

### 2. Keep translations in sync

Luôn cập nhật cả 2 files (vi.js và en.js) cùng lúc

### 3. Use semantic dark mode colors

```jsx
// Good
<div className="bg-white dark:bg-gray-900">
<h1 className="text-gray-900 dark:text-white">

// Avoid
<div className="bg-white dark:bg-black">
<h1 className="text-black dark:text-gray-100">
```

### 4. Test accessibility

- Check contrast ratios trong dark mode
- Ensure text readable on all backgrounds
- Test với screen readers

---

## 🚀 Thêm ngôn ngữ mới (Ví dụ: Tiếng Nhật)

### 1. Tạo file translation

```javascript
// src/translations/ja.js
export const ja = {
  common: {
    home: 'ホーム',
    courses: 'コース',
    // ...
  },
  // Copy structure từ vi.js hoặc en.js
};
```

### 2. Update index.js

```javascript
// src/translations/index.js
import { vi } from './vi';
import { en } from './en';
import { ja } from './ja';

export const translations = {
  vi,
  en,
  ja, // ← Add here
};

export const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }, // ← Add here
];
```

### 3. Done! 🎉

LanguageSwitcher sẽ tự động hiển thị ngôn ngữ mới

---

## 📱 Components đã hỗ trợ Dark Mode & i18n

✅ **Header** - Fully translated + dark mode  
✅ **Footer** - Ready for translations  
✅ **404 Page** - Demo hoàn chỉnh  
✅ **UI Components** - All support dark mode  
⏳ **Other pages** - Cần update theo pattern

---

## 🐛 Troubleshooting

### Dark mode không hoạt động?
1. Check `tailwind.config.js` có `darkMode: 'class'`
2. Check HTML tag có class `dark` không (DevTools)
3. Clear localStorage và thử lại

### Translations không hiển thị?
1. Check key có đúng không: `t('common.home')`
2. Check file vi.js và en.js có key đó không
3. Check console có lỗi không

### Zustand persist không work?
1. Clear localStorage
2. Hard reload (Ctrl+Shift+R)
3. Check browser console

---

## 🎯 Next Steps

Để hoàn thiện toàn bộ app với i18n + dark mode:

1. Update từng page một theo pattern đã demo
2. Test kỹ cả 2 ngôn ngữ
3. Test kỹ dark mode trên tất cả pages
4. Có thể thêm ngôn ngữ thứ 3, 4...
5. Có thể thêm auto-detect system theme preference

Happy coding! 🚀🌍🌙


