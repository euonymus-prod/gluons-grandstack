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

const DEFAULT_RELATION_TYPE = 'HAS_RELATION_TO';

const DATETIME_PROPERTIES = ['start', 'end', 'modified', 'created'];

const QUARK_BOOL_PROPERTIES = ['is_momentary', 'is_private', 'is_exclusive'];
const QUARK_INT_PROPERTIES = ['quark_type_id', 'user_id', 'last_modified_user'];
const QUARK_STR_PROPERTIES = ['id', 'name', 'en_name', 'image_path', 'description', 'en_description',
                              'start_accuracy', 'end_accuracy','url', 'affiliate'];

const GLUON_BOOL_PROPERTIES = ['is_momentary', 'is_exclusive'];
// TODO: user_id, last_modified_user は string になる予定
const GLUON_INT_PROPERTIES = ['gluon_type_id', 'user_id', 'last_modified_user'];
const GLUON_STR_PROPERTIES = ['id', 'active_id', 'passive_id', 'relation', 'prefix', 'suffix', 'start_accuracy', 'end_accuracy'];

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
  const user = await getUser(context)
  // TODO: Before fix this, data updating is required
  //const user_id = user.user_id
  const user_id = firebaseInstance.temporalUserId(user.user_id)

  const Label = `:${getLabel(params.quark_type_id)}`
  let existingParams = generateCypherParams(params)
  const {datetimeSetter, paramsReady} = generateDatetimeParams(params)
  
  const cypher = `CREATE (node:Quark${Label} { id: apoc.create.uuid()${existingParams}, user_id: ${user_id}, last_modified_user: ${user_id} }) SET node.created = datetime(), node.modified = datetime()${datetimeSetter} RETURN node`

  const records = await execCypher(context, cypher, paramsReady)
  return cypherRecord2Props(records[0])
}
const updateQuarkResolver = async (parent, params, context, info) => {
  // TODO
  const user = await getUser(context)
  // TODO: Before fix this, data updating is required
  //const last_modified_user = user.user_id
  const last_modified_user = firebaseInstance.temporalUserId(user.user_id)

  // Read current node by id
  const readCypher = `MATCH (node:Quark { id: "${params.id}" }) RETURN node`
  // const readCypher = `MATCH (node:Quark { id: "hhhh" }) RETURN node`
  const existingRecords = await execCypher(context, readCypher)
  if (existingRecords.length === 0) {
    throw Error("No node found");
  }
  const existingProps = cypherRecord2Props(existingRecords[0])

  let updateLabelPre = '';        
  let updateLabelPost = '';        
  if (params.quark_type_id && (Number(params.quark_type_id) !== Number(existingProps.quark_type_id))) {
    const label = getLabel(params.quark_type_id)
    const old_label = getLabel(existingProps.quark_type_id)
    updateLabelPre = ` REMOVE node:${old_label}`
    updateLabelPost = `, node:${label}`
  }

  const paramSetter = generateUpdatingParams(
    {...params, last_modified_user},
    QUARK_BOOL_PROPERTIES,
    QUARK_INT_PROPERTIES,
    QUARK_STR_PROPERTIES
  )
  const cypher = `MATCH (node:Quark { id: "${params.id}" }) ${updateLabelPre} SET node += { ${paramSetter} } ${updateLabelPost} RETURN node`
  
  const records = await execCypher(context, cypher)
  return cypherRecord2Props(records[0])
}

