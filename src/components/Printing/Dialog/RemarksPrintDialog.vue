<template >
    <div>
        <v-dialog v-model="Dialog" width="450px" persistent>
            <v-card>
                <v-toolbar dark dense color="#658EA9">
                    <v-toolbar-title style="color:white; font-family:TommySoft;">Printing Remarks</v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon fab @click="ClosePrintRemarks()"><v-icon>mdi-close-thick</v-icon></v-btn>
                </v-toolbar>
                <v-card-text>    
                    <br>   
                    <!-- <v-autocomplete outlined flat dense></v-autocomplete> -->
                    <v-textarea class="mt-n2" placeholder="Type Remarks here .." v-model="item.RemarksPrint" outlined></v-textarea>
                    <v-toolbar flat dense>
                        <v-spacer/>
                        <v-row>
                             <v-spacer/>
                             <v-btn small color="#658EA9" dark @click="RemarksPrintSave()" style="color:white; font-family:TommySoft;" >SAVE<v-icon>mdi-content-save</v-icon></v-btn>
                            <!-- <v-btn small color="red" dark @click="RemarksPrintSave()" style="color:white; font-family:TommySoft;" >CANCEL</v-btn> -->
                            
                        </v-row>
                        
                    </v-toolbar>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div> 
</template>
<script>
export default {
    name: 'RemarksPrintDialog',
    props: ["Dialog","item","rev"],
    data() {
        return {
            // items: ['']
            // RemarksPrint: '',
        }
    },
    methods: {
        RemarksPrintSave(){
            console.log(this.item)
            if(this.item.RemarksPrint != undefined || this.item.RemarksPrint != ''){
                this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: this.item
                })
                this.ClosePrintRemarks()
        setTimeout(() => {
           this.$emit('loadDatePrinting',1)  
      }, 200);
            }else{
                return false
            }
           
               
        },
        ClosePrintRemarks(){
            this.$emit('ClosePrintRemarks',false) 
        },
    },
}
</script>
<style >
    
</style>