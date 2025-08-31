// Проверка авторизации
if (!localStorage.getItem('isAuthenticated') && !window.location.pathname.includes('login.html')) {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
  const contentElement = document.getElementById('content');
  const headerTitle = document.getElementById('header-title');
  
  // Загружаем начальную страницу
  const initialPage = window.location.hash.substring(1) || 'home';
  loadPage(initialPage);

  // Обработчик кликов по меню
  document.querySelectorAll('.sidebar .menu-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      loadPage(pageId);
    });
  });

  // Функция загрузки страницы
  async function loadPage(pageId) {
    if (!PAGES_CONFIG[pageId]) {
      console.error(`Страница "${pageId}" не найдена`);
      return;
    }

    try {
      // 1. Обновляем заголовок
      headerTitle.textContent = PAGES_CONFIG[pageId].title;
      
      // 2. Загружаем контент
      const response = await fetch(PAGES_CONFIG[pageId].file);
      if (!response.ok) throw new Error('Страница не найдена');
      
      contentElement.innerHTML = await response.text();
      
      // 3. Обновляем URL
      window.history.pushState({ pageId }, '', `#${pageId}`);
      
      // 4. Обновляем активную кнопку
      updateActiveButton(pageId);
      
    } catch (error) {
      showError(error);
    }
  }

  function updateActiveButton(pageId) {
    document.querySelectorAll('.menu-button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.page === pageId) {
        btn.classList.add('active');
      }
    });
  }

  function showError(error) {
    contentElement.innerHTML = `
      <div class="error">
        <h2>Ошибка загрузки</h2>
        <p>${error.message}</p>
        <button onclick="loadPage('home')">На главную</button>
      </div>
    `;
  }

  // Обработка истории браузера
  window.addEventListener('popstate', function(e) {
    const pageId = e.state?.pageId || 'home';
    loadPage(pageId);
  });
});

document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('isAuthenticated');
  window.location.href = 'login.html';
});