const createGluonResolver = async (parent, params, context, info) => {
  const user = await getUser(context)
  // TODO: Before fix this, data updating is required
  //const user_id = user.user_id
  const user_id = firebaseInstance.temporalUserId(user.user_id)

  let TypeInCypher = ""
  const Type = getType(params.gluon_type_id)
  if (Type) {
    TypeInCypher = `:${Type}`
  }
  const gluon_type_id = params.gluon_type_id ? params.gluon_type_id : 'null'

  let existingParams = generateCypherSettingParams(params)

  let passive_id = params.passive_id
  if (!passive_id) {
    // TODO passive stringから逆引きして passive の id を取得
    passive_id = ''
  }

  // TODO: 将来firebase uuidを利用した際には、user_id, last_modified_userをstring型で "${user_id}"　とすること！
  const targetResource = 'relation'
  const cypher = `
    MATCH (active {id: "${params.active_id}"}),(passive {id: "${passive_id}"})
    CREATE (active)-[ ${targetResource}${TypeInCypher}  ]->(passive)
    SET
        ${targetResource}.id = apoc.create.uuid(),
        ${targetResource}.gluon_type_id = ${gluon_type_id},
        ${existingParams},
        ${targetResource}.user_id = toInteger(${user_id}),
        ${targetResource}.last_modified_user = toInteger(${user_id}),
        ${targetResource}.created = datetime(),
        ${targetResource}.modified = datetime()
    RETURN ${targetResource}`

  const records = await execCypher(context, cypher)
  return cypherRecord2Props(records[0], targetResource)
}
const updateGluonResolver = async (parent, params, context, info) => {
  const user = await getUser(context)
  // TODO: Before fix this, data updating is required
  //const last_modified_user = user.user_id
  const last_modified_user = firebaseInstance.temporalUserId(user.user_id)

  // Read current relation by id
  const targetResource = 'relation'
  const readCypher = `MATCH (active)-[${targetResource} {id: "${params.id}"}]->(passive) RETURN ${targetResource}`
  const existingRecords = await execCypher(context, readCypher)
  if (existingRecords.length === 0) {
    throw Error("No relation found");
  }
  const existingProps = cypherRecord2Props(existingRecords[0], targetResource)

  if (params.gluon_type_id && (Number(params.gluon_type_id) !== Number(existingProps.gluon_type_id))) {
    const type = getType(params.gluon_type_id)
    const old_type = getType(existingProps.gluon_type_id)
  }
  const paramSetter = generateUpdatingParams(
    {...params, last_modified_user},
    GLUON_BOOL_PROPERTIES,
    GLUON_INT_PROPERTIES,
    GLUON_STR_PROPERTIES
  )
  const cypher = `MATCH (active)-[${targetResource} {id: "${params.id}"}]->(passive) SET ${targetResource} += { ${paramSetter} } RETURN ${targetResource}`
  const records = await execCypher(context, cypher)


  // TODO: Type の変更に未対応
  return cypherRecord2Props(records[0], targetResource)
}


// { hoge: foo, hage: bar } will become cypher snippet of ", hoge: $hoge, hage: $hage"
const generateCypherParams = params => {
  return _.keys(params).map(paramKey => {
    return `, ${paramKey}: $${paramKey}`
  }).join('')
}
const generateCypherSettingParams = params => {
  const avoids = ['id', 'gluon_type_id', 'passive']
  const targets = {}
  _.keys(params).filter(paramKey => !avoids.includes(paramKey)).forEach(paramKey => {
    targets[paramKey] = params[paramKey]
  })
  return _.keys(targets).map(paramKey => {
    if (DATETIME_PROPERTIES.includes(paramKey)) {
      if (paramKey === 'modified') {
        return `relation.${paramKey} = datetime("${targets[paramKey].formatted}")`
      } else {
        return `relation.${paramKey} = datetime("${targets[paramKey].formatted}T00:00:00+0900")`
      }
    } else if (GLUON_BOOL_PROPERTIES.includes(paramKey)) {
      return `relation.${paramKey} = ${targets[paramKey] ? 'TRUE': 'FALSE'}`
    } else if (GLUON_INT_PROPERTIES.includes(paramKey)) {
      return `relation.${paramKey} = toInteger(${targets[paramKey]})`
    } else if (GLUON_STR_PROPERTIES.includes(paramKey)) {
      return `relation.${paramKey} = "${targets[paramKey]}"`
    }
    return ''
  }).filter(data => data).join()
}

