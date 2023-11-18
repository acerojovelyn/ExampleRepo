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
                     <span style="font-family: impact;font-size: 30px;" class="mt-n5">Register</span> 
                    </v-col>
                    <v-col cols="3">
                        <v-divider/>
                    </v-col>
                    </v-row>
                    <center>
                        Please Fill in this form to Create an account. 
                    </center>
                   <v-row>
                    <v-col cols="6" >
                      <a-input  @input="EnterEmployeeid()" v-model="Employeeid" size="large" style="font-family: TommySoft;font-size: 15px;"  placeholder="Employee Code"></a-input>
                    </v-col> 
                    <v-col cols="6" >
                    <v-autocomplete
                    style="font-family: TommySoft;font-size: 15px !important;"
                    placeholder="Select Access"
                    v-model="SelectedAccess"
                    outlined
                    dense
                    hide-details="auto"
                    :items="Items"
                    ></v-autocomplete>
                     
                    </v-col>
                   </v-row>
                    <v-row>
                    <v-col cols="6">
                        <a-input style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="First Name" :value="EmployeeInfo.FirstName"></a-input>
                    </v-col>
                    <v-col cols="6">
                        <a-input style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Last Name" :value="EmployeeInfo.LastName"></a-input>
                    </v-col>                     
                 </v-row>
                  <v-row>
                    <v-col cols="12">
                        <a-input style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Department Name" :value="EmployeeInfo.DepartmentName"></a-input>
                    </v-col>                   
                 </v-row>
                 <v-row>
                    <v-col cols="12">
                        <a-input style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Section Name" :value="EmployeeInfo.SectionName"></a-input>
                    </v-col>                   
                 </v-row>
                 <v-form>
                 <v-row>
                    <v-col cols="12">
                        <a-input
                         v-model="Username" style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Username"></a-input> 
                    </v-col>                   
                 </v-row>
                
                    <v-row>                      
                    <v-col cols="12">
                        <a-input-password 
                         v-model="Password"  style="font-family: TommySoft;font-size: 15px;" size="large" placeholder="Password"></a-input-password>   
                    </v-col>                   
                 </v-row>
                 </v-form>
                 <v-toolbar flat dense>
                     <v-spacer/>
                     <v-hover v-slot="{ hover }">   
                     <v-btn @click="RegisterAccount()" :style="{ 'background-color': hover ? '#116530' : 'green' }"  dark >REGISTER NOW<v-icon>mdi-content-save-check</v-icon></v-btn>
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
  name: 'Register',
  props: ['Dialog'] ,
  data() {
      return {
          Employeeid: '',
          SelectedAccess: '',
          Password : '',
          Username : '',
          rev: '',
          Accountdb: {},
          EmployeeInfo: {},
          Items: ['User', 'Admin'],
          show1 : false,
          
      }
  },
  methods: {
      EnterEmployeeid(){
          if(this.Employeeid != ''){
              this.axios.get(`http://adminsql1/api/basicinfo/${this.Employeeid}`,{
              headers:{'master-api' : `db588403f0a1d3b897442a28724166b4`}
          }).then(res=>{
              if(res.data){  
      
                  if(res.data[0] != undefined && res.data[0].EmployeeCode == this.Employeeid){
                res.data.map(r=>{
                this.EmployeeInfo = {
                        EmployeeName : r.EmployeeName,
                        FirstName : r.FirstName,
                        LastName : r.LastName,
                        NickName: r.NickName,
                        DepartmentName : r.DepartmentName,
                        SectionName : r.SectionName,
                        EmployeeCode : r.EmployeeCode,
                        TeamName : r.TeamName,
                        DesignationName : r.DesignationName,
                        EmployeeStatus : r.EmployeeStatus,

                     }
                    })                       
                  }
              }
          })
          }        
      },
      RegisterAccount(){
         if(this.Employeeid != '' && this.SelectedAccess != '' && this.Password != ''){
             this.axios.get(`${this.getUrl}/AllRegisteredAccounts`).then(res=>{
                 if(res.data){
                     let index = res.data.findIndex((x) => x.EmployeeCode == this.Employeeid); 
             if(index > -1){
                       this.databAccountdbaseObj = res.data[index]
                       this.rev = this.Accountdb._rev
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        toast: false,
                        title: 'Account Already Registered',
                        showConfirmButton: false,
                        timer: 1500
                    }) 
                        return false
                }else{
                    this.EmployeeInfo._id = this.Employeeid
                    this.EmployeeInfo.AccessRights = this.SelectedAccess
                    this.EmployeeInfo.Password = this.Password
                    this.EmployeeInfo.Username = this.Username
                    this.EmployeeInfo.AccountStatus = 'Active'
                    this.axios.post(`${this.getUrl}/RegisterAccount`,{
                        item: this.EmployeeInfo
                        })
         Swal.fire({
                      position: 'center',
                      toast: false,
                      icon: 'success',
                      title: `You are now Registered!`,
                      showConfirmButton: false,
                      timer: 1700
                  })              
                }         
               }
             })
                             
         }else{
             Swal.fire({
                  position: 'center-top',
                  icon: 'error',       
                  title: 'Empty fields!',
                  showConfirmButton: false,
                  timer: 1500     
                  })  
         }
      },
      Close(){
          this.$emit('CloseRegister',false)
          this.EmployeeInfo = {}
          this.Password = ''
          this.Username = ''
          this.SelectedAccess = ''
          this.Employeeid = ''
      }
  },
}
</script>
<style >
    
</style>