<template>
  <v-container fluid v-resize="onResize">
    <div style="position:fixed; bottom:40px; center">
      <v-btn small dark color="#E98973" @click="ExportFinishedCsv()"
        >EXPORT FINISHED PLANS</v-btn
      >
    </div>
    <v-data-table
      :items="SearchData"
      :height="600"
      :items-per-page="200"
      fixed-header
      dense
    >
      <template v-slot:header="{ props: {} }">
        <thead v-if="FinishedData.length != 0">
          <tr>
            <th class="text-center pa-0">ID</th>
            <th class="text-center pa-0" width="130px">Date Received</th>
            <th class="text-center pa-0" width="150px">Control Number</th>
            <th class="text-center pa-0">Branch Code</th>
            <th class="text-center pa-0">Construction Code</th>
            <th class="text-center pa-0">Subcon</th>
            <th class="text-center pa-0" width="120px">Subcon Code</th>
            <th class="text-center pa-0" width="150px">Subcon Hacchu</th>
            <th class="text-center pa-0">Kiso Start</th>
            <!-- <th class="text-center pa-0">Print Remarks</th>
                <th class="text-center pa-0" width="120px">Print Date</th> -->
            <th class="text-center pa-0" width="120px">Sending Remarks</th>
            <th class="text-center pa-0" width="120px">Sending Date</th>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{ items }">
        <tbody v-for="(item, index) in items" :key="index">
          <tr>
            <td align="center" style="font-size:13px">{{ index + 1 }}</td>
            <td align="center" style="font-size:13px">
              {{ item.DateReceived }}
            </td>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <td
                  @click="Copy(item.Plancode)"
                  v-bind="attrs"
                  v-on="on"
                  class="myPointer"
                  align="center"
                  style="font-size:13px"
                >
                  {{ item.Plancode }}
                </td>
              </template>
              <span>Click to Copy</span>
            </v-tooltip>
            <td align="center" style="font-size:13px">{{ item.BranchCode }}</td>
            <td align="center" style="font-size:13px">
              {{ item.ConstructionCode }}
            </td>
            <td align="center" style="font-size:13px">{{ item.Subcon }}</td>
            <td align="center" style="font-size:13px">{{ item.SubconCode }}</td>
            <td align="center" style="font-size:13px">
              {{ item.SubconHacchu }}
            </td>
            <td align="center" style="font-size:13px">{{ item.KisoStart }}</td>
            <!-- <td align="center" style="font-size:13px">{{item.RemarksPrint}}</td>
                      <td align="center" style="font-size:13px">{{item.PrintingDate}}</td> -->
            <td align="center" style="font-size:13px">
              {{ item.SendingRemarks }}
            </td>
            <td align="center" style="font-size:13px">
              {{ item.SendingDate }}
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:top>
        <v-toolbar flat dense>
           <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
             <h3 v-bind="attrs"
              v-on="on" class="toolbarTitle myPointer" @click="AllFinished()">
            <v-icon color="blue" large>mdi-calendar</v-icon> Finished Plans
          </h3>
          </template>
          <span>View All Finished Plans</span>
        </v-tooltip>
         
          <v-spacer />
          <v-card color="#658EA9" class="mb-3 mr-1">
            <v-chip dark color="#658EA9" class="chip mr-2" label small>
              <span>Finished Plans :</span></v-chip
            >
            <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
              ><b>{{ FinishedData.length }}</b></span
            >
          </v-card>
          <v-card color="#658EA9" class="mb-3 mr-1">
            <v-chip dark color="#658EA9" class="chip mr-2" label small>
              <span>Sending Balance :</span></v-chip
            >
            <span style="font-size: 80%; font-family: sans-serif" class="mr-3"
              ><b>{{ SendingLength.length }}</b></span
            >
          </v-card>
          <!-- <v-card color="#658EA9" class="mb-3 ">
                    <v-chip dark color="#658EA9" class="chip mr-2" label small>
                        <span>Printing Balance:</span></v-chip
                    ><span style="font-size: 80%; font-family: sans-serif" class="mr-3"
                        ><b>{{PrintLength.length}}</b></span
                    >
                    </v-card>                                        -->
          <!-- <span class="mt-n2" style="font-family:Impact;font-size:15px;color:gray;">{{FinishedData.length}} Record(s) Found</span> -->
          <v-col cols="3">
            <a-input-search
              placeholder="Type to search..."
              size="large"
              class="mr-3 mb-3"
              v-model="Search"
            ></a-input-search>
          </v-col>
          <a-date-picker
            size="large"
            class=" mb-3"
            @change="loadFinished"
          ></a-date-picker>
        </v-toolbar>
        <v-divider /><v-divider />
      </template>
    </v-data-table>
     <loading-page :loadings="loadings" />
  </v-container>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import LoadingPage from "@/components/Others/LoadingPage.vue"
