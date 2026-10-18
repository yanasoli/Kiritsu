import Link from "next/link";
export default function NotFound() {
  return <main className="fallback-page"><h1>Здесь пока нет страницы</h1><p>Вернись к началу своего пути.</p><Link className="primary-button" href="/">На главную</Link></main>;
}
