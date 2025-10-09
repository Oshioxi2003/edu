# 🌍 Hướng dẫn Internationalization (i18n) & Dark Mode

Frontend IELTS Listening Platform đã được tích hợp sẵn hệ thống đa ngôn ngữ (Tiếng Việt & English) và Dark Mode.

## 📚 Cấu trúc

```
frontend/src/
├── translations/
│   ├── vi.js          # Bản dịch tiếng Việt
│   ├── en.js          # Bản dịch tiếng Anh
│   └── index.js       # Export và config
├── store/
│   ├── languageStore.js   # Zustand store cho ngôn ngữ
│   └── themeStore.js      # Zustand store cho theme
├── hooks/
│   └── useTranslation.js  # Hook để sử dụng translations
└── components/ui/
    ├── LanguageSwitcher.jsx
    └── ThemeSwitcher.jsx
```

## 🎯 Cách sử dụng Translations

### 1. Import hook trong component

```jsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.description')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

### 2. Thêm translations mới

**File: `src/translations/vi.js`**
```javascript
export const vi = {
  myNewSection: {
    title: 'Tiêu đề mới',
    description: 'Mô tả bằng tiếng Việt',
  },
};
```

**File: `src/translations/en.js`**
```javascript
export const en = {
  myNewSection: {
    title: 'New Title',
    description: 'Description in English',
  },
};
```

### 3. Sử dụng trong component

```jsx
const { t } = useTranslation();

<h1>{t('myNewSection.title')}</h1>
<p>{t('myNewSection.description')}</p>
```

### 4. Xử lý arrays

Sử dụng `tArray` cho translations dạng array:

```jsx
const { t, tArray } = useTranslation();

const features = tArray('home.features.items');

{features.map((feature, index) => (
  <div key={index}>
    <h3>{feature.title}</h3>
    <p>{feature.description}</p>
  </div>
))}
```

## 🌓 Dark Mode

### 1. Cách thức hoạt động

Dark mode được quản lý bởi Tailwind CSS với `class` strategy:
- Class `dark` được thêm vào `<html>` tag
- Zustand store quản lý state và persist vào localStorage
- ThemeSwitcher component để user toggle

### 2. Sử dụng Dark Mode trong styling

```jsx
// Tailwind classes hỗ trợ dark mode
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### 3. Access theme trong code

```jsx
import { useThemeStore } from '@/store/themeStore';

export default function MyComponent() {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Force Dark</button>
    </div>
  );
}
```

## 🎨 Color System cho Dark Mode

Tailwind config đã setup sẵn colors hỗ trợ dark mode:

```javascript
// Recommended color usage:
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-800
bg-gray-100 dark:bg-gray-700

text-gray-900 dark:text-white
text-gray-700 dark:text-gray-300
text-gray-600 dark:text-gray-400

border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600
```

## 📋 Checklist Update Pages

Khi update các pages hiện tại sang i18n:

- [ ] Import `useTranslation` hook
- [ ] Replace hardcoded text với `t('key')`
- [ ] Thêm dark mode classes (`dark:bg-*`, `dark:text-*`)
- [ ] Thêm `transition-colors` cho smooth transitions
- [ ] Test cả 2 ngôn ngữ
- [ ] Test cả light và dark mode

## 🔧 Ví dụ hoàn chỉnh

```jsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function ExamplePage() {
  const { t, language } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('courses.title')}
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {t('courses.subtitle')}
        </p>
        
        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-white dark:bg-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('courses.level.beginner')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Description here
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/courses">
            <Button variant="primary">
              {t('common.viewMore')}
            </Button>
          </Link>
        </div>
        
        {/* Current language indicator */}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
          Current language: {language}
        </p>
      </div>
    </div>
  );
}
```

## 🚀 Quick Start

### Thêm ngôn ngữ mới

1. Tạo file mới: `src/translations/ja.js` (ví dụ tiếng Nhật)
2. Export translations:
```javascript
export const ja = {
  common: {
    home: 'ホーム',
    // ...
  },
};
```
3. Update `src/translations/index.js`:
```javascript
import { ja } from './ja';

export const translations = {
  vi,
  en,
  ja, // Thêm
};

export const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }, // Thêm
];
```

### Update UI Components

**Button Component** đã hỗ trợ dark mode sẵn, nhưng nếu cần customize:

```jsx
// Before
<button className="bg-primary text-white">
  Click me
</button>

// After (with dark mode)
<button className="bg-primary dark:bg-primary-600 text-white transition-colors">
  {t('common.submit')}
</button>
```

## 📝 Best Practices

1. **Always use `t()` function** - Không hardcode text
2. **Group related translations** - Organize theo modules
3. **Use descriptive keys** - `auth.login.title` thay vì `t1`
4. **Test both languages** - Đảm bảo layout không bị vỡ
5. **Add dark mode from start** - Thêm `dark:*` classes ngay từ đầu
6. **Use transition-colors** - Smooth animations khi chuyển theme
7. **Consistent naming** - Follow naming convention hiện tại

## 🎯 Pages cần update

Các pages sau đã có sẵn translations và dark mode:
- ✅ Header (đã update)
- ✅ 404 Page (đã update)
- ⏳ Home page (cần update)
- ⏳ Courses page (cần update)
- ⏳ Course Detail (cần update)
- ⏳ Auth pages (cần update)
- ⏳ Profile (cần update)
- ⏳ Payment (cần update)
- ⏳ Unit Learning (cần update)
- ⏳ Results (cần update)

Bạn có thể update các pages theo pattern đã hướng dẫn ở trên!

## 💡 Tips

- Sử dụng VS Code extension "i18n Ally" để dễ dàng manage translations
- Sử dụng "Tailwind CSS IntelliSense" để autocomplete dark mode classes
- Test trên nhiều màn hình khác nhau
- Kiểm tra contrast ratio cho accessibility

Happy coding! 🎉


