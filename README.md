# ZulupoolFrontend

## Installation

### Получить исходный код

```bash
git clone https://github.com/pr1kAlist/zulupool-frontend.git
cd zulupool-frontend
```

### Загрузка зависимостей

```bash
npm i
```

### Сборка

Для сборки в темных тонах:

```bash
npx ng build --configuration=production,theme-dark --build-optimizer
```

Для сборки в светлых тонах:

```bash
npx ng build --configuration=production,theme-light --build-optimizer
```

### Скопировать скомпилированный код

```bash
cp -r dist/zulupool-frontend/* target_path
```
