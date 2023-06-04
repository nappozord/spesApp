import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  List,
  ProgressBar,
  Surface,
} from "react-native-paper";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ProductInfo from "./ProductInfo";
import { colors } from "./Colors";
import ListAccordion from "react-native-paper/src/components/List/ListAccordion";
import { CreateList } from "./Utils";
import { postLog, putLog } from "./ApiManager";

export default function ProductList(props) {
  const [productListNotHave, setProductListNotHave] = useState([]);
  const [productListHave, setProductListHave] = useState([]);
  const [productListBonus, setProductListBonus] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [info, setInfo] = useState("");
  const [expanded, setExpanded] = useState({ need: true });

  const pushList = (prev, p, remaining, toBuy) => {
    prev.push(
      <Surface style={styles.surface} key={p.name}>
        <List.Item
          style={{
            padding: 0,
          }}
          onPress={() => {
            setInfo(p.name);
          }}
          title={p.name}
          description={p.cost + "€"}
          left={() => (
            <IconButton
              size={24}
              style={styles.plus}
              onPress={(e) => {
                if (toBuy) {
                  e.stopPropagation();
                  onPress(p, "check");
                }
              }}
              icon={
                toBuy && p.tags.find((t) => t === "Checked") ? "check" : "food"
              }
            />
          )}
          right={() => (
            <>
              <IconButton
                style={styles.plus}
                onPress={(e) => {
                  e.stopPropagation();
                  onPress(p, "remove");
                }}
                size={24}
                icon="minus"
              />
              {toBuy ? (
                <IconButton
                  style={styles.plus}
                  onPress={(e) => {
                    e.stopPropagation();
                    onPress(p, "hold");
                  }}
                  size={24}
                  icon="close"
                />
              ) : (
                <Avatar.Text
                  style={styles.avatar}
                  size={32}
                  label={p.logs.filter((l) => !l.timeOut).length}
                />
              )}
              <IconButton
                style={styles.plus}
                onPress={(e) => {
                  e.stopPropagation();
                  onPress(p, "add");
                }}
                size={24}
                icon="plus"
              />
            </>
          )}
        />
        <ProgressBar
          progress={remaining.percentage >= 0 ? remaining.percentage : 1}
          color={
            remaining.percentage > 1
              ? colors.success
              : remaining.percentage > 0.5
              ? colors.secondary
              : remaining.percentage > 0.2
              ? colors.warning
              : colors.error
          }
        />
      </Surface>
    );

    return [...prev];
  };

  const setList = (products) => {
    setProductListNotHave([]);
    setProductListHave([]);
    setProductListBonus([]);
    setGroceryList([]);

    products.forEach((p) => {
      if (p.list === "In Stock") {
        setProductListHave((prev) => pushList(prev, p, p.remaining));
      } else if (p.list === "Needed") {
        setProductListNotHave((prev) => pushList(prev, p, p.remaining));
      } else if (p.list === "To Buy") {
        setGroceryList((prev) => pushList(prev, p, p.remaining, true));
      } else {
        setProductListBonus((prev) => pushList(prev, p, p.remaining));
      }
    });
  };

  useEffect(() => {
    if (props.filteredProducts.length === 0) {
      setList(props.products);
    }
  }, [props.products]);

  useEffect(() => {
    if (props.filteredProducts.length > 0) {
      setList(props.filteredProducts);
    }
  }, [props.filteredProducts]);

  const onPress = (item, action) => {
    props.setProducts((prev) => {
      let selected = prev.find((prod) => prod.name === item.name);
      selected.lastUpdated = new Date(Date.now()).toISOString();
      let logs = selected.logs.filter((l) => !l.timeOut);

      if (action === "add") {
        const log = {
          timeIn: new Date(Date.now()).toISOString(),
          timeOut: "",
        };
        selected.logs.push(log);
        selected.tags = selected.tags.filter((t) => t !== "Checked");
        postLog(item.name, log);
        return [...CreateList(prev, props.options)];
      } else if (action === "remove" && logs.length > 0) {
        const i = selected.logs.indexOf(logs[0]);
        selected.logs[i].timeOut = new Date(Date.now()).toISOString();
        putLog(item.name, selected.logs[i]);
        return [...CreateList(prev, props.options)];
      } else if (action === "check") {
        if (selected.tags.includes("Checked")) {
          selected.tags = selected.tags.filter((t) => t !== "Checked");
        } else {
          selected.tags.push("Checked");
        }
        return [...CreateList(prev, props.options)];
      } else if (action === "hold") {
        selected.tags.push("Hold");
        return [...CreateList(prev, props.options)];
      }
      return prev;
    });
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Divider style={{ marginTop: 0, marginBottom: 8 }} />
      <ListAccordion
        style={{ paddingBottom: 0, paddingTop: 0 }}
        expanded={expanded.need}
        title={<Chip icon="cart">What to buy</Chip>}
        onPress={() =>
          setExpanded((prev) => {
            prev.need = !prev.need;
            return { ...prev };
          })
        }
      >
        {groceryList}
      </ListAccordion>
      <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      <ListAccordion
        style={{ paddingBottom: 0, paddingTop: 0 }}
        title={<Chip icon="alert-circle">What you need</Chip>}
      >
        {productListNotHave}
      </ListAccordion>
      <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      <ListAccordion
        style={{ paddingBottom: 0, paddingTop: 0 }}
        title={<Chip icon="check-circle">What you have</Chip>}
      >
        {productListHave}
      </ListAccordion>
      <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      <ListAccordion
        style={{ paddingBottom: 0, paddingTop: 0 }}
        title={<Chip icon="beer">Bonus items</Chip>}
      >
        {productListBonus}
      </ListAccordion>
      <Divider style={{ marginTop: 8 }} />
      <ProductInfo
        options={props.options}
        products={props.products}
        setProducts={props.setProducts}
        setInfo={setInfo}
        info={info}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 8,
    elevation: 16,
  },
  plus: {
    marginTop: 10,
    marginLeft: 10,
  },
  avatar: {
    backgroundColor: "#fff",
    marginTop: 12,
  },
  snack: {
    width: "70%",
  },
});
