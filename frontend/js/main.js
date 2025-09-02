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
      
      // 3. Если это главная страница - загружаем задачи из БД
      if (pageId === 'home') {
        loadTasksFromBackend();
      }

      // 4. Обновляем URL
      window.history.pushState({ pageId }, '', `#${pageId}`);
      
      // 5. Обновляем активную кнопку
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

// Обработчик выхода
document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('isAuthenticated');
  window.location.href = 'login.html';
});

// ========== ДОБАВЛЯЕМ НОВЫЕ ФУНКЦИИ ЗДЕСЬ ==========

// Функция загрузки задач с сервера
async function loadTasksFromBackend() {
  try {
    console.log('Загрузка данных с сервера...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // УКАЖИТЕ ПРАВИЛЬНЫЙ URL ДЛЯ ВАШЕГО БЭКЕНДА!
    // Если бэкенд на том же компьютере, но другом порту:
    //const API_URL = 'http://localhost:3001/api/debtors';
    // Если бэкенд на другом IP (например, на VM):
    //const API_URL = 'http://192.168.0.17:3001/api/debtors';
    const API_URL = 'http://127.0.0.1:3001/api/debtors';

    console.log('Пытаюсь подключиться к:', API_URL);
    
    const response = await fetch(API_URL, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
     console.log('Статус ответа:', response.status);
    console.log('Статус ответа OK:', response.ok);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
    }
    
    const debtors = await response.json();
    console.log('Получены данные:', debtors);
    renderTasksTable(debtors);
    
  } catch (error) {
    //console.error('Ошибка загрузки данных:', error);
    console.error('Полная ошибка:', error);
    console.error('Тип ошибки:', error.name);
    console.error('Сообщение ошибки:', error.message);
    
    const tbody = document.querySelector('.table-task tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="color: red;">Ошибка загрузки данных: ${error.message}</td></tr>`;
    }
  }
}

// Функция отрисовки таблицы
function renderTasksTable(debtors) {
  const tbody = document.querySelector('.table-task tbody');
  if (!tbody) {
    console.error('Таблица не найдена');
    return;
  }
  
  tbody.innerHTML = '';
  
  debtors.forEach(debtor => {
    const row = `
      <tr>
        <td>${debtor.last_name} ${debtor.first_name} ${debtor.patronymic || ''}</td>
        <td>${debtor.case_id || 'Не указан'}</td>
        <td>Проверить документы</td>
        <td>Высокая</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}



/* // Проверка авторизации
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
}); */