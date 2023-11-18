<template >
    <v-container fluid v-resize="onResize">
        <div style="position:fixed; bottom:40px; right:0px;">
            <v-tooltip left >
            <template v-slot:activator="{ on, attrs }">
              <v-btn small @click="openSubconDialog({},'Add New Record')" dark color="#E98973" fab  v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
            <span>ADD NEW RECORD</span>
            </v-tooltip>
        </div>
        <v-data-table 
          dense 
          :headers="headers"
          :items="SearchData"
          :items-per-page="200"
          :height="600" 
           fixed-header>
            <template v-slot:body="{ items }">
                <tbody v-for="(item, index) in items" :key="index" >
                    <tr>
                        <td align='center' width="70px"><span>{{index+1}}</span></td>
                        <td align='center' width="130px"><span>{{item.SubconCode}}</span></td>
                        <td align='center' width="140px"><span>{{item.BranchCode}}</span></td>
                        <td align='center' width="130px"><span>{{item.SubconBranchCode}}</span></td>
                        <td align='center' width="100px"><span>{{item.Subcon}}</span></td>
                        <td align='center' width="100px">
                        <v-icon  @click="openSubconDialog(item,'Update Record')" style="color:green;">mdi-pencil</v-icon>
                        <v-icon @click="DeleteSubcons(item)" class="myPointer" style="color:#DC143C;">mdi-delete</v-icon>
                        </td>                       
                    </tr>
                </tbody> 
            </template>
            <template v-slot:top>
                <v-toolbar flat dense>
                    <h3 class="toolbarTitle"><v-icon color="blue" large>mdi-format-header-equal</v-icon> Formula</h3>
                    <v-spacer/>
                    <v-col cols="4">
                     <a-input-search placeholder="Type to search..." size="large" class="mr-3 mb-3" v-model="Search"></a-input-search>
                     </v-col>                   
                </v-toolbar>
                <v-divider/><v-divider/>
            </template>
        </v-data-table>
        <subcon-dialog-master :dialog="SubconDialog" :item="SubconItem" :type="Type" @loadFormula="loadFormula" @closeSubcon="closeSubcon"/>
    </v-container>
</template>
<script>
import SubconDialogMaster from './Dialog/SubconMasterDialog.vue'
import Swal from 'sweetalert2'
import _ from 'lodash'
export default {
    name: "",
    components: {SubconDialogMaster},
    data:()=>({
        menu:false ,date: new Date().toISOString().substr(0, 10),
        headers:[
            {text:'ID',value:'',align:'center'},
            {text:'Subcon Code',value:'',align:'center'},
            {text:'Branch Code',value:'',align:'center'},
            {text:'Subcon Code + Branch Code',value:'',align:'center'},
            {text:'Subcon',value:'',align:'center'},
            {text:'Actions',value:'',align:'center'},   
            // {text:'Actions',value:'actions',align:'center'}, 
        ],
        FormulaData: [],
        SubconItem: {},
        Type: '',
        Search: '',
        SubconDialog: false 
       
    }),
    mounted(){
     this.loadFormula()
    },
    computed: {
        SearchData() {
        return this.FormulaData.filter((data) => {
        if (this.Search) {
          let searchData = new RegExp(this.Search.toUpperCase());
          return JSON.stringify(Object.values(data))
            .toUpperCase()
            .match(searchData);
        } else {
          return data;
        }
      });
    },
  }, 
    methods: {
        loadFormula(){
            this.axios.get(`${this.getUrl}/getFormulaData`).then(res=>{
                if(res.data){
                    this.FormulaData = res.data
                }
               this.FormulaData = _.orderBy(this.FormulaData,['DateAdded'],['asc'])
            })
        },
        DeleteSubcons(item){
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
            let index = this.FormulaData.indexOf(item);
        this.axios.post(`${this.getUrl}/DeleteSubcons`, item).then(() => {
                    this.FormulaData.splice(index, 1);
                    Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: "Successfully Deleted",
                    showConfirmButton: false,
                    timer: 1800,
                    });
            })
            }
        })
      },   
      openSubconDialog(item,type){
            this.SubconItem = item
            this.Type = type
            this.SubconDialog = true
      },
      closeSubcon(val){
            this.SubconDialog = val
      }
    },
}
</script>
<style>

</style>