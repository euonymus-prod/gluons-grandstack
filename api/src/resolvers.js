import _ from 'lodash'
// import { neo4jgraphql } from 'neo4j-graphql-js'
import { firebaseInstance, getAuthorizationHeader } from './utils/firebase'
import { quarkLabelsData } from './constants/quark-labels'
import { gluonTypesData } from './constants/gluon-types'
import { quarkPropertiesData } from './constants/quark-properties'
import { qtypePropertiesData } from './constants/qtype-properties'
import { qpropertyGtypesData } from './constants/qproperty-gtypes'
import * as ID_TYPE from './constants/id-types'
import * as DIRECTION from './constants/gluon-directions'
import Neo4jUtil from './utils/neo4jutil'

const neou = new Neo4jUtil(false)
/*
// sample CYPHER

CALL apoc.cypher.run('MATCH (subject {name:"眞弓聡"})-[gluon:SON_OF|DAUGHTER_OF]->(object) RETURN subject, object, gluon UNION MATCH (subject {name: "眞弓聡"})<-[gluon:SON_OF|DAUGHTER_OF]-(object) RETURN subject, object, gluon', NULL) YIELD value
RETURN value.subject as subject, value.object as object, value.gluon as gluon
ORDER BY (CASE gluon.start WHEN null THEN {} ELSE gluon.start END) DESC, (CASE object.start WHEN null THEN {} ELSE object.start END) DESC

MATCH (subject {name:"眞弓聡"})-[r1:SON_OF|DAUGHTER_OF]->(n1), (subject)<-[r2:SON_OF|DAUGHTER_OF]-(n2) 
WITH subject, collect(DISTINCT n1) + collect(DISTINCT n2) as object, collect(DISTINCT r1) + collect(DISTINCT r2) as relation
RETURN subject, object, relation

MATCH (subject {name:"眞弓聡"})-[r:SON_OF|DAUGHTER_OF]->(object)
RETURN subject, object, r
UNION
MATCH (subject {name: "眞弓聡"})<-[r:SON_OF|DAUGHTER_OF]-(object) 
RETURN subject, object, r
*/

const revertDirection = (direction) => {
  if (direction === DIRECTION.A2B) {
    return DIRECTION.B2A
  } else if (direction === DIRECTION.B2A) {
    return DIRECTION.A2B
  }
  return false
}

const getQuarkProperties = (quark_type_id) => {
  const property_ids = _.map(qtypePropertiesData[quark_type_id], 'property_id')
  return getQuarkPropertiesByIds(property_ids)
}
const getQuarkPropertiesByIds = (ids) => {
  const otherProperty = getOtherQuarkProperties()
  let selectedProperties = []
  if (ids.length === 0) {
    // return all
    selectedProperties = _.map(quarkPropertiesData, (data, id) => {
      const relatedQpropertyGtypes = getQpropertyGtypes(id)
      return {id, qpropertyGtypes: relatedQpropertyGtypes, ...data}
    })
    // .slice(0, first)
  } else {
    selectedProperties = ids.map(id => {
      const relatedQpropertyGtypes = getQpropertyGtypes(id)
      return {id, qpropertyGtypes: relatedQpropertyGtypes, ...quarkPropertiesData[id]}
    })
  }
  const relatedQpropertyGtypes = getQpropertyGtypes(null, ids)
  selectedProperties.push({ qpropertyGtypes: relatedQpropertyGtypes, ...otherProperty })
  return selectedProperties
}
const getOtherQuarkProperties = () => {
  return { id: ID_TYPE.NONE, caption: 'relations', caption_ja: '関係' }
}

const getQpropertyGtypes = (quarkPropertyId, avoidQuarkPropertyIds = []) => {
  let selectedGtypes = []
  // for other relaiton
  if (quarkPropertyId === null) {
    const modifiedGtypes = {}
    avoidQuarkPropertyIds.forEach(quarkPropertyId => {
      if (qpropertyGtypesData[quarkPropertyId]) {
        qpropertyGtypesData[quarkPropertyId].forEach(gtypes => {
          const direction = revertDirection(gtypes.direction)
          if (direction && (modifiedGtypes[gtypes.gluon_type_id] !== false)) {
            if (modifiedGtypes[gtypes.gluon_type_id]) {
              if (modifiedGtypes[gtypes.gluon_type_id].direction === gtypes.direction) {
                modifiedGtypes[gtypes.gluon_type_id] = false
              }
            } else {
              modifiedGtypes[gtypes.gluon_type_id] = { ...gtypes, direction }
            }
          } else {
            modifiedGtypes[gtypes.gluon_type_id] = false
          }
        })
      }
    })

    // return all
    selectedGtypes = _.map(gluonTypesData, (data, gluon_type_id) => {
      if (modifiedGtypes[gluon_type_id]) {
        return {gluon_type_id: modifiedGtypes[gluon_type_id].gluon_type_id, direction: modifiedGtypes[gluon_type_id].direction, ...data}
      } else if (modifiedGtypes[gluon_type_id] === false) {
        return false
      }
      return {gluon_type_id, direction: DIRECTION.BOTH, ...data}
    }).filter(value => value)
    // .slice(0, first)
  // for specific quark_property
  } else {
    // because some quark_property_id doesn't exist on qproperty_gtypes table
    if (qpropertyGtypesData[quarkPropertyId]) {
      selectedGtypes = qpropertyGtypesData[quarkPropertyId].map(gtypes => {
        return {gluon_type_id: gtypes.gluon_type_id, direction: gtypes.direction, ...gluonTypesData[gtypes.gluon_type_id]}
      })
    }
  }
  return selectedGtypes
}

