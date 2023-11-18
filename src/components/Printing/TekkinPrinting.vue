
<template >
    <v-container fluid v-resize="onResize">
        <div style="position:fixed; bottom:40px; right:0px;">
            <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-2 mr-1"
              small
              dark
              fab
              color="#E98973"
              v-bind="attrs"
              v-on="on"
              @click="openImportDialog()"
            >
            <v-icon>mdi-file-import-outline</v-icon>
            </v-btn>
          </template>
          <span>Import File</span>
        </v-tooltip>
            <v-tooltip top >
            <template v-slot:activator="{ on, attrs }">
              <v-btn small @click="openDialogPrinting()" dark color="#E98973" fab  v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
            <span>Add Plan</span>
            </v-tooltip>
        </div>
        <div style="position:fixed; bottom:40px; center">
            <v-btn small dark color="#E98973" @click="ExportCsv()">EXPORT PRINTING PLANS</v-btn>
        </div>
        
        <v-data-table dense
        :height="600" 
        :items="SearchData"
        :items-per-page="200"
        fixed-header
        >
             <template  v-slot:header="{props:{}}">
             <thead v-if="PrintData.length != 0"> 
            <tr>
                <th class="text-center pa-0" width="70px">
                 <input
                  type="checkbox"
                  v-model="selectedAll"
                  :value="PrintData"
                  class="pa-2 ma-0"
                  hide-details="auto"
                />
            
                <v-icon  @click="PrintAll('Select All')" fab small v-if="selectedAll.length  >=1" style="width:5px;height:20px;color:white" class="ml-4">mdi-printer</v-icon>
                 <v-icon  fab small v-else-if="selected.length  >=1" @click="PrintAll('Selected')" style="width:5px;height:20px;color:white" class="ml-4">mdi-printer</v-icon></th>
                <th class="text-center pa-0" >ID</th>
                <th class="text-center pa-0" width="130px">
                <div v-if="isFilter == true">
                <v-autocomplete
                  dark
                  v-model="date"
                  :items="DateReceivedItemsFilter"
                  @input="loadDatePrinting()"
                  dense
                  outlined
                  hide-details
                  label="Date Received"
                  persistent-placeholder
                  style="font-size: 10px !important"
                ></v-autocomplete>
              </div>
                   <span v-if="isFilter == false">Date Received</span>
                   
                </th>
                <th class="text-center pa-0" width="150px">Control Number</th>
                <th class="text-center pa-0" >
                 <div v-if="isFilter == true">
                    <v-autocomplete
                    dark
                    v-model="FilterBranchCodeModel"
                    :items="BranchItems"
                    @input="LoadFilterBranchcode()"
                    dense
                    outlined
                    hide-details
                    label="Branch Code"
                    persistent-placeholder
                    style="font-size: 10px !important"
                    ></v-autocomplete>
                </div> 
                <span v-if="isFilter == false">Branch Code</span>

                </th>
                <th class="text-center pa-0" >Construction Code</th>
                <th class="text-center pa-0">
                  <div v-if="isFilter == true">
                    <v-autocomplete
                    dark
                    v-model="SubconFilterModel"
                    :items="SubconItems"
                    @input="LoadFilterSubcon()"
                    dense
                    outlined
                    hide-details
                    label="Subcon"
                    persistent-placeholder
                    style="font-size: 10px !important"
                    ></v-autocomplete>
                  </div>
                   <span v-if="isFilter == false">Subcon</span>  
                </th>
                <th class="text-center pa-0" width="120px">
                   <div v-if="isFilter == true">
                    <v-autocomplete
                    dark
                    v-model="SubconcodeFilterModel"
                    :items="SubconcodeItems"
                    @input="LoadFilterSubconCode()"
                    dense
                    outlined
                    hide-details
                    label="Subcon Code"
                    persistent-placeholder
                    style="font-size: 10px !important"
                    ></v-autocomplete>
                </div> 
                <span v-if="isFilter == false">Subcon Code</span>  
                </th>
                <th class="text-center pa-0" width="150px">Subcon Hacchu</th>
                <th class="text-center pa-0" >Kiso Start</th>
                <th class="text-center pa-0">Remarks</th>
                <th class="text-center pa-0" >Printing</th>
            </tr> 
        </thead>
        </template>
       
         <template v-slot:body="{ items }">
              <tbody v-for="(item, index) in items" :key="index" >                
                  <tr>
                    <td align='center'  width="70px">
                <input v-if="selectedAll.length >=1"
                  type="checkbox"
                  v-model="selectedAll"
                  :value="items"
                  class="pa-2 ma-0"
                  hide-details="auto"
                />
                <input v-else
                  type="checkbox"
                  v-model="selected"
                  :value="item"
                  class="pa-2 ma-0"
                  hide-details="auto"
                />
                    </td>  
                    <td align='center'  style="font-size:13px">{{index+1}}</td>
                    <td align='center'  style="font-size:13px">{{item.DateReceived}}</td>
                    
                        <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <td @click="Copy(item.Plancode)" v-bind="attrs" v-on="on" class="myPointer" align='center'  style="font-size:13px">
                                {{item.Plancode}}</td>
                        </template>
                        <span>Click to Copy</span>
                        </v-tooltip>
                        
                    
                    <td align='center'  style="font-size:13px">{{item.BranchCode}} </td>
                    <td align='center'  style="font-size:13px">{{item.ConstructionCode}}</td>                    
                    <td align='center'  style="font-size:13px">{{item.Subcon}}</td>
                    <td align='center'  style="font-size:13px">{{item.SubconCode}}</td>
                    <td align='center'  style="font-size:13px">{{item.SubconHacchu}}</td>
                    <td align='center'  style="font-size:13px">{{item.KisoStart}}</td>
                    <td align='center' >
                        <input  type="text" id="text"  @blur="RemarksPrintSave(item)" v-model="item.RemarksPrint"/>
                    </td>    
                    <td align='center'  >
                     <v-tooltip top >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"   @click="PrintOk(item)" icon text>
                        <v-icon class="mr-1" outlined pill  color="green">mdi-printer-check</v-icon></v-btn>
                        </template>
                        <span>Print</span>
                        </v-tooltip>
                        </td>                   
                  </tr>
              </tbody> 
         </template>
            <template v-slot:top>
                <v-toolbar flat dense>
                    <h3 class="toolbarTitle myPointer " @click="loadAllPrinting()"  ><v-icon color="blue" large >mdi-printer</v-icon> Printing</h3>                                  
                    <v-spacer/>
                   <v-tooltip left v-if="PrintData.length >= 1">
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="#658EA9"
                        small
                        icon
                        outlined
                        @click="OpenFilter()"
                        class="mr-1 mb-2"
                        v-bind="attrs" v-on="on"
                        ><v-icon>mdi-filter</v-icon>
                      </v-btn>
                        </template>
                        <span>Filtering</span>
                        </v-tooltip>
                     
                         <!-- #7EC8E3 -->
                         
                    <v-card color="#658EA9" class="mb-3 mr-1">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Receive Today :</span></v-chip>
                    
                    <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{PrintData.length + SendingDataOutput.length + FinishedLength.length}}</b></span>
                            <!-- <span v-else style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{PrintData.length}}</b></span> -->
                    </v-card>
                    <v-card color="#658EA9" class="mb-3 mr-1">   
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Total Balance :</span></v-chip>
                    <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{PrintData.length}}</b></span>
                    </v-card> 
                    <v-card color="#658EA9" class="mb-3">   
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Output Today :</span></v-chip
                    ><span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{SendingDataOutput.length + FinishedLength.length}}</b></span>
                    </v-card>

                     <v-col cols="3">
                     <a-input-search placeholder="Type to search..." size="large" class="mr-3 mb-3" v-model="Search"></a-input-search>
                     </v-col>
                    <a-date-picker  size="large" class=" mb-3" @change="dateChange"  ></a-date-picker>                  
                </v-toolbar>
                <v-divider/><v-divider/>
            </template>
        </v-data-table>

       <dialog-printing :dialog="dialogPrinting" @loadDatePrinting="loadDatePrinting"  @closeDialogPrinting="closeDialogPrinting"/>
       <remarks-print-dlg :Dialog="RemarksDialog" :item="RemarksPrintItem" :rev="rev" @loadDatePrinting="loadDatePrinting" @ClosePrintRemarks="closePrintRemarks"/>
       <import-dialog :dialog="ImportDialog" @loadDatePrinting="loadDatePrinting" @CloseImportDlg="CloseImportDlg"/>
       <loading-page :loadings="loadings" />
    </v-container >
