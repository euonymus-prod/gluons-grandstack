import { neo4jgraphql } from "neo4j-graphql-js";
import fs from "fs";
import path from "path";

/*
!!Important: To read Quark, you have to use "mutation", instead of "query".
This is because, there is no way to retrieve Labels from node except using SET clause with labels(node) function.
SET clause is restricted to use in Query, so even though Quark is not a Mutation, I needed to put it in mutation part.
*/

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */

export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql")
  )
  .toString("utf-8");
