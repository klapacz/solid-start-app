import { ResultAsync } from "neverthrow";
import { db } from "../core/db";

export const Users = {
  findOrCreateByEmail(email: string) {
    return ResultAsync.fromPromise(
      db
        .insertInto("user")
        .values({
          email,
        })
        .returning("user.id")
        .onConflict((qb) => qb.doNothing())
        .executeTakeFirstOrThrow(),
      (err) => err
    );
  },
};
