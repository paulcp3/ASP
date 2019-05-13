<template>
    <div id="UEditor">
        <script id="editor" type="text/plan"></script>
    </div>
</template>

<script>
    export default {
        name: 'UEditor',
        data () {
            return {
                editor: null,
            }
        },
        props: {
            defaultMsg:{type: String},
            config: {type: Object}
        },
        mounted () {
            const _this = this;
            debugger
            _this.editor = UE.getEditor('editor', _this.config)
        },
        methods: {
            getUEContent(){
                return this.editor.getContent()
            }
        },
        destroyed (){
            this.editor.destroy();
        }
    }
</script>
