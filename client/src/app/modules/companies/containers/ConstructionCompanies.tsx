/**
 * @author Abhijit Baldawa
 */

import React, {useEffect, useMemo} from 'react';
import {useFetchOnce} from "../../../shared/hooks/useFetchOnce";
import {Company} from "../../../shared/models/company";
import {COMPANIES_URL} from "../../../shared/constants/apiEndpoints/companies";
import {DataGrid, DataGridColumn} from "../../../shared/components/DataGrid";
import {MultiSelectCheckbox} from "../../../shared/components/UI/MultiSelectCheckBox";

const ConstructionCompanies: React.FC = () => {
  const {data: constructionCompanies = [], loading, error} = useFetchOnce<Company[]>(COMPANIES_URL, "json");

  const columns = useMemo<DataGridColumn<Company>[]>(() => {
    const uniqueSpecialityColumn: string[] = [...new Set(constructionCompanies.map(c => c.speciality))].filter(Boolean);

    return ([
      {
        fieldId: "companyName",
        headerName: "Company",
        width: "2fr",
        sort: true,
        filter: true,
        cell: {
          renderCell: (company) => {
            return (
              <div style={{display: "flex", alignItems: "center"}}>
                <img
                  loading="lazy"
                  alt={company.companyName}
                  style={{width: "32px", height: "32px", marginRight: "0.5rem"}}
                  src={company.companyLogo}
                />
                {company.companyName}
              </div>
            );
          }
        }
      },
      {
        fieldId: "speciality",
        headerName: "Speciality",
        width: "1fr",
        sort: true,
        filter: {
          filterData: (company, checkedSpecialities: string[]) => {
            if(company.speciality) {
              return checkedSpecialities.includes(company.speciality)
            }
            return false;
          },
          renderColumnFilter: (onColumnFilter) => {
            return <MultiSelectCheckbox
              values={uniqueSpecialityColumn}
              selectionText="Select speciality:"
              onSelectionChange={onColumnFilter}
            />;
          }
        }
      },
      {
        fieldId: "country",
        headerName: "Country",
        width: "1fr",
        type: "string", // We can explicitly specify the type of column
        sort: true,
        filter: true,
        cell: {
          renderCell: (company) => {
            return <>{`${company.countryLogo} ${company.country}`}</>;
          }
        }
      }
    ]);
  }, [constructionCompanies]);

  useEffect(() => {
    if(error) {
      /**
       * This should be replaced with an error popup. Adding this here
       * so that we still show user what went wrong
       */
      alert(`Error fetching construction companies list: ${error}`);
    }
  }, [error]);


  return (
    <DataGrid
      fixedHeaderWhenScroll
      columns={columns}
      rows={constructionCompanies}
      getRowId={(row) => row.id}
      loading={loading}
    />
  );
};

export { ConstructionCompanies };
