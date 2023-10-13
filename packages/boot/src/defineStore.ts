import { store } from '@risingstack/react-easy-state';
import globalTango from './global';

// export const globalStore = store({});

function bind(object: Record<string, any>) {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'function') {
      object[key] = object[key].bind(object);
    }
  });
  return object;
}

/**
 * 创建 Store 实例
 * @param object 定义的状态熟悉和方法
 * @param namespace 命名空间，暂时废弃，不推荐使用
 * @returns
 */
export function defineStore(object: any, namespace: string) {
  // if (namespace) {
  //   globalStore[namespace] = object;
  //   return globalStore[namespace];
  //   // return bind(globalStore[namespace]);
  // }
  const ret = bind(store(object));
  globalTango.registerStore(namespace, ret);
  return ret;
}
