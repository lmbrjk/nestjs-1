import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, 
    migrations: [__dirname + 'migrations/**/*.entity{.ts,.js}'],
    // cli: {
    //   migrationsDir: 'src/migrations'
    // }
};

export default config;