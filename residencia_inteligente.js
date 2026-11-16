/**
 * ==============================================================================
 * CURSO: Big Data (Código: 202016911) - UNAD
 * TAREA 4: Almacenamiento y Consultas de Datos en Big Data
 * CASO DE USO: Telemetría de Dispositivos IoT para Domótica y Energía Solar
 * ESTUDIANTE: Camilo Armando Muñoz Becerra
 * MOTOR DE BASE DE DATOS: MongoDB (mongosh v2.x / MongoDB Atlas)
 * ==============================================================================
 * 
 * Descripción del Archivo:
 * Este script contiene la inicialización de la base de datos `residencia_inteligente`,
 * el catálogo de dispositivos, la ingesta masiva de 120 documentos de telemetría
 * (representando 2 días de operación: 10-Nov nublado y 11-Nov despejado), la creación
 * de índices óptimos y las 17 consultas requeridas para la evaluación (CRUD, 
 * Filtros por rango y lógicos, Uniones $lookup y Pipelines de Agregación Estadística).
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. SELECCIÓN E INICIALIZACIÓN DE LA BASE DE DATOS
// ------------------------------------------------------------------------------
use residencia_inteligente;

// Limpieza previa de colecciones si existen
db.dispositivos.drop();
db.telemetria_lecturas.drop();

print(">>> Base de datos residencia_inteligente reiniciada correctamente.\n");

// ------------------------------------------------------------------------------
// 2. INSERCIÓN DEL CATÁLOGO DE DISPOSITIVOS (Colección: dispositivos)
// ------------------------------------------------------------------------------
db.dispositivos.insertMany([
  {
    "_id": "DEV-SOLAR-001",
    "nombre": "Inversor Híbrido Techo Sur",
    "categoria": "energia_solar",
    "tipo_dispositivo": "Inversor/Cargador",
    "ubicacion": {
      "zona": "Exterior",
      "subzona": "Techo Principal"
    },
    "especificaciones": {
      "potencia_maxima_w": 5000,
      "voltaje_nominal_v": 48,
      "eficiencia_pct": 97.5
    },
    "estado_operativo": "activo",
    "fecha_instalacion": ISODate("2026-01-15T00:00:00Z")
  },
  {
    "_id": "DEV-SOLAR-002",
    "nombre": "Sensor Piranómetro Radiación Solar",
    "categoria": "energia_solar",
    "tipo_dispositivo": "Piranómetro",
    "ubicacion": {
      "zona": "Exterior",
      "subzona": "Techo Principal"
    },
    "especificaciones": {
      "rango_medicion_w_m2": "0-2000",
      "precision": "±2%"
    },
    "estado_operativo": "activo",
    "fecha_instalacion": ISODate("2026-01-15T00:00:00Z")
  },
  {
    "_id": "DEV-DOM-001",
    "nombre": "Medidor General de Consumo Eléctrico",
    "categoria": "domotica",
    "tipo_dispositivo": "Medidor Eléctrico",
    "ubicacion": {
      "zona": "Interior",
      "subzona": "Tablero Principal"
    },
    "especificaciones": {
      "corriente_maxima_a": 60,
      "fases": 1
    },
    "estado_operativo": "activo",
    "fecha_instalacion": ISODate("2026-02-01T00:00:00Z")
  },
  {
    "_id": "DEV-DOM-002",
    "nombre": "Sensor Confort Alcoba Principal",
    "categoria": "domotica",
    "tipo_dispositivo": "Multisensor Confort",
    "ubicacion": {
      "zona": "Interior",
      "subzona": "Alcoba Principal"
    },
    "especificaciones": {
      "protocolo": "Zigbee 3.0"
    },
    "estado_operativo": "activo",
    "fecha_instalacion": ISODate("2026-02-01T00:00:00Z")
  },
  {
    "_id": "DEV-DOM-003",
    "nombre": "Sensor Confort Estudio",
    "categoria": "domotica",
    "tipo_dispositivo": "Multisensor Confort",
    "ubicacion": {
      "zona": "Interior",
      "subzona": "Estudio"
    },
    "especificaciones": {
      "protocolo": "Zigbee 3.0"
    },
    "estado_operativo": "activo",
    "fecha_instalacion": ISODate("2026-02-01T00:00:00Z")
  },
  {
    "_id": "DEV-DOM-004",
    "nombre": "Sensor Confort Sala",
    "categoria": "domotica",
    "tipo_dispositivo": "Multisensor Confort",
    "ubicacion": {
      "zona": "Interior",
      "subzona": "Sala"
    },
    "especificaciones": {
      "protocolo": "WiFi"
    },
    "estado_operativo": "activo",
    "fecha_instalacion": ISODate("2026-02-01T00:00:00Z")
  }
]);

print(">>> 6 Dispositivos catalogados insertados con éxito.\n");

// ------------------------------------------------------------------------------
// 3. INSERCIÓN DE HISTORIAL DE TELEMETRÍA (Colección: telemetria_lecturas)
// ------------------------------------------------------------------------------
// Se insertan 120 documentos simulados para los días 10 y 11 de noviembre de 2026.
db.telemetria_lecturas.insertMany([
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T00:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 85.0,
      "temperatura_inversor_c": 22.1
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T01:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 81.5,
      "temperatura_inversor_c": 21.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T02:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 78.0,
      "temperatura_inversor_c": 21.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T03:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 74.2,
      "temperatura_inversor_c": 21.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T04:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 70.5,
      "temperatura_inversor_c": 21.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T05:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 66.8,
      "temperatura_inversor_c": 20.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T06:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 180.5,
      "voltaje_pv_v": 61.8,
      "corriente_pv_a": 2.9,
      "nivel_bateria_pct": 65.0,
      "temperatura_inversor_c": 22.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T07:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 450.2,
      "voltaje_pv_v": 64.5,
      "corriente_pv_a": 7.0,
      "nivel_bateria_pct": 68.2,
      "temperatura_inversor_c": 25.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T08:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 890.0,
      "voltaje_pv_v": 68.9,
      "corriente_pv_a": 12.9,
      "nivel_bateria_pct": 74.0,
      "temperatura_inversor_c": 28.4
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T09:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1120.4,
      "voltaje_pv_v": 71.2,
      "corriente_pv_a": 15.7,
      "nivel_bateria_pct": 81.5,
      "temperatura_inversor_c": 31.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T10:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1340.0,
      "voltaje_pv_v": 73.4,
      "corriente_pv_a": 18.3,
      "nivel_bateria_pct": 88.0,
      "temperatura_inversor_c": 33.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T11:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1550.8,
      "voltaje_pv_v": 75.5,
      "corriente_pv_a": 20.5,
      "nivel_bateria_pct": 94.2,
      "temperatura_inversor_c": 36.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T12:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1619.2,
      "voltaje_pv_v": 76.2,
      "corriente_pv_a": 21.2,
      "nivel_bateria_pct": 98.5,
      "temperatura_inversor_c": 37.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T13:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1420.0,
      "voltaje_pv_v": 74.2,
      "corriente_pv_a": 19.1,
      "nivel_bateria_pct": 96.0,
      "temperatura_inversor_c": 36.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T14:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1050.5,
      "voltaje_pv_v": 70.5,
      "corriente_pv_a": 14.9,
      "nivel_bateria_pct": 92.4,
      "temperatura_inversor_c": 34.1
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T15:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 780.0,
      "voltaje_pv_v": 67.8,
      "corriente_pv_a": 11.5,
      "nivel_bateria_pct": 85.0,
      "temperatura_inversor_c": 31.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T16:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 390.2,
      "voltaje_pv_v": 63.9,
      "corriente_pv_a": 6.1,
      "nivel_bateria_pct": 78.2,
      "temperatura_inversor_c": 28.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T17:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 110.0,
      "voltaje_pv_v": 61.1,
      "corriente_pv_a": 1.8,
      "nivel_bateria_pct": 71.5,
      "temperatura_inversor_c": 25.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T18:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 64.0,
      "temperatura_inversor_c": 24.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T19:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 56.2,
      "temperatura_inversor_c": 23.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T20:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 48.0,
      "temperatura_inversor_c": 23.1
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T21:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 39.5,
      "temperatura_inversor_c": 22.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T22:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 31.0,
      "temperatura_inversor_c": 22.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-10T23:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 23.2,
      "temperatura_inversor_c": 22.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T00:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 18.5,
      "temperatura_inversor_c": 21.8
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T01:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 17.1,
      "temperatura_inversor_c": 21.5
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T02:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 15.4,
      "temperatura_inversor_c": 21.2
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T03:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 14.2,
      "temperatura_inversor_c": 21.0
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T04:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 13.0,
      "temperatura_inversor_c": 20.8
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T05:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 12.0,
      "temperatura_inversor_c": 20.5
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T06:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 393.6,
      "voltaje_pv_v": 78.3,
      "corriente_pv_a": 5.0,
      "nivel_bateria_pct": 15.5,
      "temperatura_inversor_c": 23.0
    },
    "alertas": ["bateria_baja"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T07:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 962.3,
      "voltaje_pv_v": 83.0,
      "corriente_pv_a": 11.6,
      "nivel_bateria_pct": 38.0,
      "temperatura_inversor_c": 27.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T08:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1835.4,
      "voltaje_pv_v": 90.3,
      "corriente_pv_a": 20.3,
      "nivel_bateria_pct": 72.4,
      "temperatura_inversor_c": 32.4
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T09:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 2245.4,
      "voltaje_pv_v": 93.7,
      "corriente_pv_a": 24.0,
      "nivel_bateria_pct": 95.0,
      "temperatura_inversor_c": 36.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T10:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 4053.9,
      "voltaje_pv_v": 108.8,
      "corriente_pv_a": 37.3,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 40.5
    },
    "alertas": ["potencia_pico_elevada", "temperatura_inversor_alta"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T11:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 4310.2,
      "voltaje_pv_v": 110.9,
      "corriente_pv_a": 38.9,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 41.2
    },
    "alertas": ["potencia_pico_elevada", "temperatura_inversor_alta"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T12:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 4511.6,
      "voltaje_pv_v": 112.6,
      "corriente_pv_a": 40.1,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 41.7
    },
    "alertas": ["potencia_pico_elevada", "temperatura_inversor_alta"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T13:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 4210.0,
      "voltaje_pv_v": 110.1,
      "corriente_pv_a": 38.2,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 40.8
    },
    "alertas": ["potencia_pico_elevada", "temperatura_inversor_alta"]
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T14:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 3890.5,
      "voltaje_pv_v": 107.4,
      "corriente_pv_a": 36.2,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 39.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T15:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 2714.4,
      "voltaje_pv_v": 97.6,
      "corriente_pv_a": 27.8,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 35.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T16:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 1747.5,
      "voltaje_pv_v": 89.6,
      "corriente_pv_a": 19.5,
      "nivel_bateria_pct": 100.0,
      "temperatura_inversor_c": 31.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T17:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 376.9,
      "voltaje_pv_v": 78.1,
      "corriente_pv_a": 4.8,
      "nivel_bateria_pct": 98.2,
      "temperatura_inversor_c": 26.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T18:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 91.5,
      "temperatura_inversor_c": 24.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T19:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 84.0,
      "temperatura_inversor_c": 23.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T20:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 75.2,
      "temperatura_inversor_c": 23.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T21:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 66.0,
      "temperatura_inversor_c": 22.7
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T22:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 56.5,
      "temperatura_inversor_c": 22.3
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": ISODate("2026-11-11T23:30:00Z"),
    "tipo_evento": "lectura_energia",
    "metricas": {
      "potencia_generada_w": 0,
      "voltaje_pv_v": 0.0,
      "corriente_pv_a": 0.0,
      "nivel_bateria_pct": 47.0,
      "temperatura_inversor_c": 22.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T00:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T02:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T04:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T06:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 120.5,
      "indice_uv": 1.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T08:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 350.0,
      "indice_uv": 3.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T10:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 520.4,
      "indice_uv": 5.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T12:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 610.0,
      "indice_uv": 6.1
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T14:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 580.2,
      "indice_uv": 5.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T16:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 410.0,
      "indice_uv": 4.1
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T18:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 180.5,
      "indice_uv": 1.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T20:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-10T22:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T00:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T02:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T04:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T06:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 280.0,
      "indice_uv": 2.8
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T08:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 650.5,
      "indice_uv": 6.5
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T10:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 890.2,
      "indice_uv": 8.9
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T12:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 1020.0,
      "indice_uv": 10.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T14:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 940.5,
      "indice_uv": 9.4
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T16:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 760.0,
      "indice_uv": 7.6
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T18:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 320.0,
      "indice_uv": 3.2
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T20:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-SOLAR-002",
    "timestamp": ISODate("2026-11-11T22:15:00Z"),
    "tipo_evento": "lectura_radiacion",
    "metricas": {
      "radiacion_w_m2": 0,
      "indice_uv": 0.0
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T00:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 350,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T02:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 280,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T04:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 250,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T06:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 420,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T08:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 850,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T10:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 1150,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T12:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 650,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T14:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 720,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T16:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 1250,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": ["consumo_pico"]
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T18:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 1400,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": ["consumo_pico"]
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T20:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 950,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-10T22:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 500,
      "voltaje_red_v": 118.5,
      "factor_potencia": 0.95
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T00:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 320,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T02:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 270,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T04:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 240,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T06:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 450,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T08:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 920,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T10:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 1280,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": ["consumo_pico"]
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T12:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 710,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T14:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 790,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T16:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 1350,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": ["consumo_pico"]
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T18:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 1420,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": ["consumo_pico"]
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T20:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 880,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-001",
    "timestamp": ISODate("2026-11-11T22:45:00Z"),
    "tipo_evento": "lectura_consumo",
    "metricas": {
      "consumo_w": 480,
      "voltaje_red_v": 119.2,
      "factor_potencia": 0.96
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-10T02:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 18.7,
      "humedad_pct": 62.0,
      "presencia_detectada": true
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-10T08:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.3,
      "humedad_pct": 54.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-10T14:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.9,
      "humedad_pct": 54.0,
      "presencia_detectada": false
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-10T20:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 20.5,
      "humedad_pct": 54.0,
      "presencia_detectada": false
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-10T02:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 21.4,
      "humedad_pct": 57.0,
      "presencia_detectada": false
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-10T08:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 22.0,
      "humedad_pct": 49.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-10T14:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 22.6,
      "humedad_pct": 49.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-10T20:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 23.2,
      "humedad_pct": 49.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-10T02:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.3,
      "humedad_pct": 56.5,
      "presencia_detectada": false
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-10T08:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.9,
      "humedad_pct": 48.5,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-10T14:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 20.5,
      "humedad_pct": 48.5,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-10T20:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 21.1,
      "humedad_pct": 48.5,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-11T02:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 18.7,
      "humedad_pct": 62.0,
      "presencia_detectada": true
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-11T08:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.3,
      "humedad_pct": 54.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-11T14:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.9,
      "humedad_pct": 54.0,
      "presencia_detectada": false
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-11T20:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 20.5,
      "humedad_pct": 54.0,
      "presencia_detectada": false
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-11T02:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 21.4,
      "humedad_pct": 57.0,
      "presencia_detectada": false
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-11T08:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 22.0,
      "humedad_pct": 49.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-11T14:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 22.6,
      "humedad_pct": 49.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-003",
    "timestamp": ISODate("2026-11-11T20:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 23.2,
      "humedad_pct": 49.0,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-11T02:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.3,
      "humedad_pct": 56.5,
      "presencia_detectada": false
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-11T08:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 19.9,
      "humedad_pct": 48.5,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-11T14:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 20.5,
      "humedad_pct": 48.5,
      "presencia_detectada": true
    },
    "alertas": []
  },
  {
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-11T20:20:00Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 21.1,
      "humedad_pct": 48.5,
      "presencia_detectada": true
    },
    "alertas": []
  }
]);

print(">>> 120 Lecturas de telemetría insertadas con éxito.\n");

// ------------------------------------------------------------------------------
// 4. CREACIÓN DE ÍNDICES OPTIMIZADOS
// ------------------------------------------------------------------------------
db.telemetria_lecturas.createIndex({ "dispositivo_id": 1, "timestamp": 1 });
db.telemetria_lecturas.createIndex({ "tipo_evento": 1, "timestamp": 1 });

print(">>> Índices compuestos creados exitosamente.\n");

// ==============================================================================
// 5. IMPLEMENTACIÓN DE CONSULTAS MONGODB (17 OPERACIONES SOLICITADAS)
// ==============================================================================

print("------------------------------------------------------------------");
print("SECCIÓN A: OPERACIONES CRUD BÁSICAS");
print("------------------------------------------------------------------");

// Consulta 1: insertOne - Registro individual de lectura de energía
print("\n--- 1. insertOne: Registro manual de lectura del inversor ---");
db.telemetria_lecturas.insertOne({
  "_id": ObjectId("67341a2b8f1c2d0012345678"),
  "dispositivo_id": "DEV-SOLAR-001",
  "timestamp": ISODate("2026-11-12T14:30:00Z"),
  "tipo_evento": "lectura_energia",
  "metricas": {
    "potencia_generada_w": 3450.5,
    "voltaje_pv_v": 82.4,
    "corriente_pv_a": 41.8,
    "nivel_bateria_pct": 88.5,
    "temperatura_inversor_c": 38.2
  },
  "alertas": []
});

// Consulta 2: insertMany - Registro de lecturas domóticas heterogéneas
print("\n--- 2. insertMany: Registro de lecturas domóticas de ambiente ---");
db.telemetria_lecturas.insertMany([
  {
    "_id": ObjectId("67341a2b8f1c2d0012345679"),
    "dispositivo_id": "DEV-DOM-004",
    "timestamp": ISODate("2026-11-12T14:30:05Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 22.4,
      "humedad_pct": 55.0,
      "consumo_carga_w": 180.0,
      "presencia_detectada": true
    },
    "alertas": ["humedad_elevada"]
  },
  {
    "dispositivo_id": "DEV-DOM-002",
    "timestamp": ISODate("2026-11-12T14:30:10Z"),
    "tipo_evento": "lectura_ambiente",
    "metricas": {
      "temperatura_c": 21.1,
      "humedad_pct": 58.0,
      "presencia_detectada": false
    },
    "alertas": ["humedad_elevada"]
  }
]);

// Consulta 3: find - Selección proyectada del inversor en horas pico del 11-nov
print("\n--- 3. find: Lecturas del inversor entre 10:00 y 14:45 (hora local) ---");
db.telemetria_lecturas.find(
  {
    "dispositivo_id": "DEV-SOLAR-001",
    "timestamp": {
      "$gte": ISODate("2026-11-11T15:00:00Z"),
      "$lte": ISODate("2026-11-11T19:45:00Z")
    }
  },
  {
    "_id": 0,
    "timestamp": 1,
    "metricas.potencia_generada_w": 1,
    "metricas.nivel_bateria_pct": 1
  }
).sort({ "timestamp": 1 });

// Consulta 4: updateOne - Cambio de estado de un dispositivo a mantenimiento
print("\n--- 4. updateOne: Cambiar estado operativo del sensor DEV-DOM-002 ---");
db.dispositivos.updateOne(
  { "_id": "DEV-DOM-002" },
  {
    "$set": {
      "estado_operativo": "mantenimiento",
      "fecha_ultimo_mantenimiento": ISODate("2026-11-12T00:00:00Z")
    }
  }
);

// Consulta 5: deleteOne - Purgar documento de prueba
print("\n--- 5. deleteOne: Purgar documento temporal de prueba ---");
db.telemetria_lecturas.insertOne({
  "_id": "PRUEBA-001",
  "dispositivo_id": "DEV-DOM-001",
  "tipo_evento": "prueba"
});

db.telemetria_lecturas.deleteOne({ "_id": "PRUEBA-001" });
print("Documento PRUEBA-001 eliminado con éxito.");


print("\n------------------------------------------------------------------");
print("SECCIÓN B: CONSULTAS CON FILTROS Y OPERADORES AVANZADOS");
print("------------------------------------------------------------------");

// Consulta 6: Filtro por Rango ($lt) - Lecturas con batería crítica (< 20%)
print("\n--- 6. Filtro $lt: Lecturas con carga de batería por debajo del 20% ---");
db.telemetria_lecturas.find(
  {
    "tipo_evento": "lectura_energia",
    "metricas.nivel_bateria_pct": { "$lt": 20 }
  },
  {
    "_id": 0,
    "timestamp": 1,
    "metricas.nivel_bateria_pct": 1,
    "alertas": 1
  }
).sort({ "timestamp": 1 });

// Consulta 7: Filtro por Rango ($gt) - Potencia generada superior a 4000 W
print("\n--- 7. Filtro $gt: Lecturas con generación solar > 4000 W ---");
db.telemetria_lecturas.find(
  {
    "metricas.potencia_generada_w": { "$gt": 4000 }
  },
  {
    "_id": 0,
    "timestamp": 1,
    "metricas.potencia_generada_w": 1,
    "metricas.temperatura_inversor_c": 1
  }
).sort({ "timestamp": 1 });

// Consulta 8: Operador Lógico ($and) - Humedad elevada con presencia detectada
print("\n--- 8. Operador $and: Humedad >= 55% y presencia activa ---");
db.telemetria_lecturas.find(
  {
    "$and": [
      { "tipo_evento": "lectura_ambiente" },
      { "metricas.presencia_detectada": true },
      { "metricas.humedad_pct": { "$gte": 55 } }
    ]
  },
  {
    "_id": 0,
    "dispositivo_id": 1,
    "timestamp": 1,
    "metricas.humedad_pct": 1
  }
);

// Consulta 9: Operadores Lógicos ($or, $in) - Conteo de eventos críticos del sistema
print("\n--- 9. Operadores $or y $in: Conteo total de eventos críticos ---");
const totalCriticos = db.telemetria_lecturas.countDocuments({
  "tipo_evento": { "$in": ["lectura_energia", "lectura_consumo"] },
  "$or": [
    { "metricas.potencia_generada_w": { "$gt": 4000 } },
    { "metricas.nivel_bateria_pct": { "$lt": 20 } },
    { "metricas.consumo_w": { "$gt": 1200 } }
  ]
});
print("Total de eventos críticos registrados: " + totalCriticos);


print("\n------------------------------------------------------------------");
print("SECCIÓN C: UNIÓN DE COLECCIONES ($lookup)");
print("------------------------------------------------------------------");

// Consulta 10: $lookup + $unwind - Ubicación física de lecturas con batería baja
print("\n--- 10. $lookup: Cruzar lecturas de batería baja con ubicación del equipo ---");
db.telemetria_lecturas.aggregate([
  {
    "$match": {
      "tipo_evento": "lectura_energia",
      "metricas.nivel_bateria_pct": { "$lt": 20 }
    }
  },
  {
    "$lookup": {
      "from": "dispositivos",
      "localField": "dispositivo_id",
      "foreignField": "_id",
      "as": "dispositivo"
    }
  },
  { "$unwind": "$dispositivo" },
  {
    "$project": {
      "_id": 0,
      "timestamp": 1,
      "bateria_pct": "$metricas.nivel_bateria_pct",
      "dispositivo": "$dispositivo.nombre",
      "zona": "$dispositivo.ubicacion.zona",
      "subzona": "$dispositivo.ubicacion.subzona"
    }
  },
  { "$sort": { "timestamp": 1 } }
]);

// Consulta 11: $lookup + $group - Promedio de confort por subzona de la vivienda
print("\n--- 11. $lookup + $group: Confort ambiental promedio por habitación ---");
db.telemetria_lecturas.aggregate([
  { "$match": { "tipo_evento": "lectura_ambiente" } },
  {
    "$lookup": {
      "from": "dispositivos",
      "localField": "dispositivo_id",
      "foreignField": "_id",
      "as": "dispositivo"
    }
  },
  { "$unwind": "$dispositivo" },
  {
    "$group": {
      "_id": "$dispositivo.ubicacion.subzona",
      "lecturas": { "$sum": 1 },
      "temp_prom_c": { "$avg": "$metricas.temperatura_c" },
      "hum_prom_pct": { "$avg": "$metricas.humedad_pct" }
    }
  },
  {
    "$set": {
      "temp_prom_c": { "$round": ["$temp_prom_c", 1] },
      "hum_prom_pct": { "$round": ["$hum_prom_pct", 1] }
    }
  },
  { "$sort": { "_id": 1 } }
]);


print("\n------------------------------------------------------------------");
print("SECCIÓN D: CONSULTAS DE AGREGACIÓN ESTADÍSTICA");
print("------------------------------------------------------------------");

// Consulta 12: $avg - Generación solar promedio por hora del día (Hora Local Bogotá)
print("\n--- 12. $avg: Potencia solar promedio por hora del día ---");
db.telemetria_lecturas.aggregate([
  {
    "$match": {
      "tipo_evento": "lectura_energia",
      "timestamp": {
        "$gte": ISODate("2026-11-10T05:00:00Z"),
        "$lt": ISODate("2026-11-12T05:00:00Z")
      }
    }
  },
  {
    "$group": {
      "_id": { "$hour": { "date": "$timestamp", "timezone": "America/Bogota" } },
      "potencia_prom_w": { "$avg": "$metricas.potencia_generada_w" }
    }
  },
  {
    "$set": {
      "potencia_prom_w": { "$round": ["$potencia_prom_w", 1] }
    }
  },
  { "$sort": { "_id": 1 } }
]);

// Consulta 13: $sum, $max, $min - Resumen diario de generación y batería
print("\n--- 13. $sum, $max, $min: Resumen diario del sistema fotovoltaico ---");
db.telemetria_lecturas.aggregate([
  {
    "$match": {
      "tipo_evento": "lectura_energia",
      "timestamp": {
        "$gte": ISODate("2026-11-10T05:00:00Z"),
        "$lt": ISODate("2026-11-12T05:00:00Z")
      }
    }
  },
  {
    "$group": {
      "_id": { "$dateToString": { "format": "%Y-%m-%d", "date": "$timestamp", "timezone": "America/Bogota" } },
      "energia_kwh": { "$sum": { "$divide": ["$metricas.potencia_generada_w", 1000] } },
      "pico_w": { "$max": "$metricas.potencia_generada_w" },
      "bateria_min_pct": { "$min": "$metricas.nivel_bateria_pct" },
      "lecturas": { "$sum": 1 }
    }
  },
  {
    "$set": {
      "energia_kwh": { "$round": ["$energia_kwh", 2] }
    }
  },
  { "$sort": { "_id": 1 } }
]);

// Consulta 14: $sum - Balance energético del día 11 de noviembre (Generada vs Consumida)
print("\n--- 14. Balance Energético del 11-Nov: Energía Generada vs. Consumida ---");
db.telemetria_lecturas.aggregate([
  {
    "$match": {
      "tipo_evento": { "$in": ["lectura_energia", "lectura_consumo"] },
      "timestamp": {
        "$gte": ISODate("2026-11-11T05:00:00Z"),
        "$lt": ISODate("2026-11-12T05:00:00Z")
      }
    }
  },
  {
    "$group": {
      "_id": null,
      "generada_wh": { "$sum": { "$ifNull": ["$metricas.potencia_generada_w", 0] } },
      "consumida_wh": { "$sum": { "$ifNull": ["$metricas.consumo_w", 0] } }
    }
  },
  {
    "$project": {
      "_id": 0,
      "generada_kwh": { "$round": [{ "$divide": ["$generada_wh", 1000] }, 2] },
      "consumida_kwh": { "$round": [{ "$divide": ["$consumida_wh", 1000] }, 2] },
      "balance_kwh": {
        "$round": [
          { "$divide": [{ "$subtract": ["$generada_wh", "$consumida_wh"] }, 1000] },
          2
        ]
      }
    }
  }
]);

// Consulta 15: $unwind + $group - Conteo y clasificación de alertas del 11-Nov
print("\n--- 15. Clasificación y conteo de alertas operativas del 11-Nov ---");
db.telemetria_lecturas.aggregate([
  {
    "$match": {
      "timestamp": {
        "$gte": ISODate("2026-11-11T05:00:00Z"),
        "$lt": ISODate("2026-11-12T05:00:00Z")
      },
      "alertas.0": { "$exists": true }
    }
  },
  { "$unwind": "$alertas" },
  {
    "$group": {
      "_id": "$alertas",
      "total": { "$sum": 1 }
    }
  },
  { "$sort": { "total": -1, "_id": 1 } }
]);

// Consulta 16: $count - Total de alertas registradas el 11-Nov
print("\n--- 16. $count: Cuantificación total de alertas del 11-Nov ---");
db.telemetria_lecturas.aggregate([
  {
    "$match": {
      "timestamp": {
        "$gte": ISODate("2026-11-11T05:00:00Z"),
        "$lt": ISODate("2026-11-12T05:00:00Z")
      }
    }
  },
  { "$unwind": "$alertas" },
  { "$count": "total_alertas" }
]);

// Consulta 17: $group - Distribución total de documentos por tipo de evento
print("\n--- 17. Distribución total de documentos por tipo de evento ---");
db.telemetria_lecturas.aggregate([
  {
    "$group": {
      "_id": "$tipo_evento",
      "total": { "$sum": 1 }
    }
  },
  { "$sort": { "total": -1 } }
]);

print("\n==================================================================");
print(">>> EJECUCIÓN DEL SCRIPT FINALIZADA EXITOSAMENTE.");
print("==================================================================");
