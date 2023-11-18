<template >
    <v-container fluid v-resize="onResize">
        <div style="position:fixed; bottom:40px; right:0px;">
            <v-tooltip left >
            <template v-slot:activator="{ on, attrs }">
              <v-btn small @click="openSubconMailDialog({},'Add New Record')" dark color="#E98973" fab  v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
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
                        <td align='center' width="130px"><span>{{item.Subcon}}</span></td>
                        <td align='center' width="100px" ><span style="color:#4169E1;">{{item.EmailAddress}}</span></td>
                        <td align='center' width="100px">
                        <v-icon  @click="openSubconMailDialog(item,'Update Record')" style="color:green;">mdi-pencil</v-icon>
                        <v-icon @click="DeleteSubEmail(item)" class="myPointer" style="color:#DC143C;">mdi-delete</v-icon>
                        </td>                       
                    </tr>
                </tbody> 
            </template>
            <template v-slot:top>
                <v-toolbar flat dense>
                    <h3 class="toolbarTitle"><v-icon color="blue" large>mdi-email-plus-outline</v-icon> Subcon Email</h3>
                    <v-spacer/>
                    <v-col cols="4">
                     <a-input-search placeholder="Type to search..." size="large" class="mr-3 mb-3" v-model="Search"></a-input-search>
                     </v-col>                   
                </v-toolbar>
                <v-divider/><v-divider/>
            </template>
        </v-data-table>
        <subcon-email-dialog :dialog="SubconMailDialog" :item="SubconMailItem" :type="Type" @loadSubconEmail="loadSubconEmail" @close="close"/>
    </v-container>
</template>
<script>
import SubconEmailDialog from './Dialog/SubconEmailDlg.vue'
import Swal from 'sweetalert2'
import _ from 'lodash'
export default {
    name: "",
    components: {SubconEmailDialog},
    data:()=>({
        menu:false ,date: new Date().toISOString().substr(0, 10),
        headers:[
            {text:'ID',value:'',align:'center'},
            {text:'Subcon',value:'',align:'center'},
            {text:'Email Address',value:'',align:'center'},
            {text:'Actions',value:'',align:'center'},   
            // {text:'Actions',value:'actions',align:'center'}, 
        ],
        SubconEmailData: [],
        SubconMailItem: {},
        Type: '',
        Search: '',
        SubconMailDialog: false 
       
    }),
    mounted(){
     this.loadSubconEmail()
    },
    computed: {
        SearchData() {
        return this.SubconEmailData.filter((data) => {
        if (this.Search) {
          let searchData = new RegExp(this.Search.toUpperCase());
          return JSON.stringify(Object.values(data))
            .toUpperCase()
            .match(searchData);
        } else {
          return data;
        }
      });
        // let Searchbar = this.FormulaData.filter((r) => {
        //     return (
        //     r.SubconCode.toUpperCase().match(this.Search.toUpperCase()) ||
        //     r.BranchCode.toUpperCase().match(this.Search.toUpperCase())      
        //     );
        // });
        // return Searchbar;
        },
  },           
    methods: {
        loadSubconEmail(){
            this.axios.get(`${this.getUrl}/getSubconEmailData`).then(res=>{
                if(res.data){
                    this.SubconEmailData = res.data
                }
               this.SubconEmailData = _.orderBy(this.SubconEmailData,['DateAdded'],['asc'])
            })
        },
    
        openSubconMailDialog(item,type){
           this.SubconMailItem = item
           this.Type = type
           this.SubconMailDialog = true
        },
        close(val){
            this.SubconMailDialog = val
        },
        DeleteSubEmail(item){
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
           let index = this.SubconEmailData.indexOf(item);
        this.axios.post(`${this.getUrl}/DeleteSubconEmail`, item).then(() => {
                  this.SubconEmailData.splice(index, 1);
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
    },
}
</script>
<style>

</style>