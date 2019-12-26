export class CypherBuilder {
  matchNeighbor(subject = 'subject', relation = 'relation', object = 'object') {
    return `(${subject})-[${relation}]-(${object})`
  }
  wherePublic(node = 'node') {
    return `( NOT exists(${node}.is_private) OR (${node}.is_private = False) )`
  }
  whereUsersNode(node = 'node') {
    return `(${node}.user_id = $user_id)`
  }
  orderByStartDesc(relation = 'relation', object = 'object') {
    return `(CASE ${relation}.start WHEN null THEN {} ELSE ${relation}.start END) DESC, (CASE ${object}.start WHEN null THEN {} ELSE ${object}.start END) DESC`
  }
  orderByCreatedDesc(node = 'node') {
    return `(CASE ${node}.created WHEN null THEN {} ELSE ${node}.created END) DESC`
  }
}
