import Vue from 'vue';
import VueRouter from 'vue-router';
import { Component, Watch } from 'vue-property-decorator';

interface Account {
    Address: string;
    Name: string;
    Url: string;
    Balance: number;
    LastSeenInBlock: number;
    NumberOfTransactions: number;
    BalanceBtc: number;
    BalanceUsd: number;
    BalanceEur: number;
    Identicon: string;
    Transactions: Transaction[];
    Tokens: Token[];
    Blocks: Block[];
}

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
}

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

interface Token {
    Address: string;
    Name: string;
    Symbol: string;
    Balance: number;
    Logo: string;
}

@Component
export default class AccountComponent extends Vue {
    address: string;
    pageNumber: number = 1;
    account: Account;
    transactions: Transaction[] = [];

    data() {
        return {
            account: null
        }
    }

    navigate(address: string) {
        this.pageNumber = 1;
        this.$router.push({ name: 'account', params: { address: address } });
        this.address = address;
        window.scrollTo(0, 0);
        this.loadData();
    }

    previousPage() {
        if (this.pageNumber > 1)
            this.pageNumber--;
        fetch('internalapi/Account/GetTransactions?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(response => response.json() as Promise<Transaction[]>)
            .then(data => {
                this.transactions = data;
            });
    }

    nextPage() {
        this.pageNumber++;
        fetch('internalapi/Account/GetTransactions?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(response => response.json() as Promise<Transaction[]>)
            .then(data => {
                this.transactions = data;
            });
    }

    mounted() {
        this.address = this.$route.params.address;
        this.loadData();
    }

    loadData() {
        console.log('Fetching data for ' + this.address);
        fetch('internalapi/Account/Get?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(response => response.json() as Promise<Account>)
            .then(data => {
                this.account = data;
            });
        fetch('internalapi/Account/GetTransactions?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(response => response.json() as Promise<Transaction[]>)
            .then(data => {
                this.transactions = data;
            });
    }

    formatCurrency(value: number) {
        let val = (value / 1).toFixed(2).replace(',', '.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    subStr(input: string, length: number) {
        return input.substring(0, length) + '...';
    }
}
