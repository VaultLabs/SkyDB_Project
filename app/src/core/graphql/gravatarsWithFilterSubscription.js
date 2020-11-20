import gql from 'graphql-tag';

export default gql`
  subscription($where: Gravatar_filter!) {
    gravatars(where: $where) {
      id
      owner
      active
    }
  }
`;
