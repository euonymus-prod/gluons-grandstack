import { quarkPropertiesData } from './constants/quark-properties'

const quarkProperties = (__, {ids}) => {
  const otherProperty = { id: false, caption: 'relations', caption_ja: '関係' }
  let selectedProperties = []
  if (ids.length === 0) {
    // return all
    selectedProperties = _.map(quarkProperties, (data, key) => {
      return {id: key, ...data}
    })
    // .slice(0, first)
  } else {
    selectedProperties = ids.map(id => {
      return {id, ...quarkPropertiesData[id]}
    })
  }
  return selectedProperties
}

export const resolvers = {
  Query: { quarkProperties },
}
