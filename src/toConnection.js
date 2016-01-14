import PAGEINFO from './pageInfoHeaders';
import strToBool from './strToBool';

export function toConnection(nodes, headers) {
  return {
    pageInfo: headersToPageInfo(headers),
    edges: wrapNodesInEdges(nodes, headers)
  };
}

function headersToPageInfo(headers) {
  return {
    startCursor: headers[PAGEINFO.startCursor],
    endCursor: headers[PAGEINFO.endCursor],
    hasPreviousPage: strToBool(headers[PAGEINFO.hasPreviousPage]),
    hasNextPage: strToBool(headers[PAGEINFO.hasNextPage])
  };
}

function wrapNodesInEdges(nodes, headers) {
  const cursors = headers[PAGEINFO.cursors].split(',');
  return nodes.map((node, index) => ({
    cursor: cursors[index],
    node
  }));
}
