import React, { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import NewProduct from "./NewProduct";
import Options from "./Options";
import { uploadCloud } from "./ApiManager";

export default function FABMenu(props) {
  const [state, setState] = useState({ open: false });
  const [plus, setPlus] = useState("");
  const [settings, setSettings] = useState("");

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <>
      <Portal>
        <FAB.Group
          open={open}
          icon={open ? "food" : "plus"}
          actions={[
            {
              style: { backgroundColor: "#fff" },
              icon: "plus",
              onPress: () => {
                setPlus(true);
              },
              small: false,
            },
            {
              style: { backgroundColor: "#fff" },
              icon: "cog",
              small: false,
              onPress: () => {
                setSettings(true);
              },
            },
            {
              style: { backgroundColor: "#fff" },
              icon: "cloud-upload",
              small: false,
              onPress: () => {
                uploadCloud();
              },
            },
            {
              style: { backgroundColor: "#fff" },
              icon: "cloud-sync",
              small: false,
              onPress: () => {},
            },
          ]}
          onStateChange={onStateChange}
        />
      </Portal>
      <NewProduct
        setInfo={setPlus}
        info={plus}
        options={props.options}
        setProducts={props.setProducts}
        products={props.products}
      />
      <Options
        setInfo={setSettings}
        info={settings}
        options={props.options}
        setOptions={props.setOptions}
      />
    </>
  );
}
