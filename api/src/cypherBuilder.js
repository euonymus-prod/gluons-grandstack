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
  whereTopNodes() {
    const candidates = [
      "岡田朋峰",
      "守谷絢子",
      "伊藤春香 (編集者)",
      "阿部哲子",
      "稲井大輝",
      "高橋ユウ",
      "上原多香子",
      "Koki",
    ]
    const snippet = candidates.map(candidate => {
      return `(node.name = \\\\\\"${candidate}\\\\\\" OR node.name_ja = \\\\\\"${candidate}\\\\\\")`
    }).join(" OR ")
    return `(${snippet})`
  }
  orderByStartDesc(relation = 'relation', object = 'object') {
    return `(CASE ${relation}.start WHEN null THEN {} ELSE ${relation}.start END) DESC, (CASE ${object}.start WHEN null THEN {} ELSE ${object}.start END) DESC`
  }
  orderByCreatedDesc(node = 'node') {
    return `(CASE ${node}.created WHEN null THEN {} ELSE ${node}.created END) DESC`
  }
}
