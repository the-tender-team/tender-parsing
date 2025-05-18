interface SectionProps {
  title: string
  description: string | React.ReactNode
  bgColor: string
  children?: React.ReactNode
}

export default function Section({ title, description, bgColor, children }: SectionProps) {
  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-auto mx-auto">{description}</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>
        {children}
      </div>
    </section>
  )
}
