import React from 'react';
import DataTable from 'react-data-table-component';
import { RiskContext } from '../../../risk-data/RiskContext';
import { RiskData, RiskDataObject } from '../../../risk-data/RiskDataType';

// modify type to allow JSX.Element
type RiskDataTableObject = RiskDataObject | {
  data: {
    "Risk Factors": {
      [key: string]: number,
    } | JSX.Element[],
  }[]
};
type RiskDataTable = RiskData | {
  "Risk Factors": {
    [key: string]: number,
  } | JSX.Element[] | string,
}

type columnSpec = {
  name: string,
  selector: (row: RiskData) => string | number | JSX.Element,
  sortable: boolean,
}




export const RiskDataTable:React.FC = () => {
  const [columnData, setColumnData] = React.useState<any>([]);
  const [tableData, setTableData] = React.useState<RiskDataTable[] | []>([]);

  const { filteredRiskData, selectedRiskFactors, riskFactorsList, riskFilterType, toggleRiskFactorFilter, updateSelectedRiskFactors } = React.useContext(RiskContext);

  // process data

  const processTableData = () => {
    let columns:columnSpec[] = [];
    // set columns

    if (filteredRiskData && filteredRiskData.data.length) {
      Object.entries(filteredRiskData.data[0]).forEach(([key, value]) => {
        columns.push({
          name: key,
          //@ts-ignore
          selector: row => row[key],
          sortable: true,
        })
      })
      setColumnData(columns);
    }
    if (filteredRiskData && filteredRiskData.data) {
      console.log("set table",filteredRiskData);
      setTableData(filteredRiskData.data as RiskDataTable[]);
    }
  }

  const processRiskFactors = () => {
    // modify data for table
    let parsedTableData:RiskDataTable[] = JSON.parse(JSON.stringify(tableData));
    if (typeof parsedTableData[0]["Risk Factors"] === "string") {
      parsedTableData.forEach((item: RiskDataTable) => {
        item["Risk Factors"] = Object.entries(JSON.parse(item["Risk Factors"] as string)).map((item, index) => {
          return <p className="" key={`risk-factors-${item[0]}-${item[1]}`}>{`${item[0]}: ${item[1]}`}</p>
        })
      })
      setTableData(parsedTableData);
    } 
  }

  React.useEffect(() => {
    if (filteredRiskData) {
      console.log("new data", filteredRiskData);
      processTableData();
    }
  }, [filteredRiskData]);

  React.useEffect(() => {
    if (tableData?.length > 0) {
      processRiskFactors();
    }
  }, [tableData]);

  return (
    <div>
      
      <DataTable
        columns={columnData}
        data={tableData}
        fixedHeader
        pagination
        responsive
      />
    </div>
  )
}