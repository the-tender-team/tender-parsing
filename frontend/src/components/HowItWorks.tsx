const steps = [
  {
    step: 1,
    title: 'Настройка фильтров',
    description: 'Пользователь выставляет необходимые критерии для тендеров.'
  },
  {
    step: 2,
    title: 'Анализ сайтов госзакупок',
    description: 'Языковая модель анализирует данные и собирает необходимые на сайтах государственных закупок согласно выставленным критериям.'
  },
  {
    step: 3,
    title: 'Формирование таблицы',
    description: 'Сервис приводит проанализированные данные в табличный вид и публикует их на странице.'
  },
  {
    step: 4,
    title: 'Применение данных',
    description: 'Пользователь изучает полученные данные и предлагает ответственным за тендеры лицам свои юридические услуги.'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Заголовок и описание */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Принцип работы</h2>
          <p className="text-xl text-gray-600 max-auto mx-auto">
            Сервис проводит анализ сайтов государственных закупок, где компании участвуют в тендерах. <br></br>
            Если компания выиграла контракт, но не подписала его вовремя или нарушила условия, ей может грозить суд. <br></br>
            Платформа сохраняет информацию о таких тендерах и клиентах, чтобы пользователь мог предложить им свои юридические услуги.
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {/* Список шагов */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-white p-6 rounded-xl shadow-md card-hover"
            >
              <div className="text-blue-500 mb-4 flex items-center justify-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold">{step}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">{title}</h3>
              <p className="text-gray-600 text-center">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
