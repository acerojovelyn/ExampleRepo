<template >
    <div>
       <v-dialog v-model="Dialog" width="500px"  persistent transition="dialog-bottom-transition">
            <v-card>
                <v-card-text>
                    <br>
                 <v-row>
                     <v-hover v-slot="{ hover }" class="mt-n4">        
                     <v-icon @click="Close()" dark :style="{ 'color': hover ? 'black' : 'gray' }">mdi-arrow-left-circle</v-icon>
                     </v-hover> 
                    <v-col cols="3">
                        <v-divider/>
                    </v-col>
                    <v-col class="justify-center ml-9  mt-n3">
                     <span style="font-family: impact;font-size: 30px;" class="mt-n5">Account</span> 
                    </v-col>
                    <v-col cols="3">
                        <v-divider/>
                    </v-col>
                    </v-row>
                    <center>
                        Fill this form to Update the account. 
                    </center>
                   <v-row>
                    <v-col cols="6" > 
                      <a-input read-only v-model="itemAccount.EmployeeCode"  size="large" style="font-family: TommySoft;font-size: 15px;"  placeholder="Employee Code"></a-input>
                    </v-col> 
                      <v-col cols="6">
                        <a-input v-model="itemAccount.EmployeeName" style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="First Name" ></a-input>
                    </v-col>
                   </v-row>
                    <v-row>
                 

                     <v-col cols="6" >
                    <v-autocomplete
                    style="font-family: TommySoft;font-size: 15px !important;"
                    placeholder="Select Access" 
                    v-model="itemAccount.AccessRights"
                    :items="items"
                    outlined
                    dense
                    hide-details="auto"
                    ></v-autocomplete>
                     
                    </v-col>  
                     <v-col cols="6" >
                    <v-autocomplete
                    style="font-family: TommySoft;font-size: 15px !important;"
                    placeholder="Select Status" 
                    v-model="itemAccount.AccountStatus"
                    :items="itemStatus"
                    outlined
                    dense
                    hide-details="auto"
                    ></v-autocomplete>
                     
                    </v-col>                                        
                 </v-row>
                 <v-form>
                 <v-row>
                    <v-col cols="12">
                        <a-input v-model="itemAccount.Username"
                         style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Username"></a-input> 
                    </v-col>                   
                 </v-row>
                
                    <v-row>                      
                    <v-col cols="12">
                        <a-input-password  v-model="itemAccount.Password"
                           style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Password"></a-input-password>   
                    </v-col>                   
                 </v-row>
                 </v-form>
                 <v-toolbar flat dense>
                     <v-spacer/>
                     <v-hover v-slot="{ hover }">   
                     <v-btn @click="UpdateAccount()"  :style="{ 'background-color': hover ? '#116530' : 'green' }"  dark >UPDATE NOW<v-icon>mdi-content-save-check</v-icon></v-btn>
                     </v-hover>              
                 </v-toolbar>              
                </v-card-text>
            </v-card>
        </v-dialog> 
    </div>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    name: 'EditAccount',
    props: ['Dialog','itemAccount'],
    data() {
        return {
            SelectedAccess : '',
            SelectedStatus : '',
           items: ['User', 'Admin'], 
           itemStatus : ['Active','Deactivated']
        }
    },
    methods: {
        UpdateAccount(){
            // if(this.SelectedAccess != ''){
            //      this.itemAccount.AccessRights = this.SelectedAccess
            // }
            // if(this.SelectedStatus != ''){
            //     this.itemAccount.AccountStatus = this.SelectedStatus
            // }
           
             this.axios.post(`${this.getUrl}/RegisterAccount`,{
                 item: this.itemAccount
            })
                   Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Updated',
                        showConfirmButton: false,
                        timer: 1000
                    }) 
                this.Close()
                setTimeout(() => {
              this.$emit('loadAccounts',1)
            }, 500);  
        },
        Close(){
            this.$emit('CloseEditAccount',false)
        }
    },
}
</script>
<style >
    
</style>