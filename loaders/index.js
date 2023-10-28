import UserLoader from '../graphql/users/user.loader.js';

export function loaders() {
  return {
    UserLoader: UserLoader(),
  };
}
