import {
    mapState,
    mapMutations
} from 'vuex'
import Swal from "sweetalert2"
const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                api: process.env.VUE_APP_URL,
                getUrl: process.env.VUE_APP_GET,
                SystemName:'TEKKIN SYSTEM',
                windowSize: {
                    x: 0,
                    y: 0
                },
            }),
            computed: {
                ...mapState([
                    'accounts','userInfo','printreceived'
                ]),
            },
            methods: {
                ...mapMutations([
                ]),
                onResize() {
                    this.windowSize = { x: window.innerWidth, y: window.innerHeight }
                },
                Copy(val) {
                    this.$clipboard(val)
                        Swal.fire({
                            position: 'center-end',
                            icon: 'success',
                            toast: true,
                            title: val + ' - ' + 'Copied',
                            showConfirmButton: false,
                            timer: 1500
                    })
                },
            }
        })
    }
}

export default myPlugins