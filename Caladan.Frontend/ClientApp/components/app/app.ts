import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {
        MenuComponent: require('../navmenu/navmenu.vue.html'),
        HeaderDataComponent: require('../headerdata/headerdata.vue.html')
    }
})
export default class AppComponent extends Vue {
}
