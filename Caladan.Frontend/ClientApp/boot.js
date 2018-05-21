import './css/site.css';
import './css/bootnav.css';
import './css/font-awesome.css';
import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.config.devtools = true;
Vue.use(VueRouter);

const routes = [
    { path: '/', component: require('./components/home/home.vue.html') },

    { path: '/account/:address', component: require('./components/account/account.vue.html'), name: 'account' },
    { path: '/block/:blockNumber', component: require('./components/block/block.vue.html'), name: 'block', alias: '/block/1' },
    { path: '/blocks', component: require('./components/latestblocks/latestblocks.vue.html'), name: 'blocks' },
    { path: '/transactions', component: require('./components/latesttransactions/latesttransactions.vue.html'), name: 'transactions' },
    { path: '/pendingtransactions', component: require('./components/pendingtransactions/pendingtransactions.vue.html'), name: 'pendingtransactions' },
    { path: '/transaction/:transactionHash', component: require('./components/transaction/transaction.vue.html'), name: 'transaction' },
    { path: '/tokens', component: require('./components/tokens/tokens.vue.html'), name: 'tokens' },
    { path: '/miningpools', component: require('./components/miningpools/miningpools.vue.html'), name: 'miningpools' },
    
];

new Vue({
    el: '#app-root',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: function(r) { return r(require('./components/app/app.vue.html')); }
});