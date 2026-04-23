interface PlaceholderProps {
  icon: string
  title: string
  desc?: string
}

export default function Placeholder({ icon, title, desc }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
      <span className="text-5xl mb-4 animate-bounce">{icon}</span>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      {desc && <p className="text-sm text-gray-400 text-center px-8">{desc}</p>}
    </div>
  )
}
