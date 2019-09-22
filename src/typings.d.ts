/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// so the typescript compiler doesn't complain about the global config object
declare var config: any;