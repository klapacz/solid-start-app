import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "./schema.generated";
import { Pool } from "pg";
import { serverEnv } from "~/env/server";

export const db = new Kysely<DB>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: serverEnv.DATABASE_URL,
    }),
  }),
});
