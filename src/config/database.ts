import mysql from 'mysql2/promise'
import { config } from './index'

let pool: mysql.Pool | null = null

export const getDatabasePool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}

export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getDatabasePool().getConnection()
    await connection.ping()
    connection.release()
    console.log('Database connection established successfully')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end()
    pool = null
  }
}
