import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface Block {
    BlockNumber: number;
    Hash: string;
    Miner: string;
    NumberOfTransactions: number;
    ParentHash: string;
    Nonce: string;
    Sha3Uncles: string;
    LogsBloom: string;
    TransactionsRoot: string;
    StateRoot: string;
    Difficulty: number;
    TotalDifficulty: number;
    ExtraData: string;
    Size: number;
    GasLimit: number;
    GasUsed: number;
    Timestamp: number;
    Url: string;
    FoundOnFormatted: string;
    Found: boolean;
    Transactions: Transaction[];
}

interface Transaction {
    TransactionHash: string;
    BlockNumber: number;
    From: string;
    To: string;
    Value: number;
    Symbol: string;
    Url: string;
    ConfirmedOnFormatted: string;
}

@Component
export default class BlockComponent extends Vue {
    block: Block;
    data() {
        return {
            block: null
        }
    }

    mounted() {
        fetch('internalapi/Block/Get?blockNumber=' + this.$route.params.blockNumber)
            .then(response => response.json() as Promise<Block>)
            .then(data => {
                this.block = data;
            });
    }

    subStr(input: string, length: number) {
        return input.substring(0, length) + '...';
    }
}
