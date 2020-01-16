import _ from 'lodash'
// import { neo4jgraphql } from 'neo4j-graphql-js'
import { quarkLabelsData } from './constants/quark-labels'
import { gluonTypesData } from './constants/gluon-types'
import { quarkPropertiesData } from './constants/quark-properties'
import { qtypePropertiesData } from './constants/qtype-properties'
import { qpropertyGtypesData } from './constants/qproperty-gtypes'
import * as ID_TYPE from './constants/id-types'
import * as DIRECTION from './constants/gluon-directions'
import Util from "./utils/common";

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

const quarkProertiesResolver = (parent, params, context, info) => {
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

// { hoge: foo, hage: bar } will become cypher snippet of ", hoge: $hoge, hage: $hage"
const generateCypherParams = params => {
  const reservedParams = ['Label', 'id', 'name']
  return _.keys(params).filter(param => !reservedParams.includes(param)).map(param => `, ${param}: $${param}`).join('')
}
const generateDatetimeParams = params => {
  const util = new Util();
  const modifiedDate = { ...params.start, month: params.start.month -1}
  const dateString = util.date2str(modifiedDate)
  const modifiedParams = { ...params, start:`${dateString}T00:00:00+0900` }
  const settingParams = `
  node.start = CASE node.start
    WHEN 'NULL' THEN null
    WHEN '0000-00-00 00:00:00' THEN null
    ELSE datetime(node.start)
    END
  `
  const cypherParams = ", start: $start"

  return {cypherParams, settingParams, modifiedParams}
}
// Note: if you don't create resolver specifically, auto generated resolver will call cypher automatically, and generate node
//       but, the problem is, it can't modify Label by param, and start datetime modification also needed
const createQuarkResolver = async (parent, params, context, info) => {
  let existingParams = generateCypherParams(params)
  const Label = `:${params.Label}`

  const {cypherParams, settingParams, modifiedParams} = generateDatetimeParams(params)

  const cypher = `CREATE (node:Quark${Label} { id: $id, name: $name${existingParams}${cypherParams} }) SET node.created = datetime(), node.modified = datetime(), ${settingParams} RETURN node`

  const session = context.driver.session()
  const result = await session.run(cypher, modifiedParams)

  const { properties } = result.records[0].get('node')
  // TODO ==============================
  const start = {
    year:properties.start.year.toString(),
    month:properties.start.month.toString(),
    day:properties.start.day.toString()
  }
  // ===================================

  const ret = {...properties, start}
  return ret
  // return result.records[0].get('node').properties
}
export const resolvers = {
  Quark: {
    properties: quarkProertiesResolver
  },
  PublicQuark: {
    properties: quarkProertiesResolver
  },
  LoggedInQuark: {
    properties: quarkProertiesResolver
  },
  AdminQuark: {
    properties: quarkProertiesResolver
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
    CreateQuark: createQuarkResolver
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
