import {
  Avatar,
  Button,
  Card,
  Checkbox,
  IconButton,
  Modal,
  Portal,
  Subheading,
  TextInput,
} from "react-native-paper";
import React, { useState, useEffect } from "react";
import { colors } from "./Colors";
import { View } from "react-native";
import { CreateList } from "./Utils";
import { postProduct } from "./ApiManager";

export default function NewProduct(props) {
  const [visible, setVisible] = useState(props.info);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [checked, setChecked] = useState(false);
  const setInfo = props.setInfo;

  useEffect(() => {
    setVisible(props.info);
  }, [props.info]);

  const Add = () => {
    const product = {
      name: name,
      cost: cost,
      duration: duration,
      logs: [],
      lastUpdated: new Date(Date.now()).toISOString(),
      tags: checked ? ["Bonus"] : [],
    };

    props.setProducts((prev) => {
      while (prev.filter((p) => p.name === product.name).length > 0) {
        product.name += "🥄";
      }
      prev.push(product);
      postProduct(product);
      return [...CreateList(prev, props.options)];
    });
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          dismissable={false}
          contentContainerStyle={{ padding: 0, margin: 20 }}
        >
          <Card>
            <Card.Title
              title={"Add Product"}
              left={(props) => <Avatar.Icon {...props} icon="food" />}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={() => {
                    setChecked(false);
                    setInfo("");
                  }}
                />
              )}
              subtitle={"Make sure it's a new one!"}
            />
            <Card.Content style={{ marginTop: 8, marginBottom: 8 }}>
              <TextInput
                style={{ marginBottom: 8 }}
                label={"Name"}
                onChangeText={(text) => {
                  if (text.length < 20) setName(text);
                }}
              />
              <TextInput
                keyboardType="numeric"
                style={{ marginBottom: 8 }}
                label={"Cost"}
                onChangeText={(text) => {
                  if (text.length < 20)
                    setCost(parseFloat(text.replace(",", ".")).toFixed(2));
                }}
              />
              <TextInput
                disabled={checked}
                keyboardType="numeric"
                style={{ marginBottom: 8 }}
                label={"Duration"}
                onChangeText={(text) => {
                  if (text.length < 20)
                    setDuration(parseFloat(text.replace(",", ".")));
                }}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={checked ? "checked" : "unchecked"}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                />
                <Subheading>Bonus Product!</Subheading>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                style={{ width: "96%", marginLeft: "2%", marginRight: "4%" }}
                icon={"content-save"}
                mode={"contained"}
                color={colors.primary}
                onPress={() => {
                  Add();
                  setChecked(false);
                  props.setInfo("");
                }}
              />
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}
