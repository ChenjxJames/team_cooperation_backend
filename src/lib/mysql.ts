import { Pool, Connection } from 'none-sql';

export class MySqlPool {
  static pool: Pool;

  static init(config: {dbname: string, username: string, password: string, host: string, connectionLimit: number}) {
    MySqlPool.pool = new Pool(
      config.dbname, 
      config.username, 
      config.password, 
      config.host, 
      config.connectionLimit
    );
  }

  static async getConnection(): Promise<Connection> {
    return MySqlPool.pool.getConnection();
  }
  
  static async release(connection: Connection) {
    connection.connection.release();
  }
}