# Плагин для квиза JustQuiz

> Версия / Version 1.0.0 <br>
> Автор / Author [putn1k](https://github.com/putn1k/) <br>
> Используется / Use Gulp 4 <br>
> Используется / Use Node 16.x <br>
> Используется / Use npm 8.x <br>

Простой и лёгкий плагин для квиза

+ __Никаких зависимостей__.  Библиотека написана на чистом JavaScript, для работы не требуются иные библиотеки.
+ __Настройка с помощью CSS__. Вы можете легко менять внешний вид, расположение с помощью CSS.
+ __Простота и функциональность__. Вы можете легко и быстро подключить и использовать библиотеку, которая реализует стандартный функционал квиза

1. Скачайте js-библиотеку из папки __dist__
2. Подключите эти файлы к проекту
3. Поместите в ваш html-документ следующую разметку:
```html
  <form class="just-quiz">
    <div class="just-quiz__steps"></div>

    <div class="just-quiz__screen" data-quiz-screen></div>
    <div class="just-quiz__screen" data-quiz-screen></div>
    <div class="just-quiz__screen" data-quiz-screen></div>
    <div class="just-quiz__screen" data-quiz-screen></div>

    <div class="just-quiz__controls"></div>
  </form>
```

Обертка для нумирации шагов (необязательный элемент)
```html
  <div class="just-quiz__steps"></div>
```
Содержимое после рендера
```html
<span data-quiz-step="current">1</span> / <span data-quiz-step="all">4</span>
```

Обертка для "экрана" квиза
```html
  <div class="just-quiz__screen" data-quiz-screen></div>
```
Содержимое может быть любым. Минимальное количество экранов - 2.

Обертка для кнопок управления
```html
  <div class="just-quiz__controls"></div>
```
Содержимое после рендера
```html
<button class="just-quiz__stepper just-quiz__stepper--prev" type="button" data-quiz-stepper="prev">Назад</button>
<button class="just-quiz__stepper just-quiz__stepper--next" type="button" data-quiz-stepper="next">Далее</button>
<button class="just-quiz__stepper just-quiz__stepper--submit" type="submit">Отправить</button>
```

4. Разместите следующий JS-код для подключения квиза:
```javascript
new JustQuiz(selector, options);
```
`selector` - это селектор для подключения разметки. Основан на querySelector.<br>
`options` - опции для настройки квиза

Доступны следующие опции:<br>
1. `fadeTime` | `Number` | Время появления "экрана квиза" в милисекундах. По умочанию 300мс.
2. `stepperBtnClass` | `String` | Кастомный класс для кнопок управления квизом. Основан на classList.

[Как работать со сборщиком](Guide.md)