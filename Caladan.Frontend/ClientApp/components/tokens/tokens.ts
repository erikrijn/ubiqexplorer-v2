import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface Token {
    Standard: string;
    Name: string;
    Address: string;
    Symbol: string;
    Decimals: number;
    Logo: string;
    Website: string;
    Description: string;
    Price: number;
}

@Component
export default class TokensComponent extends Vue {
    tokens: Token[] = [];
    mounted() {
        this.loadData();
    }

    loadData() {
        fetch('internalapi/Token/GetAll')
            .then(response => response.json() as Promise<Token[]>)
            .then(data => {
                this.tokens = data;
            });
    }

    formatCurrency(value: number) {
        let val = (value / 1).toFixed(2).replace(',', '.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
}
