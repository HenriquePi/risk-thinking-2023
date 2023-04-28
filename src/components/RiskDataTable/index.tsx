import React from 'react';
import DataTable from 'react-data-table-component';
import { RiskData, RiskDataObject } from '../../../risk-data/RiskDataType';

// modify type to allow JSX.Element
type RiskDataTable = RiskDataObject & {
  data: {
    "Risk Factors": {
      [key: string]: number,
    } | JSX.Element,
  }[]
};

type props = {
  riskData: RiskDataTable | null,
  decade: number | null,
}



export const RiskDataTable:React.FC<props> = ({riskData, decade}) => {
  const [columnData, setColumnData] = React.useState<any>([]);
  const [tableData, setTableData] = React.useState<RiskData[] | []>([]);

  
  const [filters, setFilters] = React.useState<string[]>([]);
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [filterType, setFilterType] = React.useState<boolean>(true);

  // process data

  const processTableData = () => {
    let columns = [];
    // set columns
    if (riskData) {
      Object.entries(riskData.data[0]).forEach(([key, value]) => {
        columns.push({
          name: key,
          selector: row => row[key],
          sortable: true,
        })
      })
      setColumnData(columns);
      setTableData(riskData.data);
    }
  }

  const processRiskFactors = () => {
    // modify data for table
    let parsedTableData = JSON.parse(JSON.stringify(tableData));
    if (typeof parsedTableData[0]["Risk Factors"] === "string") {
      parsedTableData.forEach((item: RiskData) => {
        item["Risk Factors"] = Object.entries(JSON.parse(item["Risk Factors"])).map((item, index) => {
          return <p className="" key={`risk-factors-${item[0]}-${item[1]}`}>{`${item[0]}: ${item[1]}`}</p>
        })
      })
      setTableData(parsedTableData);
    } 
  }

  // Filters

  const getFilters = () => {
    // could be optimized
    let filters = [];
    if (riskData) {
      riskData.data.forEach((item) => {
        Object.entries(JSON.parse(item["Risk Factors"])).map(([key, value]) => {
          if (!filters.includes(key)) {
            filters.push(key);
          }
        })
      })
    }
    setFilters(filters);
  }

  const filterContainsSelected = () => {
    let filtering = JSON.parse(JSON.stringify(riskData));
    if (activeFilters.length > 0) {
      let filteredData = filtering?.data.filter((item) => {
        let riskFactors = JSON.parse(item["Risk Factors"]);
        return activeFilters.every((filter) => riskFactors.hasOwnProperty(filter))
      })
      setTableData(filteredData);
    } else {
      setTableData(filtering.data);
    }

  }
  const filterOnlySelected = () => {
    let filtering = JSON.parse(JSON.stringify(riskData));
    if (activeFilters.length > 0) {
      let filteredData = filtering?.data.filter((item) => {
        let riskFactors = JSON.parse(item["Risk Factors"]);
        
        const hasAllActiveFilters = activeFilters.every((filter) => riskFactors.hasOwnProperty(filter));
        const hasNoExtraProperties = Object.keys(riskFactors).length === activeFilters.length;
  
        return hasAllActiveFilters && hasNoExtraProperties;
      });
      setTableData(filteredData);
    } else {
      setTableData(filtering.data);
    }
  };

  React.useEffect(() => {
    if (riskData) {
      getFilters();
      processTableData();
    }
  }, [riskData]);

  React.useEffect(() => {
    if (riskData) {
      filterType ? filterContainsSelected() : filterOnlySelected();
    }
  }, [activeFilters, filterType]);

  React.useEffect(() => {
    if (tableData?.length > 0) {
      processRiskFactors();
    }
  }, [tableData]);

  return (
    <div>
      <div className='flex justify-between gap-2 pt-4'>
        
          <button 
            className={`border rounded-full basis-0 grow border-blue-300`}
            onClick={() => {setFilterType(!filterType)}}
          >
            {filterType ? 'Only Has Selected Risk' : 'Has Selected Risk'}
          </button>
      </div>
      <div className='flex justify-between gap-2 py-4'>
        {filters.map((item, index) => (
          <button 
            key={`${item}-filter`} 
            className={`border rounded-full basis-0 grow ${activeFilters.includes(item) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-red-600 border-red-600'}}`}
            onClick={() => {
              if (activeFilters.includes(item)) {
                setActiveFilters(activeFilters.filter((filter) => filter !== item));
              } else {
                setActiveFilters([...activeFilters, item]);
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>
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