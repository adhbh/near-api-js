"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTransaction = exports.createTransaction = exports.SCHEMA = exports.Action = exports.SignedTransaction = exports.Transaction = exports.Signature = exports.deleteAccount = exports.deleteKey = exports.addKey = exports.stake = exports.transfer = exports.functionCall = exports.stringifyJsonOrBytes = exports.deployContract = exports.createAccount = exports.DeleteAccount = exports.DeleteKey = exports.AddKey = exports.Stake = exports.Transfer = exports.FunctionCall = exports.DeployContract = exports.CreateAccount = exports.IAction = exports.functionCallAccessKey = exports.fullAccessKey = exports.AccessKey = exports.AccessKeyPermission = exports.FullAccessPermission = exports.FunctionCallPermission = void 0;
const js_sha256_1 = __importDefault(require("js-sha256"));
const enums_1 = require("./utils/enums");
const borsh_1 = require("borsh");
const key_pair_1 = require("./utils/key_pair");
class FunctionCallPermission extends enums_1.Assignable {
}
exports.FunctionCallPermission = FunctionCallPermission;
class FullAccessPermission extends enums_1.Assignable {
}
exports.FullAccessPermission = FullAccessPermission;
class AccessKeyPermission extends enums_1.Enum {
}
exports.AccessKeyPermission = AccessKeyPermission;
class AccessKey extends enums_1.Assignable {
}
exports.AccessKey = AccessKey;
function fullAccessKey() {
    return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({ fullAccess: new FullAccessPermission({}) }) });
}
exports.fullAccessKey = fullAccessKey;
function functionCallAccessKey(receiverId, methodNames, allowance) {
    return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({ functionCall: new FunctionCallPermission({ receiverId, allowance, methodNames }) }) });
}
exports.functionCallAccessKey = functionCallAccessKey;
class IAction extends enums_1.Assignable {
}
exports.IAction = IAction;
class CreateAccount extends IAction {
}
exports.CreateAccount = CreateAccount;
class DeployContract extends IAction {
}
exports.DeployContract = DeployContract;
class FunctionCall extends IAction {
}
exports.FunctionCall = FunctionCall;
class Transfer extends IAction {
}
exports.Transfer = Transfer;
class Stake extends IAction {
}
exports.Stake = Stake;
class AddKey extends IAction {
}
exports.AddKey = AddKey;
class DeleteKey extends IAction {
}
exports.DeleteKey = DeleteKey;
class DeleteAccount extends IAction {
}
exports.DeleteAccount = DeleteAccount;
function createAccount() {
    return new Action({ createAccount: new CreateAccount({}) });
}
exports.createAccount = createAccount;
function deployContract(code) {
    return new Action({ deployContract: new DeployContract({ code }) });
}
exports.deployContract = deployContract;
function stringifyJsonOrBytes(args) {
    const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
    const serializedArgs = isUint8Array ? args : Buffer.from(JSON.stringify(args));
    return serializedArgs;
}
exports.stringifyJsonOrBytes = stringifyJsonOrBytes;
/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param methodName the name of the method to call
 * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
 *  or `Uint8Array` instance which represents bytes passed as is.
 * @param gas max amount of gas that method call can use
 * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
 * @param stringify Convert input arguments into bytes array.
 */
