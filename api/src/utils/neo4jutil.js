import _ from 'lodash'
import Datetime from './datetime'
import { quarkLabelsData } from '../constants/quark-labels'
import { gluonTypesData } from '../constants/gluon-types'

const CYPHER_NULL_STR = "null"
const DEFAULT_RELATION_TYPE = 'HAS_RELATION_TO';

const DATETIME_PROPERTIES = ['start', 'end', 'modified', 'created'];

const QUARK_BOOL_PROPERTIES = ['is_momentary', 'is_private', 'is_exclusive'];
const QUARK_INT_PROPERTIES = ['quark_type_id'];
const QUARK_STR_PROPERTIES = ['id', 'name', 'name_ja', 'image_path', 'description', 'description_ja',
                              'start_accuracy', 'end_accuracy','url', 'affiliate', 'user_id', 'last_modified_user'];

const GLUON_BOOL_PROPERTIES = ['is_momentary', 'is_exclusive'];
const GLUON_INT_PROPERTIES = ['gluon_type_id'];
const GLUON_STR_PROPERTIES = ['id', 'active_id', 'passive_id', 'relation', 'prefix', 'suffix', 'start_accuracy', 'end_accuracy', 'user_id', 'last_modified_user'];

class Neo4jUtil {
  constructor(isJavascriptMode = true) {
    // NOTE: isJavascriptMode is a flag if consumer uses javascript mode date object or not.
    // Here are examples of date 2020-02-20
    // ex1 [isJavascriptMode === true]    { year: 2020, month: 1, day: 20 }
    // ex2 [isJavascriptMode === false]   { year: 2020, month: 2, day: 20 }
    // * month of javascript mode start from 0 to 11
    this.isJavascriptMode = isJavascriptMode;
  }

  execCypherAndReadResponse = async (driver, cypher, params = {}, targetResource = 'node') => {
    const records = await this.execCypher(driver, cypher, params)
    if (records.length === 0) {
      return {}
    }
    return this.cypherRecord2Props(records[0], targetResource)
  }
  execCypher = async (driver, cypher, params = {}) => {
    const session = driver.session()
    const result = await session.run(cypher, params)
    session.close()
    return result.records
  }

  cypherRecord2Props = (record, targetResource = 'node') => {
    if (!record) {
      throw Error("No record found");
    }
    const { properties } = record.get(targetResource)
    return this.generateResponse(properties)
  }
  generateResponse(properties) {
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

  cypherSnippetFromParamsForQuark = (params, isSetterStyle = true, targetResource = "") => {
    return this.cypherSnippetFromParams(
      QUARK_BOOL_PROPERTIES,
      QUARK_INT_PROPERTIES,
      QUARK_STR_PROPERTIES,
      params,
      isSetterStyle,
      targetResource
    )
  }
  cypherSnippetFromParamsForGluon = (params, isSetterStyle = true, targetResource = "") => {
    return this.cypherSnippetFromParams(
      GLUON_BOOL_PROPERTIES,
      GLUON_INT_PROPERTIES,
      GLUON_STR_PROPERTIES,
      params,
      isSetterStyle,
      targetResource
    )
  }
  cypherSnippetFromParams = (bool_props, int_props, str_props, params, isSetterStyle = true, targetResource = "") => {
    const styleFunc = isSetterStyle ? this.cypherSnippetParamSetter : this.cypherSnippetObjectParam;
    return _.keys(params).map(paramKey => {
      let valueFunc = false
      if (DATETIME_PROPERTIES.includes(paramKey)) {
        valueFunc = this.generateDatetimeParam
      } else if (bool_props.includes(paramKey)) {
        valueFunc = this.generateBoolParam
      } else if (int_props.includes(paramKey)) {
        valueFunc = this.generateIntParam
      } else if (str_props.includes(paramKey)) {
        valueFunc = this.generateStrParam
      }
      if (!valueFunc) {
        return ''
      }
      const value = valueFunc(paramKey, params[paramKey])
      return styleFunc(paramKey, value, targetResource)
    }).filter(data => data).join()
  }
  existingDatetimeParams = params => {
    return _.keys(params).filter(paramKey => DATETIME_PROPERTIES.includes(paramKey))
  }
  cypherSnippetArgsFromParams = params => {
    return _.keys(params).map(paramKey => {
      return this.cypherSnippetObjectParam(paramKey, `$${paramKey}`)
    }).join(',')
  }
  cypherSnippetParamSetter = (key, value, targetResource = "") => {
    let prefix = targetResource ? `${targetResource}.` : ""
    return `${prefix}${key} = ${value}`
  }
  cypherSnippetObjectParam(key, value) {
    return `${key}: ${value}`
  }
  generateStrParam(key, value = null) {
    if (value === null) {
      return CYPHER_NULL_STR
    }
    return `"${value}"`
  }
  generateIntParam(key, value = null) {
    if (value === null) {
      return CYPHER_NULL_STR
    }
    return `toInteger(${value})`
  }
  generateBoolParam(key, value = null) {
    if (value === null) {
      return CYPHER_NULL_STR
    }
    return value ? 'TRUE': 'FALSE'
  }
  generateFormattedDatetime = (key, value = null) => {
    const autoGenerated = ['modified', 'created']
    if (!this.datetime) {
      this.datetime = new Datetime(this.isJavascriptMode)
    }
    let formatted = null
    if (autoGenerated.includes(key)) {
      formatted = this.datetime.generateFormattedNowDateTime()
    } else {
      formatted = this.datetime.generateFormattedDateTime(value)
      if (!formatted) {
        return null
      }
    }
    return formatted
  }
  generateDatetimeParam = (key, value = null) => {
    const formatted = this.generateFormattedDatetime(key, value)
    if (!formatted) {
      return null
    }
    return `datetime("${formatted}")`
  }

  sanitizeQuarkTypeId(quark_type_id) {
    return quark_type_id ? quark_type_id : 1
  }
  sanitizeGluonTypeId(gluon_type_id) {
    return gluon_type_id ? gluon_type_id : "null"
  }
  sanitizeImagePath = (quark) => {
    if (quark.image_path) {
      return quark.image_path
    }
    const label = this.getLabel(quark.quark_type_id)
    const fileNameBase = this.snakeCase(label)
    return `/img/${fileNameBase}.png`
  }
  getLabel = (quark_type_id) => {
    const quarkLabelObj = this.getLabelObj(quark_type_id)
    return `${quarkLabelObj.label}`
  }
  getType = (gluon_type_id) => {
    const gluonLabelObj = this.getTypeObj(gluon_type_id)
    return `${gluonLabelObj.type}`
  }
  getLabelObj = (quark_type_id) => {
    quark_type_id = this.sanitizeQuarkTypeId(quark_type_id)
    const quarkLabelObj = quarkLabelsData[quark_type_id]
    if (!quarkLabelObj) {
      throw Error("Invalidate quark_type_id");
    }
    return quarkLabelObj
  }
  getTypeObj = (gluon_type_id) => {
    if (!gluon_type_id || (gluon_type_id === "0")) {
      return DEFAULT_RELATION_TYPE
    }
    const gluonLabelObj = gluonTypesData[gluon_type_id]
    if (!gluonLabelObj) {
      throw Error("Invalidate gluon_type_id");
    }
    return gluonLabelObj
  }
  camelCase = (str) => {
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(/[-_](.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }
  snakeCase = (str) => {
    var camel = this.camelCase(str);
    return camel.replace(/[A-Z]/g, function(s){
      return "_" + s.charAt(0).toLowerCase();
    });
  }
}
export default Neo4jUtil;
