<template >
 <v-container fluid v-resize="onResize">
  <div >
  <h3 class="toolbarTitle myPointer mt-2"   ><v-icon color="blue" large >mdi-account</v-icon> Master Account</h3>
      <br>
        <v-data-table dense 
        :items="AccountData"
        :items-per-page="100"
        fixed-header
        class="elevation-1 " 
        hide-default-footer  show-select
        hide-default-header
        disable-pagination  
        :height="windowSize.y - 260"
        >
             <template  v-slot:header="{props:{}}">
             <thead > 
            <tr>
                <th width="120px" class="headerStyleTable" style="z-index: 99 !important;  box-shadow: 1px 1px 0px gray ; text-align: center; background-color: #658EA9;color:white ">Name</th>
                <th width="100px" class="headerStyleTable" style="z-index: 99 !important;  box-shadow: 1px 1px 0px gray ; text-align: center; background-color: #658EA9;color:white ">Username</th>
                <th width="100px" class="headerStyleTable" style="z-index: 99 !important;  box-shadow: 1px 1px 0px gray ; text-align: center; background-color: #658EA9;color:white ">Password</th>
                <th width="100px" class="headerStyleTable" style="z-index: 99 !important;  box-shadow: 1px 1px 0px gray ; text-align: center; background-color: #658EA9;color:white ">Access</th>
                <th width="100px" class="headerStyleTable" style="z-index: 99 !important;  box-shadow: 1px 1px 0px gray ; text-align: center; background-color: #658EA9;color:white ">Status</th>
                <th width="100px" class="headerStyleTable" style="z-index: 99 !important;  box-shadow: 1px 1px 0px gray ; text-align: center; background-color: #658EA9;color:white ">Actions</th>
            </tr> 
        </thead>
        </template>
         <template v-slot:body="{ items }">
              <tbody v-for="(item, index) in items" :key="index" >
                  <tr>
                    <td style=" box-shadow: 0px 1px 1px rgb(245,245,245);border-right:1px solid rgb(245,245,245);padding:5px;font-size:13px" class="text-center pa-0"><span>{{item.EmployeeName}}</span></td>
                    <td style=" box-shadow: 0px 1px 1px rgb(245,245,245);border-right:1px solid rgb(245,245,245);padding:5px;font-size:13px" class="text-center pa-0"><span>{{item.Username}}</span></td> 
                    <td class="text-center" style="-webkit-text-security: disc; box-shadow: 0px 1px 1px rgb(245,245,245);border-right:1px solid rgb(245,245,245);padding:5px;font-size:13px"><span>{{item.Password}}</span></td>
                    <td style=" box-shadow: 0px 1px 1px rgb(245,245,245);border-right:1px solid rgb(245,245,245);padding:5px;font-size:13px" class="text-center pa-0"><span>{{item.AccessRights}}</span></td>
                    <td style=" box-shadow: 0px 1px 1px rgb(245,245,245);border-right:1px solid rgb(245,245,245);padding:5px;font-size:13px" class="text-center pa-0"><span>{{item.AccountStatus}}</span></td>
                    <td style=" box-shadow: 0px 1px 1px rgb(245,245,245);border-right:1px solid rgb(245,245,245);padding:5px;font-size:13px" class="text-center pa-0">
                     <v-icon @click="EditAccountDialog(item)" color="green">mdi-pencil</v-icon>
                     <v-icon class="ml-1" @click="DeleteAccount(item)" color="red" >mdi-trash-can</v-icon>
                    </td>
                  </tr>
              </tbody> 
         </template>
        </v-data-table> 
    </div>
    <edit-account :Dialog="OpenEditDialog" :itemAccount="itemAccount" @loadAccounts="loadAccounts" @CloseEditAccount="CloseEditAccount"/>
</v-container>   
</template>
<script>
import EditAccount from '@/components/Accounts/Dialog/EditAccount.vue'
import Swal from 'sweetalert2'
export default {
    name: 'Accounts',
    props: [],
    components : {EditAccount},
    data() {
        return {
            itemAccount: {},
            AccountData : [],
            OpenEditDialog: false
        }
    },
    methods: {
      loadAccounts(){
          this.axios.get(`${this.getUrl}/AllRegisteredAccounts`).then(res=>{
              if(res.data){
                  this.AccountData = res.data
              }
          })
      },
      EditAccountDialog(item){
          this.itemAccount = item
          this.OpenEditDialog = true
      },
      DeleteAccount(item){
          Swal.fire({
                  position: 'center',
                  icon: 'warning',
                  toast: false,
                  title: 'Are You Sure to Delete?',
                  showConfirmButton: true,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Continue',
                  showCancelButton: true, 
                  cancelButtonColor: '#d33',     
                  }).then(result => {
  /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) { 
           let index = this.AccountData.indexOf(item);
        this.axios.post(`${this.getUrl}/DeleteAccount`, item).then(() => {
                  this.AccountData.splice(index, 1);
                  Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: "Account Successfully Deleted",
                    showConfirmButton: false,
                    timer: 1800,
                  });
            })
          }
       })
      },
      CloseEditAccount(val){
          this.OpenEditDialog = val
      }
    },
    mounted() {
        this.loadAccounts()
    },
}
</script>
<style >
.headerStyleTable{
  padding: 0px !important;
  font-size: 13px !important;
  margin: 0px !important;
  /* border-right: 1px solid whitesmoke;  */
}

/* .classT tr:hover {background-color:#EEEEEE;} */
 
</style>