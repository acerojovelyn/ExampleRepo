const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const router = express.Router();
const { Parser } = require('json2csv');
const fsx = require('fs-extra');
const ExcelJS = require('exceljs');
// const _ = require("lodash");
const Excel = require("exceljs");
const mssql = require("mssql");
const hrdapps65db = require('nano')('http://root:sd1pwd@hrdapps65:5984')
const hrdapps50db = require('nano')('http://hrdapps50:5984')
router.use(cors()); //Cross-Origin Resource Sharing (CORS)
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
router.use(bodyParser.json());


//// ACTUAL DB
const tekkindb = hrdapps65db.use('tekkindb_jov');
const tekkinSubcondb = hrdapps65db.use('tekkinmastersubcon_jov'); 
const tekkinEmailSub = hrdapps65db.use('tekkinsubconemail_master'); 
const tekkinAccounts = hrdapps65db.use('tekkindb_accounts');

// // LOCAL DB
// const tekkindb = hrdapps50db.use('tekkintestdb_jov');
// const tekkinSubcondb = hrdapps50db.use('tekkinmastersubcon_test'); 
// const tekkinEmailSub = hrdapps50db.use('tekkinsubconemail_master_test'); 
// const tekkinAccounts = hrdapps50db.use('tekkintest_accounts');


var knex = require('knex')({
  client: 'mssql',
  connection: {
    host: 'HRDSQL',
    user: 'sa',
    password: '81at84',
    database: 'HrdInformationService',
    requestTimeout: 60000,
    options:{
      enableArithAbort: false,
       encrypt: false
    }
  },
})

router.get('/GetKisoBranch/:code',(req,res)=>{
  let code = req.params.code
  let sql = `SELECT TOP 1 Constructions.ConstructionCode, Constructions.ConstructionSectionCode AS BranchCode ,ConstructionSchedule.StartedFoundationWorkDate,
  TraderOrders.TraderCode,TraderOrders.CategoryCode, Traders.TraderName,Traders.TraderNameKana,Traders.TraderNameRoma,
  Constructions.FirstProcessorCode, Constructions.ConstructionName, Employees.EmployeeName ,Employees.MailAddress 
  FROM  Constructions LEFT JOIN ConstructionSchedule ON ConstructionSchedule.ConstructionCode = Constructions.ConstructionCode
  LEFT JOIN TraderOrders ON    Constructions.ConstructionCode = TraderOrders.ConstructionCode
  LEFT JOIN Traders ON Traders.TraderCode = TraderOrders.TraderCode
  LEFT JOIN TraderLists ON Traders.TraderCode = TraderLists.TraderCode
  LEFT JOIN Employees ON Constructions.FirstProcessorCode = Employees.EmployeeCode
  WHERE TraderOrders.CategoryCode = '520' AND Constructions.ConstructionCode = '${code}'`
  knex.raw(sql).then(rec => { 
    if(rec){
      rec.filter(r=>{  
        r.StartedFoundationWorkDate =  r.StartedFoundationWorkDate ? moment(r.StartedFoundationWorkDate).format('YYYY/MM/DD') :''
      })
    }
    res.send(rec)
  })
})

router.get('/GetSubconTraders/:code',(req,res)=>{
  let code = req.params.code
  let sql = `SELECT a.ConstructionCode, a.TraderCode, b.TraderName,b.TraderNameKana,b.TraderNameRoma FROM TraderOrders a
  LEFT JOIN Traders b ON a.TraderCode = b.TraderCode
  WHERE a.CategoryCode = '520' AND ConstructionCode = '${code}'`
  knex.raw(sql).then(rec=>{
    res.send(rec)
  }) 
})

