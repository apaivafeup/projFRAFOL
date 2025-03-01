import SelectSearch, { SelectedOptionValue } from 'react-select-search';

interface SelectSearchViewProps {
    selection: string;
    handleSelection: (selectedValue: SelectedOptionValue | SelectedOptionValue[]) => void;
    options: {name: string, value: string}[];
    placeholder: string;
}

function SelectSearchView({selection, handleSelection, options, placeholder}: SelectSearchViewProps) {
  return (
    <SelectSearch onBlur={() => {
      
    }} onFocus={() => {
      
    }} value={selection} search onChange={handleSelection}  options={options}  placeholder={placeholder}/>
  )
}

export default SelectSearchView