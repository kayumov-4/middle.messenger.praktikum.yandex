### Middle Frontend Project

Домен из Netlify
https://middle-frontend.netlify.app/

UI template
https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&p=f&t=ACEhNHAUSD6NnzsK-0

Команды для сборки
nvm use 24
npm i
npm run dev

### Свёрстанные страницы

Navigations page: http://localhost:3000/
Login page: http://localhost:3000/login
Registration page: http://localhost:3000/register
Chat page: http://localhost:3000/messenger
404 Not Found page: http://localhost:3000/404
500 Error page: http://localhost:3000/500

### Спринт 2

1. Реализован EventBus для коммуникации между компонентами.
2. Создан абстрактный класс Block, который инкапсулирует работу с DOM, событиями и состоянием компонентов.
3. Реализован Proxy для отслеживания изменений и обновления компонентов.
4. Добавлены проверки на страницы (страницы и маршруты).

### Спринт 3

1. Добавлены новые UI-компоненты: Input, Button, Modal.
2. Реализована система children для вложенных компонентов.
3. Создана модальная логика для чата (ChatAddUserModal) с:
4. Поиском пользователей по логину через API.
5. Отображением найденных пользователей в списке.
6. Добавлением выбранного пользователя в чат.
7. Улучшена работа с событиями внутри компонентов (клики по кнопкам и спискам).
8. Добавлена проверка валидности данных перед отправкой на API.
9. Реализован динамический рендеринг children в DOM через replaceWith.
