"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="fallback-page"><h1>Не получилось загрузить страницу</h1><p>Сервис временно недоступен. Проверь подключение и настройки Supabase.</p><button className="primary-button" onClick={reset}>Попробовать снова</button></main>;
}
