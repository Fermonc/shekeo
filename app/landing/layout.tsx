
import React from 'react';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">Nexus</div>
          <div>
            <a href="/login" className="text-gray-300 hover:text-white mr-4">Iniciar Sesión</a>
            <a href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Registrarse
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Nexus. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
