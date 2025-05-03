export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Заголовлок и описание */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Принцип работы</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Сервис проводит анализ сайтов госзакупок, 
            где компании участвуют в тендерах. Если компания выиграла контракт, но не подписала его вовремя или нарушила условия, 
            ей может грозить суд. Сервис сохраняет информацию о таких тендерах и клиентах, чтобы предлагать им свои юридические услуги.</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>
        
        {/* Линия */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Шаг 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <div className="text-blue-500 mb-4 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">1</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Настройка фильтров</h3>
            <p className="text-gray-600 text-center">Пользователь выставляет необходимые критерии для тендеров.</p>
          </div>
          
          {/* Шаг 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <div className="text-blue-500 mb-4 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">2</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Анализ сайтов госзакупок</h3>
            <p className="text-gray-600 text-center">Языковая модель анализирует данные и собирает необходимые на сайтах государственных закупок согласно выставленным критериям.</p>
          </div>

          {/* Шаг 3 */}  
          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <div className="text-blue-500 mb-4 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">3</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Формирование таблицы</h3>
            <p className="text-gray-600 text-center">Сервис приводит проанализированные данные в табличный вид и публикует их на странице.</p>
          </div>

          {/* Шаг 4 */}  
          <div className="bg-white p-6 rounded-xl shadow-md card-hover">
            <div className="text-blue-500 mb-4 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">4</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Применение данных</h3>
            <p className="text-gray-600 text-center">Пользователь может ознакомиться с полученными данными и предложить ответственным за тендеры лицам юридические услуги.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
