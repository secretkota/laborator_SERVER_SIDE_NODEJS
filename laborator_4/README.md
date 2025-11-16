# Laborator 5: Errors logger


## Архитектура проекта

```
server/
├── controllers/        # Контроллеры для обработки запросов
├── routes/            # API маршруты
├── models/            # Модели данных
├── middleware/        # Express middleware
├── validators/        # Схемы валидации данных
├── errors/            # Пользовательские классы ошибок
├── utils/             # Вспомогательные утилиты
├── helpers/           # Помощники (создание таблиц БД)
├── logs/              # Директория для сохранения логов
└── index.js           # Точка входа приложения
```

---

## Обработка ошибок

### Система пользовательских ошибок

#### **AppError** (базовый класс)
```javascript
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}
```

Базовый класс всех ошибок с поддержкой кода состояния HTTP.

#### **NotFoundError**
```javascript
export class NotFoundError extends AppError {
    constructor(message = "Resourse not found") {
        super(message, 404)
    }
}
```

Используется когда ресурс не найден (HTTP 404).

#### **ConnectError** (DataBaseError)
```javascript
export class ConnectError extends AppError {
    constructor(message = 'Failed connect to database') {
        super(message, 503)
    }
}
```

Используется при ошибках подключения к БД (HTTP 503).

### Обработка асинхронных ошибок

**asyncWrapper** - middleware для обработки ошибок в асинхронных функциях:

```javascript
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

- Предотвращает необработанные+ ошибки
- Перехватывает исключения в асинхронных функциях
- Передает ошибки в глобальный errorHandler

### Централизованный обработчик ошибок

**errorHandler middleware** - единая точка обработки всех ошибок:

```javascript
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode
    const message = err.message

    logger.error(`${req.method} ${req.originalUrl} - ${message}`, { stack: err.stack })
   
    if (err.details) {
        return res.status(statusCode).json({
            status: "error",
            message,
            errors: err.details
        });
    }

    res.status(statusCode).json({
        error: statusCode,
        message
    });
}
```

**Функции:**
- Логирование всех ошибок с контекстом
- Унифицированный формат ответа
- Поддержка детальной информации об ошибках валидации

### Регистрация в Express

```javascript
// В index.js
app.use(errorHandler)  
```

---

## Валидация данных
### Схемы валидации

#### **Pet Validation Schema**
```javascript
import { body } from "express-validator";

export const petValidationSchema = [
    body("name")
        .trim()
        .notEmpty().withMessage("Поле name обязательно")
        .isLength({ min: 2, max: 50 }).withMessage("name должно быть от 2 до 50 символов"),

    body("type")
        .trim()
        .notEmpty().withMessage("Поле type обязательно"),

    body("age")
        .notEmpty().withMessage("Поле age обязательно")
        .isInt({ min: 0, max: 50 }).withMessage("age должен быть целым числом от 0 до 50"),

    body("desc")
        .trim()
        .isLength({ max: 200 }).withMessage("desc может содержать максимум 200 символов")
]
```

- `.trim()` - удаляет пробелы по краям
- `.notEmpty()` - проверяет на пустоту
- `.isLength()` - проверяет длину строки
- `.isInt()` - проверяет тип и диапазон чисел

#### **User Validation Schema**
```javascript
export const userValidationSchema = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("username need be at 3 characters max 20"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail()
]
```

**Особенности:**
- `.isEmail()` - валидация e-mail
- `.matches(/regex/)` - проверка по регулярному выражению
- Требование букв и цифр в пароле
- `.optional()` - поле может быть пропущено

### Middleware для проверки ошибок валидации

```javascript
export const validateData = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array(),
        })
    }
    next()
}
```

### Интеграция в маршруты

```javascript
// В petRoute.js
router.post('/', 
    petValidationSchema,      
    validateData,               
    petController.create        
)
```

**Поток обработки:**
1. Приходит запрос
2. express-validator проверяет данные
3. validateData проверяет результаты
4. Если ошибок нет - передает req дальше
5. Если ошибки - возвращает ответ 400

### Формат ошибки валидации

```json
{
    "message": "Validation failed",
    "errors": [
        {
            "value": "a",
            "msg": "name должно быть от 2 до 50 символов",
            "param": "name",
            "location": "body"
        }
    ]
}
```

---

## Логирование

### Конфигурация Winston

`winston` - профессиональная библиотека для логирования:

```javascript
import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, align } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }),    
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/action.log', level: 'http' }),
  ],
})
```

### места сохранения логов

| Транспорт | Назначение | Уровень |
|-----------|-----------|---------|
| **Console** | Вывод в консоль разработчика | all |
| **error.log** | Только ошибки | error |
| **combined.log** | Все логи | all |
| **action.log** | HTTP запросы | http |

### Уровни логирования

```
error   - ошибки приложения
warn    - предупреждения
info    - информационные сообщения
http    - HTTP запросы
debug   - отладочная информация
```

### Request Logger Middleware

```javascript
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start
    const { method, originalUrl } = req
    const { statusCode } = res

    if (statusCode < 400) {
      logger.http(`${method} ${originalUrl} ${statusCode} - ${duration}ms`)
    }
  })

  next()
}
```

**Логирует:**
- HTTP метод (GET, POST и т.д.)
- URL запроса
- Код ответа
- Время выполнения

### Error Handler Логирование

```javascript
logger.error(`${req.method} ${req.originalUrl} - ${message}`, { stack: err.stack })
```

```
2025-11-16 14:24:10 error: POST /pet - Поле name обязательно
```

###  Как логирование работает в приложении

```javascript
// В index.js
app.use(requestLogger)  // Логирует успешные запросы

