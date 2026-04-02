import React from 'react';

export const PrivacyPolicyContent: React.FC = () => (
  <div className="space-y-4 text-sm leading-relaxed">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Сбор информации</h3>
    <p>
      Мы собираем информацию, которую вы предоставляете непосредственно при использовании NeuroGen Studio, 
      включая API ключи, которые хранятся локально в вашем браузере.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">2. Использование информации</h3>
    <p>
      Собранные данные используются исключительно для функционирования приложения:
    </p>
    <ul className="list-disc list-inside space-y-1 ml-4">
      <li>Генерация контента через AI провайдеров</li>
      <li>Сохранение истории проектов локально</li>
      <li>Аутентификация пользователя</li>
    </ul>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">3. Хранение данных</h3>
    <p>
      Все данные хранятся локально в браузере пользователя (localStorage). 
      Мы не передаём и не храним ваши данные на внешних серверах, за исключением запросов к AI провайдерам.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">4. Безопасность</h3>
    <p>
      Мы принимаем разумные меры для защиты вашей информации, но помните, что ни один метод 
      передачи данных через интернет не является полностью безопасным.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">5. Права пользователя</h3>
    <p>
      Вы имеете право:
    </p>
    <ul className="list-disc list-inside space-y-1 ml-4">
      <li>Доступа к вашим данным</li>
      <li>Исправления неточных данных</li>
      <li>Удаления ваших данных</li>
      <li>Экспорта ваших данных</li>
    </ul>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">6. Контакты</h3>
    <p>
      По вопросам конфиденциальности обращайтесь: support@neurogen.studio
    </p>
  </div>
);

export const TermsOfUseContent: React.FC = () => (
  <div className="space-y-4 text-sm leading-relaxed">
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Принятие условий</h3>
    <p>
      Используя NeuroGen Studio, вы соглашаетесь с настоящими Условиями использования. 
      Если вы не согласны, пожалуйста, не используйте приложение.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">2. Описание сервиса</h3>
    <p>
      NeuroGen Studio предоставляет инструменты для создания, редизайна и деплоя веб-сайтов 
      с использованием искусственного интеллекта.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">3. Правила использования</h3>
    <p>
      Вы соглашаетесь не использовать сервис для:
    </p>
    <ul className="list-disc list-inside space-y-1 ml-4">
      <li>Генерации незаконного или вредоносного контента</li>
      <li>Нарушения прав интеллектуальной собственности</li>
      <li>Спама или мошенничества</li>
      <li>Обхода ограничений сервиса</li>
    </ul>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">4. Интеллектуальная собственность</h3>
    <p>
      Все права на приложение принадлежат NeuroGen. Контент, созданный пользователями, 
      принадлежит самим пользователям.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">5. Отказ от ответственности</h3>
    <p>
      Сервис предоставляется "как есть". Мы не гарантируем бесперебойную работу и не несём 
      ответственности за убытки, связанные с использованием приложения.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">6. Изменения условий</h3>
    <p>
      Мы оставляем за собой право изменять данные условия в любое время. 
      Продолжение использования сервиса означает принятие новых условий.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">7. Прекращение доступа</h3>
    <p>
      Мы оставляем за собой право приостановить или прекратить доступ к сервису 
      в случае нарушения данных условий.
    </p>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6">8. Контакты</h3>
    <p>
      По вопросам условий использования: legal@neurogen.studio
    </p>
  </div>
);
