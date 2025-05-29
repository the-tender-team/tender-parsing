interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

export default function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  )
}
