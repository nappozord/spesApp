import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Header from "./Header";
import ProductList from "./ProductList";
import FABMenu from "./FABMenu";
import Search from "./Search";
import { Caption, Subheading, Title } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { CreateList } from "./Utils";
import { getOptions, getProducts, getToken, putOptions } from "./ApiManager";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState(false);
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState();
  const [filteredProducts, setFilteredProducts] = useState("");
  const [logged, setLogged] = useState(false);

  const onRefresh = () => {
    setRef(true);
    AsyncStorage.getItem("options")
      .then((ops) => {
        if (ops) {
          setOptions(JSON.parse(ops));
          AsyncStorage.getItem("products")
            .then((prods) => {
              if (prods) {
                setProducts(CreateList(JSON.parse(prods), JSON.parse(ops)));
              }
              setRef(false);
              setLoading(false);
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getToken(setLogged);
  }, []);

  useEffect(() => {
    if (logged) onRefresh();
  }, [logged]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("options", JSON.stringify(options));
      putOptions(options);
      setProducts([...CreateList(products, options)]);
    }
  }, [options]);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Title style={{ width: "100%", textAlign: "center" }}>
              SpesAPP
            </Title>
            <Subheading style={{ width: "100%", textAlign: "center" }}>
              Manage your groceries
            </Subheading>
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size={64}
              color={"#fff"}
            />
            <Caption style={{ width: "100%", textAlign: "center" }}>
              Loading...
            </Caption>
          </View>
        ) : (
          <>
            <Header products={products} options={options} />
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={ref} onRefresh={onRefresh} />
              }
            >
              <ProductList
                products={products}
                filteredProducts={products.filter((p) =>
                  p.name.toLowerCase().includes(filteredProducts)
                )}
                setProducts={setProducts}
                options={options}
                setOptions={setOptions}
              />
            </ScrollView>
            <Search setFilteredProducts={setFilteredProducts} />
            <FABMenu
              options={options}
              setOptions={setOptions}
              products={products}
              setProducts={setProducts}
            />
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#141414",
  },
});
