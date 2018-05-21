import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class NavMenuComponent extends Vue {
    submit(event: any) {
        
        var searchTerm = event.srcElement.value;
        fetch('internalapi/Search/Get?searchTerm=' + searchTerm)
            .then(response => response.text() as Promise<string>)
            .then(data => {
                switch (data) {
                    case 'block': {
                        this.$router.push({ name: 'home' });
                        setTimeout(() => {
                            this.$router.push({ name: 'block', params: { blockNumber: searchTerm } });
                        }, 50);
                        break;
                    } 
                    case 'account': {
                        this.$router.push({ name: 'home' });
                        setTimeout(() => {
                            this.$router.push({ name: 'account', params: { address: searchTerm } });
                        }, 50);
                        break;
                    } 
                    case 'transaction': {
                        this.$router.push({ name: 'home' });
                        setTimeout(() => {
                            this.$router.push({ name: 'transaction', params: { transactionHash: searchTerm } });
                        }, 50);
                        break;
                    } 
                    case 'invalid': {
                        this.$router.push({ name: 'home' });
                        break;
                    } 
                }
            });
    }

}

