import type { Selectable } from "kysely";
import { sql } from "kysely";
import { ResultAsync } from "neverthrow";
import { db } from "~/lib/core/db";
import type { User } from "~/lib/core/db/schema.generated";

export const Users = {
  findOrCreateByEmail(email: string): ResultAsync<Selectable<User>, unknown> {
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
  updateSetConfirmed(userId: string): ResultAsync<Selectable<User>, unknown> {
    return ResultAsync.fromPromise(
      db
        .updateTable("user")
        .set({ status: "CONFIRMED" })
        .where("id", "=", userId)
        .returningAll()
        .executeTakeFirstOrThrow(),
      (err) => err
    );
  },
};
