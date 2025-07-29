export class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  register(name, factory, options = {}) {
    this.services.set(name, {
      factory,
      singleton: options.singleton || false,
      dependencies: options.dependencies || []
    });
  }

  resolve(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found in container`);
    }

    if (service.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    const dependencies = service.dependencies.map(dep => this.resolve(dep));
    const instance = service.factory(...dependencies);

    if (service.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  registerSingleton(name, factory, dependencies = []) {
    this.register(name, factory, { singleton: true, dependencies });
  }

  registerTransient(name, factory, dependencies = []) {
    this.register(name, factory, { singleton: false, dependencies });
  }

  has(name) {
    return this.services.has(name);
  }

  clear() {
    this.services.clear();
    this.singletons.clear();
  }
} 