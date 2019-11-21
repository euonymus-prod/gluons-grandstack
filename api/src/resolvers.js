import _ from 'lodash'
import { quarkPropertiesData } from './constants/quark-properties'
import { gluonTypesData } from './constants/gluon-types'
import { qpropertyGtypesData } from './constants/qproperty-gtypes'
import * as DIRECTION from './constants/gluon-directions'

const quarkProperties = (parent, {ids}, context, info) => {
  const otherProperty = { id: false, caption: 'relations', caption_ja: '関係' }
  let selectedProperties = []
  if (ids.length === 0) {
    // return all
    selectedProperties = _.map(quarkProperties, (data, id) => {
      return {id, ...data}
    })
    // .slice(0, first)
  } else {
    selectedProperties = ids.map(id => {
      const relatedQpropertyGtypes = (getQpropertyGtypes(id))
      return {id, qpropertyGtypes: relatedQpropertyGtypes, ...quarkPropertiesData[id]}
    })
  }
  const relatedQpropertyGtypes = getQpropertyGtypes(null, ids)
  selectedProperties.push({ qpropertyGtypes: relatedQpropertyGtypes, ...otherProperty })
  return selectedProperties
}

const revertDirection = (direction) => {
  if (direction === DIRECTION.A2B) {
    return DIRECTION.B2A
  } else if (direction === DIRECTION.B2A) {
    return DIRECTION.A2B
  }
  return false
}

const getQpropertyGtypes = (quarkPropertyId, avoidQuarkPropertyIds) => {
  let selectedGtypes = []
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
  } else {
    selectedGtypes = qpropertyGtypesData[quarkPropertyId].map(gtypes => {
      return {gluon_type: gtypes.gluon_type, direction: gtypes.direction, ...gluonTypesData[gtypes.gluon_type]}
    })
  }
  return selectedGtypes
}

const qpropertyGtypes = (parent, {quarkPropertyId, avoidQuarkPropertyIds}, context, info) => {
  return getQpropertyGtypes(quarkPropertyId, avoidQuarkPropertyIds)
}

export const resolvers = {
  Query: { quarkProperties, qpropertyGtypes },
}
