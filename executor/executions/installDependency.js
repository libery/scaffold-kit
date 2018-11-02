const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const getDestination = require('../getDestination');
const outputMessage = require('../outputMessage');

const isDependencyInstalled = (pkgName, dev) => {
  const pkgFile = path.join(getDestination(), 'package.json');
  const pkg = require(pkgFile);
  const section = dev ? pkg.devDependencies : pkg.dependencies;
  return !!section[pkgName];
};

const mockInstallDependency = (pkgName, version, dev) => {
  const pkgFile = path.join(getDestination(), 'package.json');
  const pkg = require(pkgFile);
  pkg[dev ? 'devDependencies' : 'dependencies'][pkgName] = version;
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
};

const realInstallDependency = (pkgName, version, dev) => {
  const obj = spawnSync('npm', [
    'install', pkgName + '@' + version, dev ? '--save-dev' : '--save'
  ]);
  if (obj.signal === 'SIGINT') {
    console.log('');
    process.exit(0);
  }
};

const installDependency = (params) => {
  const pkgName = params.package;
  const { version, dev, mock, silent } = params;
  const installed = isDependencyInstalled(pkgName, dev);
  if (installed) {
    outputMessage('installed', 'yellow', pkgName, silent);
  } else {
    outputMessage('install', 'green', pkgName, silent);
    if (mock) {
      mockInstallDependency(pkgName, version, dev);
    } else {
      realInstallDependency(pkgName, version, dev);
    }
  }
};

module.exports = installDependency;