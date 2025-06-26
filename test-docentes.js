// Script para probar el endpoint de docentes
const testDocentes = async () => {
  try {
    console.log('Probando endpoint de docentes...');
    
    const response = await fetch('http://localhost:4000/api/docentes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('Respuesta del endpoint:', data);

    if (response.ok) {
      console.log('✅ Docentes obtenidos exitosamente');
      console.log('Total de docentes:', data.length);
      data.forEach(d => {
        console.log(`- ID: ${d.id}, Nombre: ${d.name}, Email: ${d.email}, Estado: ${d.status}`);
      });
    } else {
      console.log('❌ Error al obtener docentes:', data);
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testDocentes(); 