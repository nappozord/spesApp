import {
  Avatar,
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  Modal,
  Portal,
  Subheading,
  Text,
  TextInput,
} from "react-native-paper";
import React, { useState, useEffect } from "react";
import { CalculateDiffDays, CalculateRemaining, CreateList } from "./Utils";
import { colors } from "./Colors";
import { deleteProduct, putProduct } from "./ApiManager";

export default function ProductInfo(props) {
  const [visible, setVisible] = useState(props.info);
  const [product, setProduct] = useState();
  const [tempValue, setTempValue] = useState("");
  const [edit, setEdit] = useState("");

  useEffect(() => {
    setTempValue(props.info);
    setVisible(props.info);
    if (props.info) {
      setProduct(props.products.find((p) => p.name === props.info));
    }
  }, [props.info]);

  const UpdateProduct = () => {
    props.setProducts((prev) => {
      const prod = prev.find((p) => p.name === props.info);
      prod[edit] = tempValue;
      putProduct(prod);
      return [...prev];
    });
  };

  const Delete = () => {
    props.setProducts((prev) => {
      prev = prev.filter((p) => p.name !== visible);
      props.setInfo("");
      deleteProduct(visible);
      return [...CreateList(prev, props.options)];
    });
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => props.setInfo("")}
          contentContainerStyle={{ padding: 0, margin: 20 }}
        >
          <Card>
            <Card.Title
              title={
                <>
                  <Text
                    onPress={() => {
                      setEdit("name");
                    }}
                  >
                    {visible}
                  </Text>
                </>
              }
              left={(props) => (
                <Avatar.Icon
                  style={{ backgroundColor: "#fff" }}
                  {...props}
                  icon="food"
                />
              )}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="pencil"
                  onPress={() => {
                    setEdit("name");
                  }}
                />
              )}
              subtitle={
                "Updated: " +
                (product
                  ? new Date(product.lastUpdated).toLocaleDateString()
                  : "")
              }
            />
            <Card.Content style={{ marginTop: 8, marginBottom: 8 }}>
              {product ? (
                <>
                  <Chip
                    icon="information"
                    style={{ marginBottom: 2, marginTop: 2 }}
                  >
                    <Subheading>
                      {"Stock: " +
                        product.logs.filter((l) => !l.timeOut).length}
                    </Subheading>
                  </Chip>
                  <Chip
                    icon="pencil"
                    onPress={() => {
                      setEdit("cost");
                    }}
                    style={{ marginBottom: 2, marginTop: 2 }}
                  >
                    <Subheading>{"Cost: " + product.cost + "€"}</Subheading>
                  </Chip>
                  {product.duration ? (
                    <>
                      <Chip
                        icon="pencil"
                        onPress={() => {
                          setEdit("duration");
                        }}
                        style={{ marginBottom: 2, marginTop: 2 }}
                      >
                        <Subheading>
                          {"Duration: " + product.duration + "d"}
                        </Subheading>
                      </Chip>
                      <Chip
                        icon="information"
                        style={{ marginBottom: 2, marginTop: 2 }}
                      >
                        <Subheading>
                          {"Remaining: " +
                            CalculateRemaining(product).days +
                            "d"}
                        </Subheading>
                      </Chip>
                      <Chip
                        icon="information"
                        style={{ marginBottom: 2, marginTop: 2 }}
                      >
                        <Subheading>{"Tags: " + product.tags}</Subheading>
                      </Chip>
                    </>
                  ) : null}
                </>
              ) : null}
            </Card.Content>
            <Card.Actions>
              <Button
                style={{ width: "96%", margin: "2%" }}
                icon={"delete-forever"}
                mode={"contained"}
                color={"#981c1c"}
                onPress={() => Delete()}
              />
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
      <Portal>
        <Dialog visible={edit} dismissable={false}>
          <Dialog.Title>{"Change " + visible + " " + edit}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              keyboardType={
                edit === "cost" || edit === "duration" ? "numeric" : "default"
              }
              dense
              placeholder={product && edit ? product[edit].toString() : ""}
              onChangeText={(text) => {
                if (text.length < 20) {
                  if (edit === "cost")
                    setTempValue(parseFloat(text.replace(",", ".")).toFixed(2));
                  else if (edit === "duration")
                    setTempValue(parseFloat(text.replace(",", ".")));
                  else setTempValue(text);
                }
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode={"contained"}
              onPress={() => {
                if (edit === "name") setVisible(tempValue);
                setEdit("");
                UpdateProduct();
              }}
              style={{ marginRight: 10, width: "40%" }}
              icon={"content-save"}
            />
            <Button
              mode={"contained"}
              color={colors.error}
              onPress={() => {
                setTempValue("");
                setEdit("");
              }}
              icon={"close"}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
