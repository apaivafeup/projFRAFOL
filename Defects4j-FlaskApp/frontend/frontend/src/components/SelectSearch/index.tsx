import SelectSearchView from './SelectSearch.view'
import { SelectedOptionValue } from 'react-select-search';
import { useCallback } from 'react';

interface SelectSearchProps {
    selection: string;
    handleSelection: (string: string) => void;
    options: {name: string, value: string}[];
    placeholder: string;
}

function SelectSearch( {selection, handleSelection, options, placeholder}: SelectSearchProps) {

  const onNewSelection = useCallback((selectedValue: SelectedOptionValue | SelectedOptionValue[]) => {
    if (Array.isArray(selectedValue)) {
      handleSelection(selectedValue[0].toString());
    } else {
      handleSelection(selectedValue.toString());
    }
  }, [handleSelection]);
  return (
    <SelectSearchView 
        selection={selection}
        handleSelection={onNewSelection}
        options={options}
        placeholder={placeholder}
    />
  )
}

export default SelectSearch