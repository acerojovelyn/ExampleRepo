<template >
    <div>
        <v-dialog v-model="Dialog" width="450px" persistent>
            <v-card>
                <v-toolbar dense color="#658EA9">
                    <v-toolbar-title style="color:white; font-family:TommySoft;font-size:25px" ><b>{{item.Plancode}}</b></v-toolbar-title>
                    <v-spacer/>
                    <v-btn icon fab @click="Close()"><v-icon>mdi-close-thick</v-icon></v-btn>
                </v-toolbar>
                <v-card-text>    
                    <br>   
                    <!-- <v-tooltip top >
                        <template v-slot:activator="{ on, attrs }"> -->
                            <center>
                         <v-btn   @click="Sending(item)" color="green" class="mr-1">SEND<v-icon outlined pill color="white">mdi-send-check</v-icon></v-btn>
                         <v-btn   @click="Cancel(item)" color="red">CANCEL<v-icon outlined pill  color="white"  >mdi-cancel</v-icon></v-btn>
                            </center>
                       
                        <!-- <v-icon  outlined pill  color="red" >mdi-cancel</v-icon></v-btn>
                        </template>
                        <span>Cancel</span>
                        </v-tooltip> -->
                    <!-- <v-toolbar flat dense>
                        <v-spacer/>
                        <v-row>
                             <v-spacer/>
                             <v-btn small color="#658EA9" dark style="color:white; font-family:TommySoft;" >SAVE<v-icon>mdi-content-save</v-icon></v-btn>                         
                        </v-row>
                        
                    </v-toolbar> -->
                </v-card-text>
            </v-card>
        </v-dialog>
    </div> 
</template>
<script>
import moment from 'moment'
import Swal from "sweetalert2"
export default {
    name: 'SendCancelDialog',
    props: ["Dialog","item"],
    data() {
        return {
            Database:{}
            // RemarksPrint: '',
        }
    },
    methods: {
      Close(){
          this.$emit('Close',false)
          
      },
      Sending(item){
//         Swal.fire({
//                   position: 'center',
//                   icon: 'warning',
//                   toast: false,
//                   title: 'Are You Sure to Send' + ' ' + item.Plancode + '?',
//                   showConfirmButton: true,
//                   confirmButtonColor: '#3085d6',
//                   confirmButtonText: 'Continue',
//                   showCancelButton: true, 
//                   cancelButtonColor: '#d33',     
//                   }).then(result => {
//   /* Read more about isConfirmed, isDenied below */
//   if (result.isConfirmed) {          
          item.Status = 'Finished'
          item.StaffSend = this.userInfo.EmployeeName
          item.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
            item.SendingDate = moment().format('YYYY-MM-DD')
            this.axios.post(`${this.getUrl}/insertDatabase`,{
                Database: item
            })
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Send',
                        showConfirmButton: false,
                        timer: 1000    
                    })            
            setTimeout(() => {
           this.$emit('loadSending',1)
      }, 200);
      this.Close()
//   }

//                   })
      },
      Cancel(item){
//         Swal.fire({
//                   position: 'center',
//                   icon: 'warning',
//                   toast: false,
//                   title: 'Are You Sure to Cancel' + ' ' + item.Plancode + '?',
//                   showConfirmButton: true,
//                   confirmButtonColor: '#3085d6',
//                   confirmButtonText: 'Continue',
//                   showCancelButton: true, 
//                   cancelButtonColor: '#d33',     
//                   }).then(result => {
//   /* Read more about isConfirmed, isDenied below */
//   if (result.isConfirmed) {            
        item.Status = 'Cancel'
        item.StaffCancel = this.userInfo.EmployeeName
        item.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
        item.CancelDate = moment().format('YYYY-MM-DD')
        this.axios.post(`${this.getUrl}/insertDatabase`,{
            Database: item
        })
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Cancel',
                        showConfirmButton: false,
                        timer: 1000   
                    })        
          setTimeout(() => {
           this.$emit('loadSending',1)
      }, 200);
      this.Close()
        //  }
        // })      
      },
    },
}
</script>
<style >
    
</style>
