<template>
<v-app id="inspire">
    <v-main id="background">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="10" md="8">
                    <v-card class="mx-auto elevation-20 pl-3 pr-3" style="border-radius: 10px;" max-width="660px">
                        <v-row>
                            <v-col cols="5" 
                                style="
                                    border-radius: 10px 0px 0px 10px; 
                                    height: 350px; 
                                    background-color: #658EA9;
                                    ">
                                <v-row>
                                    <v-col></v-col>
                                    <!-- <v-col> -->
                                        <v-avatar width="120px" height="140px">
                                            <v-img  :src="'/img/test.png' " style="margin-top: 25px"></v-img>
                                        </v-avatar>
                                        
                                    <!-- </v-col> -->
                                    <v-col></v-col>
                                    <v-col></v-col>
                                </v-row>
                                <p align="center" style="font-family: Impact,Goudy Old Style;
                                    font-size: 15px;
                                    letter-spacing: 0px;
                                    word-spacing: 3px;
                                    color: white;
                                    font-weight: normal;
                                    text-decoration: none;
                                    font-style: normal;
                                    font-variant: normal;
                                    text-transform: none;
                                    margin-top: 50px;">
                                    A System to monitor all the Plans that has been received and sent.
                                </p>
                                <center>
                                <v-hover v-slot="{ hover }">
                                <u 
                                :style="{ 'color': hover ? 'white' : '#7EC8E3' }"  
                                style="color: #7EC8E3" class="myPointer" @click="ForRegister()">Click to Register</u>
                                </v-hover>
                                </center>
                             

                            </v-col>

                            <v-col cols="7" style="margin-top: 20px;">
                                <span 
                                    style="font-family: impact;
                                    font-size: 36px;
                                    font-style: bold; 
                                    color: white;
                                    text-shadow: 3px 2px 4px #000000;
                                    margin-left:80px;"
                                    >TEKKIN SYSTEM
                                </span>
                                
                                <v-card-text class="text--primary" style="margin-top: 10px;">
                                    <v-form>
                                    <v-text-field 
                                        v-model="username" 
                                        label="Username" 
                                        hide-details="auto" 
                                        prepend-icon="mdi-account"
                                        color="blue"
                                        outlined
                                        dense
                                        filled
                                        @keyup.enter="login()"
                                        autocomplete="off"            
                                        style="font-family: TommySoft;font-size: 15px;">
                                    </v-text-field>
                                    <v-text-field 
                                        v-model="password" 
                                        prepend-icon="mdi-lock" 
                                        label="Password" 
                                        hide-details="auto" 
                                        color="blue"
                                        outlined
                                        dense
                                        filled
                                        class="mt-3"
                                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" 
                                        :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1"
                                        @keyup.enter="login()"
                                        autocomplete="off"
                                       style="font-family: TommySoft;font-size: 15px;"
                                        >
                                    </v-text-field>
                                    </v-form>
                                </v-card-text>
                                <br>
                                <v-card-actions class="justify-center ml-5">
                                      <v-hover v-slot="{ hover }">
                                   <v-btn
                                      class="col-sm-6" 
                                      @click="login(username)"    
                                      dense
                                     
                                      dark       
                                      style="font-family:impact,charcoal, sans-serif;"
                                     :style="{ 'background-color': hover ? '#5885AF' : '#658EA9' }" 
                                    >
                                      Sign in 
                                    </v-btn>
                                      </v-hover>          
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
    <register-page :Dialog="OpenRegister" @CloseRegister="CloseRegister"/>
</v-app>
</template>
 

<script>
// import axios from "axios";
import Swal from "sweetalert2"
import RegisterPage from '@/components/Others/RegisterForm.vue'
export default {
    components: {RegisterPage},
  data() {
    return {
      username:'',
        password:'',
        Employee:{},
        name: '',
        show1: false,
        OpenRegister: false,
    };
  },
  methods: {
    fullname(){
       if(this.username != '' && this.username.length == 5){
       this.axios.get(`http://adminsql1/api/basicinfo/${this.username}`,{
              headers:{'master-api' : `db588403f0a1d3b897442a28724166b4`}
          }).then(res=>{
            if(res.data){
              this.name = res.data[0].EmployeeName
            }
          })
     }
          this.name = ''
     },
//         login(){ 
            
//           if(this.username != '' && this.password != ''){
//             this.axios.get(`http://adminsql1/api/basicinfo/${this.password}`,{
//               headers:{'master-api' : `db588403f0a1d3b897442a28724166b4`}
//           }).then(res=>{
           
//               if(res.data){
//                   this.Employee = res.data[0]

//                   if(this.Employee != undefined && this.Employee.EmployeeCode == this.username && this.Employee.EmployeeCode == this.password){
//                       Swal.fire({
//                       position: 'center-end',
//                       toast: true,
//                       icon: 'success',
//                       title: `${'Welcome ' + this.Employee.LastName +',  ' + this.Employee.FirstName}`,
//                       showConfirmButton: false,
//                       timer: 1700
//                   })     
//                   this.$store.commit('STORE_USERINFO',this.Employee)
//                   this.$router.push('/tekkin_printing')
//               }else{
//                   Swal.fire({ 
//                   position: 'center',
//                   icon: 'error',
//                   title: 'Wrong Password or Username!',
//                   showConfirmButton: false,
//                   timer: 1500
//                   }) 
//                 }
//               } 
//           })          
//           }else{
//             Swal.fire({
//                   position: 'center-top',
//                   icon: 'error',       
//                   title: 'Empty fields!',
//                   showConfirmButton: false,
//                   timer: 1500
                
//                   }) 
//           }
//    },
        login(){ 
            
          if(this.username != '' && this.password != ''){
            this.axios.get(`${this.getUrl}/LoginAccounts/${this.password}`).then(res=>{
              if(res.data.length >= 1){
                  this.Employee = res.data[0]
                  if(this.Employee != undefined && this.Employee.Username == this.username && this.Employee.Password == this.password && this.Employee.AccountStatus == 'Active'){
                      Swal.fire({
                      position: 'center-end',
                      toast: true,
                      icon: 'success',
                      title: `${'Welcome ' + this.Employee.LastName +',  ' + this.Employee.FirstName}`,
                      showConfirmButton: false,
                      timer: 1700
                  })     
                  this.$store.commit('STORE_USERINFO',this.Employee)
                  this.$router.push('/tekkin_sending')
              }else if(this.Employee.AccountStatus == 'Deactivated'){
                  Swal.fire({ 
                  position: 'center-end',
                  toast: true,
                  icon: 'error',
                  title: 'This account is Deactivated!',
                  showConfirmButton: false,
                  timer: 1500
                  }) 
              }else{
                  Swal.fire({ 
                  position: 'center-end',
                  toast: true,
                  icon: 'error',
                  title: 'Wrong Password or Username!',
                  showConfirmButton: false,
                  timer: 1500
                  }) 
                }
              }else if(res.data.length <= 0){
                  Swal.fire({ 
                  position: 'center-end',
                  toast: true,
                  icon: 'error',
                  title: 'Your Account is not Registered!',
                  showConfirmButton: false,
                  timer: 1500
                  }) 
              } 
          })          
          }else{
            Swal.fire({
                  position: 'center-end',
                  toast: true,
                  icon: 'error',       
                  title: 'Empty fields!',
                  showConfirmButton: false,
                  timer: 1500
                
                  }) 
          }
   },
   ForRegister(){
       this.OpenRegister = true
   },
   CloseRegister(val){
       this.OpenRegister = val
   }
  }

  

};
</script>

<style >

</style>

