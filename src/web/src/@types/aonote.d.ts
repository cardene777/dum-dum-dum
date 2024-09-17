// src/types/aonote.d.ts
declare module "aonote" {
  import Arweave from "arweave";
  import { ArweaveSigner } from "arbundles";

  export class AR {
    arweave: Arweave;
    host: string;
    port: number;
    protocol: string;
    jwk: Record<string, unknown>;
    addr: string | null;
    pub: string | null;
    isWallet: boolean;

    constructor(config?: { host?: string; port?: number; protocol?: string });
    isArConnect(jwk: any): boolean;
    init(jwk?: any): Promise<this>;
    mine(): Promise<void>;
    checkWallet(options?: {
      jwk?: any;
    }): Promise<{ addr: string; jwk: any; pub: string; err: string | null }>;
    balance(addr?: string): Promise<string>;
    mint(addr: string, amount?: string): Promise<string>;
    toWinston(ar: string): string;
    toAR(w: string): string;
    toAddr(jwk: any): Promise<string>;
    gen(
      amount: string,
      overwrite?: boolean
    ): Promise<{ jwk: any; addr: string; pub: string; bal: string }>;
    transfer(
      ar: string,
      target: string,
      jwk?: any
    ): Promise<{ err: string | null }>;
    bundle(
      items: any[],
      jwk?: any
    ): Promise<{ err: string | null; items: any[]; tx: any; id: string }>;
    post(options: {
      data?: string;
      tags?: object;
      jwk?: any;
    }): Promise<{ err: string | null }>;
    postTx(
      tx: any,
      jwk: any
    ): Promise<{ res: any; err: string | null; id: string }>;
    tx(txid: string): Promise<any>;
    data(txid: string, string?: boolean): Promise<any>;
  }

  export class AO {
    ar: AR;
    module: string;
    scheduler: string;

    constructor(config?: {
      module?: string;
      scheduler?: string;
      aoconnect?: any;
      ar?: object;
    });
    init(jwk?: any): Promise<this>;
    toSigner(wallet: any): ArweaveSigner;
    pipe(options: { jwk?: any; fns?: any[]; cb?: Function }): Promise<any>;
    postModule(options: {
      data: any;
      jwk: any;
      tags?: object;
      overwrite?: boolean;
    }): Promise<any>;
    postScheduler(options: {
      jwk: any;
      url: string;
      tags?: object;
      overwrite?: boolean;
    }): Promise<any>;
    spwn(options: {
      module?: string;
      scheduler?: string;
      jwk: any;
      tags?: object;
      data: any;
    }): Promise<{ err: any; pid: any }>;
    msg(options: {
      pid: any;
      jwk: any;
      data: any;
      act?: string;
      tags?: object;
      check?: any;
      checkData?: any;
      get?: any;
    }): Promise<any>;
    asgn(options: {
      pid: any;
      mid: any;
      jwk: any;
      check?: any;
      checkData?: any;
      get?: any;
    }): Promise<any>;
    dry(options: {
      pid: any;
      jwk: any;
      data: any;
      act?: string;
      tags?: object;
      check?: any;
      checkData?: any;
      get?: any;
    }): Promise<any>;
    eval(options: { pid: any; jwk: any; data: any }): Promise<any>;
    transform(options: { src: string; fills: any }): Promise<any>;
    load(options: {
      src: string;
      fills?: any;
      pid: any;
      jwk: any;
    }): Promise<any>;
    wait(options: { pid: any; attempts?: number }): Promise<any>;
    deploy(options: {
      loads?: any;
      src?: string;
      fills?: any;
      module?: string;
      scheduler?: string;
      jwk?: any;
      tags?: object;
      data?: any;
    }): Promise<any>;
  }

  export class Profile {
    ao: AO;
    ar: AR;
    profile_src: string;
    registry_src: string;
    registry: string;

    constructor(config?: {
      registry?: string;
      registry_src?: string;
      profile_src?: string;
      ar?: object;
      ao?: object;
    });
    init(jwk?: any): Promise<this>;
    createRegistry(options?: { jwk?: any }): Promise<any>;
    initRegistry(options?: { registry?: string; jwk?: any }): Promise<any>;
    updateProfile(options: {
      jwk: any;
      profile: any;
      id?: string;
    }): Promise<any>;
    ids(options?: {
      registry?: string;
      addr?: string;
      jwk?: any;
    }): Promise<any[]>;
    profile(options?: {
      registry?: string;
      id?: string;
      jwk?: any;
    }): Promise<any>;
    profiles(options?: {
      registry?: string;
      ids?: string[];
      jwk?: any;
    }): Promise<any[]>;
    info(options?: { id?: string; registry?: string; jwk?: any }): Promise<any>;
    checkProfile(options: {
      jwk: any;
    }): Promise<{ err: string | null; out: any }>;
    createProfile(options: {
      registry?: string;
      profile_src?: string;
      profile: any;
      jwk: any;
    }): Promise<any>;
  }

  export class Collection {
    __type__: string;
    registry: string;
    registry_src: string;
    thumbnail: string;
    banner: string;
    collection_src: string;
    pid: string;
    profile: object;
    ao: object;
    ar: object;

