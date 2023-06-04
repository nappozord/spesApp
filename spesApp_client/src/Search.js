import {Searchbar} from "react-native-paper";
import React, {useState} from 'react';

export default function Search(props){

  return(
    <Searchbar
      style={{padding: 4}}
      placeholder="Search"
      onChangeText={(text) => {
        props.setFilteredProducts(text.toLowerCase())
      }}
    />
  )
}
