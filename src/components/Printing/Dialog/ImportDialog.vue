<template >
    <div>
        <v-dialog v-model="dialog" width ="500px" persistent>
       <v-card color="rgb(245,245,245)">
        <v-toolbar dark color="#658EA9" flat dense>
          <v-toolbar-title
           class="toolbarTitle">
              Import File
           </v-toolbar-title>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" @click="close()"
                >mdi-close-thick</v-icon
              >
            </template>
            <span>Close</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text class="mt-5">
          <v-container d-flex>
            <v-file-input
              background-color="white"
              v-model="csv"
              label="Select File"
              outlined
              dense
            ></v-file-input>
          </v-container>
          <v-container class="mt-n5" d-flex>
            <v-spacer />
            <v-btn @click="ImportingCsv()" color="#658EA9" dark>
              <v-icon>mdi-file-import-outline</v-icon> Import</v-btn
            >
          </v-container>
        </v-card-text>
      </v-card> 
      </v-dialog>
     <loading-page :loadings="loadings" />
    </div>
</template>
<script>
import LoadingPage from "@/components/Others/LoadingPage.vue"
import moment from 'moment'
export default {
    name:'Importing',
    props: ['dialog',],
    components : {LoadingPage},
    data() {
        return {
            csv:null,
            csvData: [],
            loadings: false,
            reader: new FileReader()
        }
    },
    methods: {

       async ImportingCsv(){     
            if(this.csv != undefined){       
            this.reader.onloadend = this.csvToJSON ;
            this.reader.readAsText(this.csv);  
           }else{
               return false
           }
        },
            
       async csvToJSON(e){
            let json = [];
            let csv = e.target.result;
            csv = csv.trim().split(/\r?\n/);
            var header = csv[0].split(",");
            header = header.map((item) => item.split(" ").join(""));
            for (let i = 1; i < csv.length; i++) {
                var obj = {};
                for (let j in header) {
                obj[header[j]] = csv[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[j].trim();
                }
                json.push(obj);
            }
           json.map(async (item) => {
                this.loadings = true  
             let res =   await this.axios.get(`${this.getUrl}/GetKisoBranch/${item.ControlNumber}`)
                 if(res.data){
                  for(let i in res.data){
                        let resSub =   await this.axios.get(`${this.getUrl}/getFormulaData`)
                        if(resSub.data){
                         resSub.data.filter(r1=>{
                        if(item.SubconCode == r1.SubconCode && res.data[i].BranchCode == r1.BranchCode){
                            res.data[i].TraderNameRoma = r1.Subcon
                        }
                        if(r1.BranchCode == '' && item.SubconCode == r1.SubconCode){
                           res.data[i].TraderNameRoma = r1.Subcon
                        } 
                     })

                    let SubconEmail = await this.axios.get(`${this.getUrl}/getSubconEmailData`)
                      if(SubconEmail.data){
                        await SubconEmail.data.filter(r2=>{
                            if(res.data[i].TraderNameRoma == r2.Subcon){
                                item.EmailAddress = r2.EmailAddress
                            }
                          })
                      }
                     item.DateReceived = moment().format('YYYY-MM-DD')
                     item.Status = 'Sending'
                     item.AddPlanStaffName = this.userInfo.EmployeeName
                     item.Plancode = item.ControlNumber
                     item._id = item.ControlNumber + '-' + item.DateReceived
                     item.SubconHacchu = res.data[i].TraderName
                     item.CustomerName = res.data[i].ConstructionName,
                     item.FirstDirectorName = res.data[i].EmployeeName,
                     item.FirstDirectorEmail = res.data[i].MailAddress
                     item.Subcon = res.data[i].TraderNameRoma
                     item.BranchCode = res.data[i].BranchCode
                     item.ConstructionCode = res.data[i].CategoryCode
                     item.KisoStart = res.data[i].StartedFoundationWorkDate
                    //  item.SubconCode = item.SubconCode
                     item.DateHour = moment().format('YYYY-MM-DD HH-mm-ss')
                      await   this.axios.post(`${this.getUrl}/insertDatabaseCsv`, item).then(rec=>{
                          console.log(rec)
                      })                    
                    } 
                  }
                }      
              this.close()
              setTimeout(() => {
              this.loadings = false
              this.csv = null;
              this.$emit('loadSending',1)     
            }, 2000);
            });  
        },
              close(){
            this.$emit('CloseImportDlg',false)         
        },
    },
}
</script>
<style >
    
</style>