// const Quark = (parent, {name}, context, info) => {
//   return neo4jgraphql(parent, {name}, context, info);
// }
// const QuarkProperty = (parent, {ids}, context, info) => {
//   return { caption: 'hoge' }
// }
// const quarkProperties = (parent, {ids}, context, info) => {
//   return getQuarkProperties(ids)
// }
const qpropertyGtypes = (parent, {quarkPropertyId, avoidQuarkPropertyIds}, context, info) => {
  return getQpropertyGtypes(quarkPropertyId, avoidQuarkPropertyIds)
}
const quarkLabels = (parent, {}, context, info) => {
  // return all
  return _.map(quarkLabelsData, (data, quark_label_id) => {
    return { id: quark_label_id, ...data }
  })
}
const gluonTypes = (parent, {}, context, info) => {
  // return all
  return _.map(gluonTypesData, (data, gluon_type_id) => {
    return { id: gluon_type_id, ...data }
  })
}

const quarkPropertiesResolver= (parent, params, context, info) => {
  if (parent.quark_type_id === null) {
    return [{...getOtherQuarkProperties(), gluons: parent.gluons, subject_id: parent.id, qpropertyGtypes: null}]
  } else if (!parent.quark_type_id) {
    throw Error("Quark.quark_type_id are required in the parent query");
  }
  return getQuarkProperties(parent.quark_type_id).map(property => {
    return {...property, gluons: parent.gluons, subject_id: parent.id}
  })
  // return [{caption:'hoge'}]
}

// Note: if you don't create resolver specifically, auto generated resolver will call cypher automatically, and generate node
//       but, the problem is, it can't modify Label by param, and start datetime modification also needed
const createQuarkResolver = async (parent, params, context, info) => {
  if ((!params.name) && (!params.name_ja)) {
    throw Error("name property is required");
  }
  const user = await getUser(context)
  const user_id = user.user_id
  // const user_id = firebaseInstance.temporalUserId(user.user_id)

  const Label = `:${neou.getLabel(params.quark_type_id)}`
  let existingParams = generateCypherParams(params)
  const {datetimeSetter, paramsReady} = generateDatetimeParams(params)
  
  const cypher = `CREATE (node:Quark${Label} { id: apoc.create.uuid()${existingParams}, user_id: "${user_id}", last_modified_user: "${user_id}" }) SET ${datetimeSetter} RETURN node`

  return neou.execCypherAndReadResponse(context.driver, cypher, paramsReady)
}
const updateQuarkResolver = async (parent, params, context, info) => {
  const user = await getUser(context)
  const last_modified_user = user.user_id
  // const last_modified_user = firebaseInstance.temporalUserId(user.user_id)

  // Read current node by id
  const readCypher = `MATCH (node:Quark { id: "${params.id}" }) RETURN node`
  // const readCypher = `MATCH (node:Quark { id: "hhhh" }) RETURN node`
  const existingProps = await neou.execCypherAndReadResponse(context.driver, readCypher)
  if (Object.keys(existingProps).length === 0) {
    throw Error("No node found");
  }
  let updateLabelPre = '';        
  let updateLabelPost = '';        
  if (params.quark_type_id && (Number(params.quark_type_id) !== Number(existingProps.quark_type_id))) {
    const label = neou.getLabel(params.quark_type_id)
    const old_label = neou.getLabel(existingProps.quark_type_id)
    updateLabelPre = ` REMOVE node:${old_label}`
    updateLabelPost = `, node:${label}`
  }

  const paramSetter = generateUpdatingParams({...params, last_modified_user})
  const cypher = `MATCH (node:Quark { id: "${params.id}" }) ${updateLabelPre} SET node += { ${paramSetter} } ${updateLabelPost} RETURN node`
  return neou.execCypherAndReadResponse(context.driver, cypher)
}

