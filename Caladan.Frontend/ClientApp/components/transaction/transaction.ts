import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface Transaction {
    TransactionHash: string;
    BlockNumber: number;
    TransactionIndex: number;
    BlockHash: string;
    From: string;
    To: string;
    Gas: number;
    GasPrice: number;
    GasUsed: number;
    Fee: number;
    Confirmations: number;
    Value: number;
    Symbol: string;
    Input: string;
    Nonce: number;
    Timestamp: number;
    PriceUsd: number;
    PriceBtc: number;
    PriceEur: number;
    ConfirmedOnFormatted: string;
    Found: boolean;
    Url: string;
    ReceiptRaw: string;
    Raw: string
}

@Component
export default class TransactionComponent extends Vue {
    transaction: Transaction;

    data() {
        return {
            transaction: null
        }
    }
    mounted() {
        this.loadData();
        setInterval(this.loadData, 60000);
    }
    loadData() {
        fetch('internalapi/Transaction/Get?transactionHash=' + this.$route.params.transactionHash)
            .then(response => response.json() as Promise<Transaction>)
            .then(data => {
                this.transaction = data;
            });
    }
    formatCurrency(value: number) {
        let val = (value / 1).toFixed(2).replace(',', '.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
}
