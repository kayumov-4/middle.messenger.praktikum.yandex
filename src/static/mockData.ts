export const conversations: {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount?: number;
  active?: boolean;
}[] = [
  {
    id: 1,
    name: "Андрей",
    lastMessage: "Изображение",
    time: "10:49",
    avatar: "/user.png",
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Киноклуб",
    lastMessage: "Вы: стикер",
    time: "12:00",
    avatar: "/user.png",
  },
  {
    id: 3,
    name: "Илья",
    lastMessage: "Друзья, у меня для вас особенный выпуск новостей!...",
    time: "15:12",
    avatar: "/user.png",
    unreadCount: 4,
  },
  {
    id: 4,
    name: "Мухаммад",
    lastMessage: "Вы: Круто!",
    time: "Пт",
    avatar: "/user.png",
    active: true,
  },
  {
    id: 5,
    name: "тет-а-теты",
    lastMessage:
      "И Human Interface Guidelines и Material Design рекомендуют...",
    time: "Ср",
    avatar: "/user.png",
  },
  {
    id: 6,
    name: "1, 2, 3",
    lastMessage: "Миллионы россиян ежедневно проводят десятки часов свое...",
    time: "Пн",
    avatar: "/user.png",
  },
  {
    id: 7,
    name: "Design Destroyer",
    lastMessage: "В 2008 году художник Jon Rafman начал собирать...",
    time: "Пн",
    avatar: "/user.png",
  },
  {
    id: 8,
    name: "Day.",
    lastMessage:
      "Так увлёкся работой по курсу, что совсем забыл его анонсир...",
    time: "1 Мая 2020",
    avatar: "/user.png",
  },
  {
    id: 9,
    name: "Стас Рогозин",
    lastMessage: "Можно или сегодня или завтра",
    time: "12 Апр 2020",
    avatar: "/user.png",
  },
  {
    id: 10,
    name: "Андрей",
    lastMessage: "Изображение",
    time: "10:49",
    avatar: "/user.png",
    unreadCount: 2,
  },
  {
    id: 11,
    name: "Киноклуб",
    lastMessage: "Вы: стикер",
    time: "12:00",
    avatar: "/user.png",
  },
  {
    id: 12,
    name: "Илья",
    lastMessage: "Друзья, у меня для вас особенный выпуск новостей!...",
    time: "15:12",
    avatar: "/user.png",
    unreadCount: 4,
  },
  {
    id: 13,
    name: "Мухаммад",
    lastMessage: "Вы: Круто!",
    time: "Пт",
    avatar: "/user.png",
    active: false,
  },
  {
    id: 14,
    name: "тет-а-теты",
    lastMessage:
      "И Human Interface Guidelines и Material Design рекомендуют...",
    time: "Ср",
    avatar: "/user.png",
  },
  {
    id: 15,
    name: "1, 2, 3",
    lastMessage: "Миллионы россиян ежедневно проводят десятки часов свое...",
    time: "Пн",
    avatar: "/user.png",
  },
  {
    id: 16,
    name: "Design Destroyer",
    lastMessage: "В 2008 году художник Jon Rafman начал собирать...",
    time: "Пн",
    avatar: "/user.png",
  },
  {
    id: 17,
    name: "Day.",
    lastMessage:
      "Так увлёкся работой по курсу, что совсем забыл его анонсир...",
    time: "1 Мая 2020",
    avatar: "/user.png",
  },
  {
    id: 18,
    name: "Стас Рогозин",
    lastMessage: "Можно или сегодня или завтра",
    time: "12 Апр 2020",
    avatar: "/user.png",
  },
  {
    id: 19,
    name: "Андрей",
    lastMessage: "Изображение",
    time: "10:49",
    avatar: "/user.png",
    unreadCount: 2,
  },
  {
    id: 20,
    name: "Киноклуб",
    lastMessage: "Вы: стикер",
    time: "12:00",
    avatar: "/user.png",
  },
];
export const messages: {
  type: string;
  text: string;
  time: string;
  image?: string;
  imageDuration?: string;
}[] = [
  {
    type: "incoming",
    text: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.",
    time: "11:56",
  },
  {
    type: "incoming",
    text: "Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.",
    time: "11:56",
    image: "/message-image.png",
    imageDuration: "11:56",
  },
  {
    type: "outgoing",
    text: "Привет!",
    time: "12:00",
  },
  {
    type: "outgoing",
    text: "Круто!",
    time: "13:00",
  },
];