const createGluonResolver = async (parent, params, context, info) => {
  return createGluon(params, context)
}
const createGluon = async (params, context) => {
  const user = await getUser(context)
  const user_id = user.user_id
  // const user_id = firebaseInstance.temporalUserId(user.user_id)

  let TypeInCypher = ""
  const Type = neou.getType(params.gluon_type_id)
  if (Type) {
    TypeInCypher = `:${Type}`
  }
  // NOTE: You have to set gluon_type_id explicitly, even if gluon_type_id param doen't exist
  const gluon_type_id = neou.sanitizeGluonTypeId(params.gluon_type_id)

  let passive_id = params.passive_id
  if (!passive_id) {
    if (!params.passive) {
      throw Error("passive_id or passive name is required");
    }
    // Read passive_id by name
    const readCypher = `MATCH (node:Quark) WHERE (node.name = "${params.passive}" OR node.name_ja = "${params.passive}") RETURN node`
    const passiveNode = await neou.execCypherAndReadResponse(context.driver, readCypher)
    if (Object.keys(passiveNode).length === 0) {
      throw Error("No node found");
    }
    passive_id = passiveNode.id
  }
  let existingParams = generateCypherSettingParams({ ...params, passive_id })

  const targetResource = 'relation'
  const cypher = `
    MATCH (active:Quark {id: "${params.active_id}"}),(passive:Quark {id: "${passive_id}"})
    CREATE (active)-[ ${targetResource}${TypeInCypher}  ]->(passive)
    SET
        ${targetResource}.id = apoc.create.uuid(),
        ${targetResource}.gluon_type_id = ${gluon_type_id},
        ${existingParams},
        ${targetResource}.user_id = "${user_id}",
        ${targetResource}.last_modified_user = "${user_id}",
        ${targetResource}.created = datetime(),
        ${targetResource}.modified = datetime()
    RETURN ${targetResource}`

  return neou.execCypherAndReadResponse(context.driver, cypher, null, targetResource)
}
const updateGluonResolver = async (parent, params, context, info) => {
  const user = await getUser(context)
  const last_modified_user = user.user_id
  // const last_modified_user = firebaseInstance.temporalUserId(user.user_id)

  // Read current relation by id
  const targetResource = 'relation'
  const readCypher = `MATCH (active)-[${targetResource} {id: "${params.id}"}]->(passive) RETURN ${targetResource}`
  const existingProps = await neou.execCypherAndReadResponse(context.driver, readCypher, null, targetResource)
  if (existingProps) {
    throw Error("No relation found");
  }
  // MEMO: You cannot change type, but you can recreate one
  // https://community.neo4j.com/t/change-relationships-name/6473
  if (params.gluon_type_id && (Number(params.gluon_type_id) !== Number(existingProps.gluon_type_id))) {
    const type = neou.getType(params.gluon_type_id)
    const old_type = neou.getType(existingProps.gluon_type_id)

    const active_id = existingProps.active_id
    const passive_id = existingProps.passive_id
    const newParams = { ..._.omit(params, ['id']), active_id, passive_id }
    const res = createGluon(newParams, context)

    const cypherToChangeType = `MATCH (active)-[origin {id: "${params.id}"}]->(passive) DELETE origin`
    await neou.execCypher(context.driver, cypherToChangeType)
    return res
  } else {
    const paramSetter = generateUpdatingParams({...params, last_modified_user}, true)
    const cypher = `MATCH (active)-[${targetResource} {id: "${params.id}"}]->(passive) SET ${targetResource} += { ${paramSetter} } RETURN ${targetResource}`

    return neou.execCypherAndReadResponse(context.driver, cypher, null, targetResource)
  }
}


// { hoge: foo, hage: bar } will become cypher snippet of ", hoge: $hoge, hage: $hage"
const generateCypherParams = params => {
  return `, ${neou.cypherSnippetArgsFromParams(params)}`
}
const generateCypherSettingParams = params => {
  const avoids = ['id', 'gluon_type_id', 'passive']
  const targets = _.omit(params, avoids)
  return neou.cypherSnippetFromParamsForGluon(targets, true, "relation")
}

