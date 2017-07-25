const DictionarySelect = ({ elements, label, value, elid, onChange }) => {
  return (
    <div className="select-input">
      <label>{label}</label>
      <select value={value}
              data-elid={elid}
              className="browser-default"
              onChange={onChange}
      >
        <option value="" disabled>Выберите значение...</option>
        {elements.map(elem =>
          <option key={elem.id} value={elem.id}>{elem.name}</option>
        )}
      </select>
    </div>
  )
};

export default DictionarySelect;