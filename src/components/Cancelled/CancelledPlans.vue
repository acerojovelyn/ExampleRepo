<template >
    <v-container fluid v-resize="onResize">
        <v-data-table 
         dense 
         :items="SearchData"
         :height="600" 
         :items-per-page="200"
         fixed-header>
         <template  v-slot:header="{props:{}}">
             <thead v-if="CancelData.length != 0">
            <tr>
                <th class="text-center pa-0" >ID</th>
                <th class="text-center pa-0" width="290px">Date Received</th>
                <th class="text-center pa-0" width="280px">Control Number</th>
                <th class="text-center pa-0">Branch Code</th>
                <th class="text-center pa-0" >Construction Code</th>
                <th class="text-center pa-0">Subcon</th>
                <th class="text-center pa-0" width="250px">Subcon Code</th>
                <th class="text-center pa-0" width="300px">Subcon Hacchu</th>
                <th class="text-center pa-0" >Kiso Start</th>
                <th class="text-center pa-0">Printing Remarks</th>
                <th class="text-center pa-0" width="160px">Printing Date</th>
                <th class="text-center pa-0">Sending Remarks</th>
                <!-- <th class="text-center pa-0" width="160px">Sending Date</th> -->
                <th class="text-center pa-0" width="120px">Cancel Date</th>
            </tr>
        </thead>
        </template>
            <template v-slot:body="{ items }">
                <tbody v-for="(item, index) in items" :key="index" >
                    <tr>
                      <td align="center" style="font-size:13px">{{index+1}}</td>
                      <td align="center" style="font-size:13px" >{{item.DateReceived}}</td>
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <td @click="Copy(item.Plancode)" v-bind="attrs" v-on="on" class="myPointer" align='center'  style="font-size:13px">
                                {{item.Plancode}}</td>
                        </template>
                        <span>Click to Copy</span>
                        </v-tooltip>
                      <td align="center" style="font-size:13px" >{{item.BranchCode}}</td>
                      <td align="center" style="font-size:13px" >{{item.ConstructionCode}}</td>
                      <td align="center" style="font-size:13px" >{{item.Subcon}}</td>
                      <td align="center" style="font-size:13px" >{{item.SubconCode}}</td>
                      <td align="center" style="font-size:13px" >{{item.SubconHacchu}}</td>
                      <td align="center" style="font-size:13px" >{{item.KisoStart}}</td>
                      <td align="center" style="font-size:13px" >{{item.RemarksPrint}}</td>
                      <td align="center" style="font-size:13px" >{{item.PrintingDate}}</td>
                      <td align="center" style="font-size:13px" >{{item.SendingRemarks}}</td>
                      <!-- <td align="center" style="font-size:13px" >{{item.SendingDate}}</td> -->
                      <td align="center" style="font-size:13px" >{{item.CancelDate}}</td>
                        <!-- <td><v-icon>mdi-pencil</v-icon></td> -->                       
                    </tr>
                </tbody> 
            </template>
            <template v-slot:top>
                <v-toolbar flat dense>
                    <h3 class="toolbarTitle"><v-icon color="blue" large>mdi-file-cancel</v-icon> Cancelled Plans</h3>
                    <v-spacer/>
                    <v-card color="#658EA9" class="mb-3 mr-1">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Cancelled Plans :</span></v-chip
                    >
                    <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{CancelData.length}}</b></span
                    >
                    </v-card>
                    <v-card color="#658EA9" class="mb-3 mr-1">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Sending Balance :</span></v-chip
                    >
                    <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{SendingLength.length}}</b></span
                    >
                    </v-card>
                    <!-- <v-card color="#658EA9" class="mb-3 ">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Printing Balance:</span></v-chip
                    ><span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{PrintLength.length}}</b></span
                    >
                    </v-card>            -->
                      <v-col cols="4">
                     <a-input-search placeholder="Type to search..." size="large" class="mr-3 mb-3" v-model="Search"></a-input-search>
                     </v-col>
                    <!-- <a-date-picker size="large" class=" mb-3" @change="loadDateSending"></a-date-picker>     -->
                    <!-- <div class="pb-3">
                        <v-btn small dark color="indigo" @click="select()"><v-icon>mdi-calendar-check</v-icon>select</v-btn>
                    </div> -->
                </v-toolbar>
                <v-divider/><v-divider/>
            </template>
        </v-data-table>
        
    </v-container>
</template>
<script>
import _ from 'lodash'
export default {
    name: "",
    data:()=>({
        menu:false ,date:new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
        CancelData: [],
        Search:'',
        SendingLength:[],
        PrintLength:[],
    }),
    mounted(){
        this.loadCancelled()
    },
    computed: {
        SearchData() {
        let Searchbar = this.CancelData.filter((r) => {
            return (
            r.Plancode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.BranchCode.toUpperCase().match(this.Search.toUpperCase()) ||
            r.ConstructionCode.toUpperCase().match(this.Search.toUpperCase())      
            );
        });
        return Searchbar;
        },
  },     
    methods: {
        loadCancelled(){
            this.axios.get(`${this.getUrl}/getAllCancelledData`).then(res=>{
                if(res.data){
                    this.CancelData = res.data 
                    this.loadSendPrintLength()
                    this.CancelData = _.orderBy(this.CancelData,['DateHour'],['desc'])   
                }
            })
        },
        loadSendPrintLength(){
            this.axios.get(`${this.getUrl}/getAllSendingData`).then(res=>{
                if(res.data){
                    this.SendingLength = res.data  
                }
            })
             this.axios.get(`${this.getUrl}/getReceivedData/` + this.date).then(res=>{
                if(res.data){
                this.PrintLength = res.data
                }
            })
        },               

    },
}
</script>
<style>

</style>