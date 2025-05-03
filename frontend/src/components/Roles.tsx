export default function Roles() {
  return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Роли пользователей</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Представление и сравнение перечней возможностей</p>
                <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">

                <div className="role-card bg-white rounded-xl shadow-md p-6 border-t-blue-500">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <i className="fas fa-chart-pie text-blue-500 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Посетитель</h3>
                    </div>
                    <p className="text-gray-600 mb-6">Ознакомление с результатами сканирования и запрос роль администратора в личном кабинете.</p>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span className="text-gray-700">Просмотр итоговой таблицы</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-red-400 mr-2"></i>
                            <span className="text-gray-700">Настройка фильтров и запуск сканирования</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-red-400 mr-2"></i>
                            <span className="text-gray-700">Назначение администраторов</span>
                        </div>
                    </div>
                </div>
                
                <div className="role-card bg-white rounded-xl shadow-md p-6 border-t-purple-500">
                    <div className="flex items-center mb-4">
                        <div className="bg-purple-100 p-3 rounded-full mr-4">
                            <i className="fas fa-user-tie text-purple-500 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Администратор</h3>
                    </div>
                    <p className="text-gray-600 mb-6">Полный доступ к самостоятельному сканированию.</p>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span className="text-gray-700">Просмотр итоговой таблицы</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span className="text-gray-700">Настройка фильтров и запуск сканирования</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-red-400 mr-2"></i>
                            <span className="text-gray-700">Назначение администраторов</span>
                        </div>
                    </div>
                </div>
                
                <div className="role-card bg-white rounded-xl shadow-md p-6 border-t-green-500">
                    <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                            <i className="fas fa-user-shield text-green-500 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Владелец</h3>
                    </div>
                    <p className="text-gray-600 mb-6">Неограниченные возможности и управление пользователями.</p>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span className="text-gray-700">Просмотр итоговой таблицы</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span className="text-gray-700">Настройка фильтров и запуск сканирования</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            <span className="text-gray-700">Назначение администраторов</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
