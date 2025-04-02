
import React from 'react';
import Layout from '@/components/Layout';
import { Recycle, BarChart, UsersRound, Map, Leaf, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Acerca de Garbage Social</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma innovadora que conecta personas y organizaciones para promover una gestión de residuos más sostenible y colaborativa.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 mb-4">
                En Garbage Social, nuestra misión es transformar la forma en que gestionamos los residuos, convirtiendo un proceso tradicional en una experiencia colaborativa, eficiente y sostenible.
              </p>
              <p className="text-gray-600">
                Conectamos a personas que generan desechos con aquellos que pueden reutilizarlos o reciclarlos, creando así un ciclo virtuoso que beneficia tanto al medio ambiente como a la comunidad.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-primary/10 p-8 rounded-full">
                <Recycle size={150} className="text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Publica tus Residuos</h3>
              <p className="text-gray-600">
                Registra tus desechos con una foto y su ubicación. El sistema los clasifica automáticamente por categorías.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecta con Recicladores</h3>
              <p className="text-gray-600">
                Los recicladores buscan residuos disponibles y se comprometen a recogerlos dentro del tiempo acordado.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Califica la Experiencia</h3>
              <p className="text-gray-600">
                Ambas partes se califican mutuamente, creando un sistema de confianza y mejorando la experiencia.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Categorías de Residuos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-organic">
              <h3 className="font-semibold mb-2">Orgánico <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-organic"></span></h3>
              <p className="text-sm text-gray-600">Restos de comida, poda, material biodegradable.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-paper">
              <h3 className="font-semibold mb-2">Papel <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-paper"></span></h3>
              <p className="text-sm text-gray-600">Periódicos, cartón, papel de oficina, libros.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-glass">
              <h3 className="font-semibold mb-2">Vidrio <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-glass"></span></h3>
              <p className="text-sm text-gray-600">Botellas, frascos, recipientes de vidrio.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-plastic">
              <h3 className="font-semibold mb-2">Plástico <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-plastic"></span></h3>
              <p className="text-sm text-gray-600">Envases, botellas, bolsas, plástico duro.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-metal">
              <h3 className="font-semibold mb-2">Metal <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-metal"></span></h3>
              <p className="text-sm text-gray-600">Latas, aluminio, chatarra, objetos metálicos.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-sanitary">
              <h3 className="font-semibold mb-2">Control Sanitario <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-sanitary"></span></h3>
              <p className="text-sm text-gray-600">Residuos patológicos, solo para organizaciones especializadas.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-dump">
              <h3 className="font-semibold mb-2">Basurales <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-dump"></span></h3>
              <p className="text-sm text-gray-600">Denuncia de basurales ilegales para acción comunitaria.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-waste-various">
              <h3 className="font-semibold mb-2">Varios <span className="ml-2 inline-block w-4 h-4 rounded-full bg-waste-various"></span></h3>
              <p className="text-sm text-gray-600">Residuos que no encajan en otras categorías.</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Beneficios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={30} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Impacto Ambiental</h3>
              <p className="text-gray-600">
                Reducción de residuos que llegan a vertederos, menor emisión de gases y conservación de recursos naturales.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersRound size={30} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Impacto Social</h3>
              <p className="text-gray-600">
                Creación de comunidades más limpias, concienciación sobre el reciclaje y apoyo a recicladores urbanos.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart size={30} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Impacto Económico</h3>
              <p className="text-gray-600">
                Fomento de la economía circular, generación de ingresos para recicladores y ahorro en gestión de residuos.
              </p>
            </div>
          </div>
        </section>

        {/* Join Us */}
        <section className="bg-primary/10 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Únete a Nosotros</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Sé parte del cambio y ayúdanos a transformar la gestión de residuos en una experiencia colaborativa, eficiente y sostenible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition">
              Regístrate Ahora
            </a>
            <a href="/contact" className="bg-white text-primary px-6 py-2 rounded-md border border-primary hover:bg-gray-50 transition">
              Contáctanos
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
