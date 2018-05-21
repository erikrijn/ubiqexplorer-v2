import Vue from 'vue';
import { Component } from 'vue-property-decorator';

interface Block {
    BlockNumber: number;
    Hash: string;
    Miner: string;
    NumberOfTransactions: number;
    Timestamp: number;
    Url: string;
    Found: boolean;
}

@Component
export default class LatestBlocksComponent extends Vue {
    blocks: Block[] = [];
    mounted() {
        this.loadData();
    }
    loadData() {
        fetch('internalapi/Block/GetLatestBlocks?limit=50' + this.$route.params.limit)
            .then(response => response.json() as Promise<Block[]>)
            .then(data => {
                this.blocks = data;
            });
    }
}