    constructor(config?: {
      registry?: string;
      registry_src?: string;
      thumbnail?: string;
      banner?: string;
      collection_src?: string;
      pid?: string;
      profile?: object;
      ao?: object;
      ar?: object;
    });

    init(jwk: any): Promise<this>;
    createRegistry(options?: { jwk?: any }): Promise<any>;
    create(options: {
      src?: string;
      info?: {
        title: string;
        description: string;
        thumbnail?: string;
        banner?: string;
        thumbnail_data?: ArrayBuffer;
        thumbnail_type?: string;
        banner_data?: ArrayBuffer;
        banner_type?: string;
      };
      bazar?: boolean;
      jwk: any;
      cb?: Function;
    }): Promise<any>;
    addImages(options: {
      fns: any[];
      thumbnail?: string;
      thumbnail_data?: ArrayBuffer;
      thumbnail_type?: string;
      banner?: string;
      banner_data?: ArrayBuffer;
      banner_type?: string;
    }): void;
    updateInfo(options: {
      title?: string;
      description?: string;
      jwk: any;
      thumbnail?: string;
      thumbnail_data?: ArrayBuffer;
      thumbnail_type?: string;
      banner?: string;
      banner_data?: ArrayBuffer;
      banner_type?: string;
      cb?: Function;
    }): Promise<any>;
    info(pid?: string): Promise<any>;
    get(creator: string): Promise<any>;
    add(options: { id: string }): Promise<any>;
    register(options: {
      name: string;
      description: string;
      thumbnail?: string;
      banner?: string;
      date: number;
      creator: string;
      collectionId?: string;
    }): Promise<any>;
    addAsset(asset_pid: string): Promise<any>;
    removeAsset(asset_pid: string): Promise<any>;
    addAssets(asset_pids: string[]): Promise<any>;
    removeAssets(asset_pids: string[]): Promise<any>;
    update(asset_pid: string | string[], remove?: boolean): Promise<any>;
  }

  export class Notebook extends Collection {
    __type__: string;

    constructor(config?: {
      registry?: string;
      registry_src?: string;
      thumbnail?: string;
      banner?: string;
      notebook_src?: string;
      pid?: string;
      profile?: object;
      ao?: object;
      ar?: object;
    });

    addNote(note_pid: string): Promise<any>;
    removeNote(note_pid: string): Promise<any>;
    addNotes(note_pids: string[]): Promise<any>;
    removeNotes(note_pids: string[]): Promise<any>;
  }

  export class Note {
    __type__: string;
    notelib_src: string;
    note_src: string;
    render_with: string;
    proxy: string;

    constructor(config?: {
      proxy?: string;
      render_with?: string;
      note_src?: string;
      notelib_src?: string;
      pid?: string;
      profile?: object;
      ao?: object;
      ar?: object;
    });

    create(options: {
      jwk: any;
      content_type?: string;
      src?: string;
      library?: string;
      data?: any;
      info: {
        title: string;
        description: string;
        thumbnail?: string;
        thumbnail_data?: ArrayBuffer;
        thumbnail_type?: string;
      };
      token?: { fraction?: string };
      udl?: {
        payment?: string;
        access?: string;
        derivations?: string;
        commercial?: string;
        training?: string;
      };
      cb?: Function;
    }): Promise<any>;

    updateInfo(options: {
      title?: string;
      description?: string;
      thumbnail?: string;
      thumbnail_data?: ArrayBuffer;
      thumbnail_type?: string;
      jwk: any;
      cb?: Function;
    }): Promise<any>;

    allow(): Promise<any>;
    assignData(): Promise<any>;
    get(version?: string): Promise<any>;
    list(): Promise<any>;
    update(data: any, version?: string): Promise<{ err: any; res: any }>;
    patches(data: any): Promise<any>;
    updateVersion(patches: any, version: string): Promise<any>;
    editors(): Promise<any>;
    addEditor(editor: string): Promise<any>;
    removeEditor(editor: string): Promise<any>;
  }

  export class Asset {
    __type__: string;
    asset_src: string;
    pid: string;
    profile: object;
    ao: object;
    ar: object;

    constructor({
      asset_src,
      pid,
      profile,
      ao,
      ar,
    }?: {
      asset_src?: string;
      pid?: string;
      profile?: object;
      ao?: object;
      ar?: object;
    });

    init(jwk: any): Promise<this>;
    create(options: {
      jwk: any;
      src?: string;
      data: any;
      fills?: any;
      tags?: object;
      content_type: string;
      info: { title: string; description: string };
      token: { fraction?: string };
      udl: {
        payment?: string;
        access?: string;
        derivations?: string;
        commercial?: string;
        training?: string;
      };
      cb?: Function;
    }): Promise<any>;
    info(): Promise<any>;
    add(options: { id: string }): Promise<any>;
    mint(options: { quantity: string }): Promise<any>;
    transfer(options: {
      recipient: string;
      quantity: string;
      profile?: boolean;
    }): Promise<any>;
    balance(options: { target: string }): Promise<any>;
    balances(): Promise<any>;
  }

  export interface ArweaveWallet {
    walletName: "ArConnect";
    test: boolean;
    jwk: any;
    connect: () => Promise<void>;
    getActiveAddress: () => Promise<string>;
    getActivePublicKey: () => Promise<string>;
    sign: (tx: any) => Promise<any>;
  }


}
