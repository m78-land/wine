import pkg from '../package.json';

export function externalsDependencies() {
  const deps = Object.keys(pkg.dependencies);
  // 额外的external
  // matchDeps.push('react');
  // matchDeps.push('react-dom');
  return deps.map(key => new RegExp(`^${key}`));
}
