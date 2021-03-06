import _ from 'lodash'
import { neo4jgraphql } from "neo4j-graphql-js";
import fs from "fs";
import path from "path";
import { CypherBuilder } from './cypherBuilder'

/*
!!Important: To read Quark, you have to use "mutation", instead of "query".
This is because, there is no way to retrieve Labels from node except using SET clause with labels(node) function.
SET clause is restricted to use in Query, so even though Quark is not a Mutation, I needed to put it in mutation part.
*/

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */

const readText = (filename) => {
  return fs.readFileSync(path.join(__dirname, `schemas/${filename}`)).toString("utf-8");
}

// read graphql schema parts
const quarkFields = readText('schema.quarkFields');
const gluonFields = readText('schema.gluonFields');
const periodFields = readText('schema.periodFields');
const commonFields = readText('schema.commonFields');
const quarkFieldsAll = `${quarkFields}${periodFields}${commonFields}`
const gluonFieldsAll = `${gluonFields}${periodFields}${commonFields}`
const quarkMutateFields = readText('schema.quarkMutateFields');
const gluonMutateFields = readText('schema.gluonMutateFields');
// read cypher parts
const cypher = new CypherBuilder()
const cypherMatchNeighbor = cypher.matchNeighbor('this', 'gluon', 'object');
const cypherWherePublic = cypher.wherePublic()
const cypherWherePublicObject = cypher.wherePublic('object')
const cypherWherePublicRelation = cypher.wherePublic('relation')
const cypherWhereUsersNode = cypher.whereUsersNode()
const cypherWhereUsersObject = cypher.whereUsersNode('object')
const cypherWhereUsersRelation = cypher.whereUsersNode('relation')
const cypherWhereTopNodes = cypher.whereTopNodes()
const cypherOrderByStartDesc = cypher.orderByStartDesc('gluon', 'object')
const cypherOrderByCreatedDesc = cypher.orderByCreatedDesc()

// read graphql schema
const schemaCompiled = _.template(readText('schema.graphql'));

// Replacing the paramitized values
export const typeDefs = schemaCompiled({
  quarkFields,
  gluonFields,
  quarkFieldsAll,
  gluonFieldsAll,
  commonFields,
  quarkMutateFields,
  gluonMutateFields,
  cypherMatchNeighbor,
  cypherWherePublic,
  cypherWherePublicObject,
  cypherWherePublicRelation,
  cypherWhereUsersNode,
  cypherWhereUsersObject,
  cypherWhereUsersRelation,
  cypherWhereTopNodes,
  cypherOrderByStartDesc,
  cypherOrderByCreatedDesc
})
