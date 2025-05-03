export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <a href="https://github.com/the-tender-team" target="_blank" className="mb-4 hover:opacity-80 transition duration-300 flex items-center space-x-2">
            <i className="fab fa-github text-xl"></i>
            <span>Организация команды разработки сервиса на GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
