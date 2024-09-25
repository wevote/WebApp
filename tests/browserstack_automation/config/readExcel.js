import * as ExcelJS from 'exceljs'
const workbook = new ExcelJS.default.Workbook()
//const Excel = require('exceljs');
//const { default: readyPage } = require('../page_objects/ready.page');

class ExcelData {
    filepath = './tests/browserstack_automation/testData/statesandcandidates.xlsx';

    constructor(filepath,sheetName)
    {
        this.filepath = filepath || this.filepath;
        this.sheetName = sheetName;
    }


    async read(columnName)
    {
      //  let workbook = new Excel.workbook();

        try{
            await workbook.xlsx.readFile(this.filepath);
            const columnData=[];
            let worksheet= workbook.getWorksheet(this.sheetName);

            if(!worksheet)
            {
                throw new Error('Sheet '+{sheetName}+' not found in workbook');
            }

            const maxColumns = worksheet.actualColumnCount;
            let columnIndex = -1;

            for(let j=1;j<=maxColumns;j++)
            {
                if(worksheet.getRow(1).getCell(j).value == columnName)
                {
                    columnIndex=j;
                    break;
                }
            }

            if(columnIndex == -1)
            {
                throw new Error('Column '+{columnName}+' not found in worksheet');
            }

            const rows = worksheet.rowCount;

            for(let i=2;i<=rows;i++)
            {
                const row = worksheet.getRow(i);
                columnData.push(row.getCell(columnIndex).value);
            }
            return columnData;
        }catch (error)
        {
            console.error('Error reading the excel file:'+ error.message);
            throw error;
        }

        
    }

}

/*const excelRead = new ExcelData();
excelRead.read('stateName')
   .then((data) => {
    console.log(data);
   })
   .catch((error)=> 
{
    console.error('Error: ', error.message);
}) */

module.exports = ExcelData;