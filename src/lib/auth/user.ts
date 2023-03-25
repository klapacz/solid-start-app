import { sql } from "kysely";
import { ResultAsync } from "neverthrow";
import { db } from "../core/db";

export const Users = {
  findOrCreateByEmail(email: string) {
    return ResultAsync.fromPromise(
      db
        .with("maybe_created_user", () =>
          db
            .insertInto("user")
            .values({
              email,
            })
            .onConflict((qb) => qb.column("email").doNothing())
            .returningAll()
        )
        .selectFrom("maybe_created_user")
        .selectAll("maybe_created_user")
        .union(
          db
            .selectFrom("user")
            .selectAll("user")
            .where("email", "=", sql<string>`lower(trim(${email}))`)
        )
        .executeTakeFirstOrThrow(),
      (err) => err
    );
  },
};
