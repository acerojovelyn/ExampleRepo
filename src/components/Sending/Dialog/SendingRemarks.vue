<template >
    <div>
        <v-dialog v-model="Dialog" width="450px" persistent>
            <v-card>
                <v-toolbar dense color="#658EA9">
                    <v-toolbar-title style="color:white; font-family:TommySoft;">Sending Remarks</v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon fab @click="CloseRemarks()"><v-icon>mdi-close-thick</v-icon></v-btn>
                </v-toolbar>
                <v-card-text>    
                    <br>   
                    <v-textarea v-model="item.SendingRemarks" outlined></v-textarea>
                    <v-toolbar flat dense>
                        <v-spacer/>
                        <v-row>
                             <v-spacer/>
                             <v-btn small color="#658EA9" dark @click="SendingRemarksSave()" style="color:white; font-family:TommySoft;" >SAVE<v-icon>mdi-content-save</v-icon></v-btn>                         
                        </v-row>
                        
                    </v-toolbar>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div> 
</template>
<script>
export default {
    name: 'SendingRemarksDialog',
    props: ["Dialog","item"],
    data() {
        return {
            // RemarksPrint: '',
        }
    },
    methods: {
        SendingRemarksSave(){
            if(this.item.SendingRemarks != undefined){
                 this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: this.item
                })
                this.CloseRemarks()
        setTimeout(() => {
           this.$emit('loadSending',1)  
      }, 200); 
        }else{
            return false
        }   
               
        },
        CloseRemarks(){
            this.$emit('CloseRemarks',false)
        },
    },
}
</script>
<style >
    
</style>