router.post('/insertDatabaseCsv', (req, res) => {
  tekkindb.insert(req.body).then(body => {
  res.send(body)
}).catch(err=>{
  console.log(err.message+'/get 71')
})
})
router.post('/insertDatabase', (req, res) => {
  // console.log(req.body.Database)
  tekkindb.insert(req.body.Database).then(body => {
  res.send(body)
}).catch(err=>{
  console.log(err.message+'/get 81')
})
})
// router.get('/getAllReceivedData',(req,res)=>{
//   tekkindb.list({
//     include_docs:true
//    }).then(body => {
//      let data = body.rows.map(r=>{return r.doc})
//      res.send(data)
//    })
//  })
 router.get('/getAllDataForReceivedCount',(req,res)=>{
  tekkindb.view('jov', 'AllPlancodes', {
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   }).catch(err=>{
    console.log(err.message+'/get 97')
  })
 })
router.get('/getReceivedData/:date',(req,res)=>{
  tekkindb.view('jov', 'Printing', {
    key:moment(req.params.date).format("YYYY-MM-DD"),
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })
 router.get('/getAllReceivedData',(req,res)=>{
  tekkindb.view('jov', 'Printing', {
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   }).catch(err=>{
    console.log(err.message+'/get 114')
  })
 })

 router.get('/getSendingData/:date',(req,res)=>{
  tekkindb.view('jov', 'Sending', {
     key:moment(req.params.date).format("YYYY-MM-DD"),
     include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })

 router.get('/getAllSendingData',(req,res)=>{
  tekkindb.view('jov', 'Sending', {
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })

 router.get('/getAllCancelledData',(req,res)=>{
  tekkindb.view('jov', 'Cancelled', {
     include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })

//  router.get('/getCancelledDate',(req,res)=>{
//   tekkindb.view('jov', 'Cancelled', {
//     key:moment(req.params.date).format("YYYY-MM-DD"),
//      include_docs:true
//    }).then(body => {
//      let data = body.rows.map(r=>{return r.doc})
//      res.send(data)
//    })
//  })
 router.get('/getFormulaData',(req,res)=>{
  tekkinSubcondb.list({ include_docs:true   
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })
  router.get('/getSubconEmailData',(req,res)=>{
  tekkinEmailSub.list({ include_docs:true   
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })
 router.post('/insertSubconEmailDatabase', (req, res) => {
  tekkinEmailSub.insert(req.body.Database).then(body => { 
  res.send(body)
 })
})
 router.get('/getFinishedData/:date',(req,res)=>{
  tekkindb.view('jov','Finished',{
    key:moment(req.params.date).format("YYYY-MM-DD"),
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })
  router.get('/getFinishedOutput/:date',(req,res)=>{
  tekkindb.view('jov','FinishedOuput',{
    key:moment(req.params.date).format("YYYY-MM-DD"),
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })
 router.get('/getAllFinishedData',(req,res)=>{
  tekkindb.view('jov','Finished',{
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r=>{return r.doc})
     res.send(data)
   })
 })
 router.post('/insertSubconDatabase', (req, res) => {
  tekkinSubcondb.insert(req.body.Database).then(body => { 
  res.send(body)
 })
})

router.post('/RegisterAccount', (req, res) => {
  tekkinAccounts.insert(req.body.item).then(body => { 
  res.send(body)
 })
})
router.get('/AllRegisteredAccounts', (req, res) => {
  tekkinAccounts.view('jovtekkin','AllAccounts',{
    include_docs:true
   }).then(body => { 
    let data = body.rows.map(r=>{return r.doc})
    res.send(data)
 })
})
router.get('/LoginAccounts/:password', (req, res) => {
  tekkinAccounts.view('jovtekkin','loginPassword',{
    key:req.params.password,
    include_docs:true
   }).then(body => { 
    let data = body.rows.map(r=>{return r.doc})
    res.send(data)
 })
})

router.post('/DeleteAccount',(req,res) =>{
  tekkinAccounts.destroy(req.body._id, req.body._rev).then((rec) => {
    res.send(rec);
  });
})
router.post('/DeleteSendingPlans',(req,res) =>{
  tekkindb.destroy(req.body._id, req.body._rev).then((rec) => {
    res.send(rec);
  });
})
router.post('/DeleteSubcons',(req,res) =>{
  tekkinSubcondb.destroy(req.body._id, req.body._rev).then((rec) => {
    res.send(rec);
  });
})
router.post('/DeleteSubconEmail',(req,res) =>{
  tekkinEmailSub.destroy(req.body._id, req.body._rev).then((rec) => {
    res.send(rec);
  });
})

 router.get('/GetFilterBranchcode/:branchcode',(req,res)=>{
  tekkindb.view('jov','BranchCodeFilter',{
    key:req.params.branchcode,
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r => { return r.doc })
     res.send(data)
   })
 })
  router.get('/GetFilterSubcon/:subcon',(req,res)=>{
  tekkindb.view('jov','SubconFilter',{
    key:req.params.subcon,
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r => { return r.doc })
     res.send(data)
   })
  })
   router.get('/GetFilterSubconCode/:subconCode',(req,res)=>{
  tekkindb.view('jov','SubconCodeFilter',{
    key:req.params.subconCode,
    include_docs:true
   }).then(body => {
     let data = body.rows.map(r => { return r.doc })
     res.send(data)
   })
 })
router.post('/exportPrint/', (req,res)=>{
 const workbook = new ExcelJS.Workbook();
  const worksheet =  workbook.addWorksheet(`${'Tekkin Sending'} ${moment().format("YYYY-MM-DD")}`);
 
    worksheet.getRow(1).values=['Date Received','Control Number','Branch Code','Construction Code','Subcon','Subcon Code','Subcon(Hacchu)','Kiso Start','Print Remarks','Printing','Sending Remarks','Sending Date','Cancel Date','Status','customername','branchcode','first_director']
    worksheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center'}
    worksheet.getRow(1).font = {
      name: 'Century Gothic',
      family: 5,
      size: 12,
      underline: false,
      bold: false,
    
  };

 worksheet.columns = [
      {key: 'DateReceived', width: 30},
      {key: 'Plancode', width: 30 },
      {key: 'BranchCode', width: 30},
      {key: 'ConstructionCode', width: 30},
      {key: 'Subcon', width: 30},
      {key: 'SubconCode', width: 30},
      { key: 'SubconHacchu', width: 30 },  
      { key: 'KisoStart', width: 30 },
      { key: 'RemarksPrint', width: 30 },
      { key: 'PrintingDate', width: 30 },
      { key: 'SendingRemarks', width: 30 },
      { key: 'SendingDate', width: 30 },
      { key: 'CancelDate', width: 30},
      { key: 'Status', width: 30 },
      { key: 'CustomerName', width: 30 },
      { key: 'BranchCode', width: 30 },
      { key: 'FirstDirectorName', width: 30 },
      
  ];
  
  let SendingPlans = req.body.SendData
      SendingPlans.forEach((rec,index)=>{
      
      worksheet.getCell(`A${index+1+1}`).value = rec.DateReceived
      worksheet.getCell(`A${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}

      worksheet.getCell(`B${index+1+1}`).value = rec.Plancode
      worksheet.getCell(`B${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}
      
      worksheet.getCell(`C${index+1+1}`).value = rec.BranchCode
      worksheet.getCell(`C${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
        
      worksheet.getCell(`D${index+1+1}`).value = rec.ConstructionCode
      worksheet.getCell(`D${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  

      worksheet.getCell(`E${index+1+1}`).value = rec.Subcon
      worksheet.getCell(`E${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}

      worksheet.getCell(`F${index+1+1}`).value = rec.SubconCode
      worksheet.getCell(`F${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}

      worksheet.getCell(`G${index+1+1}`).value = rec.SubconHacchu
      worksheet.getCell(`G${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
        
      worksheet.getCell(`H${index+1+1}`).value = rec.KisoStart
      worksheet.getCell(`H${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}
      
      worksheet.getCell(`I${index+1+1}`).value = rec.RemarksPrint
      worksheet.getCell(`I${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  

      worksheet.getCell(`J${index+1+1}`).value = rec.PrintingDate
      worksheet.getCell(`J${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  
      
      worksheet.getCell(`K${index+1+1}`).value = rec.SendingRemarks
      worksheet.getCell(`K${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  
      
      worksheet.getCell(`L${index+1+1}`).value = rec.SendingDate
      worksheet.getCell(`L${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  
    
      worksheet.getCell(`M${index+1+1}`).value = rec.CancelDate
      worksheet.getCell(`M${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
        
      worksheet.getCell(`N${index+1+1}`).value = rec.Status
      worksheet.getCell(`N${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
      
      worksheet.getCell(`O${index+1+1}`).value = rec.CustomerName
      worksheet.getCell(`O${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
      
      worksheet.getCell(`P${index+1+1}`).value = rec.BranchCode
      worksheet.getCell(`P${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
      
      worksheet.getCell(`Q${index+1+1}`).value = rec.FirstDirectorName
      worksheet.getCell(`Q${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
        
        
      })
   
          workbook.xlsx.writeFile(`./tempDir/ExractSendingData_${moment().format('YYYY-MM-DD')}.xls`);
          setTimeout(() => {
            res.download(`./tempDir/ExractSendingData_${moment().format('YYYY-MM-DD')}.xls`)
          }, 1000);
        
  // let extract = req.body.SendData
  // const fields = [
  //      {label : 'Date Received', value : 'DateReceived'},
  //      {label : 'Control Number', value : 'Plancode',},
  //      { label: 'Branch Code', value: 'BranchCode',},
  //      {label : 'Construction Code', value : 'ConstructionCode',},       
  //      {label : 'Subcon' , value : 'Subcon',},
  //      {label: 'Subcon Code', value: 'SubconCode' ,},
  //      {label : 'Subcon Hacchu' , value : 'SubconHacchu',},
  //      {label : 'Kiso Start' , value : 'KisoStart',}, 
  //      { label: 'Print Remarks', value: 'RemarksPrint' ,},
  //      {label : 'Printing' , value : 'PrintingDate',},
  //      { label: 'Sending Remarks', value: 'SendingRemarks' ,},
  //      { label: 'Sending Date', value: 'SendingDate' ,},
  //      { label: 'Cancel Date', value: 'CancelDate' ,},
  //      { label: 'Status', value: 'Status' ,},
  //      { label: 'customername', value: 'CustomerName' ,align: 'center',width: 30},
  //      { label: 'branchcode', value: 'BranchCode' ,align: 'center',width: 30},
  //      {label : 'first_director' , value : 'FirstDirectorName',align: 'center',width: 30},
  //     ]
  
  //     const json2csvParser = new Parser({ fields })
  //     const csv = json2csvParser.parse(extract)
  //     fsx.outputFile('tempDir/' + req.body.filename + '.csv', csv)
  //       .then(() => {
  //         res.download('tempDir/' + req.body.filename + '.csv')
  //       }).catch(err => { res.send('error'); console.error(err) })   
  //   .catch(err=>{
  //     console.log(err.message+'/extract2610')   
  //     console.log(logs)
  //   })
})

router.post('/exportFinishedPlans', (req, res) => {
  // console.log(req.body.FinishedPlans,'test')
  // let extract = req.body.FinishedPlans
  // const fields = [
  //      {label : 'Date Received', value : 'DateReceived'},
  //      {label : 'Control Number', value : 'Plancode',},
  //      { label: 'Branch Code', value: 'BranchCode',},
  //      {label : 'Construction Code', value : 'ConstructionCode',},       
  //      {label : 'Subcon' , value : 'Subcon',},
  //      {label: 'Subcon Code', value: 'SubconCode' ,},
  //      {label : 'Subcon Hacchu' , value : 'SubconHacchu',},
  //      {label : 'Kiso Start' , value : 'KisoStart',}, 
  //      { label: 'Print Remarks', value: 'RemarksPrint' ,},
  //      {label : 'Printing' , value : 'PrintingDate',},
  //      { label: 'Sending Remarks', value: 'SendingRemarks' ,},
  //      { label: 'Sending Date', value: 'SendingDate' ,},
  //      { label: 'Cancel Date', value: 'CancelDate' ,},
  //      { label: 'Status', value: 'Status' ,},
  //     ]
  
  //     const json2csvParser = new Parser({ fields })
  //     const csv = json2csvParser.parse(extract)
  //     fsx.outputFile('tempDir/' + req.body.filename + '.csv', csv)
  //       .then(() => {
  //         res.download('tempDir/' + req.body.filename + '.csv')
  //       }).catch(err => { res.send('error'); console.error(err) })   
  //   .catch(err=>{
  //     console.log(err.message+'/extract2610')   
  //     console.log(logs)
  //   })
  
  const workbook = new ExcelJS.Workbook();
  const worksheet =  workbook.addWorksheet(`${'Tekkin Finished '} ${moment().format("YYYY-MM-DD")}`);
 
    worksheet.getRow(1).values=['Date Received','Control Number','Branch Code','Construction Code','Subcon','Subcon Code','Subcon(Hacchu)','Kiso Start','Print Remarks','Print Date','Sending Remarks','Sending Date','Cancel Date','Status']
    worksheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center'}
    worksheet.getRow(1).font = {
      name: 'Century Gothic',
      family: 5,
      size: 12,
      underline: false,
      bold: false,
    
  };

 worksheet.columns = [
      {key: 'DateReceived', width: 30},
      {key: 'Plancode', width: 30 },
      {key: 'BranchCode', width: 30},
      {key: 'ConstructionCode', width: 30},
      {key: 'Subcon', width: 30},
      {key: 'SubconCode', width: 30},
      { key: 'SubconHacchu', width: 30 },  
      { key: 'KisoStart', width: 30 },
      { key: 'RemarksPrint', width: 30 },
      { key: 'PrintingDate', width: 30 },
      { key: 'SendingRemarks', width: 30 },
      { key: 'SendingDate', width: 30 },
      { key: 'CancelDate', width: 30 },
      { key: 'Status', width: 30 },
      
  ];
  
  let FinishedPlans = req.body.FinishedPlans
      FinishedPlans.forEach((rec,index)=>{
      
      worksheet.getCell(`A${index+1+1}`).value = rec.DateReceived
      worksheet.getCell(`A${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}

      worksheet.getCell(`B${index+1+1}`).value = rec.Plancode
      worksheet.getCell(`B${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}
      
      worksheet.getCell(`C${index+1+1}`).value = rec.BranchCode
      worksheet.getCell(`C${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
        
      worksheet.getCell(`D${index+1+1}`).value = rec.ConstructionCode
      worksheet.getCell(`D${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  

      worksheet.getCell(`E${index+1+1}`).value = rec.Subcon
      worksheet.getCell(`E${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}

      worksheet.getCell(`F${index+1+1}`).value = rec.SubconCode
      worksheet.getCell(`F${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}

      worksheet.getCell(`G${index+1+1}`).value = rec.SubconHacchu
      worksheet.getCell(`G${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
        
      worksheet.getCell(`H${index+1+1}`).value = rec.KisoStart
      worksheet.getCell(`H${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}
      
      worksheet.getCell(`I${index+1+1}`).value = rec.RemarksPrint
      worksheet.getCell(`I${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  

      worksheet.getCell(`J${index+1+1}`).value = rec.PrintingDate
      worksheet.getCell(`J${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  
      
      worksheet.getCell(`K${index+1+1}`).value = rec.SendingRemarks
      worksheet.getCell(`K${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}  
      
      worksheet.getCell(`L${index+1+1}`).value = rec.SendingDate
      worksheet.getCell(`L${index + 1 + 1}`).alignment = { vertical: 'middle', horizontal: 'center' }
      
      worksheet.getCell(`M${index+1+1}`).value = rec.CancelDate
      worksheet.getCell(`M${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'} 
    
      worksheet.getCell(`N${index+1+1}`).value = rec.Status
      worksheet.getCell(`N${index+1+1}`).alignment = {vertical: 'middle', horizontal: 'center'}
      })
   
          workbook.xlsx.writeFile(`./tempDir/ExractFinishedData_${moment().format('YYYY-MM-DD')}.xls`);
          setTimeout(() => {
            res.download(`./tempDir/ExractFinishedData_${moment().format('YYYY-MM-DD')}.xls`)
          }, 1000);
})







module.exports = router;