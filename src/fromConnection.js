import PAGEINFO from './pageInfoHeaders';

export function fromConnection(conn) {
  const {nodes, cursors} = getNodesAndCursors(conn);
  const pageInfoHeaders = pageInfoToHeaders(conn.pageInfo);
  const cursorHeaders = cursorsToHeader(cursors);
  const headers = {...pageInfoHeaders, ...cursorHeaders};
  return {nodes, headers};
}

function getNodesAndCursors(conn) {
  const out = {nodes: [], cursors: []};
  conn.edges.forEach(conn => {
    out.nodes.push(conn.node);
    out.cursors.push(conn.cursor);
  });
  return out;
}

function pageInfoToHeaders(pageInfo) {
  return {
    [PAGEINFO.startCursor]: pageInfo.startCursor,
    [PAGEINFO.endCursor]: pageInfo.endCursor,
    [PAGEINFO.hasPreviousPage]: pageInfo.hasPreviousPage,
    [PAGEINFO.hasNextPage]: pageInfo.hasNextPage
  };
}

function cursorsToHeader(cursors) {
  return {
    [PAGEINFO.cursors]: cursors.join()
  };
}