const generateDatetimeParams = params => {
  const existingDatetimeParams = _.keys(params).filter(paramKey => DATETIME_PROPERTIES.includes(paramKey))
  const datetimeSetterArr = existingDatetimeParams.map(paramKey => {
    return `, node.${paramKey} = CASE node.${paramKey}
                                   WHEN 'NULL' THEN null
                                   WHEN '0000-00-00 00:00:00' THEN null
                                   ELSE datetime(node.${paramKey})
                                 END`
  })
  datetimeSetterArr.push(", node.quark_type_id = toInteger(node.quark_type_id)")
  const datetimeSetter = datetimeSetterArr.join('')
  
  const paramsReady = { ...params, quark_type_id: sanitizeQuarkTypeId(params.quark_type_id) }
  existingDatetimeParams.forEach(paramKey => {
    if (params[paramKey] && params[paramKey].formatted) {
      paramsReady[paramKey] = `${params[paramKey].formatted}T00:00:00+0900`
    } else {
      paramsReady[paramKey] = null
    }
  })
  return {datetimeSetter, paramsReady}
}
const generateUpdatingParams = (params, bool_props, int_props, str_props) => {
  const avoids = ['id', 'active_id', 'passive_id']
  const targets = {}
  _.keys(params).filter(paramKey => !avoids.includes(paramKey)).forEach(paramKey => {
    targets[paramKey] = params[paramKey]
  })
  targets.modified = {formatted:''}
  return _.keys(targets).map(paramKey => {
    if (DATETIME_PROPERTIES.includes(paramKey)) {
      if (paramKey === 'modified') {
        return `${paramKey}: datetime(${targets[paramKey].formatted})`
      } else {
        return `${paramKey}: datetime("${targets[paramKey].formatted}T00:00:00+0900")`
      }
    } else if (bool_props.includes(paramKey)) {
      return `${paramKey}: ${targets[paramKey] ? 'TRUE': 'FALSE'}`
    } else if (int_props.includes(paramKey)) {
      return `${paramKey}: toInteger(${targets[paramKey]})`
    } else if (str_props.includes(paramKey)) {
      return `${paramKey}: "${targets[paramKey]}"`
    }
    return ''
  }).join()
}

const getUser = async context => {
  const idToken = getAuthorizationHeader(context);
  const user = await firebaseInstance.getLoggedIn(idToken)
  if (!user) {
    throw Error("The user must be logged in");
  }
  return user
}
const execCypher = async (context, cypher, params = {}) => {
  const session = context.driver.session()
  const result = await session.run(cypher, params)
  session.close()
  return result.records
}
const cypherRecord2Props = (record, targetResource = 'node') => {
  const { properties } = record.get(targetResource)
  return generateReturn(properties)
}
const generateReturn = properties => {
  const ret = properties
  QUARK_INT_PROPERTIES.forEach(paramKey => {
    if (properties[paramKey]) {
      ret[paramKey] = properties[paramKey].toString()
    }
  })
  GLUON_INT_PROPERTIES.forEach(paramKey => {
    if (properties[paramKey]) {
      ret[paramKey] = properties[paramKey].toString()
    }
  })

  DATETIME_PROPERTIES.forEach(paramKey => {
    let year = null
    let month = null
    let day = null
    if (properties[paramKey]) {
      year = properties[paramKey].year.toString()
      month = properties[paramKey].month.toString()
      day =   properties[paramKey].day.toString()
    }
    ret[paramKey] = { year, month, day }
  })
  return ret
}
const sanitizeQuarkTypeId = quark_type_id => {
  return quark_type_id ? quark_type_id : 1
}
const getLabel = quark_type_id => {
  quark_type_id = sanitizeQuarkTypeId(quark_type_id)
  const quarkLabelObj = quarkLabelsData[quark_type_id]
  if (!quarkLabelObj) {
    throw Error("Invalidate quark_type_id");
  }
  return `${quarkLabelObj.label}`
}
const getType = gluon_type_id => {
  if (!gluon_type_id) return DEFAULT_RELATION_TYPE
  const gluonLabelObj = gluonTypesData[gluon_type_id]
  if (!gluonLabelObj) {
    throw Error("Invalidate gluon_type_id");
  }
  return `${gluonLabelObj.type}`
}

export const resolvers = {
  Quark: {
    properties: quarkPropertiesResolver
  },
  PublicQuark: {
    properties: quarkPropertiesResolver
  },
  LoggedInQuark: {
    properties: quarkPropertiesResolver
  },
  AdminQuark: {
    properties: quarkPropertiesResolver
  },
  QuarkProperty: {
    gluons: (parent, {subject}, context, info) => {
      if (!parent.gluons || parent.gluons.length === 0) {
        // throw Error("QuarkProperty.gluons are required in the parent query");
        return []
      }
      return parent.gluons.filter(gluon => {
        if (parent.subject_id === gluon.active_id) {
          gluon.object_id = gluon.passive_id
        } else if (parent.subject_id === gluon.passive_id) {
          gluon.object_id = gluon.active_id
        }
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
