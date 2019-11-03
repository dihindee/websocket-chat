# websocket-chat
При открытии страницы пользователю необходимо ввести никнейм( при открытии канала чата минуя главную страницу - аналогично)
Список участников чата обновляется в реальном времени в списке справа, а также выводятся сообщения о чьем-либо входе и выходе.
В каждом сообщении указан автор и время создания.
Все сообщения сохраняются, поэтому пользователь может прочитать все сообщения с момента запуска сервера независимо от времени его входа в чат.

Бэкенд: Node.js с модулем express
Фронтенд: js + jQuery
Для чата используется socket.io
Http-запросы обрабатываются на порте 3000, WebSocket - 3030
