import { generateKeyPair } from "crypto";
const JSEncrypt = require("node-jsencrypt");

export class RsaManager {
    static instance: RsaManager = null;
    publicKey: string;
    privateKey: string;

    constructor() {
        this.genKeys();
    }

    static getInstance(): RsaManager {
        if (this.instance == null) {
            this.instance = new RsaManager();
        }
        return this.instance;
    }

    genKeys() {
        let publicKey: String | null;
        let privateKey: String | null;

        generateKeyPair(
            "rsa",
            {
                modulusLength: 4096, // key size in bits
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem",
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem",
                },
            },
            (err, genPublicKey, genPrivateKey) => {
                if (!err) {
                    this.publicKey = genPublicKey;
                    this.privateKey = genPrivateKey;
                } else {
                    console.log(err);
                }
            }
        );
    }

    encrypt(text: string) {
        return encrypt(text, this.publicKey);
    }

    decrypt(text: string) {
        return decrypt(text, this.privateKey);
    }
}

function encrypt(text: string, key: string) {
    const crypt = new JSEncrypt();
    crypt.setKey(key);
    return crypt.encrypt(text);
}

function decrypt(encrypted: string, privateKey: string) {
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(privateKey);
    return crypt.decrypt(encrypted);
}
