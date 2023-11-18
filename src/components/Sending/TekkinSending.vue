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
            <v-btn small dark color="#E98973" @click="ExportCsv()">EXPORT SENDING PLANS</v-btn>
        </div>
        <!-- <div id="app" >
            <v-app id="inspire"> -->
      <!-- <div> -->
         
         <v-data-table dense 
        :items="SearchData"
        :height="600" 
        :items-per-page="200"
        fixed-header  
        >
        <template  v-slot:header="{props:{}}">
             <thead v-if="SendingData.length != 0">
            <tr>
                <th class="text-center pa-0" width="70px">
                 <input
                  class="myPointer"
                  type="checkbox"
                  v-model="selectedAll"
                  :value="SendingData"
                  hide-details="auto"
                />

                <v-icon @click="SendAll('Select All')" fab small v-if="selectedAll.length  >=1" style="width:5px;height:20px;color:white" class="ml-4">mdi-send-check</v-icon>
                 <v-icon  fab small v-else-if="selected.length  >=1" @click="SendAll('Selected')" style="width:5px;height:20px;color:white" class="ml-4">mdi-send-check</v-icon></th>
                <th class="text-center pa-0" >ID</th>
                <th class="text-center pa-0" width="150px">
                 <div v-if="isFilter == true">
                <v-autocomplete
                  dark
                  v-model="SelectedDateReceived"
                  :items="DateReceivedItemsFilter"
                  @input="loadFilterDateReceived()"
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
                <th class="text-center pa-0" width="200px">Control Number</th>
                <th class="text-center pa-0">
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
                <th class="text-center pa-0">Construction Code</th>
                <th class="text-center pa-0" >
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
                <th class="text-center pa-0" >
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
                <th class="text-center pa-0" width="200px">Subcon Hacchu</th>
                <th class="text-center pa-0" >Kiso Start</th>
                <!-- <th class="text-center pa-0">Printing Remarks</th> -->
                <!-- <th class="text-center pa-0" >Printing Date</th> -->
                <th class="text-center pa-0" >Sending Remarks</th>
                <th class="text-center pa-0" >Send</th>
                <th class="text-center pa-0" >Cancel</th>
            </tr>
        </thead> 
        </template>
        <template v-slot:body="{ items }">
              <tbody v-for="(item, index) in items" :key="index" >
                  <tr> 
                      <td align='center'  width="20px">
                <input v-if="selectedAll.length >=1"
                  type="checkbox"
                  v-model="selectedAll"
                  :value="items"              
                  hide-details="auto"
                  class="myPointer"
                />
                <input v-else
                  type="checkbox"
                  v-model="selected"
                  :value="item"
                  hide-details="auto"
                  class="myPointer"
                />

                    </td>  
                      <td align="center " style="font-size:13px"   >{{index+1}}</td>
                      <td align="center" style="font-size:13px" >{{item.DateReceived}}</td>
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <td @click="Copy(item.Plancode)" v-bind="attrs" v-on="on" class="myPointer" align='center'  style="font-size:13px">
                                {{item.Plancode}}</td>
                        </template>
                        <span>Click to Copy</span>
                        </v-tooltip>
                      
                      <td align="center" style="font-size:13px" >{{item.BranchCode}}</td>
                      <td align="center" style="font-size:13px"  >{{item.ConstructionCode}}</td>
                      <td  align="center" style="font-size:13px"  class="myPointer" @click="copy(item)">
                        <!-- cc=other@domain.com&bcc=hidden@domain.com& -->
                        <!-- <a class="text-decoration-none" :href="`mailto:${item.EmailAddress}?cc=other@domain.com&bcc=hidden@domain.com&subject=一条発注物件設計図書 ${item.Plancode}`"
                       >{{item.Subcon}}</a> -->
                      <a class="text-decoration-none" :href="`mailto:${item.EmailAddress}?subject=一条発注物件設計図書 ${item.Plancode}`"
                       >{{item.Subcon}}</a></td>
                      <td align="center" style="font-size:13px"  >{{item.SubconCode}}</td>
                      <td align="center" style="font-size:13px"  >{{item.SubconHacchu}}</td>
                      <td align="center" style="font-size:13px"  >{{item.KisoStart}}</td>
                      <td  align="center" >
                         <input  type="text" id="text"  @blur="SendingRemarksSave(item)" v-model="item.SendingRemarks"/> 
                      </td>
                      <td  align="center">
                          <v-icon  @click="Sending(item)"  color="green">mdi-send-check</v-icon>                  
                      </td>
                      <td align="center" >
                          <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small @click="Cancel(item)" color="red" v-bind="attrs" v-on="on">mdi-cancel</v-icon>
                        </template>
                        <span>Cancel</span>
                        </v-tooltip>
                        <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small @click="DeletePlan(item)" color="red" v-bind="attrs" v-on="on">mdi-delete</v-icon>
                        </template>
                        <span>Delete</span>
                        </v-tooltip>                     
                      </td>
                  
                  </tr>
              </tbody> 
         </template>
            <template v-slot:top>
                <v-toolbar flat dense>
                    <h3 class="toolbarTitle myPointer"  @click="loadSending()"><v-icon color="blue" large>mdi-email-send</v-icon> Sending</h3>
                    <v-spacer/>

                    <v-tooltip left v-if="SendingData.length >= 1">
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

                    <v-card color="#658EA9" class="mb-3 mr-1" >
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Receive Today :</span></v-chip>
                    <span  style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{SendingOutput.length + FinishedLgth.length}}</b></span>
                    </v-card> 
                    <v-card color="#658EA9" class="mb-3 mr-1">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Total Balance :</span></v-chip>
                    <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{SendingData.length}}</b></span>
                    </v-card>
                    <v-card color="#658EA9" class="mb-3 ">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Output Today :</span></v-chip
                    ><span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{FinishedLength.length}}</b></span>
                    </v-card>                    
                     <v-col cols="3">
                     <a-input-search placeholder="Type to search..." size="large" class="mr-3 mb-3" v-model="Search"></a-input-search>
                     </v-col>
                    <a-date-picker size="large" class=" mb-3" @change="DateChange"></a-date-picker>                    
                </v-toolbar>
                <v-divider/><v-divider/>
            </template>
        </v-data-table>   

         <sending-remarks-dlg :Dialog="SendingRemarksDialog" :item="SendRemarksItem"  @loadSending="loadSending" @CloseRemarks="CloseRemarks" />
         <send-cancel-dlg :Dialog="SendCancelDialog" :item="SendCancelItem" @loadSending="loadSending" @Close="CloseSendCancel"/>
         <dialog-printing :dialog="dialogPrinting" @loadSending="loadSending" @loadSendingFilter="loadSendingFilter"  @closeDialogPrinting="closeDialogPrinting"/>
         <import-dialog :dialog="ImportDialog" @loadSending="loadSending" @CloseImportDlg="CloseImportDlg"/>
    </v-container>

