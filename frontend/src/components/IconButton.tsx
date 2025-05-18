import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type IconTabButtonProps = {
  onClick: () => void
  icon: IconDefinition  
  title: string
  tabKey: string
  activeTab: string
}

export default function IconButton({ 
  onClick,
  icon,
  title,
  tabKey,
  activeTab
}: IconTabButtonProps) {
  const isActive = activeTab === tabKey

  return (
    <button
      onClick={onClick}
      className={`p-2 pb-1 border-b-2 transition ${
        isActive ? 'border-white' : 'border-transparent text-indigo-200'
      }`}
      title={title}
      aria-label={title}
    >
      <FontAwesomeIcon icon={icon} className="text-xl" />
    </button>
  )
}
