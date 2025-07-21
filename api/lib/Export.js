const xlsx = require('node-xlsx');

class Export {
    constructor(){

    }

    /**
     * 
     * @param {Array} titles excel tablosunun basliklari ["ID", "CATEGORY NAME", "IS ACTIVE"]
     * @param {Array} columns excel tablosuna yazilacak verilerin isimleri [id, category name, is_active]
     * @param {Array} data  Excel tablosuna yazilacak veriler 
     */
    toExcel(titles, columns, data){
        
        let rows = [];

        /*
        [
            ["ID", "CATEGORY NAME", "IS ACTIVE"],
            ["asd", "sdfs", "sdfsf"]
        ]
        */

        rows.push(titles);

        for(let i = 0; i<data.length; i++){
            
            let item = data[i];
            let cols = [];

            for(let j = 0; j<columns.length; j++){
                cols.push(item[columns[j]]);
            }

            rows.push(cols);


        }

        return xlsx.build([{name: "Sheet",data: rows}])
    }

}

module.exports = Export;
