"use strict";

// ДЗ 3. Интерактивная коллекция.
// Выполняйте практические этапы из docs/HOME_WORK.md по порядку.
// Не пытайтесь написать весь файл за один раз: после каждого этапа проверяйте
// связанный сценарий в браузере и фиксируйте рабочее состояние коммитом.

// Этап 3. Найдите карточки и элементы панели подробностей.
// Реализуйте одну общую функцию выбора карточки.

// Этап 4. Найдите кнопки фильтров.
// Показывайте подходящие карточки, обновляйте активную кнопку и счетчик.
// Учтите случай, когда новый фильтр скрывает выбранную карточку.

// Этап 5. Реализуйте случайный выбор среди видимых карточек.
// Затем реализуйте полный сброс интерфейса.

// Этап 6. Запускайте подготовленную CSS-анимацию через класс.
// Не дублируйте оформление в script.js.
// Находим элементы на странице

const cards = document.querySelectorAll(".collection-card");
const panel = document.querySelector("#details-panel");
const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");

// Общая функция выбора карточки
function selectCard(card) {
  // 1. Снимаем выделение со всех карточек
  cards.forEach(function (item) {
    item.classList.remove("collection-card--selected");
    item.setAttribute("aria-pressed", "false");
  });

  // 2. Выделяем выбранную
  card.classList.add("collection-card--selected");
  card.setAttribute("aria-pressed", "true");

  // 3. Показываем её данные в панели
  detailsTitle.textContent = card.dataset.title;
  detailsDescription.textContent = card.dataset.description;

    // 4. Запускаем анимацию панели
  panel.classList.remove("details-panel--pulse");
  void panel.offsetWidth;
  panel.classList.add("details-panel--pulse");
}

// Вешаем клик на каждую карточку
cards.forEach(function (card) {
  card.addEventListener("click", function () {
    selectCard(card);
  });
});

// Этап 3. Фильтры
const filterButtons = document.querySelectorAll(".filter-button");
const visibleCount = document.querySelector("#visible-count");

// Запоминаем исходный текст панели, чтобы потом к нему вернуться
const initialTitle = detailsTitle.textContent;
const initialDescription = detailsDescription.textContent;

// Снять выбор и вернуть панель в начальное состояние
function clearSelection() {
  cards.forEach(function (item) {
    item.classList.remove("collection-card--selected");
    item.setAttribute("aria-pressed", "false");
  });
  detailsTitle.textContent = initialTitle;
  detailsDescription.textContent = initialDescription;
}

// Получить только видимые карточки
function getVisibleCards() {
  return Array.from(cards).filter(function (card) {
    return !card.classList.contains("collection-card--hidden");
  });
}

// Применить фильтр
function applyFilter(filter) {
  // 1. Активной делаем только нажатую кнопку
  filterButtons.forEach(function (button) {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("filter-button--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  // 2. Прячем неподходящие карточки
  cards.forEach(function (card) {
    const isVisible = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("collection-card--hidden", !isVisible);
  });

  // 3. Если выбранная карточка спряталась, сбрасываем выбор
  const selected = document.querySelector(".collection-card--selected");
  if (selected && selected.classList.contains("collection-card--hidden")) {
    clearSelection();
  }

  // 4. Обновляем счётчик
  visibleCount.textContent = getVisibleCards().length;
}

// Клик по кнопке фильтра
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    applyFilter(button.dataset.filter);
  });
});
// Этап 4. Случайный выбор
const randomButton = document.querySelector("#random-button");

randomButton.addEventListener("click", function () {
  let candidates = getVisibleCards();
  const selected = document.querySelector(".collection-card--selected");

  // Если есть из чего выбирать, убираем текущую карточку
  if (candidates.length > 1) {
    candidates = candidates.filter(function (card) {
      return card !== selected;
    });
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  selectCard(candidates[randomIndex]);
});
// Этап 5. Полный сброс
const resetButton = document.querySelector("#reset-button");

resetButton.addEventListener("click", function () {
  applyFilter("all");
  clearSelection();
});