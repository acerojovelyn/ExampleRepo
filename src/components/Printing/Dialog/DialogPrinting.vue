<template >
    <v-container fluid>
         <v-dialog v-model="dialog" persistent scrollable max-width="400px">
             <v-card color="rgb(245,245,245)">
                 <v-toolbar flat dense dark color="#658EA9">
                     <!-- {{editedIndex==-1?'Add Plan' : 'Edit Plan'}} -->
                     <v-toolbar-title class="toolbarTitle">{{editedIndex==-1?'Add Plan' : 'Edit Plan'}}</v-toolbar-title>
                     <v-spacer/>
                     <v-icon @click="close()">mdi-close-thick</v-icon>
                 </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-flex md="6" pa-0>
                             <v-text-field background-color="white" hide-details="auto" readonly  class="textField mt-2" label="Date Received" dense outlined v-model="editObj.DateReceived"></v-text-field>
                        </v-flex>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field @input="loadBranch(editObj)" background-color="white" maxlength="12" hide-details="auto" class="textField mt-3" dense  outlined label="Control Number"  v-model="editObj.Plancode"></v-text-field>
                                </v-col>
                                  <v-col>
                                    <v-text-field background-color="white" hide-details="auto" class="textField mt-3" dense  outlined label="Subcon Code" v-model="editObj.SubconCode"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field background-color="white" hide-details="auto" class="textField mt-3" dense  outlined label="Branch Code" v-model="editObj.BranchCode"></v-text-field>
                                </v-col>
                            </v-row>
                            
                            <center>
                                <v-col cols="10">  
                                <v-btn  dark color="#658EA9" class="textField mt-2" block @click="Savedata(editObj)">{{editedIndex==-1?'Add' : 'Update'}}<v-icon>mdi-content-save</v-icon></v-btn>
                            </v-col>
                            </center>           
                    </v-container>
                </v-card-text>
             </v-card>
         </v-dialog>
        
    </v-container>
</template>
<script>
import Swal from "sweetalert2"
import moment from "moment"
export default {
    name: "",     
    props:['dialog','data','item'],
    data:()=>({
        editedIndex:-1,
        databaseObj: {},
        editObj:{
            DateReceived : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            BranchCode : '',
            SubconCode : '',
        },
        rev : '',
    }),
   mounted() {
      
   },
    methods:{
        loadBranch(editObj){
            if(editObj.Plancode != ''){
              this.axios.get(`${this.getUrl}/GetKisoBranch/${editObj.Plancode}`).then(res=>{
                if(res.data){
                    res.data.filter(r=>{
                        editObj.BranchCode = r.BranchCode
                        editObj.SubconCode = r.TraderCode
                    })
                }
            })
            }
            
        },
        close(){
            this.$emit('closeDialogPrinting' , false )          
            this.editObj= {
                 DateReceived : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),          
                 Plancode : '',
                 BranchCode : '',
                 SubconCode : '',
            }
        },
       Savedata(editObj){ 
         if(this.editObj.Plancode != undefined || this.editObj.BranchCode != undefined){
           this.axios.get(`${this.getUrl}/getAllDataForReceivedCount`).then(res=>{     
               if(res.data){
                   let index = res.data.findIndex((x) => x.Plancode == editObj.Plancode && x.DateReceived == editObj.DateReceived);
                   if(index > -1){
                       this.databaseObj = res.data[index]
                       this.rev = this.databaseObj._rev
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        toast: false,
                        title: 'Plancode Already Exist',
                        showConfirmButton: false,
                        timer: 1500
                    }) 
                        return false
                }else{
                    this.NewData(editObj)
                }
               }else{
                   this.NewData(editObj)
              }      
           }) 
           }else{
             Swal.fire({
            position: 'center',
            icon: 'error',
            toast: false,
            title: 'Field is Empty',
            showConfirmButton: false,
            timer: 1500
       })
        return false
      }    
    },
       async NewData(editObj){
              await  this.axios.get(`${this.getUrl}/GetKisoBranch/${editObj.Plancode}`).then(async res=>{
                 if(res.data){
                await res.data.filter(async r =>{
                    await this.axios.get(`${this.getUrl}/getFormulaData`).then(async res1=>{
                         if(res1.data){
                           await  res1.data.filter(r1=>{
                        if( editObj.SubconCode == r1.SubconCode && editObj.BranchCode == r1.BranchCode){
                            editObj.Subcon = r1.Subcon     
                        }
                        if(r1.BranchCode == '' && editObj.SubconCode == r1.SubconCode){
                           editObj.Subcon = r1.Subcon 
                        }              
                     })
                     await this.axios.get(`${this.getUrl}/getSubconEmailData`).then(async res2=>{
                      if(res2.data){
                        await res2.data.filter(r2=>{
                            if(editObj.Subcon == r2.Subcon){
                                editObj.EmailAddress = r2.EmailAddress
                            }
                          })
                      }

                     editObj._id = editObj.Plancode + '-' + editObj.DateReceived 
                     editObj.ConstructionCode = r.CategoryCode  
                    //  editObj.SubconCode = editObj.SubconCode
                     editObj.SubconHacchu = r.TraderName 
                     editObj.CustomerName = r.ConstructionName,
                     editObj.FirstDirectorName = r.EmployeeName,
                     editObj.KisoStart = r.StartedFoundationWorkDate
                     editObj.FirstDirectorEmail = r.MailAddress
                     editObj.Status = 'Sending'
                     editObj.AddPlanStaffName = this.userInfo.EmployeeName
                     editObj.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
                    this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: editObj
                }).then(res=>{
                    this.rev = res.data.rev
                })
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Saved',
                        showConfirmButton: false,
                        timer: 1000
                    })
                  this.close()
                setTimeout(() => {
                    this.$emit('loadSending',1)
                    this.$emit('loadSendingFilter',1)       
                }, 500);
                    }) 
                   }
                 })                     
                })
               }         
             })
        }
    }
}
</script>
<style>

</style>