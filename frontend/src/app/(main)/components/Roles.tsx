import { FaChartPie, FaUserTie, FaUserShield, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Section from "@/components/Section"

const roles = [
  {
    title: 'Посетитель',
    description: 'Ознакомление с результатами сканирования и запрос роли администратора в личном кабинете.',
    icon: <FaChartPie className="text-sky-500 text-xl" />,
    bgColor: 'bg-sky-100',
    borderColor: 'border-t-sky-500',
    permissions: [
      { text: 'Просмотр итоговой таблицы', allowed: true },
      { text: 'Настройка фильтров и запуск сканирования', allowed: false },
      { text: 'Выдача и снятие прав администратора', allowed: false }
    ]
  },
  {
    title: 'Администратор',
    description: 'Полный доступ к инстументам по самостоятельному сканированию.',
    icon: <FaUserShield className="text-green-500 text-xl" />,
    bgColor: 'bg-green-100',
    borderColor: 'border-t-green-500',
    permissions: [
      { text: 'Просмотр итоговой таблицы', allowed: true },
      { text: 'Настройка фильтров и запуск сканирования', allowed: true },
      { text: 'Выдача и снятие прав администратора', allowed: false }
    ]
  },
  {
    title: 'Владелец',
    description: 'Неограниченные возможности и управление правами пользователей.',
    icon: <FaUserTie className="text-purple-500 text-xl" />,
    bgColor: 'bg-purple-100',
    borderColor: 'border-t-purple-500',
    permissions: [
      { text: 'Просмотр итоговой таблицы', allowed: true },
      { text: 'Настройка фильтров и запуск сканирования', allowed: true },
      { text: 'Выдача и снятие прав администратора', allowed: true }
    ]
  }
]

const RoleCard = ({ title, description, icon, bgColor, borderColor, permissions }: typeof roles[0]) => (
  <div className={`role-card bg-white rounded-xl shadow-md p-6 border-t-4 ${borderColor}`}>
    <div className="flex items-center mb-4">
      <div className={`${bgColor} p-3 rounded-full mr-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 mb-6">{description}</p>
    <div className="space-y-3">
      {permissions.map(({ text, allowed }, idx) => (
        <div className="flex items-center gap-2" key={idx}>
          {allowed ? (
              <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <FaTimesCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
          <span className="text-gray-700">{text}</span>
        </div>
      ))}
    </div>
  </div>
)

export default function Roles() {
  return (
    <Section 
      title="Роли пользователей" 
      description="Представление и сравнение перечней возможностей."
      bgColor="bg-white"
    >
      <div className="grid md:grid-cols-3 gap-8">
        {roles.map((role, index) => (
          <RoleCard key={index} {...role} />
        ))}
      </div>
    </Section>
  )
}
