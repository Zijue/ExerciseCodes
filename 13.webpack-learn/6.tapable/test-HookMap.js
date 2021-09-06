let { SyncHook, HookMap } = require('./tapable');
const keydedHookMap = new HookMap(() => new SyncHook(['name']));
keydedHookMap.for('key1').tap('plugin1', (name) => console.log(1, name));
keydedHookMap.for('key1').tap('plugin2', (name) => console.log(2, name));

let key1Hook = keydedHookMap.get('key1');
key1Hook.call('zhufeng');
