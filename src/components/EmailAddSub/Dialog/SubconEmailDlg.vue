<template >
    <v-container fluid>
         <v-dialog v-model="dialog" persistent scrollable max-width="400px">
             <v-card color="rgb(245,245,245)">
                 <v-toolbar flat dense dark color="#658EA9">
                     <!-- {{editedIndex==-1?'Add Plan' : 'Edit Plan'}} -->
                     <v-toolbar-title class="toolbarTitle">{{type}}</v-toolbar-title>
                     <v-spacer/>
                     <v-icon @click="close()">mdi-close-thick</v-icon>
                 </v-toolbar>
                <v-card-text>    
                    <v-container fluid>
                   
                        <v-flex md="6" pa-0>
                             <v-text-field background-color="white" hide-details="auto"  class="textField mt-2" label="Subcon" dense outlined v-model="item.Subcon" ></v-text-field>
                        </v-flex>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field  background-color="white" hide-details="auto" class="textField mt-3" dense  outlined label="Email Address" v-model="item.EmailAddress" ></v-text-field>
                                </v-col>
                                  <!-- <v-col>
                                    <v-text-field background-color="white" hide-details="auto" class="textField mt-3" dense  outlined label="Subcon" v-model="item.Subcon"></v-text-field>
                                </v-col> -->
                            </v-row>
                            <center>
                                <v-col cols="10">  
                                <v-btn  dark color="#658EA9" class="textField mt-3" block @click="SaveData()">Save<v-icon>mdi-content-save</v-icon></v-btn>
                            </v-col>
                            </center>                
                    </v-container>
                </v-card-text>
             </v-card>
         </v-dialog>
        
    </v-container>
</template>
<script>
import moment from 'moment'
import Swal from 'sweetalert2'
export default {
    name: 'SubconDialog',
    props:['dialog','item','type'],
    data() {
        return {
            editedIndex:null,
            SubconObj: {}
        }
    },
   
    methods: {
        close(){
            this.$emit('close',false)
        },
        SaveData(){
            if(this.item.Subcon != undefined){
            if(this.type == 'Add New Record'){
              this.editedIndex = -1
             this.item.DateAdded = moment().format('YYYY-MM-DD hh:mm:ss')   
             this.item.StaffAddedFormula = this.userInfo.EmployeeName      
             this.axios.post(`${this.getUrl}/insertSubconEmailDatabase`,{
                    Database: this.item
            })
                   Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Saved',
                        showConfirmButton: false,
                        timer: 1000
                    })            
            }else if (this.type == 'Update Record'){
                 this.item.StaffUpdatedFormula = this.userInfo.EmployeeName
                 this.axios.post(`${this.getUrl}/insertSubconEmailDatabase`,{
                    Database: this.item
            })
                   Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Saved',
                        showConfirmButton: false,
                        timer: 1000
                    })            
            }
            this.close()          
            setTimeout(() => {
           this.$emit('loadSubconEmail',1)  
      }, 200);
        }else{
            Swal.fire({
            position: 'center',
            icon: 'error',
            toast: false,
            title: 'Field is Empty',
            showConfirmButton: false,
            timer: 1500
       })
        }
      }
    },
    
}
</script>
<style >
    
</style>