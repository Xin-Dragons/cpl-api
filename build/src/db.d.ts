/// <reference types="node" />
import { StringDecoder } from "string_decoder";
interface Pagination {
    limit?: number;
    offset?: number;
    orderBy?: string;
}
interface CollectionParams extends Pagination {
    collection?: string;
    publicKey?: string;
}
interface MintAndCollectionParams extends CollectionParams {
    mint: string;
}
export declare function getCollections({ limit }?: {
    limit?: number;
}): Promise<any[]>;
export declare function getCollection({ collection }: CollectionParams): Promise<{
    id: any;
} & {
    collection: any;
} & {
    first_verified_creator: any;
} & {
    update_authority: any;
} & {
    name: any;
} & {
    image: any;
} & {
    description: any;
} & {
    project: any;
} & {
    symbol: any;
}>;
export declare function getRpcHosts(): Promise<any[]>;
export declare function getMints({ collection, limit, offset, orderBy, publicKey }: CollectionParams): Promise<any[]>;
export declare function getMint({ collection, mint }: MintAndCollectionParams): Promise<Pick<any, string | number | symbol>>;
export declare function getHolders({ collection }: CollectionParams): Promise<{
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
}>;
export declare function getSummary({ collection, publicKey }?: {
    collection?: string;
    publicKey?: string;
}): Promise<any[]>;
export declare function getRoyalties({ collection, type, before, after }: {
    collection: string;
    type?: string;
    before?: string;
    after?: string;
}): Promise<any[] | {
    paid: any[];
    unpaid: any[];
}>;
export declare function getWalletSummary({ publicKey, pretty }: {
    publicKey: string;
    pretty?: boolean;
}): Promise<{
    [x: string]: any;
}>;
export declare function getOutstandingForWallet({ publicKey }: {
    publicKey: string;
}): Promise<any[]>;
export declare function getRepaidForWallet({ publicKey }: {
    publicKey: string;
}): Promise<any[]>;
export declare function getPaidForWallet({ publicKey }: {
    publicKey: string;
}): Promise<any[]>;
export declare function getLeaderboard({ limit, collection }: {
    limit?: number;
    collection?: string;
}): Promise<any[]>;
export declare function getRecentSales({ publicKey, limit }: {
    publicKey?: string;
    limit?: number;
}): Promise<any[]>;
export declare function getMostRecentSale({ mint }: {
    mint: string;
}): Promise<any>;
export declare function royaltiesRepaymentStarted({ publicKey, txnId, mint }: {
    publicKey: string;
    txnId: string;
    mint: StringDecoder;
}): Promise<undefined[]>;
export declare function getPendingRoyaltiesRepaymentTransaction({ txnId, mint }: {
    txnId: string;
    mint: string;
}): Promise<any>;
export declare function royaltiesRepaymentCompleted({ txnId, mint, success }: {
    txnId: string;
    mint: string;
    success: boolean;
}): Promise<void>;
export {};
