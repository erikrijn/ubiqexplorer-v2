import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface Transaction {
    TransactionHash: string;
    OriginalTransactionHash: string;
    BlockNumber: number;
    From: string;
    To: string;
    Gas: number;
    GasPrice: number;
    Value: number;
    Url: string;
    ConfirmedOnFormatted: string;
    Symbol: string;
}

@Component
export default class LatestBlocksComponent extends Vue {
    transactions: Transaction[] = [];
    mounted() {
        this.loadData();
        setInterval(this.loadData, 60000);
    }

    loadData() {
        fetch('internalapi/Transaction/GetLatestTransactions?limit=50' + this.$route.params.limit)
            .then(response => response.json() as Promise<Transaction[]>)
            .then(data => {
                this.transactions = data;
            });
    }

    subStr(input: string, length: number) {
        if (input == null)
            return "";
        return input.substring(0, length) + '...';
    }
}