</template>
<script>
import DialogPrinting from './Dialog/DialogPrinting.vue'
import RemarksPrintDlg from './Dialog/RemarksPrintDialog.vue'
import ImportDialog from './Dialog/ImportDialog.vue'
import LoadingPage from "@/components/Others/LoadingPage.vue"
// import BarChart from "../components/BarChart.vue";
import moment from 'moment'
import Swal from "sweetalert2"
import _ from 'lodash'

export default {
    name: "",
    components:{DialogPrinting,RemarksPrintDlg,ImportDialog,LoadingPage},
    data:()=>({
        menu:false , 
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
        dialogPrinting:false,
        rev:'',page: 1,itemsPerPage: "",selectedAll:[],selected:[],
        RemarksPrintItem: {}, 
        PrintData: [],SendingDataOutput:[],FinishedLength:[], DateReceivedItems : [],
        RemarksDialog: false, ImportDialog: false, loadings:false,isFilter : false,
        Search: '',SelectedDateReceived : '',FilterBranchCodeModel : '',SubconFilterModel : '',SubconcodeFilterModel : '',
        DateReceivedItemsFilter : [],BranchItems:[],
        SubconItems : [], SubconcodeItems : [],
    }),
    mounted(){
        this.loadDatePrinting()  
        this.loadFilter()   
    },

    computed: {
        SearchData() {
        let Searchbar = this.PrintData.filter((r) => {
            return (
            r.Plancode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.BranchCode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.ConstructionCode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.SubconCode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.Subcon.toUpperCase().match(this.Search.toUpperCase()) ||  
            r.SubconCode.toUpperCase().match(this.Search.toUpperCase())      
            );
        });
        return Searchbar;
        },
  },    
    
    methods:{
        loadFilter(){
            this.axios.get(`${this.getUrl}/getAllReceivedData`).then(res=>{
                if(res.data){
               res.data.filter(r=>{
                   let DateReceived = _.uniq([r.DateReceived])
                    this.DateReceivedItemsFilter.push(DateReceived.join())
                    let BranchCode = _.uniq([r.BranchCode])
                    this.BranchItems.push(BranchCode.join())
                    let Subcon = _.uniq([r.Subcon])
                    this.SubconItems.push(Subcon.join()) 
                    let SubconCode = _.uniq([r.SubconCode])
                    this.SubconcodeItems.push(SubconCode.join())
                })   
               }    
            })
        },
        OpenFilter(){
            this.isFilter = true
        },
        LoadFilterBranchcode(){
            this.axios.get(`${this.getUrl}/GetFilterBranchcode/` + this.FilterBranchCodeModel).then(res=>{
                console.log(res.data)
                if(res.data){
                 let a = res.data.filter(r=>{
                        if(r.Status == 'Received'){
                            return r
                        }
                    })
                    this.PrintData = a
                    this.PrintData = _.orderBy(this.PrintData,['Subcon','Plancode'],['asc','asc'])
                }
                // console.log(this.PrintData)
            })
        },
        LoadFilterSubcon(){
            this.axios.get(`${this.getUrl}/GetFilterSubcon/` + this.SubconFilterModel).then(res=>{
                if(res.data){
                 let a = res.data.filter(r=>{
                        if(r.Status == 'Received'){
                            return r
                        }
                    })
                    this.PrintData = a
                    this.PrintData = _.orderBy(this.PrintData,['Subcon','Plancode'],['asc','asc'])
                }
                // console.log(this.PrintData)
            })
        },
        LoadFilterSubconCode(){
            this.axios.get(`${this.getUrl}/GetFilterSubconCode/` + this.SubconcodeFilterModel).then(res=>{
                if(res.data){
                 let a = res.data.filter(r=>{
                        if(r.Status == 'Received'){
                            return r
                        }
                    })
                    this.PrintData = a
                    this.PrintData = _.orderBy(this.PrintData,['Subcon','Plancode'],['asc','asc'])
                }
                // console.log(this.PrintData)
            })
        },
       loadDatePrinting(){
            this.axios.get(`${this.getUrl}/getReceivedData/` + this.date).then(res=>{
                if(res.data){
                this.PrintData = res.data
                this.loadSendingOutput()
                this.PrintData = _.orderBy(this.PrintData,['Subcon','Plancode'],['asc','asc'])     
               }                    
            })
        },  
        loadAllPrinting(){
            this.axios.get(`${this.getUrl}/getAllReceivedData`).then(res=>{
                if(res.data){
                this.PrintData = res.data
                this.PrintData = _.orderBy(this.PrintData,['Subcon','Plancode'],['asc','asc']) 
               }    
               
            })
            this.isFilter = false
        }, 
        
       loadSendingOutput(){
            this.axios.get(`${this.getUrl}/getSendingData/`+ this.date).then(res=>{
                if(res.data){
                    this.SendingDataOutput = res.data
                }
            })
            this.axios.get(`${this.getUrl}/getFinishedData/` + this.date).then(res=>{
                if(res.data){
                    this.FinishedLength = res.data
                }
            })
        },        
        dateChange(date,dateString){
            this.date = dateString 
             this.axios.get(`${this.getUrl}/getReceivedData/` + this.date).then(res=>{
                if(res.data){
                this.PrintData = res.data 
                this.PrintData = _.orderBy(this.PrintData,['Subcon','Plancode'],['asc','asc']) 
               }
            })    
        }, 
        PrintAll(type){                
         if(type == 'Select All'){
                this.selectedAll = this.PrintData
            this.selectedAll.filter(r=>{
                r.Status = 'Sending'
                r.StaffPrint = this.userInfo.EmployeeName
                r.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
                r.PrintingDate = moment().format('YYYY-MM-DD')
                this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: r
                })
                        Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Print',
                        showConfirmButton: false,
                        timer: 1000   
                        })
                setTimeout(() => {
                 this.loadDatePrinting()
                }, 500);
            })
        }else if(type == 'Selected'){
            this.selected.filter(r=>{
               r.Status = 'Sending'
               r.StaffPrint = this.userInfo.EmployeeName
               r.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
               r.PrintingDate = moment().format('YYYY-MM-DD')
               this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: r
                })
                     Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Print',    
                        showConfirmButton: false,
                        timer: 1000
                        })
                     setTimeout(() => {
                 this.loadDatePrinting()
                }, 500);
           })
          }       
      },                     
        PrintOk(item){ 
            item.Status = 'Sending'
            item.StaffPrint = this.userInfo.EmployeeName
            item.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
            item.PrintingDate = moment().format('YYYY-MM-DD')
           this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: item
                })
                        Swal.fire({
                        position: 'center',
                        icon: 'success',
                        toast: false,
                        title: 'Successfully Print',
                        showConfirmButton: false,
                        timer: 1000    
                        })
                        setTimeout(() => {
                 this.loadDatePrinting()
                }, 500);
        },
        
    ExportCsv(){ 
      let filename = `${'Print'}_${moment().format("YYYYMMDDHHmmss")}`
     this.axios.post(`${this.getUrl}/exportPrint`,{
       PrintData : this.PrintData,  filename : filename

     },{responseType:'arraybuffer'}).then(res=>{
    
          if(res.data){            
              const type = res.headers['content-type']
              const blob = new Blob([res.data], { type: type, encoding: 'UTF-8' })
              const link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = filename
              link.click()
            }else{
              this.$swal({
                title:'Error Occured',
                type: 'error',
                toast: true,
                position: 'center-end',
                showConfirmButton: false,
                timer: 3000
              })
             }
           })
                        
        },
        RemarksPrintSave(item){
            if(item.RemarksPrint != undefined || item.RemarksPrint != ''){
                this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: item
                })
            }else{
                return false
            }         
        },
        openImportDialog(){
            this.ImportDialog = true
        },
        openDialogPrinting(){
            this.dialogPrinting=true
        },
        ShowRemarks(item){
            this.RemarksPrintItem = item
            this.RemarksDialog = true
        },  
        CloseImportDlg(val){
            this.ImportDialog = val
        },
        closeDialogPrinting(val){
            this.dialogPrinting= val        
        },
        closePrintRemarks(val){
          this.RemarksDialog=val 
        },                                              
    }
}
</script>
<style>

</style>