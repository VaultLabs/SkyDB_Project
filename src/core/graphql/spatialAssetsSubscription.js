import gql from 'graphql-tag';

export default gql`
  subscription($where: SpatialAsset_filter!) {
    spatialAssets(where: $where) {
      id
      owner
      active
    }
  }
`;