// В errorHandler
logger.error(`...`)     // Логирует ошибки
```

---

# Полный поток обработки запроса

```
1. Запрос поступает → requestLogger (логирует начало)
                    ↓
2. Валидация данных → express-validator + validateData
                    ↓
3. Обработка       → asyncWrapper обвязывает контроллер
                    ↓
4. Успех           → Ответ клиенту + логирование
                    ↓
5. Ошибка          → asyncWrapper ловит → errorHandler
                    ↓
6. errorHandler     → Логирует ошибку + унифицированный ответ
```



## Контрольные вопросы и ответы

### **Какие преимущества централизованной обработки ошибок в Express?**

**Ответ:**

Централизованная обработка ошибок предоставляет следующие преимущества:

- **Единая точка контроля**
- **Консистентный формат ответов**
- **Логирование**
- **Масштабируемость**
- **Безопасность**
- **Обработка необработанных ошибок**

---

### **Какие категории логов вы решили вести в системе и чем обусловлен ваш выбор?**

**Ответ:**

В приложении используются следующие категории логов:

**Категория 1: HTTP логи (уровень `http`)**
- **Что логируется:** Все успешные HTTP запросы
- **Почему?:**
  - Помогает отследить рабочий процесс приложения
  - Выявить медленные эндпоинты (по времени выполнения)

**Категория 2: ERROR логи (уровень `error`)**
- **Что логируется:** Все ошибки приложения
- **Почему?:**
  - Критично для диагностики проблем
  - Сохраняется в отдельный файл error.log
  - Помогает найти баги в production

**Категория 3: INFO логи (уровень `info`)**
- **Что логируется:** Информационные события (старт сервера и т.д.)
- **Почему?:**
  - Помогает отследить жизненный цикл приложения
  - Подтверждение важных операций

**Места хранения:**
```
error.log    → Только ошибки (для быстрого поиска проблем)
combined.log → Все логи (полная история)
action.log   → HTTP запросы (анализ использования)
Console      → Все логи (разработка)
```
### **Какие существуют подходы к валидации данных в Express и какие из них вы использовали?**

**Существующие подходы к валидации:**

| Подход | Описание | 
|--------|---------|
| **1. express-validator** | Декларативная валидация |  
| **2. Joi** | Отдельная библиотека для схем | 
| **3. Yup** | Популярный валидатор | 
| **4. Ручная валидация** | Написать свою логику |

**Почему express-validator был выбран:**
- Удобнее, чем Joi (не нужны доп. middleware)
- Безопаснее, чем ручная валидация
- Встроенная санитизация
- Лучшая интеграция с Express

---
