import pg from 'pg';
const { Pool } = pg;

// Aquí pones tus datos
const pool = new Pool({
  user:'milton',
  host:'localhost',
  database:'prestamos',
  password:'123456',
  port:5432,
});

// Verificar conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error de conexión a PostgreSQL:', err);
});
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL verificada correctamente');
    client.release();
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error.message);
  }
};

testConnection();


export default pool;