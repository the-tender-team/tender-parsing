import { 
    FaChartPie, 
    FaUserTie, 
    FaUserShield, 
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';

const roles = [
  {
    title: 'Посетитель',
    description: 'Ознакомление с результатами сканирования и запрос роли администратора в личном кабинете.',
    icon: <FaChartPie className="text-blue-500 text-xl" />,
    color: 'blue',
    permissions: [
      { text: 'Просмотр итоговой таблицы', allowed: true },
      { text: 'Настройка фильтров и запуск сканирования', allowed: false },
      { text: 'Выдача и снятие прав администратора', allowed: false },
    ],
  },
  {
    title: 'Администратор',
    description: 'Полный доступ к инстументам по самостоятельному сканированию.',
    icon: <FaUserShield className="text-green-500 text-xl" />,
    color: 'green',
    permissions: [
      { text: 'Просмотр итоговой таблицы', allowed: true },
      { text: 'Настройка фильтров и запуск сканирования', allowed: true },
      { text: 'Выдача и снятие прав администратора', allowed: false },
    ],
  },
  {
    title: 'Владелец',
    description: 'Неограниченные возможности и управление правами пользователей.',
    icon: <FaUserTie className="text-purple-500 text-xl" />,
    color: 'purple',
    permissions: [
      { text: 'Просмотр итоговой таблицы', allowed: true },
      { text: 'Настройка фильтров и запуск сканирования', allowed: true },
      { text: 'Выдача и снятие прав администратора', allowed: true },
    ],
  },
];

const RoleCard = ({ title, description, icon, color, permissions }: typeof roles[0]) => (
  <div className={`role-card bg-white rounded-xl shadow-md p-6 border-t-${color}-500`}>
    <div className="flex items-center mb-4">
      <div className={`bg-${color}-100 p-3 rounded-full mr-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 mb-6">{description}</p>
    <div className="space-y-3">
      {permissions.map(({ text, allowed }, idx) => (
        <div className="flex items-center" key={idx}>
          {allowed ? (
              <FaCheckCircle className="mr-2 text-green-500" />
            ) : (
              <FaTimesCircle className="mr-2 text-red-400" />
            )}
          <span className="text-gray-700">{text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function Roles() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Роли пользователей</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Представление и сравнение перечней возможностей.</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <RoleCard key={index} {...role} />
          ))}
        </div>
      </div>
    </section>
  );
}
