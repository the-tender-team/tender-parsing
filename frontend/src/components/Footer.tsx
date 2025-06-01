import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 text-base md:text-xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <a 
            href="https://github.com/the-tender-team" 
            target="_blank" 
            className="mb-4 hover:opacity-80 transition duration-300 flex flex-col md:flex-row items-center gap-4 md:gap-2 text-center md:text-left"
          >
            <FaGithub className="text-4xl md:text-3xl" />
            <span>Организация команды разработки на GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
