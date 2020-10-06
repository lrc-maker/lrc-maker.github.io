declare const ncmcWorker: DedicatedWorkerGlobalScope;
declare const CORE_KEY: Uint8Array;
declare const AES_ECB_DECRYPT: (keyData: Uint8Array, data: Uint8Array) => Promise<Uint8Array>;
