import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import makeAnimated from "react-select/animated";
import { api } from "../../main";

const BASE = `/api/course`;

const animatedComponents = makeAnimated();

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
};

const SelectTag = ({ initialValue = [], onSelect }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [allClassName, setAllClassName] = useState([]);
  const [data, setData] = useState([]);

  const fetchAllClasses = useQuery({
    queryKey: ["class-all-fetch"],
    queryFn: async () => {
      const res = await api.get(`${BASE}/course-all`);
      return res.data;
    },
  });

  useEffect(() => {
    if (fetchAllClasses.isSuccess) {
      const classData = fetchAllClasses.data.classes;
      const newData = classData.map((item) => ({
        value: item.name,
        label: item.name,
        isFixed: false,
      }));
      setAllClassName(newData);
      setData(newData); // Assuming you want to initialize with the first 4 items
    }
  }, [fetchAllClasses.isSuccess]);

  const orderOptions = (values) => {
    return values
      .filter((v) => v.isFixed)
      .concat(values.filter((v) => !v.isFixed));
  };

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = data.filter((v) => v.isFixed);
        break;
    }

    setSelectedValues(orderOptions(newValue));
    onSelect && onSelect(orderOptions(newValue));
  };

  return (
    <div>
      <Select
        value={selectedValues}
        isMulti
        styles={styles}
        isClearable={selectedValues.some((v) => !v.isFixed)}
        name="Courses"
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={onChange}
        options={data}
        closeMenuOnSelect={false}
        components={animatedComponents}
        placeholder="Select Class"
      />
    </div>
  );
};

export default SelectTag;
