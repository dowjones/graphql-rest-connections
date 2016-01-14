export function isConnection(obj={}) {
  return (typeof obj.pageInfo === 'object') &&
    Array.isArray(obj.edges);
}