export default {
  name: "",
  components : {LoadingPage},
  data: () => ({
    menu: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),  loadings : false,
    FinishedData: [],
    Search: "",
    SendingLength: [],
    PrintLength: [],
  }),
  mounted() {
    this.AllFinished();
  },
  computed: {
    SearchData() {
      let Searchbar = this.FinishedData.filter((r) => {
        return (
          r.Plancode.toUpperCase().match(this.Search.toUpperCase()) ||
          r.BranchCode.toUpperCase().match(this.Search.toUpperCase()) ||
          r.ConstructionCode.toUpperCase().match(this.Search.toUpperCase()) ||
          r.DateReceived.toUpperCase().match(this.Search.toUpperCase()) ||
          r.Subcon.toUpperCase().match(this.Search.toUpperCase()) ||
          r.SubconCode.toUpperCase().match(this.Search.toUpperCase())
        );
      });
      return Searchbar;
    },
  },
  methods: {
    loadFinished(date, dateString) {
     
      this.date = dateString;
      this.axios
        .get(`${this.getUrl}/getFinishedData/${this.date}`)
        .then((res) => {
          if (res.data) {
            this.FinishedData = res.data;
            this.loadSendPrintLength();
            this.FinishedData = _.orderBy(
              this.FinishedData,
              ["DateReceived", "Plancode"],
              ["desc", "asc"]
            );
          }
        });
    },
    AllFinished() {
       this.loadings = true
      this.axios.get(`${this.getUrl}/getAllFinishedData`).then((res) => {
        if (res.data) {
          this.FinishedData = res.data;
          this.loadSendPrintLength();
          this.FinishedData = _.orderBy(
            this.FinishedData,
            ["DateReceived", "Plancode"],
            ["desc", "asc"]
          );
           this.loadings = false
        }
      });
    },
    loadSendPrintLength() {
      this.axios.get(`${this.getUrl}/getAllSendingData`).then((res) => {
        if (res.data) {
          this.SendingLength = res.data;
        }
      });
      this.axios
        .get(`${this.getUrl}/getReceivedData/` + this.date)
        .then((res) => {
          if (res.data) {
            this.PrintLength = res.data;
          }
        });
    },
    ExportFinishedCsv() {
      //         let filename = `${'Tekkin Sending'} ${moment().format("YYYY-MM-DD")}`
      //         this.axios.post(`${this.getUrl}/exportFinishedPlans`,{
      //         FinishedPlans : this.FinishedData, filename : filename

      //  })
      //   .then({responseType:'arraybuffer'}).then(res=>{
      //       if(res.data){
      //         if(res.data){
      //           const type = res.headers['content-type']
      //           const blob = new Blob([res.data], { type: type, encoding: 'UTF-8' })
      //           const link = document.createElement('a')
      //           link.href = window.URL.createObjectURL(blob)
      //           link.download = filename+'.csv'
      //           link.click()
      //         }else{
      //           this.$swal({
      //             title:'Error Occured',
      //             type: 'error',
      //             toast: true,
      //             position: 'center-end',
      //             showConfirmButton: false,
      //             timer: 3000
      //           })
      //         }
      //       }
      //     })
      this.FinishedData = _.orderBy(
        this.FinishedData,
        ["DateReceived", "Plancode"],
        ["desc", "asc"]
      );
      let filename = `${"Tekkin Finished "} ${moment().format("YYYY-MM-DD")}`;
      this.axios
        .post(
          `${this.getUrl}/exportFinishedPlans`,
          {
            FinishedPlans: this.FinishedData,
            filename: filename,
          },
          { responseType: "arraybuffer" }
        )
        .then((res) => {
          if (res.data) {
            const type = res.headers["content-type"];
            const blob = new Blob([res.data], {
              type: type,
              encoding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
          } else {
            this.$swal({
              title: "Error Occured",
              type: "error",
              toast: true,
              position: "center-end",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        });
    },
  },
};
</script>
<style></style>
