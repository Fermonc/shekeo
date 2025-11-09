
import React from 'react';
import Head from 'next/head';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white">
      <Head>
        <title>Nexus - Gestor de Proyectos con IA</title>
        <meta
          name="description"
          content="Transforma tu flujo de trabajo con Nexus, el gestor de proyectos que automatiza tareas, predice plazos y optimiza la asignación de recursos para equipos de alto rendimiento."
        />
        <meta
          name="keywords"
          content="gestor de proyectos con IA, planificación de proyectos inteligente, automatización de tareas, optimización de recursos, Nexus"
        />
      </Head>

      {/* Hero Section */}
      <header className="text-center py-20 bg-gray-800">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a Nexus</h1>
        <p className="text-xl text-gray-400">El futuro de la gestión de proyectos está aquí</p>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Planificación Inteligente</h3>
              <p>Deja que nuestra IA cree planes de proyecto optimizados en segundos.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Automatización de Tareas</h3>
              <p>Automatiza tareas repetitivas y libera a tu equipo para que se concentre en lo importante.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Predicción de Plazos</h3>
              <p>Nuestra IA analiza los datos de tu proyecto para predecir plazos de entrega con una precisión asombrosa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl text-gray-400 mb-8">Regístrate ahora y obtén una prueba gratuita de 30 días.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg">Empezar ahora</button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