function functionCall(methodName, args, gas, deposit, stringify = stringifyJsonOrBytes, jsContract = false) {
    if (jsContract) {
        return new Action({ functionCall: new FunctionCall({ methodName, args, gas, deposit }) });
    }
    return new Action({ functionCall: new FunctionCall({ methodName, args: stringify(args), gas, deposit }) });
}
exports.functionCall = functionCall;
function transfer(deposit) {
    return new Action({ transfer: new Transfer({ deposit }) });
}
exports.transfer = transfer;
function stake(stake, publicKey) {
    return new Action({ stake: new Stake({ stake, publicKey }) });
}
exports.stake = stake;
function addKey(publicKey, accessKey) {
    return new Action({ addKey: new AddKey({ publicKey, accessKey }) });
}
exports.addKey = addKey;
function deleteKey(publicKey) {
    return new Action({ deleteKey: new DeleteKey({ publicKey }) });
}
exports.deleteKey = deleteKey;
function deleteAccount(beneficiaryId) {
    return new Action({ deleteAccount: new DeleteAccount({ beneficiaryId }) });
}
exports.deleteAccount = deleteAccount;
class Signature extends enums_1.Assignable {
}
exports.Signature = Signature;
class Transaction extends enums_1.Assignable {
    encode() {
        return borsh_1.serialize(exports.SCHEMA, this);
    }
    static decode(bytes) {
        return borsh_1.deserialize(exports.SCHEMA, Transaction, bytes);
    }
}
exports.Transaction = Transaction;
class SignedTransaction extends enums_1.Assignable {
    encode() {
        return borsh_1.serialize(exports.SCHEMA, this);
    }
    static decode(bytes) {
        return borsh_1.deserialize(exports.SCHEMA, SignedTransaction, bytes);
    }
}
exports.SignedTransaction = SignedTransaction;
/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
class Action extends enums_1.Enum {
}
exports.Action = Action;
exports.SCHEMA = new Map([
    [Signature, { kind: 'struct', fields: [
                ['keyType', 'u8'],
                ['data', [64]]
            ] }],
    [SignedTransaction, { kind: 'struct', fields: [
                ['transaction', Transaction],
                ['signature', Signature]
            ] }],
    [Transaction, { kind: 'struct', fields: [
                ['signerId', 'string'],
                ['publicKey', key_pair_1.PublicKey],
                ['nonce', 'u64'],
                ['receiverId', 'string'],
                ['blockHash', [32]],
                ['actions', [Action]]
            ] }],
    [key_pair_1.PublicKey, { kind: 'struct', fields: [
                ['keyType', 'u8'],
                ['data', [32]]
            ] }],
    [AccessKey, { kind: 'struct', fields: [
                ['nonce', 'u64'],
                ['permission', AccessKeyPermission],
            ] }],
    [AccessKeyPermission, { kind: 'enum', field: 'enum', values: [
                ['functionCall', FunctionCallPermission],
                ['fullAccess', FullAccessPermission],
            ] }],
    [FunctionCallPermission, { kind: 'struct', fields: [
                ['allowance', { kind: 'option', type: 'u128' }],
                ['receiverId', 'string'],
                ['methodNames', ['string']],
            ] }],
    [FullAccessPermission, { kind: 'struct', fields: [] }],
    [Action, { kind: 'enum', field: 'enum', values: [
                ['createAccount', CreateAccount],
                ['deployContract', DeployContract],
                ['functionCall', FunctionCall],
                ['transfer', Transfer],
                ['stake', Stake],
                ['addKey', AddKey],
                ['deleteKey', DeleteKey],
                ['deleteAccount', DeleteAccount],
            ] }],
    [CreateAccount, { kind: 'struct', fields: [] }],
    [DeployContract, { kind: 'struct', fields: [
                ['code', ['u8']]
            ] }],
    [FunctionCall, { kind: 'struct', fields: [
                ['methodName', 'string'],
                ['args', ['u8']],
                ['gas', 'u64'],
                ['deposit', 'u128']
            ] }],
    [Transfer, { kind: 'struct', fields: [
                ['deposit', 'u128']
            ] }],
    [Stake, { kind: 'struct', fields: [
                ['stake', 'u128'],
                ['publicKey', key_pair_1.PublicKey]
            ] }],
    [AddKey, { kind: 'struct', fields: [
                ['publicKey', key_pair_1.PublicKey],
                ['accessKey', AccessKey]
            ] }],
    [DeleteKey, { kind: 'struct', fields: [
                ['publicKey', key_pair_1.PublicKey]
            ] }],
    [DeleteAccount, { kind: 'struct', fields: [
                ['beneficiaryId', 'string']
            ] }],
]);
function createTransaction(signerId, publicKey, receiverId, nonce, actions, blockHash) {
    return new Transaction({ signerId, publicKey, nonce, receiverId, actions, blockHash });
}
exports.createTransaction = createTransaction;
/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param signer The {Signer} object that assists with signing keys
 * @param accountId The human-readable NEAR account name
 * @param networkId The targeted network. (ex. default, betanet, etc…)
 */
async function signTransactionObject(transaction, signer, accountId, networkId) {
    const message = borsh_1.serialize(exports.SCHEMA, transaction);
    const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
    const signature = await signer.signMessage(message, accountId, networkId);
    const signedTx = new SignedTransaction({
        transaction,
        signature: new Signature({ keyType: transaction.publicKey.keyType, data: signature.signature })
    });
    return [hash, signedTx];
}
async function signTransaction(...args) {
    if (args[0].constructor === Transaction) {
        const [transaction, signer, accountId, networkId] = args;
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
    else {
        const [receiverId, nonce, actions, blockHash, signer, accountId, networkId] = args;
        const publicKey = await signer.getPublicKey(accountId, networkId);
        const transaction = createTransaction(accountId, publicKey, receiverId, nonce, actions, blockHash);
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
}
exports.signTransaction = signTransaction;
