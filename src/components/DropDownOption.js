export default function DropDownOption({ endpoint, optionText }) {
  return (
    <option value={endpoint}>{optionText}</option>
  )
};