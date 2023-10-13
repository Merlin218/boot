import { store } from '@risingstack/react-easy-state';

type StoreType = ReturnType<typeof store>;

class Tango {
  config = {};

  services = {};

  stores = {
    currentPage: store({}),
  };

  refs = {};

  getStore(name: string): StoreType {
    return this.stores[name];
  }

  getStoreValue(path: string) {
    if (!path) {
      return undefined;
    }

    const keys = path.split('.');
    let value = this.stores;
    for (let i = 0; i < keys.length; i += 1) {
      if (value) {
        value = value[keys[i]];
      } else {
        break;
      }
    }
    return value;
  }

  setStoreValue(path: string, value: any) {
    const keys = path.split('.');
    const storeName = keys[0];
    const subStore = this.stores[storeName];
    if (!subStore) {
      this.stores[storeName] = {};
    }
    let context = this.stores[storeName];
    for (let i = 1; i < keys.length - 1; i += 1) {
      context = context[keys[i]] || {};
    }
    context[keys[keys.length - 1]] = value;
  }

  clearStoreValue(path: string) {
    this.setStoreValue(path, undefined);
  }

  registerStore(name: string, storeInstance: StoreType) {
    if (!this.getStore(name)) {
      this.stores[name] = storeInstance;
    }
  }

  registerServices(services: any, namespace?: string) {
    if (namespace) {
      this.services[namespace] = services;
    } else {
      this.services = {
        ...this.services,
        ...services,
      };
    }
  }
}

export default new Tango();
