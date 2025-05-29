import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 text-xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <a href="https://github.com/the-tender-team" target="_blank" className="mb-4 hover:opacity-80 transition duration-300 flex items-center space-x-2">
            <FaGithub className="text-3xl" />
            <span>Организация команды разработки сервиса на GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