const generateDatetimeParams = params => {
  const autoGenerated = ['modified', 'created']
  const targetResource = 'node'

  const targetParams = {}
  autoGenerated.forEach(paramKey => {
    targetParams[paramKey] = neou.generateDatetimeParam(paramKey)
  })
  targetParams['quark_type_id'] = neou.generateIntParam('quark_type_id', params.quark_type_id)

  const existingDatetimeParams = neou.existingDatetimeParams(params)
  existingDatetimeParams.map(paramKey => {
    targetParams[paramKey] = `CASE ${targetResource}.${paramKey}
                                 WHEN 'NULL' THEN null
                                 WHEN '0000-00-00 00:00:00' THEN null
                                 ELSE datetime(${targetResource}.${paramKey})
                              END`
  })
  const datetimeSetter = _.map(targetParams, (value, key) => {
    return neou.cypherSnippetParamSetter(key, value, targetResource)
  }).filter(data => data).join(',')
  
  const paramsReady = { ...params, quark_type_id: neou.sanitizeQuarkTypeId(params.quark_type_id) }
  existingDatetimeParams.forEach(paramKey => {
    paramsReady[paramKey] = neou.generateDatetimeParam(params[paramKey])
  })
  paramsReady.image_path = neou.sanitizeImagePath(paramsReady)
  return {datetimeSetter, paramsReady}
}
const generateUpdatingParams = (params, forGluon = false) => {
  const avoids = ['id', 'active_id', 'passive_id']
  const targets = _.omit(params, avoids)
  targets.modified = {formatted:''}
  targets.image_path = neou.sanitizeImagePath(targets)

  const func = forGluon ? neou.cypherSnippetFromParamsForGluon : neou.cypherSnippetFromParamsForQuark
  return func(targets, false)
}

const getUser = async context => {
  const idToken = getAuthorizationHeader(context);
  const user = await firebaseInstance.getLoggedIn(idToken)
  if (!user) {
    throw Error("The user must be logged in");
  }
  return user
}
export const resolvers = {
  Quark: {
    properties: quarkPropertiesResolver
  },
  TopQuark: {
    properties: quarkPropertiesResolver
  },
  // LoggedInQuark: {
  //   properties: quarkPropertiesResolver
  // },
  // AdminQuark: {
  //   properties: quarkPropertiesResolver
  // },
  QuarkProperty: {
    gluons: (parent, {subject}, context, info) => {
      if (!parent.gluons || parent.gluons.length === 0) {
        // throw Error("QuarkProperty.gluons are required in the parent query");
        return []
      }
      return parent.gluons.filter(gluon => {
        // NOTE: You cannot set object_id here on GraphQL. This make it stateful, because object_id depends on subject.
        // if (parent.subject_id === gluon.active_id) {
        //   gluon.object_id = gluon.passive_id
        // } else if (parent.subject_id === gluon.passive_id) {
        //   gluon.object_id = gluon.active_id
        // }
        let result = false
        if (parent.qpropertyGtypes === null) {
          result = true
        } else {
          parent.qpropertyGtypes.some(gtype => {
            if ( (parent.id === ID_TYPE.NONE) && (gluon.gluon_type_id === null) ) {
              result = true
            } else if (gluon.gluon_type_id !== gtype.gluon_type_id) {
              return false
            }
            if (gtype.direction === DIRECTION.A2B) {
              if (parent.subject_id === gluon.active_id) {
                result = true
              }
            } else if (gtype.direction === DIRECTION.B2A) {
              if (parent.subject_id === gluon.passive_id) {
                result = true
              }
            } else {
              result = true
            }
            if (result) {
              return true
            }
          })
        }
        return result
      })
      /*
CALL apoc.cypher.run('MATCH (subject {name:"眞弓聡"})-[gluon:SON_OF|DAUGHTER_OF]->(object) RETURN subject, object, gluon UNION MATCH (subject {name: "眞弓聡"})<-[gluon:SON_OF|DAUGHTER_OF]-(object) RETURN subject, object, gluon', NULL) YIELD value
RETURN value.subject as subject, value.object as object, value.gluon as gluon
      ORDER BY (CASE gluon.start WHEN null THEN {} ELSE gluon.start END) DESC, (CASE object.start WHEN null THEN {} ELSE object.start END) DESC
      */
      return []
    }
  },
  Query: {
    qpropertyGtypes,
    quarkLabels,
    gluonTypes
  },
  Mutation: {
    CreateQuark: createQuarkResolver,
    UpdateQuark: updateQuarkResolver,
    CreateGluon: createGluonResolver,
    UpdateGluon: updateGluonResolver
  }
}

// 
// 
// 
// export const resolvers = {
// 
//   Tag : {
//     elements : (object, params, ctx, resolveInfo) => {
//       params["username"] = ctx.user.name;
// 
//     }
//   },
// 
//   Query: {
//     User(object, params, ctx, resolveInfo) {
//       return neo4jgraphql(object, params, ctx, resolveInfo);
//     },
//     Element(object, params, ctx, resolveInfo) {
//       return neo4jgraphql(object, params, ctx, resolveInfo);
//     },
// 
//     Tag(object, params, ctx, resolveInfo) {
//       if(!ctx.user){
//        throw Error("Wrong request");
//       }
//       params["username"] = ctx.user.name;
//       return neo4jgraphql(object, params, ctx, resolveInfo); 
//     },
// 
//   }
// };
