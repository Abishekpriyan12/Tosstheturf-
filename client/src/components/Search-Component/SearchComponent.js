import React,{useState} from "react";

const SearchComponent =  ({searchValue}) =>{
    const [searchData,setSearchData] = useState('')

    const handleInputChange = (e) =>{
        setSearchData(e.target.value)
        searchValue(e.target.value)
    }

    return(
        <div className="search-component">
            <input type="text" value={searchData} onChange={setSearchData} />
        </div>
    )
}
