import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface HeaderData {
    LatestBlockNumber: number;
    Price: number;
    MarketCap: number;
    Found: boolean;
    AverageBlockTime: number;
}

@Component
export default class HeaderDataComponent extends Vue {
    headerData: HeaderData;
    data() {
        return {
            headerData: null
        }
    }
    mounted() {
        this.loadData();
        setInterval(this.loadData, 60000);
    }
    loadData() {
        fetch('internalapi/HeaderData/Get')
            .then(response => response.json() as Promise<HeaderData>)
            .then(data => {
                    this.headerData = data;
            });
    }
    formatCurrency(value: number) {
        let val = (value / 1).toFixed(2).replace(',', '.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
}
