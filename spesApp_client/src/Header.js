import { Appbar, Chip } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { CalculateNext } from "./Utils";

export default function Header(props) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(CalculateNext(props.products));
  }, [props.products]);

  return (
    <Appbar.Header style={styles.top}>
      <Appbar.Action icon="basket" onPress={() => {}} />
      <Appbar.Content title="SpesAPP" subtitle="Manage your groceries" />
      <Chip style={{ marginRight: 8 }}>{total + "€"}</Chip>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  top: {
    width: "100%",
    left: 0,
    right: 0,
  },
});
