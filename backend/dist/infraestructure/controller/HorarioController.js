"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioController = void 0;
const data_base_1 = require("../config/data-base");
const Horario_1 = require("../entities/Horario");
const Inscripcion_1 = require("../entities/Inscripcion");
const User_1 = require("../entities/User");
const Curso_1 = require("../entities/Curso");
const Asistencia_1 = require("../entities/Asistencia");
const typeorm_1 = require("typeorm");
class HorarioController {
    getHorariosByDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Permitir obtener el id tanto por query como por params
                let docenteId;
                if (req.params.id) {
                    docenteId = parseInt(req.params.id);
                }
                else if (req.query.docenteId) {
                    docenteId = parseInt(req.query.docenteId);
                }
                if (!docenteId || isNaN(docenteId)) {
                    return res.status(400).json({ error: "docenteId inválido" });
                }
                const horarios = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).find({
                    where: { docente_id: docenteId }
                });
                // Obtener los cursos relacionados
                const cursoIds = horarios.map(h => h.curso_id);
                const cursos = yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findByIds(cursoIds);
                const cursosMap = Object.fromEntries(cursos.map(c => [c.id, c.titulo]));
                // Para cada horario, contar estudiantes inscritos
                const horariosConCurso = yield Promise.all(horarios.map((h) => __awaiter(this, void 0, void 0, function* () {
                    const estudiantesCount = yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).count({ where: { horario_id: h.id, estado: 'activa' } });
                    return {
                        id: h.id,
                        curso_nombre: cursosMap[h.curso_id] || null,
                        dia_semana: h.dia_semana,
                        hora_inicio: h.hora_inicio,
                        hora_fin: h.hora_fin,
                        estudiantes: estudiantesCount,
                        max_estudiantes: h.max_estudiantes
                    };
                })));
                return res.status(200).json(horariosConCurso);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los horarios" });
            }
        });
    }
    getEstudiantesPorHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horarioId = parseInt(req.params.id);
                const fechaSeleccionada = req.query.fecha;
                if (isNaN(horarioId)) {
                    return res.status(400).json({ error: "horarioId inválido" });
                }
                // Busca el horario y su curso
                const horario = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).findOneBy({ id: horarioId });
                if (!horario)
                    return res.status(404).json({ error: "Horario no encontrado" });
                const curso = yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findOneBy({ id: horario.curso_id });
                // Busca inscripciones activas para ese horario
                const inscripciones = yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).find({
                    where: { horario_id: horarioId, estado: "activa" }
                });
                // Busca los usuarios (estudiantes) de esas inscripciones
                const estudianteIds = inscripciones.map(i => i.estudiante_id);
                if (estudianteIds.length === 0)
                    return res.json([]);
                const estudiantes = yield data_base_1.AppDataSource.getRepository(User_1.User).findByIds(estudianteIds);
                // Para cada estudiante, buscar asistencias
                let asistencias = yield data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).find({
                    where: { horario_id: horarioId }
                });
                // Si hay fecha seleccionada, filtrar asistencias a esa fecha
                if (fechaSeleccionada) {
                    asistencias = asistencias.filter(a => a.fecha === fechaSeleccionada);
                }
                // Función para calcular el total de clases programadas desde la inscripción
                const calcularClasesProgramadas = (fechaInscripcion, diaSemana) => {
                    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                    const dayMap = {
                        "lunes": 1, "martes": 2, "miércoles": 3, "jueves": 4, "viernes": 5, "sábado": 6, "domingo": 0
                    };
                    // Soportar múltiples días en un solo string
                    const diasHorario = diaSemana
                        .toLowerCase()
                        .replace(/,/g, ' y ')
                        .split(' y ')
                        .map(d => d.trim())
                        .filter(d => dias.includes(d));
                    let totalClases = 0;
                    const fechaActual = new Date();
                    const fechaInsc = new Date(fechaInscripcion);
                    diasHorario.forEach(dia => {
                        const day = dayMap[dia];
                        if (day === undefined)
                            return;
                        // Encontrar la primera fecha de clase después de la inscripción
                        let fechaClase = new Date(fechaInsc);
                        fechaClase.setDate(fechaInsc.getDate() + ((day - fechaInsc.getDay() + 7) % 7));
                        // Si la primera fecha es antes de la inscripción, sumar 7 días
                        if (fechaClase < fechaInsc) {
                            fechaClase.setDate(fechaClase.getDate() + 7);
                        }
                        // Contar clases hasta la fecha actual
                        while (fechaClase <= fechaActual) {
                            totalClases++;
                            fechaClase.setDate(fechaClase.getDate() + 7);
                        }
                    });
                    return totalClases;
                };
                // Filtrar estudiantes válidos
                const estudiantesValidos = estudiantes.filter(est => est && est.id && est.name);
                // Armar respuesta enriquecida
                const resultado = estudiantesValidos.map(est => {
                    // Buscar la inscripción del estudiante para obtener la fecha
                    const inscripcion = inscripciones.find(i => i.estudiante_id === est.id);
                    const fechaInscripcion = (inscripcion === null || inscripcion === void 0 ? void 0 : inscripcion.fecha_inscripcion) || new Date().toISOString().slice(0, 10);
                    // Buscar asistencia para la fecha seleccionada
                    const asistenciaHoy = asistencias.find(a => a.estudiante_id === est.id);
                    const presenteHoy = asistenciaHoy ? asistenciaHoy.presente : false;
                    // Calcular asistencias reales del estudiante
                    const asistenciasEst = asistencias.filter(a => a.estudiante_id === est.id && a.presente);
                    // Calcular total de clases programadas desde la inscripción
                    const totalClasesProgramadas = calcularClasesProgramadas(fechaInscripcion, horario.dia_semana);
                    // Calcular porcentaje de asistencia
                    const porcentajeAsistencia = totalClasesProgramadas > 0 ? Math.round((asistenciasEst.length / totalClasesProgramadas) * 100) : 0;
                    // Última asistencia presente
                    const ultimaAsistencia = asistenciasEst.length > 0 ? asistenciasEst.sort((a, b) => b.fecha.localeCompare(a.fecha))[0].fecha : null;
                    return {
                        id: est.id,
                        nombre: est.name,
                        email: est.email,
                        curso_id: horario.curso_id,
                        curso_nombre: curso ? curso.titulo : null,
                        asistencia: porcentajeAsistencia,
                        ultimaAsistencia,
                        presenteHoy,
                        totalClasesProgramadas,
                        asistenciasReales: asistenciasEst.length
                    };
                });
                return res.json(resultado);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los estudiantes" });
            }
        });
    }
    registrarAsistencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { estudiante_id, horario_id, fecha, presente } = req.body;
                if (!estudiante_id || !horario_id || !fecha || typeof presente !== 'boolean') {
                    return res.status(400).json({ error: 'Datos incompletos' });
                }
                // Validar que la fecha no sea futura
                const fechaClase = new Date(fecha);
                const fechaActual = new Date();
                fechaActual.setHours(0, 0, 0, 0); // Resetear a inicio del día
                fechaClase.setHours(0, 0, 0, 0);
                if (fechaClase > fechaActual) {
                    return res.status(400).json({ error: 'No se puede marcar asistencia para fechas futuras' });
                }
                // Buscar si ya existe una asistencia para ese estudiante, horario y fecha
                let asistencia = yield data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).findOneBy({ estudiante_id, horario_id, fecha });
                if (asistencia) {
                    asistencia.presente = presente;
                    yield data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).save(asistencia);
                }
                else {
                    asistencia = data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).create({ estudiante_id, horario_id, fecha, presente });
                    yield data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).save(asistencia);
                }
                return res.status(200).json({ success: true, asistencia });
            }
            catch (error) {
                return res.status(500).json({ error: 'Error al registrar la asistencia' });
            }
        });
    }
    crearHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { curso_id, docente_id, dia_semana, hora_inicio, hora_fin, max_estudiantes, estado } = req.body;
                if (!curso_id || !docente_id || !dia_semana || !hora_inicio || !hora_fin || !max_estudiantes) {
                    return res.status(400).json({ error: 'Datos incompletos' });
                }
                const horario = data_base_1.AppDataSource.getRepository(Horario_1.Horario).create({
                    curso_id: Number(curso_id),
                    docente_id: Number(docente_id),
                    dia_semana,
                    hora_inicio,
                    hora_fin,
                    max_estudiantes: Number(max_estudiantes),
                    estado: estado || 'activo'
                });
                yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).save(horario);
                return res.status(201).json({ success: true, horario });
            }
            catch (error) {
                return res.status(500).json({ error: 'Error al crear el horario' });
            }
        });
    }
    editarHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: 'ID inválido' });
                const { curso_id, dia_semana, hora_inicio, hora_fin, max_estudiantes, estado } = req.body;
                const horarioRepo = data_base_1.AppDataSource.getRepository(Horario_1.Horario);
                const horario = yield horarioRepo.findOneBy({ id });
                if (!horario)
                    return res.status(404).json({ error: 'Horario no encontrado' });
                if (curso_id)
                    horario.curso_id = Number(curso_id);
                if (dia_semana)
                    horario.dia_semana = dia_semana;
                if (hora_inicio)
                    horario.hora_inicio = hora_inicio;
                if (hora_fin)
                    horario.hora_fin = hora_fin;
                if (max_estudiantes)
                    horario.max_estudiantes = Number(max_estudiantes);
                if (estado)
                    horario.estado = estado;
                yield horarioRepo.save(horario);
                return res.status(200).json({ success: true, horario });
            }
            catch (error) {
                return res.status(500).json({ error: 'Error al editar el horario' });
            }
        });
    }
    getHorariosPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha } = req.query;
                if (!fecha)
                    return res.status(400).json({ error: 'Fecha requerida' });
                // Obtener el día de la semana a partir de la fecha
                const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                const diaSemana = dias[new Date(fecha).getDay()];
                // Buscar horarios para ese día
                const horarios = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).find({ where: { dia_semana: diaSemana } });
                // Obtener los cursos relacionados
                const cursoIds = horarios.map(h => h.curso_id);
                const cursos = yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findByIds(cursoIds);
                const cursosMap = Object.fromEntries(cursos.map(c => [c.id, c.titulo]));
                // Agregar el nombre del curso a cada horario
                const horariosConCurso = horarios.map(h => (Object.assign(Object.assign({}, h), { curso_nombre: cursosMap[h.curso_id] || null })));
                return res.status(200).json(horariosConCurso);
            }
            catch (error) {
                return res.status(500).json({ error: 'Error al obtener los horarios del día' });
            }
        });
    }
    getInscripcionesPorEstudiante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estudianteId = parseInt(req.params.estudianteId);
                if (isNaN(estudianteId)) {
                    return res.status(400).json({ error: "estudianteId inválido" });
                }
                // Buscar inscripciones activas del estudiante
                const inscripciones = yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).find({
                    where: { estudiante_id: estudianteId, estado: "activa" }
                });
                if (inscripciones.length === 0)
                    return res.json([]);
                // Buscar los horarios de esas inscripciones
                const horarioIds = inscripciones.map(i => i.horario_id);
                const horarios = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).findByIds(horarioIds);
                // Buscar los cursos relacionados
                const cursoIds = horarios.map(h => h.curso_id);
                const cursos = yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findByIds(cursoIds);
                const cursosMap = Object.fromEntries(cursos.map(c => [c.id, c.titulo]));
                // Buscar los docentes relacionados
                const docenteIds = horarios.map(h => h.docente_id);
                const docentes = yield data_base_1.AppDataSource.getRepository(User_1.User).findByIds(docenteIds);
                const docentesMap = Object.fromEntries(docentes.map(d => [d.id, d.name]));
                // Devolver un array de inscripciones enriquecidas
                const resultado = inscripciones.map(insc => {
                    var _a, _b;
                    const horario = horarios.find(h => h.id === insc.horario_id);
                    return {
                        inscripcion_id: insc.id,
                        id: insc.id,
                        horario_id: insc.horario_id,
                        curso_id: horario === null || horario === void 0 ? void 0 : horario.curso_id,
                        docente_id: horario === null || horario === void 0 ? void 0 : horario.docente_id,
                        dia_semana: horario === null || horario === void 0 ? void 0 : horario.dia_semana,
                        hora_inicio: horario === null || horario === void 0 ? void 0 : horario.hora_inicio,
                        hora_fin: horario === null || horario === void 0 ? void 0 : horario.hora_fin,
                        max_estudiantes: horario === null || horario === void 0 ? void 0 : horario.max_estudiantes,
                        estado: insc.estado,
                        curso_nombre: cursosMap[(_a = horario === null || horario === void 0 ? void 0 : horario.curso_id) !== null && _a !== void 0 ? _a : ''] || null,
                        docente_nombre: docentesMap[(_b = horario === null || horario === void 0 ? void 0 : horario.docente_id) !== null && _b !== void 0 ? _b : ''] || null
                    };
                });
                return res.status(200).json(resultado);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener las inscripciones del estudiante" });
            }
        });
    }
    cancelarInscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: 'ID inválido' });
                const inscripcionRepo = data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion);
                const inscripcion = yield inscripcionRepo.findOneBy({ id });
                if (!inscripcion)
                    return res.status(404).json({ error: 'Inscripción no encontrada' });
                inscripcion.estado = 'cancelada';
                yield inscripcionRepo.save(inscripcion);
                // Obtener datos para el log
                const estudiante = yield data_base_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: inscripcion.estudiante_id });
                const horario = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).findOneBy({ id: inscripcion.horario_id });
                const curso = horario ? yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findOneBy({ id: horario.curso_id }) : null;
                yield data_base_1.AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                    usuario_id: inscripcion.estudiante_id,
                    accion: `Se dio de baja del curso ${curso ? curso.titulo : inscripcion.horario_id}`,
                    fecha: new Date()
                });
                return res.status(200).json({ success: true });
            }
            catch (error) {
                return res.status(500).json({ error: 'Error al cancelar la inscripción' });
            }
        });
    }
    crearInscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { estudiante_id, horario_id } = req.body;
                if (!estudiante_id || !horario_id) {
                    return res.status(400).json({ error: 'estudiante_id y horario_id son requeridos' });
                }
                // Verificar que el horario existe y está activo
                const horario = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).findOneBy({ id: horario_id, estado: 'activo' });
                if (!horario) {
                    return res.status(404).json({ error: 'Horario no encontrado o inactivo' });
                }
                // Verificar que el estudiante existe
                const estudiante = yield data_base_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: estudiante_id });
                if (!estudiante) {
                    return res.status(404).json({ error: 'Estudiante no encontrado' });
                }
                // Verificar que no esté ya inscrito en este horario
                const inscripcionExistente = yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).findOneBy({ estudiante_id, horario_id, estado: 'activa' });
                if (inscripcionExistente) {
                    return res.status(400).json({ error: 'Ya estás inscrito en este horario' });
                }
                // Verificar cupos disponibles
                const inscripcionesActivas = yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).count({ where: { horario_id, estado: 'activa' } });
                if (inscripcionesActivas >= horario.max_estudiantes) {
                    return res.status(400).json({ error: 'No hay cupos disponibles para este horario' });
                }
                // Obtener el curso para el log
                const curso = yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findOneBy({ id: horario.curso_id });
                // Crear la inscripción SIEMPRE con estado 'activa'
                const inscripcion = data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).create({ estudiante_id: Number(estudiante_id), horario_id: Number(horario_id), estado: 'activa' });
                yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).save(inscripcion);
                // Registrar actividad
                yield data_base_1.AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                    usuario_id: estudiante_id,
                    accion: `Se inscribió al curso ${curso ? curso.titulo : horario.curso_id}`,
                    fecha: new Date()
                });
                return res.status(201).json({ success: true, message: 'Inscripción creada exitosamente', inscripcion });
            }
            catch (error) {
                console.error('Error creating inscripción:', error);
                return res.status(500).json({ error: 'Error al crear la inscripción' });
            }
        });
    }
    getClasesImpartidasPorDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let docenteId;
                if (req.params.id) {
                    docenteId = parseInt(req.params.id);
                }
                else if (req.query.docenteId) {
                    docenteId = parseInt(req.query.docenteId);
                }
                if (!docenteId || isNaN(docenteId)) {
                    return res.status(400).json({ error: "docenteId inválido" });
                }
                // Obtener los horarios del docente
                const horarios = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).find({ where: { docente_id: docenteId } });
                const horarioIds = horarios.map(h => h.id);
                if (horarioIds.length === 0)
                    return res.json({ clasesImpartidas: 0 });
                // Buscar asistencias para esos horarios
                const asistencias = yield data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).find({ where: { horario_id: (0, typeorm_1.In)(horarioIds) } });
                // Agrupar por fecha y horario_id, y contar solo si hay al menos una asistencia para ese horario y fecha
                const clasesSet = new Set();
                asistencias.forEach(a => {
                    if (a.presente) {
                        clasesSet.add(`${a.horario_id}_${a.fecha}`);
                    }
                });
                return res.json({ clasesImpartidas: clasesSet.size });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener clases impartidas" });
            }
        });
    }
    getAllInscripcionesEnriched(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield data_base_1.AppDataSource.query(`
        SELECT
          i.id AS inscripcion_id,
          i.fecha_inscripcion,
          e.id AS estudiante_id,
          e.nombre AS estudiante_nombre,
          e.email AS estudiante_email,
          c.id AS curso_id,
          c.titulo AS curso_titulo,
          d.id AS docente_id,
          d.nombre AS docente_nombre,
          d.email AS docente_email
        FROM freenglish.inscripciones i
        JOIN freenglish.usuarios e ON i.estudiante_id = e.id
        JOIN freenglish.horarios h ON i.horario_id = h.id
        JOIN freenglish.cursos c ON h.curso_id = c.id
        JOIN freenglish.usuarios d ON h.docente_id = d.id
        ORDER BY i.fecha_inscripcion DESC
      `);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Error al obtener inscripciones' });
            }
        });
    }
    getEstadisticasAsistenciaPorEstudiante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const estudianteId = parseInt(req.params.estudianteId);
                const horarioId = parseInt(req.query.horarioId);
                if (isNaN(estudianteId)) {
                    return res.status(400).json({ error: "estudianteId inválido" });
                }
                if (isNaN(horarioId)) {
                    return res.status(400).json({ error: "horarioId inválido" });
                }
                // Buscar la inscripción del estudiante
                const inscripcion = yield data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion).findOne({
                    where: { estudiante_id: estudianteId, horario_id: horarioId, estado: "activa" }
                });
                if (!inscripcion) {
                    return res.status(404).json({ error: "Inscripción no encontrada" });
                }
                // Buscar el horario
                const horario = yield data_base_1.AppDataSource.getRepository(Horario_1.Horario).findOneBy({ id: horarioId });
                if (!horario) {
                    return res.status(404).json({ error: "Horario no encontrado" });
                }
                // Función para calcular el total de clases programadas desde la inscripción
                const calcularClasesProgramadas = (fechaInscripcion, diaSemana) => {
                    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                    const dayMap = {
                        "lunes": 1, "martes": 2, "miércoles": 3, "jueves": 4, "viernes": 5, "sábado": 6, "domingo": 0
                    };
                    // Soportar múltiples días en un solo string
                    const diasHorario = diaSemana
                        .toLowerCase()
                        .replace(/,/g, ' y ')
                        .split(' y ')
                        .map(d => d.trim())
                        .filter(d => dias.includes(d));
                    let totalClases = 0;
                    const fechaActual = new Date();
                    const fechaInsc = new Date(fechaInscripcion);
                    diasHorario.forEach(dia => {
                        const day = dayMap[dia];
                        if (day === undefined)
                            return;
                        // Encontrar la primera fecha de clase después de la inscripción
                        let fechaClase = new Date(fechaInsc);
                        fechaClase.setDate(fechaInsc.getDate() + ((day - fechaInsc.getDay() + 7) % 7));
                        // Si la primera fecha es antes de la inscripción, sumar 7 días
                        if (fechaClase < fechaInsc) {
                            fechaClase.setDate(fechaClase.getDate() + 7);
                        }
                        // Contar clases hasta la fecha actual
                        while (fechaClase <= fechaActual) {
                            totalClases++;
                            fechaClase.setDate(fechaClase.getDate() + 7);
                        }
                    });
                    return totalClases;
                };
                // Buscar todas las asistencias del estudiante para este horario
                const asistencias = yield data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia).find({
                    where: { estudiante_id: estudianteId, horario_id: horarioId }
                });
                // Calcular estadísticas
                const totalClasesProgramadas = calcularClasesProgramadas(inscripcion.fecha_inscripcion, horario.dia_semana);
                const asistenciasReales = asistencias.filter(a => a.presente).length;
                const ausencias = asistencias.filter(a => !a.presente).length;
                const porcentajeAsistencia = totalClasesProgramadas > 0 ? Math.round((asistenciasReales / totalClasesProgramadas) * 100) : 0;
                // Obtener fechas de asistencia y ausencia
                const fechasAsistencia = asistencias.filter(a => a.presente).map(a => a.fecha).sort();
                const fechasAusencia = asistencias.filter(a => !a.presente).map(a => a.fecha).sort();
                // Obtener información del curso
                const curso = yield data_base_1.AppDataSource.getRepository(Curso_1.Curso).findOneBy({ id: horario.curso_id });
                return res.json({
                    estudiante_id: estudianteId,
                    horario_id: horarioId,
                    curso_nombre: (curso === null || curso === void 0 ? void 0 : curso.titulo) || 'Curso no encontrado',
                    fecha_inscripcion: inscripcion.fecha_inscripcion,
                    total_clases_programadas: totalClasesProgramadas,
                    asistencias_reales: asistenciasReales,
                    ausencias: ausencias,
                    porcentaje_asistencia: porcentajeAsistencia,
                    fechas_asistencia: fechasAsistencia,
                    fechas_ausencia: fechasAusencia,
                    ultima_asistencia: fechasAsistencia.length > 0 ? fechasAsistencia[fechasAsistencia.length - 1] : null,
                    ultima_ausencia: fechasAusencia.length > 0 ? fechasAusencia[fechasAusencia.length - 1] : null
                });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener estadísticas de asistencia" });
            }
        });
    }
}
exports.HorarioController = HorarioController;
//# sourceMappingURL=HorarioController.js.map