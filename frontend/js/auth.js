document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('errorMessage');
    
    // Очистка предыдущих ошибок
    errorElement.textContent = '';
    
    // Простая валидация (в реальном проекте нужна проверка на сервере)
    if (!username || !password) {
        errorElement.textContent = 'Все поля обязательны для заполнения';
        return;
    }
    
    // Пример проверки (в реальном проекте - AJAX-запрос к серверу)
    if (username === 'admin' && password === 'admin123') {
        // Сохраняем статус авторизации
        localStorage.setItem('isAuthenticated', 'true');
        
        // Перенаправляем на главную
        window.location.href = 'home.html';
    } else {
        errorElement.textContent = 'Неверный логин или пароль';
    }
});

// Проверка авторизации при загрузке (если нужно)
if (localStorage.getItem('isAuthenticated')) {
    window.location.href = 'home.html';
}