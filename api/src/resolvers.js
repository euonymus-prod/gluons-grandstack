import _ from 'lodash'
import { quarkPropertiesData } from './constants/quark-properties'
import { gluonTypesData } from './constants/gluon-types'
import { qpropertyGtypesData } from './constants/qproperty-gtypes'
import * as ID_TYPE from './constants/id-types'
import * as DIRECTION from './constants/gluon-directions'

/*
// sample CYPHER

MATCH (subject {name:"眞弓聡"})-[r1:SON_OF|DAUGHTER_OF]->(n1), (subject)<-[r2:SON_OF|DAUGHTER_OF]-(n2) 
WITH subject, collect(DISTINCT n1) + collect(DISTINCT n2) as object, collect(DISTINCT r1) + collect(DISTINCT r2) as relation
RETURN subject, object, relation
*/

const revertDirection = (direction) => {
  if (direction === DIRECTION.A2B) {
    return DIRECTION.B2A
  } else if (direction === DIRECTION.B2A) {
    return DIRECTION.A2B
  }
  return false
}

const getQuarkProperties = (ids) => {
  const otherProperty = { id: ID_TYPE.NONE, caption: 'relations', caption_ja: '関係' }
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

const getQpropertyGtypes = (quarkPropertyId, avoidQuarkPropertyIds) => {
  let selectedGtypes = []
  // for other relaiton
  if (quarkPropertyId === null) {
    const modifiedGtypes = {}
    avoidQuarkPropertyIds.forEach(quarkPropertyId => {
      qpropertyGtypesData[quarkPropertyId].forEach(gtypes => {
        const direction = revertDirection(gtypes.direction)
        if (direction && (modifiedGtypes[gtypes.gluon_type] !== false)) {
          if (modifiedGtypes[gtypes.gluon_type]) {
            if (modifiedGtypes[gtypes.gluon_type].direction === gtypes.direction) {
              modifiedGtypes[gtypes.gluon_type] = false
            }
          } else {
            modifiedGtypes[gtypes.gluon_type] = { ...gtypes, direction }
          }
        } else {
          modifiedGtypes[gtypes.gluon_type] = false
        }
      })
    })

    // return all
    selectedGtypes = _.map(gluonTypesData, (data, gluon_type) => {
      if (modifiedGtypes[gluon_type]) {
        return {gluon_type: modifiedGtypes[gluon_type].gluon_type, direction: modifiedGtypes[gluon_type].direction, ...data}
      } else if (modifiedGtypes[gluon_type] === false) {
        return false
      }
      return {gluon_type, direction: DIRECTION.BOTH, ...data}
    }).filter(value => value)
    // .slice(0, first)
  // for specific quark_property
  } else {
    // because some quark_property_id doesn't exist on qproperty_gtypes table
    if (qpropertyGtypesData[quarkPropertyId]) {
      selectedGtypes = qpropertyGtypesData[quarkPropertyId].map(gtypes => {
        return {gluon_type: gtypes.gluon_type, direction: gtypes.direction, ...gluonTypesData[gtypes.gluon_type]}
      })
    }
  }
  return selectedGtypes
}

const quarkProperties = (parent, {ids}, context, info) => {
  return getQuarkProperties(ids)
}
const qpropertyGtypes = (parent, {quarkPropertyId, avoidQuarkPropertyIds}, context, info) => {
  return getQpropertyGtypes(quarkPropertyId, avoidQuarkPropertyIds)
}

export const resolvers = {
  Query: { quarkProperties, qpropertyGtypes },
}