</template>
<script>

import SendingRemarksDlg from './Dialog/SendingRemarks.vue'
import SendCancelDlg from './Dialog/SendCancelDlg.vue'
import DialogPrinting from '@/components/Printing/Dialog/DialogPrinting.vue'
import ImportDialog from "@/components/Printing/Dialog/ImportDialog.vue" 
import Swal from "sweetalert2"
import moment from 'moment'
import {orderBy, uniq} from 'lodash'
export default {
    name: "",
    components: {SendingRemarksDlg,SendCancelDlg,DialogPrinting,ImportDialog},
    data:()=>({
        menu:false ,isFilter : false,
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
        selectedAll:[],selected:[],SendingRemarksDialog:false,SendRemarksItem: {},
        SendingData:[],SendCancelDialog:false,SendCancelItem:{},AllReceived:[],FinishedLength:[],FinishedLgth : [],
        Search:'',SendingOutput: [], ImportDialog : false,dialogPrinting : false,
        SelectedDateReceived : '',FilterBranchCodeModel : '',SubconFilterModel : '',SubconcodeFilterModel : '',
        DateReceivedItemsFilter : [],BranchItems:[],
        SubconItems : [], SubconcodeItems : [],

        returnSubcon : null
    }),
    computed: {
        SearchData() {
        let Searchbar = this.SendingData.filter((r) => {
            return (
            r.Plancode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.BranchCode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.ConstructionCode.toUpperCase().match(this.Search.toUpperCase()) || 
            r.Subcon.toUpperCase().match(this.Search.toUpperCase()) ||  
            r.SubconCode.toUpperCase().match(this.Search.toUpperCase())   
            );
        });
        return Searchbar;
        },
  }, 
    mounted() {
        this.loadSending()
        this.loadSendingFilter()
    },        
    methods: {  
        loadSendingFilter(){        
            this.DateReceivedItemsFilter = ['ALL']
            this.BranchItems = ['ALL']
            this.SubconItems = ['ALL']
            this.SubconcodeItems = ['ALL']
            this.axios.get(`${this.getUrl}/getAllSendingData`).then(res=>{
                if(res.data){
               res.data.filter(r=>{
                   let DateReceived = uniq([r.DateReceived])
                    this.DateReceivedItemsFilter.push(DateReceived.join())
                    let BranchCode = uniq([r.BranchCode])
                    this.BranchItems.push(BranchCode.join())
                    let Subcon = uniq([r.Subcon])
                    this.SubconItems.push(Subcon.join()) 
                    let SubconCode = uniq([r.SubconCode])
                    this.SubconcodeItems.push(SubconCode.join())
                })   
               }       
            })
        },
        loadFilterDateReceived(){
            if(this.SelectedDateReceived == 'ALL'){
                this.loadSending()
            }else{
                this.axios.get(`${this.getUrl}/getSendingData/` + this.SelectedDateReceived).then(res=>{
                    if(res.data){                        
                    let a = res.data.filter(r=>{
                        if(this.FilterBranchCodeModel != '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel != ''){
                           let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel && x.Subcon == this.SubconFilterModel && x.SubconCode == this.SubconcodeFilterModel 
                                    );
                         if(index > -1){
                             if(this.FilterBranchCodeModel == r.BranchCode && this.SubconFilterModel == r.Subcon && this.SubconcodeFilterModel == r.SubconCode){
                               return r 
                             }
                         }else{
                             Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    toast: false,
                                    title: 'No Record Found!',
                                    showConfirmButton: false,
                                    timer: 1000  
                                })
                            this.SelectedDateReceived = ''
                            setTimeout(() => {
                                this.LoadFilterSubcon()
                            }, 500);
                            
                         }          
                          
                        }else if(this.SubconFilterModel != '' && this.FilterBranchCodeModel == '' && this.SubconcodeFilterModel == ''){
                         let index = res.data.findIndex(
                                    (x) => x.Subcon == this.SubconFilterModel 
                                    );
                         if(index > -1){
                             if(this.SubconFilterModel == r.Subcon ){           
                               return r 
                             }      
                         }else{
                             Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    toast: false,
                                    title: 'No Record Found!',
                                    showConfirmButton: false,
                                    timer: 1000   
                                })
                            this.SubconcodeFilterModel = ''
                            this.FilterBranchCodeModel = ''
                            this.SelectedDateReceived = ''
                            setTimeout(() => {
                                this.LoadFilterSubcon() 
                            }, 500);
                            
                            // this.loadSending()
                         }
                        }else if(this.FilterBranchCodeModel != '' && this.SubconFilterModel == '' && this.SubconcodeFilterModel == ''){
                            let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel 
                            );
                            if(index > -1){
                               if(this.FilterBranchCodeModel == r.BranchCode ){
                                    return r 
                               }
                            }else{
                               Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    toast: false,
                                    title: 'No Record Found!',
                                    showConfirmButton: false,
                                    timer: 1000   
                                })
                                this.SubconFilterModel = ''
                                this.SubconcodeFilterModel = ''
                                this.SelectedDateReceived = ''
                                 setTimeout(() => {
                                this.LoadFilterBranchcode() 
                            }, 500);
                                
                            }
                         
                        }else if(this.SubconcodeFilterModel != '' && this.FilterBranchCodeModel == '' && this.SubconFilterModel == ''){
                          let index = res.data.findIndex(
                                    (x) => x.SubconCode == this.SubconcodeFilterModel
                            );
                            if(index > -1){
                                if(this.SubconcodeFilterModel == r.SubconCode ){
                                    return r 
                                }
                            }else{
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    toast: false,
                                    title: 'No Record Found!',
                                    showConfirmButton: false,
                                    timer: 1000   
                                })
                                this.SubconFilterModel = ''
                                this.FilterBranchCodeModel = ''
                                this.SelectedDateReceived = ''
                                setTimeout(() => {
                                this.LoadFilterSubconCode() 
                                }, 500);
                                
                            }
                            
                        }
                        else if(this.FilterBranchCodeModel != '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel == ''){           
                          let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel && x.Subcon == this.SubconFilterModel
                          );
                          if(index > -1){
                              if(this.FilterBranchCodeModel == r.BranchCode && this.SubconFilterModel == r.Subcon ){
                                    return r 
                              }
                          }else{
                              Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    toast: false,
                                    title: 'No Record Found!',
                                    showConfirmButton: false,
                                    timer: 1000   
                                })
                                this.SubconcodeFilterModel = ''
                                this.SelectedDateReceived = ''
                                setTimeout(() => {
                                this.LoadFilterSubcon() 
                                }, 500);
                                
                          }                      
                        }
                        else if(this.FilterBranchCodeModel == '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel != ''){           
                          let index = res.data.findIndex(
                                    (x) => x.SubconCode == this.SubconcodeFilterModel && x.Subcon == this.SubconFilterModel
                          );
                          if(index > -1){
                              if(this.SubconcodeFilterModel == r.SubconCode && this.SubconFilterModel == r.Subcon ){
                                    return r 
                              }
                          }else{
                              Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    toast: false,
                                    title: 'No Record Found!',
                                    showConfirmButton: false,
                                    timer: 1000   
                                })
                                
                                this.SelectedDateReceived = ''
                                setTimeout(() => {
                                this.LoadFilterSubcon() 
                                }, 500);
                                
                          }
                          
                        }
                        else{
                            return r
                        }                       
                    })    
                   
                    this.SendingData = a
                    this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])             
                }                           
              })
            } 
        },  
        LoadFilterBranchcode(){
            if(this.FilterBranchCodeModel == 'ALL'){
                this.loadSending()
            }else{
                    this.axios.get(`${this.getUrl}/GetFilterBranchcode/` + this.FilterBranchCodeModel).then(res=>{
                    if(res.data){
                        let a = res.data.filter(r=>{       
                            if(this.SelectedDateReceived != '' && this.SubconFilterModel == '' && this.SubconcodeFilterModel == ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived 
                                    );
                                    if(index > -1){
                                        if(this.SelectedDateReceived == r.DateReceived){
                                         return r 
                                        }  
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })
                                        
                                            this.SubconFilterModel = ''
                                            this.SubconcodeFilterModel = ''
                                            this.FilterBranchCodeModel = ''
                                            setTimeout(() => {
                                            this.loadFilterDateReceived()  
                                            }, 500);
                                            
                                    }
                                        
                            //    }
                            }else if(this.SubconFilterModel != '' && this.SelectedDateReceived == '' && this.SubconcodeFilterModel == ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.Subcon == this.SubconFilterModel  
                                    );
                                    if(index > -1){
                                        if(this.SubconFilterModel == r.Subcon){
                                         return r 
                                        }
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })
                                            this.SelectedDateReceived = ''
                                            this.SubconcodeFilterModel = ''
                                            this.FilterBranchCodeModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubcon()  
                                            }, 500);
                                             
                                    }
                                          
                            //    }
                            }else if(this.SubconcodeFilterModel != '' && this.SubconFilterModel == '' && this.SelectedDateReceived == ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.SubconCode == this.SubconcodeFilterModel 
                                    );
                                    if(index > -1){
                                        if(this.SubconcodeFilterModel == r.SubconCode){
                                         return r 
                                        } 
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })
                                            this.SelectedDateReceived = ''
                                            this.SubconFilterModel = ''
                                            this.FilterBranchCodeModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubconCode()  
                                            }, 500);
                                            
                                    }                                        
                            //    }
                            }else if(this.SelectedDateReceived != '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel != ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived && x.Subcon == this.SubconFilterModel && x.SubconCode == this.SubconcodeFilterModel 
                                    );
                                    if(index > -1){
                                        if(this.SelectedDateReceived == r.DateReceived && this.SubconFilterModel == r.Subcon && this.SubconcodeFilterModel == r.SubconCode){
                                         return r 
                                        }  
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })
                                            this.FilterBranchCodeModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubcon()  
                                            }, 500);
                                            
                                    }                                       
                            //    }
                            }else if(this.SelectedDateReceived == '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel != ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.Subcon == this.SubconFilterModel && x.SubconCode == this.SubconcodeFilterModel 
                                    );
                                    if(index > -1){
                                        if(this.SubconFilterModel == r.Subcon && this.SubconcodeFilterModel == r.SubconCode){
                                         return r 
                                        } 
                                    }else{
                                       Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })
                                            this.SelectedDateReceived = ''
                                            this.FilterBranchCodeModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubcon()   
                                            }, 500);
                                            
                                    }         
                            //    }
                            }
                            else if(this.SelectedDateReceived != '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel == ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived && x.Subcon == this.SubconFilterModel 
                                    );
                                    if(index > -1){
                                        if(this.SubconFilterModel == r.Subcon && this.SelectedDateReceived == r.DateReceived){
                                         return r 
                                        } 
                                    }else{
                                         Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })
                                           this.SubconcodeFilterModel = ''
                                            this.FilterBranchCodeModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubcon()   
                                            }, 500);
                                            
                                    }
                                        
                            //    }
                            }
                            else{
                                if(r.Status == 'Sending'){
                                return r   
                                }
                            }
                        })
                        this.SendingData = a
                        this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])
                    }
                  })
                
          }
        },
        LoadFilterSubcon(){
            if(this.SubconFilterModel == 'ALL'){
                this.loadSending()
            }else{
            this.axios.get(`${this.getUrl}/GetFilterSubcon/` + this.SubconFilterModel).then(res=>{
                if(res.data){     
                       let a = res.data.filter(r=>{
                        if(this.SelectedDateReceived != '' && this.FilterBranchCodeModel == '' && this.SubconcodeFilterModel == ''){                            
                                    let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived && x.Subcon == this.SubconFilterModel 
                                    );
                                    console.log(index,'test',r)
                                    if(index > -1){
                                        if(this.SelectedDateReceived == r.DateReceived){
                                         return r 
                                        } 
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })  
                                            this.FilterBranchCodeModel = ''
                                            this.SubconcodeFilterModel = ''
                                            this.SubconFilterModel = ''
                                            setTimeout(() => {
                                            this.loadFilterDateReceived()   
                                            }, 500);
                                            
                                    }
                                         
                               
                        }else if(this.FilterBranchCodeModel != '' && this.SelectedDateReceived == '' && this.SubconcodeFilterModel == ''){
                            
                            // if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel 
                                );
                                if(index > -1){
                                    if(this.FilterBranchCodeModel == r.BranchCode && this.SubconFilterModel == r.Subcon){
                                         return r 
                                    }
                                }else{
                                    Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })  
                                            this.SelectedDateReceived = ''
                                            this.SubconcodeFilterModel = ''
                                            this.SubconFilterModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterBranchcode()   
                                            }, 500);
                                            
                                    
                                }
                               
                            // }
                        }else if(this.SubconcodeFilterModel != '' && this.SelectedDateReceived == '' && this.FilterBranchCodeModel == ''){
                            // if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.SubconCode == this.SubconcodeFilterModel 
                                );
                                if(index > -1){
                                    if(this.SubconcodeFilterModel == r.SubconCode){
                                     return r 
                                    }
                                }else{
                                   Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })  
                                            this.SelectedDateReceived = ''
                                            this.FilterBranchCodeModel = ''
                                            this.SubconFilterModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubconCode()   
                                            }, 500);
                                             
                                }
                                
                            // }
                        }else if(this.SelectedDateReceived != '' && this.FilterBranchCodeModel != '' && this.SubconcodeFilterModel != ''){
                            console.log('3')
                            // if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived && x.BranchCode == this.FilterBranchCodeModel && x.SubconCode == this.SubconcodeFilterModel 
                                );
                                if(index > -1){
                                    if(this.SelectedDateReceived == r.DateReceived && this.FilterBranchCodeModel == r.BranchCode && this.SubconcodeFilterModel == r.SubconCode && this.SubconFilterModel == r.Subcon){
                                        return r 
                                    } 
                                }else{
                                    Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })  
                                            
                                            this.SubconFilterModel = ''
                                            setTimeout(() => {
                                            this.loadFilterDateReceived()   
                                            }, 500);
                                             
                                }
                               
                            // }
                        }else if(this.SelectedDateReceived != '' && this.FilterBranchCodeModel != '' && this.SubconcodeFilterModel == ''){
                            
                            // if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived && x.BranchCode == this.FilterBranchCodeModel 
                                );
                                if(index > -1){
                                    if(this.SelectedDateReceived == r.DateReceived && this.FilterBranchCodeModel == r.BranchCode &&  this.SubconFilterModel == r.Subcon){
                                        return r 
                                    } 
                                }else{
                                    Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })  
                                            this.SubconCodeFilterModel = ''
                                            this.SubconFilterModel = ''
                                            setTimeout(() => {
                                            this.loadFilterDateReceived()   
                                            }, 500);
                                            
                                }
                               
                            // }
                        }else if(this.SelectedDateReceived == '' && this.FilterBranchCodeModel != '' && this.SubconcodeFilterModel != ''){
                            console.log('5')
                            // if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel && x.SubconCode == this.SubconcodeFilterModel 
                                );
                                if(index > -1){
                                    if(this.FilterBranchCodeModel == r.BranchCode &&  this.SubconFilterModel == r.Subcon){
                                      return r 
                                    } 
                                }else{
                                    Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                        })  
                                            this.SelectedDateReceived = ''
                                            this.SubconFilterModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterBranchcode()   
                                            }, 500);
                                            
                                }
                               
                            // }
                        
                        }else if(this.SelectedDateReceived == '' && this.FilterBranchCodeModel != '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel == ''){
                            console.log('7')
                            // if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel && x.Subcon == this.SubconFilterModel 
                                );
                                if(index > -1){
                                    if(this.FilterBranchCodeModel == r.BranchCode &&  this.SubconFilterModel == r.Subcon){
                                        return r 
                                    } 
                                }else{
                                    Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                            this.SelectedDateReceived = ''
                                            setTimeout(() => {
                                            this.LoadFilterBranchcode()   
                                            }, 500);
                                            
                                }
                               
                            // }
                        }
                        // else if(this.SelectedDateReceived == '' && this.FilterBranchCodeModel == '' && this.SubconFilterModel != '' && this.SubconcodeFilterModel != ''){
                        //     console.log('8')
                        //     if(r.Status == 'Sending'){
                        //        if(this.SubconcodeFilterModel == r.SubconCode &&  this.SubconFilterModel == r.Subcon){
                        //             return r 
                        //        } 
                        //     }
                        // }
                        else{
                            if(r.Status == 'Sending'){
                            return r   
                            }
                        }
                    }) 
                    this.SendingData = a
                    this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])
                }
            })
           }
        },
        LoadFilterSubconCode(){
            if(this.SubconcodeFilterModel == 'ALL'){
                this.loadSending()
            }else{
            this.axios.get(`${this.getUrl}/GetFilterSubconCode/` + this.SubconcodeFilterModel).then(res=>{
                if(res.data){
                 let a = res.data.filter(r=>{
                        if(this.SelectedDateReceived != '' && this.FilterBranchCodeModel == '' && this.SubconFilterModel == ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived  
                                    );
                                    if(index > -1){
                                        if(this.SelectedDateReceived == r.DateReceived && this.SubconFilterModel == r.Subcon){
                                         return r 
                                        }
                                    }else{
                                      Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                            this.SubconcodeFilterModel = ''
                                            setTimeout(() => {
                                            this.loadFilterDateReceived()  
                                            }, 500);
                                              
                                    }
                                      
                            //    }
                        }else if(this.FilterBranchCodeModel != '' && this.SelectedDateReceived == '' && this.SubconFilterModel == ''){
                                // if(r.Status == 'Sending'){
                                     let index = res.data.findIndex(
                                    (x) => x.BranchCode == this.FilterBranchCodeModel  
                                    );
                                    if(index > -1){
                                        if(this.FilterBranchCodeModel == r.BranchCode){
                                            return r 
                                        } 
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                            this.SubconcodeFilterModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterBranchcode() 
                                            }, 500);
                                              
                                    }
                                         
                                // }
                        }else if(this.SubconFilterModel != '' && this.SelectedDateReceived == '' && this.FilterBranchCodeModel == ''){
                            //    if(r.Status == 'Sending'){
                                let index = res.data.findIndex(
                                    (x) => x.Subcon == this.SubconFilterModel  
                                );
                                    if(index > -1){
                                        if(this.SubconFilterModel == r.Subcon){
                                                return r 
                                            } 
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                           
                                            this.SubconcodeFilterModel = ''
                                            setTimeout(() => {
                                            this.LoadFilterSubcon() 
                                            }, 500);
                                            
                                    }

                                         
                                // }
                        }else if(this.SelectedDateReceived != '' && this.FilterBranchCodeModel != '' && this.SubconFilterModel != ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) => x.DateReceived == this.SelectedDateReceived && x.BranchCode == this.FilterBranchCodeModel && x.Subcon == this.SubconFilterModel 
                                    );
                                    if(index > -1){
                                        if(this.SelectedDateReceived == r.DateReceived && this.FilterBranchCodeModel == r.BranchCode && this.SubconFilterModel == r.Subcon){
                                            return r 
                                        }  
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                            
                                            this.SubconcodeFilterModel = ''
                                            setTimeout(() => {
                                             this.LoadFilterSubcon()
                                            }, 500);
                                            
                                    }
                                        
                                // }
                        }
                        else if(this.SelectedDateReceived == '' && this.FilterBranchCodeModel != '' && this.SubconFilterModel != ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) =>  x.BranchCode == this.FilterBranchCodeModel && x.Subcon == this.SubconFilterModel 
                                    );
                                    if(index > -1){
                                        if(this.FilterBranchCodeModel == r.BranchCode && this.SubconFilterModel == r.Subcon){
                                            return r 
                                        } 
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                            
                                            this.SubconcodeFilterModel = ''
                                            setTimeout(() => {
                                             this.LoadFilterSubcon()
                                            }, 500);
                                            
                                    }
                                         
                                // }
                        }else if(this.SelectedDateReceived != '' && this.FilterBranchCodeModel != '' && this.SubconFilterModel == ''){
                                // if(r.Status == 'Sending'){
                                    let index = res.data.findIndex(
                                    (x) =>  x.BranchCode == this.FilterBranchCodeModel && x.DateReceived == this.SelectedDateReceived 
                                    );
                                    if(index > -1){
                                        if(this.FilterBranchCodeModel == r.BranchCode && this.SelectedDateReceived == r.DateReceived){
                                            return r 
                                        } 
                                    }else{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            toast: false,
                                            title: 'No Record Found!',
                                            showConfirmButton: false,
                                            timer: 1000   
                                    })  
                                            
                                            this.SubconcodeFilterModel = ''
                                            setTimeout(() => {
                                             this.LoadFilterBranchcode()
                                            }, 500);
                                            
                                    }
                                         
                                // }
                        }
                        else{
                            if(r.Status == 'Sending'){
                                return r   
                            }
                        }
                    })
                    this.SendingData = a
                    this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])
                }
            })
           } 
        },
        OpenFilter(){
            this.isFilter = true
        },
        loadDateSending(){
            this.axios.get(`${this.getUrl}/getSendingData/` + this.date).then(res=>{
                if(res.data){
                this.SendingData = res.data
                this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])     
               }                              
            })
        },  
       loadSending(){
           if(this.FilterBranchCodeModel == 'ALL' || this.SubconFilterModel == 'ALL' || this.SubconcodeFilterModel == 'ALL' || this.SelectedDateReceived == 'ALL'){
               
               this.SubconFilterModel = ''
               this.SubconcodeFilterModel = ''
               this.FilterBranchCodeModel = ''
               this.SelectedDateReceived = ''
           }
            this.axios.get(`${this.getUrl}/getAllSendingData`).then(res=>{
                if(res.data){
                    this.SendingData = res.data
                    this.loadFinishedOutput() 
                    this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])   
                }
            })
        },
        loadFinishedOutput(){
            this.axios.get(`${this.getUrl}/getFinishedData/${this.date}`).then(res=>{
                if(res.data){
                    this.FinishedLength = res.data
                }
            })
            this.axios.get(`${this.getUrl}/getFinishedOutput/${this.date}`).then(res=>{
                if(res.data){
                    this.FinishedLgth = res.data
                }
            })
            this.axios.get(`${this.getUrl}/getSendingData/${this.date}`).then(res=>{
                if(res.data){
                    this.SendingOutput = res.data
                }
            })
        }, 
        DateChange(date,dateString){
         this.date = dateString
          this.axios.get(`${this.getUrl}/getSendingData/${this.date}`).then(res=>{
           if(res.data){
            this.SendingData = res.data  
            this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc'])  
           }
          })
        }, 
         SendAll(type){       
            if(type == 'Select All'){
                this.selectedAll = this.SendingData
                this.selectedAll.filter(r=>{
                    r.Status = 'Finished'
                    r.StaffSend = this.userInfo.EmployeeName
                    r.DateHour = moment().format('YYYY-MM-DD HH:mm:ss')
                    r.SendingDate = moment().format('YYYY-MM-DD')
                    this.axios.post(`${this.getUrl}/insertDatabase`,{
                        Database: r
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
                    this.loadSending()
                    this.loadSendingFilter()
                }, 500); 
                })
                this.SelectedDateReceived = ''
                this.FilterBranchCodeModel = ''
                this.SubconFilterModel = ''
                this.SubconcodeFilterModel = ''
                this.isFilter = true
            }else if(type == 'Selected'){
                this.selected.filter(r=>{
                r.Status = 'Finished'
                r.StaffSend = this.userInfo.EmployeeName
                r.SendingDate = moment().format('YYYY-MM-DD')
                this.axios.post(`${this.getUrl}/insertDatabase`,{
                        Database: r
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
                    this.loadSending()
                    this.loadSendingFilter()
                }, 500); 
                })
                this.SelectedDateReceived = ''
                this.FilterBranchCodeModel = ''
                this.SubconFilterModel = ''
                this.SubconcodeFilterModel = ''
            this.isFilter = true
            }   
      },
       Sending(item){      
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
                this.loadSending()
                this.loadSendingFilter()
            }, 500); 
            
            this.SelectedDateReceived = ''
            this.FilterBranchCodeModel = ''
            this.SubconFilterModel = ''
            this.SubconcodeFilterModel = ''
            this.isFilter = true
      },
      Cancel(item){           
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
           this.loadSending()
      },500);  
      },
        OpenSendCancelDialog(item){
            this.SendCancelItem = item
            this.SendCancelDialog = true
        },
        ShowRemarksDialog(item){
            this.SendRemarksItem = item
            this.SendingRemarksDialog = true
        },
        SendingRemarksSave(item){
            if(item.SendingRemarks != ''  ){
                 this.axios.post(`${this.getUrl}/insertDatabase`,{
                    Database: item
            })
            setTimeout(() => {             
                    this.loadFilterDateReceived()
                    this.LoadFilterBranchcode()
                    this.LoadFilterSubcon()
                    this.LoadFilterSubconCode()
                }, 500); 
            }
             
        }, 
        CloseSendCancel(val){
            this.SendCancelDialog = val
        },
        CloseRemarks(val){
          this.SendingRemarksDialog = val 
        },  
    copy(item) {
        console.log(item)
            
            let a = '鉄筋業者各位　様 \n\n'
            a+='いつもお世話になっております。\n'
            a+='ユニット鉄筋等に関する資料をメールいたします。\n'
            a+='添付ファイルをご参照ください。\n\n'

            a+='なお、その日の最初に送信しましたメールには送付リストが添付しておりますので、\n'
            a+='そのリストをチェックしていただきリストのみを下記アドレスまでご返信ください。\n'
            a+='資料が不足している際はその旨を『鉄筋業者様　ご記入欄』にご入力ください。\n\n'

            a+='アンカーボルト発注明細一覧はアンカーボルト発注時に別途送信となります。\n\n'

            a+='リスト返信先アドレス：hac07@hrd-s.com\n\n'

           a+='※免震・3階建て現場に関してはコシペレットを基礎業者様に配送していただく必要が\n'
            a+='あります。基礎業者様の配送先に関しては下記工事課担当者へご確認ください。\n\n'
            

            a+=`前行程担当者：${item.FirstDirectorName}  ${item.FirstDirectorEmail}\n`


            this.$clipboard(a.toString());
            // console.log(a.toString())
        },
        DeletePlan(item){
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
           let index = this.SendingData.indexOf(item);
        this.axios.post(`${this.getUrl}/DeleteSendingPlans`, item).then(() => {
                  this.SendingData.splice(index, 1);
                  Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: "Plan Successfully Deleted",
                    showConfirmButton: false,
                    timer: 1800,
                  });
            })
            this.isFilter = true 
          }
       })
      },
        ExportCsv(){ 
            // let filename = `${'Tekkin Sending'} ${moment().format("YYYY-MM-DD")}`
            // this.axios.post(`${this.getUrl}/exportPrint`,{
            // SendData : this.SendingData,  filename : filename

            // })
            // .then({responseType:'arraybuffer'}).then(res=>{
            //     if(res.data){
            //         if(res.data){
            //         const type = res.headers['content-type']
            //         const blob = new Blob([res.data], { type: type, encoding: 'Shift-JIS' })
            //         const link = document.createElement('a')
            //         link.href = window.URL.createObjectURL(blob)
            //         link.download = filename+'.csv'
            //         link.click()
            //         }else{
            //         this.$swal({
            //             title:'Error Occured',
            //             type: 'error',
            //             toast: true,
            //             position: 'center-end',
            //             showConfirmButton: false,
            //             timer: 3000
            //         })
            //         }
            //     }
            //     })

    //         let csvContent = "data:text/csv;charset=shift-jis";
    //   csvContent += [
    //     Object.keys(this.SendingData[0]).join(","),
    //     ...this.SendingData.map(item => Object.values(item).join(","))
    //   ]
    //     .join("\n")
    //     .replace(/(^\[)|(\]$)/gm, "");

    //   const data = encodeURI(csvContent);
    //   const link = document.createElement("a");

    //   link.setAttribute("href", data);
    //   link.setAttribute("download", "exportcsv.csv");
    //   link.click();

        this.SendingData = orderBy(this.SendingData,['Subcon','Plancode'],['asc','asc']) 
      let filename = `${'Tekkin Sending'} ${moment().format("YYYY-MM-DD")}`
     this.axios.post(`${this.getUrl}/exportPrint`,{
       SendData : this.SendingData,  filename : filename

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
        openImportDialog(){
            this.ImportDialog = true
        },
        openDialogPrinting(){
            this.dialogPrinting=true
        },
        CloseImportDlg(val){
            this.ImportDialog = val
        },
        closeDialogPrinting(val){
            this.dialogPrinting= val        
        },

    },

}
</script>
<style scoped>
    /* .tableStyle{
        overflow-x: scroll;
    } */
</style>