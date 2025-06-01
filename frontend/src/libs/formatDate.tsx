export function formatDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput)

  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Moscow'
  }).format(date)

  // Добавляем "МСК" к отформатированной дате
  return `${formattedDate} МСК`
}
