import should from 'should';
import PAGEINFO from '../src/pageInfoHeaders';
import {
  isConnection,
  fromConnection,
  toConnection
} from '../src';

describe('dynamodb-rest-connections', () => {
  describe('isConnection', () => {
    it('should detect a non-conn', () => {
      should(isConnection()).not.be.ok();
    });

    it('should detect a conn', () => {
      should(isConnection({pageInfo: {}, edges: []})).be.ok();
    });
  });

  it('should complement', () => {
    const connection = {
      edges: [
        {cursor: 'd02dsf', node: {id: '56', name: 'mary'}},
        {cursor: 'b8df4=', node: {id: '78', name: 'joe'}}
      ],
      pageInfo: {
        startCursor: 'd02dsf',
        endCursor: 'b8df4=',
        hasNextPage: true,
        hasPreviousPage: false
      }
    };

    const {nodes, headers} = fromConnection(connection);
    const resultingConnection = toConnection(nodes, headers);

    resultingConnection.should.eql(connection);
  });

  describe('toConnection', () => {
    it('should work with string-boolean headers', () => {
      const conn = toConnection([], {
        [PAGEINFO.hasNextPage]: 'false',
        [PAGEINFO.hasPreviousPage]: 'true',
        [PAGEINFO.cursors]: ''
      });
      should(conn.pageInfo.hasPreviousPage).be.true();
      should(conn.pageInfo.hasNextPage).be.false();
    });
  });
});
