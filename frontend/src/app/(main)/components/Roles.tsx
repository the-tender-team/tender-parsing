import Section from "@/components/Section"
import { FaChartPie, FaUserTie, FaUserShield, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const permissions = {
  VIEW_TABLE: 'Просмотр сохранённой и новой таблиц',
  DO_ANALYSIS: 'Выполнение анализа любого тендера',
  MANAGE_SCANNING: 'Настройка параметров и запуск парсинга',
  MANAGE_ADMINS: 'Управление пользователями'
} as const

const roles = [
  {
    title: 'Посетитель',
    description: 'Ознакомление с результатами сканирования и запрос роли администратора в личном кабинете.',
    icon: <FaChartPie className="text-sky-500 text-xl" />,
    bgColor: 'bg-sky-100',
    borderColor: 'border-t-sky-500',
    permissions: [
      { text: permissions.VIEW_TABLE, allowed: true },
      { text: permissions.DO_ANALYSIS, allowed: true },
      { text: permissions.MANAGE_SCANNING, allowed: false },
      { text: permissions.MANAGE_ADMINS, allowed: false }
    ]
  },
  {
    title: 'Администратор',
    description: 'Полный доступ к инстументам для самостоятельного сканирования.',
    icon: <FaUserShield className="text-green-500 text-xl" />,
    bgColor: 'bg-green-100',
    borderColor: 'border-t-green-500',
    permissions: [
      { text: permissions.VIEW_TABLE, allowed: true },
      { text: permissions.DO_ANALYSIS, allowed: true },
      { text: permissions.MANAGE_SCANNING, allowed: true },
      { text: permissions.MANAGE_ADMINS, allowed: false }
    ]
  },
  {
    title: 'Владелец',
    description: 'Неограниченные возможности.',
    icon: <FaUserTie className="text-purple-500 text-xl" />,
    bgColor: 'bg-purple-100',
    borderColor: 'border-t-purple-500',
    permissions: [
      { text: permissions.VIEW_TABLE, allowed: true },
      { text: permissions.DO_ANALYSIS, allowed: true },
      { text: permissions.MANAGE_SCANNING, allowed: true },
      { text: permissions.MANAGE_ADMINS, allowed: true }
    ]
  }
]

const RoleCard = ({ title, description, icon, bgColor, borderColor, permissions }: typeof roles[0]) => (
  <div className={`role-card bg-white rounded-xl shadow-md p-6 border-t-4 ${borderColor} h-full flex flex-col`}>
    <div className="flex-none">
      <div className="flex items-center mb-4">
        <div className={`${bgColor} p-3 rounded-full mr-4 flex-shrink-0`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
    </div>
    <div className="mt-auto">
      <div className="space-y-3">
        {permissions.map(({ text, allowed }, idx) => (
          <div className="flex items-start gap-2" key={idx}>
            {allowed ? (
                <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
              ) : (
                <FaTimesCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
              )}
            <span className="text-gray-700">{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function Roles() {
  return (
    <Section
      id="roles"
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
