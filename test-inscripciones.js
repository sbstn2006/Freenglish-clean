// Script de prueba para verificar inscripciones del estudiante
const fetch = require('node-fetch');

async function testInscripciones() {
  try {
    console.log('🔍 Probando obtención de inscripciones del estudiante1 (ID: 5)...');
    
    const response = await fetch('http://localhost:4000/api/horarios/inscripciones/5');
    const data = await response.json();
    
    console.log('📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Éxito: Las inscripciones se obtuvieron correctamente');
      if (data.length > 0) {
        console.log(`📚 El estudiante tiene ${data.length} inscripción(es) activa(s):`);
        data.forEach((inscripcion, index) => {
          console.log(`  ${index + 1}. Curso: ${inscripcion.curso_nombre}`);
          console.log(`     Docente: ${inscripcion.docente_nombre}`);
          console.log(`     Horario: ${inscripcion.dia_semana}, ${inscripcion.hora_inicio} - ${inscripcion.hora_fin}`);
          console.log(`     Estado: ${inscripcion.estado}`);
        });
      } else {
        console.log('⚠️  El estudiante no tiene inscripciones activas');
      }
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testInscripciones(); 